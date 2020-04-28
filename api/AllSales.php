<?php
    header('Access-Control-Allow-Origin:*');
    require_once('models/sale.php');
    if($_SERVER['REQUEST_METHOD']== 'GET'){
        if(isset($_GET['id'])){
            $sale = new sale($_GET['id']);
            echo $sale->toJson();
        }else{
            $sales = new sale();
            echo $sales::getAllToJson();
        }
    }

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
                echo json_encode(array(
                    'message'=>'add succesfully',
                    'statusCode'=>200,
                    'idSale'=>$sale->getId()
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