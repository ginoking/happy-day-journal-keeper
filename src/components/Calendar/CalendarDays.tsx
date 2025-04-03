
import React from 'react';
import { format, startOfWeek, addDays } from 'date-fns';

const CalendarDays: React.FC = () => {
  const dateFormat = 'EEEEEE';
  const days = [];
  const startDate = startOfWeek(new Date());

  for (let i = 0; i < 7; i++) {
    days.push(
      <div className="text-center font-medium py-2" key={i}>
        {format(addDays(startDate, i), dateFormat)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-7 border-b">
      {days}
    </div>
  );
};

export default CalendarDays;
