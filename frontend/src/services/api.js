const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const getRaffleConfig = async () => {
  const res = await fetch(`${API_URL}/config`);
  return res.json();
};

export const getTickets = async () => {
  const res = await fetch(`${API_URL}/tickets`);
  return res.json();
};

export const reserveTicket = async (number, buyerName, buyerPhone) => {
  const res = await fetch(`${API_URL}/tickets/${number}/reserve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ buyer_name: buyerName, buyer_phone: buyerPhone })
  });
  return res.json();
};

export const loginAdmin = async (username, password) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return res.json();
};