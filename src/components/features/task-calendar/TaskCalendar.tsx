// npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/list @fullcalendar/timegrid @fullcalendar/interaction
// fullcalendar.io/docs
import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { jwtDecode } from "jwt-decode";

import "../../../css/calendar.css";

// Define the shape of a task
interface Task {
  id: string;
  title: string;
  start: string;
  end?: string;
  status: string;
}

interface CustomJwtPayload {
  email: string;
  // other props
}

const TaskCalendar: React.FC = () => {
  const token = window.localStorage.getItem("token");
  const parsedToken = token ? JSON.parse(token) : null;
  const accessToken = parsedToken.access_token;
  const decodedToken = jwtDecode<CustomJwtPayload>(accessToken);

  const [tasks, setTasks] = useState<Task[]>([]);
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/tasks?userName=${encodeURIComponent(
            decodedToken.email
          )}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();

        const mappedTasks = data.map((task: any) => ({
          id: task._id,
          title: task.taskName,
          start: task.startDate,
          end: task.endDate,
          status: task.status,
        }));

        setTasks(mappedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    loadTasks();
  }, [decodedToken.email]);

  // Customize task content rendering
  const renderTaskContent = (taskInfo: any) => {
    // console.log("renderTaskContent");
    // console.log(JSON.stringify(taskInfo.event, null, 2));
    const isExpired =
      new Date(taskInfo.event.end || taskInfo.event.start) < new Date();
    return (
      <div className={`task-item ${isExpired ? "expired" : "todo"}`}>
        {taskInfo.event.title} <br />
        {isExpired ? "EXPIRED" : "TODO"}
      </div>
    );
  };
  const updateTask = async (data: any) => {
    try {
      const response = await fetch("http://localhost:3000/tasks/update", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Server error");
      }

      console.log("Task updated successfully");
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message, {
          position: "top-right",
        });
      } else {
        console.error("Server: An unexpected error occurred.", {
          position: "top-right",
        });
      }
    }
  };

  const changeTaskByDragging = async (events: any) => {
    const data = {
      email: decodedToken.email,
      taskName: events.event.title,
      startDate: events.event.start,
      endDate: events.event.end,
    };

    // console.log("Changed", JSON.stringify(data, null, 2));

    await updateTask(data);


  };
  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin, listPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        editable={true}
        droppable={true}
        events={tasks}
        eventContent={renderTaskContent}
        eventChange={changeTaskByDragging}
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
