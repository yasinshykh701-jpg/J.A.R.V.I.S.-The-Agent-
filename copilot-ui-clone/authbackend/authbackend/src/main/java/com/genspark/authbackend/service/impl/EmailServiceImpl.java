package com.genspark.authbackend.service.impl;

import com.genspark.authbackend.entity.EmailOtp;
import com.genspark.authbackend.repository.EmailOtpRepository;
import com.genspark.authbackend.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final EmailOtpRepository emailOtpRepository;
    private final JavaMailSender mailSender;

    @Override
    public void sendOtp(String email) {

        String otp = String.format("%06d", new Random().nextInt(1000000));

        EmailOtp emailOtp = EmailOtp.builder()
                .email(email)
                .otp(otp)
                .expiryTime(LocalDateTime.now().plusMinutes(5))
                .verified(false)
                .build();

        emailOtpRepository.save(emailOtp);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("GenSpark Email Verification");
        message.setText(
                "Hello,\n\n" +
                "Your OTP is: " + otp +
                "\n\nThis OTP is valid for 5 minutes.\n\n" +
                "Thank you,\nGenSpark Team"
        );

        mailSender.send(message);
    }
}