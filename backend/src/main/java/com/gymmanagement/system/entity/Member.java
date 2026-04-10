package com.gymmanagement.system.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "members")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String clientId;

    private String fullName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String phone;
    private String gender;
    private Integer age;
    private Double heightCm;
    private Double weightKg;
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String photoUrl;
    private String address;
    private Long preferredPackageId;
    private Long preferredTrainerId;
    private LocalDate joinedAt;

    @PrePersist
    public void prePersist() {
        if (clientId == null || clientId.isBlank()) {
            clientId = "MEM-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }
        if (joinedAt == null) {
            joinedAt = LocalDate.now();
        }
    }
}
