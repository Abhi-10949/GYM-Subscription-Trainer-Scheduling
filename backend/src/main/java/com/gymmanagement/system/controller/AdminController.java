package com.gymmanagement.system.controller;

import com.gymmanagement.system.dto.AdminUpdateRequest;
import com.gymmanagement.system.entity.Admin;
import com.gymmanagement.system.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admins")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/{id}")
    public Admin getAdminById(@PathVariable Long id) {
        return adminService.getAdminById(id);
    }

    @PatchMapping("/{id}")
    public Admin updateAdmin(@PathVariable Long id, @RequestBody AdminUpdateRequest request) {
        return adminService.updateAdmin(id, request);
    }
}
