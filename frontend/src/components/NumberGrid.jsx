import React from 'react';
export default function NumberGrid({ tickets, onSelect }) {
    return (
      <div className="grid">
        {tickets.map((ticket) => (
          <button
            key={ticket.number}
            className={`number-btn ${ticket.status}`}
            disabled={ticket.status !== 'available'}
            onClick={() => onSelect(ticket.number)}
            title={`Estado: ${ticket.status}`}
          >
            {ticket.number.toString().padStart(2, '0')}
          </button>
        ))}
      </div>
    );
  }