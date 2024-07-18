package com.example.bank_app.Balance;


import com.example.bank_app.Account.Account;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BalanceRepository extends JpaRepository<Balance, Long> {
    Balance findByAccount(Account account);

}
