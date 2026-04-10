package com.gymmanagement.system.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record MemberRegistrationRequest(
        @NotBlank String fullName,
        @Email @NotBlank String email,
        @NotBlank String password,
        String phone,
        String gender,
        Integer age,
        Double heightCm,
        Double weightKg,
        String photoUrl,
        String address
) {
}
