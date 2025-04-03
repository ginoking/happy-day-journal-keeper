
import React, { useState } from 'react';
import { Event, MoodType } from '@/types';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Image, Smile, Frown, Angry, Zap, HelpCircle } from 'lucide-react';
import { format } from 'date-fns';
import { compressImage, fileToDataUrl } from '@/utils/imageCompression';
import { useToast } from '@/components/ui/use-toast';

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<Event, 'id' | 'createdAt'>) => void;
  date: Date;
  editEvent?: Event;
}

const EventForm: React.FC<EventFormProps> = ({
  isOpen,
  onClose,
  onSave,
  date,
  editEvent
}) => {
  const [title, setTitle] = useState(editEvent?.title || '');
  const [description, setDescription] = useState(editEvent?.description || '');
  const [mood, setMood] = useState<MoodType>(editEvent?.mood || 'happy');
  const [image, setImage] = useState<string | undefined>(editEvent?.imageUrl);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your journal entry.",
        variant: "destructive",
      });
      return;
    }
    
    onSave({
      title,
      description,
      mood,
      date: format(date, 'yyyy-MM-dd'),
      imageUrl: image
    });
    
    resetForm();
    onClose();
  };

  const resetForm = () => {
    if (!editEvent) {
      setTitle('');
      setDescription('');
      setMood('happy');
      setImage(undefined);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      // Compress image
      const compressed = await compressImage(file);
      
      // Convert to data URL for preview
      const dataUrl = await fileToDataUrl(compressed);
      
      setImage(dataUrl);
      toast({
        title: "Image uploaded",
        description: "Your image has been successfully compressed and uploaded.",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setImage(undefined);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editEvent ? 'Edit Journal Entry' : 'Add Journal Entry'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              value={format(date, 'PPPP')}
              disabled
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="mood">How are you feeling?</Label>
            <ToggleGroup 
              type="single" 
              value={mood}
              onValueChange={(value) => value && setMood(value as MoodType)}
              className="justify-between"
            >
              <ToggleGroupItem value="happy" className="flex-1" aria-label="Happy">
                <Smile className="mr-1 h-4 w-4" />
                <span className="sr-only md:not-sr-only md:inline">Happy</span>
              </ToggleGroupItem>
              <ToggleGroupItem value="sad" className="flex-1" aria-label="Sad">
                <Frown className="mr-1 h-4 w-4" />
                <span className="sr-only md:not-sr-only md:inline">Sad</span>
              </ToggleGroupItem>
              <ToggleGroupItem value="angry" className="flex-1" aria-label="Angry">
                <Angry className="mr-1 h-4 w-4" />
                <span className="sr-only md:not-sr-only md:inline">Angry</span>
              </ToggleGroupItem>
              <ToggleGroupItem value="excited" className="flex-1" aria-label="Excited">
                <Zap className="mr-1 h-4 w-4" />
                <span className="sr-only md:not-sr-only md:inline">Excited</span>
              </ToggleGroupItem>
              <ToggleGroupItem value="confused" className="flex-1" aria-label="Confused">
                <HelpCircle className="mr-1 h-4 w-4" />
                <span className="sr-only md:not-sr-only md:inline">Confused</span>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write about your day..."
              rows={5}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">Image (optional)</Label>
            
            {image ? (
              <div className="relative">
                <img 
                  src={image}
                  alt="Preview" 
                  className="rounded-md max-h-60 object-cover w-full" 
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={removeImage}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center border border-dashed rounded-md p-6">
                <Label 
                  htmlFor="image-upload" 
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Image className="h-10 w-10 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">
                    {isUploading ? 'Uploading...' : 'Click to upload an image'}
                  </span>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                </Label>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventForm;
