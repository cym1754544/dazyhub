package com.dazyhub.user;

public record UserResponse(
    Long id,
    String email,
    String displayName,
    String role,
    String signature,
    String avatarUrl,
    String tagSize,
    String theme,
    String searchEngine
) {
  public static UserResponse from(User user) {
    return new UserResponse(
        user.getId(),
        user.getEmail(),
        user.getDisplayName(),
        user.getRole(),
        user.getSignature(),
        user.getAvatarUrl(),
        user.getTagSize(),
        user.getTheme(),
        user.getSearchEngine()
    );
  }
}
