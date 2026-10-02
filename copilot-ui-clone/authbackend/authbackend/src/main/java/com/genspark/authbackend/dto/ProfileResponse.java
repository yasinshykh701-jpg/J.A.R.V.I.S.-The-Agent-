package com.genspark.authbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileResponse {

    private Long id;

    private String name;

    private String username;

    private String email;

    private String mobile;

    private String avatar;

    private String bio;

    private int posts;

    private int followers;

    private int following;
}