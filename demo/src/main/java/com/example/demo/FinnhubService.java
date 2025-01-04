package com.example.demo;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.client.RestTemplate;
import org.springframework.stereotype.Service;

@Service
public class FinnhubService {
    
    @Value("${my_api_key}")
    private String apiKey;

    private static final String FINNHUB_URL = "https://finnhub.io/api/v1/quote?symbol={symbol}&token={apiKey}";

    private final RestTemplate restTemplate;

    public FinnhubService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public Map<String, Object> getStockData(String symbol) {
        return restTemplate.getForObject(FINNHUB_URL, Map.class, symbol, apiKey);
    }

    public Map<String, Map<String, Object>> getStockDataForMultipleSymbols(String[] symbols) {
        Map<String, Map<String, Object>> results = new HashMap<>();
        for (String symbol : symbols) {
            Map<String, Object> stockData = getStockData(symbol);
            results.put(symbol, stockData);
        }
        return results;
    }
}
