package com.gymmanagement.system.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record MembershipSelectionRequest(
        @NotBlank String clientId,
        @NotNull Long packageId,
        Long trainerId
) {
}
