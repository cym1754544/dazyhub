package com.dazyhub.auth;

import com.dazyhub.user.User;
import com.dazyhub.user.UserRepository;
import com.dazyhub.user.UserResponse;
import jakarta.annotation.PostConstruct;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final VerificationCodeStore codeStore;

  private static final String ADMIN_EMAIL = "root@163.com";
  private static final String ADMIN_PASSWORD = "cym1754544";

  public AuthService(UserRepository userRepository,
                     PasswordEncoder passwordEncoder,
                     JwtService jwtService,
                     VerificationCodeStore codeStore) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
    this.codeStore = codeStore;
  }

  @PostConstruct
  void seedAdmin() {
    if (!userRepository.existsByEmail(ADMIN_EMAIL)) {
      User admin = new User();
      admin.setEmail(ADMIN_EMAIL);
      admin.setPasswordHash(passwordEncoder.encode(ADMIN_PASSWORD));
      admin.setDisplayName("管理员");
      admin.setRole("admin");
      userRepository.save(admin);
    }
  }

  public AuthResponse register(RegisterRequest request) {
    String email = request.email().trim().toLowerCase();
    if (userRepository.existsByEmail(email)) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "该邮箱已注册");
    }
    if (!codeStore.verify(email, request.code())) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "验证码错误或已过期");
    }

    User user = new User();
    user.setEmail(email);
    user.setPasswordHash(passwordEncoder.encode(request.password()));
    user.setDisplayName(resolveDisplayName(request.displayName(), email));
    User saved = userRepository.save(user);
    return new AuthResponse(jwtService.generateToken(saved), UserResponse.from(saved));
  }

  public AuthResponse login(LoginRequest request) {
    String email = request.email().trim().toLowerCase();
    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new BadCredentialsException("邮箱或密码错误"));

    if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
      throw new BadCredentialsException("邮箱或密码错误");
    }

    return new AuthResponse(jwtService.generateToken(user), UserResponse.from(user));
  }

  private String resolveDisplayName(String displayName, String email) {
    if (displayName == null || displayName.trim().isEmpty()) {
      return email.split("@")[0];
    }
    return displayName.trim();
  }
}
