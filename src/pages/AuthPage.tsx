
import React, { useState } from 'react';
import LoginForm from '@/components/Auth/LoginForm';
import RegisterForm from '@/components/Auth/RegisterForm';

const AuthPage: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  
  const toggleForm = () => {
    setIsLoginView(!isLoginView);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-primary">Happy Day Journal</h1>
          <p className="text-muted-foreground">Track your moods and memories</p>
        </div>
        
        {isLoginView ? (
          <LoginForm onToggleForm={toggleForm} />
        ) : (
          <RegisterForm onToggleForm={toggleForm} />
        )}
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Demo credentials:</p>
          <p>Username: demo | Password: password</p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
