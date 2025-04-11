import { useEffect, useRef } from "react";

const MatrixEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    const columns = Math.floor(width / 20);
    const drops = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(21, 21, 21, 0.075)";
      ctx.fillRect(0, 0, width, height);

      ctx.font = "16px monospace";

      drops.forEach((y, x) => {
        const text = Math.floor(Math.random() * 10).toString();
        const randomNum = Math.random();
        if (randomNum < 0.25) {
          ctx.fillStyle = `#FFDD03`;
        } else if (randomNum < 0.6) {
          ctx.fillStyle = `#fa175c`;
        } else {
          ctx.fillStyle = `#15FAB4`;
        }
        ctx.fillText(text, x * 20, y * 20);

        if (y * 20 > height && Math.random() > 0.975) {
          drops[x] = 0;
        }
        drops[x]++;
      });
    };

    const interval = setInterval(draw, 50);

    return () => clearInterval(interval);
  }, []);

  return <canvas ref={canvasRef} className="blur-xs" />;
};

export default MatrixEffect;
