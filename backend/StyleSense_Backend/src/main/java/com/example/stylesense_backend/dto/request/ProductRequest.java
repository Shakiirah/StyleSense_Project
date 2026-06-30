package com.example.stylesense_backend.dto.request;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Data
public class ProductRequest {
    @NotBlank public String name;
    public String description;
    @NotNull  public BigDecimal price;
    public String imageUrl;
    @NotBlank public String category;
    public String gender;
    public String color;
    public String pattern;
    public String style;
    public String bodyTypeSuitable;
    public String occasions;
    public String season;
    @Min(0) public int stockQuantity;
}

