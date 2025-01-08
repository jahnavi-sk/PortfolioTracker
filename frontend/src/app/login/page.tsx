"use client";
import { useState, ReactNode } from "react";
import { TextGenerateEffect } from "../../components/ui/text-generate-effect";
import { WavyBackground } from "../../components/ui/wavy-background";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

const words = `Oxygen gets you high. In a catastrophic emergency, we're taking giant, panicked breaths. Suddenly you become euphoric, docile. You accept your fate. It's all right here. Emergency water landing, six hundred miles an hour. Blank faces, calm as Hindu cows`;

interface LabelInputContainerProps {
    children: ReactNode;
    className?: string;
  }


  const LabelInputContainer = ({ children, className = "" }: LabelInputContainerProps) => (
    <div className={`flex flex-col space-y-2 ${className}`}>
      {children}
    </div>
  );
  

  const BottomGradient = () => (
    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
  );

export default function AuthPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showText, setShowText] = useState(true);

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // Handle form submission
  };

  const handleShowLogin = () => {
    setShowLogin(true);
    setShowText(false);
  };
  
  const handleShowSignup = () => {
    setShowSignup(true);
    setShowText(false);
  };

  const handleClose = () => {
    setShowLogin(false);
    setShowSignup(false);
    setShowText(true);
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
            <form className="my-8" onSubmit={handleSubmit}>
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                <LabelInputContainer>
                  <Label htmlFor="firstname">First name</Label>
                  <Input id="firstname" placeholder="Tyler" type="text" />
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="lastname">Last name</Label>
                  <Input id="lastname" placeholder="Durden" type="text" />
                </LabelInputContainer>
              </div>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" placeholder="projectmayhem@fc.com" type="email" />
              </LabelInputContainer>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="password">Password</Label>
                <Input id="password" placeholder="••••••••" type="password" />
              </LabelInputContainer>
              <LabelInputContainer className="mb-8">
                <Label htmlFor="confirmpassword">Confirm Password</Label>
                <Input id="confirmpassword" placeholder="••••••••" type="password" />
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
            <form className="my-8" onSubmit={handleSubmit}>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="username">Username</Label>
                <Input id="username" placeholder="Tyler" type="text" />
              </LabelInputContainer>
              <LabelInputContainer className="mb-8">
                <Label htmlFor="loginPassword">Password</Label>
                <Input id="loginPassword" placeholder="••••••••" type="password" />
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