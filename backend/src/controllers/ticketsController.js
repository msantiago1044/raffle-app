const pool = require('../db/pool');

async function getAllTickets(req, res) {
  try {
    const { rows } = await pool.query('SELECT * FROM tickets ORDER BY number ASC');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: 'Error interno' }); }
}

async function reserveTicket(req, res) {
  const number = parseInt(req.params.number, 10);
  const { buyer_name, buyer_phone } = req.body;
  if (isNaN(number) || number < 0 || number > 99)
    return res.status(400).json({ error: 'Número inválido' });
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query('SELECT * FROM tickets WHERE number=$1 FOR UPDATE', [number]);
    if (rows[0].status !== 'available') {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'Número no disponible', status: rows[0].status });
    }
    const updated = await client.query(
      `UPDATE tickets SET status='pending', buyer_name=$1, buyer_phone=$2, reserved_at=NOW() WHERE number=$3 RETURNING *`,
      [buyer_name||null, buyer_phone||null, number]
    );
    await client.query('COMMIT');
    res.json({ message: 'Reservado', ticket: updated.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'Error interno' });
  } finally { client.release(); }
}

async function updateTicketStatus(req, res) {
  const number = parseInt(req.params.number, 10);
  const { status } = req.body;

  if (!['available','pending','sold'].includes(status))
    return res.status(400).json({ error: 'Estado inválido' });

  try {
    let query = '';
    // Lógica 100% a prueba de fallos
    if (status === 'available') {
      query = `UPDATE tickets SET status='available', buyer_name=NULL, buyer_phone=NULL, reserved_at=NULL, sold_at=NULL WHERE number=$1 RETURNING *`;
    } else if (status === 'pending') {
      query = `UPDATE tickets SET status='pending', sold_at=NULL WHERE number=$1 RETURNING *`;
    } else if (status === 'sold') {
      query = `UPDATE tickets SET status='sold', sold_at=NOW() WHERE number=$1 RETURNING *`;
    }
    const { rows } = await pool.query(query, [number]);
    res.json({ ticket: rows[0] });
  } catch (err) {
    console.error("🔥 AHORA SÍ, ESTE ES EL ERROR:", err);
    res.status(500).json({ error: 'Error interno' });
  }
}

async function getStats(req, res) {
  try {
    const { rows } = await pool.query(`
      SELECT COUNT(*) FILTER (WHERE status='available') AS available,
             COUNT(*) FILTER (WHERE status='pending')   AS pending,
             COUNT(*) FILTER (WHERE status='sold')      AS sold
      FROM tickets`);
    const cfg = await pool.query('SELECT ticket_price FROM raffle_config WHERE is_active=TRUE LIMIT 1');
    const price = cfg.rows[0]?.ticket_price || 0;
    rows[0].revenue = (parseInt(rows[0].sold) * parseFloat(price)).toFixed(0);
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: 'Error interno' }); }
}

module.exports = { getAllTickets, reserveTicket, updateTicketStatus, getStats };