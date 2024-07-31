package com.example.bank_app.User;

import com.example.bank_app.Account.Account;
import com.example.bank_app.Account.AccountRepository;
import com.example.bank_app.Balance.Balance;
import com.example.bank_app.Balance.BalanceRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {
    private static final Logger LOGGER = LoggerFactory.getLogger(UserService.class);
    private static final int MIN_PASSWORD_LENGTH = 8;
    private static final int ACCOUNT_NUMBER_LENGTH = 10;

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final BalanceRepository balanceRepository;

    @Autowired
    public UserService(UserRepository userRepository, AccountRepository accountRepository,
                       PasswordEncoder passwordEncoder, BalanceRepository balanceRepository) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
        this.balanceRepository = balanceRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @Transactional
    public User saveUser(User user) {
        try {
            String password = user.getPassword();
            if (!password.startsWith("$2a$")) {
                user.setPassword(passwordEncoder.encode(password));
            }
            user.setRoles("ACCOUNTHOLDER");

            User newUser = userRepository.save(user);
            LOGGER.info("User saved with ID: " + newUser.getId());

            Account existingAccount = accountRepository.findByUserId(newUser.getId());
            if (existingAccount == null) {
                Account account = new Account();
                account.setAccountNumber(generateUniqueAccountNumber());
                account.setUser(newUser);
                accountRepository.save(account);
            } else {
                existingAccount = accountRepository.findById(existingAccount.getId()).orElse(null);
            }

            if (existingAccount != null) {
                Balance existingBalance = balanceRepository.findByAccountId(existingAccount.getId());
                if (existingBalance == null) {
                    Balance balance = new Balance();
                    balance.setAccount(existingAccount);
                    balance.setAmount(BigDecimal.ZERO);
                    balance.setDate(LocalDateTime.now());
                    balanceRepository.save(balance);
                }
            }

            return newUser;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error saving user or account", e);
        }
    }

    public User updateUser(User user, Long id) {
        Optional<User> existingUser = userRepository.findById(id);
        if (existingUser.isPresent()) {
            User userToUpdate = existingUser.get();
            userToUpdate.setUsername(user.getUsername());
            if (user.getPassword() != null && !user.getPassword().isEmpty()) {
                if (user.getPassword().length() >= MIN_PASSWORD_LENGTH) {
                    userToUpdate.setPassword(passwordEncoder.encode(user.getPassword()));
                } else {
                    throw new IllegalArgumentException("Password must be at least " + MIN_PASSWORD_LENGTH + " characters long.");
                }
            }

            userToUpdate.setEmail(user.getEmail());
            userToUpdate.setAddress(user.getAddress());
            return userRepository.save(userToUpdate);
        }
        return null;
    }

    public void updatePassword(Long id, String newPassword) {
        User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (newPassword.length() < MIN_PASSWORD_LENGTH) {
            throw new IllegalArgumentException("Password must be at least " + MIN_PASSWORD_LENGTH + " characters long.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    private String generateUniqueAccountNumber() {
        return UUID.randomUUID().toString().replaceAll("-", "").substring(0, ACCOUNT_NUMBER_LENGTH);
    }
}
