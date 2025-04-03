"use client";

import { CalendarEvent } from "@/lib/student-types";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, PenSquare, Info } from "lucide-react";

interface EventItemProps {
  event: CalendarEvent;
}

export function EventItem({ event }: EventItemProps) {
  const eventTypeIcons = {
    assignment: <PenSquare className="h-3.5 w-3.5" />,
    exam: <BookOpen className="h-3.5 w-3.5" />,
    study: <Calendar className="h-3.5 w-3.5" />,
    other: <Info className="h-3.5 w-3.5" />,
  };

  const eventTypeColors = {
    assignment: "bg-yellow-100 text-yellow-800 border-yellow-300",
    exam: "bg-red-100 text-red-800 border-red-300",
    study: "bg-blue-100 text-blue-800 border-blue-300",
    other: "bg-purple-100 text-purple-800 border-purple-300",
  };

  const eventTypeLabels = {
    assignment: "과제",
    exam: "시험",
    study: "자습",
    other: "기타",
  };

  const formatTimeOrDate = () => {
    if (event.allDay) {
      return "종일";
    }

    const isSameDay =
      event.startDate.getDate() === event.endDate.getDate() &&
      event.startDate.getMonth() === event.endDate.getMonth() &&
      event.startDate.getFullYear() === event.endDate.getFullYear();

    if (isSameDay) {
      return `${format(event.startDate, "HH:mm")} - ${format(
        event.endDate,
        "HH:mm"
      )}`;
    }

    return `${format(event.startDate, "MM/dd HH:mm")} - ${format(
      event.endDate,
      "MM/dd HH:mm"
    )}`;
  };

  return (
    <div className={`p-3 rounded-md border ${eventTypeColors[event.type]}`}>
      <div className="flex items-center gap-2">
        <div className="flex-shrink-0">{eventTypeIcons[event.type]}</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate">{event.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs">
              {eventTypeLabels[event.type]}
            </Badge>
            {event.subject && (
              <Badge variant="secondary" className="text-xs">
                {event.subject}
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">
              {formatTimeOrDate()}
            </span>
          </div>
          {event.description && (
            <p className="text-xs mt-1 text-foreground/80">
              {event.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
