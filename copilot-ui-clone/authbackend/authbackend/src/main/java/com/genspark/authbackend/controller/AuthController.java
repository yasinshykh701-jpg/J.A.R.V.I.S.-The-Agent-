package com.genspark.authbackend.controller;
import com.genspark.authbackend.service.EmailService;
import com.genspark.authbackend.dto.ApiResponse;
import com.genspark.authbackend.dto.LoginRequest;
import com.genspark.authbackend.dto.LoginResponse;
import com.genspark.authbackend.dto.RegisterRequest;
import com.genspark.authbackend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.genspark.authbackend.dto.ForgotPasswordRequest;
import com.genspark.authbackend.dto.ForgotPasswordResponse;
import com.genspark.authbackend.dto.ResetPasswordRequest;
import java.security.Principal;
import com.genspark.authbackend.dto.ProfileResponse;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "https://ais-dev-tqfidbwndhqzlceixp5bho-995723187031.asia-southeast1.run.app", "https://ais-pre-tqfidbwndhqzlceixp5bho-995723187031.asia-southeast1.run.app"})
public class AuthController {

    private final UserService userService;
    private final EmailService emailService;

    @PostMapping("/register")
    public ApiResponse register(@Valid @RequestBody RegisterRequest request) {
        return userService.register(request);
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return userService.login(request);
    }

    @PostMapping("/send-email-otp")
public ApiResponse sendEmailOtp(@RequestParam String email) {

    emailService.sendOtp(email);

    return new ApiResponse(true, "OTP sent successfully");
}
@PostMapping("/forgot-password")
public ForgotPasswordResponse forgotPassword(
        @Valid @RequestBody ForgotPasswordRequest request) {

    return userService.forgotPassword(request);
}
@PostMapping("/reset-password")
public ApiResponse resetPassword(
        @Valid @RequestBody ResetPasswordRequest request) {

    return userService.resetPassword(request);
}
@GetMapping("/profile")
public String profile(Principal principal) {

    if (principal == null) {
        return "Principal is NULL";
    }

    return "Logged in as: " + principal.getName();
}
}