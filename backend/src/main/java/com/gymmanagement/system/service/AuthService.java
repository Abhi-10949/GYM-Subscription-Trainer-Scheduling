package com.gymmanagement.system.service;

import com.gymmanagement.system.dto.AdminRegistrationRequest;
import com.gymmanagement.system.dto.AuthRequest;
import com.gymmanagement.system.dto.AuthResponse;
import com.gymmanagement.system.dto.MemberRegistrationRequest;
import com.gymmanagement.system.entity.Admin;
import com.gymmanagement.system.entity.Member;
import com.gymmanagement.system.enums.Role;
import com.gymmanagement.system.repository.AdminRepository;
import com.gymmanagement.system.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AdminRepository adminRepository;
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse registerAdmin(AdminRegistrationRequest request) {
        if (adminRepository.existsByEmail(request.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Admin email already exists");
        }

        Admin admin = adminRepository.save(Admin.builder()
                .fullName(request.fullName())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .photoUrl(request.photoUrl())
                .build());

        return new AuthResponse(admin.getId(), admin.getFullName(), admin.getEmail(), null, admin.getPhotoUrl(), Role.ADMIN, "Admin registered successfully");
    }

    public AuthResponse loginAdmin(AuthRequest request) {
        Admin admin = adminRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Admin not found"));

        validatePassword(request.password(), admin.getPassword());
        return new AuthResponse(admin.getId(), admin.getFullName(), admin.getEmail(), null, admin.getPhotoUrl(), Role.ADMIN, "Admin login successful");
    }

    public AuthResponse registerMember(MemberRegistrationRequest request) {
        if (memberRepository.existsByEmail(request.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Member email already exists");
        }

        Member member = memberRepository.save(Member.builder()
                .fullName(request.fullName())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .phone(request.phone())
                .gender(request.gender())
                .age(request.age())
                .heightCm(request.heightCm())
                .weightKg(request.weightKg())
                .photoUrl(request.photoUrl())
                .address(request.address())
                .build());

        return new AuthResponse(member.getId(), member.getFullName(), member.getEmail(), member.getClientId(), member.getPhotoUrl(), Role.MEMBER, "Member registered successfully");
    }

    public AuthResponse loginMember(AuthRequest request) {
        Member member = memberRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Member not found"));

        validatePassword(request.password(), member.getPassword());
        return new AuthResponse(member.getId(), member.getFullName(), member.getEmail(), member.getClientId(), member.getPhotoUrl(), Role.MEMBER, "Member login successful");
    }

    private void validatePassword(String rawPassword, String encodedPassword) {
        if (!passwordEncoder.matches(rawPassword, encodedPassword)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }
    }
}
