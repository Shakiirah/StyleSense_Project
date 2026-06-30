package com.example.stylesense_backend.controller;

import com.example.stylesense_backend.dto.request.UpdateProfileRequest;
import com.example.stylesense_backend.dto.response.UserResponse;
import com.example.stylesense_backend.model.User;
import com.example.stylesense_backend.repository.UserRepository;
import com.example.stylesense_backend.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    // GET /api/user/profile
    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = getUser(userDetails);
        return ResponseEntity.ok(userService.toResponse(user));
    }

    // PUT /api/user/profile
    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UpdateProfileRequest request) {
        User user = getUser(userDetails);
        return ResponseEntity.ok(userService.updateProfile(user, request));
    }

    private User getUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}