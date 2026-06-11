import React, { useState, useEffect } from 'react';

export default function AdminDashboard({ onLogout }) {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({ available: 0, pending: 0, sold: 0, revenue: 0 });
  const [config, setConfig] = useState({});
  const [activeTab, setActiveTab] = useState('tickets');

  const token = localStorage.getItem('raffle_token');

  const fetchData = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      const [tixRes, statsRes, configRes] = await Promise.all([
        fetch('http://localhost:4000/api/tickets'),
        fetch('http://localhost:4000/api/admin/tickets/stats', { headers }),
        fetch('http://localhost:4000/api/config')
      ]);
      setTickets(await tixRes.json());
      setStats(await statsRes.json());
      setConfig(await configRes.json());
    } catch (error) {
      console.error("Error cargando datos del admin", error);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const changeStatus = async (number, status) => {
    try {
      await fetch(`http://localhost:4000/api/admin/tickets/${number}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      fetchData(); // Recargar después de cambiar
    } catch (err) { 
      alert('Error al cambiar estado'); 
    }
  };

  const handleConfigUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:4000/api/admin/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(config)
      });
      if(res.ok){
         alert('Configuración actualizada correctamente ✅');
         fetchData();
      } else {
         alert('Error al actualizar la configuración');
      }
    } catch (err) { 
      alert('Error de conexión al actualizar la configuración'); 
    }
  };

  const logout = () => {
    localStorage.removeItem('raffle_token');
    onLogout();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', color: '#1f2937' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', background: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <h2 style={{ margin: 0 }}>Panel de Control</h2>
        <button onClick={logout} style={{ padding: '8px 15px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Cerrar Sesión
        </button>
      </header>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setActiveTab('tickets')} style={{ flex: 1, padding: '12px', background: activeTab === 'tickets' ? '#1f2937' : '#e5e7eb', color: activeTab === 'tickets' ? 'white' : 'black', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          Gestión de Números
        </button>
        <button onClick={() => setActiveTab('config')} style={{ flex: 1, padding: '12px', background: activeTab === 'config' ? '#1f2937' : '#e5e7eb', color: activeTab === 'config' ? 'white' : 'black', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          Configuración de la Rifa
        </button>
      </div>

      {activeTab === 'tickets' && (
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-around', background: '#f8fafc', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
            <div style={{ textAlign: 'center' }}><p style={{ margin: 0, color: '#64748b' }}>Disponibles</p><h3 style={{ margin: '5px 0 0 0', color: '#22c55e' }}>{stats.available}</h3></div>
            <div style={{ textAlign: 'center' }}><p style={{ margin: 0, color: '#64748b' }}>Pendientes</p><h3 style={{ margin: '5px 0 0 0', color: '#eab308' }}>{stats.pending}</h3></div>
            <div style={{ textAlign: 'center' }}><p style={{ margin: 0, color: '#64748b' }}>Vendidos</p><h3 style={{ margin: '5px 0 0 0', color: '#6b7280' }}>{stats.sold}</h3></div>
            <div style={{ textAlign: 'center' }}><p style={{ margin: 0, color: '#64748b' }}>Recaudado</p><h3 style={{ margin: '5px 0 0 0', color: '#2563eb' }}>${stats.revenue}</h3></div>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', background: '#f1f5f9' }}>
                  <th style={{ padding: '12px' }}>#</th>
                  <th style={{ padding: '12px' }}>Comprador</th>
                  <th style={{ padding: '12px' }}>Teléfono</th>
                  <th style={{ padding: '12px' }}>Estado</th>
                  <th style={{ padding: '12px' }}>Acciones Manuales</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map(t => (
                  <tr key={t.number} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{t.number.toString().padStart(2, '0')}</td>
                    <td style={{ padding: '12px' }}>{t.buyer_name || '-'}</td>
                    <td style={{ padding: '12px' }}>{t.buyer_phone || '-'}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '0.85rem', background: t.status === 'available' ? '#dcfce7' : t.status === 'pending' ? '#fef08a' : '#f3f4f6' }}>
                        {t.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <button onClick={() => changeStatus(t.number, 'available')} style={{ background: '#22c55e', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', marginRight: '5px', cursor: 'pointer' }}>Libre</button>
                      <button onClick={() => changeStatus(t.number, 'pending')} style={{ background: '#eab308', color: 'black', border: 'none', padding: '5px 10px', borderRadius: '4px', marginRight: '5px', cursor: 'pointer' }}>Pend.</button>
                      <button onClick={() => changeStatus(t.number, 'sold')} style={{ background: '#6b7280', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Vendido</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'config' && (
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <form onSubmit={handleConfigUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <label style={{ fontWeight: 'bold' }}>Nombre del Organizador: 
              <input type="text" value={config.organizer_name || ''} onChange={e => setConfig({...config, organizer_name: e.target.value})} style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc' }}/>
            </label>
            <label style={{ fontWeight: 'bold' }}>Premio Mayor: 
              <input type="text" value={config.prize || ''} onChange={e => setConfig({...config, prize: e.target.value})} style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc' }}/>
            </label>
            <label style={{ fontWeight: 'bold' }}>Precio del Número ($): 
              <input type="number" value={config.ticket_price || 0} onChange={e => setConfig({...config, ticket_price: e.target.value})} style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc' }}/>
            </label>
            <label style={{ fontWeight: 'bold' }}>WhatsApp (Ej: 573001234567): 
              <input type="text" value={config.whatsapp_number || ''} onChange={e => setConfig({...config, whatsapp_number: e.target.value})} style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc' }}/>
            </label>
            <label style={{ fontWeight: 'bold' }}>Fecha del Sorteo: 
              <input type="datetime-local" value={config.draw_date ? new Date(new Date(config.draw_date).getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().slice(0,16) : ''} onChange={e => setConfig({...config, draw_date: new Date(e.target.value).toISOString()})} style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc' }}/>
            </label>
            
            <button type="submit" style={{ padding: '15px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem', marginTop: '10px' }}>
              Guardar Cambios
            </button>
          </form>
        </div>
      )}
    </div>
  );
}