# 🎯 Rifa App — Sistema de Gestión de Rifas Locales

Aplicación web full-stack para la venta y gestión de una rifa de 100 números.

## Stack

| Capa       | Tecnología           |
|------------|----------------------|
| Frontend   | React 18 + Vite      |
| Backend    | Node.js + Express    |
| Base Datos | PostgreSQL           |
| Estilos    | CSS Modules          |
| Auth       | JWT + bcrypt         |

---

## 📁 Estructura del proyecto

```
raffle-app/
├── database/
│   └── schema.sql          ← Tablas + datos iniciales
├── backend/
│   ├── .env.example
│   └── src/
│       ├── server.js
│       ├── db/
│       │   ├── pool.js
│       │   └── seed.js     ← Crea el admin
│       ├── middleware/
│       │   └── auth.js
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── configController.js
│       │   └── ticketsController.js
│       └── routes/
│           └── index.js
└── frontend/
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── services/api.js
        ├── hooks/useCountdown.js
        ├── components/
        │   ├── Countdown.jsx
        │   ├── NumberGrid.jsx
        │   └── PurchaseModal.jsx
        └── views/
            ├── CustomerView.jsx
            └── admin/
                ├── AdminLogin.jsx
                └── AdminDashboard.jsx
```

---

## 🚀 Instalación paso a paso

### 1. Base de datos

```bash
# Crear la base de datos
createdb raffle_db

# Ejecutar el schema (crea tablas + inserta 100 números + config inicial)
psql raffle_db < database/schema.sql
```

### 2. Backend

```bash
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# → Edita .env con tus credenciales de PostgreSQL y un JWT_SECRET seguro

# Crear usuario admin con hash bcrypt
npm run seed

# Iniciar en modo desarrollo
npm run dev
# → Servidor en http://localhost:4000
```

### 3. Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev
# → App en http://localhost:5173
```

---

## 🔌 API Endpoints

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| `POST` | `/api/auth/login` | Público | Login admin → devuelve JWT |
| `GET` | `/api/config` | Público | Configuración + fecha sorteo |
| `GET` | `/api/tickets` | Público | Los 100 números con estado |
| `POST` | `/api/tickets/:n/reserve` | Público | Reserva número (→ pending) |
| `PUT` | `/api/admin/config` | 🔒 JWT | Actualiza configuración |
| `PATCH` | `/api/admin/tickets/:n/status` | 🔒 JWT | Cambia estado manualmente |
| `GET` | `/api/admin/tickets/stats` | 🔒 JWT | Stats del panel admin |

---

## 🎨 Flujos principales

### Cliente (comprador)
1. Ve el header con premio, precio y cronómetro en vivo.
2. Selecciona un número verde (disponible) en la grilla.
3. Completa su nombre en el modal.
4. Pulsa **"Ya pagué, enviar comprobante"**.
5. Se abre WhatsApp con mensaje pre-llenado; el número pasa a **Pendiente** (amarillo).

### Admin (organizador)
1. Accede via botón `⚙` → Login con usuario/contraseña.
2. **Tab Números**: ve todos los números, puede filtrar y cambiar manualmente
   - ✅ → Disponible (reversión de compra)
   - ⏳ → Pendiente
   - 💰 → Vendido (pago confirmado por WhatsApp)
3. **Tab Configuración**: edita premio, precio, fecha del sorteo, reglas, WhatsApp del organizador.

### Cronómetro
- El hook `useCountdown(drawDate)` actualiza cada segundo usando `setTimeout`.
- Cuando `isExpired = true`, la grilla se bloquea automáticamente.

---

## ⚙️ Variables de entorno (.env)

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=raffle_db
DB_USER=postgres
DB_PASSWORD=tu_password

JWT_SECRET=cadena_aleatoria_larga_y_segura

PORT=4000
CORS_ORIGIN=http://localhost:5173

ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

---

## 🛡️ Notas de seguridad para producción

- Cambia `JWT_SECRET` por una cadena aleatoria de 64+ caracteres.
- Cambia la contraseña del admin tras el primer login.
- Usa HTTPS en producción (Nginx + certbot).
- Considera `CORS_ORIGIN` con el dominio real del frontend.
- Agrega rate limiting al endpoint de login (`express-rate-limit`).

---

## 📱 Diseño Mobile First

- Grilla adaptativa 10×10 con celdas responsive.
- Modal de compra aparece como bottom-sheet en móvil.
- Cronómetro visible y claro en pantallas pequeñas.
- Botón de WhatsApp destacado con color oficial.
