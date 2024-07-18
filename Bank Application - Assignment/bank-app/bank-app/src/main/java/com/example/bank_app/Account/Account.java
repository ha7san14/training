package com.example.bank_app.Account;
import com.example.bank_app.User.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity(name = "account")
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //@Column(nullable = false)
    private String password;

    //@Column(nullable = false)
    private String name;

    //@Column(name = "account_number")
    private Long accountNumber;

    //@Column(nullable = false)
    private String email;

    //@Column(nullable = false)
    private String address;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}