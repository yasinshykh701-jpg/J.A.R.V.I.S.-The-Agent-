package com.genspark.authbackend.service;
import com.genspark.authbackend.dto.ForgotPasswordRequest;
import com.genspark.authbackend.dto.ForgotPasswordResponse;
import com.genspark.authbackend.dto.ApiResponse;
import com.genspark.authbackend.dto.LoginRequest;
import com.genspark.authbackend.dto.LoginResponse;
import com.genspark.authbackend.dto.RegisterRequest;
import com.genspark.authbackend.dto.ResetPasswordRequest;
import com.genspark.authbackend.dto.ProfileResponse;

public interface UserService {

    ApiResponse register(RegisterRequest request);

    LoginResponse login(LoginRequest request);

    ForgotPasswordResponse forgotPassword(ForgotPasswordRequest request);

    ApiResponse resetPassword(ResetPasswordRequest request);

    ProfileResponse getProfile(String email);
}