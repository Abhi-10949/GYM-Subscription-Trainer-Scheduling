package com.gymmanagement.system.service;

import com.gymmanagement.system.dto.AdminUpdateRequest;
import com.gymmanagement.system.entity.Admin;
import com.gymmanagement.system.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepository;

    public Admin getAdminById(Long id) {
        return adminRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Admin not found"));
    }

    public Admin updateAdmin(Long id, AdminUpdateRequest request) {
        Admin admin = getAdminById(id);
        if (request.fullName() != null) admin.setFullName(request.fullName());
        if (request.photoUrl() != null) admin.setPhotoUrl(request.photoUrl());
        return adminRepository.save(admin);
    }
}
