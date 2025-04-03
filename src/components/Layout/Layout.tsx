
import React, { ReactNode } from 'react';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = 'Happy Day Journal' }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header title={title} />
      <main className="flex-1 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
