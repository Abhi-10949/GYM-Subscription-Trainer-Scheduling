package com.gymmanagement.system.service;

import com.gymmanagement.system.entity.GymPackage;
import com.gymmanagement.system.repository.GymPackageRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class GymPackageService {

    private final GymPackageRepository gymPackageRepository;

    public GymPackage addPackage(GymPackage gymPackage) {
        return gymPackageRepository.save(gymPackage);
    }

    public List<GymPackage> getAllPackages() {
        return gymPackageRepository.findAll();
    }

    public GymPackage updatePackage(Long id, GymPackage request) {
        GymPackage gymPackage = gymPackageRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Package not found"));

        gymPackage.setName(request.getName());
        gymPackage.setDurationInMonths(request.getDurationInMonths());
        gymPackage.setPrice(request.getPrice());
        gymPackage.setDescription(request.getDescription());

        return gymPackageRepository.save(gymPackage);
    }
}
