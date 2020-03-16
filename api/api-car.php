<?php

include_once 'models/car.php';
include_once 'models/sale.php';
include_once 'models/products_sell.php';

if(isset($_GET['action'])){
    $action = $_GET['action'];
    $car = new Car();

    switch($action){ // show, add, remove
        case 'show':
        show($car);
        break;

        case 'add':
        add($car);
        break;

        case 'remove':
        remove($car);
        break;
        case 'done':
            done($car); 
        break;

        default:
    }
}else{
    echo json_encode(['statuscode' => 404,
                        'response' => 'No se puede procesar la solicitud']);
}

function show($car){
    //cargar arreglo en la sesion
    // consultar DB para actualizar valores de los productos
    if(!empty($car->load())){
        $itemsCar = json_decode($car->load(), 1);
        $fullItems = [];
        $total = 0;
        $totalItems = 0;
    
        foreach($itemsCar as $itemCar){
            $httpRequest = file_get_contents('http://localhost/Abarrotes/api/AllProducts.php?code=' . $itemCar['code']);
            $itemProducto = json_decode($httpRequest, 1);
            $itemProducto['quantity'] = $itemCar['quantity'];
            $itemProducto['subtotal'] = $itemProducto['quantity'] * $itemProducto['price'];
    
            $total += $itemProducto['subtotal'];
            $totalItems += $itemProducto['quantity'];
    
            array_push($fullItems, $itemProducto);
        }
        $resArray = array('info' => ['count' => $totalItems, 'total' => $total], 'items' =>$fullItems);
    
        echo json_encode($resArray);
    }else{
        echo json_encode(array('info' => ['count' => 0, 'total' => 0]));
    }
}

function add($car){
    if(isset($_GET['code']) && isset($_GET['quantity'])){
        $res = $car->add($_GET['code'],$_GET['quantity']);
        echo $res;
    }else{
        // error
        echo json_encode(['statuscode' => 404,
                        'response' => 'No se puede procesar la solicitud, id vacio']);
    }
}

function remove($car){
    if(isset($_GET['code'])){
        $res = $car->remove($_GET['code']);
        if($res){
            echo json_encode(['statuscode' => 200]);
        }else{
            echo json_encode(['statuscode' => 400]); 
        }
    }else{
        // error
        echo json_encode(['statuscode' => 404,
                        'response' => 'No se puede procesar la solicitud, id vacio']);
    }
}
function done($car){
    try{
        
        $itemsCar = json_decode($car->load(), 1);
        $fullItems = [];
        $total = 0;
        $totalItems = 0;
        $idClient=1;
        $type= 'efectivo';
        if(isset($_GET['client'])){
            $idClient = $_GET['client'];
        }
        if(isset($_GET['type'])){
            $type = $_GET['type'];
        }
        foreach($itemsCar as $itemCar){
            $httpRequest = file_get_contents('http://localhost/Abarrotes/api/AllProducts.php?code=' . $itemCar['code']);
            $itemProducto = json_decode($httpRequest, 1);
            $itemProducto['quantity'] = $itemCar['quantity'];
            $itemProducto['subtotal'] = $itemProducto['quantity'] * $itemProducto['price'];
    
            $total += $itemProducto['subtotal'];
            $totalItems += $itemProducto['quantity'];
    
            array_push($fullItems, $itemProducto);
        }

        

        if(!empty($fullItems) && $fullItems !== null ){
            $newSale = new sale();
            $newSale->setNumDailySell(); 
            $newSale->setTotal($total); 
            $newSale->setClient($idClient); 
            $newSale->setType($type); 
            $idSell = $newSale->getNumDailySell();
             if($newSale->add()){
                foreach($fullItems as $item){
                    $quantity =$item['quantity'];
                    $subTotal = $item['subtotal'];
                    $productCode = $item['code'];
                    $product_sell = new Product_Sell($idSell,$productCode,$quantity,$subTotal);
                    if($product_sell->add()){
                        $car->remove($item['code']);
                    }
                }
                echo json_encode(array(
                    'statusCode'=>200,
                    'messsage'=>'Operations executed successfully'
                ));
            }else {
                echo json_encode(array(
                    'statusCode'=>404,
                    'messsage'=>'Error at Add'
                ));
            }
            

        }else {
            echo json_encode(array(
                'statusCode'=>404,
                'messsage'=>'No items storage'
            ));
        }
        
        
    }
    catch(exception $e){
        # code
        echo json_encode(array(
            'statusCode'=>404,
            'messsage'=>'Error'. $e
        ));
    }
}

