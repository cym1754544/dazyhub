package com.dazyhub.admin;

import com.dazyhub.user.User;
import com.dazyhub.user.UserRepository;
import com.dazyhub.user.UserResponse;
import java.security.SecureRandom;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
  private final EmailConfigRepository emailConfigRepository;
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public AdminController(EmailConfigRepository emailConfigRepository,
                         UserRepository userRepository,
                         PasswordEncoder passwordEncoder) {
    this.emailConfigRepository = emailConfigRepository;
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  private void requireAdmin(User user) {
    if (user == null || !user.isAdmin()) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "无管理员权限");
    }
  }

  @GetMapping("/email-config")
  public EmailConfig getEmailConfig(@AuthenticationPrincipal User user) {
    requireAdmin(user);
    return emailConfigRepository.findById(1L).orElseGet(EmailConfig::new);
  }

  @PutMapping("/email-config")
  public EmailConfig updateEmailConfig(@AuthenticationPrincipal User user,
                                       @RequestBody EmailConfig body) {
    requireAdmin(user);
    EmailConfig config = emailConfigRepository.findById(1L).orElseGet(EmailConfig::new);
    config.setSmtpHost(body.getSmtpHost());
    config.setSmtpPort(body.getSmtpPort());
    config.setSmtpUsername(body.getSmtpUsername());
    if (body.getSmtpPassword() != null && !body.getSmtpPassword().isEmpty()) {
      config.setSmtpPassword(body.getSmtpPassword());
    }
    config.setMailFrom(body.getMailFrom());
    return emailConfigRepository.save(config);
  }

  @GetMapping("/check")
  public Map<String, Boolean> checkAdmin(@AuthenticationPrincipal User user) {
    return Map.of("admin", user != null && user.isAdmin());
  }

  @GetMapping("/users")
  public List<UserResponse> listUsers(@AuthenticationPrincipal User admin,
                                      @RequestParam(required = false, defaultValue = "") String search) {
    requireAdmin(admin);
    if (search.isBlank()) {
      return userRepository.findAll().stream().map(UserResponse::from).toList();
    }
    return userRepository.searchByKeyword(search.trim()).stream().map(UserResponse::from).toList();
  }

  @PutMapping("/users/{id}")
  public UserResponse updateUser(@AuthenticationPrincipal User admin,
                                 @PathVariable Long id,
                                 @RequestBody Map<String, Object> body) {
    requireAdmin(admin);
    User user = userRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "用户不存在"));

    if (body.containsKey("displayName")) {
      String name = (String) body.get("displayName");
      if (name == null || name.trim().isEmpty()) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "昵称不能为空");
      }
      user.setDisplayName(name.trim());
    }
    if (body.containsKey("email")) {
      String email = ((String) body.get("email")).trim().toLowerCase();
      if (email.isEmpty()) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "邮箱不能为空");
      }
      if (!email.equals(user.getEmail()) && userRepository.existsByEmail(email)) {
        throw new ResponseStatusException(HttpStatus.CONFLICT, "邮箱已被占用");
      }
      user.setEmail(email);
    }
    if (body.containsKey("role")) {
      String role = (String) body.get("role");
      if (!"admin".equals(role) && !"user".equals(role)) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "无效的角色");
      }
      user.setRole(role);
    }

    return UserResponse.from(userRepository.save(user));
  }

  @DeleteMapping("/users/{id}")
  public Map<String, Object> deleteUser(@AuthenticationPrincipal User admin,
                                        @PathVariable Long id) {
    requireAdmin(admin);
    if (admin.getId().equals(id)) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "不能删除自己");
    }
    User user = userRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "用户不存在"));
    userRepository.delete(user);
    return Map.of("ok", true);
  }

  @PostMapping("/users/{id}/reset-password")
  public Map<String, String> resetPassword(@AuthenticationPrincipal User admin,
                                           @PathVariable Long id) {
    requireAdmin(admin);
    User user = userRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "用户不存在"));

    String newPassword = generateRandomPassword();
    user.setPasswordHash(passwordEncoder.encode(newPassword));
    userRepository.save(user);

    return Map.of("password", newPassword);
  }

  private static String generateRandomPassword() {
    String chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    SecureRandom random = new SecureRandom();
    StringBuilder sb = new StringBuilder(8);
    for (int i = 0; i < 8; i++) {
      sb.append(chars.charAt(random.nextInt(chars.length())));
    }
    return sb.toString();
  }
}
