package com.example.demo;

import java.util.*;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class AlphaVantageService {
    private static final String API_URL = "https://www.alphavantage.co/query";
    private static final String API_KEY= "G6ZTQ8S7RE61SI1J";
    //private static final String API_KEY = "JFH4KC9RWIWSGRY5"; // Replace with your API key

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public AlphaVantageService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public Map<String, String> getCloseValues(String symbol) {
        String url = String.format(
                "%s?function=TIME_SERIES_DAILY&symbol=%s&apikey=%s",
                API_URL, symbol, API_KEY
        );

        try {
            // Fetch data from the API
            String response = restTemplate.getForObject(url, String.class);

            // Parse the JSON response
            JsonNode rootNode = objectMapper.readTree(response);
            JsonNode timeSeriesNode = rootNode.path("Time Series (Daily)");

            // Extract the first 10 date-close pairs
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
