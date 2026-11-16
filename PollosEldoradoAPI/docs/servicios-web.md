
# Documentación de servicios web
## App Pollos ElDorado

**Evidencia:** GA7-220501096-AA5-EV03
**Proyecto formativo:** App Pollos ElDorado
**Módulo:** Registro, consulta y reporte de mortalidad avícola

## 1. Introducción

La API de App Pollos ElDorado permite gestionar información
relacionada con la mortalidad de aves en una granja avícola
que cuenta con ocho galpones.

Los servicios web permiten registrar usuarios, validar
credenciales, registrar mortalidad, consultar galpones y
generar reportes de mortalidad por galpón y lote.

## 2. Objetivo

Diseñar, desarrollar y documentar los servicios web
necesarios para apoyar el registro y seguimiento de
la mortalidad de aves en la granja Pollos ElDorado.

## 3. Tecnologías utilizadas

- Node.js: entorno de ejecución de JavaScript.
- Express.js: desarrollo de servicios web REST.
- MongoDB: almacenamiento de información.
- Mongoose: modelado y acceso a los datos.
- bcryptjs: cifrado de contraseñas.
- Postman: pruebas de solicitudes HTTP.
- Git y GitHub: control de versiones.

## 4. Configuración general

URL base de desarrollo:

http://localhost:3000

Formato de intercambio de información: JSON.

Los servicios se ejecutan localmente mediante:

npm run dev

La conexión a MongoDB se configura mediante
variables de entorno.

## 5. Servicios de autenticación

### 5.1 Registrar usuario

Método: POST

Ruta: /api/auth/registro

Descripción:
Permite registrar un usuario nuevo en el sistema.

Ejemplo de solicitud:

{
  "username": "aprendiz",
  "password": "123456"
}

Respuesta satisfactoria: HTTP 201.

{
  "mensaje": "Usuario registrado correctamente."
}

Errores:
- 400: datos incompletos o contraseña inválida.
- 409: usuario previamente registrado.
- 500: error interno del servidor.

### 5.2 Iniciar sesión

Método: POST

Ruta: /api/auth/login

Descripción:
Comprueba las credenciales del usuario registrado.

Ejemplo de solicitud:

{
  "username": "aprendiz",
  "password": "123456"
}

Respuesta satisfactoria: HTTP 200.

{
  "mensaje": "Autenticación satisfactoria.",
  "usuario": "aprendiz"
}

Errores:
- 400: credenciales incompletas.
- 401: usuario o contraseña incorrectos.
- 500: error interno del servidor.

Nota:
La versión actual valida las credenciales, pero
no genera tokens ni sesiones de autenticación.

## 6. Servicios de mortalidad

### 6.1 Registrar mortalidad

Método: POST

Ruta: /api/mortalidad

Descripción:
Almacena un registro de mortalidad por fecha,
galpón y lote.

Ejemplo de solicitud:

{
  "fecha": "2026-11-16",
  "galpon": 2,
  "lote": "LOTE-002",
  "muertas": 10,
  "enfermas": 5,
  "observacion": "Registro diario de mortalidad."
}

Respuesta satisfactoria: HTTP 201.

La respuesta incluye el mensaje de confirmación
y el registro almacenado con su identificador.

Errores:
- 400: datos inválidos o incompletos.
- 500: error interno del servidor.

### 6.2 Consultar registros

Método: GET

Ruta: /api/mortalidad

Descripción:
Obtiene los registros de mortalidad almacenados.

Parámetros opcionales:
- galpon: número entre 1 y 8.
- lote: identificador del lote.

Ejemplo:

GET /api/mortalidad?galpon=2&lote=LOTE-002

Respuesta satisfactoria: HTTP 200.

Devuelve un arreglo JSON de registros.

Errores:
- 400: filtros inválidos.
- 500: error interno del servidor.

### 6.3 Actualizar mortalidad

Método: PUT

Ruta: /api/mortalidad/:id

Descripción:
Actualiza un registro mediante su identificador
generado por MongoDB.

Se debe enviar el registro completo con los campos
obligatorios y sus valores actualizados.

Respuesta satisfactoria: HTTP 200.

{
  "mensaje": "Registro actualizado correctamente.",
  "registro": {}
}

El campo registro contiene los datos actualizados.

Errores:
- 400: identificador o datos inválidos.
- 404: registro no encontrado.
- 500: error interno del servidor.

