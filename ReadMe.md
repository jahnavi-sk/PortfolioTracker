# Portfolio Tracker


###### Some information:
- This repository consists of the backend and the frontend folder.
- The backend is done using *Java SpringBoot*, which has been hosted onto *AWS*. The server is running currently.
- The frontend is done using *Next JS* which has been hosted on *Vercel*.
- The link to the frontend: https://portfolio-tracker-ui.vercel.app
- The database used here is *MySQL*.
- To check existing user, you can log in with username ```vi``` and password ```123```

### To run locally:

#### Backend Folder - Folder: Demo
- In ```/demo/src/main/resources/application.properties```, change the username and password to connect to your MySQL username and password.

*Since the server already runs on AWS, you don't need to run the backend server here.*

### Frontend Folder
```c
cd frontend
npm i // to get all dependencies
npm run dev
```
*Note: I'm using react@18.3.1, I faced some issues with version 19.*



### SQL Schema

1) Table: **users**
This table stores user information.

 Column Name | Data Type | Constraints | 
 --- | --- | --- | 
 user_id | INT | Primary Key, Auto Increment (starts at 1000) | 
 username |  VARCHAR(18) | Not Null, Unique |
 password | VARCHAR(100) | Not Null |
 email | VARCHAR(50) | Not Null, Unique |

2) Table: **user_ticker**

 Column Name | Data Type | Constraints | 
 --- | --- | --- | 
 id | INT | Primary Key, Auto Increment | 
 user_id |  INT | Foreign Key (references ```users.user_id```) |
 ticker | VARCHAR(10) | Not Null |
 stock_name | VARCHAR(80) | Not Null |
 buying_price | DOUBLE | |
 quantity | DOUBLE | |


## Additional API's used

- I have used ```Finnhub Stock API``` to get the current prices of stocks, and ```Alpha Vantage API``` to get the past prices of the stocks.

### Assumptions
- There is an assumption that the user will not buy the same stock twice.

### Limitations
- Since the *Finhubb Stock API* key and *Alpha Vantage API* key have limited daily access, the web app can be used only a few times, which leads to unexpected behavior at the sudden block of data.
- If it happens, please wait a few seconds and refresh the page, the page will reload (the API key will not fetch information again, but it won't throw an error.)
- If you would like to update the API values, go to ```/demo/src/main/resources/application.properties``` in the ```demo``` folder and you can update the values there.


### Functionalities

- The user can add stocks, delete stocks, and update the stock quantities.
- The portfolio metrics are updated every 5 minutes as well as when a stock is added or deleted or updated.
- The user's current stockholdings are shown clearly.
- There is an efficient logging-in and signing-up mechanism.
- The user ```vi``` has 5 stocks with varying quantities already.

