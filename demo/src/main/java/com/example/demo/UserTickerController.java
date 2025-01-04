package com.example.demo;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/tickers")
public class UserTickerController {
    
    @Autowired  
    private UserTickerService userTickerService;


    @GetMapping("/{userId}")
    public List<Map<String, Object>> getTickers(@PathVariable int userId) {
        return userTickerService.getTickerDetailsByUserId(userId);
    }
}
