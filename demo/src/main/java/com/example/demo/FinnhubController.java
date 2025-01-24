package com.example.demo;
import java.util.*;
import java.util.stream.Collectors;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
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


    // helper function to get stock data of user
    private List<Map<String, Object>> getCombinedStockData(int userId) {
        List<Map<String, Object>> userTickerDetails = userTickerService.getUserTickerDetails(userId);
        String[] tickers = userTickerDetails.stream()
                .map(details -> (String) details.get("ticker"))
                .toArray(String[]::new);
        Map<String, Map<String, Object>> stockData = finnhubService.getStockDataForMultipleSymbols(tickers);
        return userTickerDetails.stream()
                .filter(userTicker -> stockData.containsKey(userTicker.get("ticker")))
                .map(userTicker -> {
                    String ticker = (String) userTicker.get("ticker");
                    Map<String, Object> stockInfo = stockData.get(ticker);
                    Map<String, Object> combined = new HashMap<>();
                    
                    combined.put("ticker", ticker);
                    combined.put("stockName", userTicker.get("stockName"));
                    combined.put("quantity", userTicker.get("quantity"));
                    combined.put("buyingPrice", safeGetDouble(userTicker.get("buyingPrice")));
                    combined.put("currentPrice", safeGetDouble(stockInfo.get("c")));
                    
                    return combined;
                })
                .collect(Collectors.toList());
    }

    // helper function to convert to double
    private double safeGetDouble(Object value) {
        if (value instanceof Number) {
            return ((Number) value).doubleValue();
        }
        return 0.0;
    }

    
    private double calculatePortfolioValue(List<Map<String, Object>> stockData) {
        return stockData.stream()
                .mapToDouble(stock -> 
                    (int) stock.get("quantity") * (double) stock.get("currentPrice"))
                .sum();
    }

    // api for top stock of user
    @GetMapping("/user/topStock")
    public Map<String, Object> getTopStock(@RequestParam int userId) {
        List<Map<String, Object>> combinedData = getCombinedStockData(userId);
        
     
        combinedData.forEach(stock -> {
            double currentPrice = (double) stock.get("currentPrice");
            double buyingPrice = (double) stock.get("buyingPrice");
            double performance = ((currentPrice - buyingPrice) / buyingPrice) * 100;
            stock.put("performance", performance);
        });

        double totalBuyingValue = combinedData.stream()
                .mapToDouble(stock -> (int) stock.get("quantity") * (double) stock.get("buyingPrice"))
                .sum();
        double totalCurrentValue = calculatePortfolioValue(combinedData);
        double totalPerformance = ((totalCurrentValue - totalBuyingValue) / totalBuyingValue) * 100;

        Map<String, Object> result = new HashMap<>();
        if (!combinedData.isEmpty()) {
            Map<String, Object> topStock = combinedData.stream()
                    .max(Comparator.comparingDouble(stock -> (double) stock.get("performance")))
                    .get();
            
            result.put("stockName", topStock.get("stockName"));
            result.put("performance", topStock.get("performance"));
        } else {
            result.put("stockName", "");
            result.put("performance", 0.0);
        }
        result.put("userPerformance", totalPerformance);
        
        return result;
    }

    // api for portfolio value of user
    @GetMapping("/user/portfolio")
    public Double getPortfolioValue(@RequestParam int userId) {
        return calculatePortfolioValue(getCombinedStockData(userId));
    
}

    // api for performance status of user
    @GetMapping("/user/status")
    public boolean getStatus(@RequestParam int userId) {
        
        List<Map<String, Object>> combinedData = getCombinedStockData(userId);
        double currentValue = calculatePortfolioValue(combinedData);
        double buyingValue = combinedData.stream()
                .mapToDouble(stock -> 
                    (int) stock.get("quantity") * (double) stock.get("buyingPrice"))
                .sum();
        return currentValue >= buyingValue;
        
    }

    
    // api to get details of the user
    @GetMapping("/user/details")
    public List<Map<String, Object>> getDetails(@RequestParam int userId){
        List<Map<String, Object>> combinedData = getCombinedStockData(userId);
        return combinedData;
        
    }

    // api to get the price of a stock using FinnHub API
    @GetMapping("/stock/price")
    public ResponseEntity<Map<String, Object>> getStockPrice(@RequestParam String symbol) {
        try {
            
            Map<String, Object> stockData = finnhubService.getStockData(symbol);
            if (stockData != null && stockData.containsKey("c")) {
                double currentPrice = (double) stockData.get("c");
                Map<String, Object> response = new HashMap<>();
                response.put("symbol", symbol);
                response.put("currentPrice", currentPrice);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(404).body(Map.of("error", "Stock data not found for symbol: " + symbol));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "An error occurred while fetching stock data: " + e.getMessage()));
        }
    }

     
    

}