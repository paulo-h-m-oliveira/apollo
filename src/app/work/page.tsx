"use client";

import { motion, Variants } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import CustomCursor from "../components/CustomCursor";

// ... (dados dos projetos continuam os mesmos) ...
const projects = [
  // ... seus projetos aqui ...
  {
    id: 1,
    title: "Sharlee",
    tags: "Branding, UX/UI Design, Web Development",
    year: "2024",
    imageUrl: "...",
  },
  {
    id: 2,
    title: "Cocolyze",
    tags: "Branding, Web Design",
    year: "2023",
    imageUrl: "...",
  },
  {
    id: 3,
    title: "Portraits",
    tags: "Illustration, Art Direction",
    year: "2023",
    imageUrl: "...",
  },
  {
    id: 4,
    title: "Cosmetics Brand",
    tags: "Branding, Packaging",
    year: "2022",
    imageUrl: "...",
  },
];

export default function WorkPage() {
  const gridVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Aumentei o atraso para um efeito mais claro
      },
    },
  };

  // --- 1. NOVAS VARIANTS MAIS DINÂMICAS ---
  // Os cards vão "pular" da tela com um leve desfoque
  const projectVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
      filter: "blur(5px)", // Efeito de desfoque
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)", // Remove o desfoque
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <>
      <CustomCursor />
      <Header />
      <div className="gradient-bg" />
      <div className="gradient-bg-2" />

      <motion.div
        className="text-white bg-dark min-vh-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container-lg" style={{ paddingTop: "120px" }}>
          <motion.div
            className="row"
            variants={gridVariants}
            initial="hidden"
            animate="visible"
          >
            {projects.map((project) => (
              // --- 2. ADICIONADO whileHover NO CARD INTEIRO ---
              <motion.div
                className="col-lg-6 mb-5"
                key={project.id}
                variants={projectVariants}
                // Animação de "levantar" o card ao passar o mouse
                whileHover={{ scale: 1.03 }}
              >
                <Link
                  href="#"
                  className="project-card text-decoration-none"
                  data-hover
                >
                  <div className="project-image-wrapper">
                    <motion.img
                      src={project.imageUrl}
                      alt={project.title}
                      className="img-fluid"
                      // A imagem interna ainda faz zoom para um efeito parallax
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    />
                  </div>
                  <div className="project-info d-flex justify-content-between text-white mt-3">
                    <div>
                      <h3 className="fs-4 fw-bold mb-1">{project.title}</h3>
                      <p className="text-white-50 mb-0">{project.tags}</p>
                    </div>
                    <span className="text-white-50">{project.year}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
        <footer className="text-center text-white-50 py-5 fs-small">
          Designed and coded by Sharlee © 2025
        </footer>
      </motion.div>

      {/* --- 3. CSS ADICIONAL PARA O EFEITO DE GLOW --- */}
      <style jsx global>{`
        body {
          cursor: none;
          background-color: #111;
        }
        .fs-small {
          font-size: 0.875rem;
        }

        .project-card {
          display: block;
          transition: all 0.3s ease;
        }
        /* Adiciona um "glow" roxo (combinando com o gradiente) no hover */
        .project-card:hover {
          box-shadow: 0 20px 50px rgba(147, 51, 234, 0.15); /* Roxo do gradiente */
        }

        .project-image-wrapper {
          overflow: hidden;
          border-radius: 8px;
        }
        .project-card .img-fluid {
          width: 100%;
          object-fit: cover;
        }

        /* ... (Estilos do cursor, gradientes e keyframes permanecem os mesmos) ... */
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
        @keyframes blob {
          /* ... */
        }
        @keyframes blob2 {
          /* ... */
        }
      `}</style>
    </>
  );
}
