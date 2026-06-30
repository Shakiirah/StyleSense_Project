package com.example.stylesense_backend.service;

import com.example.stylesense_backend.dto.request.ProductRequest;
import com.example.stylesense_backend.dto.response.ProductResponse;
import com.example.stylesense_backend.exception.ResourceNotFoundException;
import com.example.stylesense_backend.model.Product;
import com.example.stylesense_backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<ProductResponse> getAllActive() {
        return productRepository.findByActiveTrue().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ProductResponse getById(Long id) {
        return toResponse(findById(id));
    }

    public List<ProductResponse> getByCategory(String category) {
        return productRepository.findByCategoryAndActiveTrue(category).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> search(String query) {
        return productRepository.searchProducts(query).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ProductResponse create(ProductRequest request) {
        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .imageUrl(request.getImageUrl())
                .category(request.getCategory())
                .gender(request.getGender())
                .color(request.getColor())
                .pattern(request.getPattern())
                .style(request.getStyle())
                .bodyTypeSuitable(request.getBodyTypeSuitable())
                .occasions(request.getOccasions())
                .season(request.getSeason())
                .stockQuantity(request.getStockQuantity())
                .active(true)
                .build();
        return toResponse(productRepository.save(product));
    }

    public ProductResponse update(Long id, ProductRequest request) {
        Product product = findById(id);
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setImageUrl(request.getImageUrl());
        product.setCategory(request.getCategory());
        product.setGender(request.getGender());
        product.setColor(request.getColor());
        product.setPattern(request.getPattern());
        product.setStyle(request.getStyle());
        product.setBodyTypeSuitable(request.getBodyTypeSuitable());
        product.setOccasions(request.getOccasions());
        product.setSeason(request.getSeason());
        product.setStockQuantity(request.getStockQuantity());
        return toResponse(productRepository.save(product));
    }

    public void delete(Long id) {
        Product product = findById(id);
        product.setActive(false); // soft delete — keeps historical data intact
        productRepository.save(product);
    }

    // ── Reusable by other services (e.g. OutfitService) ──────────
    public ProductResponse toResponse(Product p) {
        return ProductResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .description(p.getDescription())
                .price(p.getPrice())
                .imageUrl(p.getImageUrl())
                .category(p.getCategory())
                .gender(p.getGender())
                .color(p.getColor())
                .pattern(p.getPattern())
                .style(p.getStyle())
                .occasions(p.getOccasions())
                .season(p.getSeason())
                .stockQuantity(p.getStockQuantity())
                .build();
    }

    // ── Private helper ────────────────────────────────────────────
    private Product findById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }
}

