// app/components/CustomCursor.tsx (NOVO)
"use client";
import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) =>
      setPosition({ x: e.clientX, y: e.clientY });
    const handleMouseOver = (e: MouseEvent) => {
      if (e.target instanceof Element && e.target.closest("[data-hover]"))
        setIsHovering(true);
    };
    const handleMouseOut = (e: MouseEvent) => {
      if (e.target instanceof Element && e.target.closest("[data-hover]"))
        setIsHovering(false);
    };

    window.addEventListener("mousemove", onMouseMove);
    document.body.addEventListener("mouseover", handleMouseOver);
    document.body.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.body.removeEventListener("mouseover", handleMouseOver);
      document.body.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  const cursorClasses = `custom-cursor ${isHovering ? "hovering" : ""}`;
  return (
    <div
      className={cursorClasses}
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    />
  );
}