### 6.4 Eliminar mortalidad

Método: DELETE

Ruta: /api/mortalidad/:id

Descripción:
Elimina un registro mediante su identificador.

Respuesta satisfactoria: HTTP 200.

{
  "mensaje": "Registro eliminado correctamente."
}

Errores:
- 400: identificador inválido.
- 404: registro no encontrado.
- 500: error interno del servidor.

## 7. Servicios de galpones

### 7.1 Consultar todos los galpones

Método: GET

Ruta: /api/galpones

Descripción:
Devuelve el catálogo de los ocho galpones
definidos para el proyecto.

Respuesta satisfactoria: HTTP 200.

La respuesta contiene:
- mensaje de confirmación.
- total de galpones.
- arreglo de galpones con número y nombre.

### 7.2 Consultar un galpón

Método: GET

Ruta: /api/galpones/:numero

Descripción:
Consulta un galpón por su número.

Ejemplo:

GET /api/galpones/3

Respuesta satisfactoria: HTTP 200.

{
  "mensaje": "Galpón consultado correctamente.",
  "galpon": {
    "numero": 3,
    "nombre": "Galpón 3"
  }
}

Error:
- 400: número fuera del rango permitido.

## 8. Servicio de reportes

### 8.1 Consultar reporte de mortalidad

Método: GET

Ruta: /api/reportes/mortalidad

Descripción:
Calcula la mortalidad acumulada de los registros
almacenados, con agrupación por galpón y lote.

Parámetros opcionales:
- galpon: número del galpón.
- lote: identificador del lote.
- fechaDesde: fecha inicial AAAA-MM-DD.
- fechaHasta: fecha final AAAA-MM-DD.

Ejemplo:

GET /api/reportes/mortalidad?galpon=2&lote=LOTE-002

Respuesta satisfactoria: HTTP 200.

{
  "mensaje": "Reporte de mortalidad generado correctamente.",
  "filtros": {
    "galpon": "2",
    "lote": "LOTE-002",
    "fechaDesde": null,
    "fechaHasta": null
  },
  "resumen": {
    "cantidadRegistros": 1,
    "totalMuertas": 10,
    "totalEnfermasReportadas": 5
  },
  "porGalponYLote": [
    {
      "galpon": 2,
      "lote": "LOTE-002",
      "totalMuertas": 10,
      "totalEnfermasReportadas": 5,
      "cantidadRegistros": 1
    }
  ]
}

Los valores corresponden al ejemplo de prueba.

Errores:
- 400: filtros o fechas inválidas.
- 500: error interno del servidor.

Nota:
El total de enfermas reportadas suma los valores
de los registros; no necesariamente representa
aves enfermas únicas.

## 9. Pruebas realizadas

Los servicios se probaron utilizando Postman.

Resultados satisfactorios:
- Registro de usuario: HTTP 201.
- Autenticación correcta: HTTP 200.
- Autenticación incorrecta: HTTP 401.
- Registro de mortalidad: HTTP 201.
- Consulta de mortalidad: HTTP 200.
- Actualización de mortalidad: HTTP 200.
- Eliminación de mortalidad: HTTP 200.
- Consulta general de galpones: HTTP 200.
- Consulta individual de galpón: HTTP 200.
- Validación de galpón inválido: HTTP 400.
- Consulta general de reportes: HTTP 200.
- Reporte filtrado por galpón y lote: HTTP 200.
- Reporte filtrado por fechas: HTTP 200.

## 10. Control de versiones

El proyecto utiliza Git y GitHub para registrar
los cambios realizados durante el desarrollo.

Repositorio:

https://github.com/OrlandoAmaris/PollosEldoradoJava

Carpeta de la API:

PollosEldoradoAPI

Los archivos de configuración local y las
dependencias instaladas se excluyen del repositorio
mediante las reglas de .gitignore.

## 11. Conclusiones

Se diseñaron y desarrollaron servicios web REST
para las funcionalidades principales del módulo
de mortalidad de App Pollos ElDorado.

Los servicios permiten gestionar registros,
consultar los galpones y generar reportes
acumulados por galpón y lote.

Las pruebas con Postman permitieron comprobar
las respuestas HTTP y el almacenamiento de datos
en MongoDB.

La API constituye un componente funcional del
proyecto formativo y podrá ampliarse en futuras
etapas de desarrollo.
