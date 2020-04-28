<?php
    header('Access-Control-Allow-Origin:*');
    require_once('models/department.php');


    if($_SERVER['REQUEST_METHOD']== 'GET'){
        if(isset($_GET['delete'])){
            $department = new department($_GET['delete']);
            echo $department->delete();
        }else if(isset($_GET['update']) && isset($_GET['name'])){
            $newDepartment = new department($_GET['update']);

            $newDepartment->setName($_GET['name']);

            if($newDepartment->update()){
                echo json_encode(array(
                    'status'=>1,
                ));
            }
        }else{
            echo department::getAllToJson();
        }
        
    }
    if($_SERVER['REQUEST_METHOD']== 'POST'){
        if(isset($_POST['code']) && isset($_POST['name'])){
            $newDepartment = new department();

            $newDepartment->setCode($_POST['code']);
            $newDepartment->setName($_POST['name']);

            
            if($newDepartment->add()){
                echo json_encode(array(
                    'status'=>1,
                    'department'=>json_decode($newDepartment->toJson())
                ));
            }
        }else{
            echo json_encode(array(
                'status'=>404,
                'message'=>'No se pudo agregar'
            ));
        }
        
    }
    // if($_SERVER['REQUEST_METHOD']== 'PUT'){
    //     if(isset($_PUT['code']) && isset($_PUT['name'])){
            
    //     } 

    // }
    
     
?>