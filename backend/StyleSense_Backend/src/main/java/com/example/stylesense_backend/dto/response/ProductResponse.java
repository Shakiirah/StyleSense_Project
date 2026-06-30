package com.example.stylesense_backend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ProductResponse {
    public Long id;
    public String name;
    public String description;
    public BigDecimal price;
    public String imageUrl;
    public String category;
    public String gender;
    public String color;
    public String pattern;
    public String style;
    public String occasions;
    public String season;
    public int stockQuantity;
}
