package com.example.stylesense_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "outfit_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OutfitItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "outfit_id")
    private Outfit outfit;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private String role; // "top", "bottom", "shoes", "accessory", "dress"
}

