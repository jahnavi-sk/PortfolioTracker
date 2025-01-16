"use client";
import axios from 'axios';

import React, { useState, useEffect, FormEvent, ChangeEvent, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '../../components/ui/button';
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useRouter } from "next/navigation";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { ArrowDownIcon, ArrowUpIcon, Pencil, Trash2, LogOut } from 'lucide-react';
import {
    Alert,
    AlertDescription,
  } from "../../components/ui/alert";
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "../../components/ui/dialog"
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"


const colors = [
    '#10b981', // emerald
    '#3b82f6', // blue
    '#f97316', // orange
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#14b8a6', // teal
    '#f59e0b', // amber
    '#6366f1', // indigo
    '#ef4444', // red
  ];

  
interface StockDetail {
    ticker: string;
    stockName: string;
    buyingPrice: number;
    quantity: number;
    closingPrice: number;
  }

interface CloseValueData {
    date: string;
    [key: string]: string | number; // Allow string or number values for ticker prices
}

interface TransformedData {
    date: string;
    [key: string]: string | number;
}

interface QuantityData {
    ticker: string;
    stockName: string;
    quantity: number;
  }
  
  interface ProcessedQuantityData {
    ticker: string;
    quantity: number;
    value: number;
    color: string;
  }

  interface Stock {
    ticker: string;
    stockName: string;
    buyingPrice: number;
    closingPrice: number;
    quantity: number;
  }
  
  interface StockTableProps {
    tableVal: Stock[];
    isLoading: boolean;
    handleEdit: (ticker: string) => void;
    handleDeleteClick: (ticker: string) => void;
  }

