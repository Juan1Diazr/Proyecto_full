import { ReactNode } from "react";
import "./globals.css";
import LogoutButton from "./LogoutButton";

export const metadata = {
  title: "TaskHub",
  description: "Gestor de Tareas",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        {/* Barra superior */}
        <header className="topbar">
          <div className="topbar-inner">
            <span>contacto@taskhub.com</span>
            <span>+57 300 000 0000</span>
          </div>
        </header>

        {/* NAVBAR */}
        <nav className="navbar">
          <div className="navbar-inner">
            <div className="navbar-logo">
              Task<span>Hub</span>
            </div>

            <div className="navbar-links">
              <a href="/">Inicio</a>
              <a href="/tasks">Tareas</a>
              <a href="/categorias">Categorías</a>
            </div>

            <LogoutButton />
          </div>
        </nav>

        {/* Contenido */}
        <main className="main-container">{children}</main>
      </body>
    </html>
  );
}
