import React, { useState } from 'react';
import { reserveTicket } from '../services/api';

export default function PurchaseModal({ ticketNumber, config, onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    if (!name || !phone) return alert("Por favor llena tu nombre y teléfono.");
    
    setLoading(true);
    try {
      await reserveTicket(ticketNumber, name, phone);
      
      const numeroFormateado = ticketNumber.toString().padStart(2, '0');
      const mensaje = `Hola! Quiero pagar el número ${numeroFormateado} para la rifa del ${config.prize}. Mi nombre es ${name}.`;
      const waUrl = `https://wa.me/${config.whatsapp_number}?text=${encodeURIComponent(mensaje)}`;
      
      window.open(waUrl, '_blank');
      onSuccess();
    } catch (error) {
      alert("Hubo un error. Es posible que alguien más haya reservado el número justo ahora.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 style={{margin: '0 0 10px 0'}}>Estás comprando el: {ticketNumber.toString().padStart(2, '0')}</h2>
        <p style={{fontSize: '1.2rem', fontWeight: 'bold'}}>Total a pagar: ${config.ticket_price}</p>
        
        <input 
          type="text" placeholder="Tu Nombre Completo" 
          value={name} onChange={e => setName(e.target.value)}
          style={{width: '90%', padding: '12px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc'}}
        />
        <input 
          type="text" placeholder="Tu Teléfono" 
          value={phone} onChange={e => setPhone(e.target.value)}
          style={{width: '90%', padding: '12px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc'}}
        />

        <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
          <button onClick={onClose} disabled={loading} style={{flex: 1, padding: '12px', borderRadius: '5px', border: '1px solid #ccc', cursor: 'pointer'}}>
            Cancelar
          </button>
          <button onClick={handlePurchase} disabled={loading} style={{flex: 2, padding: '12px', background: '#25D366', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem'}}>
            {loading ? 'Procesando...' : 'Pagar y abrir WhatsApp'}
          </button>
        </div>
      </div>
    </div>
  );
}