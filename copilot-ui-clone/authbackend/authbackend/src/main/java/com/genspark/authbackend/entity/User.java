package com.genspark.authbackend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Full Name
    @Column(nullable = false)
    private String name;

    // Username
    @Column(nullable = false, unique = true)
    private String username;

    // Email
    @Column(nullable = false, unique = true)
    private String email;

    // Mobile
    @Column(nullable = false, unique = true)
    private String mobile;

    // Password
    @Column(nullable = false)
    private String password;

    // Avatar URL or Image Path
    @Column
    private String avatar;

    // Bio
    @Column(length = 300)
    private String bio;

    // Email Verified
    @Column(name = "email_verified", nullable = false)
    private boolean emailVerified = false;

    // Mobile Verified
    @Column(name = "mobile_verified", nullable = false)
    private boolean mobileVerified = false;

    // Role
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;
}