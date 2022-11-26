<?php
    header('Content-Type: application/json; charset=utf-8');

    include "funciones.php";

    $id = obtener_pc_id();
    $datos = [        
        "id" => $id        
    ];


    echo json_encode($datos);
?>