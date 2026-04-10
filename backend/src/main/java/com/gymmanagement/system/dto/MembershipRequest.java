package com.gymmanagement.system.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record MembershipRequest(
        @NotBlank String clientId,
        @NotNull Long packageId,
        Long trainerId,
        @NotNull LocalDate startDate,
        @NotNull LocalDate endDate,
        @NotBlank String status,
        @NotBlank String paymentStatus
) {
}
