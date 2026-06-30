package com.example.stylesense_backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    private String imageUrl;

    // Classification attributes — used by recommendation engine
    @Column(nullable = false)
    private String category;       // tops, bottoms, shoes, accessories, dresses, outerwear

    private String gender;         // male, female, unisex

    private String color;          // primary color: "navy", "white", "black"

    private String pattern;        // solid, striped, floral, denim, plaid, printed

    private String style;          // casual, formal, sporty, bohemian, classic

    private String bodyTypeSuitable; // comma-separated: "hourglass,pear"

    private String occasions;        // comma-separated: "work,casual,evening,wedding"

    private String season;           // spring, summer, autumn, winter, all

    private int stockQuantity;

    private boolean active = true;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}

