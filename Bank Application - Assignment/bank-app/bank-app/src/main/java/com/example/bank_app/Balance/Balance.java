package com.example.bank_app.Balance;

import com.example.bank_app.Account.Account;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.Getter;
import lombok.Setter;


import java.math.BigDecimal;


@Getter
@Setter
@Entity(name = "balance")
public class Balance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

//    private LocalDateTime date;

    private BigDecimal amount;

    @OneToOne
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    public Account getAccount() {
        return account != null ? new Account(account) : null;
    }

    public void setAccount(Account account) {
        this.account = account != null ? new Account(account) : null;
    }
    public Balance() {

    }

    public Balance(Balance other) {
        this.id = other.id;
       // this.date = other.date;
        this.amount = other.amount;
        this.account = other.account;
    }
}
