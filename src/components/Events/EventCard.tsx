
import React from 'react';
import { Event } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface EventCardProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
  inDialog?: boolean;
}

const MoodIcon = ({ mood }: { mood: Event['mood'] }) => {
  let emoji = '';
  
  switch (mood) {
    case 'happy':
      emoji = '😊';
      break;
    case 'sad':
      emoji = '😢';
      break;
    case 'angry':
      emoji = '😠';
      break;
    case 'excited':
      emoji = '😃';
      break;
    case 'confused':
      emoji = '😕';
      break;
    default:
      emoji = '😐';
  }
  
  return <span className="text-xl mr-2">{emoji}</span>;
};

const EventCard: React.FC<EventCardProps> = ({ event, onEdit, onDelete, inDialog = false }) => {
  const date = new Date(event.createdAt);
  
  return (
    <Card className={cn("mb-4 border-l-4", `border-l-mood-${event.mood}`)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base flex items-center">
            <MoodIcon mood={event.mood} />
            {event.title}
          </CardTitle>
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit(event)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onDelete(event.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          {format(date, 'PPp')}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{event.description}</p>
        
        {event.imageUrl && (
          <div className="mt-3">
            <img 
              src={event.imageUrl} 
              alt={event.title} 
              className="rounded-md max-h-40 object-cover"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EventCard;
