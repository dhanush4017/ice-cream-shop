package com.icytales.backend.service;

import com.icytales.backend.dto.auth.LoginRequest;
import com.icytales.backend.dto.auth.RegisterRequest;
import com.icytales.backend.entity.User;
import com.icytales.backend.repository.UserRepository;
import com.icytales.backend.security.AuthTokenService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.Map;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final AuthTokenService tokens;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthService(UserRepository userRepository, AuthTokenService tokens) {
        this.userRepository = userRepository; this.tokens = tokens;
    }

    public Map<String, Object> register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        String userId = request.getUserId().trim();
        if (userRepository.existsByEmailIgnoreCase(email)) throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
        if (userRepository.existsByUserIdIgnoreCase(userId)) throw new ResponseStatusException(HttpStatus.CONFLICT, "User ID is already taken");
        User user = new User();
        user.setName(request.getName().trim()); user.setEmail(email); user.setUserId(userId);
        user.setPassword(passwordEncoder.encode(request.getPassword())); user.setRole("CUSTOMER");
        userRepository.save(user);
        return Map.of("success", true, "message", "Registration successful");
    }

    public Map<String, Object> login(LoginRequest request) {
        String login = request.getLogin().trim();
        User user = userRepository.findByEmailIgnoreCaseOrUserIdIgnoreCase(login, login)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email/user ID or password"));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword()))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email/user ID or password");
        String token = tokens.create(user);
        return Map.of("success", true, "message", "Login successful", "token", token,
                "user", Map.of("name", user.getName(), "email", user.getEmail(), "userId", user.getUserId(), "role", user.getRole()));
    }
}
