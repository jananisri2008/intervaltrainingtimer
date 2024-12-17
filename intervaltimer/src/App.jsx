import React, { useState, useEffect, useRef } from "react";
import "./App.css"; // Custom CSS for styling

function App() {
  // State variables
  const [workDuration, setWorkDuration] = useState(30); // Default work time (in seconds)
  const [restDuration, setRestDuration] = useState(10); // Default rest time (in seconds)
  const [timeLeft, setTimeLeft] = useState(workDuration);
  const [isRunning, setIsRunning] = useState(true);
  const [isWorkPhase, setIsWorkPhase] = useState(false); // Tracks phase: "Work" or "Rest"

  const intervalIdRef = useRef(null);

  // Start Timer Logic
  useEffect(() => {
    if (isRunning) {
      intervalIdRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            switchPhase();
            return isWorkPhase ? restDuration : workDuration;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalIdRef.current);
  }, [isRunning, isWorkPhase, workDuration, restDuration]);

  // Switch between Work and Rest phases
  const switchPhase = () => {
    setIsWorkPhase((prevPhase) => !prevPhase);
  };

  // Start, Pause, and Reset Handlers
  const startTimer = () => setIsRunning(true);
  const stopTimer = () => {
    setIsRunning(false);
    clearInterval(intervalIdRef.current);
  };
  const resetTimer = () => {
    stopTimer();
    setIsWorkPhase(true);
    setTimeLeft(workDuration);
  };

  // Format Time Display
  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div className="app">
      <h1>Interval Training Timer</h1>

      {/* Input Controls */}
      <div className="inputs">
        <label>
          Work Duration:
          <input
            type="text"
            value={workDuration}
            onChange={(e) => setWorkDuration(Number(e.target.value))}
            disabled={isRunning}
          />
        </label>
        {/* <label>
          Rest Duration:
          <input
            type="number"
            value={restDuration}
            onChange={(e) => setRestDuration(Number(e.target.value))}
            disabled={isRunning}
          />
        </label>
         */}

      </div>

      {/* Timer Display */}
      <div className="timer">
        <h2>{isWorkPhase ? "Work" : "Rest"} Time</h2>
        <div className="time-display">{formatTime(timeLeft)}</div>
      </div> 

      {/* Controls */}
      <div className="controls">
        <button onClick={startTimer} disabled={isRunning} className="startbtn">
          Start
        </button>
        <button onClick={stopTimer} disabled={!isRunning} className="stopbtn">
          Pause
        </button>
        <button onClick={resetTimer} className="resetbtn">
          Reset
        </button>
      </div>
    </div>
  );
}

export default App;
