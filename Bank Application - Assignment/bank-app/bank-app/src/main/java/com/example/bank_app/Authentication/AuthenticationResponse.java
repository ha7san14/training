package com.example.bank_app.Authentication;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthenticationResponse {
    public AuthenticationResponse(String token) {
        this.token = token;
    }

    private String token;


}