package com.gymmanagement.system.service;

import com.gymmanagement.system.dto.MembershipDecisionRequest;
import com.gymmanagement.system.dto.MembershipRequest;
import com.gymmanagement.system.dto.MembershipSelectionRequest;
import com.gymmanagement.system.entity.GymPackage;
import com.gymmanagement.system.entity.Member;
import com.gymmanagement.system.entity.Membership;
import com.gymmanagement.system.entity.Trainer;
import java.time.LocalDate;
import java.time.LocalDateTime;
import com.gymmanagement.system.repository.GymPackageRepository;
import com.gymmanagement.system.repository.MemberRepository;
import com.gymmanagement.system.repository.MembershipRepository;
import com.gymmanagement.system.repository.TrainerRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class MembershipService {

    private final MembershipRepository membershipRepository;
    private final MemberRepository memberRepository;
    private final GymPackageRepository gymPackageRepository;
    private final TrainerRepository trainerRepository;

    public Membership addMembership(MembershipRequest request) {
        Member member = getMember(request.clientId());
        GymPackage gymPackage = getPackage(request.packageId());
        Trainer trainer = getTrainer(request.trainerId());

        Membership membership = Membership.builder()
                .member(member)
                .gymPackage(gymPackage)
                .trainer(trainer)
                .startDate(request.startDate())
                .endDate(request.endDate())
                .status(request.status())
                .paymentStatus(request.paymentStatus())
                .requestStatus("APPROVED")
                .requestedAt(LocalDateTime.now())
                .build();

        return membershipRepository.save(membership);
    }

    public Membership createMembershipRequest(MembershipSelectionRequest request) {
        Member member = getMember(request.clientId());
        GymPackage gymPackage = getPackage(request.packageId());
        Trainer trainer = getTrainer(request.trainerId());

        membershipRepository.findFirstByMember_ClientIdAndRequestStatusOrderByRequestedAtDesc(member.getClientId(), "PENDING")
                .ifPresent(existing -> {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "A membership request is already pending for this member");
                });

        Membership membership = Membership.builder()
                .member(member)
                .gymPackage(gymPackage)
                .trainer(trainer)
                .status("REQUESTED")
                .paymentStatus("PENDING")
                .requestStatus("PENDING")
                .requestedAt(LocalDateTime.now())
                .build();

        return membershipRepository.save(membership);
    }

    public List<Membership> getAllMemberships() {
        return membershipRepository.findAll();
    }

    public List<Membership> getMembershipsByClientId(String clientId) {
        return membershipRepository.findByMember_ClientId(clientId);
    }

    public List<Membership> getPendingRequests() {
        return membershipRepository.findByRequestStatus("PENDING");
    }

    public Membership updateMembership(Long membershipId, MembershipRequest request) {
        Membership membership = membershipRepository.findById(membershipId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Membership not found"));

        membership.setMember(getMember(request.clientId()));
        membership.setGymPackage(getPackage(request.packageId()));
        membership.setTrainer(getTrainer(request.trainerId()));
        membership.setStartDate(request.startDate());
        membership.setEndDate(request.endDate());
        membership.setStatus(request.status());
        membership.setPaymentStatus(request.paymentStatus());
        if (membership.getRequestStatus() == null || membership.getRequestStatus().isBlank()) {
            membership.setRequestStatus("APPROVED");
        }

        return membershipRepository.save(membership);
    }

    public Membership decideMembershipRequest(Long membershipId, MembershipDecisionRequest request) {
        Membership membership = membershipRepository.findById(membershipId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Membership request not found"));

        String decision = request.decision().trim().toUpperCase();
        if (!decision.equals("APPROVED") && !decision.equals("REJECTED")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Decision must be APPROVED or REJECTED");
        }

        membership.setRequestStatus(decision);
        membership.setAdminRemarks(request.adminRemarks());

        if (decision.equals("APPROVED")) {
            LocalDate startDate = LocalDate.now();
            membership.setStartDate(startDate);
            membership.setEndDate(startDate.plusMonths(membership.getGymPackage().getDurationInMonths()));
            membership.setStatus("ACTIVE");
            membership.setPaymentStatus("PENDING");
        } else {
            membership.setStatus("REJECTED");
            membership.setPaymentStatus("REJECTED");
            membership.setStartDate(null);
            membership.setEndDate(null);
        }

        return membershipRepository.save(membership);
    }

    private Member getMember(String clientId) {
        return memberRepository.findByClientId(clientId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Member not found"));
    }

    private GymPackage getPackage(Long packageId) {
        return gymPackageRepository.findById(packageId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Package not found"));
    }

    private Trainer getTrainer(Long trainerId) {
        if (trainerId == null) {
            return null;
        }
        return trainerRepository.findById(trainerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trainer not found"));
    }
}
