<?php
    header('Access-Control-Allow-Origin:*');
    require_once('models/productos_departamento.php');

    $newProd_Depto= new product_depto;

    $newProd_Depto->setCodeDpto('GRANE');
    $newProd_Depto->setCodeProduct('09876543456');

    $newProd_Depto->add();

?>