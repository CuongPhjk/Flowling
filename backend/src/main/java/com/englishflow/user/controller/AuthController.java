package com.englishflow.user.controller;

import com.englishflow.common.dto.ApiResponse;
import com.englishflow.security.UserPrincipal;
import com.englishflow.user.dto.AuthRequest;
import com.englishflow.user.dto.AuthResponse;
import com.englishflow.user.dto.GoogleAuthRequest;
import com.englishflow.user.dto.RegisterRequest;
import com.englishflow.user.dto.UserProfileResponse;
import com.englishflow.user.service.AuthService;
import com.englishflow.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(ApiResponse.ok("Registration successful", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
    }

    @PostMapping("/google")
    public ResponseEntity<ApiResponse<AuthResponse>> googleLogin(@Valid @RequestBody GoogleAuthRequest request) {
        AuthResponse response = authService.googleLogin(request);
        return ResponseEntity.ok(ApiResponse.ok("Google login successful", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getCurrentUser(@AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Not authenticated"));
        }
        UserProfileResponse profile = userService.getProfile(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(profile));
    }
}
