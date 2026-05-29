"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { TourShow } from "@/types/tourShow";
import Image from "next/image";
import { useMotionValue, useSpring, motion } from "framer-motion";
import {
  TourShowsTicker,
  TourMap,
  TourShowModal,
} from "@/components/tour-shows";
import EpisodesGrid from "@/components/episodes/EpisodesGrid";
import { StoryPromptsCarousel } from "@/components/story-prompts";

const SPOTLIGHT_RADIUS = 200;
const FADE_DELAY = 5000;

interface TrailPoint {
  id: number;
  x: number;
  y: number;
  createdAt: number;
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [trailPoints, setTrailPoints] = useState<TrailPoint[]>([]);
  const pointIdRef = useRef(0);
  const [isHovering, setIsHovering] = useState(false);
  const [selectedTourShow, setSelectedTourShow] = useState<TourShow | null>(
    null,
  );

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 100, damping: 25 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  // Draw mask on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      canvas.width = rect.width;
      canvas.height = rect.height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Fill with yellow
      ctx.fillStyle = "#f9c937";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Cut out holes where trail points are
      ctx.globalCompositeOperation = "destination-out";

      const now = Date.now();
      trailPoints.forEach((point) => {
        const age = now - point.createdAt;
        const opacity = Math.max(0, 1 - age / FADE_DELAY);
        const radius = SPOTLIGHT_RADIUS * opacity;

        if (radius > 0) {
          ctx.beginPath();
          ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Reset composite operation
      ctx.globalCompositeOperation = "source-over";
    };

    draw();
    const interval = setInterval(draw, 16); // ~60fps
    return () => clearInterval(interval);
  }, [trailPoints]);

  // Cleanup old trail points
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setTrailPoints((prev) =>
        prev.filter((point) => now - point.createdAt < FADE_DELAY),
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const xPos = e.clientX - rect.left;
      const yPos = e.clientY - rect.top;

      mouseX.set(xPos);
      mouseY.set(yPos);

      const newPoint: TrailPoint = {
        id: pointIdRef.current++,
        x: xPos,
        y: yPos,
        createdAt: Date.now(),
      };

      setTrailPoints((prev) => [...prev, newPoint]);
    },
    [mouseX, mouseY],
  );

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setTrailPoints([]);
  };

  return (
    <>
      <div
        ref={containerRef}
        className="relative w-full px-4 h-[calc(100vh-4rem)] overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/imagen-inicio-jpg.jpg"
            alt="EDN Background"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Canvas Mask Layer - yellow with holes revealing image */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-20 pointer-events-none"
        />

        {/* Content Layer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center px-4"
        >
          {/* ESCUELA DE NADA */}
          <motion.div
            initial={{ y: 80, opacity: 0, rotate: -3 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 150,
              damping: 18,
              delay: 0.3,
            }}
            className="text-center"
          >
            <h1 className="font-syne text-2xl sm:text-4xl md:text-6xl lg:text-8xl uppercase tracking-tighter text-black font-extrabold leading-none drop-shadow-[2px_2px_0px_rgba(255,255,255,0.8)]">
              ESCUELA
            </h1>
            <h1 className="font-syne text-2xl sm:text-4xl md:text-6xl lg:text-8xl uppercase tracking-tighter text-black font-extrabold leading-none -mt-1 sm:-mt-2 md:-mt-4 drop-shadow-[2px_2px_0px_rgba(255,255,255,0.8)]">
              DE NADA
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
              delay: 0.6,
            }}
            className="font-syne font-bold text-sm sm:text-base md:text-xl lg:text-2xl text-black/80 mt-4 sm:mt-6 md:mt-8 max-w-lg text-center drop-shadow-[1px_1px_0px_rgba(255,255,255,0.6)]"
          >
            el mejor podcast de esta mierda caballero!
          </motion.p>
        </motion.div>

        {/* Instructions hint - only when not hovering */}
        {!isHovering && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 z-40"
          >
            <span className="font-plus-jakarta text-xs sm:text-sm text-white uppercase tracking-wider drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)]">
              move your mouse to explore
            </span>
          </motion.div>
        )}
      </div>

      {/* Tour Shows Ticker - outside the hero container */}
      <section id="tour-carousel">
        <TourShowsTicker onShowClick={setSelectedTourShow} />
      </section>

      {/* Tour Map */}
      <section id="tour-map">
        <TourMap />
      </section>

      {/* Tour Show Modal */}
      <TourShowModal
        show={selectedTourShow}
        onClose={() => setSelectedTourShow(null)}
      />

      {/* Episodes Grid — preview mode */}
      <EpisodesGrid mode="preview" />

      {/* Story Prompts Carousel */}
      <section id="stories">

        <StoryPromptsCarousel />
      </section>
    </>
  );
}
