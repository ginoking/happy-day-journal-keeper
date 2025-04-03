
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingActionButtonProps {
  onClick: () => void;
  className?: string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onClick,
  className
}) => {
  return (
    <Button
      onClick={onClick}
      size="icon"
      className={cn(
        "fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg md:hidden z-50",
        className
      )}
      aria-label="Add new entry"
    >
      <Plus className="h-6 w-6" />
    </Button>
  );
};

export default FloatingActionButton;
