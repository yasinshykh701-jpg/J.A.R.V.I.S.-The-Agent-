package com.genspark.authbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ForgotPasswordResponse {

    private boolean success;
    private String message;
    private String resetToken;

}