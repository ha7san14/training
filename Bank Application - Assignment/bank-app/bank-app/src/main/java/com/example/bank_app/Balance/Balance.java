package com.example.bank_app.Balance;

import com.example.bank_app.Account.Account;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity(name = "balance")
public class Balance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //@Column(nullable = false)
    private LocalDateTime date;

    //@Column(nullable = false)
    private BigDecimal amount;

    //@Column(nullable = false)
//    private String indicator;

    @OneToOne
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;
}
