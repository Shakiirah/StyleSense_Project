package com.example.stylesense_backend.service;

import com.example.stylesense_backend.model.Product;
import com.example.stylesense_backend.model.User;

import java.util.Map;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OpenAIService {

    @Value("${openai.api.key}")
    private String apiKey;

    @Value("${openai.api.url}")
    private String apiUrl;

    @Value("${openai.model}")
    private String model;

    private final WebClient.Builder webClientBuilder;
    private final ObjectMapper objectMapper;

    // ─── TEXT: Generate styling explanation for preference-based outfits ───
    public String generateStylingExplanation(
            Map<String, Product> items, User user, String occasion, String weather) {

        String itemSummary = items.entrySet().stream()
                .map(e -> e.getKey() + ": " + e.getValue().getName()
                        + " (" + e.getValue().getColor() + ", " + e.getValue().getStyle() + ")")
                .collect(Collectors.joining("; "));

        String prompt = String.format("""
                You are an expert fashion stylist. Explain in 3-4 concise sentences why this outfit
                combination works well together, referencing colour harmony, style cohesion, and
                occasion appropriateness.

                User profile: Body type = %s, Style preference = %s
                Occasion: %s | Weather: %s
                Outfit items: %s

                Write the explanation as advice directly to the user. Be specific, warm, and practical.
                """,
                user != null ? user.getBodyType() : "guest",
                user != null ? user.getStylePreference() : "not specified",
                occasion, weather, itemSummary
        );

        return callOpenAIText(prompt);
    }

    // ─── TEXT: Generate explanation for image-matched outfits ───────────────
    public String generateImageMatchExplanation(
            Map<String, String> imageAttributes, Map<String, Product> matchedItems, String occasion) {

        String uploadedDesc = String.format("a %s %s (%s, %s style)",
                imageAttributes.getOrDefault("color", ""),
                imageAttributes.getOrDefault("category", "item"),
                imageAttributes.getOrDefault("pattern", ""),
                imageAttributes.getOrDefault("style", "")
        );

        String matchedSummary = matchedItems.entrySet().stream()
                .map(e -> e.getKey() + ": " + e.getValue().getName())
                .collect(Collectors.joining("; "));

        String prompt = String.format("""
                You are an expert fashion stylist. The user has uploaded a photo of %s.
                These items have been selected to complement it: %s

                In 3-4 sentences, explain why these pieces pair well with the uploaded item,
                covering colour harmony, style compatibility, and occasion suitability for: %s.
                Speak directly to the user in a warm, helpful tone.
                """,
                uploadedDesc, matchedSummary, occasion
        );

        return callOpenAIText(prompt);
    }

    // ─── VISION: Analyse uploaded clothing image using GPT-4o Vision ───────
    public Map<String, String> analyzeClothingImage(String base64Image, String mimeType) {
        String systemPrompt = """
                You are a fashion analysis AI. Analyse the clothing item in the image and return
                ONLY a valid JSON object with exactly these keys:
                - category: one of [tops, bottoms, dresses, shoes, accessories, outerwear]
                - color: the primary color as a single word (e.g. navy, white, black, beige)
                - pattern: one of [solid, striped, floral, denim, plaid, printed, checked]
                - style: one of [casual, formal, sporty, bohemian, classic]
                - occasion: comma-separated list from [casual, work, evening, wedding, sport, beach]

                Return only the JSON. No markdown, no explanation, no code blocks.
                """;

        String userMessage = "Analyse this clothing item and return the JSON as instructed.";

        ObjectNode requestBody = objectMapper.createObjectNode();
        requestBody.put("model", model);
        requestBody.put("max_tokens", 200);

        ArrayNode messages = requestBody.putArray("messages");

        ObjectNode systemMsg = messages.addObject();
        systemMsg.put("role", "system");
        systemMsg.put("content", systemPrompt);

        ObjectNode userMsg = messages.addObject();
        userMsg.put("role", "user");
        ArrayNode content = userMsg.putArray("content");

        ObjectNode textPart = content.addObject();
        textPart.put("type", "text");
        textPart.put("text", userMessage);

        ObjectNode imagePart = content.addObject();
        imagePart.put("type", "image_url");
        ObjectNode imageUrl = imagePart.putObject("image_url");
        imageUrl.put("url", "data:" + mimeType + ";base64," + base64Image);
        imageUrl.put("detail", "low");

        try {
            String responseBody = webClientBuilder.build()
                    .post()
                    .uri(apiUrl)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode root = objectMapper.readTree(responseBody);
            String jsonContent = root
                    .path("choices").get(0)
                    .path("message").path("content").asText();

            JsonNode attributes = objectMapper.readTree(jsonContent.trim());
            Map<String, String> result = new HashMap<>();
            attributes.fields().forEachRemaining(e -> result.put(e.getKey(), e.getValue().asText()));
            return result;

        } catch (Exception e) {
            log.error("GPT-4o Vision analysis failed: {}", e.getMessage());
            return Map.of(
                    "category", "tops",
                    "color", "neutral",
                    "pattern", "solid",
                    "style", "casual",
                    "occasion", "casual"
            );
        }
    }

    // ─── Internal: Plain text OpenAI call ───────────────────────────────────
    private String callOpenAIText(String userPrompt) {
        ObjectNode requestBody = objectMapper.createObjectNode();
        requestBody.put("model", model);
        requestBody.put("max_tokens", 300);
        requestBody.put("temperature", 0.7);

        ArrayNode messages = requestBody.putArray("messages");
        ObjectNode msg = messages.addObject();
        msg.put("role", "user");
        msg.put("content", userPrompt);

        try {
            String responseBody = webClientBuilder.build()
                    .post()
                    .uri(apiUrl)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode root = objectMapper.readTree(responseBody);
            return root.path("choices").get(0)
                    .path("message").path("content").asText("No explanation available.");

        } catch (Exception e) {
            log.error("OpenAI text call failed: {}", e.getMessage());
            return "This is a well-coordinated outfit tailored to your preferences and occasion.";
        }
    }
}