export default function SalesDashboard() {
    const [topStock, setTopStock] = useState({ stockName: '', performance: 0 , userPerformance: 0});
    
    const [portfolioValue, setPortfolioValue] = useState({ value: 0, isPositive: true });
    const [salesData, setSalesData] = useState<TransformedData[]>([]);
    const [quantityData, setQuantityData] = useState<QuantityData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [tableVal, setTableVal] = useState<StockDetail[]>([]);
    const [stockToDelete, setStockToDelete] = useState<string | null>(null);
    const [editingStock, setEditingStock] = useState<StockDetail | null>(null);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [newQuantity, setNewQuantity] = useState('');
    const [inactivityTimer, setInactivityTimer] = useState<NodeJS.Timeout | null>(null);
    const router = useRouter();
    const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
    //const { userID } = router.
    //const userID = '1010';
    const [userID, setUserID] = useState<string | null>(null);
    const [isNewUser, setIsNewUser] = useState(false);
    

    
    useEffect(() => {
        // Function to handle user activity
        const handleUserActivity = () => {
            resetInactivityTimer();
        };

        // Add event listeners for user interactions
        window.addEventListener('mousemove', handleUserActivity);
        window.addEventListener('keypress', handleUserActivity);
        window.addEventListener('click', handleUserActivity);
        window.addEventListener('scroll', handleUserActivity);
        window.addEventListener('touchstart', handleUserActivity);

        // Initialize the timer when component mounts
        resetInactivityTimer();

        // Cleanup function
        return () => {
            // Remove all event listeners
            window.removeEventListener('mousemove', handleUserActivity);
            window.removeEventListener('keypress', handleUserActivity);
            window.removeEventListener('click', handleUserActivity);
            window.removeEventListener('scroll', handleUserActivity);
            window.removeEventListener('touchstart', handleUserActivity);

            // Clear the timeout if component unmounts
            if (inactivityTimer) {
                clearTimeout(inactivityTimer);
            }
        };
    }, []); 

    
    
    useEffect(() => {
        // Get userId from localStorage at component mount
        const storedUserId = localStorage.getItem('userId');
        setUserID(storedUserId);
    }, []);

    
    
    // useEffect(() => {
    //     if (!userID) return;
    
    //     let isNew = false;
    //     const fetchData = async () => {
    //         try {
    //             const [
    //                 topStockRes,
    //                 portfolioRes,
    //                 statusRes,
    //                 closeValuesRes,
    //                 quantityRes,
    //                 tableRes,
    //             ] = await Promise.all([
    //                 axios.get(`http://localhost:8080/api/user/topStock?userId=${userID}`),
    //                 axios.get(`http://localhost:8080/api/user/portfolio?userId=${userID}`),
    //                 axios.get(`http://localhost:8080/api/user/status?userId=${userID}`),
    //                 axios.get<CloseValueData[]>(`http://localhost:8080/api/getCloseValues?userId=${userID}`),
    //                 axios.get<QuantityData[]>(`http://localhost:8080/api/user/quantity?userId=${userID}`),
    //                 axios.get<StockDetail[]>(`http://localhost:8080/api/user/details?userId=${userID}`)
    //             ]);
    
    //             // Update isNewUser based on table data
    //             isNew = !tableRes.data || tableRes.data.length === 0;
    //             setIsNewUser(isNew);
    
    //             // Always update the states, even if the user is new
    //             setTopStock(topStockRes.data || { stockName: '', performance: 0 });
    //             setPortfolioValue({
    //                 value: portfolioRes.data || 0,
    //                 isPositive: statusRes.data || true
    //             });
    //             setQuantityData(quantityRes.data || []);
    //             setTableVal(tableRes.data || []);
    
    //             if (closeValuesRes.data) {
    //                 const transformedData = closeValuesRes.data.map(item => {
    //                     const dataPoint: TransformedData = { date: item.date };
    //                     Object.entries(item).forEach(([key, value]) => {
    //                         if (key !== 'date' && typeof value === 'string') {
    //                             dataPoint[key] = parseFloat(value);
    //                         }
    //                     });
    //                     return dataPoint;
    //                 });
    //                 setSalesData(transformedData);
    //             }
    
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //             if (!isNew) {
    //                 setError('Failed to load portfolio data');
    //             }
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     };
    
    //     fetchData();
    // }, [userID]);



    useEffect(() => {
        if (!userID) return;
    
        let isNew = false;
        const fetchData = async () => {
            try {
                const [
                    topStockRes,
                    portfolioRes,
                    statusRes,
                    closeValuesRes,
                    quantityRes,
                    tableRes,
                ] = await Promise.all([
                    axios.get(`http://localhost:8080/api/user/topStock?userId=${userID}`),
                    axios.get(`http://localhost:8080/api/user/portfolio?userId=${userID}`),
                    axios.get(`http://localhost:8080/api/user/status?userId=${userID}`),
                    axios.get<CloseValueData[]>(`http://localhost:8080/api/getCloseValues?userId=${userID}`),
                    axios.get<QuantityData[]>(`http://localhost:8080/api/user/quantity?userId=${userID}`),
                    axios.get<StockDetail[]>(`http://localhost:8080/api/user/details?userId=${userID}`)
                ]);
    
                // Update isNewUser based on table data
                isNew = !tableRes.data || tableRes.data.length === 0;
                setIsNewUser(isNew);
    
                // Always update the states, even if the user is new
                setTopStock(topStockRes.data || { stockName: '', performance: 0 });
                setPortfolioValue({
                    value: portfolioRes.data || 0,
                    isPositive: statusRes.data || true
                });
                setQuantityData(quantityRes.data || []);
                setTableVal(tableRes.data || []);
    
                if (closeValuesRes.data) {
                    const transformedData = closeValuesRes.data.map(item => {
                        const dataPoint: TransformedData = { date: item.date };
                        Object.entries(item).forEach(([key, value]) => {
                            if (key !== 'date' && typeof value === 'string') {
                                dataPoint[key] = parseFloat(value);
                            }
                        });
                        return dataPoint;
                    });
                    setSalesData(transformedData);
                }
    
            } catch (error: unknown) {
                // Handle specific Axios error
                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 403) {
                        // Skip the error for no stocks case
                        console.log('User has no stocks. Skipping error display.');
                        setTopStock({ stockName: '', performance: 0 });
                        setPortfolioValue({ value: 0, isPositive: true });
                        setQuantityData([]);
                        setTableVal([]);
                        setSalesData([]);
                        setIsNewUser(true);  // You could also mark as new if needed
                    } else {
                        // Handle other Axios errors (e.g., network issues)
                        console.error('Failed to load data:', error);
                        setError('Failed to load portfolio data');
                    }
                } else {
                    // Handle unexpected non-Axios errors
                    console.error('Unexpected error:', error);
                    setError('An unexpected error occurred');
                }
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchData();
    }, [userID]);
    
    const processedQuantityData = React.useMemo(() => {
        if (!quantityData.length) return [];

        const totalQuantity = quantityData.reduce((sum, item) => sum + item.quantity, 0);
        
        return quantityData.map((item, index) => ({
            ticker: item.ticker,
            quantity: item.quantity,
            value: parseFloat(((item.quantity / totalQuantity) * 100).toFixed(1)),
            color: colors[index % colors.length]
        }));
    }, [quantityData]);

    const dataKeys = salesData.length > 0 
        ? Object.keys(salesData[0]).filter(key => key !== 'date')
        : [];
    //const dataKeys = Object.keys(salesData[0]).filter(key => key !== 'month');

    

    const handleLogout = () => {
        // Add your logout logic here
        if (inactivityTimerRef.current) {
            clearTimeout(inactivityTimerRef.current);
        }
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiry');
        localStorage.removeItem('userId');
        router.push('/');
    };


    const resetInactivityTimer = () => {
        if (inactivityTimerRef.current) {
            clearTimeout(inactivityTimerRef.current);
        }

        inactivityTimerRef.current = setTimeout(() => {
            handleLogout();
        }, 300000); // 1 minute
    };


    
    const handleDeleteClick = (ticker: string) => {
        setStockToDelete(ticker);
    };
    
    const handleConfirmDelete = async () => {
        if (!stockToDelete) return;
        
        setIsLoading(true);
        try {
            await axios.delete(`http://localhost:8080/api/user/deleteStock`, {
                params: {
                    userId: userID,
                    ticker: stockToDelete
                }
            });
    
            // Update table data
            setTableVal(tableVal.filter(item => item.ticker !== stockToDelete));
    
            // Refresh other data
            const [
                topStockRes,
                portfolioRes,
                statusRes,
                quantityRes,
                closeValuesRes
            ] = await Promise.all([
                axios.get(`http://localhost:8080/api/user/topStock?userId=${userID}`),
                axios.get(`http://localhost:8080/api/user/portfolio?userId=${userID}`),
                axios.get(`http://localhost:8080/api/user/status?userId=${userID}`),
                axios.get(`http://localhost:8080/api/user/quantity?userId=${userID}`),
                axios.get<CloseValueData[]>(`http://localhost:8080/api/getCloseValues?userId=${userID}`)
            ]);
    
    
            setTopStock(topStockRes.data);
            setPortfolioValue({
                value: portfolioRes.data,
                isPositive: statusRes.data
            });
            setQuantityData(quantityRes.data);
            if (closeValuesRes.data) {
                const transformedData = closeValuesRes.data.map(item => {
                    const dataPoint: TransformedData = { date: item.date };
                    Object.entries(item).forEach(([key, value]) => {
                        if (key !== 'date' && typeof value === 'string') {
                            dataPoint[key] = parseFloat(value);
                        }
                    });
                    return dataPoint;
                });
                setSalesData(transformedData);
            }
            setError('');
        } catch (error) {
            console.error('Error deleting stock:', error);
            setError('Failed to delete stock. Please try again.');
        }
        setIsLoading(false);
        setStockToDelete(null);
    };
    
    const handleEdit = (ticker: string) => {
        const stock = tableVal.find(s => s.ticker === ticker);
        if (stock) {
            setEditingStock(stock);
            setNewQuantity(stock.quantity.toString());
            setShowEditDialog(true);
        }
    };

    const handleEditSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!editingStock || !newQuantity) return;

        try {
            await axios.put(`http://localhost:8080/api/user/updateQStock`, null, {
                params: {
                    userId: userID,
                    ticker: editingStock.ticker,
                    quantity: parseInt(newQuantity)
                }
            });

            // Update local state
            setTableVal(prev => prev.map(stock => 
                stock.ticker === editingStock.ticker 
                    ? { ...stock, quantity: parseInt(newQuantity) }
                    : stock
            ));

            setShowEditDialog(false);
            setEditingStock(null);
            setNewQuantity('');


            const [topStockRes, portfolioRes, statusRes, quantityRes] = await Promise.all([
                axios.get(`http://localhost:8080/api/user/topStock?userId=${userID}`),
                axios.get(`http://localhost:8080/api/user/portfolio?userId=${userID}`),
                axios.get(`http://localhost:8080/api/user/status?userId=${userID}`),
                axios.get(`http://localhost:8080/api/user/quantity?userId=${userID}`)
            ]);
    
            setTopStock(topStockRes.data);
            setPortfolioValue({
                value: portfolioRes.data,
                isPositive: statusRes.data
            });
            setQuantityData(quantityRes.data);
            setError('');

        } catch (error) {
            console.error('Error updating stock:', error);
            setError('Failed to update stock quantity. Please try again.');
        }
    };
    
      // Use explicit types for form data
      const [formData, setFormData] = useState({
        stockName: '',
        ticker: '',
        quantity: '',
        buyingPrice: '',
        currentPrice: null as number | null // currentPrice is either number or null
      });
    
      const [showError, setShowError] = useState(false);
      const [open, setOpen] = useState(false);
    
      const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
        setShowError(false);
      };
    
    //   const handleCheckPrice = () => {
    //     if (!formData.ticker || !formData.stockName) {
    //       setShowError(true);
    //       return;
    //     }
    //     // Simulating API call with a random float value for current price (or static like 100)
    //     const simulatedPrice = (Math.random() * 100 + 50).toFixed(2); // Random number between 50 and 150
    //     setFormData(prev => ({
    //       ...prev,
    //       currentPrice: parseFloat(simulatedPrice) // Set currentPrice as a float number
    //     }));
    //   };

    const handleCheckPrice = async () => {
        if (!formData.ticker || !formData.stockName) {
          setShowError(true);
          return;
        }
        try {
          // Reset error state before making the API call
          setShowError(false);
            console.log("here babe!!")
         //http://localhost:8080/api/stock/price?symbol=AAPL
          const response = await axios.get(`http://localhost:8080/api/stock/price?symbol=${formData.ticker}`)
          console.log("responese = " + response.data);
          
          if (response.data.error) {
            throw new Error("Failed to fetch stock price. Please check the ticker symbol.");
          }
      
          if (response.data && response.data.currentPrice) {
            setFormData((prev) => ({
              ...prev,
              currentPrice: parseFloat(response.data.currentPrice)
              
            }));

            
          } else {
            throw new Error("Invalid response from API: Missing current price");
          }
        } catch (error) {
          console.error("Error fetching stock price:", error);
          alert("Error: Unable to fetch stock price. Please try again.");
        }
        console.log("hi")
      };
      
    
      const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!formData.ticker || !formData.stockName) {
            setShowError(true);
            return;
        }
    
        try {
            // First get the current price
            const priceResponse = await axios.get(`http://localhost:8080/api/stock/price?symbol=${formData.ticker}`);
            
            // Add the stock using the current price
            await axios.post(`http://localhost:8080/api/user/addStock`, null, {
                params: {
                    userId: userID,
                    ticker: formData.ticker,
                    stockName: formData.stockName,
                    buyingPrice: parseFloat(priceResponse.data.currentPrice),
                    quantity: parseInt(formData.quantity)
                }
            });
    
            // Set isNewUser to false since we now have data
            setIsNewUser(false);
    
            // Update local table state
            const newStock = {
                ticker: formData.ticker,
                stockName: formData.stockName,
                buyingPrice: parseFloat(priceResponse.data.currentPrice),
                quantity: parseInt(formData.quantity),
                closingPrice: parseFloat(priceResponse.data.currentPrice)
            };
    
            setTableVal(prev => {
                const existingIndex = prev.findIndex(stock => stock.ticker === formData.ticker);
                if (existingIndex >= 0) {
                    const updated = [...prev];
                    updated[existingIndex] = newStock;
                    return updated;
                }
                return [...prev, newStock];
            });
    
            // Fetch all updated data
            const [
                topStockRes,
                portfolioRes,
                statusRes,
                quantityRes,
                closeValuesRes
            ] = await Promise.all([
                axios.get(`http://localhost:8080/api/user/topStock?userId=${userID}`),
                axios.get(`http://localhost:8080/api/user/portfolio?userId=${userID}`),
                axios.get(`http://localhost:8080/api/user/status?userId=${userID}`),
                axios.get(`http://localhost:8080/api/user/quantity?userId=${userID}`),
                axios.get<CloseValueData[]>(`http://localhost:8080/api/getCloseValues?userId=${userID}`)
            ]);
    
            // Update all the states with fresh data
            setTopStock(topStockRes.data);
            setPortfolioValue({
                value: portfolioRes.data,
                isPositive: statusRes.data
            });
            setQuantityData(quantityRes.data);
    
            // Update sales data
            if (closeValuesRes.data) {
                const transformedData = closeValuesRes.data.map(item => {
                    const dataPoint: TransformedData = { date: item.date };
                    Object.entries(item).forEach(([key, value]) => {
                        if (key !== 'date' && typeof value === 'string') {
                            dataPoint[key] = parseFloat(value);
                        }
                    });
                    return dataPoint;
                });
                setSalesData(transformedData);
            }
    
            // Reset form and close dialog
            setFormData({
                stockName: '',
                ticker: '',
                quantity: '',
                buyingPrice: '',
                currentPrice: null
            });
            setOpen(false);
            setError('');
    
        } catch (error) {
            console.error('Error adding stock:', error);
            setError('Failed to add stock. Please try again.');
        }
    };

      


      const LoadingCard = () => (
        <div className="flex justify-center items-center h-24">
            <p className="text-gray-500">Loading data...</p>
        </div>
    );




    const EmptyChart = () => (
        <div className="h-80 flex flex-col items-center justify-center text-gray-500">
            <p className="text-lg mb-2">No stock data available yet</p>
            <p className="text-sm">Add stocks to see your portfolio performance</p>
        </div>
    );

    const EmptyPieChart = () => (
        <div className="h-64 flex flex-col items-center justify-center text-gray-500">
            <p className="text-lg mb-2">No shares data</p>
            <p className="text-sm">Your stock distribution will appear here</p>
        </div>
    );

    const EmptyTable = () => (
        <TableRow>
            <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                <p className="text-lg mb-2">No stocks in your portfolio</p>
                <p className="text-sm">Click "Add Stock" to get started</p>
            </TableCell>
        </TableRow>
    );



    
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">

<Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Stock Quantity</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="quantity">New Quantity for {editingStock?.stockName}</Label>
                            <Input
                                id="quantity"
                                type="number"
                                value={newQuantity}
                                onChange={(e) => setNewQuantity(e.target.value)}
                                placeholder="Enter new quantity"
                                min="1"
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setShowEditDialog(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">
                                Update
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

<AlertDialog open={!!stockToDelete} onOpenChange={(open) => !open && setStockToDelete(null)}>
    <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this stock?</AlertDialogTitle>
            <AlertDialogDescription>
                This will permanently delete {stockToDelete} from your portfolio. This action cannot be undone.
            </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
                onClick={handleConfirmDelete}
                className="bg-red-500 hover:bg-red-600"
            >
                Delete
            </AlertDialogAction>
        </AlertDialogFooter>
    </AlertDialogContent>
</AlertDialog>


        {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
        <div className="flex justify-end">
                <Button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 hover:bg-red-600"
                    variant="destructive"
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </Button>
            </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Top Performance Card */}
        <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-2">
                            <p className="text-sm text-gray-500">Performance</p>
                            <div className="flex items-center space-x-2">
                                <h2 className="text-3xl font-bold">
                                    {isNewUser ? "0.00%" : `${topStock.userPerformance.toFixed(2)}%`}
                                </h2>
                                <div className="flex items-center text-gray-500 text-sm">
                                    {isNewUser ? (
                                        "Add stocks to track performance"
                                    ) : (
                                        <>
                                            <ArrowUpIcon className="h-4 w-4" />
                                            <span>{topStock.stockName} is the top performing stock!</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

        {/* Portfolio Value Card */}
        <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-2">
                            <p className="text-sm text-gray-500">Portfolio Value</p>
                            <div className="flex items-center space-x-2">
                                <h2 className="text-3xl font-bold">
                                    {isNewUser ? "$0.00" : `$${portfolioValue.value.toFixed(2)}`}
                                </h2>
                                {!isNewUser && (
                                    <div className={`flex items-center text-sm ${portfolioValue.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                                        {portfolioValue.isPositive ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />}
                                        <span>{portfolioValue.isPositive ? "Portfolio Value is looking good!" : "There have been some losses"}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

        {/* Add Stock Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Invest More?</p>
              <div className="flex items-center space-x-2">
                
              <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-xl transition-transform transform hover:scale-110 active:scale-95 hover:text-lime-400">
          Add Stock
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Stock</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="stockName">Stock Name</Label>
            <Input
              id="stockName"
              name="stockName"
              value={formData.stockName}
              onChange={handleInputChange}
              placeholder="Enter stock name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ticker">Ticker</Label>
            <Input
              id="ticker"
              name="ticker"
              value={formData.ticker}
              onChange={handleInputChange}
              placeholder="Enter ticker symbol"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleInputChange}
              placeholder="Enter quantity"
            />
          </div>
          {/* <div className="space-y-2">
            <Label htmlFor="buyingPrice">Buying Price</Label>
            <Input
              id="buyingPrice"
              name="buyingPrice"
              type="number"
              value={formData.buyingPrice}
              onChange={handleInputChange}
              placeholder="Enter buying price"
            />
          </div> */}
          
          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCheckPrice}
              className="w-1/2 mr-2"
            >
              Check Current Price
            </Button>
            {formData.currentPrice && (
              <span className="text-lg font-semibold">${formData.currentPrice}</span>
            )}
          </div>

          {showError && (
            <Alert variant="destructive">
              <AlertDescription>
                Please fill in both ticker and stock name fields!
              </AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>



                <div className="flex items-center text-green-500 text-sm">
                  <ArrowUpIcon className="h-4 w-4" />
                  <span>Invest today !</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Sales Report Chart */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Sales Report</span>
                <button className="px-4 py-2 text-sm text-gray-600 border rounded-md">
                  Export
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">

              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <p>Loading data...</p>
                </div>
            ) : salesData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    {dataKeys.map((key, index) => (
                      <Line
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stroke={colors[index % colors.length]}
                        dot={false}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
                ) : (
                    <EmptyChart />
                
            )}
              </div>
              <div className="mt-4 flex flex-wrap gap-4">
                {dataKeys.map((key, index) => (
                  <div key={key} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: colors[index % colors.length] }}
                    />
                    <span className="text-sm text-gray-600">{key}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shares Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Your Stock Shares Overview</CardTitle>
          </CardHeader>
          <CardContent>
          {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <p>Loading data...</p>
                            </div>
                        ) : quantityData.length > 0 ? ( 
                            <>
                                <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                    <Pie
                                        data={processedQuantityData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={2}
                                        dataKey="value"
                                        name="ticker"
                                    >
                                        {processedQuantityData.map((entry, index) => (
                                                            <Cell 
                                                                key={`cell-${index}`} 
                                                                fill={entry.color}
                                        />
                                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              
            </div>
            <div className="space-y-2 mt-4">
                        {processedQuantityData.map((event, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: event.color }}
                                    />
                                    <span className="text-sm text-gray-600">{event.ticker}</span>
                                </div>
                                <span className="text-sm font-medium">{event.value}%</span>
                            </div>
                        ))}
                    </div>
                    </>
                      ):(
                        <EmptyPieChart />
                        )}
          </CardContent>
        </Card>
      </div>

      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticker</TableHead>
                <TableHead>Stock Name</TableHead>
                <TableHead className="text-right">Buying Price</TableHead>
                <TableHead className="text-right">Closing Price</TableHead>
                <TableHead className="text-right">Profit</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
           
<TableBody>
  {isLoading ? (
    <TableRow>
      <TableCell colSpan={6} className="text-center py-8">
        Loading data...
      </TableCell>
    </TableRow>
  ) : tableVal.length > 0 ? (
    [...tableVal]
      .sort((a, b) => {
        const profitA = Number(a.closingPrice) - Number(a.buyingPrice);
        const profitB = Number(b.closingPrice) - Number(b.buyingPrice);
        return profitB - profitA; // Sort in descending order (highest profit first)
      })
      .map((stock,index) => (
        <TableRow key={stock.ticker} className={`
            ${index === 0 
              ? 'bg-emerald-600 hover:bg-gray-700 transition-colors duration-200' 
              : 'hover:bg-gray-700 transition-colors duration-200'
            }
            ${index === 0 && 'relative'}
          `}>
          {/* <TableCell className="font-medium">{stock.ticker}</TableCell> */}
          <TableCell className="font-medium">
            {index === 0 && (
              <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-4/5 bg-emerald-500 rounded-r" />
            )}
            {stock.ticker}
            {index === 0 && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                Top Performer
              </span>
            )}
          </TableCell>
          <TableCell>{stock.stockName}</TableCell>
          <TableCell className="text-right">
            ${typeof stock.buyingPrice === 'number' 
              ? stock.buyingPrice.toFixed(2) 
              : '0.00'}
          </TableCell>
          <TableCell className="text-right">
            ${typeof stock.closingPrice === 'number' 
              ? stock.closingPrice.toFixed(2) 
              : '0.00'}
          </TableCell>
          <TableCell className="text-right">
            ${typeof stock.closingPrice === 'number' && typeof stock.buyingPrice === 'number'
              ? (stock.closingPrice - stock.buyingPrice).toFixed(2)
              : '0.00'}
          </TableCell>
          <TableCell className="text-right">{stock.quantity}</TableCell>
          <TableCell className="text-right">
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEdit(stock.ticker)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteClick(stock.ticker)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      ))
  ) : (
    <EmptyTable />
  )}
</TableBody>
          </Table>
        </div>
      </CardContent>
    </div>
  );
};