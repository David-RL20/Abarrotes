<?php
include_once 'session.php';

class Car extends Session{

    function __construct(){
        parent::__construct('car');
    }

    public function load(){
        if($this->getValue() == NULL){
            return [];
        }

        return $this->getValue();
    }

    public function add($code,$quantity){
        if($this->getValue() == NULL){
            $items = [];
        }else{
            $items = json_decode($this->getValue(), 1);

            for($i=0; $i<sizeof($items); $i++){
                if($items[$i]['code'] == $code){
                    $items[$i]['quantity']= $quantity;
                    $this->setValue(json_encode($items));

                    return $this->getValue();
                }
            }
        }

        // operaciones cuando el carrito tiene un nuevo elemento
        $item = ['code' => (int)$code, 'quantity' => $quantity];

        array_push($items, $item);

        $this->setValue(json_encode($items));

        return $this->getValue();
    }

    public function remove($code){
        if($this->getValue() == NULL){
            $items = [];
        }else{
            $items = json_decode($this->getValue(), 1);

            for($i =0; $i< sizeof($items); $i++){

                if($items[$i]['code'] == $code){
                    unset($items[$i]);
                     $items = array_values($items);

                    $this->setValue(json_encode($items));
                    return true;
                }
            }
        }
    }
     
}
?>