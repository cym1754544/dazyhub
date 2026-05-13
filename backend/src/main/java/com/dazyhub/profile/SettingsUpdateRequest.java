package com.dazyhub.profile;

public record SettingsUpdateRequest(
    String tagSize,
    String theme,
    String searchEngine
) {}
