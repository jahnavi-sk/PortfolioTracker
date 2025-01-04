package com.example.demo;
import jakarta.persistence.*;

@Entity
@Table(name = "user_tickers")
public class UserTicker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "ticker", nullable = false, length = 10)
    private String ticker;

    @Column(name = "stock_name", nullable = false, length = 80)
    private String stockName;

    @Column(name = "buying_price")
    private Double buyingPrice;

    @Column(name = "quantity")
    private Integer quantity;
    
}
