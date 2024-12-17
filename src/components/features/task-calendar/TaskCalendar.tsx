// npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/list @fullcalendar/timegrid @fullcalendar/interaction
// fullcalendar.io/docs
import React, { useState } from "react";
import EventInput from "@fullcalendar/react";
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
  end: string;
  state: string;
}

const TaskCalendar: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);

  // Initialize Draggable once the component is mounted
  // useEffect(() => {
  //   const containerEl = document.getElementById("draggable");
  //   if (containerEl) {
  //     new Draggable(containerEl, {
  //       itemSelector: ".draggable-item"
  //     });
  //   }
  // }, []);

  // Handle drag-and-drop events
  const handleEventDragDrop = (info: any) => {
    console.log("handleEventDragDrop");
    const isExpired = new Date(info.date) < new Date();

    const newEvent: EventInput = {
      id: `event-${info.draggedEl.innerText}`, // Unique ID for the event
      title: info.draggedEl.innerText,
      start: info.dateStr,
      state: isExpired ? "expired" : "todo",
    };

    setEvents((prevEvents) => {
      if (
        prevEvents.some(
          (event) =>
            event.title === newEvent.title && event.start === newEvent.start
        )
      ) {
        return prevEvents;
      }
      return [...prevEvents, newEvent];
    });
    info.draggedEl.remove(); // Remove the task from the taskbar
    // console.log(events);
  };
  const handleEventResize = (info: any) => {
    console.log("handleEventResize");

    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === info.event.id
          ? {
              ...event,
              start: info.event.start.toISOString(), // Update start time
              end: info.event.end?.toISOString() || null, // Update end time (null if no end)
            }
          : event
      )
    );
    // console.log("Event resized:", info.event);
  };

  // Customize event content rendering
  const renderEventContent = (eventInfo: any) => {
    console.log("renderEventContent");

    const isExpired =
      new Date(
        eventInfo.event.end ? eventInfo.event.end : eventInfo.event.start
      ) < new Date();

    // console.log(JSON.stringify(eventInfo.event, null, 2));

    return (
      <div className={`task-item ${isExpired ? "expired" : "todo"}`}>
        {eventInfo.event.title} <br />
        {isExpired ? "EXPIRED" : "TODO"}
      </div>
    );
  };

  return (
    <>
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
    </>
  );
};

export default TaskCalendar;

