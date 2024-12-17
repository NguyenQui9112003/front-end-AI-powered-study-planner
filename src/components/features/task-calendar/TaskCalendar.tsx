// npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/list @fullcalendar/timegrid @fullcalendar/interaction
// fullcalendar.io/docs
import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "../../../css/calendar.css";

// Define the shape of an event
interface Event {
  id: string;
  title: string;
  start: string;
  end?: string;
}

const TaskCalendar: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);

  // Handle drag-and-drop events
  const handleEventDragDrop = (info: any) => {
    const newEvent: Event = {
      id: `event-${info.draggedEl.innerText}`,
      title: info.draggedEl.innerText,
      start: info.dateStr,
    };

    setEvents((prevEvents) => {
      if (prevEvents.some((event) => event.title === newEvent.title && event.start === newEvent.start)) {
        return prevEvents; // Avoid adding duplicates
      }
      return [...prevEvents, newEvent];
    });

    info.draggedEl.remove();
  };

  // Handle event resize
  const handleEventResize = (info: any) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === info.event.id
          ? {
              ...event,
              start: info.event.start.toISOString(),
              end: info.event.end?.toISOString() || null,
            }
          : event
      )
    );
  };

  // Customize event content rendering
  const renderEventContent = (eventInfo: any) => {
    const isExpired = new Date(eventInfo.event.end || eventInfo.event.start) < new Date();
    return (
      <div className={`task-item ${isExpired ? "expired" : "todo"}`}>
        {eventInfo.event.title} <br />
        {isExpired ? "EXPIRED" : "TODO"}
      </div>
    );
  };

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin, listPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        editable
        droppable
        events={events}
        eventContent={renderEventContent}
        eventResize={handleEventResize}
        drop={handleEventDragDrop}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        footerToolbar={{
          left: "",
          center: "",
          right: "prevYear,nextYear",
        }}
      />
    </div>
  );
};

export default TaskCalendar;
