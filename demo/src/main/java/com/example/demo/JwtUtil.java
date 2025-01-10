package com.example.demo;

import org.springframework.stereotype.Component;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private final String SECRET_KEY = "your_secret_key_your_secret_key_your_secret_key"; // Must be at least 32 characters
    private final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes()); // Generate a secure key

    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 )) // 1 min
                .signWith(key, SignatureAlgorithm.HS256) // Use the secure key
                .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key) // Use the secure key
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public Claims decodeToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key) // Use the secure key
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(key) // Use the secure key
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
