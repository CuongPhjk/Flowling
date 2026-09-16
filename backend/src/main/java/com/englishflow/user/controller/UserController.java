package com.englishflow.user.controller;

import com.englishflow.common.dto.ApiResponse;
import com.englishflow.security.UserPrincipal;
import com.englishflow.user.dto.UserProfileResponse;
import com.englishflow.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getProfile(@AuthenticationPrincipal UserPrincipal principal) {
        UserProfileResponse profile = userService.getProfile(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(profile));
    }
}
