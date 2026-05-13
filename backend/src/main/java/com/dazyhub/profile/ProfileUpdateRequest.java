package com.dazyhub.profile;

import jakarta.validation.constraints.Size;

public record ProfileUpdateRequest(
    @Size(min = 1, max = 80) String displayName,
    @Size(max = 120) String signature
) {}
