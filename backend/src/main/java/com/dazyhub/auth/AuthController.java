package com.dazyhub.auth;

import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
  private final AuthService authService;
  private final EmailService emailService;

  public AuthController(AuthService authService, EmailService emailService) {
    this.authService = authService;
    this.emailService = emailService;
  }

  @PostMapping("/send-code")
  public Map<String, Boolean> sendCode(@Valid @RequestBody SendCodeRequest request) {
    emailService.sendVerificationCode(request.email().trim().toLowerCase());
    return Map.of("ok", true);
  }

  @PostMapping("/register")
  public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
    return authService.register(request);
  }

  @PostMapping("/login")
  public AuthResponse login(@Valid @RequestBody LoginRequest request) {
    return authService.login(request);
  }

  @PostMapping("/logout")
  public Map<String, Boolean> logout() {
    return Map.of("ok", true);
  }
}
