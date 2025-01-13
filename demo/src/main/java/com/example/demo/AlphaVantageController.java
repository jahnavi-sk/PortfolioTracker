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

    @GetMapping("/api/getCloseValues")
    public List<Map<String, Object>> getCloseValues(@RequestParam int userId) {
        // Get user ticker details and extract tickers
        List<Map<String, Object>> userTickerDetails = userTickerService.getTickerDetailsByUserId(userId);
        List<String> tickers = userTickerDetails.stream()
            .map(entry -> (String) entry.get("ticker"))
            .collect(Collectors.toList());
    
       // System.out.println("userTickerDetails = "+ userTickerDetails);
        // Prepare a map to store grouped close values by date
        Map<String, Map<String, String>> groupedCloseValues = new LinkedHashMap<>();
    
        // Iterate over each ticker to fetch close values
        for (String ticker : tickers) {

            Map<String, String> closeValues = alphaVantageService.getCloseValues(ticker);
            System.out.println("closeValues = "+ closeValues);
            // Group close values by date
            for (Map.Entry<String, String> entry : closeValues.entrySet()) {
                String date = entry.getKey();
                String closeValue = entry.getValue();
    
                // If the date is not already present, create a new map for it
                groupedCloseValues.putIfAbsent(date, new HashMap<>());
                // Add the close value to the map under the ticker
                groupedCloseValues.get(date).put(ticker, closeValue);
            }
        }
    

        // Now, transform the grouped data into the final response format
        List<Map<String, Object>> response = new ArrayList<>();
        for (Map.Entry<String, Map<String, String>> entry : groupedCloseValues.entrySet()) {
            Map<String, Object> dataPoint = new HashMap<>();
            dataPoint.put("date", entry.getKey()); // Set the date
            dataPoint.putAll(entry.getValue());    // Add tickers with their close values
            response.add(dataPoint);
        }
    

        System.out.println("response = "+ response);
        return response;
    }
    
    
    
    
    // public Map<String, String> getCloseValues(@RequestParam String symbol, @RequestParam int userId) {
    //     List<Map<String, Object>> userTickerDetails = userTickerService.getTickerDetailsByUserId(userId);
    //     return alphaVantageService.getCloseValues(symbol);
    // }
}
