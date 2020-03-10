<?php
    header('Access-Control-Allow-Origin:*');
    require_once('models/products_sell.php');
    if($_SERVER['REQUEST_METHOD']== 'GET'){
        if(isset($_GET['idSell']) && isset($_GET['codeProduct']) && isset($_GET['quantity'])&& isset($_GET['subTotal'])){
            $product_sell = new Product_Sell();

            $product_sell->setIdSell($_GET['idSell']);
            $product_sell->setCodeProduct($_GET['codeProduct']);
            $product_sell->setQuantity($_GET['quantity']);
            $product_sell->setSubTotal($_GET['subTotal']);

            
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
    // if($_SERVER['REQUEST_METHOD']== 'POST'){
       
        
    // } 


?>