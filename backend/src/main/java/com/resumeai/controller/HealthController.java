package com.resumeai.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> checkHealth() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        status.put("message", "ResumeAI Backend is running successfully!");
        return ResponseEntity.ok(status);
    }
}
