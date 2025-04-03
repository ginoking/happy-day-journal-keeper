
import React from 'react';
import { Event } from '@/types';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import EventCard from './EventCard';

interface EventsListDialogProps {
  isOpen: boolean;
  onClose: () => void;
  // onAddEvent: () => void;
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (id: string) => void;
  date: Date;
  events: Event[];
}

const EventsListDialog = ({
  isOpen,
  onClose,
  // onAddEvent,
  onEditEvent,
  onDeleteEvent,
  date,
  events,
}: EventsListDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {format(date, 'PPPP')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {/* <Button onClick={onAddEvent} className="mb-4 w-full">
            <Plus className="h-4 w-4 mr-2" />
            New Entry
          </Button> */}
          
          <div className="space-y-3">
            {events.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No entries for this day. Add your first entry!
              </p>
            ) : (
              events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onEdit={onEditEvent}
                  onDelete={onDeleteEvent}
                  inDialog={true}
                />
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventsListDialog;
