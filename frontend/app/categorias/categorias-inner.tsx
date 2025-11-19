// app/categorias/categorias-inner.tsx
'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Categoria = {
  id: number;
  nombre: string;
  descripcion?: string;
  color: string;
};

export const CategoriasInner: React.FC = () => {
  const router = useRouter();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [color, setColor] = useState("#fff9c4");
  const [mensaje, setMensaje] = useState("");
  const [cargandoAuth, setCargandoAuth] = useState(true);

  // proteger ruta por login
  useEffect(() => {
    const userId =
      typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    if (!userId) {
      router.replace("/login");
      return;
    }
    setCargandoAuth(false);
  }, [router]);

  const cargarCategorias = () => {
    fetch("http://localhost:4000/api/categorias")
      .then(res => res.json())
      .then(data => setCategorias(Array.isArray(data) ? data : []))
      .catch(() => setMensaje("Error cargando categorías"));
  };

  useEffect(() => {
    if (!cargandoAuth) {
      cargarCategorias();
    }
  }, [cargandoAuth]);

  if (cargandoAuth) return null;

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !color) {
      setMensaje("Nombre y color son obligatorios");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, descripcion, color }),
      });

      const body = await res.json().catch(() => ({ error: "Error inesperado" }));
      if (!res.ok) {
        setMensaje(body.error || "Error creando categoría");
        return;
      }

      setNombre("");
      setDescripcion("");
      setColor("#fff9c4");
      setMensaje("Categoría creada");
      cargarCategorias();
    } catch {
      setMensaje("Error de conexión al crear categoría");
    }
  };

  const handleEliminar = async (id: number) => {
    if (!confirm("¿Eliminar esta categoría? (las tareas quedarán sin categoría)")) return;
    try {
      const res = await fetch(`http://localhost:4000/api/categorias/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        setMensaje("Error al eliminar categoría (revisa backend)");
        return;
      }
      cargarCategorias();
    } catch {
      setMensaje("Error de conexión al eliminar categoría");
    }
  };

  return (
    <div className="card">
      <h1 style={{ marginBottom: "18px" }}>Categorías</h1>

      <form
        onSubmit={handleCrear}
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 1.4fr 0.7fr 0.7fr",
          gap: "10px",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <input
          className="form-control"
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
        />
        <input
          className="form-control"
          type="text"
          placeholder="Descripción"
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
        />
        <input
          className="form-control"
          type="color"
          value={color}
          onChange={e => setColor(e.target.value)}
        />
        <button type="submit" className="btn-primary">
          Crear
        </button>
      </form>

      {mensaje && (
        <p style={{ marginBottom: "14px", color: "#b91c1c", fontWeight: 500 }}>
          {mensaje}
        </p>
      )}

      {categorias.length === 0 ? (
        <p>No hay categorías.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>
              <th style={{ padding: "8px" }}>Nombre</th>
              <th style={{ padding: "8px" }}>Descripción</th>
              <th style={{ padding: "8px" }}>Color</th>
              <th style={{ padding: "8px" }}></th>
            </tr>
          </thead>
          <tbody>
            {categorias.map(cat => (
              <tr key={cat.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "8px" }}>{cat.nombre}</td>
                <td style={{ padding: "8px" }}>{cat.descripcion}</td>
                <td style={{ padding: "8px" }}>
                  <span
                    className="badge"
                    style={{
                      background: cat.color,
                      color: "#111827",
                    }}
                  >
                    {cat.color}
                  </span>
                </td>
                <td style={{ padding: "8px" }}>
                 
                 
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
