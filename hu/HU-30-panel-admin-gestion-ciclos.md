# HU-30 · Panel Admin — Gestión de Ciclos Formativos

> 🖼️ **Prototipo UI:** _pendiente_

| Campo | Valor |
|---|---|
| Versión | 1.0 |
| Fecha | 2026-05-06 |
| Sprint | Sprint 7 |
| Prioridad | Baja |
| Estimación | 3 puntos |

---

## 1. Descripción

**Como** administrador, **quiero** crear, editar y eliminar ciclos formativos (DAW, DAM, ASIR…) desde el panel de administración, **para** adaptar la estructura del catálogo sin tocar directamente la base de datos.

---

## 2. Dependencias y paralelización

- **Requiere:** HU-22 — estructura del panel admin
- **Requiere:** HU-26 — gestión de asignaturas (las asignaturas pertenecen a ciclos)
- **Puede paralelizarse con:** HU-25, HU-29

---

## 3. 🗃️ Backend (NestJS)

Ampliar el módulo existente `api/src/courses/`:

### 🔗 Endpoints nuevos

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `POST` | `/api/courses` | `JwtAuthGuard` + `@Roles('ADMIN')` | Crear ciclo formativo |
| `PATCH` | `/api/courses/:id` | `JwtAuthGuard` + `@Roles('ADMIN')` | Editar ciclo formativo |
| `DELETE` | `/api/courses/:id` | `JwtAuthGuard` + `@Roles('ADMIN')` | Eliminar ciclo formativo |

**Lógica de `DELETE`:** comprobar si el ciclo tiene asignaturas asociadas. Si las tiene, devolver error `400`: `"No se puede eliminar un ciclo con asignaturas asociadas"`.

**Body de `POST` y `PATCH`:**
```json
{ "name": "FP Básica" }
```

---

## 4. 🎨 Frontend (React)

### 📁 Estructura de ficheros

```
src/admin/pages/courses/
├── AdminCoursesPage.tsx
├── hooks/
│   └── useAdminCourses.ts
├── services/
│   └── adminCourses.service.ts
└── components/
    ├── CoursesTable.tsx        ← tabla: nombre, nº asignaturas + acciones editar/eliminar
    └── CourseFormModal.tsx     ← modal compartido para creación y edición
```

### Navegación

Añadir entrada **"Ciclos"** en `AdminSidebar.tsx` apuntando a `/admin/courses`.

Añadir la ruta en `app.router.tsx`:
```tsx
{ path: 'courses', element: <AdminCoursesPage /> }
```

### Comportamiento

- La tabla muestra todos los ciclos con el número de asignaturas asociadas.
- Botón "Nuevo ciclo" abre `CourseFormModal` en modo creación.
- Botón "Editar" de cada fila abre el modal en modo edición.
- Botón "Eliminar" muestra `AlertDialog` de confirmación; si el ciclo tiene asignaturas, mostrar el error del backend en un toast.
- Tras cualquier acción exitosa, refrescar la tabla.

---

## 5. Criterios de aceptación ✅

- [ ] Se puede crear un nuevo ciclo formativo y aparece en la tabla.
- [ ] Se puede editar el nombre de un ciclo existente.
- [ ] Los cambios se reflejan en la vista pública de asignaturas por ciclo.
- [ ] No se puede eliminar un ciclo con asignaturas asociadas; se muestra error claro.
- [ ] La entrada "Ciclos" aparece en el sidebar del panel admin.
- [ ] Solo accesible para usuarios con rol ADMIN.
