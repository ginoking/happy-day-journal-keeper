
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Event } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from './AuthContext';

interface EventContextType {
  events: Event[];
  addEvent: (event: Omit<Event, 'id' | 'createdAt'>) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (id: string) => void;
  getEventsByDate: (date: string) => Event[];
}

const EventContext = createContext<EventContextType>({
  events: [],
  addEvent: () => {},
  updateEvent: () => {},
  deleteEvent: () => {},
  getEventsByDate: () => [],
});

export const useEvents = () => useContext(EventContext);

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load events from local storage
  useEffect(() => {
    if (user) {
      const storedEvents = localStorage.getItem(`events-${user.id}`);
      if (storedEvents) {
        setEvents(JSON.parse(storedEvents));
      }
    } else {
      setEvents([]);
    }
  }, [user]);

  // Save events to local storage whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`events-${user.id}`, JSON.stringify(events));
    }
  }, [events, user]);

  const addEvent = (eventData: Omit<Event, 'id' | 'createdAt'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    setEvents(prevEvents => [...prevEvents, newEvent]);
    toast({
      title: "Event added",
      description: "Your event has been successfully added.",
    });
  };

  const updateEvent = (updatedEvent: Event) => {
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
    toast({
      title: "Event updated",
      description: "Your event has been successfully updated.",
    });
  };

  const deleteEvent = (id: string) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
    toast({
      title: "Event deleted",
      description: "Your event has been successfully deleted.",
    });
  };

  const getEventsByDate = (date: string) => {
    return events.filter(event => event.date === date);
  };

  return (
    <EventContext.Provider value={{ events, addEvent, updateEvent, deleteEvent, getEventsByDate }}>
      {children}
    </EventContext.Provider>
  );
};
