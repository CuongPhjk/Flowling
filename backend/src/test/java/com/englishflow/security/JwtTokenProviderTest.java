package com.englishflow.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenProviderTest {

    private JwtTokenProvider tokenProvider;
    private final String secret = "9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b";
    private final long expirationMs = 3600000; // 1 hour

    @BeforeEach
    void setUp() {
        tokenProvider = new JwtTokenProvider(secret, expirationMs);
    }

    @Test
    void testGenerateAndValidateToken() {
        Long userId = 42L;
        String email = "minh@flowling.demo";
        String role = "ROLE_USER";

        String token = tokenProvider.generateToken(userId, email, role);
        assertNotNull(token);
        assertTrue(tokenProvider.validateToken(token));

        assertEquals(userId, tokenProvider.extractUserId(token));
        assertEquals(email, tokenProvider.extractEmail(token));
        assertEquals(role, tokenProvider.extractRole(token));
    }

    @Test
    void testInvalidToken() {
        assertFalse(tokenProvider.validateToken("invalid.token.here"));
    }
}
