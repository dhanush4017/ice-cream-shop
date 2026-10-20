
package com.icytales.backend.security;

import com.icytales.backend.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthTokenService {

    public record Session(
            Long userId,
            String email,
            String role,
            String userIdValue
    ) {}

    @Value("${JWT_SECRET:}")
    private String jwtSecret;

    @Value("${JWT_EXPIRATION_MS:86400000}")
    private long expirationMs;

    private SecretKey key;

    private final Set<String> revokedTokens =
            ConcurrentHashMap.newKeySet();

    @PostConstruct
    public void init() {
        if (jwtSecret == null || jwtSecret.isBlank()) {
            throw new IllegalStateException("JWT_SECRET is missing");
        }

        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);

        if (keyBytes.length < 32) {
            throw new IllegalStateException(
                    "JWT_SECRET must contain at least 32 bytes"
            );
        }

        key = Keys.hmacShaKeyFor(keyBytes);
    }

    public String create(User user) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .id(UUID.randomUUID().toString())
                .subject(String.valueOf(user.getId()))
                .claim("email", user.getEmail())
                .claim("role", user.getRole())
                .claim("userIdValue", user.getUserId())
                .issuedAt(now)
                .expiration(expiry)
                .signWith(key)
                .compact();
    }

    public Session resolve(String token) {
        if (token == null || token.isBlank()) {
            return null;
        }

        try {
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            if (revokedTokens.contains(claims.getId())) {
                return null;
            }

            return new Session(
                    Long.valueOf(claims.getSubject()),
                    claims.get("email", String.class),
                    claims.get("role", String.class),
                    claims.get("userIdValue", String.class)
            );

        } catch (Exception e) {
            return null;
        }
    }

    public void revoke(String token) {
        if (token == null || token.isBlank()) {
            return;
        }

        try {
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            revokedTokens.add(claims.getId());

        } catch (Exception ignored) {
            // Invalid or expired token
        }
    }
}
