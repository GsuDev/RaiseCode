# HU-25 · Panel Admin — Dashboard de Estadísticas

> 🖼️ **Prototipo UI:** _pendiente_

| Campo | Valor |
|---|---|
| Versión | 1.0 |
| Fecha | 2026-03-22 |
| Sprint | Sprint 6 |
| Prioridad | Media |
| Estimación | 5 puntos |

---

## 1. Descripción

**Como** administrador, **quiero** ver estadísticas globales de la plataforma en la página de inicio del panel, **para** conocer el estado y uso de la aplicación de un vistazo.

---

## 2. Dependencias y paralelización

- **Requiere:** HU-22 — estructura del panel admin
- **Se enriquece con:** HU-20 — XP y logros aportan más métricas
- **Puede paralelizarse con:** HU-23, HU-24, HU-26, HU-29, HU-30

---

## 3. 🗃️ Backend (NestJS)

### Módulo nuevo: `api/src/admin/`

```
admin.module.ts
admin.controller.ts
admin.service.ts
```

### 🔗 Endpoint

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/api/admin/stats` | `JwtAuthGuard` + `@Roles('ADMIN')` | Estadísticas globales |

**Respuesta:**
```json
{
  "totalUsers": 120,
  "totalChallenges": 45,
  "pendingChallenges": 3,
  "totalCompletions": 312,
  "topChallenge": { "id": 5, "title": "Invertir un array", "completedCount": 38 },
  "topUser": { "username": "maria", "xp": 430 },
  "activityLast7Days": [
    { "date": "2026-03-16", "completions": 12 },
    { "date": "2026-03-17", "completions": 8 }
  ]
}
```

---

## 4. 🎨 Frontend (React)

### 📁 Estructura de ficheros

```
src/admin/pages/dashboard/
├── AdminDashboardPage.tsx
├── hooks/
│   └── useAdminStats.ts
├── services/
│   └── adminStats.service.ts
└── components/
    ├── AdminStatCard.tsx        ← tarjeta de métrica (icono, valor, etiqueta)
    ├── ActivityChart.tsx        ← gráfico de barras, completions últimos 7 días
    └── TopChallengesTable.tsx   ← top 5 retos más completados
```

### Layout del dashboard

```
[ Usuarios ] [ Retos ] [ Pendientes ] [ Completions ]   ← 4 AdminStatCards en grid
[        Gráfico de actividad (7 días)                ]
[        Top 5 retos más completados                  ]
```

Usar `recharts` para el gráfico (verificar si ya está instalado — lo usa `ProfileLanguageChart`).

---

## 5. Criterios de aceptación ✅

- [ ] El dashboard muestra las 4 métricas principales con datos reales.
- [ ] El gráfico refleja las completions de los últimos 7 días.
- [ ] La tabla muestra el top 5 de retos más completados.
- [ ] Con 0 datos, el dashboard muestra valores en 0 sin errores ni pantallas en blanco.
- [ ] Solo accesible para usuarios con rol ADMIN.
- [ ] Los datos se cargan automáticamente al entrar al panel.
