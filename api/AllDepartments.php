<?php
    header('Access-Control-Allow-Origin:*');
    require_once('models/department.php');


    if($_SERVER['REQUEST_METHOD']== 'GET'){

        echo department::getAllToJson();
    }
    if($_SERVER['REQUEST_METHOD']== 'POST'){
        if(isset($_POST['code']) && isset($_POST['name'])){
            $newDepartment = new department();

            $newDepartment->setCode($_POST['code']);
            $newDepartment->setName($_POST['name']);

            
            echo $newDepartment->add();
        }
        
    }
    if($_SERVER['REQUEST_METHOD']== 'PUT'){
        if(isset($_PUT['code']) && isset($_PUT['name'])){
            $newDepartment = new department();

            $newDepartment->setCode($_PUT['code']);
            $newDepartment->setName($_PUT['name']);

            
            echo $newDepartment->toJson();
        } 

    }
     
?>