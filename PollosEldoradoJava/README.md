# POLLOS ELDORADO - Módulo web de registro de mortalidad

## Evidencia SENA
GA7-220501096-AA3-EV01 - Codificación de módulos del software.

## Tecnologías utilizadas
- Java 21
- JSP y Servlets (`javax.servlet`, compatible con Tomcat 9)
- JDBC y MySQL
- Maven
- Git y GitHub

## Arquitectura
Vista JSP → Servlet → DAO → JDBC → MySQL.

## Funcionalidades
- Registrar fecha, galpón, cantidad de aves muertas, causa probable y observaciones.
- Consultar registros guardados.
- Editar un registro existente.
- Eliminar un registro.
- Validar campos requeridos, identificadores positivos, galpones del 1 al 8 y cantidades positivas.
- Mostrar mensajes cuando una operación se completa o falla.

## Control de versiones
Repositorio  https://github.com/OrlandoAmaris/PollosEldoradoJava
