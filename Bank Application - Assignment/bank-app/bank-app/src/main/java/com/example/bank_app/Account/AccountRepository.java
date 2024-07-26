package com.example.bank_app.Account;

import com.example.bank_app.User.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AccountRepository extends JpaRepository<Account, Long> {
    Account findByAccountNumber(String accountNumber);
    Account findByUserId(Long userId);
    @Query("SELECT a.user FROM account a WHERE a.accountNumber = :accountNumber")
    User findUserByAccountNumber(@Param("accountNumber") String accountNumber);
}
