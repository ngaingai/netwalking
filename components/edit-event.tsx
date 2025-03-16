"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Event } from "@/lib/events";
import ImageUpload from "./image-upload";
import { getEventImages } from "@/app/actions/events";

interface EditEventProps {
  event: Event;
  onClose: () => void;
}

interface ApiError {
  error: string;
}

export function EditEvent({ event, onClose }: EditEventProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: event.title,
    date: event.date,
    time: event.time || "12:00",
    course: event.course,
    meetingPoint: event.meetingPoint,
    maplink: event.maplink,
    meetuplink: event.meetuplink,
    linkedinlink: event.linkedinlink,
    description: event.description,
    attendees: event.attendees,
  });
  const [images, setImages] = useState<string[]>([]);

  // Load existing images
  useEffect(() => {
    getEventImages(event.id).then(setImages);
  }, [event.id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as unknown as {
      name: string;
      value: string;
    };
    const { name, value } = target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/events/${event.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = (await response.json()) as ApiError;
        throw new Error(error.error || "Failed to update event");
      }

      toast({
        title: "Success",
        description: "Event updated successfully",
      });

      router.refresh();
      onClose();
    } catch (error) {
      console.error("Error updating event:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update event",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Event #{event.no}</CardTitle>
        <CardDescription>Update event details below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="course">Course</Label>
            <Input
              id="course"
              name="course"
              value={formData.course}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meetingPoint">Meeting Point</Label>
            <Input
              id="meetingPoint"
              name="meetingPoint"
              value={formData.meetingPoint}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maplink">Google Maps Link</Label>
            <Input
              id="maplink"
              name="maplink"
              value={formData.maplink}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meetuplink">Meetup Event Link</Label>
            <Input
              id="meetuplink"
              name="meetuplink"
              value={formData.meetuplink}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedinlink">LinkedIn Event Link</Label>
            <Input
              id="linkedinlink"
              name="linkedinlink"
              value={formData.linkedinlink}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="attendees">Number of Attendees</Label>
            <Input
              id="attendees"
              name="attendees"
              type="number"
              value={formData.attendees}
              onChange={handleChange}
              min="0"
            />
          </div>

          {/* Image Upload Section */}
          <ImageUpload
            eventId={event.id}
            eventNo={event.no}
            onImagesChange={setImages}
          />

          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Event"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
