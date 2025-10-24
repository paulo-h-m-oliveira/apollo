"use client";

import { motion, Variants, AnimatePresence } from "framer-motion";
import { useState } from "react"; // 'useEffect' removido daqui
import LoadingScreen from "./loading-screen";
import Header from "./components/Header";
import CustomCursor from "./components/CustomCursor";

// --- Componente da Página Principal ---
export default function HomePage() {
  // Estado para controlar a tela de carregamento
  const [isLoading, setIsLoading] = useState(true);

  // Variants para a animação dos títulos principais
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <>
      {/* Componentes reutilizáveis */}
      <CustomCursor />
      <Header />

      {/* AnimatePresence gerencia a animação de saída da tela de loading */}
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen onAnimationComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {/* O conteúdo principal só é renderizado após o loading */}
      {!isLoading && (
        <motion.div
          // Animação de entrada para a página principal
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="position-relative d-flex flex-column min-vh-100 justify-content-center align-items-center bg-dark text-white overflow-hidden"
        >
          {/* Luzes de fundo (gradientes animados) */}
          <div className="gradient-bg" />
          <div className="gradient-bg-2" />

          <main className="position-relative z-1 text-center px-3">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h1
                className="main-title fw-bolder"
                variants={itemVariants}
                data-hover
              >
                I'm a graphic designer,
              </motion.h1>
              <motion.h1
                className="main-title fw-bolder"
                variants={itemVariants}
                data-hover
              >
                UX/UI designer
              </motion.h1>
              <motion.h1
                className="main-title fw-bolder"
                variants={itemVariants}
                data-hover
              >
                & front-end web developer.
              </motion.h1>
            </motion.div>

            {/* Link "See my projects" com animação pulsante */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: [1, 1.02, 1], // Animação de pulso
              }}
              transition={{
                duration: 0.8,
                delay: 1.5,
                ease: "easeOut",
                // Configuração para a animação 'scale' repetir infinitamente
                scale: {
                  delay: 2.5,
                  repeat: Infinity,
                  repeatDelay: 3,
                  duration: 0.7,
                  ease: "easeInOut",
                },
              }}
              className="mt-5"
            >
              <a
                href="/work"
                className="fs-4 fw-light text-white-50 text-decoration-none project-link"
                data-hover
              >
                → See my projects
              </a>
            </motion.div>
          </main>

          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.8 }}
            className="position-absolute bottom-0 mb-4 d-flex gap-4"
          >
            <a
              href="#"
              className="text-secondary text-decoration-none footer-link"
              data-hover
            >
              Linkedin
            </a>
            <a
              href="#"
              className="text-secondary text-decoration-none footer-link"
              data-hover
            >
              Twitter
            </a>
            <a
              href="#"
              className="text-secondary text-decoration-none footer-link"
              data-hover
            >
              Instagram
            </a>
          </motion.footer>
        </motion.div>
      )}

      {/* Estilos Globais para toda a aplicação */}
      <style jsx global>{`
        body {
          cursor: none;
          background-color: #111;
        }

        .main-title {
          font-size: 2.25rem;
          letter-spacing: -0.05em;
        }
        @media (min-width: 768px) {
          .main-title {
            font-size: 3.75rem;
          }
        }
        @media (min-width: 1024px) {
          .main-title {
            font-size: 5rem;
          }
        }

        .project-link:hover,
        .footer-link:hover {
          color: white !important;
          transition: color 0.3s;
        }

        .gradient-bg,
        .gradient-bg-2 {
          position: absolute;
          border-radius: 9999px;
          filter: blur(72px);
          opacity: 0.3;
          z-index: -1;
        }
        .gradient-bg {
          width: 800px;
          height: 800px;
          background-image: linear-gradient(
            to top right,
            #9333ea,
            #ec4899,
            #ef4444
          );
          animation: blob 20s infinite cubic-bezier(0.68, -0.55, 0.27, 1.55);
        }
        .gradient-bg-2 {
          width: 600px;
          height: 600px;
          background-image: linear-gradient(
            to top right,
            #3b82f6,
            #2dd4bf,
            #4ade80
          );
          bottom: 0;
          right: 0;
          animation: blob2 25s infinite cubic-bezier(0.68, -0.55, 0.27, 1.55);
        }

        .custom-cursor {
          display: none;
        }
        @media (min-width: 640px) {
          .custom-cursor {
            display: block;
            width: 1rem;
            height: 1rem;
            background-color: white;
            border-radius: 50%;
            position: fixed;
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
            transition: transform 0.2s ease-out, background-color 0.3s;
          }
          .custom-cursor.hovering {
            transform: translate(-50%, -50%) scale(2.5);
            background-color: rgba(255, 255, 255, 0.3);
          }
        }

        @keyframes blob {
          0% {
            transform: translate(-25%, -25%) scale(1);
          }
          33% {
            transform: translate(25%, -35%) scale(1.2);
          }
          66% {
            transform: translate(-30%, 30%) scale(0.9);
          }
          100% {
            transform: translate(-25%, -25%) scale(1);
          }
        }
        @keyframes blob2 {
          0% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(20%, -30%) scale(1.1);
          }
          66% {
            transform: translate(-25%, 20%) scale(0.8);
          }
          100% {
            transform: translate(0, 0) scale(1);
          }
        }
      `}</style>
    </>
  );
}
