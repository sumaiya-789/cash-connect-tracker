
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from "sonner";
import { Check } from 'lucide-react';

const OtpVerification = ({ phone, onVerify }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  
  // Timer for OTP resend
  useEffect(() => {
    if (timeLeft > 0 && !isVerified) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isVerified]);
  
  // Focus on next input when digit is entered
  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Move to next input if this one is filled
    if (value && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };
  
  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };
  
  const handleVerify = () => {
    const otpValue = otp.join('');
    
    if (otpValue.length !== 4) {
      toast.error("Please enter a 4-digit OTP");
      return;
    }
    
    setIsLoading(true);
    
    // Simulate verification (any 4 digits will work in this demo)
    setTimeout(() => {
      setIsLoading(false);
      setIsVerified(true);
      toast.success("OTP verified successfully!");
      
      setTimeout(() => {
        onVerify();
      }, 1000);
    }, 1500);
  };
  
  const handleResend = () => {
    toast.info(`New OTP sent to ${phone}`);
    setTimeLeft(30);
  };
  
  // Mask phone number for privacy
  const maskedPhone = phone ? `${phone.slice(0, 2)}****${phone.slice(-3)}` : '';
  
  return (
    <div className="space-y-6">
      {isVerified ? (
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="h-6 w-6 text-green-500" />
          </div>
          <h2 className="text-xl font-medium">Verification Successful</h2>
          <p className="text-gray-500">Redirecting you to the next step...</p>
        </div>
      ) : (
        <>
          <div className="text-center space-y-2">
            <h2 className="text-xl font-medium">Enter Verification Code</h2>
            <p className="text-gray-500">
              We've sent a 4-digit code to {maskedPhone}
            </p>
          </div>
          
          <div className="flex justify-center space-x-3">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={inputRefs[index]}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-14 h-14 text-2xl text-center"
              />
            ))}
          </div>
          
          <Button 
            onClick={handleVerify} 
            disabled={otp.join('').length !== 4 || isLoading} 
            className="w-full"
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </Button>
          
          <div className="text-center">
            {timeLeft > 0 ? (
              <p className="text-gray-500 text-sm">
                Resend OTP in {timeLeft} seconds
              </p>
            ) : (
              <button 
                onClick={handleResend}
                className="text-primary text-sm underline"
              >
                Resend OTP
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default OtpVerification;
