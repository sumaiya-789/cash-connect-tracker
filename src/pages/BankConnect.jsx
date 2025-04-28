
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from "sonner";
import { Phone } from 'lucide-react';
import OtpVerification from '@/components/OtpVerification';

const BankConnect = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  
  const handleSendOtp = (e) => {
    e.preventDefault();
    
    if (!phone.trim() || phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    
    // Simulate sending OTP
    toast.info(`OTP sent to ${phone}`);
    setShowOtpVerification(true);
  };
  
  const handleVerified = () => {
    // Navigate to bank selection after OTP verification
    navigate('/bank-selection');
  };
  
  return (
    <div className="min-h-screen flex flex-col p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Bank Connect</h1>
        <Button variant="outline" onClick={() => navigate('/landing')}>
          Back
        </Button>
      </div>
      
      <div className="max-w-md mx-auto w-full mt-4">
        {showOtpVerification ? (
          <OtpVerification phone={phone} onVerify={handleVerified} />
        ) : (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="bg-secondary bg-opacity-10 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                <Phone className="h-8 w-8 text-secondary" />
              </div>
              <h2 className="text-xl font-medium">Enter Your Phone Number</h2>
              <p className="text-gray-500">
                We'll send you a verification code to connect your bank account
              </p>
            </div>
            
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="text-lg"
                />
              </div>
              
              <Button type="submit" className="w-full">
                Send OTP
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default BankConnect;
