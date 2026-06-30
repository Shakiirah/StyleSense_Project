package com.example.stylesense_backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String firstName;

    private String lastName;

    private String bodyType;
    private String gender;
    private String stylePreference;
    private String budgetRange;
    private String preferredColors;
    private String preferredOccasions;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default                          // ← fixes Builder ignoring the default
    private Role role = Role.USER;

    @Column(nullable = false)
    @Builder.Default                          // ← fixes Builder ignoring the default
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<SavedOutfit> savedOutfits;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Order> orders;

    public enum Role {
        USER, ADMIN
    }
}