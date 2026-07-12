package com.resumeai.controller;

import com.resumeai.dto.ResumeDto;
import com.resumeai.model.User;
import com.resumeai.security.CustomUserDetails;
import com.resumeai.service.ResumeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/resumes")
public class ResumeController {

    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    @GetMapping
    public ResponseEntity<List<ResumeDto>> getAllResumes(@AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = userDetails.getUser();
        List<ResumeDto> resumes = resumeService.getAllResumes(user);
        return ResponseEntity.ok(resumes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResumeDto> getResumeById(
            @PathVariable UUID id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = userDetails.getUser();
        ResumeDto resume = resumeService.getResumeById(id, user);
        return ResponseEntity.ok(resume);
    }

    @PostMapping
    public ResponseEntity<ResumeDto> createResume(
            @RequestBody ResumeDto resumeDto,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = userDetails.getUser();
        ResumeDto created = resumeService.createResume(resumeDto, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResumeDto> updateResume(
            @PathVariable UUID id,
            @RequestBody ResumeDto resumeDto,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = userDetails.getUser();
        ResumeDto updated = resumeService.updateResume(id, resumeDto, user);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResume(
            @PathVariable UUID id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = userDetails.getUser();
        resumeService.deleteResume(id, user);
        return ResponseEntity.noContent().build();
    }
}
