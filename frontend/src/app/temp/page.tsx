import React, { useState, ChangeEvent, FormEvent } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  Alert,
  AlertDescription,
} from "../../components/ui/alert";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

// Define types for the form data
interface FormData {
  stockName: string;
  ticker: string;
  quantity: string;
  buyingPrice: string;
  currentPrice: number | null;
}

// Define the type for the onAddStock prop
interface AddStockDialogProps {
  onAddStock: (stock: FormData) => void;
}

const AddStockDialog: React.FC<AddStockDialogProps> = ({ onAddStock }) => {
  const [formData, setFormData] = useState<FormData>({
    stockName: '',
    ticker: '',
    quantity: '',
    buyingPrice: '',
    currentPrice: null,
  });
  const [showError, setShowError] = useState(false);
  const [open, setOpen] = useState(false);

  // Handle input changes and update the state
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setShowError(false);
  };

  // Simulate fetching the current price
  const handleCheckPrice = () => {
    if (!formData.ticker || !formData.stockName) {
      setShowError(true);
      return;
    }
    // Simulate an API call with a static value
    setFormData(prev => ({
      ...prev,
      currentPrice: 100
    }));
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.ticker || !formData.stockName) {
      setShowError(true);
      return;
    }
    onAddStock(formData);
    setFormData({
      stockName: '',
      ticker: '',
      quantity: '',
      buyingPrice: '',
      currentPrice: null
    });
    setOpen(false);
  };

  return (
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
  );
};

export default AddStockDialog;
