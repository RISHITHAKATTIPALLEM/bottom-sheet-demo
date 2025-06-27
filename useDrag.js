export default function useDrag(onMove, onEnd) {
    let startY = 0;
    const getY = e => (e.touches ? e.touches[0].clientY : e.clientY);
  
    function move(e) {
      const cur = getY(e);
      onMove(cur - startY);
      startY = cur;               // reset each frame for smooth step
    }
  
    function up() {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup",   up);
      onEnd();
    }
  
    return function down(e) {
      startY = getY(e);
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup",   up);
    };
  }
  