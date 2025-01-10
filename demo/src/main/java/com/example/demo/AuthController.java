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

    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signup(@RequestBody User user) {
        System.out.println("hey im in signup!! all good here!!!!");
        Integer id = userTickerService.getID(user.getUsername());
        String token = userService.signup(user);
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("userId", id);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestParam String username, @RequestParam String password) {
        System.out.println("hey im in /login!! all good here!!!!");
        String token = userService.login(username, password);
        System.out.println("username = "+ username);
        System.out.println("password = "+ password);
        Integer id = userTickerService.getID(username);
        System.out.println("id = "+ id);
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("userId", id);
        System.out.println("response = "+ response);
        return ResponseEntity.ok(response);
    }
}