package com.example.bank_app;

import com.example.bank_app.Account.Account;
import com.example.bank_app.Account.AccountRepository;
import com.example.bank_app.User.User;
import com.example.bank_app.User.UserRepository;
import jakarta.transaction.Transactional;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.*;
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
public class AccountApiTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private UserRepository userRepository;

    private Long testUserId;
    private Long testAccountId;

    @BeforeEach
    @Transactional
    public void setUp() {
        accountRepository.deleteAll();
        userRepository.deleteAll();

        User user = new User();
        user.setUsername("testuser");
        user.setPassword("password");
        user.setEmail("testuser@example.com");
        user.setRoles("USER");
        user.setAddress("123 Test St.");
        User savedUser = userRepository.save(user);
        testUserId = savedUser.getId();

        Account account = new Account();
        account.setAccountNumber("1234567890");
        account.setUser(savedUser);
        Account savedAccount = accountRepository.save(account);
        testAccountId = savedAccount.getId();
    }

    @Order(1)
    @Test
    public void testGetAllAccountsSuccess() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/accounts/get-all-accounts")
                        .with(SecurityMockMvcRequestPostProcessors.user("admin")
                                .authorities(new SimpleGrantedAuthority("ADMIN"))))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(MockMvcResultMatchers.jsonPath("$", Matchers.hasSize(1)));
    }

    @Order(2)
    @Test
    public void testGetAccountByIdSuccess() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/accounts/" + testAccountId)
                        .with(SecurityMockMvcRequestPostProcessors.user("admin")
                                .authorities(new SimpleGrantedAuthority("ADMIN"))))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(MockMvcResultMatchers.jsonPath("$.id", Matchers.is(testAccountId.intValue())))
                .andExpect(MockMvcResultMatchers.jsonPath("$.accountNumber", Matchers.is("1234567890")));
    }

    @Order(3)
    @Test
    public void testGetAccountByIdNotFound() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/accounts/999")
                        .with(SecurityMockMvcRequestPostProcessors.user("admin")
                                .authorities(new SimpleGrantedAuthority("ADMIN"))))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Order(4)
    @Test
    public void testGetAccountByUserIdSuccess() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/accounts/user/" + testUserId)
                        .with(SecurityMockMvcRequestPostProcessors.user("admin")
                                .authorities(new SimpleGrantedAuthority("ADMIN"))))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(MockMvcResultMatchers.jsonPath("$.id", Matchers.is(testAccountId.intValue())))
                .andExpect(MockMvcResultMatchers.jsonPath("$.accountNumber", Matchers.is("1234567890")));
    }

    @Order(5)
    @Test
    public void testGetAccountByUserIdNotFound() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/accounts/user/999")
                        .with(SecurityMockMvcRequestPostProcessors.user("admin")
                                .authorities(new SimpleGrantedAuthority("ADMIN"))))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Order(6)
    @Test
    public void testDeleteAccountSuccess() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/accounts/" + testAccountId)
                        .with(SecurityMockMvcRequestPostProcessors.csrf())
                        .with(SecurityMockMvcRequestPostProcessors.user("admin")
                                .authorities(new SimpleGrantedAuthority("ADMIN"))))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isNoContent());
    }

    @Order(7)
    @Test
    public void testDeleteAccountNotFound() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/accounts/999")
                        .with(SecurityMockMvcRequestPostProcessors.csrf())
                        .with(SecurityMockMvcRequestPostProcessors.user("admin")
                                .authorities(new SimpleGrantedAuthority("ADMIN"))))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }
}
