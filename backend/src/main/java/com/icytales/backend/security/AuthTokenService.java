package com.icytales.backend.security;

import com.icytales.backend.entity.User;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthTokenService {
    public record Session(Long userId, String email, String role, String userIdValue) {}
    private final Map<String, Session> sessions = new ConcurrentHashMap<>();

    public String create(User user) {
        String token = UUID.randomUUID().toString();
        sessions.put(token, new Session(user.getId(), user.getEmail(), user.getRole(), user.getUserId()));
        return token;
    }

    public Session resolve(String token) {
        return token == null ? null : sessions.get(token);
    }

    public void revoke(String token) {
        if (token != null) sessions.remove(token);
    }
}
