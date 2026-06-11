import React, { useState, useEffect } from 'react';
import { getRaffleConfig, getTickets } from '../services/api';
import Countdown from '../components/Countdown';
import NumberGrid from '../components/NumberGrid';
import PurchaseModal from '../components/PurchaseModal';

export default function CustomerView({ onAdminClick }) {
  const [config, setConfig] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [selectedNumber, setSelectedNumber] = useState(null);

  const loadData = async () => {
    try {
      setConfig(await getRaffleConfig());
      setTickets(await getTickets());
    } catch (error) { console.error("Error", error); }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, []);

  if (!config) return <div style={{textAlign: 'center', padding: '50px'}}>Cargando...</div>;

  const stats = {
    available: tickets.filter(t => t.status === 'available').length,
    pending: tickets.filter(t => t.status === 'pending').length,
    sold: tickets.filter(t => t.status === 'sold').length,
  };

  const formattedDate = new Date(config.draw_date).toLocaleDateString('es-ES', { 
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
  });

  return (
    <div className="container">
      {/* HEADER */}
      <header style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
        <div style={{background: 'rgba(255,255,255,0.05)', padding: '5px 15px', borderRadius: '20px', border: '1px solid #334155', fontSize: '0.85rem', fontWeight: 'bold', color: '#fbbf24'}}>
          🎯 RIFA OFICIAL
        </div>
        <button onClick={onAdminClick} style={{background: 'transparent', color: '#64748b', border: 'none', cursor: 'pointer', fontWeight: 'bold'}}>
          ⚙️ Admin
        </button>
      </header>

      <h1 style={{fontSize: '2.5rem', marginBottom: '20px', fontFamily: 'Impact, sans-serif', letterSpacing: '1px'}}>
        {config.organizer_name}
      </h1>

      {/* TARJETA DE PREMIO */}
      <div className="prize-card">
        <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
          <span style={{fontSize: '2.5rem'}}>🏆</span>
          <div>
            <p style={{margin: 0, fontSize: '0.8rem', color: '#94a3b8', fontWeight: 'bold'}}>PREMIO</p>
            <h2 style={{margin: 0, fontSize: '1.2rem'}}>{config.prize}</h2>
          </div>
        </div>
        <div style={{textAlign: 'right'}}>
          <p style={{margin: 0, fontSize: '0.8rem', color: '#94a3b8', fontWeight: 'bold'}}>C/NÚMERO</p>
          <h2 style={{margin: 0, fontSize: '1.8rem', color: '#fbbf24'}}>${config.ticket_price}</h2>
        </div>
      </div>

      {/* CRONÓMETRO Y FECHA */}
      <Countdown targetDate={config.draw_date} />
      <p style={{textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem', fontStyle: 'italic', marginBottom: '30px'}}>
        📅 Sorteo: {formattedDate}
      </p>

      {/* ESTADÍSTICAS */}
      <div className="stats-row">
        <span><span style={{color: '#22c55e'}}>●</span> <b>{stats.available}</b> disponibles</span>
        <span><span style={{color: '#eab308'}}>●</span> <b>{stats.pending}</b> pendientes</span>
        <span><span style={{color: '#6b7280'}}>●</span> <b>{stats.sold}</b> vendidos</span>
      </div>

      <div style={{display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '0.8rem', fontWeight: 'bold', color: '#94a3b8', marginBottom: '10px'}}>
        <span><span style={{color: '#22c55e'}}>●</span> DISPONIBLE</span>
        <span><span style={{color: '#eab308'}}>●</span> PENDIENTE</span>
        <span><span style={{color: '#6b7280'}}>●</span> VENDIDO</span>
      </div>

      <NumberGrid tickets={tickets} onSelect={(num) => setSelectedNumber(num)} />

      {selectedNumber !== null && (
        <PurchaseModal 
          ticketNumber={selectedNumber} config={config}
          onClose={() => setSelectedNumber(null)} onSuccess={() => { setSelectedNumber(null); loadData(); }}
        />
      )}
    </div>
  );
}