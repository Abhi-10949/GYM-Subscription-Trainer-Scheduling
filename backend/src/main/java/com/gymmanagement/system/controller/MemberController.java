package com.gymmanagement.system.controller;

import com.gymmanagement.system.dto.ChangePasswordRequest;
import com.gymmanagement.system.dto.MemberUpdateRequest;
import com.gymmanagement.system.entity.Member;
import com.gymmanagement.system.service.MemberService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @GetMapping
    public List<Member> getAllMembers() {
        return memberService.findAll();
    }

    @GetMapping("/search")
    public List<Member> searchMembers(@RequestParam String keyword) {
        return memberService.search(keyword);
    }

    @GetMapping("/{clientId}")
    public Member getMemberByClientId(@PathVariable String clientId) {
        return memberService.getByClientId(clientId);
    }

    @PatchMapping("/{clientId}")
    public Member updateMember(@PathVariable String clientId, @RequestBody MemberUpdateRequest request) {
        return memberService.updateMember(clientId, request);
    }

    @PostMapping("/{clientId}/change-password")
    public String changePassword(@PathVariable String clientId, @RequestBody ChangePasswordRequest request) {
        memberService.changePassword(clientId, request);
        return "Password updated successfully";
    }
}
