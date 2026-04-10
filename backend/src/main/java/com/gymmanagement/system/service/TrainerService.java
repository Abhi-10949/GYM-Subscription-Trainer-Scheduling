package com.gymmanagement.system.service;

import com.gymmanagement.system.entity.Trainer;
import com.gymmanagement.system.entity.Membership;
import com.gymmanagement.system.repository.MembershipRepository;
import com.gymmanagement.system.repository.TrainerRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class TrainerService {

    private final TrainerRepository trainerRepository;
    private final MembershipRepository membershipRepository;

    public Trainer addTrainer(Trainer trainer) {
        return trainerRepository.save(trainer);
    }

    public List<Trainer> getAllTrainers() {
        return trainerRepository.findAll();
    }

    public Trainer updateTrainer(Long id, Trainer request) {
        Trainer trainer = trainerRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trainer not found"));

        trainer.setName(request.getName());
        trainer.setEmail(request.getEmail());
        trainer.setSpecialization(request.getSpecialization());
        trainer.setPhone(request.getPhone());
        trainer.setAge(request.getAge());
        trainer.setExperienceYears(request.getExperienceYears());
        trainer.setAddress(request.getAddress());
        if (request.getPhotoUrl() != null) {
            trainer.setPhotoUrl(request.getPhotoUrl());
        }

        return trainerRepository.save(trainer);
    }

    public void deleteTrainer(Long id) {
        if (!trainerRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Trainer not found");
        }
        List<Membership> memberships = membershipRepository.findByTrainer_Id(id);
        for (Membership membership : memberships) {
            membership.setTrainer(null);
        }
        membershipRepository.saveAll(memberships);
        trainerRepository.deleteById(id);
    }
}
