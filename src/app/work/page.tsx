"use client";

import { motion, Variants } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "../components/Header";
import CustomCursor from "../components/CustomCursor";
import { supabase } from "../lib/supabaseClient"; // Importe seu cliente Supabase

interface Project {
  id: number;
  created_at: string;
  title: string;
  tags: string;
  year: string;
  imageUrl: string | null; // Permitir que imageUrl seja null
}

// --- Componente da Página ---
export default function WorkPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const gridVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
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

  useEffect(() => {
    async function fetchProjects() {
      try {
        // 1. Busca os dados brutos (com apenas o nome do arquivo)
        const { data: rawProjects, error } = await supabase
          .from("projects")
          .select("*")
          .order("year", { ascending: false });

        if (error) throw error;
        if (!rawProjects) return;

        // 2. Transforma os dados para criar as URLs públicas
        const projectsWithUrls = rawProjects.map((project) => {
          // --- CORREÇÃO AQUI ---
          // Verifica se project.imageUrl existe antes de chamar o Supabase Storage
          if (!project.imageUrl) {
            console.warn(
              `Projeto "${project.title}" (ID: ${project.id}) está sem 'imageUrl' no banco de dados.`
            );
            return {
              ...project,
              imageUrl: null, // Define null em vez de string vazia
            };
          }
          // --- FIM DA CORREÇÃO ---

          // Usamos o método getPublicUrl do Supabase
          const { data: publicUrlData } = supabase.storage
            .from("project-images") // O nome do seu bucket
            .getPublicUrl(project.imageUrl); // O nome do arquivo (ex: "meu-projeto.jpg")

          return {
            ...project,
            imageUrl: publicUrlData.publicUrl, // Substitui "meu-projeto.jpg" pela URL completa
          };
        });

        console.log("Projetos com URLs geradas:", projectsWithUrls);
        setProjects(projectsWithUrls); // Salva os projetos com as URLs corretas

        // --- CORREÇÃO DO CATCH BLOCK ---
      } catch (err) {
        let errorMessage = "Não foi possível carregar os projetos.";
        // Verifica se 'err' é uma instância de Error para acessar 'message' com segurança
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        console.error("Erro ao buscar projetos:", errorMessage, err);
        setError(errorMessage);
        // --- FIM DA CORREÇÃO ---
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjects();
  }, []);

  // --- Lógica de Renderização (Spinner, Erro, etc.) ---
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

  if (error) {
    return (
      <div className="position-relative d-flex min-vh-100 text-danger justify-content-center align-items-center bg-dark">
        <Header />
        <p className="fs-3">{error}</p>
      </div>
    );
  }

  // --- Renderização dos Projetos ---
  return (
    <>
      <CustomCursor />
      <Header />
      <div className="gradient-bg" />
      <div className="gradient-bg-2" />

      <motion.div
        className="text-white min-vh-100"
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
                    {/* --- CORREÇÃO DE RENDERIZAÇÃO AQUI --- */}
                    {/* Só renderiza a imagem se a URL existir (não for null) */}
                    {project.imageUrl ? (
                      <motion.img
                        src={project.imageUrl}
                        alt={project.title}
                        className="img-fluid"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        onError={(e) =>
                          console.error(
                            `Falha ao carregar imagem: ${project.imageUrl}`,
                            e
                          )
                        }
                      />
                    ) : (
                      // Renderiza um placeholder elegante se não houver imagem
                      <div className="placeholder-img d-flex align-items-center justify-content-center text-white-50">
                        <span>Sem Imagem</span>
                      </div>
                    )}
                    {/* --- FIM DA CORREÇÃO --- */}
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
          aspect-ratio: 4 / 3;
        }

        /* --- ESTILO PARA O PLACEHOLDER DA IMAGEM --- */
        .placeholder-img {
          width: 100%;
          aspect-ratio: 4 / 3;
          background-color: #222; /* Um cinza escuro */
          font-style: italic;
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
