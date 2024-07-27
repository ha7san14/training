package com.example.bank_app.Transaction;

import com.example.bank_app.Account.Account;
import jakarta.persistence.*;
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

    private String receiver_account_number;

    private String indicator;

    @ManyToOne
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;
}