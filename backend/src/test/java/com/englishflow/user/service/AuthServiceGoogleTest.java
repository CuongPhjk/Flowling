package com.englishflow.user.service;

import com.englishflow.common.exception.AppException;
import com.englishflow.common.exception.ErrorCode;
import com.englishflow.security.JwtTokenProvider;
import com.englishflow.user.dto.AuthResponse;
import com.englishflow.user.dto.GoogleAuthRequest;
import com.englishflow.user.entity.User;
import com.englishflow.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceGoogleTest {

    private static final String CLIENT_ID = "test-google-client.apps.googleusercontent.com";

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtTokenProvider tokenProvider;
    @Mock private JwtDecoder googleJwtDecoder;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = new AuthService(userRepository, passwordEncoder, tokenProvider, googleJwtDecoder);
        ReflectionTestUtils.setField(authService, "googleClientId", CLIENT_ID);
    }

    @Test
    void createsUserAndIssuesApplicationTokenForVerifiedGoogleCredential() {
        when(googleJwtDecoder.decode("google-id-token")).thenReturn(googleJwt(CLIENT_ID));
        when(userRepository.findByEmail("reader@gmail.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("encoded-random-password");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(42L);
            return user;
        });
        when(tokenProvider.generateToken(42L, "reader@gmail.com", "ROLE_USER"))
                .thenReturn("flowling-jwt");

        GoogleAuthRequest request = new GoogleAuthRequest();
        request.setCredential("google-id-token");
        AuthResponse response = authService.googleLogin(request);

        assertThat(response.getToken()).isEqualTo("flowling-jwt");
        assertThat(response.getEmail()).isEqualTo("reader@gmail.com");
        assertThat(response.getFullName()).isEqualTo("Flow Reader");
        assertThat(response.getAvatarUrl()).isEqualTo("https://example.com/avatar.png");
        assertThat(response.getRole()).isEqualTo("ROLE_USER");
    }

    @Test
    void rejectsCredentialIssuedForAnotherOAuthClient() {
        when(googleJwtDecoder.decode("wrong-audience-token"))
                .thenReturn(googleJwt("another-client.apps.googleusercontent.com"));

        GoogleAuthRequest request = new GoogleAuthRequest();
        request.setCredential("wrong-audience-token");

        assertThatThrownBy(() -> authService.googleLogin(request))
                .isInstanceOfSatisfying(AppException.class,
                        exception -> assertThat(exception.getErrorCode())
                                .isEqualTo(ErrorCode.INVALID_CREDENTIALS));
        verifyNoInteractions(userRepository, tokenProvider);
    }

    private Jwt googleJwt(String audience) {
        Instant now = Instant.now();
        return Jwt.withTokenValue("token")
                .header("alg", "RS256")
                .issuer("https://accounts.google.com")
                .subject("google-subject-123")
                .audience(List.of(audience))
                .issuedAt(now)
                .expiresAt(now.plusSeconds(300))
                .claim("email", "reader@gmail.com")
                .claim("email_verified", true)
                .claim("name", "Flow Reader")
                .claim("picture", "https://example.com/avatar.png")
                .build();
    }
}
