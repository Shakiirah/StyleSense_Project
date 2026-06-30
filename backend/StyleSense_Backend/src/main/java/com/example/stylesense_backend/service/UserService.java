package com.example.stylesense_backend.service;

import com.example.stylesense_backend.dto.request.UpdateProfileRequest;
import com.example.stylesense_backend.dto.response.UserResponse;
import com.example.stylesense_backend.model.User;

import com.example.stylesense_backend.exception.ResourceNotFoundException;
import com.example.stylesense_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserResponse updateProfile(User user, UpdateProfileRequest request) {
        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        if (request.getBodyType() != null) user.setBodyType(request.getBodyType());
        if (request.getGender() != null) user.setGender(request.getGender());
        if (request.getStylePreference() != null) user.setStylePreference(request.getStylePreference());
        if (request.getBudgetRange() != null) user.setBudgetRange(request.getBudgetRange());
        if (request.getPreferredColors() != null) user.setPreferredColors(request.getPreferredColors());
        if (request.getPreferredOccasions() != null) user.setPreferredOccasions(request.getPreferredOccasions());

        return toResponse(userRepository.save(user));
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    public UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .bodyType(user.getBodyType())
                .gender(user.getGender())
                .stylePreference(user.getStylePreference())
                .budgetRange(user.getBudgetRange())
                .preferredColors(user.getPreferredColors())
                .preferredOccasions(user.getPreferredOccasions())
                .role(user.getRole().name())
                .build();
    }
}


