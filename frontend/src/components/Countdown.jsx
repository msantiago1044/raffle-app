import React from 'react';
import { useCountdown } from '../hooks/useCountdown';

export default function Countdown({ targetDate }) {
  const { days, hours, minutes, seconds, isFinished } = useCountdown(targetDate);

  if (isFinished) return <h3 style={{color: '#dc2626', textAlign:'center'}}>¡El sorteo ha finalizado!</h3>;

  return (
    <div style={{textAlign: 'center'}}>
      <p style={{color: '#94a3b8', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '15px'}}>
        ⏳ TIEMPO PARA EL SORTEO
      </p>
      <div className="timer-container">
        <div className="timer-box">
          <div className="timer-number">{days.toString().padStart(2, '0')}</div>
          <div className="timer-label">Días</div>
        </div>
        <span style={{color: '#fbbf24', fontSize: '2rem', fontWeight: 'bold', alignSelf: 'center'}}>:</span>
        <div className="timer-box">
          <div className="timer-number">{hours.toString().padStart(2, '0')}</div>
          <div className="timer-label">Horas</div>
        </div>
        <span style={{color: '#fbbf24', fontSize: '2rem', fontWeight: 'bold', alignSelf: 'center'}}>:</span>
        <div className="timer-box">
          <div className="timer-number">{minutes.toString().padStart(2, '0')}</div>
          <div className="timer-label">Min</div>
        </div>
        <span style={{color: '#fbbf24', fontSize: '2rem', fontWeight: 'bold', alignSelf: 'center'}}>:</span>
        <div className="timer-box">
          <div className="timer-number">{seconds.toString().padStart(2, '0')}</div>
          <div className="timer-label">Seg</div>
        </div>
      </div>
    </div>
  );
}