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
    String searchEngine,
    String sitesJson,
    String siteGroupsJson,
    String ungroupedName,
    String activeGroup,
    Boolean confirmDelete
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
        user.getSearchEngine(),
        user.getSitesJson(),
        user.getSiteGroupsJson(),
        user.getUngroupedName(),
        user.getActiveGroup(),
        user.getConfirmDelete()
    );
  }
}
