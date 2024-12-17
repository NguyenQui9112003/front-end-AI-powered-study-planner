import React, { useState } from "react";
import { EventApi } from '@fullcalendar/core'
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "../../../css/calendar.css";

interface Event {
  id: string;
  title: string;
  start: string | Date; 
  end?: string | Date; 
}

const TaskCalendar: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);

  const handleEventDragDrop = (info: any) => {
    const isExpired = new Date(info.date) < new Date();
    const newEvent: Event = { 
      id: `event-${info.draggedEl.innerText}`,
      title: info.draggedEl.innerText,
      start: info.dateStr,
    };

    setEvents((prevEvents) => [...prevEvents, newEvent]);
    info.draggedEl.remove();
  };

  const handleEventResize = (info: { event: EventApi }) => {
    const updatedEvents = events.map((event) =>
      event.id === info.event.id
        ? {
            ...event,
            start: info.event.start.toISOString(),
            end: info.event.end ? info.event.end.toISOString() : undefined, // Handle optional end date
          }
        : event
    );
    setEvents(updatedEvents);
  };

  const renderEventContent = (eventInfo: { event: EventApi }) => {
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
        editable={true}
        droppable={true}
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