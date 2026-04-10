package com.gymmanagement.system.dto;

import jakarta.validation.constraints.NotBlank;

public record MembershipDecisionRequest(
        @NotBlank String decision,
        String adminRemarks
) {
}
