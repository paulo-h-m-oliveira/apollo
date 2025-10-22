"use client";

import { motion, Variants } from "framer-motion";
import { useState, useEffect } from "react"; // Importe useState e useEffect
import Link from "next/link";
import Header from "../components/Header";
import CustomCursor from "../components/CustomCursor";
import { supabase } from "../lib/supabaseClient"; // Importe seu cliente Supabase

// 1. Defina um "tipo" para seus projetos
// Deve corresponder exatamente à sua tabela do Supabase
interface Project {
  id: number;
  created_at: string;
  title: string;
  tags: string;
  year: string;
  imageurl: string;
}

// --- Componente da Página ---
export default function WorkPage() {
  // 2. Crie estados para os projetos, loading e erros
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Variants para animação (sem alteração)
  const gridVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const projectVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.9, filter: "blur(5px)" },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  // 3. Crie um useEffect para buscar os dados quando a página carregar
  useEffect(() => {
    async function fetchProjects() {
      try {
        // Busca os dados da sua tabela 'projects'
        const { data, error } = await supabase
          .from("projects")
          .select("*") // Pega todas as colunas
          .order("year", { ascending: false }); // Ordena pelos mais recentes

        if (error) {
          throw error;
        }

        if (data) {
          setProjects(data); // Salva os projetos no estado
        }
      } catch (err: any) {
        console.error("Erro ao buscar projetos:", err.message);
        setError("Não foi possível carregar os projetos.");
      } finally {
        setIsLoading(false); // Termina o loading
      }
    }

    fetchProjects();
  }, []); // O array vazio [] faz com que isso rode apenas uma vez

  // --- Lógica de Renderização ---

  // 4. Mostrar um spinner enquanto carrega
  if (isLoading) {
    return (
      <div className="position-relative d-flex min-vh-100 text-white justify-content-center align-items-center bg-dark">
        <Header />
        <div
          className="spinner-border"
          role="status"
          style={{ width: "3rem", height: "3rem" }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // 5. Mostrar uma mensagem de erro
  if (error) {
    return (
      <div className="position-relative d-flex min-vh-100 text-danger justify-content-center align-items-center bg-dark">
        <Header />
        <p className="fs-3">{error}</p>
      </div>
    );
  }

  // 6. Mostrar os projetos (quando tudo der certo)
  return (
    <>
      <CustomCursor />
      <Header />
      <div className="gradient-bg" />
      <div className="gradient-bg-2" />

      <motion.div
        className="text-white min-vh-100" // Removido bg-dark para as luzes aparecerem
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
            {/* Mapeia os projetos vindos do Supabase */}
            {projects.map((project) => (
              <motion.div
                className="col-lg-6 mb-5"
                key={project.id}
                variants={projectVariants}
                whileHover={{ scale: 1.03 }}
              >
                <Link
                  href="#"
                  className="project-card text-decoration-none"
                  data-hover
                >
                  <div className="project-image-wrapper">
                    <motion.img
                      src={project.imageurl}
                      alt={project.title}
                      className="img-fluid"
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
          Designed and coded by Apollo © 2025
        </footer>
      </motion.div>

      {/* --- ESTILOS GLOBAIS --- */}
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
        .project-card:hover {
          box-shadow: 0 20px 50px rgba(147, 51, 234, 0.15);
        }
        .project-image-wrapper {
          overflow: hidden;
          border-radius: 8px;
        }
        .project-card .img-fluid {
          width: 100%;
          object-fit: cover;
          aspect-ratio: 4 / 3; /* Garante que as imagens tenham a mesma proporção */
        }

        /* ... (Estilos do cursor, gradientes e keyframes) ... */
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
