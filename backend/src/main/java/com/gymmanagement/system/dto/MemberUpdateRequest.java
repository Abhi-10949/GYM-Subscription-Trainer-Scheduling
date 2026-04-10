package com.gymmanagement.system.dto;

public record MemberUpdateRequest(
        String fullName,
        String phone,
        String gender,
        Integer age,
        Double heightCm,
        Double weightKg,
        String photoUrl,
        String address,
        Long preferredPackageId,
        Long preferredTrainerId
) {
}
