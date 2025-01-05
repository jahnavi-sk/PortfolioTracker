package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import java.util.stream.Collectors;



@Service
public class UserTickerService {
    @Autowired
    private UserTickerRepository userTickerRepository;

    public UserTickerService(UserTickerRepository userTickerRepository) {
        this.userTickerRepository = userTickerRepository;
    }

    public List<Map<String, Object>> getTickerDetailsByUserId(int userId) {
        return userTickerRepository.findTickerDetailsByUserId(userId).stream()
                .map(record -> {
                    Map<String, Object> details = new HashMap<>();
                    details.put("ticker", record[0]);
                    details.put("buyingPrice", record[1]);
                    details.put("quantity", record[2]);
                    return details;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public void addStock(int userId, String ticker, String stockName, double buyingPrice, int quantity) {
        userTickerRepository.addNewStock(userId, ticker, stockName, buyingPrice, quantity);
    }

    @Transactional
    public void deleteStock(int userId, String ticker) {
        userTickerRepository.deleteStock(userId, ticker);
    }

    @Transactional
    public void updateQuantityStock(int userId, int quantity, String ticker) {
        userTickerRepository.updateQuantityStock(userId,quantity,ticker);
    }
}



