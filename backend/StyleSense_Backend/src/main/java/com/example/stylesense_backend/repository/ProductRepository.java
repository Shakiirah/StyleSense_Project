package com.example.stylesense_backend.repository;

import com.example.stylesense_backend.model.Product;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
 public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByActiveTrue();

    @Query("SELECT p FROM Product p WHERE p.active = true AND LOWER(p.category) = LOWER(:category)")
    List<Product> findByCategoryAndActiveTrue(@Param("category") String category);

    // Find products matching multiple criteria for recommendation engine
    @Query("""
    SELECT p FROM Product p
    WHERE p.active = true
      AND (:category IS NULL OR LOWER(p.category) = LOWER(:category))
      AND (:gender IS NULL OR LOWER(p.gender) = LOWER(:gender) OR LOWER(p.gender) = 'unisex')
      AND (
            :style IS NULL
            OR LOWER(p.style) = LOWER(:style)
            OR LOWER(p.style) IN ('classic', 'elegant', 'casual', 'cozy', 'glam', 'formal')
          )
      AND (:color IS NULL OR LOWER(p.color) = LOWER(:color))
    """)
    List<Product> findByFilters(
            @Param("category") String category,
            @Param("gender") String gender,
            @Param("style") String style,
            @Param("color") String color
    );

    // Full text search
    @Query("""
        SELECT p FROM Product p
        WHERE p.active = true
          AND (LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%'))
            OR LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')))
        """)
    List<Product> searchProducts(@Param("query") String query);

    // Occasion-based search (using LIKE since occasions is comma-separated)
    @Query("SELECT p FROM Product p WHERE p.active = true AND LOWER(p.occasions) LIKE LOWER(CONCAT('%', :occasion, '%'))")
    List<Product> findByOccasion(@Param("occasion") String occasion);
}

