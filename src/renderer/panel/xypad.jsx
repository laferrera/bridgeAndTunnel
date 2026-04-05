import React, { useRef, useCallback } from "react";
import "./xypad.css";

export default function XYPad(props) {
  const padRef = useRef(null);
  const isDragging = useRef(false);

  const x = props.state["x"].val;
  const y = props.state["y"].val;

  const updatePosition = useCallback(
    (e) => {
      const rect = padRef.current.getBoundingClientRect();
      const newX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const newY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      props.state["x"].fn(newX);
      props.state["y"].fn(newY);
    },
    [props.state]
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging.current) return;
      updatePosition(e);
    },
    [updatePosition]
  );

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove]);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    updatePosition(e);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="XYPadWrapper">
      <div
        ref={padRef}
        className="XYPad"
        onMouseDown={handleMouseDown}
      >
        <div
          className="XYPadCrosshairH"
          style={{ top: `${y * 100}%` }}
        />
        <div
          className="XYPadCrosshairV"
          style={{ left: `${x * 100}%` }}
        />
        <div
          className="XYPadDot"
          style={{
            left: `${x * 100}%`,
            top: `${y * 100}%`,
          }}
        />
      </div>
      <div className="XYPadReadout">
        x: {x.toFixed(3)}&nbsp;&nbsp;y: {y.toFixed(3)}
      </div>
    </div>
  );
}
