"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Event } from "@/lib/events";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { EditEvent } from "./edit-event";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [coverImage, setCoverImage] = useState<{ secure_url: string } | null>(
    null
  );

  useEffect(() => {
    const fetchEventImage = async () => {
      try {
        const response = await fetch(`/api/events/${event.no}/images`);
        if (!response.ok) {
          throw new Error("Failed to fetch images");
        }
        const images = await response.json();
        if (images && images.length > 0) {
          setCoverImage(images[0]);
        }
      } catch (error) {
        console.error("Error fetching event image:", error);
      }
    };

    fetchEventImage();
  }, [event.no]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          <CardTitle>Event #{event.no}</CardTitle>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {coverImage && (
          <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
            <Image
              src={coverImage.secure_url}
              alt={`Cover image for Event #${event.no}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        {isEditing ? (
          <EditEvent event={event} onClose={() => setIsEditing(false)} />
        ) : isExpanded ? (
          <div className="space-y-2">
            <p>
              <strong>Title:</strong> {event.title}
            </p>
            <p>
              <strong>Date:</strong> {event.date}
            </p>
            <p>
              <strong>Time:</strong> {event.time}
            </p>
            <p>
              <strong>Course:</strong> {event.course}
            </p>
            <p>
              <strong>Meeting Point:</strong> {event.meetingPoint}
            </p>
            {event.maplink && (
              <p>
                <strong>Google Maps:</strong>{" "}
                <a
                  href={event.maplink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  View on Maps
                </a>
              </p>
            )}
            {event.meetuplink && (
              <p>
                <strong>Meetup:</strong>{" "}
                <a
                  href={event.meetuplink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  View on Meetup
                </a>
              </p>
            )}
            {event.linkedinlink && (
              <p>
                <strong>LinkedIn Event:</strong>{" "}
                <a
                  href={event.linkedinlink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  View on LinkedIn
                </a>
              </p>
            )}
            {event.status === "past" && event.linkedinReportLink && (
              <p>
                <strong>Event Report:</strong>{" "}
                <a
                  href={event.linkedinReportLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  View Report on LinkedIn
                </a>
              </p>
            )}
            {event.stravaLink && (
              <p>
                <strong>Strava:</strong>{" "}
                <a
                  href={event.stravaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  View on Strava
                </a>
              </p>
            )}
            {event.komootLink && (
              <p>
                <strong>Komoot:</strong>{" "}
                <a
                  href={event.komootLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  View on Komoot
                </a>
              </p>
            )}
            <p>
              <strong>Status:</strong> {event.status}
            </p>
            <p>
              <strong>Attendees:</strong> {event.attendees}
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
