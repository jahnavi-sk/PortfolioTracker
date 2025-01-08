package com.example.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/check/user")
public class UserController {
    
    @GetMapping("/profile")
    public String getProfile() {
        return "This is a protected user profile!";
    }
}
