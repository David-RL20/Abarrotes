<?php
    header('Access-Control-Allow-Origin:*');
    require_once('models/products_sell.php');
    if($_SERVER['REQUEST_METHOD']== 'GET'){
        if(isset($_POST['idSell']) && isset($_POST['codeProduct']) && isset($_POST['quantity'])&& isset($_POST['subTotal'])){
            $product_sell = new Product_Sell();

            $product_sell->setIdSell($_POST['idSell']);
            $product_sell->setCodeProduct($_POST['codeProduct']);
            $product_sell->setQuantity($_POST['quantity']);
            $product_sell->setSubTotal($_POST['subTotal']);

            
            echo $product_sell->toJson();
        }
    }
    // if($_SERVER['REQUEST_METHOD']== 'POST'){
       
        
    // } 


?>