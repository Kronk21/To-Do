<?php
    header('Content-Type: application/json; charset=utf-8');
    $datos = [];

    include "funciones.php";

    $idUsuario = $_POST["id"];
    $filtro = $_POST["filtro"];
    
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
    }
    
        // "SELECT * FROM tareas_usuarios
        //     JOIN tareas 
        //         ON tareas_usuarios.id_tarea = tareas.id
        //     JOIN usuarios
        //         ON tareas_usuarios.id_usuario = usuarios.id
        //     WHERE tareas_usuarios.id_usuario = ?";
        // if($status != "pendiente") {
        //     $query .= " AND status = '$status'";
        // }
        // $query .= " ORDER BY fecha";

        // $statement = $conexion->prepare($query);
        // $statement->execute([$idUsuario]);

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