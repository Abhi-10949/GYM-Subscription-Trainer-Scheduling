package com.gymmanagement.system.repository;

import com.gymmanagement.system.entity.Membership;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MembershipRepository extends JpaRepository<Membership, Long> {
    List<Membership> findByMember_ClientId(String clientId);
    List<Membership> findByRequestStatus(String requestStatus);
    List<Membership> findByTrainer_Id(Long trainerId);
    Optional<Membership> findFirstByMember_ClientIdAndRequestStatusOrderByRequestedAtDesc(String clientId, String requestStatus);
}
