
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import GoogleIcon from './icons/GoogleIcon';
import LoginForm from './LoginForm';
import BackgroundAnimation from './BackgroundAnimation';

const UserSignupForm = ({ onSignupComplete }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    
    // Store user data (in a real app, this would be sent to a backend)
    const userData = {
      name: data.name,
      email: data.email,
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('userData', JSON.stringify(userData));
    toast.success("Account created successfully!");
    onSignupComplete(userData);
  };

  const handleGoogleSignup = () => {
    // In a real app, we would use OAuth to authenticate with Google
    // For demo purposes, simulate a successful signup
    const userData = {
      name: "Google User",
      email: "google.user@example.com",
      createdAt: new Date().toISOString(),
      provider: "google"
    };
    
    localStorage.setItem('userData', JSON.stringify(userData));
    toast.success("Signed up with Google successfully!");
    onSignupComplete(userData);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (isLogin) {
    return <LoginForm onLoginComplete={onSignupComplete} onToggleForm={() => setIsLogin(false)} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 font-inter relative">
      <BackgroundAnimation />
      
      <Card className="w-full max-w-md bg-white/90 backdrop-blur shadow-xl relative z-10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
          <CardDescription className="text-center">
            Enter your details to get started with Cha-Ching
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            type="button" 
            variant="outline" 
            className="w-full mb-4 flex items-center justify-center gap-2"
            onClick={handleGoogleSignup}
          >
            <GoogleIcon className="h-4 w-4" />
            Sign up with Google
          </Button>
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                rules={{ required: "Name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder="John Doe" 
                          className="pl-10" 
                          {...field} 
                        />
                        <div className="absolute left-3 top-3 text-gray-400">
                          <Mail className="h-4 w-4" />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                rules={{ 
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  } 
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type="email" 
                          placeholder="johndoe@example.com" 
                          className="pl-10"
                          {...field} 
                        />
                        <div className="absolute left-3 top-3 text-gray-400">
                          <Mail className="h-4 w-4" />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                rules={{ 
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters"
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          className="pl-10"
                          {...field} 
                        />
                        <div className="absolute left-3 top-3 text-gray-400">
                          <Lock className="h-4 w-4" />
                        </div>
                        <Button 
                          type="button"
                          variant="ghost" 
                          size="icon"
                          onClick={togglePasswordVisibility} 
                          className="absolute right-0 top-0 h-full px-3"
                        >
                          {showPassword ? 
                            <EyeOff className="h-4 w-4 text-gray-400" /> : 
                            <Eye className="h-4 w-4 text-gray-400" />
                          }
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                rules={{ required: "Please confirm your password" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          className="pl-10"
                          {...field} 
                        />
                        <div className="absolute left-3 top-3 text-gray-400">
                          <Lock className="h-4 w-4" />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full">Create Account</Button>
              
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <button 
                    type="button"
                    onClick={() => setIsLogin(true)} 
                    className="text-primary hover:underline font-medium"
                  >
                    Log in
                  </button>
                </p>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSignupForm;
