package com.example.stylesense_backend.dto.request;
import jakarta.validation.constraints.*;
import lombok.*;
@Data
public class UpdateProfileRequest {
    public String firstName;
    public String lastName;
    public String bodyType;
    public String gender;
    public String stylePreference;
    public String budgetRange;
    public String preferredColors;
    public String preferredOccasions;
}

