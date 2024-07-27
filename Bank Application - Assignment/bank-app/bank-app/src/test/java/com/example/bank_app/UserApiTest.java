package com.example.bank_app;

import org.hamcrest.Matchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@ActiveProfiles("test")
public class UserApiTest {

    @Autowired
    private MockMvc mockMvc;

    @BeforeEach
    public void setup() throws Exception {
        String userJson = "{\"username\":\"testuser\",\"password\":\"password\",\"email\":\"testuser@example.com\",\"address\":\"123 Test St.\"}";

        mockMvc.perform(MockMvcRequestBuilders.post("/api/users/create-user")
                        .contentType(MediaType.APPLICATION_JSON_VALUE)
                        .content(userJson)
                        .with(SecurityMockMvcRequestPostProcessors.csrf())
                        .with(SecurityMockMvcRequestPostProcessors.user("admin")
                                .authorities(new SimpleGrantedAuthority("ADMIN"))))
                .andExpect(MockMvcResultMatchers.status().isCreated());
    }

    @Order(1)
    @Test
    public void testGetAllUsersSuccess() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/users/get-all-users")
                        .with(SecurityMockMvcRequestPostProcessors.user("admin")
                                .authorities(new SimpleGrantedAuthority("ADMIN"))))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(MockMvcResultMatchers.jsonPath("$", Matchers.hasSize(1)));
    }

    @Order(2)
    @Test
    public void testGetUserByIdSuccess() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/users/1")
                        .with(SecurityMockMvcRequestPostProcessors.user("admin")
                                .authorities(new SimpleGrantedAuthority("ADMIN"))))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(MockMvcResultMatchers.jsonPath("$.id", Matchers.is(1)))
                .andExpect(MockMvcResultMatchers.jsonPath("$.username", Matchers.is("testuser")))
                .andExpect(MockMvcResultMatchers.jsonPath("$.email", Matchers.is("testuser@example.com")));
    }

    @Order(3)
    @Test
    public void testGetUserByIdNotFound() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/users/999")
                        .with(SecurityMockMvcRequestPostProcessors.user("admin")
                                .authorities(new SimpleGrantedAuthority("ADMIN"))))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Order(4)
    @Test
    public void testCreateUserSuccess() throws Exception {
        String userJson = "{\"username\":\"newuser\",\"password\":\"password\",\"email\":\"newuser@example.com\",\"address\":\"123 New St.\"}";

        mockMvc.perform(MockMvcRequestBuilders.post("/api/users/create-user")
                        .contentType(MediaType.APPLICATION_JSON_VALUE)
                        .content(userJson)
                        .with(SecurityMockMvcRequestPostProcessors.csrf())
                        .with(SecurityMockMvcRequestPostProcessors.user("admin")
                                .authorities(new SimpleGrantedAuthority("ADMIN"))))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(MockMvcResultMatchers.jsonPath("$.username", Matchers.is("newuser")))
                .andExpect(MockMvcResultMatchers.jsonPath("$.email", Matchers.is("newuser@example.com")));
    }

    @Order(5)
    @Test
    public void testUpdateUserSuccess() throws Exception {
        String updatedUserJson = "{\"username\":\"updateduser\",\"password\":\"newpassword\",\"email\":\"updateduser@example.com\",\"address\":\"456 Updated St.\"}";

        mockMvc.perform(MockMvcRequestBuilders.put("/api/users/1")
                        .contentType(MediaType.APPLICATION_JSON_VALUE)
                        .content(updatedUserJson)
                        .with(SecurityMockMvcRequestPostProcessors.csrf())
                        .with(SecurityMockMvcRequestPostProcessors.user("admin")
                                .authorities(new SimpleGrantedAuthority("ADMIN"))))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(MockMvcResultMatchers.jsonPath("$.username", Matchers.is("updateduser")))
                .andExpect(MockMvcResultMatchers.jsonPath("$.email", Matchers.is("updateduser@example.com")));
    }

    @Order(6)
    @Test
    public void testUpdateUserNotFound() throws Exception {
        String updatedUserJson = "{\"username\":\"updateduser\",\"password\":\"newpassword\",\"email\":\"updateduser@example.com\",\"address\":\"456 Updated St.\"}";

        mockMvc.perform(MockMvcRequestBuilders.put("/api/users/999")
                        .contentType(MediaType.APPLICATION_JSON_VALUE)
                        .content(updatedUserJson)
                        .with(SecurityMockMvcRequestPostProcessors.csrf())
                        .with(SecurityMockMvcRequestPostProcessors.user("admin")
                                .authorities(new SimpleGrantedAuthority("ADMIN"))))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }
}
