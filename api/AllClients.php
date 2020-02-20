<?php
    header('Access-Control-Allow-Origin:*');
    require_once('models/client.php');

    if($_SERVER['REQUEST_METHOD']== 'GET'){

        echo client::getAllToJson();
    }
    if($_SERVER['REQUEST_METHOD']== 'POST'){
        if(isset($_POST['number']) && isset($_POST['name']) && isset($_POST['limit'])){
            $newClient = new client();

            $newClient->setLimit($_POST['limit']);
            $newClient->setName($_POST['name']);

            
            echo $newClient->toJson();
        }
        
    }
    if($_SERVER['REQUEST_METHOD']== 'PUT'){
        if(isset($_PUT['number']) && isset($_PUT['name']) && isset($_PUT['limit'])){
            $newClient = new client();

            $newClient->setLimit($_PUT['limit']);
            $newClient->setName($_PUT['name']);

            
            echo $newClient->toJson();
        }

    }

?>