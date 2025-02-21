import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { getTokenData } from "@/helpers/utility/tokenData.ts";
import { TimerForm } from "../task-management/TimerForm";
import { Modal } from "../../common/modal";
import "../../../css/calendar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRefreshToken } from "@/helpers/utility/refreshToken";

import { Task } from "@/types/taskType";

const TaskCalendar: React.FC = () => {
  const user = getTokenData().username;
  const navigate = useNavigate();
  const getRefreshToken = useRefreshToken();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [openTimerModal, setTimerOpenModal] = useState(false);

  const timerFormRef = useRef<{ submitForm: () => void } | null>(null);
  const defaultValues = selectedTask || {
    taskName: "",
    description: "",
    timeFocus: "0",
    priorityLevel: "",
    startDate: null,
    endDate: null,
    status: "",
  };

  const loadTasks = async () => {
    try {
      const token = window.localStorage.getItem("token");
      if (!token) {
        navigate("/signIn");
        return;
      }
      const parsedToken = JSON.parse(token);
      let accessToken = parsedToken.access_token;
      const refreshToken = parsedToken.refresh_token;

      let response = await fetch(
        `https://be-ai-study-planner.onrender.com/tasks?userName=${encodeURIComponent(user)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) { 
        const data = await response.json();
        const mappedTasks = data.map((task: Task) => ({
          _id: task._id,
          taskName: task.taskName,
          startDate: task.startDate,
          endDate: task.endDate,
          timeFocus: task.timeFocus,
          status: task.status,
          description: task.description,
          priorityLevel: task.priorityLevel,
        }));
        setTasks(mappedTasks);
      } else if (response.status === 419) {
        accessToken = await getRefreshToken(refreshToken);
        response = await fetch(
          `https://be-ai-study-planner.onrender.com/tasks?userName=${encodeURIComponent(user)}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          navigate("/signIn");
          alert("Session auth expired");
        } 
      }
      if (!response.ok) {
        // Navigate to sign-in page on authorization failure
        alert("Session expired. Please log in again.");
        navigate("/signIn");
        return;
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      alert("An error occurred while fetching tasks. Please try again.");
    }
  };


  useEffect(() => {
    loadTasks();
  }, [user]);

  const renderTaskContent = (taskInfo: any) => {
    const isExpired =
      new Date(taskInfo.event.end || taskInfo.event.start) < new Date();
    return (
      <div className={`task-item ${isExpired ? "expired" : "todo"}`}>
        {taskInfo.event.extendedProps.taskName} <br />
        {taskInfo.event.extendedProps.status}
      </div>
    );
  };

  const updateTask = async (data: any) => {
    const token = window.localStorage.getItem("token");
    if (!token) {
      alert("No token found. Redirecting to sign-in...");
      navigate("/signIn");
      return;
    }

    const parsedToken = JSON.parse(token);
    let accessToken = parsedToken.access_token;
    const refreshToken = parsedToken.refresh_token;

    try {
      let response = await fetch("https://be-ai-study-planner.onrender.com/tasks/update", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // alert("Focus time end");
      } else if (response.status === 419) {
        accessToken = await getRefreshToken(refreshToken);
        response = await fetch('https://be-ai-study-planner.onrender.com/tasks/update', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-type': 'application/json'
          },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          navigate("/signIn");
          alert("Session auth expired");
        } 
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Server error");
      }

    } catch (error) {
      console.error(error instanceof Error ? error.message : "Unexpected error");
    }
  };

  const changeTaskByDragging = async (events: any) => {
    const data = {
      username: user,
      taskName: events.event.extendedProps.taskName,
      startDate: events.event.start,
      endDate: events.event.end,
    };

    await updateTask(data);
  };

  const handleTimer = (eventInfo: any) => {
    const task = tasks.find((t) => t._id === eventInfo.event.extendedProps._id);
    if (task) {
      setSelectedTask({
        _id: task._id,
        taskName: task.taskName,
        description: task.description,
        priorityLevel: task.priorityLevel,
        timeFocus: task.timeFocus,
        startDate: task.startDate,
        endDate: task.endDate,
        status: task.status
      });
      if (task.status === "Completed" || task.status === "Expired") {
        alert(`This task is ${task.status}, so you can't use the timer`);
      } else {
          setTimerOpenModal(true);
      }
    }
  };

  const handleCloseModal = () => {
    setTimerOpenModal(false);
    setSelectedTask(null);
  };


  const handleSession = () => {
    if (timerFormRef.current) {
      timerFormRef.current.submitForm();
      loadTasks();
    }
    setTimerOpenModal(false); // Close the modal
  };

  return (
    <div className="calendar-container p-4 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-4">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin, listPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          editable={true}
          droppable={true}
          events={tasks.map((task) => ({
            ...task,
            start: task.startDate ? new Date(task.startDate) : new Date(),
            end: task.endDate ? new Date(task.endDate) : new Date(),
          }))}
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
          height="auto"
          contentHeight="auto"
        />
      </div>

      <Modal isOpen={openTimerModal} onClose={handleCloseModal}>
        <Modal.Header>
          <div className="text-blue-500 font-bold text-2xl mb-3 text-center">
            Timer
          </div>
        </Modal.Header>
        <Modal.Body>
          <TimerForm
            ref={timerFormRef}
            defaultValues={defaultValues}
            user={user}
          />
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end mt-3">
            <Modal.DismissButton className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mx-1">
              Close
            </Modal.DismissButton>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mx-1"
              onClick={handleSession}
            >
              End
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TaskCalendar;
