<?php
    function conectar() {
        $conexion = new mysqli("localhost", "root", "", "to_do");
        if($conexion->connect_errno) {
            return false;
        }

        return $conexion;
    }    

    function obtener_pc_id() {
        if(!isset($_COOKIE["pc_id"])) {       
            $unique = uniqid();
            setcookie("pc_id", $unique, time() + 60 * 60 * 24 * 15, "/");       
            
            $conexion = conectar();
            $query = "INSERT INTO usuarios (id) VALUES (?)";
            $statement = $conexion->prepare($query);
            $statement->execute([$unique]);

            return $unique;
        }

        return $_COOKIE["pc_id"];
    }
?>