
import React, { useState, useRef, useEffect } from 'react';
import { addMonths, subMonths, format } from 'date-fns';
import CalendarHeader from './CalendarHeader';
import CalendarDays from './CalendarDays';
import CalendarCells from './CalendarCells';
import { cn } from '@/lib/utils';

interface CalendarViewProps {
  onDateClick: (date: Date) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ onDateClick }) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [slideDirection, setSlideDirection] = useState<'right' | 'left' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const nextMonth = () => {
    setSlideDirection('left');
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setSlideDirection('right');
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
    onDateClick(day);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    
    const touchEndX = e.touches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    
    // Threshold to determine swipe
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextMonth();
      } else {
        prevMonth();
      }
      touchStartX.current = null;
    }
  };

  const handleTouchEnd = () => {
    touchStartX.current = null;
  };

  useEffect(() => {
    // Reset slide direction after animation completes
    const timer = setTimeout(() => {
      setSlideDirection(null);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [currentMonth]);

  return (
    <div 
      className="calendar-container bg-card rounded-lg shadow-md"
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <CalendarHeader
        currentMonth={currentMonth}
        onNextMonth={nextMonth}
        onPrevMonth={prevMonth}
      />
      <div className="overflow-hidden">
        <div
          className={cn(
            "transition-transform duration-300",
            slideDirection === 'right' && 'translate-x-[100px] opacity-0',
            slideDirection === 'left' && '-translate-x-[100px] opacity-0'
          )}
        >
          <CalendarDays />
          <CalendarCells
            currentMonth={currentMonth}
            selectedDate={selectedDate}
            onDateClick={handleDateClick}
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
