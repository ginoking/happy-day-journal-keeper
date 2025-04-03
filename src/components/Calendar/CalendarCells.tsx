
import React from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addDays,
  parseISO,
} from 'date-fns';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useEvents } from '@/contexts/EventContext';
import { MoodType } from '@/types';

interface CalendarCellsProps {
  currentMonth: Date;
  selectedDate: Date;
  onDateClick: (day: Date) => void;
}

interface DotProps {
  mood: MoodType;
}

const EventDot: React.FC<DotProps> = ({ mood }) => (
  <div className={`w-2 h-2 rounded-full bg-mood-${mood}`} />
);

const CalendarCells: React.FC<CalendarCellsProps> = ({
  currentMonth,
  selectedDate,
  onDateClick,
}) => {
  const { events } = useEvents();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const rows = [];
  let days = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const cloneDay = day;
      const formattedDate = format(cloneDay, 'yyyy-MM-dd');
      const dayEvents = events.filter(event => event.date === formattedDate);
      
      days.push(
        <div
          className={cn(
            "min-h-[90px] px-2 pt-2 border-r border-b relative",
            !isSameMonth(day, monthStart) && "bg-muted text-muted-foreground",
            isSameDay(day, selectedDate) && "bg-accent"
          )}
          key={formattedDate}
          onClick={() => onDateClick(cloneDay)}
        >
          <div className="flex justify-between items-start mb-1">
            <span
              className={cn(
                "font-medium text-sm",
                isSameDay(day, new Date()) && "bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center"
              )}
            >
              {format(day, 'd')}
            </span>
            {dayEvents.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {dayEvents.length}
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-1 overflow-hidden max-h-[50px]">
            {dayEvents.slice(0, 3).map((event) => (
              <EventDot key={event.id} mood={event.mood} />
            ))}
            {dayEvents.length > 3 && <span className="text-xs text-muted-foreground">...</span>}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="grid grid-cols-7" key={format(day, 'T')}>
        {days}
      </div>
    );
    days = [];
  }

  return <div>{rows}</div>;
};

export default CalendarCells;
