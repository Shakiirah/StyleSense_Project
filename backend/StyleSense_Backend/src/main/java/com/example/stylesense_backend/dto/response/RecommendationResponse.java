package com.example.stylesense_backend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class RecommendationResponse {
    public Long outfitId;
    public String outfitName;
    public String occasion;
    public String stylingExplanation;  // From OpenAI
    public String createdAt;
    public List<ProductResponse> dresses;
    public List<ProductResponse> top;
    public List<ProductResponse> bottom;
    public List<ProductResponse> shoes;
    public List<ProductResponse> accessories;
}

