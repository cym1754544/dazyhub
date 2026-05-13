package com.dazyhub.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
    @NotBlank @Email @Size(max = 128) String email,
    @NotBlank @Size(min = 6, max = 120) String password,
    @NotBlank String code,
    @Size(max = 80) String displayName
) {}
