<?php
    header('Access-Control-Allow-Origin:*');
    require_once('models/product.php');
    require_once('models/department.php');
    require_once('models/productos_departamento.php');
    
    
    if($_SERVER['REQUEST_METHOD']== 'GET'){
        if(isset($_GET['code'])){
            $code = $_GET['code'];
            if($code != ''){
                $product = new product($code);
                echo $product->toJson();
            }
        }else{
             $allProducts = json_decode(product::getAllToJson());
             $finalArray = array();
            foreach($allProducts as $product){
                $department = json_decode(department::getAllToJsonProducts($product->code));
    
                array_push( $finalArray, array(
                    'code'=>$product->code,
                    'stock'=>$product->stock,
                    'name'=>$product->name,
                    'price'=>$product->price,
                    'department'=> $department
                    
                ));
            }
            echo json_encode($finalArray);
        }
    }
    if($_SERVER['REQUEST_METHOD']== 'POST'){
        if(isset($_POST['code']) && isset($_POST['stock']) && isset($_POST['name']) && isset($_POST['price'])&& isset($_POST['dptoCode'])){
            $newProduct = new product();
            $newProd_Depto = new product_depto();
            
            //productos_departamento
            $newProd_Depto->setCodeProduct($_POST['code']);
            $newProd_Depto->setCodeDpto($_POST['dptoCode']);

            //product
            $newProduct->setCode($_POST['code']);
            $newProduct->setStock($_POST['stock']);
            $newProduct->setName($_POST['name']);
            $newProduct->setPrice($_POST['price']);

           if( $newProduct->add() && $newProd_Depto->add()){
               echo '1';
           }

        }
        
    }
    if($_SERVER['REQUEST_METHOD']== 'PUT'){
        if(isset($_PUT['code']) && isset($_PUT['stock']) && isset($_PUT['name']) && isset($_PUT['price'])&& isset($_PUT['dptoCode']) ){
            $newProduct = new product();
            $newProd_Depto= new product_depto;

            //update product
            $newProduct->setCode($_PUT['code']);
            $newProduct->setStock($_PUT['stock']);
            $newProduct->setName($_PUT['name']);
            $newProduct->setPrice($_PUT['price']);


            //update product_department 
            $newProd_Depto->setCodeProduct($_POST['code']);
            $newProd_Depto->setCodeDpto($_POST['dptoCode']);

            if( $newProduct->update() && $newProd_Depto->update()){
               echo '1';
           }
        }

    }
?>