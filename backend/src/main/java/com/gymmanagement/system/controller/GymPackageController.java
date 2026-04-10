package com.gymmanagement.system.controller;

import com.gymmanagement.system.entity.GymPackage;
import com.gymmanagement.system.service.GymPackageService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/packages")
@RequiredArgsConstructor
public class GymPackageController {

    private final GymPackageService gymPackageService;

    @PostMapping
    public GymPackage addPackage(@RequestBody GymPackage gymPackage) {
        return gymPackageService.addPackage(gymPackage);
    }

    @GetMapping
    public List<GymPackage> getAllPackages() {
        return gymPackageService.getAllPackages();
    }

    @PutMapping("/{id}")
    public GymPackage updatePackage(@PathVariable Long id, @RequestBody GymPackage gymPackage) {
        return gymPackageService.updatePackage(id, gymPackage);
    }
}
