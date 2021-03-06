<?php
    header('Access-Control-Allow-Origin:*');
    require_once('models/sale_credit.php');
    if($_SERVER['REQUEST_METHOD']== 'GET'){
        if(isset($_GET['client'])){
            $sale_credit = new Sell_Credit(); 
             echo $sale_credit::getAllToJson($_GET['client']);
             
        }else{ 
            echo 'error';
        }
    }

    if($_SERVER['REQUEST_METHOD']== 'POST'){
        if(isset($_POST['action'])){
            switch ($_POST['action']) {
                case 'post':
                    if(isset($_POST['total']) && isset($_POST['client']) && isset($_POST['sale'])){
                        //creating object
                        $sale = new Sell_Credit(); 
                        //confirmation for client
                        $sale->setClient($_POST['client']);
                        //total
                        $sale->setTotal($_POST['total']);
                        $sale->setSale($_POST['sale']);
                        if($sale->add()){
                            echo json_encode(array(
                                'message'=>'add succesfully',
                                'statusCode'=>200,
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
                break;
                case 'delete':
                    if(isset($_POST['client'])){
                        $sale_credit = new Sell_Credit();
                        $sale_credit->setClient($_POST['client']);

                        if($sale_credit->delete()){
                            echo json_encode(array(
                                'message'=>'delete succesfully',
                                'statusCode'=>200,
                            ));  
                        }else {
                            echo json_encode(array(
                                'message'=>'error at delete',
                                'statusCode'=>404
                            ));
                        }
                    }else{
                        echo 'Cliente invalido';
                    }
                break;
                
                default:
                    # code...
                    break;
            }

        } 
    }

?>