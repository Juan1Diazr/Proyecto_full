// app/tasks/[id]/edit/page.tsx
'use client';

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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

const EditTaskPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = Number(params?.id);

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState(false);
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [cargandoAuth, setCargandoAuth] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // proteger ruta
  useEffect(() => {
    const stored =
      typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    if (!stored) {
      router.replace("/login");
      return;
    }
    setUserId(stored);
    setCargandoAuth(false);
  }, [router]);

  // cargar tarea y categorías
  useEffect(() => {
    if (cargandoAuth || !userId) return;

    const cargar = async () => {
      try {
        const resT = await fetch(
          `http://localhost:4000/api/tareas?usuario_id=${userId}`,
        );
        if (!resT.ok) throw new Error();
        const dataT = await resT.json();
        const tareasArr: Tarea[] = Array.isArray(dataT) ? dataT : [];
        const tarea = tareasArr.find(t => t.id === id);
        if (tarea) {
          setTitulo(tarea.titulo);
          setDescripcion(tarea.descripcion);
          setEstado(!!tarea.estado);
          setCategoriaId(tarea.categoria_id);
        } else {
          setMensaje("Tarea no encontrada");
        }
      } catch {
        setMensaje("Error cargando tarea");
      }

      try {
        const resC = await fetch("http://localhost:4000/api/categorias");
        if (!resC.ok) throw new Error();
        const dataC = await resC.json();
        setCategorias(Array.isArray(dataC) ? dataC : []);
      } catch {
        setMensaje("Error cargando categorías");
      }
    };

    cargar();
  }, [cargandoAuth, userId, id]);

  if (cargandoAuth) return null;

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:4000/api/tareas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo,
          descripcion,
          estado,
          categoria_id: categoriaId,
        }),
      });

      const body = await res.json().catch(() => ({ error: "Error inesperado" }));
      if (!res.ok) {
        setMensaje(body.error || "Error actualizando tarea");
        return;
      }

      router.push("/tasks");
    } catch {
      setMensaje("Error de conexión al actualizar tarea");
    }
  };

  return (
    <div className="card">
      <h1 style={{ marginBottom: "18px" }}>Editar tarea</h1>

      <form
        onSubmit={handleGuardar}
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1.6fr 0.8fr",
          gap: "10px",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <input
          className="form-control"
          type="text"
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
        />
        <input
          className="form-control"
          type="text"
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
        />
        <select
          className="form-control"
          value={categoriaId ?? ""}
          onChange={e =>
            setCategoriaId(e.target.value ? Number(e.target.value) : null)
          }
        >
          {categorias.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>
      </form>

      <div style={{ marginBottom: "12px" }}>
        <label style={{ fontSize: "0.9rem" }}>
          <input
            type="checkbox"
            checked={estado}
            onChange={e => setEstado(e.target.checked)}
            style={{ marginRight: "6px" }}
          />
          Marcar como completada
        </label>
      </div>

      <div style={{ marginTop: "8px" }}>
        <button
          type="button"
          className="btn-outline"
          onClick={() => router.push("/tasks")}
        >
          Cancelar
        </button>{" "}
        <button type="button" className="btn-primary" onClick={handleGuardar as any}>
          Guardar cambios
        </button>
      </div>

      {mensaje && (
        <p style={{ marginTop: "14px", color: "#b91c1c", fontWeight: 500 }}>
          {mensaje}
        </p>
      )}
    </div>
  );
};

export default EditTaskPage;
