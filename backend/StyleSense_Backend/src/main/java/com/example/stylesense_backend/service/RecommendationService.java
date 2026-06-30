package com.example.stylesense_backend.service;

import com.example.stylesense_backend.dto.request.RecommendationRequest;
import com.example.stylesense_backend.dto.response.ProductResponse;
import com.example.stylesense_backend.dto.response.RecommendationResponse;
import com.example.stylesense_backend.model.*;
import com.example.stylesense_backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RecommendationService {

    private final ProductRepository productRepository;
    private final OutfitRepository outfitRepository;
    private final RecommendationHistoryRepository historyRepository;
    private final OpenAIService openAIService;

    public RecommendationResponse generateRecommendation(User user, RecommendationRequest request) {

        String occasion = request.getOccasion() != null
                ? request.getOccasion()
                : "casual";

        String weather = request.getWeather() != null
                ? request.getWeather()
                : "mild";

        String budget = request.getBudgetRange() != null
                ? request.getBudgetRange()
                : (user != null ? user.getBudgetRange() : "$50 - $100");

        String gender = request.getGender();

        if (gender == null || gender.isBlank()) {
            gender = user != null ? user.getGender() : null;
        }

        gender = normalizeGender(gender);

        String stylePreference = request.getStyle();

        if (stylePreference == null || stylePreference.isBlank()) {
            stylePreference = user != null ? user.getStylePreference() : null;
        }

        List<String> requiredCategories = occasionToCategoryRule(occasion, weather, gender);

        Map<String, List<Product>> categoryCandidates = new HashMap<>();

        for (String category : requiredCategories) {
            List<Product> candidates = productRepository.findByFilters(
                    category,
                    gender,
                    stylePreference,
                    null
            );

            candidates = candidates.stream()
                    .filter(p -> matchesOccasion(p, occasion))
                    .collect(Collectors.toList());

            if (user != null) {
                candidates = scoreAndRank(candidates, user);
            }

            if (candidates.isEmpty()) {
                candidates = productRepository.findByFilters(
                        category,
                        gender,
                        null,
                        null
                );

                candidates = candidates.stream()
                        .filter(p -> matchesOccasion(p, occasion))
                        .collect(Collectors.toList());
            }

            if (candidates.isEmpty()) {
                candidates = productRepository.findByFilters(
                        category,
                        "unisex",
                        null,
                        null
                );

                candidates = candidates.stream()
                        .filter(p -> matchesOccasion(p, occasion))
                        .collect(Collectors.toList());
            }

            categoryCandidates.put(category, candidates);
        }

        Map<String, Product> selectedItems = new HashMap<>();

        for (Map.Entry<String, List<Product>> entry : categoryCandidates.entrySet()) {
            if (!entry.getValue().isEmpty()) {
                List<Product> topCandidates = entry.getValue().stream()
                        .limit(Math.min(4, entry.getValue().size()))
                        .collect(Collectors.toList());

                selectedItems.put(
                        entry.getKey(),
                        topCandidates.get(new Random().nextInt(topCandidates.size()))
                );
            }
        }

        String explanation;

        try {
            explanation = openAIService.generateStylingExplanation(
                    selectedItems, user, occasion, weather
            );
        } catch (Exception e) {
            log.warn("AI explanation failed, using default explanation: {}", e.getMessage());

            explanation = "This outfit was selected based on your gender, occasion, weather, budget, and style preferences.";
        }

        Outfit outfit;

        if (user != null) {
            outfit = buildAndSaveOutfit(selectedItems, explanation, occasion, "PREFERENCE");
            saveToHistory(user, outfit, "PREFERENCE");
        } else {
            outfit = Outfit.builder()
                    .name("StyleSense " + capitalize(occasion) + " Look")
                    .occasion(occasion)
                    .stylingExplanation(explanation)
                    .sourceType("PREFERENCE")
                    .build();
        }

        return buildResponse(outfit, selectedItems, explanation, occasion);
    }

    public RecommendationResponse generateFromImageAttributes(
            User user, Map<String, String> imageAttributes) {

        String uploadedCategory = imageAttributes.getOrDefault("category", "");
        String uploadedColor = imageAttributes.getOrDefault("color", "");
        String uploadedStyle = imageAttributes.getOrDefault("style", "casual");
        String uploadedOccasion = imageAttributes.getOrDefault("occasion", "casual");

        List<String> complementaryCategories = getComplementaryCategories(uploadedCategory);

        Map<String, Product> selectedItems = new HashMap<>();

        String gender = user != null ? normalizeGender(user.getGender()) : null;

        List<Product> uploadedCategoryMatches = productRepository.findByFilters(
                uploadedCategory,
                gender,
                uploadedStyle,
                uploadedColor
        );

        if (!uploadedCategoryMatches.isEmpty()) {
            selectedItems.put(uploadedCategory, uploadedCategoryMatches.get(0));
        }

        for (String category : complementaryCategories) {
            List<Product> candidates = productRepository.findByFilters(
                    category,
                    gender,
                    uploadedStyle,
                    null
            );

            candidates = candidates.stream()
                    .filter(p -> matchesOccasion(p, uploadedOccasion))
                    .collect(Collectors.toList());

            candidates = scoreByColorHarmony(candidates, uploadedColor);

            if (!candidates.isEmpty()) {
                selectedItems.put(category, candidates.get(0));
            }
        }

        String explanation = openAIService.generateImageMatchExplanation(
                imageAttributes, selectedItems, uploadedOccasion
        );

        Outfit outfit = buildAndSaveOutfit(selectedItems, explanation, uploadedOccasion, "IMAGE_UPLOAD");
        saveToHistory(user, outfit, "IMAGE_UPLOAD");

        return buildResponse(outfit, selectedItems, explanation, uploadedOccasion);
    }

    public List<RecommendationResponse> getRecommendationHistory(User user) {
        return historyRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(RecommendationHistory::getOutfit)
                .filter(Objects::nonNull)
                .map(this::buildResponseFromOutfit)
                .collect(Collectors.toList());
    }

    private List<String> occasionToCategoryRule(String occasion, String weather, String gender) {
        String normalizedOccasion = normalizeOccasion(occasion);

        return switch (normalizedOccasion) {
            case "work", "business", "work/office" ->
                    List.of("Tops", "Bottoms", "Outerwear", "Shoes", "Accessories");

            case "evening", "formal", "wedding", "party", "date night" -> {
                if ("female".equalsIgnoreCase(gender)) {
                    yield List.of("Dresses", "Tops", "Bottoms", "Shoes", "Accessories");
                }

                yield List.of("Tops", "Bottoms", "Shoes");
            }

            case "casual", "everyday", "vacation" ->
                    List.of("Tops", "Bottoms", "Shoes");

            case "sport", "gym", "gym/sports" ->
                    List.of("Tops", "Bottoms", "Shoes");

            case "beach" ->
                    List.of("Tops", "Bottoms", "Accessories");

            default ->
                    List.of("Tops", "Bottoms", "Shoes", "Accessories");
        };
    }

    private boolean matchesOccasion(Product product, String occasion) {
        if (product.getOccasions() == null) {
            return true;
        }

        String productOccasions = product.getOccasions().toLowerCase();
        String normalizedOccasion = normalizeOccasion(occasion);

        if (productOccasions.contains(normalizedOccasion)) {
            return true;
        }

        return switch (normalizedOccasion) {
            case "work/office" ->
                    productOccasions.contains("work") || productOccasions.contains("formal");

            case "gym/sports" ->
                    productOccasions.contains("sport") || productOccasions.contains("gym");

            case "date night" ->
                    productOccasions.contains("date") ||
                            productOccasions.contains("party") ||
                            productOccasions.contains("formal");

            case "everyday" ->
                    productOccasions.contains("everyday") || productOccasions.contains("casual");

            default -> false;
        };
    }

    private String normalizeOccasion(String occasion) {
        return occasion == null ? "casual" : occasion.toLowerCase().trim();
    }

    private String normalizeGender(String gender) {
        if (gender == null || gender.isBlank()) {
            return null;
        }

        String value = gender.toLowerCase().trim();

        if (value.equals("female") || value.equals("women") || value.equals("womens")) {
            return "female";
        }

        if (value.equals("male") || value.equals("men") || value.equals("mens")) {
            return "male";
        }

        return "unisex";
    }

    private List<String> getComplementaryCategories(String uploadedCategory) {
        return switch (uploadedCategory.toLowerCase()) {
            case "tops" -> List.of("Bottoms", "Shoes", "Accessories");
            case "bottoms" -> List.of("Tops", "Shoes", "Accessories");
            case "dresses" -> List.of("Shoes", "Accessories");
            case "shoes" -> List.of("Tops", "Bottoms");
            default -> List.of("Tops", "Bottoms", "Shoes", "Accessories");
        };
    }

    private List<Product> scoreAndRank(List<Product> products, User user) {
        return products.stream()
                .sorted(Comparator.comparingInt(p -> -scoreProduct(p, user)))
                .collect(Collectors.toList());
    }

    private int scoreProduct(Product product, User user) {
        int score = 0;

        if (user.getPreferredColors() != null && product.getColor() != null) {
            if (Arrays.asList(user.getPreferredColors().split(",")).contains(product.getColor())) {
                score += 3;
            }
        }

        if (user.getBodyType() != null && product.getBodyTypeSuitable() != null) {
            if (product.getBodyTypeSuitable().contains(user.getBodyType())) {
                score += 2;
            }
        }

        if (user.getStylePreference() != null &&
                user.getStylePreference().equalsIgnoreCase(product.getStyle())) {
            score += 2;
        }

        return score;
    }

    private List<Product> scoreByColorHarmony(List<Product> products, String baseColor) {
        if (baseColor == null) {
            return products;
        }

        Map<String, List<String>> colorPairs = Map.of(
                "navy", List.of("white", "cream", "grey", "light blue"),
                "black", List.of("white", "red", "grey", "gold"),
                "white", List.of("navy", "black", "beige", "pastels"),
                "grey", List.of("white", "black", "navy", "burgundy"),
                "beige", List.of("white", "brown", "navy", "olive")
        );

        List<String> harmonious = colorPairs.getOrDefault(baseColor.toLowerCase(), List.of());

        return products.stream()
                .sorted(Comparator.comparingInt(p ->
                        p.getColor() != null && harmonious.contains(p.getColor().toLowerCase()) ? 0 : 1
                ))
                .collect(Collectors.toList());
    }

    private Outfit buildAndSaveOutfit(
            Map<String, Product> items,
            String explanation,
            String occasion,
            String sourceType) {

        List<OutfitItem> outfitItems = items.entrySet().stream()
                .map(e -> OutfitItem.builder()
                        .product(e.getValue())
                        .role(e.getKey())
                        .build())
                .collect(Collectors.toList());

        Outfit outfit = Outfit.builder()
                .name("StyleSense " + capitalize(occasion) + " Look")
                .occasion(occasion)
                .stylingExplanation(explanation)
                .sourceType(sourceType)
                .build();

        outfit = outfitRepository.save(outfit);

        for (OutfitItem item : outfitItems) {
            item.setOutfit(outfit);
        }

        outfit.setItems(outfitItems);

        return outfitRepository.save(outfit);
    }

    private void saveToHistory(User user, Outfit outfit, String requestType) {
        historyRepository.save(
                RecommendationHistory.builder()
                        .user(user)
                        .outfit(outfit)
                        .requestType(requestType)
                        .build()
        );
    }

    private RecommendationResponse buildResponse(
            Outfit outfit,
            Map<String, Product> items,
            String explanation,
            String occasion) {

        return RecommendationResponse.builder()
                .outfitId(outfit.getId())
                .outfitName(outfit.getName())
                .occasion(occasion)
                .stylingExplanation(explanation)
                .createdAt(outfit.getCreatedAt() != null ? outfit.getCreatedAt().toString() : null)
                .dresses(toProductResponseList(getItem(items, "Dresses")))
                .top(toProductResponseList(getItem(items, "Tops")))
                .bottom(toProductResponseList(getItem(items, "Bottoms")))
                .shoes(toProductResponseList(getItem(items, "Shoes")))
                .accessories(toProductResponseList(getItem(items, "Accessories")))
                .build();
    }

    private RecommendationResponse buildResponseFromOutfit(Outfit outfit) {
        Map<String, Product> items = outfit.getItems() == null
                ? Map.of()
                : outfit.getItems().stream()
                  .filter(item -> item.getProduct() != null)
                  .collect(Collectors.toMap(
                          OutfitItem::getRole,
                          OutfitItem::getProduct,
                          (first, second) -> first
                  ));

        return buildResponse(
                outfit,
                items,
                outfit.getStylingExplanation(),
                outfit.getOccasion()
        );
    }

    private Product getItem(Map<String, Product> items, String category) {
        return items.entrySet().stream()
                .filter(entry -> entry.getKey().equalsIgnoreCase(category))
                .map(Map.Entry::getValue)
                .findFirst()
                .orElse(null);
    }

    private List<ProductResponse> toProductResponseList(Product product) {
        if (product == null) return List.of();

        return List.of(ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .price(product.getPrice())
                .imageUrl(product.getImageUrl())
                .category(product.getCategory())
                .color(product.getColor())
                .style(product.getStyle())
                .build());
    }

    private String capitalize(String s) {
        return s == null || s.isEmpty()
                ? s
                : Character.toUpperCase(s.charAt(0)) + s.substring(1);
    }
}