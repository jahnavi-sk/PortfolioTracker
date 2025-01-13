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
import org.springframework.web.bind.annotation.PutMapping;



@RestController
@RequestMapping("/api")
public class FinnhubController {
    private final FinnhubService finnhubService;
    private final UserTickerService userTickerService;

    public FinnhubController(FinnhubService finnhubService, UserTickerService userTickerService) {
        this.finnhubService = finnhubService;
        this.userTickerService = userTickerService;
    }

    @PutMapping("/user/updateQStock")
    public ResponseEntity<String> updateQStock(
        @RequestParam int userId, 
        @RequestParam String
        ticker,
        @RequestParam int quantity) {
        
        System.out.println("Inside update!");
        userTickerService.updateQuantityStock(userId,quantity,ticker);
        return ResponseEntity.ok("Stock updated successfully!");
    }

    @DeleteMapping("/user/deleteStock")
    public ResponseEntity<String> deleteStock(
        @RequestParam int userId,
        @RequestParam String ticker
    ){
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


    @GetMapping("/user/quantity")
    public List<Map<String, Object>> getQuantity(@RequestParam int userId) {
        List<Map<String, Object>> userTickerDetails = userTickerService.getQuantityDetails(userId);
        return userTickerDetails;
        
    }
    

    @GetMapping("/user/topStock")
    public Map<String, Object> getTopStock(@RequestParam int userId) {
        List<Map<String, Object>> userTickerDetails = userTickerService.getUserTickerDetails(userId);

        // Prepare list of tickers
        String[] tickers = userTickerDetails.stream()
                .map(details -> (String) details.get("ticker"))
                .toArray(String[]::new);

        // Fetch stock data from Finnhub
        Map<String, Map<String, Object>> stockData = finnhubService.getStockDataForMultipleSymbols(tickers);

        // Combine user's data with stock data
        List<Map<String, Object>> combinedResults = new ArrayList<>();
        for (Map<String, Object> userTicker : userTickerDetails) {
            String ticker = (String) userTicker.get("ticker");
            Map<String, Object> stockInfo = stockData.get(ticker);

            if (stockInfo != null) {
                Map<String, Object> combined = new HashMap<>();
                double current_price = (double) stockInfo.get("c");

                // Safely convert buyingPrice to Double
                double buyingPrice = 0.0;
                Object buyingPriceObj = userTicker.get("buyingPrice");
                if (buyingPriceObj instanceof Number) {
                    buyingPrice = ((Number) buyingPriceObj).doubleValue();
                }

                Double performance = ((current_price - buyingPrice) / buyingPrice) * 100;

                String name = (String) userTicker.get("stockName");

                // Add extra user data to the combined result
                combined.put("ticker", ticker);
                combined.put("stockName", name);
                combined.put("performance", performance);
                combinedResults.add(combined);
            }
        }

        // Sort by performance in descending order
        combinedResults.sort((Map<String, Object> a, Map<String, Object> b) -> {
            Double performanceA = (Double) a.get("performance");
            Double performanceB = (Double) b.get("performance");
            return performanceB.compareTo(performanceA); // Sorting in descending order
        });

        // Return the top stock's name and performance as a map
        Map<String, Object> topStock = combinedResults.get(0);
        Map<String, Object> result = new HashMap<>();
        result.put("stockName", topStock.get("stockName"));
        result.put("performance", topStock.get("performance"));

        return result;
    }

    

    @GetMapping("/user/details")
    public List<Map<String, Object>> getDetails(@RequestParam int userId){
        //List<Map<String, Object>> userTickerDetails = userTickerService.getTickerDetailsByUserId(userId);
        List<Map<String, Object>> userTickerDetails = userTickerService.getUserTickerDetails(userId);
        
        
        // Prepare list of tickers
        String[] tickers = userTickerDetails.stream()
                .map(details -> (String) details.get("ticker"))
                .toArray(String[]::new);

        // Fetch stock data from Finnhub
        Map<String, Map<String, Object>> stockData = finnhubService.getStockDataForMultipleSymbols(tickers);
        // Combine user's data with stock data
        List<Map<String, Object>> combinedResults = new ArrayList<>();
        for (Map<String, Object> userTicker : userTickerDetails) {
            String ticker = (String) userTicker.get("ticker");
            Map<String, Object> stockInfo = stockData.get(ticker);
        
            if (stockInfo != null) {
                //Map<String, Object> combined = new HashMap<>(stockInfo);
                Map<String, Object> combined = new HashMap<>();
                combined.put("closingPrice", stockInfo.get("c"));
        
                int quantity = (int) userTicker.get("quantity");
        
                // Safely convert buyingPrice to Double
                double buyingPrice = 0.0;
                Object buyingPriceObj = userTicker.get("buyingPrice");
                if (buyingPriceObj instanceof Number) {
                    buyingPrice = ((Number) buyingPriceObj).doubleValue();
                }

                String name = (String)userTicker.get("stockName");
                // Add extra user data to the combined result
                combined.put("ticker", ticker);
                combined.put("stockName", name);
                combined.put("buyingPrice", buyingPrice);
                combined.put("quantity", quantity);
                combinedResults.add(combined);
            }
        }
        
        //List<Map<String, Object>> userDetails = userTickerService.getUserTickerDetails(userId);
        return combinedResults;
    }

    @GetMapping("/user/stocks")
    public List<Map<String, Object>> getUserStocks(@RequestParam int userId) {
        // Fetch user's tickers, buying prices, and quantities
        System.out.println("hiii");
        List<Map<String, Object>> userTickerDetails = userTickerService.getTickerDetailsByUserId(userId);
        //List<Map<String, Object>> userTickerDetails = userTickerService.getUserTickerDetails(userId);


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
        
                // Safely convert buyingPrice to Double
                double buyingPrice = 0.0;
                Object buyingPriceObj = userTicker.get("buyingPrice");
                if (buyingPriceObj instanceof Number) {
                    buyingPrice = ((Number) buyingPriceObj).doubleValue();
                }
        
                // Safely convert currentPrice to Double
                double currentPrice = 0.0;
                Object currentPriceObj = stockInfo.get("c");
                if (currentPriceObj instanceof Number) {
                    currentPrice = ((Number) currentPriceObj).doubleValue();
                }
        
                portfolio_value += currentPrice * quantity;
        
                // Add extra user data to the combined result
                combined.put("ticker", ticker);
                combined.put("userPrice", buyingPrice);
                combined.put("quantity", quantity);
        
                combinedResults.add(combined);
            }
        }
        
