package com.example.bank_app.Authentication;

import com.example.bank_app.Security.JwtUtil;
import com.example.bank_app.User.CustomUserDetailsService;
import com.example.bank_app.User.User;
import com.example.bank_app.User.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthenticationRequest request) throws Exception {
        logger.info("Attempting to authenticate user: {}", request.getUsername());
        logger.info("Attempting to authenticate user: {}", request.getPassword());

        User user = userRepository.findByUsername(request.getUsername());
        try {

            logger.info("Attempting to authenticate user: {}", request.getUsername());
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        } catch (BadCredentialsException e) {
            logger.error("Authentication failed for user: {}", request.getUsername(), e);
            throw new Exception("Incorrect username or password", e);
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        final String jwt = jwtUtil.generateToken(userDetails.getUsername());

        logger.info("Authentication successful for user: {}", request.getUsername());

        return ResponseEntity.ok(new AuthenticationResponse(jwt, user));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User newUser) {
        // Password should be encoded before saving
        newUser.setPassword(new BCryptPasswordEncoder().encode(newUser.getPassword()));
        User user = userRepository.save(newUser);
        return ResponseEntity.ok(user);
    }
}