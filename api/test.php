<?php
    header('Access-Control-Allow-Origin:*');
    require_once('models/product.php');
    require_once('models/department.php');
    require_once('models/product_department.php');

    $product = new product('prueba');

    echo $product->delete();
?>