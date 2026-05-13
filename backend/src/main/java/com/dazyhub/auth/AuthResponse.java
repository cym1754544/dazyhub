package com.dazyhub.auth;

import com.dazyhub.user.UserResponse;

public record AuthResponse(String token, UserResponse user) {}
