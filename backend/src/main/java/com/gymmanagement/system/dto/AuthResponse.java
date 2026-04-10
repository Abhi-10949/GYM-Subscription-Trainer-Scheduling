package com.gymmanagement.system.dto;

import com.gymmanagement.system.enums.Role;

public record AuthResponse(
        Long id,
        String name,
        String email,
        String clientId,
        String photoUrl,
        Role role,
        String message
) {
}
