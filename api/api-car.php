<?php

include_once 'models/car.php';

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

    foreach($fullItems as $item){
        $URL="";
        $httpRequest = httpPost($URL,"");
        $itemProducto = json_decode($httpRequest, 1);
    }
}
function httpPost($url, $data)
{
    $curl = curl_init($url);
    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($data));
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($curl);
    curl_close($curl);
    return $response;
}
?>