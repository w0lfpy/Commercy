# COMMERCY

Plataforma de gestión de comercios y webs para pequeños negocios, compuesta por una API RESTful (Node.js + Express + MongoDB) y un frontend en Next.js.

## Tabla de Contenidos

- [Características](#características)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [API Docs](#api-docs)
- [Testing](#testing)
- [Licencia](#licencia)

---

## Características

- Registro y login de usuarios con roles (`user`, `admin`)
- Gestión de comercios (crear, actualizar, eliminar, listar)
- Gestión de webs asociadas a comercios
- Subida de imágenes y textos a webs
- Sistema de reseñas y puntuaciones
- Filtros por ciudad, intereses y scoring
- Notificaciones de logs a Slack (opcional)
- Documentación Swagger

## Requisitos

- Node.js >= 16.x
- MongoDB >= 4.x
- npm >= 8.x

## Instalación

1. **Clona el repositorio:**

```sh
git clone https://github.com/tuusuario/tu-repo.git
cd tu-repo
```

2. **Instala dependencias en ambos proyectos:**

```sh
cd CommercyAPI
npm install
cd ../CommercyFront
npm install --legacy-peer-deps
```

## Configuracion

### Variables de entorno (backend y frontend)

#### Backend (CommercyAPI/.env)

Crea un archivo `.env` en la carpeta `CommercyAPI/` con el siguiente contenido:

```
DB_URI=mongodb+srv://usuario:password@host/tu_db
JWT_SECRET=un_secreto_seguro
PORT=8000
```

- `DB_URI` es obligatorio para la conexion con MongoDB.
- `JWT_SECRET` es obligatorio para firmar tokens.
- `PORT` es el puerto del backend (por defecto 3000 si no se define).
- `SLACK_WEBHOOK` es opcional; el envio a Slack esta comentado en `CommercyAPI/app.js`.

#### Frontend (CommercyFront/.env.local)

Crea un archivo `.env.local` en la carpeta `CommercyFront/` con el siguiente contenido:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

- `NEXT_PUBLIC_API_URL` deberia apuntar al backend.
- Actualmente hay URLs hardcodeadas a `http://localhost:3000` en el frontend; si cambias el puerto del backend, ajusta esas rutas o agrega rewrites.


### Carpeta de uploads

Asegúrate de que exista la carpeta `CommercyAPI/uploads/` para el guardado de imágenes. Se crea automáticamente, pero puedes crearla manualmente si tienes problemas de permisos.

## Ejecución

### Backend (API)

```sh
cd CommercyAPI
npm start
```

La API estara disponible en [http://localhost:8000](http://localhost:8000) si usas el puerto recomendado.

### Frontend (Next.js)

```sh
cd CommercyFront
npm run dev
```

El frontend estará disponible en [http://localhost:3000](http://localhost:3000) o [http://localhost:3001](http://localhost:3001) según el puerto configurado.

> **Nota:** Si ambos usan el mismo puerto, cambia el puerto de uno de ellos en el `.env` o configuración de Next.js.

## Distribucion de la BBDD (MongoDB)

La aplicacion usa MongoDB con las siguientes colecciones y campos minimos:

### users

- `name` (String)
- `age` (Number)
- `email` (String, unique)
- `password` (String)
- `ciudad` (String)
- `intereses` ([String], default [])
- `ofertas` (Boolean)
- `role` ("user" | "admin", default "user")
- `createdAt`, `updatedAt` (timestamps)

### comercios

- `nombre` (String)
- `cif` (String, unique)
- `direccion` (String)
- `email` (String, unique)
- `telefono` (String)
- `id` (Number)
- `createdAt`, `updatedAt` (timestamps)

### webs

- `ciudad` (String)
- `actividad` (String)
- `titulo` (String)
- `resumen` (String)
- `textos` ([String])
- `imagenes` ([String])
- `cifComercio` (String, referencia al `cif` de comercios)
- `resenas` (Array de objetos: `scoring` Number 0-5, `puntuacion` Number, `texto` String)

Nota: Los modelos `users` y `webs` usan soft delete (mongoose-delete) y agregan campos internos como `deleted` y `deletedAt`.


## Estructura del Proyecto

```
CommercyAPI/
  app.js
  config/
  controllers/
  docs/
  middleware/
  models/
  routes/
  test/
  uploads/
  utils/
  validators/
CommercyFront/
  app/
  components/
  context/
  public/
  styles/
  ...
README.md
```

## API Docs

La documentación interactiva de la API está disponible en:

[http://localhost:8000/api-docs](http://localhost:8000/api-docs)

## Testing

Para ejecutar los tests de la API:

```sh
cd CommercyAPI
npm test
```

## Licencia

Los derechos de uso personal y comercial quedan reservados al dueño del proyecto actual. No se permite la distribución, modificación o uso comercial sin el consentimiento explícito del autor.

---

Desarrollado por Jose Suárez Ares.