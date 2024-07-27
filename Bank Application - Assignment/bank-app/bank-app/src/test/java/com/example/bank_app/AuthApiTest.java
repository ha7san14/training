package com.example.bank_app;
import com.example.bank_app.Authentication.AuthenticationRequest;
import com.example.bank_app.User.User;
import com.example.bank_app.User.UserRepository;
import com.example.bank_app.User.CustomUserDetailsService;
import com.example.bank_app.Security.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.*;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@ActiveProfiles("test")
public class AuthApiTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthenticationManager authenticationManager;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private CustomUserDetailsService userDetailsService;

    @MockBean
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private AuthenticationRequest authRequest;
    private User testUser;

    @BeforeEach
    public void setup() {
        testUser = new User();
        testUser.setUsername("testuser");
        testUser.setPassword("password");
        testUser.setEmail("testuser@example.com");

        authRequest = new AuthenticationRequest();
        authRequest.setUsername("testuser");
        authRequest.setPassword("password");
    }

    @Order(1)
    @Test
    public void testLoginSuccess() throws Exception {
        String token = "mockJwtToken";
        Mockito.when(authenticationManager.authenticate(Mockito.any()))
                .thenReturn(new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword()));
        Mockito.when(userDetailsService.loadUserByUsername(authRequest.getUsername()))
                .thenReturn(new org.springframework.security.core.userdetails.User(testUser.getUsername(), testUser.getPassword(), new ArrayList<>()));
        Mockito.when(jwtUtil.generateToken(Mockito.anyString())).thenReturn(token);
        Mockito.when(userRepository.findByUsername(authRequest.getUsername())).thenReturn(testUser);

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$.token").value(token))
                .andExpect(jsonPath("$.user.username").value(testUser.getUsername()));
    }

    @Order(2)
    @Test
    public void testLoginFailureBadCredentials() throws Exception {
        Mockito.when(authenticationManager.authenticate(Mockito.any()))
                .thenThrow(new BadCredentialsException("Incorrect username or password"));

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Incorrect username or password"));
    }

    @Order(3)
    @Test
    public void testLoginFailureUnexpectedError() throws Exception {
        Mockito.when(authenticationManager.authenticate(Mockito.any()))
                .thenThrow(new RuntimeException("Unexpected error"));

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string("An unexpected error occurred"));
    }
}
