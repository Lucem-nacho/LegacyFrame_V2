# Integración con API de Productos - Legacy Frames

## ✅ Cambios Realizados

Se han eliminado los datos locales (hardcodeados) de los componentes `Molduras.tsx` y `Cuadros.tsx`, ahora ambos obtienen los productos directamente del API REST.

## 📋 Componentes Actualizados

### 1. **Molduras.tsx**
- ✅ Eliminados datos locales
- ✅ Carga productos desde `http://localhost:8083/api/catalog/productos`
- ✅ Filtra por categorías: grecas, rusticas, naturales, nativas, finger-joint
- ✅ Muestra indicador de carga
- ✅ Maneja errores de conexión
- ✅ Funciones de edición y eliminación conectadas al API

### 2. **Cuadros.tsx**
- ✅ Eliminados datos locales
- ✅ Carga cuadros desde el API filtrando por categoría "cuadros"
- ✅ Muestra indicador de carga
- ✅ Maneja errores de conexión
- ✅ Funciones de edición y eliminación conectadas al API

### 3. **productosApi.ts**
- ✅ Servicio completo para consumir el API
- ✅ Funciones CRUD (crear, leer, actualizar, eliminar)
- ✅ Gestión de categorías
- ✅ Subida de imágenes

## 🚀 Cómo Usar

### 1. Iniciar el Microservicio de Productos

```bash
cd c:\React\APIS_LF\productos
mvnw.cmd spring-boot:run
```

El API estará disponible en: `http://localhost:8083`

### 2. Verificar que MySQL esté corriendo

Asegúrate de tener MySQL instalado y la base de datos creada:

```sql
CREATE DATABASE legacyframes_productos_db;
```

### 3. Iniciar el Frontend

```bash
cd c:\React\LegacyFrame_V2-main
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

## 📊 Estructura de Datos del API

### Producto
```typescript
{
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagenUrl: string;
  categoria: {
    id: number;
    nombre: string;
    descripcion: string;
  };
}
```

### Categorías Disponibles
- `grecas` - Molduras con diseños clásicos
- `rusticas` - Estilo madera envejecida
- `naturales` - Molduras de madera natural
- `nativas` - Maderas nobles chilenas
- `finger-joint` - Unión dentada resistente
- `cuadros` - Marcos y cuadros decorativos

## 🔧 Funcionalidades

### Carga Automática
Al abrir las páginas de Molduras o Cuadros, los productos se cargan automáticamente del API.

### Indicador de Carga
Mientras se cargan los datos, se muestra un spinner con el mensaje "Cargando productos...".

### Manejo de Errores
Si el API no está disponible, se muestra un mensaje de error claro indicando:
- Que el servidor debe estar corriendo en el puerto 8083
- Instrucciones para solucionar el problema

### Filtrado por Categoría (Molduras)
Los usuarios pueden filtrar molduras por:
- Todas
- Grecas
- Rústicas
- Naturales
- Nativas
- Finger Joint

### Administración (Solo para Admins)
Si el usuario tiene permisos de administrador:
- ✅ **Editar productos**: Modificar nombre, precio, descripción e imagen
- ✅ **Eliminar productos**: Borrar productos del catálogo
- ⚠️ Los cambios se sincronizan con el API

## 🛠️ Agregar Productos al API

### Opción 1: Modificar el DataLoader (Backend)

Edita: `c:\React\APIS_LF\productos\src\main\java\com\ms_productos\productos\loader\DataLoader.java`

Ejemplo de producto:
```java
Producto moldura = new Producto();
moldura.setNombre("I 09 greca zo");
moldura.setDescripcion("Elegante greca decorativa");
moldura.setPrecio(20000.0);
moldura.setStock(50);
moldura.setImagenUrl("/assets/moldura3.jpg");
moldura.setCategoria(grecasSaved);

productoRepository.save(moldura);
```

### Opción 2: Usar Postman o Thunder Client

```http
POST http://localhost:8083/api/catalog/productos
Content-Type: application/json

{
  "nombre": "I 09 greca zo",
  "descripcion": "Elegante greca decorativa",
  "precio": 20000,
  "stock": 50,
  "imagenUrl": "/assets/moldura3.jpg",
  "categoriaId": 1
}
```

### Opción 3: Desde el Frontend (Admin)

```typescript
import productosApi from './api/productosApi';

await productosApi.crearProducto({
  nombre: "I 09 greca zo",
  descripcion: "Elegante greca decorativa",
  precio: 20000,
  stock: 50,
  imagenUrl: "/assets/moldura3.jpg",
  categoriaId: 1
});
```

## ⚠️ Notas Importantes

1. **Imágenes**: Las URLs de imágenes deben apuntar a `/assets/nombreimagen.jpg`
2. **Categorías**: Deben existir en la base de datos antes de crear productos
3. **CORS**: El backend ya está configurado para aceptar peticiones desde `http://localhost:5173`
4. **Puerto**: El API debe correr en el puerto 8083

## 🐛 Solución de Problemas

### "No se pudieron cargar los productos"
1. Verifica que el microservicio esté corriendo: `http://localhost:8083/api/catalog/productos`
2. Revisa que MySQL esté corriendo
3. Verifica las credenciales en `application.properties`

### "Error de CORS"
Asegúrate de que el frontend corra en `http://localhost:5173`

### "No aparecen productos"
1. Verifica que el DataLoader haya cargado datos
2. Revisa la consola del navegador para ver errores
3. Verifica la consola del backend para ver logs

## 📝 Endpoints del API

- `GET /api/catalog/productos` - Listar todos los productos
- `GET /api/catalog/productos/{id}` - Obtener producto por ID
- `POST /api/catalog/productos` - Crear nuevo producto
- `PUT /api/catalog/productos/{id}` - Actualizar producto
- `DELETE /api/catalog/productos/{id}` - Eliminar producto
- `GET /api/catalog/categorias` - Listar categorías
- `POST /api/catalog/categorias` - Crear categoría
- `POST /api/catalog/upload` - Subir imagen

## 🎯 Próximos Pasos

1. Implementar panel de administración completo
2. Agregar funcionalidad de búsqueda de productos
3. Implementar paginación para listados grandes
4. Agregar filtros avanzados
5. Implementar caché para mejorar rendimiento
