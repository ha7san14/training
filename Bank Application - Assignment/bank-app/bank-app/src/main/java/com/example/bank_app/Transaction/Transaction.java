package com.example.bank_app.Transaction;

import com.example.bank_app.Account.Account;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity(name = "transaction")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime date;

    private String description;

    private BigDecimal amount;

    private String receiverAccountNumber;

    private String indicator;

    @ManyToOne
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    public Account getAccount() {
        return account != null ? new Account(account) : null;
    }

    public void setAccount(Account account) {
        this.account = account != null ? new Account(account) : null;
    }
}
