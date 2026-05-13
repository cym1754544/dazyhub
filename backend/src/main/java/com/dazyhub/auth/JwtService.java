package com.dazyhub.auth;

import com.dazyhub.user.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
  private final SecretKey key;
  private final long expirationMs;

  public JwtService(
      @Value("${dazyhub.jwt.secret}") String secret,
      @Value("${dazyhub.jwt.expiration-ms}") long expirationMs
  ) {
    this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    this.expirationMs = expirationMs;
  }

  public String generateToken(User user) {
    Instant now = Instant.now();
    return Jwts.builder()
        .subject(user.getEmail())
        .claim("uid", user.getId())
        .issuedAt(Date.from(now))
        .expiration(Date.from(now.plusMillis(expirationMs)))
        .signWith(key)
        .compact();
  }

  public String extractEmail(String token) {
    return parseClaims(token).getSubject();
  }

  public boolean isValid(String token, User user) {
    String username = extractEmail(token);
    return username.equals(user.getEmail()) && parseClaims(token).getExpiration().after(new Date());
  }

  private Claims parseClaims(String token) {
    return Jwts.parser()
        .verifyWith(key)
        .build()
        .parseSignedClaims(token)
        .getPayload();
  }
}
