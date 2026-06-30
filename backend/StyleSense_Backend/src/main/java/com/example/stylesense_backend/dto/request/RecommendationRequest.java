package com.example.stylesense_backend.dto.request;

import lombok.Data;

@Data
public class RecommendationRequest {
    private String occasion;
    private String weather;
    private String budgetRange;
    private String gender;
    private String bodyType;
    private String style;
    private String source;
}

