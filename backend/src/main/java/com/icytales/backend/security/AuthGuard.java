package com.icytales.backend.security;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class AuthGuard {
    private final AuthTokenService tokens;
    public AuthGuard(AuthTokenService tokens) { this.tokens = tokens; }

    public AuthTokenService.Session requireUser(HttpServletRequest request) {
        AuthTokenService.Session session = session(request);
        if (session == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Please log in");
        return session;
    }

    public AuthTokenService.Session requireAdmin(HttpServletRequest request) {
        AuthTokenService.Session session = requireUser(request);
        if (!"ADMIN".equalsIgnoreCase(session.role())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin access required");
        }
        return session;
    }

    public AuthTokenService.Session session(HttpServletRequest request) {
        String auth = request.getHeader("Authorization");
        if (auth == null || !auth.startsWith("Bearer ")) return null;
        return tokens.resolve(auth.substring(7).trim());
    }
}
