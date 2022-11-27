<?php
    header('Content-Type: application/json; charset=utf-8');

    include "funciones.php";

    $conexion = conectar();

    $datos = [];

    $usuario = $_POST["usuario"];
    $texto = $_POST["texto"];
    $dia = $_POST["dia"];
    $mes = $_POST["mes"];
    $anio = $_POST["anio"];
    $fecha = "$anio-$mes-$dia";

    $query = "INSERT INTO tareas (texto, fecha) VALUES (?, ?)";
    $statement = $conexion->prepare($query);
    $statement->execute([$texto, $fecha]);

    $tarea_insertada = $statement->insert_id;

    $query = 
        "INSERT INTO tareas_usuarios 
            (id_tarea, id_usuario) VALUES (?, ?)";
    $statement = $conexion->prepare($query);
    $statement->execute([$tarea_insertada, $usuario]);

    echo json_encode($datos);
?>