package com.icytales.backend.service;

import com.icytales.backend.dto.auth.LoginRequest;
import com.icytales.backend.dto.auth.RegisterRequest;
import com.icytales.backend.entity.User;
import com.icytales.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Map<String, Object> register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        String userId = request.getUserId().trim();

        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
        }
        if (userRepository.existsByUserIdIgnoreCase(userId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User ID is already taken");
        }

        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(email);
        user.setUserId(userId);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);

        return Map.of("success", true, "message", "Registration successful");
    }

    public Map<String, Object> login(LoginRequest request) {
        String login = request.getLogin().trim();
        User user = userRepository.findByEmailIgnoreCaseOrUserIdIgnoreCase(login, login)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email/user ID or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email/user ID or password");
        }

        return Map.of(
                "success", true,
                "message", "Login successful",
                "user", Map.of("name", user.getName(), "email", user.getEmail(), "userId", user.getUserId())
        );
    }
}
