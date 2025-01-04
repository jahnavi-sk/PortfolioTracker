package com.example.demo;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class FinnhubController {
    private final FinnhubService finnhubService;
    private final UserTickerService userTickerService;

    public FinnhubController(FinnhubService finnhubService, UserTickerService userTickerService) {
        this.finnhubService = finnhubService;
        this.userTickerService = userTickerService;
    }

    @DeleteMapping("/user/deleteStock")
    public ResponseEntity<String> deleteStock(
        @RequestParam int userId,
        @RequestParam String ticker
    ){
        System.out.println("Inside delete!");
        userTickerService.deleteStock(userId, ticker);
        return ResponseEntity.ok("Stock deleted successfully!");
    }

    @PostMapping("/user/addStock")
    public ResponseEntity<String> addStock(
            @RequestParam int userId,
            @RequestParam String ticker,
            @RequestParam String stockName,
            @RequestParam double buyingPrice,
            @RequestParam int quantity
    ) {
        System.out.println("hi!!!");
        System.out.println("Received: userId=" + userId + ", ticker=" + ticker + ", stockName=" + stockName);
        userTickerService.addStock(userId, ticker, stockName, buyingPrice, quantity);
        return ResponseEntity.ok("Stock added successfully!");
    }

    @GetMapping("/user/stocks")
    public List<Map<String, Object>> getUserStocks(@RequestParam int userId) {
        // Fetch user's tickers, buying prices, and quantities
        
        List<Map<String, Object>> userTickerDetails = userTickerService.getTickerDetailsByUserId(userId);

        
        // Prepare list of tickers
        String[] tickers = userTickerDetails.stream()
                .map(details -> (String) details.get("ticker"))
                .toArray(String[]::new);

        // Fetch stock data from Finnhub
        Map<String, Map<String, Object>> stockData = finnhubService.getStockDataForMultipleSymbols(tickers);
        double portfolio_value = 0.0;
        // Combine user's data with stock data
        List<Map<String, Object>> combinedResults = new ArrayList<>();
        for (Map<String, Object> userTicker : userTickerDetails) {
            String ticker = (String) userTicker.get("ticker");
            Map<String, Object> stockInfo = stockData.get(ticker);

            if (stockInfo != null) {
                Map<String, Object> combined = new HashMap<>(stockInfo);
                int quantity = (int) userTicker.get("quantity");
                double buyingPrice = (double) userTicker.get("buyingPrice");

                // Calculate the current market value of the stock in the portfolio
                double currentPrice = (double) stockInfo.get("c");  // 'c' is the current price from Finnhub
                portfolio_value += currentPrice * quantity;  // Adding current market value to portfolio
                
                // Add extra user data to the combined result
                combined.put("ticker", ticker);
                combined.put("userPrice", buyingPrice);
                combined.put("quantity", quantity);
                
                // Add the combined stock info to the results
                combinedResults.add(combined);
            }
        }
        Map<String, Object> portfolioVal = new HashMap<>();
        portfolioVal.put("portfolio_value", portfolio_value);
        combinedResults.add(portfolioVal);
        return combinedResults;
}
}
