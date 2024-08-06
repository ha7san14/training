package com.example.bank_app;

import com.example.bank_app.Account.Account;
import com.example.bank_app.Account.AccountRepository;
import com.example.bank_app.Balance.Balance;
import com.example.bank_app.Balance.BalanceRepository;
import jakarta.transaction.Transactional;
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

import java.math.BigDecimal;
import java.time.LocalDateTime;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@ActiveProfiles("test")
public class BalanceApiTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private BalanceRepository balanceRepository;

    @Autowired
    private AccountRepository accountRepository;

    private Long testAccountId;
    private Long testBalanceId;

    @BeforeEach
    @Transactional
    public void setUp() {
        balanceRepository.deleteAll();
        accountRepository.deleteAll();

        Account account = new Account();
        account.setAccountNumber("1234567890");
        Account savedAccount = accountRepository.save(account);
        testAccountId = savedAccount.getId();

        Balance balance = new Balance();
        //balance.setDate(LocalDateTime.now());
        balance.setAmount(BigDecimal.valueOf(1000.00));
        balance.setAccount(savedAccount);
        Balance savedBalance = balanceRepository.save(balance);
        testBalanceId = savedBalance.getId();
    }

    @Order(1)
    @Test
    public void testGetAllBalancesSuccess() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/balances")
                        .with(SecurityMockMvcRequestPostProcessors.user("admin")
                                .authorities(new SimpleGrantedAuthority("ADMIN"))))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(MockMvcResultMatchers.jsonPath("$", Matchers.hasSize(1)));
    }

    @Order(2)
    @Test
    public void testGetBalanceByIdSuccess() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/balances/" + testBalanceId)
                        .with(SecurityMockMvcRequestPostProcessors.user("admin")
                                .authorities(new SimpleGrantedAuthority("ADMIN"))))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(MockMvcResultMatchers.jsonPath("$.id", Matchers.is(testBalanceId.intValue())))
                .andExpect(MockMvcResultMatchers.jsonPath("$.amount", Matchers.is(1000.00)));
    }

    @Order(3)
    @Test
    public void testGetBalanceByIdNotFound() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/balances/999")
                        .with(SecurityMockMvcRequestPostProcessors.user("admin")
                                .authorities(new SimpleGrantedAuthority("ADMIN"))))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Order(4)
    @Test
    public void testGetBalanceByAccountIdSuccess() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/balances/account/" + testAccountId)
                        .with(SecurityMockMvcRequestPostProcessors.user("admin")
                                .authorities(new SimpleGrantedAuthority("ADMIN"))))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(MockMvcResultMatchers.jsonPath("$.id", Matchers.is(testBalanceId.intValue())))
                .andExpect(MockMvcResultMatchers.jsonPath("$.amount", Matchers.is(1000.00)));
    }

    @Order(5)
    @Test
    public void testGetBalanceByAccountIdNotFound() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/balances/account/999")
                        .with(SecurityMockMvcRequestPostProcessors.user("admin")
                                .authorities(new SimpleGrantedAuthority("ADMIN"))))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Order(6)
    @Test
    public void testUpdateBalanceSuccess() throws Exception {
        String updatedBalanceJson = "{ \"date\": \"" + LocalDateTime.now() + "\", \"amount\": 1500.00, \"account\": { \"id\": " + testAccountId + "} }";

        mockMvc.perform(MockMvcRequestBuilders.put("/api/balances/" + testBalanceId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updatedBalanceJson)
                        .with(SecurityMockMvcRequestPostProcessors.user("admin")
                                .authorities(new SimpleGrantedAuthority("ADMIN"))))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(MockMvcResultMatchers.jsonPath("$.amount", Matchers.is(1500.00)));
    }

    @Order(7)
    @Test
    public void testUpdateBalanceNotFound() throws Exception {
        String updatedBalanceJson = "{ \"date\": \"" + LocalDateTime.now() + "\", \"amount\": 1500.00, \"account\": { \"id\": " + testAccountId + "} }";

        mockMvc.perform(MockMvcRequestBuilders.put("/api/balances/999")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updatedBalanceJson)
                        .with(SecurityMockMvcRequestPostProcessors.user("admin")
                                .authorities(new SimpleGrantedAuthority("ADMIN"))))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Order(8)
    @Test
    public void testDeleteBalanceSuccess() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/balances/" + testBalanceId)
                        .with(SecurityMockMvcRequestPostProcessors.user("admin")
                                .authorities(new SimpleGrantedAuthority("ADMIN"))))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isNoContent());
    }

}
