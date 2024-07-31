package com.example.bank_app;
import com.example.bank_app.Account.Account;
import com.example.bank_app.Account.AccountRepository;
import com.example.bank_app.Balance.Balance;
import com.example.bank_app.Balance.BalanceRepository;
import com.example.bank_app.Transaction.Transaction;
import com.example.bank_app.Transaction.TransactionService;
import com.example.bank_app.exceptionhandling.AccountNotFoundException;
import com.example.bank_app.exceptionhandling.InsufficientBalanceException;
import com.example.bank_app.exceptionhandling.InvalidTransactionIndicatorException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.*;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@ActiveProfiles("test")
public class TransactionApiTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TransactionService transactionService;

    @MockBean
    private AccountRepository accountRepository;

    @MockBean
    private BalanceRepository balanceRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private Transaction testTransaction;
    private Account testAccount;
    private Balance testBalance;

    @BeforeEach
    public void setup() {
        testAccount = new Account();
        testAccount.setId(1L);
        testAccount.setAccountNumber("123456");

        testBalance = new Balance();
        testBalance.setAmount(BigDecimal.valueOf(1000.00));
        testBalance.setAccount(testAccount);

        testTransaction = new Transaction();
        testTransaction.setId(1L);
        testTransaction.setDate(LocalDateTime.now());
        testTransaction.setAmount(BigDecimal.valueOf(1000.00));
        testTransaction.setDescription("Test Transaction");
        testTransaction.setReceiver_account_number("123456789");
        testTransaction.setIndicator("DB");
        testTransaction.setAccount(testAccount);
    }

    @Order(1)
    @Test
    public void testCreateTransactionSuccess() throws Exception {
        Mockito.when(transactionService.saveTransaction(Mockito.any(Transaction.class)))
                .thenReturn(testTransaction);
        Mockito.when(balanceRepository.findByAccount(Mockito.any(Account.class)))
                .thenReturn(testBalance);

        mockMvc.perform(post("/api/transactions/create-transaction")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testTransaction))
                        .with(SecurityMockMvcRequestPostProcessors.user("admin")
                                .authorities(new SimpleGrantedAuthority("ADMIN"))))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$.amount").value(1000.00))
                .andExpect(jsonPath("$.description").value("Test Transaction"));
    }

    @Order(2)
    @Test
    public void testCreateTransactionInsufficientBalance() throws Exception {
        testTransaction.setAmount(BigDecimal.valueOf(2000.00)); // Amount exceeds balance
        Mockito.when(transactionService.saveTransaction(Mockito.any(Transaction.class)))
                .thenThrow(new InsufficientBalanceException("Insufficient balance for the transaction"));

        mockMvc.perform(post("/api/transactions/create-transaction")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testTransaction))
                        .with(SecurityMockMvcRequestPostProcessors.user("admin")
                                .authorities(new SimpleGrantedAuthority("ADMIN"))))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Insufficient balance for the transaction"));
    }

    @Order(3)
    @Test
    public void testCreateTransactionAccountNotFound() throws Exception {
        Mockito.when(transactionService.saveTransaction(Mockito.any(Transaction.class)))
                .thenThrow(new AccountNotFoundException("Account not found"));

        mockMvc.perform(post("/api/transactions/create-transaction")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testTransaction))
                        .with(SecurityMockMvcRequestPostProcessors.user("admin")
                                .authorities(new SimpleGrantedAuthority("ADMIN"))))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Account not found"));
    }

    @Order(4)
    @Test
    public void testCreateTransactionInvalidIndicator() throws Exception {
        testTransaction.setIndicator("INVALID_INDICATOR");
        Mockito.when(transactionService.saveTransaction(Mockito.any(Transaction.class)))
                .thenThrow(new InvalidTransactionIndicatorException("Invalid transaction indicator"));

        mockMvc.perform(post("/api/transactions/create-transaction")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testTransaction))
                        .with(SecurityMockMvcRequestPostProcessors.user("admin")
                                .authorities(new SimpleGrantedAuthority("ADMIN"))))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Invalid transaction indicator"));
    }

    @Order(5)
    @Test
    public void testGetAllTransactions() throws Exception {
        List<Transaction> transactions = Arrays.asList(testTransaction);
        Mockito.when(transactionService.getAllTransactions()).thenReturn(transactions);

        mockMvc.perform(get("/api/transactions")
                        .with(SecurityMockMvcRequestPostProcessors.user("admin")
                                .authorities(new SimpleGrantedAuthority("ADMIN"))))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$[0].amount").value(1000.00))
                .andExpect(jsonPath("$[0].description").value("Test Transaction"));
    }

    @Order(6)
    @Test
    public void testGetTransactionById() throws Exception {
        Mockito.when(transactionService.getTransactionById(1L)).thenReturn(testTransaction);

        mockMvc.perform(get("/api/transactions/1")
                        .with(SecurityMockMvcRequestPostProcessors.user("admin")
                                .authorities(new SimpleGrantedAuthority("ADMIN"))))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$.amount").value(1000.00))
                .andExpect(jsonPath("$.description").value("Test Transaction"));
    }

    @Order(7)
    @Test
    public void testGetAllTransactionsByAccountId() throws Exception {
        List<Transaction> transactions = Arrays.asList(testTransaction);
        Mockito.when(transactionService.getAllTransactionsByAccountId(1L)).thenReturn(transactions);

        mockMvc.perform(get("/api/transactions/account/1")
                        .with(SecurityMockMvcRequestPostProcessors.user("admin")
                                .authorities(new SimpleGrantedAuthority("ADMIN"))))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$[0].amount").value(1000.00))
                .andExpect(jsonPath("$[0].description").value("Test Transaction"));
    }

    @Order(8)
    @Test
    public void testUpdateTransaction() throws Exception {
        Transaction updatedTransaction = new Transaction();
        updatedTransaction.setId(1L);
        updatedTransaction.setDate(LocalDateTime.now());
        updatedTransaction.setAmount(BigDecimal.valueOf(500.00));
        updatedTransaction.setDescription("Updated Transaction");
        updatedTransaction.setReceiver_account_number("987654321");
        updatedTransaction.setIndicator("CR");
        updatedTransaction.setAccount(testAccount);

        Mockito.when(transactionService.getTransactionById(1L)).thenReturn(testTransaction);
        Mockito.when(transactionService.saveTransaction(Mockito.any(Transaction.class))).thenReturn(updatedTransaction);

        mockMvc.perform(put("/api/transactions/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedTransaction))
                        .with(SecurityMockMvcRequestPostProcessors.user("admin")
                                .authorities(new SimpleGrantedAuthority("ADMIN"))))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$.amount").value(500.00))
                .andExpect(jsonPath("$.description").value("Updated Transaction"));
    }
}
