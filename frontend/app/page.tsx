// app/page.tsx
'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [cargando, setCargando] = useState(true);
  const [logueado, setLogueado] = useState(false);

  useEffect(() => {
    const userId =
      typeof window !== "undefined" ? localStorage.getItem("userId") : null;

    if (!userId) {
      router.replace("/login"); // redirige y NO muestra contenido
      return;
    }

    setLogueado(true);
    setCargando(false);
  }, [router]);

  if (cargando || !logueado) {
    // mientras decide, no muestra nada de la home
    return null;
  }

  // hero solo cuando hay userId
  return (
    <section className="card" style={{ overflow: "hidden" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: "24px",
          alignItems: "center",
        }}
      >
        <div>
          <p style={{ letterSpacing: "0.12em", color: "#9ca3af", fontSize: "0.8rem" }}>
            ORGANIZA TU DÍA
          </p>
          <h1
            style={{
              fontSize: "2.4rem",
              lineHeight: 1.2,
              margin: "10px 0 16px",
            }}
          >
            Gestiona tus tareas <br /> de forma sencilla
          </h1>
          <p style={{ color: "#6b7280", marginBottom: "22px" }}>
            Crea, organiza y filtra tus tareas por categorías.
          </p>
          <button
            className="btn-primary"
            onClick={() => router.push("/tasks")}
          >
            Ir a mis tareas
          </button>
        </div>
        <div
          style={{
            borderRadius: "18px",
            overflow: "hidden",
            minHeight: "220px",
            backgroundImage:
              "url('https://images.pexels.com/photos/17129271/pexels-photo-17129271.jpeg?auto=compress&cs=tinysrgb&w=800')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </div>
    </section>
  );
}
