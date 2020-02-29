<?php
    header('Access-Control-Allow-Origin:*');
    session_start();

    class shoppingCart {
        private $quantity;
        private $code;
        private $subtotal;
        private $total;
        public function __construct(){
             // get arguments
             $arguments = func_get_args();

            if(func_num_args() == 0){
                $quantity=0;
                $code='';
                $subtotal='';
                $total='';
            }
            if(func_num_args() == 2){
                $code=$arguments[]0;
                $quantity=$arguments[1];
            }
        }
        public function add(){
             if(!isset($_SESSION['cart']){
                $_SESSION['cart']= NULL;
            }
            $a = new product($id);  
            $_SESSION['cart']['code']= $a->getCode();
        }
    }
    
    // session_start();
    // if($_SERVER['SERVER_REQUEST' == 'GET']){
    //     if(!isset($_SESSION['cart']){
    //         $_SESSION['cart']= NULL;
    //     }
    //     if(isset($_GET['add']) && isset($_GET['codePro']) && isset($_GET['quantity'])){

    //         if($_SESSION['cart'] == null){
    //             //if shopping cart its empty

    //         }else{
    //             //if it has something
    //         }

    //     }

    // }
?>