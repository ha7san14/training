package com.example.bank_app.User;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //@Column(nullable = false, unique = true)
    private String username;

    //@Column(nullable = false)
    private String password;

    private String email;

    //@Column(nullable = false)
    private String roles;

    private String address;

}