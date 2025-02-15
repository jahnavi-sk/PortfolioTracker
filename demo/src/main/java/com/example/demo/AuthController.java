package com.example.demo;

import java.util.HashMap;
import java.util.Map;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;
    private final UserTickerService userTickerService;

    public AuthController(UserService userService, UserTickerService userTickerService ) {
        this.userService = userService;
        this.userTickerService = userTickerService;
    }


    // api to handle signup
    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signup(@RequestBody User user) {
        String token = userService.signup(user);
        Integer id = userTickerService.getID(user.getUsername());
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("userId", id);
        return ResponseEntity.ok(response);
    }


    // api to handle login
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestParam String username, @RequestParam String password) {
        
        String token = userService.login(username, password);
        Integer id = userTickerService.getID(username);
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("userId", id);
        return ResponseEntity.ok(response);
    }
}