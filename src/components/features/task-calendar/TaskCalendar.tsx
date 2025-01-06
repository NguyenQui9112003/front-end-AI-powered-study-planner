// npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/list @fullcalendar/timegrid @fullcalendar/interaction
// fullcalendar.io/docs
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useRefreshToken } from "../../../helpers/utility/refreshToken";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { getTokenData } from '@/helpers/utility/tokenData.ts';
import { TimerForm } from "../task-management/TimerForm";
import "../../../css/calendar.css";

import { Col, Modal, Button, Form } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";

import { Task } from '@/types/taskType';

const TaskCalendar: React.FC = () => {
  const user = getTokenData().username;
  const navigate = useNavigate();
  const getRefreshToken = useRefreshToken();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null); // State for selected task
  const [showTimerForm, setShowTimerForm] = useState(false); // State for modal visibility
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const timerFormRef = useRef<any>(null);

  useEffect(() => {

    const loadTasks = async () => {
      const token = window.localStorage.getItem("token");
      if (!token) {
        navigate("/signIn");
        return;
      }
      const parsedToken = JSON.parse(token);
      let accessToken = parsedToken.access_token;
      const refreshToken = parsedToken.refresh_token;

      try {
        let response = await fetch(`http://localhost:3000/tasks?userName=${encodeURIComponent(
          user
        )}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-type': 'application/json',
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          // console.log(data);
          const mappedTasks = data.map((task: Task) => ({
            _id: task._id,
            title: task.taskName,
            start: task.startDate,
            end: task.endDate,
            status: task.status,
            description: task.description,
            priorityLevel: task.priorityLevel,
          }));
          // console.log(mappedTasks);
          setTasks(mappedTasks);
        } else if (response.status === 419) {
          accessToken = await getRefreshToken(refreshToken);
          response = await fetch(`http://localhost:3000/tasks?userName=${encodeURIComponent(
            user
          )}`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-type': 'application/json',
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            // console.log(data);
            const mappedTasks = data.map((task: Task) => ({
              _id: task._id,
              title: task.taskName,
              start: task.startDate,
              end: task.endDate,
              status: task.status,
              description: task.description,
              priorityLevel: task.priorityLevel,
            }));
            // console.log(mappedTasks);
            setTasks(mappedTasks);
          } else {
            navigate("/signIn");
            alert("Session auth expired");
          }
        }

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    loadTasks();
  }, [user]);

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
      username: user,
      taskName: events.event.title,
      startDate: events.event.start,
      endDate: events.event.end,
    };

    // console.log("Changed", JSON.stringify(data, null, 2));

    await updateTask(data);


  };

  const handleTimer = (eventInfo: any) => {
    console.log(JSON.stringify(eventInfo.event, null, 2));
    const task = tasks.find((t) => t._id === eventInfo.event.extendedProps._id);
    if (task) {
      setSelectedTask(task);
      console.log("CLICKED");
      setShowTimerForm(true); // Show TimerForm
      handleShow();
    }
  };

  const closeTimerForm = () => {
    setShowTimerForm(false); // Close TimerForm
    setSelectedTask(null);
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
        eventClick={handleTimer}
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

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton={true}>
          <Modal.Title>Focus Timer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TimerForm defaultValues={selectedTask} user={user} />
        </Modal.Body>
      </Modal>
    </div>

  );
};

export default TaskCalendar;
