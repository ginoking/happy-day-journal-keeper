import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  register: async () => {},
  changePassword: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, validate credentials with backend
      if (username === 'demo' && password === 'password') {
        const userData: User = {
          id: '1',
          username,
          email: 'demo@example.com'
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        toast({
          title: "Login successful",
          description: `Welcome back, ${username}!`,
          variant: "default",
        });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please check your credentials and try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, register with backend
      const userData: User = {
        id: Date.now().toString(),
        username,
        email
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      toast({
        title: "Registration successful",
        description: `Welcome, ${username}!`,
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, only allow changing password for demo user
      // In a real app, we would validate the current password with backend
      if (user?.username === 'demo' && currentPassword === 'password') {
        // In a real app, we would update the password in the database
        toast({
          title: "Password changed",
          description: "Your password has been successfully updated.",
          variant: "default",
        });
      } else {
        throw new Error('Current password is incorrect');
      }
    } catch (error) {
      toast({
        title: "Failed to change password",
        description: error instanceof Error ? error.message : "Please check your current password and try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};
