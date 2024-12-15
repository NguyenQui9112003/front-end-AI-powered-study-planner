// npm install @fullcalendar/core @fullcalendar/react @fullcalendar/daygrid @fullcalendar/interaction
// fullcalendar.io/docs

import React, { useState } from "react";
import FullCalendar, { EventInput } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./calendar.css";

// Define the shape of an event
interface Event {
  title: string;
  start: string;
}

const TaskCalendar: React.FC = () => {
  // State for holding events
  const [events, setEvents] = useState<Event[]>([
    { title: "Event 1", start: "2024-12-20" },
    { title: "Event 2", start: "2024-12-21" },
  ]);

  // Event handler for dropping events
  const handleEventReceive = (info: any) => {
    const newEvent: EventInput = {
      title: info.event.title,
      start: info.event.startStr,
    };
    setEvents((prevEvents) => [...prevEvents, newEvent]);
    info.event.remove(); // Remove from external list after dropping
  };

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        editable={true}
        droppable={true}
        events={events}
        eventReceive={handleEventReceive}
      />
    </div>
  );
};

export default TaskCalendar;
