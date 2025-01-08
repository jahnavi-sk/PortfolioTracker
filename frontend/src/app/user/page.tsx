"use client";
import axios from 'axios';

import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '../../components/ui/button';
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
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

const salesData = [
  { month: '', brutto: 350, netto: 100, AAPL: 243, IBM: 342 },
  { month: '', brutto: 370, netto: 280, AAPL: 244, IBM: 332 },
  { month: '', brutto: 550, netto: 400, AAPL: 224, IBM: 321 },
  { month: '', brutto: 120, netto: 300, AAPL: 256, IBM: 320 },
  { month: '', brutto: 800, netto: 450, AAPL: 221, IBM: 370 },
  { month: '', brutto: 350, netto: 250, AAPL: 244, IBM: 400 },
  { month: '', brutto: 250, netto: 350, AAPL: 248, IBM: 412 },
  { month: '', brutto: 350, netto: 450, AAPL: 243, IBM: 323 },
  { month: '', brutto: 150, netto: 350, AAPL: 247, IBM: 322},
  { month: '', brutto: 150, netto: 350, AAPL: 247, IBM: 322}
];

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

  const eventData = [
    { ticker: 'Event 1', quantity: 1 },
    { ticker: 'Event 2', quantity: 1 },
    { ticker: 'Event 3', quantity: 1 },
    { ticker: 'Event 4', quantity: 1 },
    { ticker: 'Event 5', quantity: 1 }

];



interface StockDetail {
    ticker: string;
    stockName: string;
    buyingPrice: number;
    quantity: number;
    closingPrice: number;
  }


export default function SalesDashboard() {
    const [topStock, setTopStock] = useState({ stockName: '', performance: 0 });
    const [portfolioValue, setPortfolioValue] = useState({ value: 0, isPositive: true });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [topStockRes, portfolioRes, statusRes] = await Promise.all([
                    axios.get('http://localhost:8080/api/user/topStock?userId=1000'),
                    axios.get('http://localhost:8080/api/user/portfolio?userId=1000'),
                    axios.get('http://localhost:8080/api/user/status?userId=1000')
                ]);
                setTopStock(topStockRes.data);
                setPortfolioValue({
                    value: portfolioRes.data.value,
                    isPositive: statusRes.data
                });
                
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const userID = '1000';
    

    const processedEventData = React.useMemo(() => {
    const totalQuantity = eventData.reduce((sum, event) => sum + event.quantity, 0);

    
        
        return eventData.map((event, index) => ({
            ...event,
            value: parseFloat(((event.quantity / totalQuantity) * 100).toFixed(1)),
            color: colors[index % colors.length] // Assign colors from the colors array
        }));
    }, []);

    const handleLogout = () => {
        // Add your logout logic here
        console.log('Logging out...');
    };

    const [details, setDetails] = useState<StockDetail[]>([
        {
          ticker: "AAPL",
          stockName: "Apple Inc",
          buyingPrice: 240.0,
          quantity: 1,
          closingPrice: 245
        },
        {
          ticker: "GOOGL",
          stockName: "Alphabet Inc Class C",
          buyingPrice: 190.0,
          quantity: 1,
          closingPrice: 196.87
        },
        {
          ticker: "MSFT",
          stockName: "Microsoft Corp",
          buyingPrice: 420.0,
          quantity: 1,
          closingPrice: 427.85
        },
        {
          ticker: "ABNB",
          stockName: "Airbnb Inc",
          buyingPrice: 135.0,
          quantity: 1,
          closingPrice: 135.2
        },
        {
          ticker: "ABG",
          stockName: "Asbury Automotive Group, Inc",
          buyingPrice: 240.0,
          quantity: 1,
          closingPrice: 237.05
        },
        {
          ticker: "ABSI",
          stockName: "Absci Corporation",
          buyingPrice: 100.0,
          quantity: 1,
          closingPrice: 3.37
        }
      ]);
    
      const handleDelete = (ticker: string) => {
        setDetails(details.filter(item => item.ticker !== ticker));
      };
    
      const handleEdit = (ticker: string) => {
        console.log('Edit clicked for ticker:', ticker);
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
    
      const handleCheckPrice = () => {
        if (!formData.ticker || !formData.stockName) {
          setShowError(true);
          return;
        }
        // Simulating API call with a random float value for current price (or static like 100)
        const simulatedPrice = (Math.random() * 100 + 50).toFixed(2); // Random number between 50 and 150
        setFormData(prev => ({
          ...prev,
          currentPrice: parseFloat(simulatedPrice) // Set currentPrice as a float number
        }));
      };
    
      const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!formData.ticker || !formData.stockName) {
          setShowError(true);
          return;
        }
    
        const newStock = {
          ticker: formData.ticker,
          stockName: formData.stockName,
          buyingPrice: parseFloat(formData.buyingPrice),
          quantity: parseInt(formData.quantity),
          closingPrice: formData.currentPrice || parseFloat(formData.buyingPrice) // Use currentPrice if set, else fall back to buyingPrice
        };
    
        setDetails(prev => {
          const existingIndex = prev.findIndex(stock => stock.ticker === formData.ticker);
          if (existingIndex >= 0) {
            const updated = [...prev];
            updated[existingIndex] = newStock;
            return updated;
          }
          return [...prev, newStock];
        });
    
        setFormData({
          stockName: '',
          ticker: '',
          quantity: '',
          buyingPrice: '',
          currentPrice: null 
        });
        setOpen(false);
      };

      const dataKeys = Object.keys(salesData[0]).filter(key => key !== 'month');

      const isPositiveChange = true;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">

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
                <h2 className="text-3xl font-bold">{topStock.performance.toFixed(2)}%</h2>
                {/* <h2 className="text-3xl font-bold">306.20€</h2> */}
                <div className="flex items-center text-green-500 text-sm">
                  <ArrowUpIcon className="h-4 w-4" />
                  <span>{topStock.stockName} is the top performing stock !</span>
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
              <div className={`flex items-center text-sm ${portfolioValue.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                <h2 className="text-3xl text-white font-bold">{portfolioValue.value.toFixed(2)}$</h2>

                {portfolioValue.isPositive ? (
            <ArrowUpIcon className="h-4 w-4" />
          ) : (
            <ArrowDownIcon className="h-4 w-4" />
          )}
          <span>
            {isPositiveChange
              ? "Portfolio Value is looking good !"
              : "There have been some losses "
            }
          </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tickets Card */}
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
          <div className="space-y-2">
            <Label htmlFor="buyingPrice">Buying Price</Label>
            <Input
              id="buyingPrice"
              name="buyingPrice"
              type="number"
              value={formData.buyingPrice}
              onChange={handleInputChange}
              placeholder="Enter buying price"
            />
          </div>
          
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
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 500]} />
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

        {/* Event Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Event Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={processedEventData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    name="ticker"
                  >
                    {processedEventData.map((entry, index) => (
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
                        {processedEventData.map((event, index) => (
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
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {details.map((stock) => (
                <TableRow key={stock.ticker}>
                  <TableCell className="font-medium">{stock.ticker}</TableCell>
                  <TableCell>{stock.stockName}</TableCell>
                  <TableCell className="text-right">${stock.buyingPrice.toFixed(2)}</TableCell>
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
                        onClick={() => handleDelete(stock.ticker)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </div>
  );
};