        Map<String, Object> portfolioVal = new HashMap<>();
        portfolioVal.put("portfolio_value", portfolio_value);
        combinedResults.add(portfolioVal);
        return combinedResults;
}

    @GetMapping("/user/portfolio")
    public Double getPortfolioValue(@RequestParam int userId) {
    // Fetch user's tickers, buying prices, and quantities
    System.out.println("hiii");
    List<Map<String, Object>> userTickerDetails = userTickerService.getTickerDetailsByUserId(userId);

    // Prepare list of tickers
    String[] tickers = userTickerDetails.stream()
            .map(details -> (String) details.get("ticker"))
            .toArray(String[]::new);

    
    Map<String, Map<String, Object>> stockData = finnhubService.getStockDataForMultipleSymbols(tickers);
    double portfolio_value = 0.0;
    
    for (Map<String, Object> userTicker : userTickerDetails) {
        String ticker = (String) userTicker.get("ticker");
        Map<String, Object> stockInfo = stockData.get(ticker);
    
        if (stockInfo != null) {
            int quantity = (int) userTicker.get("quantity");
            // Safely convert currentPrice to Double
            double currentPrice = 0.0;
            Object currentPriceObj = stockInfo.get("c");
            if (currentPriceObj instanceof Number) {
                currentPrice = ((Number) currentPriceObj).doubleValue();
            }
            portfolio_value += currentPrice * quantity;        
        }
    }
    
    
    return portfolio_value;
}

    @GetMapping("/user/status")
    public boolean getStatus(@RequestParam int userId) {
        // Fetch user's tickers, buying prices, and quantities
        System.out.println("hiii");
        List<Map<String, Object>> userTickerDetails = userTickerService.getTickerDetailsByUserId(userId);
       
        // Prepare list of tickers
        String[] tickers = userTickerDetails.stream()
                .map(details -> (String) details.get("ticker"))
                .toArray(String[]::new);

        // Fetch stock data from Finnhub
        Map<String, Map<String, Object>> stockData = finnhubService.getStockDataForMultipleSymbols(tickers);
        double portfolio_value = 0.0;
        double portfolio_user = 0.0;

        // Combine user's data with stock data
        List<Map<String, Object>> combinedResults = new ArrayList<>();
        for (Map<String, Object> userTicker : userTickerDetails) {
            String ticker = (String) userTicker.get("ticker");
            Map<String, Object> stockInfo = stockData.get(ticker);
        
            if (stockInfo != null) {
                Map<String, Object> combined = new HashMap<>(stockInfo);
        
                int quantity = (int) userTicker.get("quantity");
        
                // Safely convert buyingPrice to Double
                double buyingPrice = 0.0;
                Object buyingPriceObj = userTicker.get("buyingPrice");
                if (buyingPriceObj instanceof Number) {
                    buyingPrice = ((Number) buyingPriceObj).doubleValue();
                }
        
                // Safely convert currentPrice to Double
                double currentPrice = 0.0;
                Object currentPriceObj = stockInfo.get("c");
                if (currentPriceObj instanceof Number) {
                    currentPrice = ((Number) currentPriceObj).doubleValue();
                }
        
                portfolio_value += currentPrice * quantity;
                portfolio_user += buyingPrice * quantity;
                // Add extra user data to the combined result
                combined.put("ticker", ticker);
                combined.put("userPrice", buyingPrice);
                combined.put("quantity", quantity);
        
                combinedResults.add(combined);
            }
        }
        
        System.out.println("portfolio_value ="+ portfolio_value);
        System.out.println("portfolio_user ="+ portfolio_user);
        if(portfolio_user > portfolio_value){
            
            return false;
        }
        return true;
    
}


    @GetMapping("/stock/price")
    public ResponseEntity<Map<String, Object>> getStockPrice(@RequestParam String symbol) {
        try {
            // Fetch stock data for the given symbol
            System.out.println("symbol = "+ symbol);
            Map<String, Object> stockData = finnhubService.getStockData(symbol);
            System.out.println("stockData = "+ stockData);
            System.out.println("2nd cond  = " + stockData.containsKey("c"));
            if (stockData != null && stockData.containsKey("c")) {
                // Extract the current price ("c" field) and return it
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