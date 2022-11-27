<?php
    header("Content-type: application/json; charset=utf-8");

    include "funciones.php";

    $conexion = conectar();

    $data = [];
    $id = $_POST["id"];
    $accion =  $_POST["accion"];

    switch($accion) {
        case "marcarImportante":
            $query = "UPDATE tareas SET status = 'importante' WHERE id = ?";
            break;            
        case "quitarImportante":
            $query = "UPDATE tareas SET status = 'pendiente' WHERE id = ?";
            break;
    }

    $statement = $conexion->prepare($query);
    $statement->execute([$id]);

    echo json_encode($data);
?>