"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

export function AddEvent() {
  const [formData, setFormData] = useState({
    no: "",
    title: "",
    date: "",
    time: "",
    course: "",
    meetingPoint: "",
    maplink: "",
    meetuplink: "",
    linkedinlink: "",
    description: "",
    imageUrl: "",
    attendees: 0,
    status: "upcoming" as const,
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.title ||
      !formData.date ||
      !formData.course ||
      !formData.meetingPoint
    ) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create the event object
      const newEvent = {
        id: `event-${Date.now()}`,
        ...formData,
        attendees: parseInt(formData.attendees.toString()) || 0,
      };

      // Send to API endpoint
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });

      if (!response.ok) {
        throw new Error("Failed to add event");
      }

      toast({
        title: "Event Added",
        description: "The event has been added successfully",
      });

      // Reset form
      setFormData({
        no: "",
        title: "",
        date: "",
        time: "",
        course: "",
        meetingPoint: "",
        maplink: "",
        meetuplink: "",
        linkedinlink: "",
        description: "",
        imageUrl: "",
        attendees: 0,
        status: "upcoming",
      });

      // Refresh the page to show the new event
      router.refresh();
    } catch (error) {
      console.error("Error adding event:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to add event",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Event</CardTitle>
        <CardDescription>
          Enter the details of your NetWalking event
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="no">Event Number *</Label>
              <Input
                id="no"
                name="no"
                placeholder="001"
                value={formData.no}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                name="title"
                placeholder="Netwalking: Downtown Seattle"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="course">Course *</Label>
              <Input
                id="course"
                name="course"
                placeholder="Downtown Seattle Loop"
                value={formData.course}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="meetingPoint">Meeting Point *</Label>
              <Input
                id="meetingPoint"
                name="meetingPoint"
                placeholder="Westlake Center, 400 Pine St, Seattle, WA 98101"
                value={formData.meetingPoint}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="maplink">Google Maps Link</Label>
              <Input
                id="maplink"
                name="maplink"
                placeholder="https://maps.google.com/?q=Westlake+Center+Seattle"
                value={formData.maplink}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="meetuplink">Meetup Event Link</Label>
              <Input
                id="meetuplink"
                name="meetuplink"
                placeholder="https://www.meetup.com/netwalking/events/123456789/"
                value={formData.meetuplink}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="linkedinlink">LinkedIn Event Link</Label>
              <Input
                id="linkedinlink"
                name="linkedinlink"
                placeholder="https://www.linkedin.com/events/netwalking-downtown-seattle-123456789"
                value={formData.linkedinlink}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter event description..."
                value={formData.description}
                onChange={handleChange}
                rows={5}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                placeholder="/images/events/downtown-seattle.jpg"
                value={formData.imageUrl}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="attendees">Number of Attendees</Label>
              <Input
                id="attendees"
                name="attendees"
                type="number"
                min="0"
                value={formData.attendees}
                onChange={handleChange}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Event"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
