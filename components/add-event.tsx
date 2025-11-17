"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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

interface AddEventProps {
  onEventAdded?: () => void;
}

export function AddEvent({ onEventAdded }: AddEventProps) {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    meetingPoint: "",
    course: "",
    maplink: "",
    meetuplink: "",
    linkedinlink: "",
    linkedinReportLink: "",
    description: "",
    stravaLink: "",
    komootLink: "",
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
    setIsLoading(true);

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create event");
      }

      toast.success("Event created successfully");
      setFormData({
        title: "",
        date: "",
        time: "",
        meetingPoint: "",
        course: "",
        maplink: "",
        meetuplink: "",
        linkedinlink: "",
        linkedinReportLink: "",
        description: "",
        stravaLink: "",
        komootLink: "",
      });
      setIsLoading(false);

      // Call onEventAdded callback if provided
      if (onEventAdded) {
        onEventAdded();
      }

      // Refresh the page to show the new event
      router.refresh();
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event");
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
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="stravaLink">Strava Link</Label>
              <Input
                id="stravaLink"
                name="stravaLink"
                value={formData.stravaLink}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="komootLink">Komoot Link</Label>
              <Input
                id="komootLink"
                name="komootLink"
                value={formData.komootLink}
                onChange={handleChange}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Event"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
