package com.gymmanagement.system.repository;

import com.gymmanagement.system.entity.Trainer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrainerRepository extends JpaRepository<Trainer, Long> {
}
