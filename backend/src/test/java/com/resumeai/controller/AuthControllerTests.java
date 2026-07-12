package com.resumeai.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.resumeai.dto.LoginRequest;
import com.resumeai.dto.RegisterRequest;
import com.resumeai.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class AuthControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setup() {
        userRepository.deleteAll();
    }

    @Test
    public void testUserRegistrationAndLoginFlow() throws Exception {
        // 1. Test Registration
        RegisterRequest registerReq = new RegisterRequest("John Doe", "candidate@example.com", "secure123");
        
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.email").value("candidate@example.com"))
                .andExpect(jsonPath("$.role").value("REGISTERED"));

        // 2. Test Registration with Duplicate Email (Should fail)
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerReq)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Email is already in use"));

        // 3. Test Successful Login
        LoginRequest loginReq = new LoginRequest("candidate@example.com", "secure123");
        
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.email").value("candidate@example.com"))
                .andExpect(jsonPath("$.role").value("REGISTERED"));

        // 4. Test Login with Incorrect Password (Should fail)
        LoginRequest wrongPasswordLogin = new LoginRequest("candidate@example.com", "wrongpassword");
        
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(wrongPasswordLogin)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Invalid email or password"));
    }
}
