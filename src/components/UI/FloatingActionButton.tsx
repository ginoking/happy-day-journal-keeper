
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface FloatingActionButtonProps {
  onAddEvent: () => void;
  className?: string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onAddEvent,
  className
}) => {
  const isMobile = useIsMobile();
  
  if (!isMobile) return null;
  
  return (
    <Button
      onClick={onAddEvent}
      size="icon"
      className={cn(
        "fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg z-50",
        className
      )}
      aria-label="View or add entries"
    >
      <Plus className="h-6 w-6" />
    </Button>
  );
};

export default FloatingActionButton;
