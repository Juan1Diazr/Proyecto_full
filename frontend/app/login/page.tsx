// login/page.tsx

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMensaje(data.error || 'Error al iniciar sesión');
        return;
      }

      localStorage.setItem('userId', data.userId);
      router.push('/tasks');
    } catch {
      setMensaje('Error de conexión');
    }
  };

  return (
    <div
  style={{
    maxWidth: "420px",
    margin: "80px auto",
    background: "white",
    padding: "38px",
    borderRadius: "18px",
    boxShadow: "0 10px 35px rgba(0,96,160,0.12)",
  }}
> 
    <div class="avatar-container">
      <div class="avatar-circle">
        <img src="/user-icon.png" alt="" />
      </div>
    </div>


      <h1 style={{
        textAlign: "center",
        fontSize: "1.6rem",
        fontWeight: "bold",
        color: "#212651"
      }}>Login</h1>
      <form onSubmit={handleSubmit} style={{marginTop:'17px'}}>
        <input type="email"
            placeholder="Email"
            style={inputStyle}
            value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password"
            placeholder="Contraseña"
            style={inputStyle}
            value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit" className="btn-primary"
  style={{ width: "100%", marginTop: "14px" }}
        >Entrar</button>
      </form>
      {mensaje && <p style={{
        marginTop: "12px",
        color: "#d93131",
        background: "#fff0f0",
        borderRadius: "5px",
        textAlign: "center",
        fontWeight: "bold"
      }}>{mensaje}</p>}
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "12px",
  border: "1px solid #d3d3ff",
  borderRadius: "6px",
  fontSize: "1rem"
};

export default LoginPage;
