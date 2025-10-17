// app/loading-screen.tsx
"use client";

import { motion, Variants } from "framer-motion";

interface LoadingScreenProps {
  onAnimationComplete: () => void;
}

export default function LoadingScreen({
  onAnimationComplete,
}: LoadingScreenProps) {
  // Variants para a animação do container principal
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
    exit: {
      opacity: 0,
      filter: "blur(10px)", // Efeito de desfoque na saída
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  // Variants para a animação do traço de luz do SVG
  const pathVariants: Variants = {
    hidden: {
      pathLength: 0, // Começa sem ser desenhado
      opacity: 0,
    },
    visible: {
      pathLength: 1, // Anima até estar 100% desenhado
      opacity: 1,
      transition: {
        duration: 2.5, // Duração do desenho
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      className="position-fixed top-0 start-0 w-100 vh-100 d-flex justify-content-center align-items-center bg-dark"
      style={{ zIndex: 9999 }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onAnimationComplete={onAnimationComplete}
    >
      {/* Container do SVG para centralizar e aplicar filtros de brilho */}
      <div style={{ width: "150px", height: "150px" }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          style={{ overflow: "visible" }} // Permite que o brilho vaze para fora
        >
          {/* --- Filtro de Brilho (Neon Effect) --- */}
          <defs>
            <filter id="neon-glow">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* --- O "C" que será desenhado --- */}
          <motion.path
            d="M 80,50 A 30,30 0 1 1 50,20" // Coordenadas do arco 'C'
            fill="none"
            stroke="white"
            strokeWidth="5"
            strokeLinecap="round"
            filter="url(#neon-glow)" // Aplica o filtro de brilho
            variants={pathVariants}
          />
        </svg>
      </div>
    </motion.div>
  );
}
