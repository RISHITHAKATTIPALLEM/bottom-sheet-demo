import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import useDrag from "../hooks/useDrag";
import useSpring from "../hooks/useSpring";
import "./BottomSheet.css";

function BottomSheet({
  snapPoints = [0.9, 0.5, 0],
  initialSnap = 2,
  onSnap = () => {},
  onClose = () => {},
  children,
}) {
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const pixels = useMemo(() => snapPoints.map(p => vh * (1 - p)), [vh, snapPoints]);

  const [y, setY] = useState(pixels[initialSnap]);
  const [target, setTarget] = useState(pixels[initialSnap]);

  const yRef = useRef(y);
  useEffect(() => {
    yRef.current = y;
  }, [y]);

  
  useSpring(target, setY, 0.08, 0.75);

  
  useEffect(() => {
    const t = setTimeout(() => setTarget(pixels[initialSnap]), 50);
    return () => clearTimeout(t);
  }, [initialSnap, pixels]);


 
  useEffect(() => {
    document.body.style.overflow = target < vh ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [target, vh]);

 
  const dragMove = useCallback(
    dY => setY(prev => Math.min(Math.max(prev + dY, pixels[0]), pixels[2])),
    [pixels]
  );

  const dragEnd = useCallback(() => {
    const current = yRef.current;
    const nearest = pixels.reduce((a, b) =>
      Math.abs(b - current) < Math.abs(a - current) ? b : a
    );
    setTarget(nearest);
    const idx = pixels.indexOf(nearest);
    onSnap(idx);
    if (idx === pixels.length - 1) onClose();
  }, [pixels, onSnap, onClose]);

  const pointerDown = useDrag(dragMove, dragEnd);

 
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowUp") setTarget(pixels[0]);
      if (e.key === "ArrowDown") setTarget(pixels[2]);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, pixels]);

  return (
    <>
      {/* Overlay */}
      <div
        className="bs-overlay"
        style={{
          opacity: 1 - y / pixels[2],
          pointerEvents: y >= pixels[2] - 10 ? "none" : "auto",
        }}
        onClick={() => {
          setTarget(pixels[2]);
          onClose();
        }}
      />

      {/* Bottom Sheet */}
      <div
        className="bs-sheet"
        role="dialog"
        aria-label="Bottom Sheet"
        style={{ transform: `translateY(${Math.min(y, vh - 40)}px)` }}
      >
        <div className="bs-handle" onPointerDown={pointerDown} />
        <div className="bs-content">{children}</div>
      </div>
    </>
  );
}


export default BottomSheet;
