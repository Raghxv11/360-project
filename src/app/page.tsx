"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import bcrypt from 'bcryptjs';

interface User {
  password: string;
  // Add other user properties as needed
}

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/auth.json")
      .then((response) => response.json())
      .then((data) => setUsers(data.users))
      .catch((error) => console.error("Error loading users:", error));
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = users.find((u: any) => u.email === email);
    if (user) {
      // Use bcrypt to compare hashed passwords
      const isMatch = await bcrypt.compare(password, (user as User).password);
      if (isMatch) {
        setMessage("Login successful!");
        // Implement proper session management here
      } else {
        setMessage("Invalid email or password");
      }
    } else {
      setMessage("Invalid email or password");
    }
  };

  return (
    <div className="my-32 mx-auto">
      <Card className="w-[350px] mx-auto">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your credentials to access your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            {message && <p className="mt-4 text-sm text-red-500">{message}</p>}
            <CardFooter className="flex justify-between mt-4">
              <Button variant="outline" type="button">Create Account</Button>
              <Button type="submit">Login</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
