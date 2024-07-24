package com.example.bank_app.Account;
import com.example.bank_app.User.User;
import com.example.bank_app.User.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AccountService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;

    @Autowired
    public AccountService(AccountRepository accountRepository, UserRepository userRepository) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
    }

    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }

    public Account getAccountById(Long id) {
        return accountRepository.findById(id).orElse(null);
    }

    public Account saveAccount(Account account) {
        return accountRepository.save(account);
    }

    @Transactional
    public void deleteAccount(Long id) {
        Account account = accountRepository.findById(id).orElse(null);
        if (account != null) {
            User user = account.getUser();
            accountRepository.deleteById(id); // Delete the account first
            if (user != null) {
                userRepository.deleteById(user.getId()); // Then delete the user
            }
        }
    }
}
