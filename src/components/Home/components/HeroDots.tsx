import { useEffect, useRef } from "react";

const SPACING = 20;
const RADIUS = 120;
const BRIGHTEN_MS = 70;
const FADE_MS = 250;
const EXPANSION = 0.2;

const HeroDots = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.parentElement;
    const context = canvas?.getContext("2d");
    if (!canvas || !hero || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cursor: { x: number; y: number } | null = null;
    let dots: {
      x: number;
      y: number;
      brightness: number;
      offsetX: number;
      offsetY: number;
    }[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let lastTime = 0;

    // Reuse one glow sprite rather than rebuilding gradients for every dot/frame.
    const sprite = document.createElement("canvas");
    const spriteContext = sprite.getContext("2d");
    if (!spriteContext) return;
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    sprite.width = sprite.height = 12 * scale;
    spriteContext.scale(scale, scale);
    const glow = spriteContext.createRadialGradient(6, 6, 0, 6, 6, 6);
    glow.addColorStop(0, "#ffffff");
    glow.addColorStop(0.16, "#effaff");
    glow.addColorStop(0.26, "#b5e5ff");
    glow.addColorStop(0.4, "#7ec8f380");
    glow.addColorStop(1, "#7ec8f300");
    spriteContext.fillStyle = glow;
    spriteContext.fillRect(0, 0, 12, 12);

    const baseSprite = document.createElement("canvas");
    const baseContext = baseSprite.getContext("2d");
    if (!baseContext) return;
    baseSprite.width = baseSprite.height = 4 * scale;
    baseContext.scale(scale, scale);
    const baseDot = baseContext.createRadialGradient(2, 2, 1, 2, 2, 1.5);
    baseDot.addColorStop(0, "#7ec8f3");
    baseDot.addColorStop(1, "#7ec8f300");
    baseContext.fillStyle = baseDot;
    baseContext.fillRect(0, 0, 4, 4);

    const draw = (time: number) => {
      frame = 0;
      const elapsed = Math.min(time - lastTime, 64);
      lastTime = time;
      context.clearRect(0, 0, width, height);
      let changing = false;

      for (const dot of dots) {
        const distance = cursor
          ? Math.hypot(dot.x - cursor.x, dot.y - cursor.y)
          : RADIUS;
        const target = Math.max(
          0,
          Math.min(0.2, (RADIUS - distance) / (RADIUS * 1.5)),
        );
        // Each dot retains its light after the cursor passes, then cools independently.
        const duration = target > dot.brightness ? BRIGHTEN_MS : FADE_MS;
        dot.brightness = reducedMotion.matches
          ? target
          : dot.brightness +
            (target - dot.brightness) * (1 - Math.exp(-elapsed / duration));
        if (Math.abs(target - dot.brightness) > 0.002) changing = true;
        else dot.brightness = target;

        // Expand the local grid gently, with no displacement at the circle's edge.
        const expansion =
          cursor && !reducedMotion.matches
            ? EXPANSION * Math.pow(Math.max(0, 1 - distance / RADIUS), 2)
            : 0;
        const targetX = cursor ? (dot.x - cursor.x) * expansion : 0;
        const targetY = cursor ? (dot.y - cursor.y) * expansion : 0;
        const easing = reducedMotion.matches
          ? 1
          : 1 - Math.exp(-elapsed / duration);
        dot.offsetX += (targetX - dot.offsetX) * easing;
        dot.offsetY += (targetY - dot.offsetY) * easing;
        if (
          Math.abs(targetX - dot.offsetX) > 0.01 ||
          Math.abs(targetY - dot.offsetY) > 0.01
        ) {
          changing = true;
        } else {
          dot.offsetX = targetX;
          dot.offsetY = targetY;
        }

        const x = dot.x + dot.offsetX;
        const y = dot.y + dot.offsetY;
        context.globalAlpha = 0.26 * Math.max(0, 1 - dot.y / (height * 0.88));
        context.drawImage(baseSprite, x - 2, y - 2, 4, 4);
        if (dot.brightness > 0.002) {
          context.globalAlpha = dot.brightness;
          context.drawImage(sprite, x - 6, y - 6, 12, 12);
        }
      }
      context.globalAlpha = 1;
      hero.dataset.dotsReady = "true";
      if (changing) frame = requestAnimationFrame(draw);
    };

    const scheduleDraw = () => {
      if (frame || document.hidden) return;
      lastTime = performance.now();
      frame = requestAnimationFrame(draw);
    };

    const resize = () => {
      width = hero.clientWidth;
      height = hero.clientHeight;
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      context.setTransform(scale, 0, 0, scale, 0, 0);
      dots = [];
      for (let y = SPACING / 2; y < height; y += SPACING) {
        for (let x = SPACING / 2; x < width; x += SPACING) {
          dots.push({ x, y, brightness: 0, offsetX: 0, offsetY: 0 });
        }
      }
      scheduleDraw();
    };

    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const bounds = hero.getBoundingClientRect();
      cursor = {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      };
      scheduleDraw();
    };

    const leave = () => {
      cursor = null;
      scheduleDraw();
    };

    const visibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
        cursor = null;
        for (const dot of dots) {
          dot.brightness = 0;
          dot.offsetX = dot.offsetY = 0;
        }
        context.clearRect(0, 0, width, height);
        delete hero.dataset.dotsReady;
      } else {
        scheduleDraw();
      }
    };

    const observer = new ResizeObserver(resize);
    observer.observe(hero);
    hero.addEventListener("pointermove", move);
    hero.addEventListener("pointerleave", leave);
    hero.addEventListener("pointercancel", leave);
    document.addEventListener("visibilitychange", visibilityChange);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      delete hero.dataset.dotsReady;
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", leave);
      hero.removeEventListener("pointercancel", leave);
      document.removeEventListener("visibilitychange", visibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="landing-hero-dot-glow"
      aria-hidden="true"
    />
  );
};

export default HeroDots;
