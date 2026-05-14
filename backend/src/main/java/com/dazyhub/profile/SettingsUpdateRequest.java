package com.dazyhub.profile;

public record SettingsUpdateRequest(
    String tagSize,
    String theme,
    String searchEngine,
    String sitesJson,
    String siteGroupsJson,
    String ungroupedName,
    String activeGroup,
    Boolean confirmDelete
) {}