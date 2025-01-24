package com.example.demo;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.*;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserTickerService userTickerService;

    public UserController(UserTickerService userTickerService){
        this.userTickerService = userTickerService;
    }

    // function to fetch quantity data
    @GetMapping("/user/quantity")
    public List<Map<String, Object>> getQuantity(@RequestParam int userId) {
        List<Map<String, Object>> userTickerDetails = userTickerService.getQuantityDetails(userId);
        return userTickerDetails;
        
    }
    

    // function to update the quantities of stock
    @PutMapping("/user/updateQStock")
    public ResponseEntity<String> updateQStock(
        @RequestParam int userId, 
        @RequestParam String
        ticker,
        @RequestParam int quantity) {
        
        
        userTickerService.updateQuantityStock(userId,quantity,ticker);
        return ResponseEntity.ok("Stock updated successfully!");
    }


    // function to delete stock
    @DeleteMapping("/user/deleteStock")
    public ResponseEntity<String> deleteStock(
        @RequestParam int userId,
        @RequestParam String ticker
    ){
        userTickerService.deleteStock(userId, ticker);
        return ResponseEntity.ok("Stock deleted successfully!");
    }

    // function to add stock
    @PostMapping("/user/addStock")
    public ResponseEntity<String> addStock(
            @RequestParam int userId,
            @RequestParam String ticker,
            @RequestParam String stockName,
            @RequestParam double buyingPrice,
            @RequestParam int quantity
    ) {
       
        userTickerService.addStock(userId, ticker, stockName, buyingPrice, quantity);
        return ResponseEntity.ok("Stock added successfully!");
    }

}
