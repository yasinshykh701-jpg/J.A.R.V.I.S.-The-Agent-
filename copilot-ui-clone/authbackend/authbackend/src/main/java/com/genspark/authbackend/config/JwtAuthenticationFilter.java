package com.genspark.authbackend.config;

import com.genspark.authbackend.service.CustomUserDetailsService;
import com.genspark.authbackend.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

   @Override
protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
) throws ServletException, IOException {

    System.out.println("===== JWT FILTER =====");

    String authHeader = request.getHeader("Authorization");
    System.out.println("Header = " + authHeader);

    if (authHeader != null && authHeader.startsWith("Bearer ")) {

        String token = authHeader.substring(7);
        System.out.println("Token = " + token);

        if (jwtUtil.isTokenValid(token)) {

            String email = jwtUtil.extractEmail(token);
            System.out.println("Email = " + email);

        } else {
            System.out.println("Invalid Token");
        }
    }

    filterChain.doFilter(request, response);
}
}