# Documentación de Endpoints - BeatFlow API

La URL base de la API en producción es: **`https://beatflow-api.onrender.com`**  
La URL en desarrollo local es: **`http://localhost:3000`**

---

## 1. Autenticación (`/api/auth`)

### ➔ Registrar Usuario
* **Ruta:** `POST /api/auth/register`
* **Cuerpo de la Petición (JSON):**
  ```json
  {
    "email": "usuario@correo.com",
    "password": "mi_password_segura", // Mínimo 8 caracteres
    "name": "Nombre de Usuario",       // Opcional
    "photo": "https://url-foto.com"    // Opcional
  }
  ```
* **Respuestas:**
  * **`201 Created`:** Registro exitoso.
    ```json
    {
      "message": "Usuario registrado con éxito",
      "user": {
        "id": "6017070e-2985-...",
        "email": "usuario@correo.com",
        "name": "Nombre de Usuario",
        "photo": "https://url-foto.com",
        "createdAt": "2026-06-04T06:49:42.691Z",
        "updatedAt": "2026-06-04T06:49:42.691Z"
      }
    }
    ```
  * **`400 Bad Request`:** Fallas en la validación (ej. contraseña muy corta).
  * **`409 Conflict`:** El correo ya está registrado en la base de datos.

### ➔ Iniciar Sesión (Login)
* **Ruta:** `POST /api/auth/login`
* **Cuerpo de la Petición (JSON):**
  ```json
  {
    "email": "usuario@correo.com",
    "password": "mi_password_segura"
  }
  ```
* **Respuestas:**
  * **`200 OK`:** Inicio de sesión exitoso. Retorna un JWT válido por 24 horas.
    ```json
    {
      "message": "Sesión iniciada con éxito",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "6017070e-2985-...",
        "email": "usuario@correo.com",
        "name": "Nombre de Usuario",
        "photo": "https://url-foto.com",
        "createdAt": "2026-06-04T06:49:42.691Z",
        "updatedAt": "2026-06-04T06:49:42.691Z"
      }
    }
    ```
  * **`400 Bad Request`:** Falta el correo o la contraseña.
  * **`401 Unauthorized`:** Correo inexistente o contraseña incorrecta.

---

## 2. Exploración Musical (`/api/explore`)

### ➔ Canciones en Tendencia (Top Tracks)
* **Ruta:** `GET /api/explore/trends`
* **Parámetros de consulta (Query Params):**
  * `limit` (Opcional, número entero positivo, por defecto `50`).
  * `page` (Opcional, número entero positivo, por defecto `1`).
* **Respuesta (`200 OK`):** Arreglo ordenado con las canciones más escuchadas de Last.fm.
  ```json
  [
    {
      "rank": 1,
      "name": "the cure",
      "artist": "Olivia Rodrigo",
      "imageUrl": "https://lastfm.freetls.fastly.net/i/u/300x300/...",
      "listeners": 442876,
      "playcount": 4403694,
      "mbid": "1de149c9-..."
    }
  ]
  ```

### ➔ Artistas Populares (Top Artists)
* **Ruta:** `GET /api/explore/artists/trends`
* **Parámetros de consulta (Query Params):**
  * `limit` (Opcional, número entero positivo, por defecto `50`).
  * `page` (Opcional, número entero positivo, por defecto `1`).
* **Respuesta (`200 OK`):** Arreglo ordenado con los artistas más escuchados globalmente.
  ```json
  [
    {
      "rank": 1,
      "name": "Michael Jackson",
      "imageUrl": "https://lastfm.freetls.fastly.net/i/u/300x300/...",
      "listeners": 7012737,
      "playcount": 388589400,
      "mbid": "f27ec8db-..."
    }
  ]
  ```

### ➔ Detalles del Artista (Biografía y Estadísticas)
* **Ruta:** `GET /api/explore/artists/detail`
* **Parámetros de consulta (Query Params):**
  * `artist` (**Obligatorio**, string con el nombre del artista, ej. `artist=Drake`).
* **Respuesta (`200 OK`):**
  ```json
  {
    "name": "Michael Jackson",
    "mbid": "f27ec8db-...",
    "imageUrl": "https://lastfm.freetls.fastly.net/...",
    "listeners": 7012737,
    "playcount": 388589400,
    "summary": "Michael Joseph Jackson was an American singer... <a href=\"...\">Read more</a>",
    "content": "Michael Joseph Jackson was an American singer..."
  }
  ```

### ➔ Buscar Canciones y Artistas
* **Ruta:** `GET /api/explore/search`
* **Parámetros de consulta (Query Params):**
  * `q` (**Obligatorio**, término de búsqueda, ej. `q=Coldplay`).
  * `type` (Opcional, enum: `track`, `artist`, `all`. Por defecto `all`).
  * `limit` (Opcional, por defecto `20`).
  * `page` (Opcional, por defecto `1`).
* **Respuesta (`200 OK`):**
  * Si `type=track`, devuelve una lista de canciones coincidentes.
  * Si `type=artist`, devuelve una lista de artistas coincidentes.
  * Si `type=all`, devuelve un objeto con ambas listas:
    ```json
    {
      "tracks": [
        {
          "name": "Cure",
          "artist": "ERRA",
          "imageUrl": "https://lastfm.freetls.fastly.net/...",
          "listeners": 42869,
          "mbid": "d43ecde9-..."
        }
      ],
      "artists": [
        {
          "name": "The Cure",
          "imageUrl": "https://lastfm.freetls.fastly.net/...",
          "listeners": 5568104,
          "mbid": "69ee3720-..."
        }
      ]
    }
    ```

---

## 3. Gestión de Playlists (`/api/playlists`)

