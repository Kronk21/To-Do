<?php
    header("Content-type: application/json; charset=utf-8");

    include "funciones.php";

    $conexion = conectar();

    $datos = [];
    $id = $_POST["id"];

    $query = "DELETE FROM tareas_usuarios WHERE id_tarea = ?";
    $statement = $conexion->prepare($query);
    $statement->execute([$id]);

    echo json_encode($datos);
?>