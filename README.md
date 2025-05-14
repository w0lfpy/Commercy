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

## Configuración

### Variables de entorno para la API

Crea un archivo `.env` en la carpeta `CommercyAPI/` con el siguiente contenido:

```
DB_URI="LINK A TU BASE DE DATOS MONGODB"
JWT_SECRET=un_secreto_seguro
SLACK_WEBHOOK="LINK PARA MENSAJES DE SLACK"
PORT=3000
```

- Cambia los valores según tu entorno.
- Si no usas Slack, puedes dejar `SLACK_WEBHOOK` vacío.

### Carpeta de uploads

Asegúrate de que exista la carpeta `CommercyAPI/uploads/` para el guardado de imágenes. Se crea automáticamente, pero puedes crearla manualmente si tienes problemas de permisos.

## Ejecución

### Backend (API)

```sh
cd CommercyAPI
npm start
```

La API estará disponible en [http://localhost:3000](http://localhost:3000).

### Frontend (Next.js)

```sh
cd CommercyFront
npm run dev
```

El frontend estará disponible en [http://localhost:3000](http://localhost:3000) o [http://localhost:3001](http://localhost:3001) según el puerto configurado.

> **Nota:** Si ambos usan el mismo puerto, cambia el puerto de uno de ellos en el `.env` o configuración de Next.js.

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

[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

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