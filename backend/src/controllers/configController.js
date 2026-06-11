const pool = require('../db/pool');
async function getConfig(req, res) {
  try {
    const { rows } = await pool.query('SELECT * FROM raffle_config WHERE is_active = TRUE LIMIT 1');
    if (rows.length === 0) return res.status(404).json({ error: 'No hay configuración' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: 'Error interno' }); }
}
async function updateConfig(req, res) {
  const { prize, ticket_price, draw_date, rules, whatsapp_number, organizer_name } = req.body;
  if (!draw_date) return res.status(400).json({ error: 'La fecha del sorteo es requerida' });
  try {
    const { rows } = await pool.query(
      `UPDATE raffle_config SET prize=COALESCE($1,prize), ticket_price=COALESCE($2,ticket_price),
       draw_date=$3, rules=COALESCE($4,rules), whatsapp_number=COALESCE($5,whatsapp_number),
       organizer_name=COALESCE($6,organizer_name) WHERE is_active=TRUE RETURNING *`,
      [prize, ticket_price, draw_date, rules, whatsapp_number, organizer_name]
    );
    res.json({ message: 'Actualizado', config: rows[0] });
  } catch (err) { res.status(500).json({ error: 'Error interno' }); }
}
module.exports = { getConfig, updateConfig };