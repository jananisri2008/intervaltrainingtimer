import React, { useState, useEffect, useRef } from "react";
import "./AppCrud.css"; 

function AppCrud() {
  // Task Management State
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ name: "", workDuration: "0", restDuration: "0" });
  const [editingTaskId, setEditingTaskId] = useState(null);

  // Timer State
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkPhase, setIsWorkPhase] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);

  const intervalRef = useRef(null);

  // Handle Timer Logic
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsWorkPhase((prevPhase) => !prevPhase);
            const task = tasks.find((t) => t.id === currentTaskId);
            return isWorkPhase ? task.restDuration : task.workDuration;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, isWorkPhase, currentTaskId, tasks]);

  // CRUD Handlers
  const addOrUpdateTask = () => {
    if (editingTaskId !== null) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === editingTaskId ? { ...task, ...newTask } : task
        )
      );
      setEditingTaskId(null);
    } else {
      setTasks([...tasks, { ...newTask, id: Date.now() }]);
    }
    setNewTask({ name: "", workDuration: 30, restDuration: 0 });
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
    if (currentTaskId === id) resetTimer();
  };

  const editTask = (task) => {
    setNewTask(task);
    setEditingTaskId(task.id);
  };

  // Timer Handlers
  const startTimer = (id) => {
    setCurrentTaskId(id);
    const task = tasks.find((t) => t.id === id);
    setTimeLeft(task.workDuration);
    setIsRunning(true);
    setIsWorkPhase(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
  };

  const resetTimer = () => {
    stopTimer();
    setTimeLeft(0);
    setCurrentTaskId(null);
  };

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div className="app">
      <h1>Interval Training Timer</h1>

      {/* Task Form */}
      <div className="task-form">
        <input
          type="text"
          className="textbox"
          placeholder="Task Name"
          value={newTask.name}
          onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
        />
        <br/>
        <input
          type="number"
          className="numberbox"
          placeholder="Work Duration (sec)"
          value={newTask.workDuration}
          onChange={(e) => setNewTask({ ...newTask, workDuration: Number(e.target.value) })}
        />
        <br/>
        {/* <input
          type="number"
          placeholder="Rest Duration (sec)"
          value={newTask.restDuration}
          onChange={(e) => setNewTask({ ...newTask, restDuration: Number(e.target.value) })}
        /> */}
        <button onClick={addOrUpdateTask}>
          {editingTaskId !== null ? "Update Task" : "Add Task"}
        </button>
      </div>

      {/* Task List */}
      <div className="task-list">
        {tasks.map((task) => (
          <div key={task.id} className="task-item">
            <h3>{task.name}</h3>
            {/* <p>Work: {task.workDuration}s | Rest: {task.restDuration}s</p> */}
            <div>
              <button onClick={() => startTimer(task.id)} className="startbtn">Start</button>
              <button onClick={() => editTask(task)} className="stopbtn">Edit</button>
              <button onClick={() => deleteTask(task.id)} className="resetbtn">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Timer Display */}
      {currentTaskId && (
        <div className="timer-display">
          {/* <h2>{isWorkPhase ? "Work Phase" : "Rest Phase"}</h2> */}
          <h1>{formatTime(timeLeft)}</h1>
          <button onClick={stopTimer} className="stopbtn">Pause</button>
          <button onClick={resetTimer} className="resetbtn">Reset</button>
        </div>
      )}
    </div>
  );
}

export default AppCrud;
