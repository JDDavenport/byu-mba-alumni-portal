"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { dummyEvents, type Event } from "@/data/events";

export function EventsList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [rsvps, setRsvps] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/events");
        if (res.ok) {
          const data = await res.json();
          setEvents(data);
        } else {
          setEvents(dummyEvents);
        }
      } catch {
        setEvents(dummyEvents);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function handleRsvp(eventId: string) {
    setRsvps((prev) => {
      const next = new Set(prev);
      if (next.has(eventId)) {
        next.delete(eventId);
      } else {
        next.add(eventId);
      }
      return next;
    });
  }

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-48 animate-pulse rounded-lg border bg-gray-100"
          />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg font-medium text-gray-900">
          No upcoming events
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Check back soon for new events.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {events.map((event) => {
        const date = new Date(event.date);
        const isRsvpd = rsvps.has(event.id);

        return (
          <Card key={event.id} className="h-full">
            <CardContent className="p-5">
              <div className="mb-3 flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <time dateTime={event.date}>
                      {date.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </time>
                    <span>
                      {date.toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <h3 className="mt-1 text-lg font-semibold text-[#002E5D]">
                    {event.title}
                  </h3>
                </div>
                {event.city && (
                  <Badge variant="outline" className="shrink-0 text-xs">
                    {event.city}
                    {event.state ? `, ${event.state}` : ""}
                  </Badge>
                )}
              </div>

              <p className="text-sm text-gray-600 line-clamp-2">
                {event.description}
              </p>

              <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{event.location}</span>
              </div>

              {event.max_attendees && (
                <p className="mt-1 text-xs text-gray-400">
                  Max {event.max_attendees} attendees
                </p>
              )}

              <div className="mt-4">
                <Button
                  size="sm"
                  variant={isRsvpd ? "outline" : "default"}
                  className={
                    isRsvpd
                      ? "border-emerald-300 text-emerald-700"
                      : "bg-[#002E5D] hover:bg-[#002E5D]/90"
                  }
                  onClick={() => handleRsvp(event.id)}
                >
                  {isRsvpd ? "RSVP'd" : "RSVP"}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
