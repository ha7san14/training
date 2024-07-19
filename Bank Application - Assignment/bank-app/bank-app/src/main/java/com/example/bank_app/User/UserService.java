package com.example.bank_app.User;


import com.example.bank_app.Account.Account;
import com.example.bank_app.Account.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;


    @Autowired
    public UserService(UserRepository userRepository, AccountRepository accountRepository) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public User saveUser(User user) {

        User newUser = userRepository.save(user);
        Account account = new Account();
        account.setAccountNumber(generateUniqueAccountNumber());
        account.setUser(newUser);
        accountRepository.save(account);
        return newUser;

    }

    public User updateUser(User user, Long id) {

        Optional<User> existingUser = userRepository.findById(id);
        if (existingUser.isPresent()) {
            User userToUpdate = existingUser.get();
            // Update fields of the existing user
            userToUpdate.setUsername(user.getUsername());
            userToUpdate.setPassword(user.getPassword());
            userToUpdate.setEmail(user.getEmail());
            userToUpdate.setAddress(user.getAddress());
            return userRepository.save(userToUpdate);
        }
        return null;
    }


//    public void deleteUser(Long id) {
//        User user = userRepository.findById(id).orElse(null);
//        if (user != null) {
//            Account account = accountRepository.findByUserId(user.getId());
//            if (account != null) {
//                accountRepository.delete(account);
//            }
//            userRepository.deleteById(id);
//        }
//    }

    private String generateUniqueAccountNumber() {
        return UUID.randomUUID().toString().replaceAll("-", "").substring(0, 12); // Example: generates a 12-character alphanumeric string
    }
}
