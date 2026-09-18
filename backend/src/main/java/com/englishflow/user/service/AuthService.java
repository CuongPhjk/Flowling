package com.englishflow.user.service;

import com.englishflow.common.exception.AppException;
import com.englishflow.common.exception.ErrorCode;
import com.englishflow.security.JwtTokenProvider;
import com.englishflow.user.dto.AuthRequest;
import com.englishflow.user.dto.AuthResponse;
import com.englishflow.user.dto.GoogleAuthRequest;
import com.englishflow.user.dto.RegisterRequest;
import com.englishflow.user.entity.User;
import com.englishflow.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final JwtDecoder googleJwtDecoder;

    @Value("${google.client-id:}")
    private String googleClientId;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new AppException(ErrorCode.USER_ALREADY_EXISTS);
        }

        User user = User.builder()
                .email(request.getEmail().toLowerCase().trim())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName().trim())
                .role("ROLE_USER")
                .currentStreak(1)
                .totalXp(0)
                .build();

        user = userRepository.save(user);

        String token = tokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole());

        return toAuthResponse(user, token);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_CREDENTIALS));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS);
        }

        String token = tokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole());

        return toAuthResponse(user, token);
    }

    @Transactional
    public AuthResponse googleLogin(GoogleAuthRequest request) {
        if (googleClientId == null || googleClientId.isBlank()) {
            throw new AppException(ErrorCode.BAD_REQUEST, "Google Sign-In is not configured on the server");
        }

        final Jwt googleToken;
        try {
            googleToken = googleJwtDecoder.decode(request.getCredential());
        } catch (JwtException exception) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS, "Google credential is invalid or expired");
        }

        String issuer = googleToken.getIssuer() == null ? "" : googleToken.getIssuer().toString();
        boolean validIssuer = "https://accounts.google.com".equals(issuer) || "accounts.google.com".equals(issuer);
        boolean validAudience = googleToken.getAudience().contains(googleClientId);
        Boolean emailVerified = googleToken.getClaim("email_verified");
        String email = googleToken.getClaimAsString("email");
        String subject = googleToken.getSubject();

        if (!validIssuer || !validAudience || !Boolean.TRUE.equals(emailVerified)
                || email == null || email.isBlank() || subject == null || subject.isBlank()) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS, "Google credential could not be verified");
        }

        String normalizedEmail = email.toLowerCase().trim();
        String hostedDomain = googleToken.getClaimAsString("hd");
        boolean googleAuthoritative = normalizedEmail.endsWith("@gmail.com")
                || (hostedDomain != null && !hostedDomain.isBlank());

        User user = userRepository.findByEmail(normalizedEmail).map(existing -> {
            if (existing.getGoogleSubject() != null && !existing.getGoogleSubject().equals(subject)) {
                throw new AppException(ErrorCode.INVALID_CREDENTIALS, "Google account does not match this user");
            }
            if (existing.getGoogleSubject() == null && !googleAuthoritative) {
                throw new AppException(ErrorCode.INVALID_CREDENTIALS,
                        "Sign in with your password once before linking this Google email");
            }
            existing.setGoogleSubject(subject);
            updateGoogleProfile(existing, googleToken);
            return userRepository.save(existing);
        }).orElseGet(() -> {
            String fullName = googleToken.getClaimAsString("name");
            User created = User.builder()
                    .email(normalizedEmail)
                    .passwordHash(passwordEncoder.encode(java.util.UUID.randomUUID().toString()))
                    .fullName(fullName == null || fullName.isBlank() ? normalizedEmail.split("@")[0] : fullName.trim())
                    .avatarUrl(googleToken.getClaimAsString("picture"))
                    .googleSubject(subject)
                    .role("ROLE_USER")
                    .currentStreak(0)
                    .totalXp(0)
                    .build();
            return userRepository.save(created);
        });

        String token = tokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole());
        return toAuthResponse(user, token);
    }

    private void updateGoogleProfile(User user, Jwt googleToken) {
        String name = googleToken.getClaimAsString("name");
        String picture = googleToken.getClaimAsString("picture");
        if ((user.getFullName() == null || user.getFullName().isBlank()) && name != null && !name.isBlank()) {
            user.setFullName(name.trim());
        }
        if (picture != null && !picture.isBlank()) {
            user.setAvatarUrl(picture);
        }
    }

    public AuthResponse toAuthResponse(User user, String token) {
        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .avatarUrl(user.getAvatarUrl())
                .currentStreak(user.getCurrentStreak())
                .totalXp(user.getTotalXp())
                .build();
    }
}
