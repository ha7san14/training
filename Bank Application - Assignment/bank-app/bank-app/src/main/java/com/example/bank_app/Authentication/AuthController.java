package com.example.bank_app.Authentication;

import com.example.bank_app.Security.JwtUtil;
import com.example.bank_app.User.CustomUserDetailsService;
import com.example.bank_app.User.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    private static final Logger LOGGER = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthenticationRequest request) {
        try {
            LOGGER.info("Attempting to authenticate user: {}", request.getUsername());

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

            final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
            final String jwt = jwtUtil.generateToken(userDetails.getUsername());

            LOGGER.info("Authentication successful for user: {}", request.getUsername());

            return ResponseEntity.ok(new AuthenticationResponse(jwt, userRepository.findByUsername(request.getUsername())));

        } catch (BadCredentialsException e) {
            LOGGER.error("Authentication failed for user: {}", request.getUsername(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect username or password");

        } catch (Exception e) {
            LOGGER.error("An unexpected error occurred during authentication: {}", request.getUsername(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
        }
    }
}
