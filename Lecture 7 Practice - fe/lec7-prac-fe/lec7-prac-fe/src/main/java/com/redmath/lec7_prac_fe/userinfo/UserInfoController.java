package com.redmath.lec7_prac_fe.userinfo;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
public class UserInfoController {
    @GetMapping("/api/v1/userinfo")
    public ResponseEntity<Map<String,Object>> userinfo(){
        return ResponseEntity.ok(Map.of("name", "Hassan", "age", 23, "created_at", LocalDateTime.now()));
    }
}
