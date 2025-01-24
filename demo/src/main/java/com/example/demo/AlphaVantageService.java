package com.example.demo;

import java.util.*;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class AlphaVantageService {
    private static final String API_URL = "https://www.alphavantage.co/query";
   
    @Value("${alphavantage.api.key}")// api key has limited accesses per day
    private String API_KEY;
    
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public AlphaVantageService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }


    // api to get the past values using AlphaVantageController API
    public Map<String, String> getCloseValues(String symbol) {
        String url = String.format(
                "%s?function=TIME_SERIES_DAILY&symbol=%s&apikey=%s",
                API_URL, symbol, API_KEY
        );

        try {

            String response = restTemplate.getForObject(url, String.class);
            JsonNode rootNode = objectMapper.readTree(response);
            JsonNode timeSeriesNode = rootNode.path("Time Series (Daily)");
            Map<String, String> dateCloseMap = new LinkedHashMap<>();
            int count = 0;

            Iterator<Map.Entry<String, JsonNode>> fields = timeSeriesNode.fields();
            while (fields.hasNext() && count < 10) {
                Map.Entry<String, JsonNode> entry = fields.next();
                String date = entry.getKey();
                String closeValue = entry.getValue().path("4. close").asText();

                dateCloseMap.put(date, closeValue);
                count++;
            }


            return dateCloseMap;

        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch or process data from Alpha Vantage API", e);
        }
    }


}
