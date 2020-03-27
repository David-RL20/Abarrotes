<?php
    require_once('mysqlconnection.php');
    require_once('exceptions/recordnotfoundexception.php');
    class Product_Sell {

        //attributes
        private $sale ;
        private $codeProduct;
        private $quantity;
        private $subTotal; 

        //getters and setters
        public function getCodeProduct(){ return $this->codeProduct;}
        public function setCodeProduct($codeProduct){ return $this->codeProduct = $codeProduct;}

        public function getSale(){ return $this->sale;}
        public function setSale($sale){ return $this->sale = $sale;}
        
        public function getQuantity(){ return $this->quantity;}
        public function setQuantity($quantity){ return $this->quantity = $quantity;}

        public function getSubTotal(){ return $this->subTotal;}
        public function setSubTotal($subTotal){ return $this->subTotal = $subTotal;}

        //constructor
        public function __construct(){
            // get arguments
            $arguments = func_get_args();
             
            //0 arguments : create an empty object 
            if(func_num_args() == 1){
                $this->sale= $arguments[0]; 
            }
            if(func_num_args() == 0){
                $this->sale = "";
                $this->codeProduct ="";
                $this->quantity = "";
                $this->subTotal = "";
            }
            //4 arguments : create object with data from the argument
            if(func_num_args() == 4){
                $this->sale = $arguments[0];
                $this->codeProduct = $arguments[1];
                $this->quantity = $arguments[2];
                $this->subTotal = $arguments[3];
            }
        }
        //instance method
        public function toJson(){   
            return json_encode(array(
                'sale'=> $this->sale,
                'codeProduct'=> $this->codeProduct,
                'quantity'=> $this->quantity,
                'subTotal'=> $this->subTotal
            ));
        }

                //class methods
        public function add() {
            $connection = MySqlConnection::getConnection();//get connection
            $query = 'insert into productos_ventas(consecutivoVenta,codigoProducto,subtotal,cantidad) values(?,?,?,?);';//query
            $command = $connection->prepare($query);//prepare statement
            $command->bind_param('isdd', $this->sale,$this->codeProduct,$this->subTotal,$this->quantity); //bind parameters
            $result = $command->execute();//execute
            mysqli_stmt_close($command); //close command
            $connection->close(); //close connection
            return $result; //return result
        }

        public function delete() {
            $connection = MySqlConnection::getConnection();//get connection
            $query = 'update productos_ventas set subtotal = 0 where consecutivoVenta=?; ';//query
            $command = $connection->prepare($query);//prepare statement
            $command->bind_param('i', $this->sale); //bind parameters
            $result = $command->execute();//execute
            mysqli_stmt_close($command); //close command
            $connection->close(); //close connection
            return $result; //return result
        }

        public function update() {
            $connection = MySqlConnection::getConnection();//get connection
            $query = 'update productos_ventas set codigoProducto=?,monto = ?, cantidad = ? where consecutivoVenta=?;';//query
            $command = $connection->prepare($query);//prepare statement
            $command->bind_param('ss',$this->codeProduct, $this->subTotal,$this->quantity,$this->sale); //bind parameters
            $result = $command->execute();//execute
            mysqli_stmt_close($command); //close command
            $connection->close(); //close connection
            return $result; //return result
        }
        public static function getProductSale($sale) {
            $list = array(); //create list
            $connection = MySqlConnection::getConnection();//get connection
            $query = 'select * from productos_ventas where consecutivoVenta =?';//query
            $command = $connection->prepare($query);//prepare statement
            $command->bind_param('s',$sale); //bind parameters
			$command->execute();//execute
            $command->bind_result($sale,$codeProduct,$subTotal,$quantity);//bind results
            //fetch data
			while ($command->fetch()) {
				array_push($list, new Product_Sell($sale,$codeProduct,$quantity,$subTotal));//add item to list
            }
            mysqli_stmt_close($command); //close command
            $connection->close(); //close connection
            return $list; //return list
        }
        //returs a JSON array with all the temperatures 
        public static function getAllToJson($sale) {
            $jsonArray = array(); //create JSON array
            //read items
            foreach(self::getProductSale($sale) as $item) {
                array_push($jsonArray, json_decode($item->toJson()));
            }
            return json_encode($jsonArray); //return JSON array
        }
    }
    
?>