# BeatFlow API — Backend

Este repositorio contiene el código fuente del **Backend** de **BeatFlow**, una plataforma multimedia orientada a las tendencias, analítica social y hábitos de escucha musical. La API REST se encarga de gestionar la autenticación, persistencia de datos de usuario, playlists y actuar como puente con servicios de datos externos[cite: 72, 84, 94].

---

## 🚀 Arquitectura y Tecnologías

El backend está diseñado bajo una arquitectura limpia y modular para facilitar la escalabilidad del sistema[cite: 217].

* **Entorno de ejecución:** Node.js (v18+ recomendado)
* **Framework principal:** NestJS o Express (TypeScript)
* **Base de datos:** Relacional (PostgreSQL) o NoSQL (MongoDB)
* **Metodología y Control de Versiones:** Scrum + Git Flow
* **Integración externa:** Last.fm API para la obtención de metadatos musicales, rankings y tendencias globales

---

## 📁 Estructura del Proyecto

La distribución del código sigue una estructura de módulos independiente que se alinea con las necesidades de negocio del sistema:

```text
beatflow-backend/
├── src/
│   ├── core/               # Guardianes, interceptores y configuraciones globales (vía ngx-admin core) 
│   ├── database/           # Conexión, esquemas y modelos de datos 
│   ├── modules/            # Módulos principales del negocio 
│   │   ├── auth/           # Registro, login y gestión de tokens (HU-01, HU-02) 
│   │   ├── analytics/      # Procesamiento de métricas y hábitos de escucha (HU-09) 
│   │   ├── explore/        # Búsquedas, tendencias e integración con Last.fm (HU-03, HU-04, HU-05, HU-08) 
│   │   ├── playlists/      # Gestión de playlists y favoritos (HU-06, HU-07) 
│   │   └── profile/        # Configuración y edición de cuentas de usuario (HU-10) 
│   ├── services/           # Servicios compartidos e integraciones de API 
│   └── main.ts             # Punto de entrada de la aplicación de Node.js
├── test/                   # Pruebas unitarias y de integración 
├── .env.example            # Archivo de ejemplo para variables de entorno
├── README.md
└── package.json