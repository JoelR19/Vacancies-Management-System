````markdown
````

#  Vacancies Management System

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-FE0808?style=for-the-badge&logo=typeorm&logoColor=white)
![Swagger](https://img.shields.io/badge/-Swagger-%23C1E81C?style=for-the-badge&logo=swagger&logoColor=black)

## 📝 Descripción
API REST profesional desarrollada con **NestJS** para la gestión del ciclo de vida de vacantes laborales y postulaciones. El sistema permite administrar usuarios con roles específicos, controlar el flujo de aplicaciones de candidatos y garantizar la integridad de los datos mediante reglas de negocio automatizadas.

---

## ⚙️ Instalación y Configuración

### 1. Requisitos previos
* **Node.js** (v18 o superior)
* **PostgreSQL**
* **NPM** o **Yarn**

### 2. Clonado e Instalación
```bash
# Clonar el repositorio
git clone <https://github.com/JoelR19/Vacancies-Management-System.git>

# Entrar al directorio
cd p-a-jr

# Instalar dependencias
npm install
````

### 3. Variables de Entorno (`.env.example`)

Crea un archivo llamado `.env` en la raíz del proyecto y completa los siguientes campos:

```env
PORT=3000
STATE=dev

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_password
DB_NAME=_vacancies

JWT_SECRET=clave_secreta_para_tokens_123
JWT_EXPIRES_IN=24h
````



### 4. Ejecución

```bash
# Modo desarrollo
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

---

## 🚦 API Endpoints y Ejemplos de Respuesta

### 🔐 Autenticación (`/api/auth`)

| Método | Endpoint    | Descripción                       | Rol     |
| ------ | ----------- | --------------------------------- | ------- |
| POST   | `/register` | Registro de usuario               | Público |
| POST   | `/login`    | Inicio de sesión (Retorna Cookie) | Público |

**Ejemplo de respuesta (Login):**

```json
{
  "statusCode": 200,
  "message": "Login exitoso",
  "data": {
    "user": {
      "email": "coder@joel.com",
      "role": "CODER"
    }
  }
}
```

### 💼 Vacantes (`/api/vacancies`)

| Método | Endpoint      | Descripción                | Rol           |
| ------ | ------------- | -------------------------- | ------------- |
| GET    | `/`           | Listar vacantes (Paginado) | Todos         |
| POST   | `/`           | Crear vacante              | ADMIN, GESTOR |
| PATCH  | `/:id/status` | Inactivación lógica        | ADMIN, GESTOR |

**Ejemplo de respuesta (Get All):**

```json
{
  "statusCode": 200,
  "message": "Operación realizada con éxito",
  "data": [
    {
      "id": "uuid",
      "title": "Fullstack Dev",
      "maxApplicants": 10,
      "status": "ACTIVE"
    }
  ]
}
```

### 📝 Postulaciones (`/api/applications`)

| Método | Endpoint           | Descripción                         | Rol    |
| ------ | ------------------ | ----------------------------------- | ------ |
| POST   | `/`                | Aplicar a vacante                   | CODER  |
| GET    | `/my-applications` | Ver mis postulaciones               | CODER  |
| PATCH  | `/:id/status`      | Cambiar estado (Aceptado/Rechazado) | GESTOR |

---

## 🧠 Reglas de Negocio Implementadas

1. **Validación de Cupos:** No se permiten más candidatos que el `maxApplicants` definido en la vacante.
2. **Restricción de Duplicados:** Un usuario no puede postularse más de una vez a la misma vacante.
3. **Límite de Aplicaciones:** Un **CODER** puede tener un máximo de **3 postulaciones activas** simultáneamente.
4. **Seguridad RBAC:** Uso de Guards personalizados para proteger rutas según el rol del usuario.

---

## 🧪 Calidad y Testing 

El proyecto cuenta con pruebas unitarias enfocadas en los servicios principales.

* **Ejecutar tests:** `npm run test`
* **Ver cobertura:** `npm run test:cov`

**Estado actual de cobertura:**

* **Statement Coverage:** 46.61%
* **Principales archivos:** `vacancies.service.ts` (72%), `applications.service.ts` (79%).

---

## 📚 Documentación Swagger (Task 9)

La documentación interactiva detallando cada DTO y esquema se encuentra en:
👉 [http://localhost:3000/api/docs](https://www.google.com/search?q=http://localhost:3000/api/docs)

---

## 🛠️ Estructura del Proyecto

```text
src/
 ├── auth/          # Autenticación JWT y Estrategias
 ├── vacancies/     # Módulo de Vacantes (Core)
 ├── applications/  # Módulo de Postulaciones (Reglas de negocio)
 ├── users/         # Gestión de usuarios y perfiles
 ├── common/        # Interceptores, filtros y decoradores globales
 └── main.ts        # Punto de entrada de la aplicación
```

---

## 👤 Autoría

* **Desarrollador:** JoelR

```
````


