package com.genspark.authbackend.service.impl;
import com.genspark.authbackend.dto.LoginRequest;
import com.genspark.authbackend.dto.LoginResponse;
import com.genspark.authbackend.util.JwtUtil;
import com.genspark.authbackend.dto.ApiResponse;
import com.genspark.authbackend.dto.RegisterRequest;
import com.genspark.authbackend.entity.Role;
import com.genspark.authbackend.entity.User;
import com.genspark.authbackend.repository.UserRepository;
import com.genspark.authbackend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.genspark.authbackend.dto.ForgotPasswordRequest;
import com.genspark.authbackend.dto.ForgotPasswordResponse;
import com.genspark.authbackend.entity.PasswordResetToken;
import com.genspark.authbackend.repository.PasswordResetTokenRepository;
import com.genspark.authbackend.dto.ResetPasswordRequest;
import com.genspark.authbackend.dto.ProfileResponse;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    @Override
public ApiResponse register(RegisterRequest request) {

    if (userRepository.existsByUsername(request.getUsername())) {
        return new ApiResponse(false, "Username already exists");
    }

    if (userRepository.existsByEmail(request.getEmail())) {
        return new ApiResponse(false, "Email already exists");
    }

    if (userRepository.existsByMobile(request.getMobile())) {
        return new ApiResponse(false, "Mobile already exists");
    }

    User user = User.builder()
            .name(request.getName())
            .username(request.getUsername())
            .email(request.getEmail())
            .mobile(request.getMobile())
            .password(passwordEncoder.encode(request.getPassword()))
            .avatar(null)
            .bio("")
            .emailVerified(false)
            .mobileVerified(false)
            .role(Role.USER)
            .build();

    userRepository.save(user);

    return new ApiResponse(true, "Registration Successful");
}
    @Override
public LoginResponse login(LoginRequest request) {

    User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Invalid Email or Password"));

    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
        throw new RuntimeException("Invalid Email or Password");
    }

    String token = jwtUtil.generateToken(user.getEmail());

    return new LoginResponse(token, "Login Successful");
}
@Override
public ForgotPasswordResponse forgotPassword(ForgotPasswordRequest request) {

    User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Email not found"));

    String token = UUID.randomUUID().toString();

    PasswordResetToken resetToken = PasswordResetToken.builder()
            .email(user.getEmail())
            .token(token)
            .expiryTime(LocalDateTime.now().plusMinutes(15))
            .used(false)
            .build();

    passwordResetTokenRepository.save(resetToken);

    return new ForgotPasswordResponse(
            true,
            "Password reset token generated successfully",
            token
    );
}
@Override
public ApiResponse resetPassword(ResetPasswordRequest request) {

    PasswordResetToken resetToken = passwordResetTokenRepository
            .findByToken(request.getToken())
            .orElseThrow(() -> new RuntimeException("Invalid reset token"));

    if (resetToken.isUsed()) {
        return new ApiResponse(false, "Reset token already used");
    }

    if (resetToken.getExpiryTime().isBefore(LocalDateTime.now())) {
        return new ApiResponse(false, "Reset token expired");
    }

    User user = userRepository.findByEmail(resetToken.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));

    user.setPassword(passwordEncoder.encode(request.getNewPassword()));

    userRepository.save(user);

    resetToken.setUsed(true);

    passwordResetTokenRepository.save(resetToken);

    return new ApiResponse(true, "Password changed successfully");
}
@Override
public ProfileResponse getProfile(String email) {

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    return ProfileResponse.builder()
            .id(user.getId())
            .name(user.getName())
            .username(user.getUsername())
            .email(user.getEmail())
            .mobile(user.getMobile())
            .avatar(user.getAvatar())
            .bio(user.getBio())
            .posts(0)
            .followers(0)
            .following(0)
            .build();
}
}