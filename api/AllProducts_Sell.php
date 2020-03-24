<?php
    header('Access-Control-Allow-Origin:*');
    require_once('models/products_sell.php');
    if($_SERVER['REQUEST_METHOD']== 'GET'){
        if(isset($_GET['idSell'])){
            //traer todas las ventas de un id
        }else{
            $products_sell = new Product_Sell();
        }
    }
    if($_SERVER['REQUEST_METHOD']== 'POST'){
        if(isset($_POST['idSell']) && isset($_POST['codeProduct']) && isset($_POST['quantity'])&& isset($_POST['subTotal'])){
            $product_sell = new Product_Sell();

            $product_sell->setIdSell($_POST['idSell']);
            $product_sell->setCodeProduct($_POST['codeProduct']);
            $product_sell->setQuantity($_POST['quantity']);
            $product_sell->setSubTotal($_POST['subTotal']);

            
            if($product_sell->add()){
                echo json_encode(array(
                    'message'=>'add succesfully',
                    'statusCode'=>200
                ));  
            }else {
                echo json_encode(array(
                    'message'=>'error at add',
                    'statusCode'=>404
                ));
            }
        }else {
           echo json_encode(array(
                'message'=>'not enough variables',
                'statusCode'=>404
            )); 
        }
    } 


?>