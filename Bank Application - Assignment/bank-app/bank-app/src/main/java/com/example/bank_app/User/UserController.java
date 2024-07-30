package com.example.bank_app.User;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @GetMapping("/get-all-users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @PostMapping("/create-user")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        logger.info("Password in controller is " + user.getPassword());
        User createdUser = userService.saveUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        User updatedUser = userService.updateUser(user,id);
        if (updatedUser != null) {

            return ResponseEntity.ok(updatedUser);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @PreAuthorize("hasAnyAuthority('ACCOUNTHOLDER')")
    @PutMapping("/update-password/{id}")
    public ResponseEntity<String> updatePassword(@PathVariable Long id, @RequestParam String newPassword) {
        try {
            userService.updatePassword(id, newPassword);
            return ResponseEntity.ok("Password updated successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating password");
        }
    }

}
