"use client";
import { createContext, useContext,useState, ReactNode } from "react";
import { TextGenerateEffect } from "../components/ui/text-generate-effect";
import { WavyBackground } from "../components/ui/wavy-background";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useRouter } from "next/navigation";
import axios from "axios";

const words = `Welcome to your portfolio tracker. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque sed mi eu nibh tincidunt ultricies. Nunc varius nulla non velit egestas, et convallis odio tempus. Maecenas sit amet congue augue, nec lobortis est.`;

interface LabelInputContainerProps {
  children: ReactNode;
  className?: string;
}

const LabelInputContainer = ({ children, className = "" }: LabelInputContainerProps) => (
  <div className={`flex flex-col space-y-2 ${className}`}>
    {children}
  </div>
);



// export const AuthContext = createContext<{
//   isAuthenticated: boolean;
//   login: (token: string, userId: string) => void;
//   logout: () => void;
// } | null>(null);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

export default function AuthPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showText, setShowText] = useState(true);
  const router = useRouter();

  const BASE_URL = "http://localhost:8080/api/auth";

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const setAuthToken = (token: string, userId: string) => {
    const expiryTime = new Date().getTime() + (60 * 1000); // 1 minute from now
    localStorage.setItem('token', token);
    localStorage.setItem('tokenExpiry', expiryTime.toString());
    localStorage.setItem('userId', userId);

    // Set timeout to clear auth after 1 minute
    setTimeout(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiry');
      localStorage.removeItem('userId');
      router.push('/');
    }, 60 * 1000);
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/signup`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      const { token, userId } = response.data;
    alert("Signup successful!");
    setAuthToken(token, userId);
      console.log("BEFORE PG USER ID = "+ userId);
      localStorage.setItem("userId", userId);
      router.push(`/user?userId=${userId}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(`Signup failed: ${error.response?.data?.message || error.message}`);
      } else {
        alert("An unexpected error occurred during signup");
      }
      console.error("Signup error:", error);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Match the @RequestParam format expected by the backend
      const params = new URLSearchParams({
        username: formData.username,
        password: formData.password
      });
      
      const response = await axios.post(`${BASE_URL}/login?${params.toString()}`);
      const { token, userId } = response.data;
      localStorage.setItem("userId", userId);
      setAuthToken(token, userId);
      alert("Login successful!");
      
     router.push(`/user?userId=${userId}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(`Login failed: ${error.response?.data?.message || error.message}`);
      } else {
        alert("An unexpected error occurred during login");
      }
      console.error("Login error:", error);
    }
  };

  const handleShowLogin = () => {
    setShowLogin(true);
    setShowText(false);
    // Reset form data when showing login
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };
  
  const handleShowSignup = () => {
    setShowSignup(true);
    setShowText(false);
    // Reset form data when showing signup
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleClose = () => {
    setShowLogin(false);
    setShowSignup(false);
    setShowText(true);
    // Reset form data when closing
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="min-h-screen relative">
      <WavyBackground className="max-w-4xl mx-auto pt-24 px-4">
        {showText && (
          <>
            <TextGenerateEffect words={words} />
            <div className="flex flex-col sm:flex-row md:justify-center gap-10 mt-8">
              <Button 
                className="w-full sm:w-auto outline outline-offset-1 outline-1 transition-transform transform click:scale-110 hover:scale-105 cursor-pointer"
                onClick={handleShowLogin}
              >
                Login
              </Button>
              <Button 
                className="w-full sm:w-auto outline outline-offset-1 outline-1 transition-transform transform click:scale-110 hover:scale-105 cursor-pointer"
                onClick={handleShowSignup}
              >
                Sign Up
              </Button>
            </div>
          </>
        )}
      </WavyBackground>

      {showSignup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full mx-auto rounded-2xl p-8 shadow-input bg-black">
            <h2 className="font-bold text-xl text-neutral-200">
              Hey, nice to meet you!
            </h2>
            <form className="my-8" onSubmit={handleSignupSubmit}>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  placeholder="Tyler" 
                  type="text" 
                  value={formData.username}
                  onChange={handleChange}
                />
              </LabelInputContainer>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  placeholder="projectmayhem@fc.com" 
                  type="email" 
                  value={formData.email}
                  onChange={handleChange}
                />
              </LabelInputContainer>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  placeholder="••••••••" 
                  type="password" 
                  value={formData.password}
                  onChange={handleChange}
                />
              </LabelInputContainer>
              <LabelInputContainer className="mb-8">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input 
                  id="confirmPassword" 
                  placeholder="••••••••" 
                  type="password" 
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </LabelInputContainer>
              <Button type="submit" className="w-full mb-4">
                Sign up →
              </Button>
              <Button onClick={handleClose} variant="outline" className="w-full">
                Back ←
              </Button>
            </form>
          </div>
        </div>
      )}

      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full mx-auto rounded-2xl p-8 shadow-input bg-black">
            <h2 className="font-bold text-xl text-neutral-200">
              Hey, nice to see you again!
            </h2>
            <form className="my-8" onSubmit={handleLoginSubmit}>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  placeholder="Tyler" 
                  type="text" 
                  value={formData.username}
                  onChange={handleChange}
                />
              </LabelInputContainer>
              <LabelInputContainer className="mb-8">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  placeholder="••••••••" 
                  type="password" 
                  value={formData.password}
                  onChange={handleChange}
                />
              </LabelInputContainer>
              <Button type="submit" className="w-full mb-4">
                Log In →
              </Button>
              <Button onClick={handleClose} variant="outline" className="w-full">
                Back ←
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}