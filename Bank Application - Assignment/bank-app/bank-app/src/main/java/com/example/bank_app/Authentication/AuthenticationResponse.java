package com.example.bank_app.Authentication;

import com.example.bank_app.User.User;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthenticationResponse {
    public AuthenticationResponse(String token, User user) {
        this.token = token;
        this.user = new User(user); // Defensive copy of the User object
    }

    private String token;
    private User user;

    public User getUser() {
        return new User(user);
    }

    public void setUser(User user) {
        this.user = new User(user);
    }

}
