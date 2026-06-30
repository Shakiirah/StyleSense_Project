package com.example.stylesense_backend.controller;

import com.example.stylesense_backend.dto.request.RecommendationRequest;
import com.example.stylesense_backend.dto.response.RecommendationResponse;
import com.example.stylesense_backend.model.User;
import com.example.stylesense_backend.repository.UserRepository;
import com.example.stylesense_backend.service.ImageAnalysisService;
import com.example.stylesense_backend.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
class RecommendationController {

    private final RecommendationService recommendationService;
    private final ImageAnalysisService imageAnalysisService;
    private final UserRepository userRepository;

    // POST /api/recommendations/generate
    // Body: { "occasion": "work", "weather": "mild", "budgetRange": "medium" }
    @PostMapping("/generate")
    public ResponseEntity<RecommendationResponse> generate(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody RecommendationRequest request) {

        User user = getUser(userDetails);
        return ResponseEntity.ok(recommendationService.generateRecommendation(user, request));
    }

    @GetMapping("/history")
    public ResponseEntity<List<RecommendationResponse>> history(
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = getUser(userDetails);
        return ResponseEntity.ok(recommendationService.getRecommendationHistory(user));
    }

    // POST /api/recommendations/upload-outfit
    // Multipart: image file
    @PostMapping(value = "/upload-outfit", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<RecommendationResponse> uploadOutfit(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("image") MultipartFile image) throws IOException {

        User user = getUser(userDetails);
        return ResponseEntity.ok(imageAnalysisService.analyzeAndRecommend(image, user));
    }

    private User getUser(UserDetails userDetails) {
        if (userDetails == null) {
            return null;
        }

        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
