'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMensaje(data.error || 'Error en el registro');
        return;
      }

      setMensaje('Registro exitoso, puedes iniciar sesión');
      setEmail('');
      setPassword('');
      router.push('/login');  // Redirige al login tras registro exitoso
    } catch (error) {
      setMensaje('Error de conexión con el backend');
      console.error(error);
    }
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '60px auto',
      background: '#f4faff',
      padding: '34px',
      borderRadius: '11px',
      boxShadow: '0 1px 7px rgba(44,77,128,0.09)',
      textAlign: 'center'
    }}>
      <h1 style={{ color: '#212651', fontSize: '1.6rem', fontWeight: 'bold' }}>Registro</h1>
      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '10px',
            marginTop: '12px',
            border: '1px solid #d3d3ff',
            borderRadius: '6px',
            fontSize: '1rem'
          }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '10px',
            marginTop: '12px',
            border: '1px solid #d3d3ff',
            borderRadius: '6px',
            fontSize: '1rem'
          }}
        />
        <button
          type="submit"
          style={{
            marginTop: '20px',
            backgroundColor: '#2979ff',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '12px 0',
            width: '100%',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Registrar
        </button>
      </form>
      {mensaje && (
        <p style={{
          marginTop: '15px',
          color: mensaje.includes('exitoso') ? 'green' : 'red',
          fontWeight: 'bold'
        }}>
          {mensaje}
        </p>
      )}
    </div>
  );
}
