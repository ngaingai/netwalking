"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Event } from "@/lib/events";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { EditEvent } from "./edit-event";
import { Label } from "@/components/ui/label";
import ImageUpload from "@/components/image-upload";
import { formatTime } from "@/lib/utils";

interface EventCardProps {
  event: Event;
  onEventUpdated?: () => void;
}

export function EventCard({ event, onEventUpdated }: EventCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [coverImage, setCoverImage] = useState<{ secure_url: string } | null>(
    null
  );
  const [showEditDialog, setShowEditDialog] = useState(false);

  const fetchEventImage = useCallback(async () => {
    try {
      const response = await fetch(`/api/events/${event.no}/images`);
      if (!response.ok) {
        throw new Error("Failed to fetch images");
      }
      const images = await response.json();
      if (images && images.length > 0) {
        setCoverImage(images[0]);
      } else {
        setCoverImage(null);
      }
    } catch (error) {
      console.error("Error fetching event image:", error);
      setCoverImage(null);
    }
  }, [event.no]);

  useEffect(() => {
    fetchEventImage();
  }, [fetchEventImage]);

  const handleEdit = () => {
    setShowEditDialog(true);
  };

  const handleEditClose = () => {
    setShowEditDialog(false);
    // Refresh both event data and images when closing edit dialog
    if (onEventUpdated) {
      onEventUpdated();
    }
    fetchEventImage();
  };

  return (
<<<<<<< HEAD
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
          <CardTitle>
            Event <span className="font-mono text-[#4cccc3]">#{event.no}</span>
          </CardTitle>
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
            <p>
              <strong>Status:</strong> {event.status}
            </p>
            <p>
              <strong>Attendees:</strong> {event.attendees}
            </p>
=======
    <>
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
            <CardTitle>
              Event <span style={{ color: "#4cccc3" }}>#{event.no}</span>
            </CardTitle>
>>>>>>> origin/main
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handleEdit}>
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
            <EditEvent
              event={event}
              onClose={() => {
                setIsEditing(false);
                // Refresh both event data and images when closing inline edit
                if (onEventUpdated) {
                  onEventUpdated();
                }
                fetchEventImage();
              }}
              onUpdate={onEventUpdated}
            />
          ) : isExpanded ? (
            <div className="space-y-2">
              <p>
                <strong>Title:</strong> {event.title}
              </p>
              <p>
                <strong>Date:</strong> {event.date}
              </p>
              <p>
                <strong>Time:</strong> {formatTime(event.time)}
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
              <div className="space-y-2">
                <Label>Images</Label>
                <ImageUpload
                  eventId={event.no.toString()}
                  onUpdate={() => {
                    fetchEventImage();
                    if (onEventUpdated) {
                      onEventUpdated();
                    }
                  }}
                />
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {showEditDialog && (
        <EditEvent
          event={event}
          onClose={handleEditClose}
          onUpdate={onEventUpdated}
        />
      )}
    </>
  );
}
