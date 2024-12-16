// npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/list @fullcalendar/timegrid @fullcalendar/interaction
// fullcalendar.io/docs

import React, { useState, useEffect } from "react";
import FullCalendar, { EventInput } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import "../../../css/calendar.css";

// Define the shape of an event
interface Event {
  id: string;
  title: string;
  start: string;
  end: string;
  state: string;
}
const TaskCalendar: React.FC = () => {
  // State for holding events
  const [events, setEvents] = useState<Event[]>([]);

  // Initialize Draggable once the component is mounted
  useEffect(() => {
    const containerEl = document.getElementById("draggable");
    if (containerEl) {
      new Draggable(containerEl, {
        itemSelector: ".draggable-item",
        eventData: (eventEl) => {
          return {
            id: eventEl.innerText.trim(),
            title: eventEl.innerText.trim(),
          };
        },
      });
    }
  }, []);

  // Event handler for dropping events
  const handleEventandleEventDragDrop = (info: any) => {
    // console.log(info);
    const isExpired = new Date(info.date) < new Date();

    const newEvent: EventInput = {
      title: info.draggedEl.innerText,
      start: info.dateStr,
      state: isExpired ? "expired" : "todo",
    };
    // console.log(newEvent);
    // console.log(events);
    setEvents((prevEvents) => [...prevEvents, newEvent]);
    info.draggedEl.remove(); // Remove from external list after dropping
  };

  // Generate task items dynamically
  const taskItems = Array.from({ length: 10 }, (_, i) => (
    <div key={i} className="draggable-item">
      Task {i + 1}
    </div>
  ));

  const renderEventContent = (eventInfo: any) => {
    console.log(JSON.stringify(eventInfo, null, 2));
    const isExpired =
      new Date(eventInfo.event.start) < new Date() ? "expired" : "todo";

    return (
      <div className={`task-item ${isExpired}`}>
        {eventInfo.event.title} <br />
        {isExpired.toUpperCase()}
      </div>
    );
  };

  return (
    <>
      <div className="taskbar-container">
        <div id="draggable" style={{ marginRight: "20px" }}>
          <h1>Taskbar</h1>
          {taskItems}
        </div>
      </div>
      <div className="calendar-container">
        <FullCalendar
          plugins={[
            dayGridPlugin,
            interactionPlugin,
            listPlugin,
            timeGridPlugin,
          ]}
          initialView="dayGridMonth"
          editable={true}
          droppable={true}
          events={events}
          eventContent={renderEventContent}
          // eventReceive={handleEventandleEventDragDrop}
          drop={handleEventandleEventDragDrop}
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
    </>
  );
};

export default TaskCalendar;
