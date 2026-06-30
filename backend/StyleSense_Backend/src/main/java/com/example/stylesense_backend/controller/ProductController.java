package com.example.stylesense_backend.controller;
import com.example.stylesense_backend.dto.response.ProductResponse;
import com.example.stylesense_backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
class ProductController {

    private final ProductService productService;

    // GET /api/products/public/all  — no auth required
    @GetMapping("/public/all")
    public ResponseEntity<List<ProductResponse>> getAllPublic() {
        return ResponseEntity.ok(productService.getAllActive());
    }

    // GET /api/products/public/search?q=blue+dress
    @GetMapping("/public/search")
    public ResponseEntity<List<ProductResponse>> search(@RequestParam("q") String query) {
        return ResponseEntity.ok(productService.search(query));
    }

    // GET /api/products/public/{id}
    @GetMapping("/public/{id}")
    public ResponseEntity<ProductResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getById(id));
    }

    // GET /api/products/public/category/{category}
    @GetMapping("/public/category/{category}")
    public ResponseEntity<List<ProductResponse>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(productService.getByCategory(category));
    }
}
