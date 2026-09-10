"use client";

import { useEffect, useRef } from "react";

const CANVAS_WIDTH = 2048;
const CANVAS_HEIGHT = 691;
const MOVER_COUNT = 1000;
const MOVER_SIZE = 8;
const TOP_SPEED = 3;
const MOUSE_RADIUS = 150;

type Mover = {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  accelerationX: number;
  accelerationY: number;
  drag: number;
};

export function MoversCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const isMobile = window.matchMedia("(max-width: 700px)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    canvas.width = CANVAS_WIDTH * pixelRatio;
    canvas.height = CANVAS_HEIGHT * pixelRatio;
    context.scale(pixelRatio, pixelRatio);

    const movers: Mover[] = Array.from({ length: MOVER_COUNT }, () => ({
      x: MOVER_SIZE + Math.random() * (CANVAS_WIDTH - MOVER_SIZE * 2),
      y: MOVER_SIZE + Math.random() * (CANVAS_HEIGHT - MOVER_SIZE * 2),
      velocityX: 0,
      velocityY: 0,
      accelerationX: 0,
      accelerationY: 0,
      drag: 0,
    }));

    const pointer = { x: 0, y: 0, active: false };

    const updatePointer = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointer.x = ((event.clientX - bounds.left) / bounds.width) * CANVAS_WIDTH;
      pointer.y = ((event.clientY - bounds.top) / bounds.height) * CANVAS_HEIGHT;
      pointer.active = true;
    };

    const clearPointer = () => {
      pointer.active = false;
    };

    canvas.addEventListener("pointermove", updatePointer);
    canvas.addEventListener("pointerleave", clearPointer);

    let animationFrame = 0;

    const draw = () => {
      const time = performance.now() / 1000;
      context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      context.fillStyle = "#000000";

      for (const mover of movers) {
        if (isMobile && !prefersReducedMotion) {
          // Mobile gets a quiet preset flow so the component is alive without touch.
          mover.accelerationX = Math.sin(time * 0.65 + mover.y * 0.012) * 0.045;
          mover.accelerationY = Math.cos(time * 0.55 + mover.x * 0.008) * 0.045;
          mover.velocityX *= 0.995;
          mover.velocityY *= 0.995;
        } else if (pointer.active) {
          const directionX = pointer.x - mover.x;
          const directionY = pointer.y - mover.y;
          const distance = Math.hypot(directionX, directionY);

          if (distance < MOUSE_RADIUS && distance > 0) {
            mover.drag = 0.2 - (distance / MOUSE_RADIUS) * 0.19;
            mover.accelerationX = (directionX / distance) * mover.drag;
            mover.accelerationY = (directionY / distance) * mover.drag;
          } else {
            mover.drag = 0;
            mover.accelerationX = 0;
            mover.accelerationY = 0;
            mover.velocityX *= 0.99;
            mover.velocityY *= 0.99;
          }
        } else {
          mover.accelerationX = 0;
          mover.accelerationY = 0;
          mover.velocityX *= 0.99;
          mover.velocityY *= 0.99;
        }

        mover.velocityX += mover.accelerationX;
        mover.velocityY += mover.accelerationY;

        const speed = Math.hypot(mover.velocityX, mover.velocityY);

        if (speed > TOP_SPEED) {
          mover.velocityX = (mover.velocityX / speed) * TOP_SPEED;
          mover.velocityY = (mover.velocityY / speed) * TOP_SPEED;
        }

        mover.x += mover.velocityX;
        mover.y += mover.velocityY;

        if (mover.x < MOVER_SIZE / 2 || mover.x > CANVAS_WIDTH - MOVER_SIZE / 2) {
          mover.velocityX *= -1;
          mover.accelerationX *= -1;
          mover.x = Math.max(MOVER_SIZE / 2, Math.min(CANVAS_WIDTH - MOVER_SIZE / 2, mover.x));
        }

        if (mover.y < MOVER_SIZE / 2 || mover.y > CANVAS_HEIGHT - MOVER_SIZE / 2) {
          mover.velocityY *= -1;
          mover.accelerationY *= -1;
          mover.y = Math.max(MOVER_SIZE / 2, Math.min(CANVAS_HEIGHT - MOVER_SIZE / 2, mover.y));
        }

        context.beginPath();
        context.arc(mover.x, mover.y, MOVER_SIZE / 2, 0, Math.PI * 2);
        context.fill();
      }

      animationFrame = window.requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      canvas.removeEventListener("pointermove", updatePointer);
      canvas.removeEventListener("pointerleave", clearPointer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="simple-home-section-image"
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      aria-label="Interactive field of moving particles"
      role="img"
    />
  );
}
