package com.example.stylesense_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "recommendation_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecommendationHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "outfit_id")
    private Outfit outfit;

    private String requestType;   // "PREFERENCE", "IMAGE_UPLOAD"
    private String feedback;      // "liked", "disliked", null
    private LocalDateTime createdAt = LocalDateTime.now();
}