* **Cabecera obligatoria para todos los endpoints:**
  * `Authorization: Bearer <JWT_TOKEN>`

### ➔ Crear Playlist
* **Ruta:** `POST /api/playlists`
* **Cuerpo de la Petición (JSON):**
  ```json
  {
    "name": "Mi Playlist Favorita",
    "description": "Lista de reproducción con lo mejor de los 80s" // Opcional
  }
  ```
* **Respuestas:**
  * **`201 Created`:** Creada con éxito.
    ```json
    {
      "message": "Playlist creada con éxito",
      "playlist": {
        "id": "2a122389-83c5-...",
        "name": "Mi Playlist Favorita",
        "description": "Lista de reproducción con lo mejor de los 80s",
        "userId": "6017070e-2985-...",
        "createdAt": "2026-06-11T07:01:03.840Z",
        "updatedAt": "2026-06-11T07:01:03.840Z"
      }
    }
    ```
  * **`400 Bad Request`:** Nombre ausente o descripción muy larga.
  * **`401 Unauthorized`:** Token JWT faltante, expirado o inválido.

### ➔ Obtener Playlists del Usuario
* **Ruta:** `GET /api/playlists`
* **Respuestas:**
  * **`200 OK`:** Retorna la lista de todas las playlists creadas por el usuario autenticado, incluyendo el conteo de canciones.
    ```json
    [
      {
        "id": "2a122389-83c5-...",
        "name": "Mi Playlist Favorita",
        "description": "Lista de reproducción con lo mejor de los 80s",
        "userId": "6017070e-2985-...",
        "createdAt": "2026-06-11T07:01:03.840Z",
        "updatedAt": "2026-06-11T07:01:03.840Z",
        "_count": {
          "tracks": 1
        }
      }
    ]
    ```

### ➔ Obtener Detalle de Playlist
* **Ruta:** `GET /api/playlists/:id`
* **Respuestas:**
  * **`200 OK`:** Retorna el detalle de la playlist y el listado de canciones que contiene.
    ```json
    {
      "id": "2a122389-83c5-...",
      "name": "Mi Playlist Favorita",
      "description": "Lista de reproducción con lo mejor de los 80s",
      "userId": "6017070e-2985-...",
      "createdAt": "2026-06-11T07:01:03.840Z",
      "updatedAt": "2026-06-11T07:01:03.840Z",
      "tracks": [
        {
          "id": "2b8199d2-3d7f-...",
          "playlistId": "2a122389-83c5-...",
          "name": "Pictures of You",
          "artist": "The Cure",
          "imageUrl": "https://lastfm.freetls.fastly.net/...",
          "mbid": "d43ecde9-...",
          "createdAt": "2026-06-11T07:01:03.859Z"
        }
      ]
    }
    ```
  * **`403 Forbidden`:** La playlist no pertenece al usuario autenticado.
  * **`404 Not Found`:** Playlist no encontrada.

### ➔ Editar Playlist
* **Ruta:** `PUT /api/playlists/:id`
* **Cuerpo de la Petición (JSON):**
  ```json
  {
    "name": "Nuevo Nombre",            // Opcional
    "description": "Nueva descripción"  // Opcional
  }
  ```
* **Respuestas:**
  * **`200 OK`:** Playlist actualizada exitosamente.
    ```json
    {
      "message": "Playlist actualizada con éxito",
      "playlist": {
        "id": "2a122389-83c5-...",
        "name": "Nuevo Nombre",
        "description": "Nueva descripción",
        "userId": "6017070e-2985-...",
        "createdAt": "2026-06-11T07:01:03.840Z",
        "updatedAt": "2026-06-11T07:01:03.874Z"
      }
    }
    ```
  * **`403 Forbidden`:** No eres el propietario de la playlist.
  * **`404 Not Found`:** Playlist no encontrada.

### ➔ Eliminar Playlist
* **Ruta:** `DELETE /api/playlists/:id`
* **Respuestas:**
  * **`200 OK`:** Eliminación exitosa.
    ```json
    {
      "message": "Playlist eliminada con éxito"
    }
    ```
  * **`403 Forbidden`:** No eres el propietario.
  * **`404 Not Found`:** Playlist no encontrada.

### ➔ Agregar Canción a Playlist
* **Ruta:** `POST /api/playlists/:id/tracks`
* **Cuerpo de la Petición (JSON):**
  ```json
  {
    "name": "Pictures of You",
    "artist": "The Cure",
    "imageUrl": "https://lastfm.freetls.fastly.net/...", // Opcional
    "mbid": "d43ecde9-..."                              // Opcional
  }
  ```
* **Respuestas:**
  * **`201 Created`:** Canción agregada con éxito.
    ```json
    {
      "message": "Canción agregada con éxito",
      "track": {
        "id": "2b8199d2-3d7f-...",
        "playlistId": "2a122389-83c5-...",
        "name": "Pictures of You",
        "artist": "The Cure",
        "imageUrl": "https://lastfm.freetls.fastly.net/...",
        "mbid": "d43ecde9-...",
        "createdAt": "2026-06-11T07:01:03.859Z"
      }
    }
    ```
  * **`400 Bad Request`:** Nombre de canción o artista faltantes.
  * **`403 Forbidden`:** La playlist no te pertenece.
  * **`404 Not Found`:** Playlist no encontrada.

### ➔ Quitar Canción de Playlist
* **Ruta:** `DELETE /api/playlists/:id/tracks/:trackId`
* **Respuestas:**
  * **`200 OK`:** Canción eliminada con éxito.
    ```json
    {
      "message": "Canción eliminada de la playlist con éxito"
    }
    ```
  * **`403 Forbidden`:** No eres propietario de la playlist.
  * **`404 Not Found`:** Playlist o canción no encontradas.

