require('dotenv').config();
const bcrypt = require('bcrypt');
const pool   = require('./pool');

async function seed() {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const hash     = await bcrypt.hash(password, 10);

  await pool.query(
    `INSERT INTO admins (username, password_hash)
     VALUES ($1, $2)
     ON CONFLICT (username) DO UPDATE SET password_hash = $2`,
    [username, hash]
  );

  console.log('✅ Admin creado: usuario=' + username);
  await pool.end();
}

seed().catch((err) => { console.error(err); process.exit(1); });