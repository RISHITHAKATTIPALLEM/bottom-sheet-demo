import { useEffect } from "react";

export default function useSpring(target, setValue, stiffness = 0.08, damping = 0.75) {
  useEffect(() => {
    let vel = 0, frame;
    function step() {
      setValue(prev => {
        const disp = target - prev;
        const accel = disp * stiffness;
        vel = (vel + accel) * damping;
        const next = prev + vel;
        if (Math.abs(vel) < 0.1 && Math.abs(disp) < 0.5) return target;
        frame = requestAnimationFrame(step);
        return next;
      });
    }
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, setValue, stiffness, damping]);
}
