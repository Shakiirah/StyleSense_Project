package com.example.stylesense_backend.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponse {
    public Long id;
    public String email;
    public String firstName;
    public String lastName;
    public String bodyType;
    public String gender;
    public String stylePreference;
    public String budgetRange;
    public String preferredColors;
    public String preferredOccasions;
    public String role;
}

