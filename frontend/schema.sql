-- ============================================================
--  RIFA APP — PostgreSQL Schema
-- ============================================================

-- Extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------
-- 1. CONFIGURACIÓN GENERAL DE LA RIFA
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS raffle_config (
  id              SERIAL PRIMARY KEY,
  prize           TEXT          NOT NULL DEFAULT 'Gran Premio',
  ticket_price    NUMERIC(10,2) NOT NULL DEFAULT 10000,
  draw_date       TIMESTAMPTZ   NOT NULL DEFAULT NOW() + INTERVAL '7 days',
  rules           TEXT,
  whatsapp_number VARCHAR(20)   NOT NULL DEFAULT '573001234567',
  organizer_name  VARCHAR(100)  NOT NULL DEFAULT 'Organizador',
  is_active       BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Solo debe existir una fila de configuración activa
CREATE UNIQUE INDEX IF NOT EXISTS idx_raffle_config_active
  ON raffle_config (is_active)
  WHERE is_active = TRUE;

-- ---------------------------------------------------------------
-- 2. NÚMEROS DE LA RIFA (00 – 99)
-- ---------------------------------------------------------------
CREATE TYPE ticket_status AS ENUM ('available', 'pending', 'sold');

CREATE TABLE IF NOT EXISTS tickets (
  id          SERIAL PRIMARY KEY,
  number      SMALLINT      NOT NULL UNIQUE CHECK (number BETWEEN 0 AND 99),
  status      ticket_status NOT NULL DEFAULT 'available',
  buyer_name  VARCHAR(100),
  buyer_phone VARCHAR(20),
  reserved_at TIMESTAMPTZ,          -- cuando pasa a 'pending'
  sold_at     TIMESTAMPTZ,          -- cuando pasa a 'sold'
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Índice para consultas por estado
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets (status);

-- ---------------------------------------------------------------
-- 3. TABLA DE ADMINISTRADORES
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admins (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(50)  NOT NULL UNIQUE,
  password_hash TEXT         NOT NULL,   -- bcrypt hash
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------
-- 4. LOG DE CAMBIOS (auditoría)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ticket_log (
  id         SERIAL PRIMARY KEY,
  ticket_id  INT           NOT NULL REFERENCES tickets(id),
  old_status ticket_status,
  new_status ticket_status NOT NULL,
  changed_by VARCHAR(50),              -- 'client' | 'admin:<username>'
  note       TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------
-- 5. TRIGGER: auto-update updated_at
-- ---------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_tickets_updated
  BEFORE UPDATE ON tickets
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER trg_config_updated
  BEFORE UPDATE ON raffle_config
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------
-- 6. DATOS INICIALES
-- ---------------------------------------------------------------

-- Insertar todos los números del 00 al 99
INSERT INTO tickets (number)
SELECT generate_series(0, 99)
ON CONFLICT (number) DO NOTHING;

-- Configuración inicial de la rifa
INSERT INTO raffle_config (prize, ticket_price, draw_date, rules, whatsapp_number, organizer_name)
VALUES (
  '🏆 Motocicleta Honda CB190R',
  20000,
  NOW() + INTERVAL '30 days',
  '1. Cada número tiene un valor de $20.000 COP.
2. El sorteo se realiza mediante la Lotería de Bogotá.
3. El ganador debe reclamar el premio dentro de 30 días.
4. Se requiere presentar el comprobante de pago.
5. El sorteo es válido si se venden mínimo 60 números.',
  '573001234567',
  'Rifas Los Compadres'
)
ON CONFLICT DO NOTHING;

-- Admin por defecto: usuario=admin, contraseña=admin123
-- (el hash se regenera en la app, este es solo de ejemplo)
INSERT INTO admins (username, password_hash)
VALUES ('admin', '$2b$10$YourBcryptHashHere')
ON CONFLICT (username) DO NOTHING;
