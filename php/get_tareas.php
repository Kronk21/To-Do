<?php
    header('Content-Type: application/json; charset=utf-8');
    $datos = [];

    include "funciones.php";

    $idUsuario = $_POST["id"];
    $filtro = $_POST["filtro"];
    $busqueda = isset($_POST["busqueda"]) ? "%" . $_POST["busqueda"] . "%" : "";
    
    $conexion = conectar();

    switch($filtro) {
        case "todos":
            $query = 
                "SELECT * FROM tareas_usuarios
                JOIN tareas 
                    ON tareas_usuarios.id_tarea = tareas.id
                JOIN usuarios
                    ON tareas_usuarios.id_usuario = usuarios.id
                WHERE tareas_usuarios.id_usuario = ? 
                ORDER BY fecha";

            $statement = $conexion->prepare($query);
            $statement->execute([$idUsuario]);
            break;
        
        case "hoy":
            $query = 
                "SELECT * FROM tareas_usuarios
                JOIN tareas 
                    ON tareas_usuarios.id_tarea = tareas.id
                JOIN usuarios
                    ON tareas_usuarios.id_usuario = usuarios.id
                WHERE 
                    tareas_usuarios.id_usuario = ? AND fecha = CURDATE()
                ORDER BY fecha";

            $statement = $conexion->prepare($query);
            $statement->execute([$idUsuario]);
            break;

        case "semana":
            $query = 
                "SELECT * FROM tareas_usuarios
                JOIN tareas 
                    ON tareas_usuarios.id_tarea = tareas.id
                JOIN usuarios
                    ON tareas_usuarios.id_usuario = usuarios.id
                WHERE 
                    tareas_usuarios.id_usuario = ? AND 
                    fecha BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 8 DAY)
                ORDER BY fecha";

            $statement = $conexion->prepare($query);
            $statement->execute([$idUsuario]);
            break;

        case "importantes":
            $query = 
                "SELECT * FROM tareas_usuarios
                JOIN tareas 
                    ON tareas_usuarios.id_tarea = tareas.id
                JOIN usuarios
                    ON tareas_usuarios.id_usuario = usuarios.id
                WHERE 
                    tareas_usuarios.id_usuario = ? AND 
                    status = 'importante'
                ORDER BY fecha";

            $statement = $conexion->prepare($query);
            $statement->execute([$idUsuario]);
            break;

        case "pasados":
            $query = 
                "SELECT * FROM tareas_usuarios
                JOIN tareas 
                    ON tareas_usuarios.id_tarea = tareas.id
                JOIN usuarios
                    ON tareas_usuarios.id_usuario = usuarios.id
                WHERE 
                    tareas_usuarios.id_usuario = ? AND 
                    fecha < CURDATE()
                ORDER BY fecha";

            $statement = $conexion->prepare($query);
            $statement->execute([$idUsuario]);
            break;

        case "busqueda":          
            $query = 
                "SELECT * FROM tareas_usuarios
                JOIN tareas 
                    ON tareas_usuarios.id_tarea = tareas.id
                JOIN usuarios
                    ON tareas_usuarios.id_usuario = usuarios.id
                WHERE 
                    tareas_usuarios.id_usuario = ? AND 
                    texto LIKE ?  
                ORDER BY fecha";

            $statement = $conexion->prepare($query);
            $statement->execute([$idUsuario, $busqueda]);
            break;
    }

    $resultado = $statement->get_result();
    while($fila = $resultado->fetch_assoc()) {
        $tarea = [
            "id" => $fila["id_tarea"],
            "texto" => $fila["texto"],
            "fecha" => $fila["fecha"],
            "status" => $fila["status"]
        ];
        array_push($datos, $tarea);
    }

    echo json_encode($datos);
?>