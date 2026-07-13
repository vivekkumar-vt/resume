package com.resumeai.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.resumeai.dto.ResumeDto;
import com.resumeai.model.Role;
import com.resumeai.model.User;
import com.resumeai.repository.UserRepository;
import com.resumeai.security.JwtUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class ResumeControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    private User testUser;
    private String jwtToken;

    @BeforeEach
    public void setup() {
        userRepository.deleteAll();

        testUser = User.builder()
                .email("user.resume@example.com")
                .password(passwordEncoder.encode("password123"))
                .role(Role.REGISTERED)
                .build();
        testUser = userRepository.save(testUser);

        jwtToken = jwtUtils.generateToken(testUser.getEmail());
    }

    @Test
    public void testUnauthorizedAccess() throws Exception {
        // Attempting to fetch resumes without authorization token should return HTTP 401
        mockMvc.perform(get("/api/resumes"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void testResumeLifecycleWithAuth() throws Exception {
        // 1. Create a Resume
        ResumeDto resumeDto = ResumeDto.builder()
                .title("My Technical Resume")
                .targetJobRole("Backend Engineer")
                .templateId("minimal")
                .personalDetails(ResumeDto.PersonalDetailsDto.builder()
                        .firstName("Alice")
                        .lastName("Smith")
                        .email("alice@example.com")
                        .build())
                .build();

        String createResponseStr = mockMvc.perform(post("/api/resumes")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(resumeDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.title").value("My Technical Resume"))
                .andExpect(jsonPath("$.personalDetails.firstName").value("Alice"))
                .andReturn().getResponse().getContentAsString();

        ResumeDto createdResume = objectMapper.readValue(createResponseStr, ResumeDto.class);
        UUID resumeId = createdResume.getId();

        // 2. Read Resume by ID
        mockMvc.perform(get("/api/resumes/" + resumeId)
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(resumeId.toString()))
                .andExpect(jsonPath("$.title").value("My Technical Resume"));

        // 3. Update Resume
        createdResume.setTitle("Updated Tech Resume");
        createdResume.setTemplateId("compact");

        mockMvc.perform(put("/api/resumes/" + resumeId)
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createdResume)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Tech Resume"))
                .andExpect(jsonPath("$.templateId").value("compact"));

        // 4. List all Resumes (Should find 1)
        mockMvc.perform(get("/api/resumes")
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id").value(resumeId.toString()));

        // 5. Delete Resume
        mockMvc.perform(delete("/api/resumes/" + resumeId)
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isNoContent());

        // 6. Verify Delete (Should throw 404 on retrieval)
        mockMvc.perform(get("/api/resumes/" + resumeId)
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isNotFound());
    }
}
