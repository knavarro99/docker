# Taller I - Infraestructura con Docker Compose

Proyecto de ejemplo con 3 servicios en la misma red de Docker: **frontend**, **backend** y **base de datos**, mas un **proxy** de balanceo para el frontend (necesario porque el frontend corre con 3 replicas y solo puede haber un punto de entrada fijo en `localhost:9091`).

## Estructura del proyecto

```
taller1/
├── docker-compose.yaml
├── database/
│   └── init.sql            # crea la BD, la tabla usuario y el usuario Admin
├── backend/
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/java/com/taller/backend/
│       ├── BackendApplication.java
│       ├── controller/UsuarioController.java
│       ├── service/UsuarioService.java        (interfaz)
│       ├── service/impl/UsuarioServiceImpl.java
│       ├── repository/UsuarioRepository.java
│       ├── model/Usuario.java
│       └── dto/ (LoginRequest, LoginResponse)
├── frontend/                 # React + Vite
│   ├── Dockerfile             (build multi-etapa: node -> nginx)
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx            # formulario de login y llamada al backend
│       └── index.css
└── proxy/
    └── nginx.conf           # balanceador para las 3 replicas del frontend
```

## Como levantar el proyecto

```bash
cd taller1
docker compose up --build
```

Luego ingresa a **http://localhost:9091** y veras el formulario de login.

- Usuario existente: `Admin` / clave `Pass_987` → mensaje de bienvenida
- Usuario inexistente: cualquier otro usuario → mensaje "no existe"

## Orden de creacion de los contenedores

`depends_on` garantiza el orden pedido en el taller:

1. `database` se crea primero (con `healthcheck` que espera a que MySQL responda).
2. `backend` espera a que `database` este saludable (`condition: service_healthy`).
3. `frontend` (3 replicas) espera a que `backend` exista.
4. `proxy` espera a que `frontend` exista y publica el puerto `9091`.

## Cambiar los puertos

- **Frontend**: cambia el `"9091:80"` del servicio `proxy` en `docker-compose.yaml`.
- **Backend**: cambia el `"9092:9092"` del servicio `backend` **y** el valor de `BACKEND_URL` en `frontend/src/App.jsx` para que el login siga apuntando al puerto correcto, luego reconstruye la imagen (`docker compose build frontend`), ya que en React esa constante se "hornea" dentro del bundle en tiempo de build.

## Publicar las imagenes en Docker Hub

```bash
docker login

docker build -t <tu_usuario_dockerhub>/taller1-backend:1.0 ./backend
docker build -t <tu_usuario_dockerhub>/taller1-frontend:1.0 ./frontend

docker push <tu_usuario_dockerhub>/taller1-backend:1.0
docker push <tu_usuario_dockerhub>/taller1-frontend:1.0
```

Luego puedes reemplazar `build: ./backend` y `build: ./frontend` en el `docker-compose.yaml` por `image: <tu_usuario_dockerhub>/taller1-backend:1.0` y `image: <tu_usuario_dockerhub>/taller1-frontend:1.0` para que el profesor solo necesite el archivo `.yaml`.

## Notas de diseno

- El backend sigue una arquitectura desacoplada: `UsuarioService` es una interfaz inyectada (vía constructor) en `UsuarioController`, e implementada por `UsuarioServiceImpl`, que a su vez usa `UsuarioRepository` (Spring Data JPA).
- El frontend es una app React (Vite) compilada a estáticos: el `Dockerfile` usa build multi-etapa (`node:20-alpine` compila, `nginx:alpine` sirve el resultado). El componente `App.jsx` maneja el formulario y la llamada `fetch` al backend.
- El healthcheck del frontend cumple el requisito "cada 5 minutos por 3 segundos" (`interval: 5m`, `timeout: 3s`).
- La clave del usuario se guarda en texto plano para simplificar el ejercicio; en un entorno real se recomienda usar hashing (BCrypt).

## Desarrollo local del frontend (sin Docker)

```bash
cd frontend
npm install
npm run dev
```

Esto levanta un servidor de desarrollo de Vite con recarga en caliente. Para probar el login necesitas el backend corriendo por separado (`http://localhost:9092`).
