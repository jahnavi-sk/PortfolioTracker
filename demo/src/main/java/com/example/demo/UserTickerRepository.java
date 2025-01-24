package com.example.demo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserTickerRepository extends JpaRepository<UserTicker, Integer> {

    @Query("SELECT ut.ticker, ut.buyingPrice, ut.quantity FROM UserTicker ut WHERE ut.user.userId = :userId")
    List<Object[]> findTickerDetailsByUserId(@Param("userId") int userId);

    // Query to add new stock
    @Modifying
    @Query(value = "INSERT INTO user_tickers (user_id, ticker, stock_name, buying_price, quantity) VALUES (:userId, :ticker, :stockName, :buyingPrice, :quantity)", nativeQuery = true)
    void addNewStock(
            @Param("userId") int userId,
            @Param("ticker") String ticker,
            @Param("stockName") String stockName,
            @Param("buyingPrice") double buyingPrice,
            @Param("quantity") int quantity
    );

    // Query to delete stock
    @Modifying
    @Query(value = "DELETE from user_tickers where user_id= :userId and ticker=:ticker", nativeQuery = true)
    void deleteStock(
            @Param("userId") int userId,
            @Param("ticker") String ticker
    );


    // Query to update quantity
    @Modifying
    @Query(value = "UPDATE user_tickers set quantity= :quantity where user_id= :userId and ticker=:ticker", nativeQuery = true)
    void updateQuantityStock(
            @Param("userId") int userId,
            @Param("quantity") int quantity,
            @Param("ticker") String ticker
    );

    // Query to fetch data
    @Query(value="SELECT ticker, stock_name, buying_price, quantity FROM user_tickers WHERE user_id = :userId",nativeQuery = true)
    List<Object[]> findUserTickerDetails(@Param("userId") int userId);

    // Query to fetch data
    @Query(value="SELECT ticker, stock_name, quantity FROM user_tickers WHERE user_id = :userId",nativeQuery = true)
    List<Object[]> findQuantityDetails(@Param("userId") int userId);

    // Query to fetch user id
    @Query(value="SELECT user_id from users where username= :username",nativeQuery = true)
    Integer findUserID(@Param("username") String username);

}
