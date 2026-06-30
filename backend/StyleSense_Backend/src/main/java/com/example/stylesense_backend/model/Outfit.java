package com.example.stylesense_backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "outfits")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Outfit {        // ← must have public here

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String occasion;

    @Column(columnDefinition = "TEXT")
    private String stylingExplanation;

    private String sourceType;

    @OneToMany(mappedBy = "outfit", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<OutfitItem> items;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}

