// src/App.jsx
import { useState, useEffect } from "react";
import BottomSheet from "./components/BottomSheet";
import "./App.css";

export default function App() {
  const [snap, setSnap]   = useState(2);  
  const [darkMode, setDM] = useState(false);

 
  useEffect(() => {
    const saved = localStorage.getItem("snapIndex");
    if (saved !== null) setSnap(Number(saved));
  }, []);

  
  useEffect(() => {
    localStorage.setItem("snapIndex", snap);
  }, [snap]);

  // Apply dark / light theme
  useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
  }, [darkMode]);
 

  
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setSnap(2);      
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);                                     

  return (
    <main className="demo">
      <button className="mode-toggle" onClick={() => setDM(!darkMode)}>
        {darkMode ? "Light" : "Dark"} Mode
      </button>

      {snap === 2 && (
        <button className="demo-btn" onClick={() => setSnap(0)}>
          Show Bottom Sheet
        </button>
      )}

      <BottomSheet
        snapPoints={[0.9, 0.5, 0]}
        initialSnap={snap}
        onSnap={setSnap}
        onClose={() => setSnap(2)}
      >
        <h2>Hello from the Bottom Sheet!</h2>
        <p>Drag me, tap outside, or press ESC to close.</p>

        <div className="controls">
          <button onClick={() => setSnap(0)}>Open</button>
          <button onClick={() => setSnap(1)}>Half</button>
          <button onClick={() => setSnap(2)}>Close</button>
        </div>
      </BottomSheet>
    </main>
  );
}
