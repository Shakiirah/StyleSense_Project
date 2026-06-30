package com.example.stylesense_backend.dto.request;

import jakarta.validation.constraints.Email;
import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class RegisterRequest {
    @NotBlank
    public String firstName;

    public String lastName;

    @Email
    @NotBlank
    public String email;

    @NotBlank
    @Size(min = 8, message = "Password must be at least 8 characters")
    public String password;
}

