
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const UserSignupForm = ({ onSignupComplete }) => {
  const form = useForm({
    defaultValues: {
      name: '',
      email: ''
    }
  });

  const onSubmit = (data) => {
    localStorage.setItem('userData', JSON.stringify(data));
    onSignupComplete(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 font-inter">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur">
        <CardHeader>
          <CardTitle>Welcome to Cha-Ching! 🎉</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Get Started</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSignupForm;
