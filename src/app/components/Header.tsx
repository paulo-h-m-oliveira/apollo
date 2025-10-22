"use client";

import Link from "next/link";
import { motion } from "framer-motion"; // 1. Importar a motion

export default function Header() {
  return (
    // 2. Mudar de <nav> para <motion.nav> e adicionar animação
    <motion.nav
      className="navbar navbar-dark position-fixed top-0 w-100"
      style={{ zIndex: 9990, mixBlendMode: "difference" }}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
    >
      <div className="container-fluid container-lg py-3">
        {/* Logo/Nome */}
        <Link
          href="/"
          className="navbar-brand fs-4 fw-bold text-white text-decoration-none"
          data-hover
        >
          Apollo
        </Link>

        {/* Links de Navegação */}
        <div className="d-flex">
          <Link href="/" className="nav-link text-white me-4" data-hover>
            Home
          </Link>
          <Link href="/work" className="nav-link text-white" data-hover>
            Work
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
