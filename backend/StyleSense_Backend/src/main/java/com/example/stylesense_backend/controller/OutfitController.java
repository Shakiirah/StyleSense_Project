package com.example.stylesense_backend.controller;
import com.example.stylesense_backend.dto.response.RecommendationResponse;
import com.example.stylesense_backend.model.User;
import com.example.stylesense_backend.repository.UserRepository;
import com.example.stylesense_backend.service.*;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/outfits")
@RequiredArgsConstructor
class OutfitController {

    private final OutfitService outfitService;
    private final UserRepository userRepository;

    // GET /api/outfits/saved
    @GetMapping("/saved")
    public ResponseEntity<List<RecommendationResponse>> getSaved(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = getUser(userDetails);
        return ResponseEntity.ok(outfitService.getSavedOutfits(user));
    }

    // POST /api/outfits/save/{outfitId}
    @PostMapping("/save/{outfitId}")
    public ResponseEntity<Void> save(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long outfitId) {
        outfitService.saveOutfit(getUser(userDetails), outfitId);
        return ResponseEntity.ok().build();
    }

    // DELETE /api/outfits/save/{outfitId}
    @DeleteMapping("/save/{outfitId}")
    public ResponseEntity<Void> unsave(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long outfitId) {
        outfitService.unsaveOutfit(getUser(userDetails), outfitId);
        return ResponseEntity.ok().build();
    }

    private User getUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}

