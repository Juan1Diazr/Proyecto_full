// app/tasks/tasks-inner.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Tarea = {
  id: number;
  titulo: string;
  descripcion: string;
  estado?: boolean;
  usuario_id: number;
  categoria_id: number | null;
};

type Categoria = {
  id: number;
  nombre: string;
  descripcion?: string;
  color?: string;
};

export const TasksInner: React.FC = () => {
  const router = useRouter();

  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoriaId, setCategoriaId] = useState<string>("");
  const [filtroCategoria, setFiltroCategoria] = useState<string>("todas");
  const [mensaje, setMensaje] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [cargandoAuth, setCargandoAuth] = useState(true);

  // comprobar login
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("userId");
    if (!stored) {
      router.replace("/login");
      return;
    }
    setUserId(stored);
    setCargandoAuth(false);
  }, [router]);

  // cargar tareas y categorias
  useEffect(() => {
    if (!userId) return;

    const cargar = async () => {
      try {
        const resT = await fetch(
          `http://localhost:4000/api/tareas?usuario_id=${userId}`
        );
        if (!resT.ok) throw new Error();
        const dataT = await resT.json();
        setTareas(Array.isArray(dataT) ? dataT : []);
      } catch {
        setMensaje("Error cargando tareas");
      }

      try {
        const resC = await fetch("http://localhost:4000/api/categorias");
        if (!resC.ok) throw new Error();
        const dataC = await resC.json();
        const arr = Array.isArray(dataC) ? (dataC as Categoria[]) : [];
        setCategorias(arr);
        if (arr.length > 0 && !categoriaId) {
          setCategoriaId(arr[0].id.toString());
        }
      } catch {
        setMensaje("Error cargando categorías");
      }
    };

    cargar();
  }, [userId, categoriaId]);

  if (cargandoAuth || !userId) return null;

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !descripcion || !categoriaId || !userId) {
      setMensaje("Completa todos los campos");
      return;
    }

    const payload = {
      titulo,
      descripcion,
      usuario_id: Number(userId),
      categoria_id: Number(categoriaId),
    };

    try {
      const res = await fetch("http://localhost:4000/api/tareas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = await res.json().catch(() => ({ error: "Error inesperado" }));

      if (!res.ok) {
        setMensaje(body.error || "Error guardando tarea");
        return;
      }

      setTareas((prev) => [...prev, body as Tarea]);
      setMensaje("Tarea creada");
      setTitulo("");
      setDescripcion("");
    } catch {
      setMensaje("Error al comunicar con el servidor");
    }
  };

  const handleEliminar = async (id: number) => {
    if (!confirm("¿Eliminar esta tarea?")) return;
    try {
      const res = await fetch(`http://localhost:4000/api/tareas/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        setMensaje("Error al eliminar tarea");
        return;
      }
      setTareas((prev) => prev.filter((t) => t.id !== id));
    } catch {
      setMensaje("Error de conexión al eliminar");
    }
  };

  const getCategoria = (id: number | null) =>
    categorias.find((c) => c.id === id);

  const tareasFiltradas = tareas.filter((t) =>
    filtroCategoria === "todas" ? true : t.categoria_id === Number(filtroCategoria)
  );

  return (
    <div className="card">
      <h1 style={{ marginBottom: "18px" }}>Mis tareas</h1>

      {/* Filtro */}
      <div style={{ marginBottom: "18px", display: "flex", gap: "10px" }}>
        <select
          className="form-control"
          style={{ maxWidth: "200px" }}
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
        >
          <option value="todas">Todas las categorías</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Crear tarea */}
      <form
        onSubmit={handleCrear}
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1.6fr 0.8fr 0.6fr",
          gap: "10px",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <input
          className="form-control"
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <input
          className="form-control"
          type="text"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <select
          className="form-control"
          value={categoriaId}
          onChange={(e) => setCategoriaId(e.target.value)}
        >
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>
        <button type="submit" className="btn-primary">
          Agregar
        </button>
      </form>

      {mensaje && (
        <p style={{ marginBottom: "14px", color: "#b91c1c", fontWeight: 500 }}>
          {mensaje}
        </p>
      )}

      {/* Tarjetas bonitas */}
      {tareasFiltradas.length === 0 ? (
        <p>No hay tareas para mostrar.</p>
      ) : (
        <div className="tasks-grid">
          {tareasFiltradas.map((t) => {
            const cat = getCategoria(t.categoria_id ?? null);
            return (
              <div key={t.id} className="task-card">
                <div className="task-title">{t.titulo}</div>

                <div className="task-info">{t.descripcion}</div>

                {cat && (
                  <div className="task-info">
                    <div style={{ marginTop: "8px" }}>
                        <span
                        className="task-category-badge"
                        style={{
                        background: cat?.color || "#6b7280",
                        }}
                    >
                        {cat?.nombre}
                    </span>
                    </div>

                  </div>
                )}

                <span
                  className={`task-status ${
                    t.estado ? "completed" : "pending"
                  }`}
                >
                  {t.estado ? "Completada" : "Pendiente"}
                </span>

                <div className="task-footer">
                  <button
                    className="task-btn edit"
                    onClick={() => router.push(`/tasks/${t.id}/edit`)}
                  >
                    Editar
                  </button>

                  <button
                    className="task-btn delete"
                    onClick={() => handleEliminar(t.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
