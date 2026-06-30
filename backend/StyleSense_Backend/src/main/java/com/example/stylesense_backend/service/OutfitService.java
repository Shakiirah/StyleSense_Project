package com.example.stylesense_backend.service;

import com.example.stylesense_backend.dto.response.RecommendationResponse;
import com.example.stylesense_backend.model.User;

import java.util.List;
import com.example.stylesense_backend.dto.response.ProductResponse;
import com.example.stylesense_backend.exception.ResourceNotFoundException;
import com.example.stylesense_backend.model.Outfit;
import com.example.stylesense_backend.model.SavedOutfit;
import com.example.stylesense_backend.repository.OutfitRepository;
import com.example.stylesense_backend.repository.SavedOutfitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OutfitService {

    private final SavedOutfitRepository savedOutfitRepository;
    private final OutfitRepository outfitRepository;
    private final ProductService productService;

    public List<RecommendationResponse> getSavedOutfits(User user) {
        return savedOutfitRepository.findByUserId(user.getId()).stream()
                .map(so -> toResponse(so.getOutfit()))
                .collect(Collectors.toList());
    }

    public void saveOutfit(User user, Long outfitId) {
        if (savedOutfitRepository.existsByUserIdAndOutfitId(user.getId(), outfitId)) return;

        Outfit outfit = outfitRepository.findById(outfitId)
                .orElseThrow(() -> new ResourceNotFoundException("Outfit not found"));

        savedOutfitRepository.save(SavedOutfit.builder().user(user).outfit(outfit).build());
    }

    public void unsaveOutfit(User user, Long outfitId) {
        savedOutfitRepository.deleteByUserIdAndOutfitId(user.getId(), outfitId);
    }

    private RecommendationResponse toResponse(Outfit outfit) {
        List<ProductResponse> tops = filterItems(outfit, "tops");
        List<ProductResponse> bottoms = filterItems(outfit, "bottoms");
        List<ProductResponse> shoes = filterItems(outfit, "shoes");
        List<ProductResponse> accessories = filterItems(outfit, "accessories");

        return RecommendationResponse.builder()
                .outfitId(outfit.getId())
                .outfitName(outfit.getName())
                .occasion(outfit.getOccasion())
                .stylingExplanation(outfit.getStylingExplanation())
                .top(tops)
                .bottom(bottoms)
                .shoes(shoes)
                .accessories(accessories)
                .build();
    }

    private List<ProductResponse> filterItems(Outfit outfit, String role) {
        if (outfit.getItems() == null) return List.of();
        return outfit.getItems().stream()
                .filter(item -> role.equals(item.getRole()))
                .map(item -> productService.toResponse(item.getProduct()))
                .collect(Collectors.toList());
    }
}


