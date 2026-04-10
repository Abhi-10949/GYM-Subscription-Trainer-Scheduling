package com.gymmanagement.system.controller;

import com.gymmanagement.system.dto.MembershipDecisionRequest;
import com.gymmanagement.system.dto.MembershipRequest;
import com.gymmanagement.system.dto.MembershipSelectionRequest;
import com.gymmanagement.system.entity.Membership;
import com.gymmanagement.system.service.MembershipService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/memberships")
@RequiredArgsConstructor
public class MembershipController {

    private final MembershipService membershipService;

    @PostMapping
    public Membership addMembership(@RequestBody MembershipRequest request) {
        return membershipService.addMembership(request);
    }

    @PostMapping("/requests")
    public Membership createMembershipRequest(@RequestBody MembershipSelectionRequest request) {
        return membershipService.createMembershipRequest(request);
    }

    @GetMapping
    public List<Membership> getAllMemberships() {
        return membershipService.getAllMemberships();
    }

    @GetMapping("/requests/pending")
    public List<Membership> getPendingRequests() {
        return membershipService.getPendingRequests();
    }

    @GetMapping("/member/{clientId}")
    public List<Membership> getMembershipsByClientId(@PathVariable String clientId) {
        return membershipService.getMembershipsByClientId(clientId);
    }

    @PutMapping("/{membershipId}")
    public Membership updateMembership(@PathVariable Long membershipId, @RequestBody MembershipRequest request) {
        return membershipService.updateMembership(membershipId, request);
    }

    @PatchMapping("/{membershipId}/decision")
    public Membership decideMembershipRequest(@PathVariable Long membershipId, @RequestBody MembershipDecisionRequest request) {
        return membershipService.decideMembershipRequest(membershipId, request);
    }
}
