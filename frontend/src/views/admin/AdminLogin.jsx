import React, { useState } from 'react';
import { loginAdmin } from '../../services/api';

export default function AdminLogin({ onLogin, onBack }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginAdmin(username, password);
      if (data.token) {
        localStorage.setItem('raffle_token', data.token);
        onLogin();
      } else {
        setError(data.error || 'Credenciales incorrectas');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '30px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'center' }}>
      <h2 style={{ marginBottom: '20px', color: '#1f2937' }}>Acceso Administrativo</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="text" placeholder="Usuario" 
          value={username} onChange={e => setUsername(e.target.value)} 
          required style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <input 
          type="password" placeholder="Contraseña" 
          value={password} onChange={e => setPassword(e.target.value)} 
          required style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          Ingresar
        </button>
      </form>

      {error && <p style={{ color: 'red', marginTop: '15px' }}>{error}</p>}
      
      <button onClick={onBack} style={{ marginTop: '20px', padding: '10px', background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer', textDecoration: 'underline' }}>
        Volver a la Rifa
      </button>
    </div>
  );
}