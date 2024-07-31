package com.example.bank_app.Authentication;

import com.example.bank_app.User.User;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthenticationResponse {
    public AuthenticationResponse(String token, User user) {
        this.token = token;
        this.user = user;
    }

    private String token;
    private User user;


}
