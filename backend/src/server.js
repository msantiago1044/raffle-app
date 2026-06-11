// src/server.js
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const routes  = require('./routes');

const app  = express();
const PORT = process.env.PORT || 4000;

// ── Middlewares ─────────────────────────────────────
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// ── Rutas ───────────────────────────────────────────
app.use('/api', routes);

// ── Health check ────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// ── 404 handler ─────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

// ── Error handler ────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// ── Start ───────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🎯 Servidor corriendo en http://localhost:${PORT}`);
});
