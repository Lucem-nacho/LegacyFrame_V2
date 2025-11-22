# Modo Administrador - Legacy Frames

## Credenciales de Acceso

### Usuario Administrador
- **Email:** `admin@legacyframes.cl`
- **Contraseña:** `Admin123#`

### Usuario Normal
- **Email:** `a@a.cl`
- **Contraseña:** `Pass123#`

## Funcionalidades del Modo Administrador

Al iniciar sesión como administrador, tendrás acceso a las siguientes funcionalidades:

### 1. Identificación Visual
- El Navbar mostrará tu email con una insignia amarilla **"ADMIN"** con icono de corona
- Botón de "Salir" disponible en el Navbar

### 2. Gestión de Molduras (`/molduras`)
Cada moldura muestra dos botones adicionales (solo visibles para admin):

- **Editar (botón amarillo):** Abre un modal para modificar:
  - Nombre del producto
  - Precio (CLP)
  - Descripción
  - URL de imagen
  
- **Eliminar (botón rojo):** Elimina el producto con confirmación previa

### 3. Gestión de Cuadros (`/cuadros`)
Cada cuadro muestra dos botones adicionales (solo visibles para admin):

- **Editar (botón amarillo):** Abre un modal para modificar:
  - Nombre del producto
  - Precio (CLP)
  - Descripción
  - URL de imagen
  
- **Eliminar (botón rojo):** Elimina el producto con confirmación previa

## Persistencia de Datos

- La sesión de autenticación se guarda en `localStorage` (clave: `legacyframe_auth_v1`)
- Los cambios en productos (ediciones/eliminaciones) **NO** se persisten al recargar la página
- Para persistencia real de productos, se requeriría implementar un backend con base de datos

## Estructura Técnica

### AuthContext (`src/context/AuthContext.tsx`)
Gestiona:
- Estado de usuario actual (email, isAdmin)
- Función `login(email, password)` - valida credenciales y establece rol
- Función `logout()` - cierra sesión
- Persistencia en localStorage

### Componentes Modificados

1. **Login.tsx**
   - Integrado con AuthContext
   - Detecta automáticamente si el usuario es admin por las credenciales

2. **Molduras.tsx**
   - Productos convertidos a `useState` para permitir edición
   - Funciones `openEditModal()`, `saveEdit()`, `deleteProduct()`
   - Modal de edición condicional (solo se renderiza si `user.isAdmin`)

3. **Cuadros.tsx**
   - Productos convertidos a `useState` para permitir edición
   - Funciones `openEditModal()`, `saveEdit()`, `deleteProduct()`
   - Modal de edición condicional (solo se renderiza si `user.isAdmin`)

4. **Navbar.tsx**
   - Muestra información del usuario autenticado
   - Badge de "ADMIN" si `user.isAdmin === true`
   - Botón de logout

## Próximos Pasos Recomendados

Para una aplicación de producción, considera:

1. **Backend API**
   - Endpoint para autenticación con JWT
   - CRUD endpoints para productos (molduras y cuadros)
   - Base de datos (PostgreSQL, MongoDB, etc.)

2. **Seguridad**
   - Hash de contraseñas (bcrypt)
   - Tokens de autenticación (JWT)
   - Validación de roles en el backend

3. **Funcionalidades Adicionales**
   - Panel de administración dedicado (`/admin`)
   - Crear nuevos productos (además de editar/eliminar)
   - Gestión de categorías
   - Subida de imágenes al servidor
   - Historial de cambios
   - Múltiples roles (admin, editor, viewer)

4. **UX Mejorado**
   - Notificaciones toast al editar/eliminar
   - Validación de formularios en modal de edición
   - Preview de imagen al cambiar URL
   - Confirmación visual de cambios guardados
