<?php
    header('Access-Control-Allow-Origin:*');
    require_once('models/client.php');

    if($_SERVER['REQUEST_METHOD']== 'GET'){

        echo client::getAllToJson();
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