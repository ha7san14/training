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

    //@Column(nullable = false)
    private LocalDateTime date;

    //@Column(nullable = false)
    private String description;

    //@Column(nullable = false)
    private BigDecimal amount;

    //@Column(name = "receiver_account_number", nullable = false)
    private Long receiver_account_number;

    //@Column(nullable = false)
    private String indicator;

    @ManyToOne
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;
}