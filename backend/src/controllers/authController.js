const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const pool   = require('../db/pool');
async function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
  try {
    const { rows } = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
    if (rows.length === 0) return res.status(401).json({ error: 'Credenciales inválidas' });
    const match = await bcrypt.compare(password, rows[0].password_hash);
    if (!match) return res.status(401).json({ error: 'Credenciales inválidas' });
    const token = jwt.sign({ id: rows[0].id, username: rows[0].username }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, username: rows[0].username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno' });
  }
}
module.exports = { login };