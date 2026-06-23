import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'motion/react';

interface StatItem {
  percentage: number;
  color: 'navy' | 'red';
  text: string;
  isRedText: boolean;
}

function StatCard({ stat, idx }: { stat: StatItem; idx: number; key?: React.Key }) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.3 });
  
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      let startTimestamp: number | null = null;
      const duration = 1500; // 1.5s build up to sync with SVG drawing duration
      const total = stat.percentage;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        // Clean ease out cubic
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(easeOutCubic * total));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isInView, stat.percentage]);

  const strokeColor = stat.color === 'navy' ? '#0E1F35' : '#FF0101';
  const secondaryColor = stat.color === 'navy' ? '#FF0101' : '#0E1F35';
  const circumference = 100;
  const strokeDash = stat.percentage;

  return (
    <motion.div 
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay: idx * 0.12, ease: "easeOut" }}
      className="flex flex-col items-center max-w-[240px] text-center group cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Circular Chart Container with subtle hover scale/lift */}
      <div className="w-40 h-40 relative flex items-center justify-center transition-transform duration-300 group-hover:scale-108 group-hover:-translate-y-1">
        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.03)] group-hover:drop-shadow-[0_6px_10px_rgba(0,0,0,0.08)] transition-all">
          {/* Secondary Back Slice representing remaining */}
          <circle
            cx="18"
            cy="18"
            r="15.915"
            fill="transparent"
            stroke={secondaryColor}
            strokeWidth="4"
          />
          {/* Main Slice - animated on viewport entry */}
          <motion.circle
            cx="18"
            cy="18"
            r="15.915"
            fill="transparent"
            stroke={strokeColor}
            strokeWidth={hovered ? "4.5" : "4"}
            strokeDasharray={`${strokeDash} ${circumference - strokeDash}`}
            initial={{ strokeDashoffset: 100 }}
            animate={isInView ? { strokeDashoffset: 0 } : { strokeDashoffset: 100 }}
            transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1], delay: idx * 0.12 + 0.1 }}
            className="transition-[stroke-width] duration-300"
          />
        </svg>

        {/* Percentage Center Overlay with scale-up effect */}
        <div className="absolute inset-0 flex items-center justify-center flex-col bg-transparent select-none">
          <span className={`text-2xl font-black transition-transform duration-300 group-hover:scale-105 ${
            stat.color === 'navy' ? 'text-[#0E1F35]' : 'text-[#FF0101]'
          }`}>
            {count}%
          </span>
          <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest mt-0.5 group-hover:text-slate-500 transition-colors">
            Affirmed
          </span>
        </div>
      </div>

      {/* Stat description label matching exact colors */}
      <p className={`text-xs font-bold leading-normal mt-5 min-h-[48px] px-2 select-none transition-transform duration-300 group-hover:translate-y-0.5 ${
        stat.isRedText 
          ? 'text-[#FF0101]' 
          : 'text-slate-800'
      }`}>
        {stat.text}
      </p>
    </motion.div>
  );
}

export default function StatsSection() {
  const stats: StatItem[] = [
    {
      percentage: 92,
      color: 'navy',
      text: '92% of the costumers want Convenient Facilities.',
      isRedText: false
    },
    {
      percentage: 86,
      color: 'red',
      text: '86% of the Female costumers Desires PGs which are near to offices.',
      isRedText: true
    },
    {
      percentage: 63,
      color: 'navy',
      text: '63% of the Couples Focuses of Locality than offers Good Transport facilities.',
      isRedText: false
    },
    {
      percentage: 73,
      color: 'red',
      text: '73% of the Bachelors Desires Independent Flats which have low security deposits.',
      isRedText: true
    }
  ];

  return (
    <section id="stats-section" className="max-w-7xl mx-auto px-4 sm:px-12 py-16 text-center overflow-hidden">
      
      {/* Title with smooth scroll fade-in */}
      <motion.h2 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-2xl sm:text-4.5xl font-extrabold tracking-tight text-slate-900 mb-16 select-none"
      >
        People trust us because we offer good services.
        <div className="w-24 h-1 bg-rose-500 mx-auto mt-4 rounded-full animate-pulse" />
      </motion.h2>

      {/* Grid of 4 stats columns precisely based on image */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
        {stats.map((stat, idx) => (
          <StatCard key={idx} stat={stat} idx={idx} />
        ))}
      </div>

    </section>
  );
}
