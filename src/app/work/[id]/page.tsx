"use client";

import { motion, Variants } from "framer-motion";
import { useState, useEffect, use } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import Header from "@/app/components/Header";
import CustomCursor from "@/app/components/CustomCursor";
import Link from "next/link";
import Image from "next/image";

// Interface para DADOS VINDOS DO SUPABASE (snake_case)
interface SupabaseData {
  id: number;
  title: string;
  tags: string;
  year: string;
  client_name: string | null;
  description: string | null;
  image_url: string | null; // <-- Coluna do DB
  gallery_images: string[] | null; // <-- Coluna do DB
}

// Interface para DADOS USADOS NO COMPONENTE (camelCase)
interface ProjectDetails {
  id: number;
  title: string;
  tags: string;
  year: string;
  client_name: string | null;
  description: string | null;
  imageUrl: string | null; // <-- Prop do componente
  gallery_images: string[] | null; // <-- Prop do componente
}

interface PageParams {
  id: string;
}
interface ProjectPageProps {
  params: Promise<PageParams>;
}

export default function ProjectDetailPage({
  params: paramsPromise,
}: ProjectPageProps) {
  const params = use(paramsPromise);
  const { id } = params;

  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fadeIn: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  useEffect(() => {
    async function fetchProjectDetails() {
      if (!id) return;

      try {
        // 1. Busca os dados brutos (snake_case)
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("id", id)
          .single(); // <-- .returns<SupabaseData>() FOI REMOVIDO DESTA LINHA

        if (error) throw new Error(`Projeto não encontrado. (ID: ${id})`);
        if (!data) throw new Error("Dados do projeto não encontrados.");

        // 2. Gera a URL pública para a imagem principal (lendo data.image_url)
        let mainImageUrl: string | null = null;
        if (data.image_url) {
          // <-- CORREÇÃO AQUI
          const { data: publicUrlData } = supabase.storage
            .from("project-images")
            .getPublicUrl(data.image_url); // <-- CORREÇÃO AQUI
          mainImageUrl = publicUrlData.publicUrl;
        }

        // 3. Gera as URLs públicas para a galeria de imagens
        let galleryImageUrls: string[] = [];
        if (data.gallery_images && Array.isArray(data.gallery_images)) {
          galleryImageUrls = data.gallery_images.map((imageName: string) => {
            const { data: publicUrlData } = supabase.storage
              .from("project-images")
              .getPublicUrl(imageName);
            return publicUrlData.publicUrl;
          });
        }

        // 4. Salva o projeto formatado em camelCase no estado
        setProject({
          id: data.id,
          title: data.title,
          tags: data.tags,
          year: data.year,
          client_name: data.client_name,
          description: data.description,
          imageUrl: mainImageUrl, // Salva a URL principal
          gallery_images: galleryImageUrls, // Salva as URLs da galeria
        });
      } catch (err) {
        let errorMessage = "Não foi possível carregar o projeto.";
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        console.error("Erro ao buscar detalhes do projeto:", errorMessage, err);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjectDetails();
  }, [id]);

  // --- Renderização dos Estados ---
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

  if (error || !project) {
    return (
      <div className="position-relative d-flex flex-column min-vh-100 text-danger justify-content-center align-items-center bg-dark">
        <Header />
        <h2 className="fs-2 mb-4">Erro</h2>
        <p className="fs-4">{error || "Projeto não encontrado."}</p>
        <Link href="/work" className="btn btn-outline-light" data-hover>
          Voltar para Projetos
        </Link>
      </div>
    );
  }

  // --- Renderização do Projeto ---
  return (
    <>
      <CustomCursor />
      <Header />
      <div className="gradient-bg" />
      <div className="gradient-bg-2" />

      <div className="text-white min-vh-100">
        <div
          className="container-lg"
          style={{ paddingTop: "120px", paddingBottom: "120px" }}
        >
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            <h1 className="main-title-details fw-bolder mb-4">
              {project.title}
            </h1>
          </motion.div>

          {/* --- Imagem Principal --- */}
          {project.imageUrl && ( // Agora lê 'imageUrl' (camelCase) do estado
            <motion.div
              className="project-main-image-wrapper mb-5"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            >
              <Image
                src={project.imageUrl}
                alt={`${project.title} main image`}
                fill
                style={{ objectFit: "cover" }}
                priority
              />
            </motion.div>
          )}

          {/* --- Conteúdo (Descrição e Metadados) --- */}
          <motion.div
            className="row g-5"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            {/* Coluna da Descrição */}
            <div className="col-lg-8">
              <h3 className="fs-2 fw-bold mb-3">Sobre o Projeto</h3>
              <p className="fs-5 fw-light project-description">
                {project.description || "Nenhuma descrição disponível."}
              </p>
            </div>

            {/* Coluna de Metadados */}
            <div className="col-lg-4">
              <div className="metadata-box">
                <h4 className="fs-3 fw-bold mb-3">Detalhes</h4>
                <ul className="list-unstyled fs-5">
                  <li className="mb-3">
                    <strong className="text-white-50 d-block">Cliente:</strong>
                    <span>{project.client_name || "Confidencial"}</span>
                  </li>
                  <li className="mb-3">
                    <strong className="text-white-50 d-block">Serviços:</strong>
                    <span>{project.tags}</span>
                  </li>
                  <li className="mb-3">
                    <strong className="text-white-50 d-block">Ano:</strong>
                    <span>{project.year}</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* --- Galeria de Imagens --- */}
          {/* Agora lê 'gallery_images' (snake_case) do estado */}
          {project.gallery_images && project.gallery_images.length > 0 && (
            <motion.div
              className="mt-5 pt-5"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.6 }}
            >
              <h3 className="fs-2 fw-bold mb-4">Galeria</h3>
              <div className="row g-4">
                {project.gallery_images.map((imgUrl, index) => (
                  <div className="col-md-6" key={index}>
                    <div className="project-gallery-image-wrapper">
                      <Image
                        src={imgUrl}
                        alt={`Gallery image ${index + 1}`}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* --- ESTILOS --- */}
      <style jsx global>{`
        /* ... (Seus estilos globais existentes) ... */
        body {
          cursor: none;
          background-color: #111;
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

        /* --- Estilos Específicos da Página de Detalhes --- */
        .main-title-details {
          font-size: 3rem;
          letter-spacing: -0.05em;
        }
        @media (min-width: 768px) {
          .main-title-details {
            font-size: 5rem;
          }
        }

        .project-main-image-wrapper,
        .project-gallery-image-wrapper {
          position: relative;
          aspect-ratio: 16 / 9;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
          background-color: #222;
        }

        .project-description {
          line-height: 1.7;
          color: #d1d5db;
        }
        .metadata-box {
          background-color: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 2rem;
          border-radius: 12px;
        }
      `}</style>
    </>
  );
}
