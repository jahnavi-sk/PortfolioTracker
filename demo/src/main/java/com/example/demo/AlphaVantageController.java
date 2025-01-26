package com.example.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;
import java.util.stream.Collectors;

@RestController
public class AlphaVantageController {
    private final AlphaVantageService alphaVantageService;
    private final UserTickerService userTickerService;

    public AlphaVantageController(AlphaVantageService alphaVantageService, UserTickerService userTickerService ) {
        this.alphaVantageService = alphaVantageService;
        this.userTickerService = userTickerService;
    }


    // api to get the past values using AlphaVantageController API
    @GetMapping("/api/getCloseValues")
    public List<Map<String, Object>> getCloseValues(@RequestParam int userId) {
       
        List<Map<String, Object>> userTickerDetails = userTickerService.getTickerDetailsByUserId(userId);
        List<String> tickers = userTickerDetails.stream()
            .map(entry -> (String) entry.get("ticker"))
            .collect(Collectors.toList());
    
       
       
        Map<String, Map<String, String>> groupedCloseValues = new LinkedHashMap<>();
    
        for (String ticker : tickers) {

            Map<String, String> closeValues = alphaVantageService.getCloseValues(ticker);
            for (Map.Entry<String, String> entry : closeValues.entrySet()) {
                String date = entry.getKey();
                String closeValue = entry.getValue();
    
                groupedCloseValues.putIfAbsent(date, new HashMap<>());
                groupedCloseValues.get(date).put(ticker, closeValue);
            }
        }
    

        List<Map<String, Object>> response = new ArrayList<>();
        for (Map.Entry<String, Map<String, String>> entry : groupedCloseValues.entrySet()) {
            Map<String, Object> dataPoint = new HashMap<>();
            dataPoint.put("date", entry.getKey()); 
            dataPoint.putAll(entry.getValue());   
            response.add(dataPoint);
        }
        return response;
    }  
   
}
