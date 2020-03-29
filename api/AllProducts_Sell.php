<?php
    header('Access-Control-Allow-Origin:*');
    require_once('models/products_sell.php');
    require_once('models/product.php');
    if($_SERVER['REQUEST_METHOD']== 'GET'){
        if(isset($_GET['idSell'])){
            //traer todas las ventas de un id 
            $products_sell = json_decode(Product_Sell::getAllToJson($_GET['idSell']));
            $fullP_S = array();
            foreach ($products_sell as $a) { 
                $product = new Product($a->codeProduct);

                array_push($fullP_S, json_decode(json_encode(array(
                    'sale'=>$a->sale,
                    'subtotal'=>$a->subTotal,
                    'codeProduct'=>$a->codeProduct,
                    'nameProduct'=>$product->getName(),
                    'priceProduct'=>$product->getPrice(),
                    'quantity'=>$a->quantity,

                ))));
            }
            echo json_encode($fullP_S);
        }else{
            echo 'Accion incorrecta,porfavor especifique una venta';
        }
    }
    if($_SERVER['REQUEST_METHOD']== 'POST'){
        if(isset($_POST['idSell']) && isset($_POST['codeProduct']) && isset($_POST['quantity'])&& isset($_POST['subTotal'])){
            $product_sell = new Product_Sell();

            $product_sell->setSale($_POST['idSell']);
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