<?php
    header('Access-Control-Allow-Origin:*');  
    require_once('models/sale.php');
    require_once('models/products_sell.php');
    //GET
    if($_SERVER['REQUEST_METHOD']== 'GET'){
        if(isset($_GET['id'])){
            $sale = new sale($_GET['id']);
            echo $sale->toJson();
        }else{
            $sales = new sale();
            echo $sales::getAllToJson();
        }
    }
    //POST
    if($_SERVER['REQUEST_METHOD']== 'POST'){ 
        if(isset($_POST['total']) ){
            //creating object
            $sale = new sale();
            //get last id
            $sale->setId();

            //confirmation for client
            if(isset($_POST['client'])){
                $sale->setClient($_POST['client']);
            } 
            //total
            $sale->setTotal($_POST['total']);
            
             
            
            if($sale->add()){
                try {
                    $products =  json_decode($_POST['products']);
                    //Register sale products in DB
                    foreach ($products as $product) {
                        //Creating an object 
                        $sp = new Product_Sell($sale->getId(),$product->code,$product->quantity,$product->subtotal);
                        $sp->add(); 
                    }
                    echo json_encode(array(
                        'message'=>'add succesfully',
                        'status'=>200,
                        'sale'=>$sale->getId()
                    )); 
                } catch (\Throwable $th) {
                    throw $th;
                }
                
            }else {
                echo json_encode(array(
                    'message'=>'error at add',
                    'status'=>404
                ));
            }
        }else {
           echo json_encode(array(
                'message'=>'not enough variables',
                'status'=>404
            )); 
        }
    }

?>