package com.example.stylesense_backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;
@Data
public class LoginRequest {
    @Email(message = "Invalid email format")
    @NotBlank
    public String email;

    @NotBlank
    public String password;
}
