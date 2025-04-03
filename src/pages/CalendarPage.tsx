
import React, { useState } from 'react';
import { format } from 'date-fns';
import Layout from '@/components/Layout/Layout';
import CalendarView from '@/components/Calendar/CalendarView';
import EventCard from '@/components/Events/EventCard';
import EventForm from '@/components/Events/EventForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useEvents } from '@/contexts/EventContext';
import { Event } from '@/types';
import FloatingActionButton from '@/components/UI/FloatingActionButton';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import EventsListDialog from '@/components/Events/EventsListDialog';

const CalendarPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [isEventsListOpen, setIsEventsListOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | undefined>(undefined);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  
  const { events, addEvent, updateEvent, deleteEvent, getEventsByDate } = useEvents();
  const isMobile = useIsMobile();
  
  const selectedDateEvents = getEventsByDate(format(selectedDate, 'yyyy-MM-dd'));

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    
    if (isMobile) {
      // On mobile, open the events list dialog when a date is clicked
      setIsEventsListOpen(true);
    }
  };

  const handleAddEvent = () => {
    setEditingEvent(undefined);
    setIsEventFormOpen(true);
    
    // Close the events list dialog if it's open
    if (isEventsListOpen) {
      setIsEventsListOpen(false);
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsEventFormOpen(true);
    
    // Close the events list dialog if it's open
    if (isEventsListOpen) {
      setIsEventsListOpen(false);
    }
  };

  const handleDeleteEvent = (id: string) => {
    setEventToDelete(id);
  };
  
  const confirmDelete = () => {
    if (eventToDelete) {
      deleteEvent(eventToDelete);
      setEventToDelete(null);
    }
  };

  const handleSaveEvent = (eventData: Omit<Event, 'id' | 'createdAt'>) => {
    if (editingEvent) {
      updateEvent({
        ...editingEvent,
        ...eventData
      });
    } else {
      addEvent(eventData);
    }
  };

  const handleFloatingButtonClick = () => {
    if (isMobile) {
      setIsEventsListOpen(true);
    } else {
      handleAddEvent();
    }
  };

  return (
    <Layout title="Happy Day Journal">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        <div className="lg:col-span-8">
          <CalendarView onDateClick={handleDateClick} />
        </div>
        
        {!isMobile && (
          <div className="lg:col-span-4">
            <div className="bg-card rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold truncate">
                  {format(selectedDate, 'PPPP')}
                </h2>
                <Button onClick={handleAddEvent} size="sm" className="flex">
                  <Plus className="h-4 w-4 mr-1" />
                  New Entry
                </Button>
              </div>
              
              <div className="events-container">
                {selectedDateEvents.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No entries for this day. Click "New Entry" to add one.
                  </p>
                ) : (
                  selectedDateEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onEdit={handleEditEvent}
                      onDelete={handleDeleteEvent}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <FloatingActionButton onClick={handleFloatingButtonClick} />

      {/* Events List Dialog (mobile only) */}
      <EventsListDialog
        isOpen={isEventsListOpen}
        onClose={() => setIsEventsListOpen(false)}
        onAddEvent={handleAddEvent}
        onEditEvent={handleEditEvent}
        onDeleteEvent={handleDeleteEvent}
        date={selectedDate}
        events={selectedDateEvents}
      />

      {/* Event Form Dialog */}
      <EventForm
        isOpen={isEventFormOpen}
        onClose={() => setIsEventFormOpen(false)}
        onSave={handleSaveEvent}
        date={selectedDate}
        editEvent={editingEvent}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!eventToDelete} onOpenChange={() => setEventToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this journal entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default CalendarPage;
