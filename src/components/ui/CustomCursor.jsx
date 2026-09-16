import React, { useEffect } from "react";

export default function CustomCursor() {
  useEffect(() => {
    const canvas = document.getElementById("cursor-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      isOutside: true,
      speed: 0,
    };

    const updateMousePos = (clientX, clientY) => {
      const dx = clientX - mouse.targetX;
      const dy = clientY - mouse.targetY;
      const dist = Math.hypot(dx, dy);
      mouse.speed = Math.min(30, mouse.speed * 0.4 + dist * 0.6);
      mouse.targetX = clientX;
      mouse.targetY = clientY;
      mouse.isOutside = false;
    };

    const handleMouseMove = (e) => {
      updateMousePos(e.clientX, e.clientY);
    };

    const handleMouseLeave = () => {
      mouse.isOutside = true;
      mouse.speed = 0;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    let animationFrameId;
    function animate() {
      mouse.x += (mouse.targetX - mouse.x) * 0.4;
      mouse.y += (mouse.targetY - mouse.y) * 0.4;
      mouse.speed *= 0.82;

      ctx.clearRect(0, 0, width, height);

      if (!mouse.isOutside) {
        const motionFactor = Math.min(1, mouse.speed / 6);
        if (motionFactor > 0.01) {
          const cursorGlowRadius = 20 * motionFactor;
          const starGlow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, cursorGlowRadius);
          starGlow.addColorStop(0.0, `rgba(255, 255, 255, ${0.85 * motionFactor})`);
          starGlow.addColorStop(0.5, `rgba(235, 245, 255, ${0.3 * motionFactor})`);
          starGlow.addColorStop(1.0, "rgba(0, 0, 0, 0)");

          ctx.fillStyle = starGlow;
          ctx.beginPath();
          ctx.arc(mouse.x, mouse.y, cursorGlowRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      id="cursor-canvas"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    />
  );
}