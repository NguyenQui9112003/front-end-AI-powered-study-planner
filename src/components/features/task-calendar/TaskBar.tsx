// TaskBar.tsx

import React, { useEffect } from "react";
import { Draggable } from "@fullcalendar/interaction";


const TaskBar: React.FC = () => {
  // Initialize Draggable functionality
  useEffect(() => {
    const containerEl = document.getElementById("draggable");
    if (containerEl) {
      new Draggable(containerEl, {
        itemSelector: ".draggable-item",
      });
    }
  }, []);
  // Render the task items dynamically
  const taskItems = Array.from({ length: 10 }, (_, i) => (
    <div key={i} className="draggable-item">
      Task {i + 1}
    </div>
  ));

  return (
    <div className="taskbar-container">
    <div id="draggable" style={{ marginRight: "20px" }}>
        <h1 id="taskbar-title">Taskbar</h1>
        {taskItems}
    </div>
    </div>

  );
};

export default TaskBar;
