<?php
    header('Access-Control-Allow-Origin:*');
    require_once('models/supplier.php');
    if($_SERVER['REQUEST_METHOD']== 'GET'){

        echo supplier::getAllToJson();
    }
    if($_SERVER['REQUEST_METHOD']== 'POST'){
        if(isset($_POST['deliveryDay']) && isset($_POST['orderDay']) && isset($_POST['name'])){
            $newSupplier = new supplier();

            $newSupplier->setDeliveryDay($_POST['deliveryDay']);
            $newSupplier->setOrderDay($_POST['orderDay']);
            $newSupplier->setName($_POST['name']);

            
            echo $newSupplier->add();
        }
        
    }
    if($_SERVER['REQUEST_METHOD']== 'PUT'){
        if(isset($_PUT['number'])  && isset($_PUT['deliveryDay']) && isset($_PUT['orderDay']) && isset($_PUT['name'])){
            $newSupplier = new supplier($_PUT['number']);

            // $newSupplier->setDeliveryDay($_PUT['deliveryDay']);
            // $newSupplier->setOrderDay($_PUT['orderDay']);
            // $newSupplier->setName($_PUT['name']);

            echo $newSupplier->toJson();
        } 

    }


?>