import React, { useEffect, useRef } from 'react';
import './App.css';

function App() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let mouseX = 0;
    let mouseY = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const asciiChars = letters + numbers;

    class AsciiParticle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.char = asciiChars[Math.floor(Math.random() * asciiChars.length)];
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 0.5 + 0.2;
        this.size = Math.random() * 14 + 10;
        this.hue = Math.random() * 60 + 180; // Blue to cyan range
        this.opacity = Math.random() * 0.5 + 0.1;
      }

      update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        const dx = this.x - mouseX;
        const dy = this.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          this.angle = Math.atan2(dy, dx) + Math.PI;
          this.char = asciiChars[Math.floor(Math.random() * asciiChars.length)];
          this.size = Math.min(this.size + 1, 28);
          this.opacity = Math.min(this.opacity + 0.1, 0.9);
          this.speed = Math.min(this.speed + 0.1, 1.2);
        } else {
          this.size = Math.max(this.size - 0.1, 10);
          this.opacity = Math.max(this.opacity - 0.01, 0.1);
          this.speed = Math.max(this.speed - 0.05, 0.2);
        }

        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
          this.reset();
        }
      }

      draw() {
        ctx.font = `${this.size}px 'Courier New', monospace`;
        ctx.fillStyle = `hsla(${this.hue}, 100%, 50%, ${this.opacity})`;
        ctx.fillText(this.char, this.x, this.y);
      }
    }

    const particles = Array.from({ length: 500 }, () => new AsciiParticle());

    const animate = () => {
      ctx.fillStyle = 'rgba(5, 5, 16, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    canvas.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="App">
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}

export default App;
