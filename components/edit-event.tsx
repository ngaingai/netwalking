"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Event } from "@/lib/events";
import ImageUpload from "./image-upload";

interface EditEventProps {
  event: Event;
  onClose: () => void;
}

export function EditEvent({ event, onClose }: EditEventProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: event.title,
    date: event.date,
    time: event.time,
    location: event.location,
    course: event.course,
    description: event.description,
    stravaLink: event.stravaLink || "",
    komootLink: event.komootLink || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/events/${event.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update event");
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
        description: "Failed to update event",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Edit Event</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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

          <div className="grid gap-4 sm:grid-cols-2">
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
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
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
            <Label htmlFor="stravaLink">Strava Link (optional)</Label>
            <Input
              id="stravaLink"
              name="stravaLink"
              value={formData.stravaLink}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="komootLink">Komoot Link (optional)</Label>
            <Input
              id="komootLink"
              name="komootLink"
              value={formData.komootLink}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label>Images</Label>
            <ImageUpload eventId={event.no} />
          </div>
        </CardContent>
        <CardFooter className="justify-between">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </CardFooter>
      </Card>
    </form>
  );
}
