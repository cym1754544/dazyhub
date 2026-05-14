package com.dazyhub.profile;

public record ChangePasswordRequest(String oldPassword, String newPassword) {}