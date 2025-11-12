"use client";

import { motion, Variants } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "../components/Header";
import CustomCursor from "../components/CustomCursor";
import { supabase } from "../lib/supabaseClient";

// Interface para os DADOS VINDOS DO SUPABASE
interface SupabaseProject {
  id: number;
  created_at: string;
  title: string;
  tags: string;
  year: string;
  image_url: string | null;
}

// Interface para os DADOS USADOS PELO COMPONENTE
interface Project {
  id: number;
  created_at: string;
  title: string;
  tags: string;
  year: string;
  imageUrl: string | null;
}

export default function WorkPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data: rawProjects, error } = await supabase
          .from("projects")
          .select("*")
          .order("year", { ascending: false })
          .returns<SupabaseProject[]>();

        if (error) throw error;
        if (!rawProjects) return;

        const projectsWithUrls: Project[] = rawProjects.map((dbProject) => {
          const fileName = dbProject.image_url;
          let publicUrl: string | null = null;

          if (!fileName) {
            console.warn(
              `Projeto "${dbProject.title}" (ID: ${dbProject.id}) está sem 'image_url' no DB.`
            );
          } else {
            const { data: publicUrlData } = supabase.storage
              .from("project-images")
              .getPublicUrl(fileName);
            publicUrl = publicUrlData.publicUrl;
          }

          return {
            id: dbProject.id,
            created_at: dbProject.created_at,
            title: dbProject.title,
            tags: dbProject.tags,
            year: dbProject.year,
            imageUrl: publicUrl,
          };
        });

        setProjects(projectsWithUrls);
      } catch (err) {
        let errorMessage = "Não foi possível carregar os projetos.";
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        console.error("Erro ao buscar projetos:", errorMessage, err);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjects();
  }, []);

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
                  href={`/work/${project.id}`}
                  className="project-card text-decoration-none"
                  data-hover
                >
                  <div className="project-image-wrapper">
                    {" "}
                    {/* O contêiner da imagem */}
                    {project.imageUrl ? (
                      <motion.img
                        src={project.imageUrl}
                        alt={project.title}
                        className="img-fluid" // A imagem em si
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                      />
                    ) : (
                      // O placeholder
                      <div className="placeholder-img d-flex align-items-center justify-content-center text-white-50">
                        <span>Sem Imagem</span>
                      </div>
                    )}
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
      {/* PRESTE ATENÇÃO NAS MUDANÇAS ABAIXO */}
      <style jsx global>{`
        /* ... (estilos de body, fs-small, project-card, etc.) ... */
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

        /* --- MUDANÇA AQUI --- */
        /* Este é o contêiner que "força" a proporção */
        .project-image-wrapper {
          overflow: hidden;
          border-radius: 8px;
          background-color: #222; /* Fundo escuro para o caso da imagem demorar a carregar */

          /* A MÁGICA ESTÁ AQUI: */
          aspect-ratio: 4 / 3; /* Força uma proporção de 4:3 (largura:altura) */
          /* Você pode mudar para 16 / 9 para um visual mais "widescreen" */
          /* Ou para 1 / 1 para um visual "quadrado" */
        }

        /* --- MUDANÇA AQUI --- */
        /* Isso faz a imagem preencher o contêiner */
        .project-card .img-fluid {
          width: 100%;
          height: 100%; /* Força a imagem a preencher a altura do wrapper */
          object-fit: cover; /* ESSENCIAL: Preenche o espaço sem distorcer. Corta o excesso. */
        }

        /* --- MUDANÇA AQUI --- */
        /* Isso garante que o placeholder também obedeça ao novo contêiner */
        .placeholder-img {
          width: 100%;
          height: 100%; /* Faz o placeholder preencher a altura do wrapper */
          font-style: italic;
          border-radius: 8px;
          /* As classes 'd-flex' do Bootstrap já cuidam do alinhamento */
        }

        /* ... (O restante dos seus estilos: custom-cursor, gradient-bg, keyframes, etc.) ... */
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
