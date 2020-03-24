<?php
    header('Access-Control-Allow-Origin:*');
    require_once('models/product.php');
    require_once('models/department.php');
    require_once('models/product_department.php');
    
    
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
                    'name'=>$product->name,
                    'price'=>$product->price,
                    'bulk'=>$product->bulkSale,
                    'department'=> $department
                    
                ));
            }
            echo json_encode($finalArray);
        }
    }
    if($_SERVER['REQUEST_METHOD']== 'POST'){
        if(isset($_POST['action'])){
        switch ($_POST['action']) {
            case 'post':
                # post a product
                if(isset($_POST['code']) && isset($_POST['bulk']) && isset($_POST['name']) && isset($_POST['price'])&& isset($_POST['dptoCode'])){
                    $newProduct = new product();
                    $newProd_Depto = new product_depto();
                    
                    //productos_departamento
                    $newProd_Depto->setCodeProduct($_POST['code']);
                    $newProd_Depto->setCodeDpto($_POST['dptoCode']);
        
                    //product
                    $newProduct->setCode($_POST['code']);
                    $newProduct->setName($_POST['name']);
                    $newProduct->setBulkSale($_POST['bulk']);
                    $newProduct->setPrice($_POST['price']);
        
                   if( $newProduct->add() && $newProd_Depto->add()){
                       echo '1';
                   }else{
                       echo 'No se pudo agregar';
                   }
        
                }else{
                    echo 'variables insuficientes';
                }
                break;
            case 'update':
                if(isset($_POST['code']) && isset($_POST['bulk']) && isset($_POST['name']) && isset($_POST['price'])&& isset($_POST['dptoCode']) ){
                    $newProduct = new product($_POST['code']);
                    $newProd_Depto= new product_depto();
        
                    //update product 
                    $newProduct->setBulkSale($_POST['bulk']);
                    $newProduct->setName($_POST['name']);
                    $newProduct->setPrice($_POST['price']);
        
        
                    //update product_department 
                    $newProd_Depto->setCodeProduct($_POST['code']);
                    $newProd_Depto->setCodeDpto($_POST['dptoCode']);
        
                    if( $newProduct->update() && $newProd_Depto->update()){
                        echo '1';
                    }else{
                        echo 'Error al editar este producto';
                    }
                }else{
                    echo 'Variables insuficientes para editar';
                }
                break;
            case 'delete':
                if(isset($_POST['code'])){
                    $product = new product($_POST['code']);
                    $product_dep  = new product_depto();
                    $product_dep->setCodeProduct($_POST['code']);
                    $product_dep->delete();
                    if($product->delete()){
                        echo  '1'; 
                    }else{
                        echo 'Error al eliminar este producto';
                    }

                }else{
                    echo 'variables insuficientes para eliminar';
                }
                break;
                default:
                # 
                 echo 'Accion erronea';
                break;    
        }
        
    }
}
     
?>