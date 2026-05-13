package com.dazyhub.profile;

import com.dazyhub.user.User;
import com.dazyhub.user.UserRepository;
import com.dazyhub.user.UserResponse;
import jakarta.validation.Valid;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/me")
public class ProfileController {
  private static final Set<String> ALLOWED_EXTENSIONS = Set.of("jpg", "jpeg", "png", "webp");
  private static final Set<String> ALLOWED_TYPES = Set.of("image/jpeg", "image/png", "image/webp");
  private static final Set<String> ALLOWED_TAG_SIZES = Set.of("short", "long");
  private static final Set<String> ALLOWED_THEMES = Set.of("warm", "graphite", "sage", "navy", "rose");
  private static final Set<String> ALLOWED_SEARCH_ENGINES = Set.of("google", "baidu", "bing");

  private final UserRepository userRepository;
  private final Path uploadDir;

  public ProfileController(UserRepository userRepository, @Value("${dazyhub.upload-dir}") String uploadDir) {
    this.userRepository = userRepository;
    this.uploadDir = Path.of(uploadDir).toAbsolutePath().normalize();
  }

  @GetMapping
  public UserResponse me(@AuthenticationPrincipal User user) {
    return UserResponse.from(user);
  }

  @PatchMapping
  public UserResponse updateProfile(
      @AuthenticationPrincipal User user,
      @Valid @RequestBody ProfileUpdateRequest request
  ) {
    if (request.displayName() != null && !request.displayName().trim().isEmpty()) {
      user.setDisplayName(request.displayName().trim());
    }
    if (request.signature() != null) {
      String signature = request.signature().trim();
      user.setSignature(signature.isEmpty() ? null : signature);
    }
    return UserResponse.from(userRepository.save(user));
  }

  @PatchMapping("/settings")
  public UserResponse updateSettings(
      @AuthenticationPrincipal User user,
      @RequestBody SettingsUpdateRequest request
  ) {
    if (request.tagSize() != null) {
      user.setTagSize(validateOption(request.tagSize(), ALLOWED_TAG_SIZES, "标签大小无效"));
    }
    if (request.theme() != null) {
      user.setTheme(validateOption(request.theme(), ALLOWED_THEMES, "主题模式无效"));
    }
    if (request.searchEngine() != null) {
      user.setSearchEngine(validateOption(request.searchEngine(), ALLOWED_SEARCH_ENGINES, "搜索引擎无效"));
    }
    return UserResponse.from(userRepository.save(user));
  }

  @PostMapping("/avatar")
  public Map<String, String> uploadAvatar(
      @AuthenticationPrincipal User user,
      @RequestParam("file") MultipartFile file
  ) throws IOException {
    if (file.isEmpty()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "请选择头像文件");
    }
    if (file.getSize() > 2 * 1024 * 1024) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "头像不能超过 2MB");
    }
    if (!ALLOWED_TYPES.contains(file.getContentType())) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "只支持 jpg、png、webp 图片");
    }

    String originalName = StringUtils.cleanPath(file.getOriginalFilename() == null ? "" : file.getOriginalFilename());
    String extension = getExtension(originalName);
    if (!ALLOWED_EXTENSIONS.contains(extension)) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "只支持 jpg、png、webp 图片");
    }

    Files.createDirectories(uploadDir);
    String filename = user.getId() + "-" + UUID.randomUUID() + "." + extension;
    Path destination = uploadDir.resolve(filename).normalize();
    if (!destination.startsWith(uploadDir)) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "头像文件名无效");
    }

    Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);
    String avatarUrl = "/uploads/avatars/" + filename;
    user.setAvatarUrl(avatarUrl);
    userRepository.save(user);
    return Map.of("avatarUrl", avatarUrl);
  }

  private String getExtension(String filename) {
    int dot = filename.lastIndexOf('.');
    if (dot < 0 || dot == filename.length() - 1) {
      return "";
    }
    return filename.substring(dot + 1).toLowerCase(Locale.ROOT);
  }

  private String validateOption(String value, Set<String> allowedValues, String message) {
    String normalized = value.trim().toLowerCase(Locale.ROOT);
    if (!allowedValues.contains(normalized)) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
    }
    return normalized;
  }
}
