<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c"
           uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE html>
<html lang="es">

<head>

    <meta charset="UTF-8">

    <title>Registro de Mortalidad</title>

    <style>

        body {
            font-family: Arial, sans-serif;
            background-color: #EAF3FF;
            margin: 0;
            padding: 30px;
        }

        .contenedor {
            max-width: 1100px;
            margin: auto;
            background-color: white;
            padding: 25px;
            border-radius: 10px;
        }

        h1 {
            color: #004B99;
        }

        h2 {
            color: #0066CC;
        }

        .campo {
            margin-bottom: 15px;
        }

        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }

        input,
        textarea {
            width: 100%;
            padding: 9px;
            box-sizing: border-box;
        }

        button {
            padding: 10px 18px;
            background-color: #0066CC;
            color: white;
            border: none;
            cursor: pointer;
            border-radius: 5px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 25px;
        }

        th,
        td {
            border: 1px solid #ccc;
            padding: 8px;
            text-align: left;
        }

        th {
            background-color: #0066CC;
            color: white;
        }

        .accion {
            display: inline;
        }

    </style>

</head>

<body>

<div class="contenedor">

    <h1>POLLOS ELDORADO</h1>

    <h2>
        Registro de Mortalidad
    </h2>

    <c:choose>

        <c:when test="${not empty registroEditar}">

            <form
                action="${pageContext.request.contextPath}/registro-mortalidad"
                method="post">

                <input type="hidden"
                       name="accion"
                       value="actualizar">

                <input type="hidden"
                       name="idRegistro"
                       value="${registroEditar.idRegistro}">

                <div class="campo">

                    <label>Fecha:</label>

                    <input type="date"
                           name="fecha"
                           value="${registroEditar.fecha}"
                           required>

                </div>

                <div class="campo">

                    <label>Galpón:</label>

                    <input type="number"
                           name="galpon"
                           min="1"
                           max="8"
                           value="${registroEditar.galpon}"
                           required>

                </div>

                <div class="campo">

                    <label>Cantidad de muertos:</label>

                    <input type="number"
                           name="cantidad"
                           min="1"
                           value="${registroEditar.cantidad}"
                           required>

                </div>

                <div class="campo">

                    <label>Causa probable:</label>

                    <input type="text"
                           name="causaProbable"
                           value="${registroEditar.causaProbable}"
                           required>

                </div>

                <div class="campo">

                    <label>Observaciones:</label>

                    <textarea
                        name="observaciones">${registroEditar.observaciones}</textarea>

                </div>

                <button type="submit">
                    Actualizar registro
                </button>

            </form>

        </c:when>

        <c:otherwise>

            <form
    action="${pageContext.request.contextPath}/registro-mortalidad"
    method="post">

    <input type="hidden"
           name="accion"
           value="guardar">

    <label>Fecha:</label>
    <input type="date"
           name="fecha"
           required>

    <label>Galpón:</label>
    <input type="number"
           name="galpon"
           min="1"
           max="8"
           required>

    <label>Cantidad de muertos:</label>
    <input type="number"
           name="cantidad"
           min="1"
           required>

    <label>Causa probable:</label>
    <input type="text"
           name="causaProbable"
           required>

    <label>Observaciones:</label>
    <textarea name="observaciones"></textarea>

    <button type="submit">
        Guardar registro
    </button>

</form>

        </c:otherwise>

    </c:choose>


    <h2>Registros registrados</h2>

    <table>

        <thead>

            <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Galpón</th>
                <th>Cantidad</th>
                <th>Causa probable</th>
                <th>Observaciones</th>
                <th>Acciones</th>
            </tr>

        </thead>

        <tbody>

            <c:forEach
                    var="registro"
                    items="${registros}">

                <tr>

                    <td>${registro.idRegistro}</td>

                    <td>${registro.fecha}</td>

                    <td>${registro.galpon}</td>

                    <td>${registro.cantidad}</td>

                    <td>${registro.causaProbable}</td>

                    <td>${registro.observaciones}</td>

                    <td>

                        <a href="${pageContext.request.contextPath}/registro-mortalidad?accion=editar&idRegistro=${registro.idRegistro}">
                            Editar
                        </a>

                        <form
                            class="accion"
                            action="${pageContext.request.contextPath}/registro-mortalidad"
                            method="post">

                            <input type="hidden"
                                   name="accion"
                                   value="eliminar">

                            <input type="hidden"
                                   name="idRegistro"
                                   value="${registro.idRegistro}">

                            <button type="submit">
                                Eliminar
                            </button>

                        </form>

                    </td>

                </tr>

            </c:forEach>

        </tbody>

    </table>

</div>

</body>

</html>