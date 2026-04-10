package com.gymmanagement.system.service;

import com.gymmanagement.system.dto.ChangePasswordRequest;
import com.gymmanagement.system.dto.MemberUpdateRequest;
import com.gymmanagement.system.entity.Member;
import com.gymmanagement.system.repository.MemberRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    public List<Member> findAll() {
        return memberRepository.findAll();
    }

    public List<Member> search(String keyword) {
        return memberRepository.findByClientId(keyword)
                .map(List::of)
                .orElseGet(() -> memberRepository.findByFullNameContainingIgnoreCase(keyword));
    }

    public Member getByClientId(String clientId) {
        return memberRepository.findByClientId(clientId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Member not found"));
    }

    public Member updateMember(String clientId, MemberUpdateRequest request) {
        Member member = getByClientId(clientId);
        if (request.fullName() != null) member.setFullName(request.fullName());
        if (request.phone() != null) member.setPhone(request.phone());
        if (request.gender() != null) member.setGender(request.gender());
        if (request.age() != null) member.setAge(request.age());
        if (request.heightCm() != null) member.setHeightCm(request.heightCm());
        if (request.weightKg() != null) member.setWeightKg(request.weightKg());
        if (request.photoUrl() != null) member.setPhotoUrl(request.photoUrl());
        if (request.address() != null) member.setAddress(request.address());
        if (request.preferredPackageId() != null) member.setPreferredPackageId(request.preferredPackageId());
        if (request.preferredTrainerId() != null) member.setPreferredTrainerId(request.preferredTrainerId());
        return memberRepository.save(member);
    }

    public void changePassword(String clientId, ChangePasswordRequest request) {
        Member member = getByClientId(clientId);
        if (!passwordEncoder.matches(request.currentPassword(), member.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Current password is incorrect");
        }
        member.setPassword(passwordEncoder.encode(request.newPassword()));
        memberRepository.save(member);
    }
}
