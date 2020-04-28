<?php
    header('Access-Control-Allow-Origin:*');
    require_once('models/client.php');
    require_once('models/sale_credit.php');

    if($_SERVER['REQUEST_METHOD']== 'GET'){
        $answer= array();
        if(isset($_GET['number'])){ 
            $sales =  json_decode(Sell_Credit::getAllToJson($_GET['number']));
            $client = new client($_GET['number']);
            if(!empty($sales)){
                $total = 0;
                foreach ($sales as $sale) {
                $total = $total + $sale->total;
                }
                array_push($answer,json_decode(json_encode(array(
                    'name'=>$client->getName(),
                    'number'=>$client->getNumber(),
                    'limit'=>$client->getLimit(), 
                    'total_used'=>$total,
                    'message'=>'Total de compras de un usuario'
                ))));
            }else{
                $client = new client($_GET['number']);
                array_push($answer ,json_decode(json_encode(array(
                    'name'=>$client->getName(),
                    'number'=>$client->getNumber(),
                    'limit'=>$client->getLimit(), 
                    'total_used'=>0,
                    'message'=>'Total de compras de un usuario'
                ))));
            }
        }else{
            $clients = json_decode(client::getAllToJson());
            $clientesFull = array();
            foreach ($clients as $client) {  
                $sales =  json_decode(Sell_Credit::getAllToJson($client->number));
                if(!empty($sales)){
                    $total = 0;
                    foreach ($sales as $sale) {
                    $total = $total + $sale->total;
                    }
                     array_push($answer,json_decode(json_encode(array(
                        'name'=>$client->name,
                        'number'=>$client->number,
                        'limit'=>$client->limit, 
                        'total_used'=>$total,
                        'message'=>'Total de compras de un usuario'
                    ))));
                }
                else{
                    array_push($answer , json_decode( json_encode(array(
                        'name'=>$client->name,
                        'number'=>$client->number,
                        'limit'=>$client->limit, 
                        'total_used'=>0,
                        'message'=>"Total de compras de un usuario"
                    ))));
                } 
            }   
        } 
        echo json_encode($answer);
    }
    if($_SERVER['REQUEST_METHOD']== 'POST'){
        if(isset($_POST['action'])){
            switch ($_POST['action']) {
                case 'post':
                    # code...
                        if(isset($_POST['name']) && isset($_POST['limit'])){
                            $newClient = new client();
                
                            $newClient->setLimit($_POST['limit']);
                            $newClient->setName($_POST['name']);
                
                            if($newClient->add()){
                                echo '1';
                            }else{
                                echo 'No se ha podido agregar';
                            }
                        }
                    break;
                case 'update':
                    if(isset($_POST['number']) && isset($_POST['name']) && isset($_POST['limit'])){
                        $newClient = new client($_POST['number']); 
                        $newClient->setLimit($_POST['limit']);
                        $newClient->setName($_POST['name']);
             
                        if($newClient->update()){
                            echo '1';
                        }else{
                            echo 'no se ha podido actualizar';
                        }
                    }
                break;
                case 'delete':
                    if(isset($_POST['number'])){
                        $newClient = new client($_POST['number']); 
                        if($newClient->delete()){
                            echo '1';
                        }else{
                            echo 'no se ha podido eliminar';
                        }
                    }
                break; 
            }
        }else{
            echo 'Accion incorrecta';
        }
        
        
    } 

?>