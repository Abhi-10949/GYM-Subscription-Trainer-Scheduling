package com.gymmanagement.system.controller;

import com.gymmanagement.system.dto.AdminRegistrationRequest;
import com.gymmanagement.system.dto.AuthRequest;
import com.gymmanagement.system.dto.AuthResponse;
import com.gymmanagement.system.dto.MemberRegistrationRequest;
import com.gymmanagement.system.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/admin/register")
    public AuthResponse registerAdmin(@Valid @RequestBody AdminRegistrationRequest request) {
        return authService.registerAdmin(request);
    }

    @PostMapping("/admin/login")
    public AuthResponse loginAdmin(@Valid @RequestBody AuthRequest request) {
        return authService.loginAdmin(request);
    }

    @PostMapping("/member/register")
    public AuthResponse registerMember(@Valid @RequestBody MemberRegistrationRequest request) {
        return authService.registerMember(request);
    }

    @PostMapping("/member/login")
    public AuthResponse loginMember(@Valid @RequestBody AuthRequest request) {
        return authService.loginMember(request);
    }
}
