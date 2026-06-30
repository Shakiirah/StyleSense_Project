package com.example.stylesense_backend.service;

import com.example.stylesense_backend.dto.response.RecommendationResponse;
import com.example.stylesense_backend.model.User;
import org.springframework.web.multipart.MultipartFile;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ImageAnalysisService {

    private final OpenAIService openAIService;
    private final RecommendationService recommendationService;

    @Value("${app.upload.dir}")
    private String uploadDir;

    public RecommendationResponse analyzeAndRecommend(MultipartFile image, User user)
            throws IOException {

        validateImage(image);

        byte[] imageBytes = image.getBytes();
        String base64Image = Base64.getEncoder().encodeToString(imageBytes);
        String mimeType = image.getContentType();

        log.info("Analysing uploaded image: size={}KB, type={}",
                imageBytes.length / 1024, mimeType);

        Map<String, String> imageAttributes = openAIService.analyzeClothingImage(base64Image, mimeType);

        log.info("GPT-4o extracted attributes: {}", imageAttributes);

        saveImageToDisk(image, user.getId());

        return recommendationService.generateFromImageAttributes(user, imageAttributes);
    }

    private void validateImage(MultipartFile image) {
        if (image.isEmpty()) {
            throw new IllegalArgumentException("Image file is empty");
        }

        String contentType = image.getContentType();
        if (contentType == null ||
                !List.of("image/jpeg", "image/jpg", "image/png", "image/webp").contains(contentType)) {
            throw new IllegalArgumentException("Only JPEG, PNG, and WebP images are supported");
        }

        if (image.getSize() > 10 * 1024 * 1024) {
            throw new IllegalArgumentException("Image must be smaller than 10MB");
        }
    }

    private void saveImageToDisk(MultipartFile image, Long userId) {
        try {
            Path uploadPath = Paths.get(uploadDir, "users", userId.toString());
            Files.createDirectories(uploadPath);

            String filename = "upload_" + System.currentTimeMillis() + "_"
                    + image.getOriginalFilename();
            Files.write(uploadPath.resolve(filename), image.getBytes());

        } catch (IOException e) {
            log.warn("Could not save uploaded image to disk: {}", e.getMessage());
        }
    }
}


