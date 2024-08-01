package com.example.bank_app.Account;
import com.example.bank_app.User.User;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity(name = "account")
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String accountNumber;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    public User getUser() {
        return user != null ? new User(user) : null;
    }

    public void setUser(User user) {
        this.user = user != null ? new User(user) : null;
    }
    public Account() {

    }
    public Account(Account other) {
        this.id = other.id;
        this.accountNumber = other.accountNumber;
        this.user = other.user != null ? new User(other.user) : null;
    }
}

