package com.gymmanagement.system.repository;

import com.gymmanagement.system.entity.Member;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByEmail(String email);
    Optional<Member> findByClientId(String clientId);
    boolean existsByEmail(String email);
    List<Member> findByFullNameContainingIgnoreCase(String fullName);
}
