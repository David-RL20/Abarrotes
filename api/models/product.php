<?php
    require_once('mysqlconnection.php');
    require_once('models/exceptions/recordnotfoundexception.php');
    class product {
        //attributes
        private $code ;
        private $bulkSale;
        private $name;
        private $price;

        //getters and setters
        public function getCode(){ return $this->code;}
        public function setCode($code){ return $this->code = $code;}

        public function getBulkSale(){ return $this->bulkSale;}
        public function setBulkSale($bulkSale){ return $this->bulkSale = $bulkSale;}

        public function getName(){ return $this->name;}
        public function setName($name){ return $this->name = $name;}
        
        public function getPrice(){ return $this->price;}
        public function setPrice($price){ return $this->price = $price;}

        //constructor
        public function __construct(){
            // get arguments
            $arguments = func_get_args();
            //0 arguments : creates an empty object
            if(func_num_args() == 0){
                $this->code = '';
                $this->bulkSale = '';
                $this->name = '';
                $this->price = '';
            }
            if(func_num_args() == 1){
                $connection = MySqlConnection::getConnection();//get connection
                $query = 'select * from productos where codigoBarras = ?';//query
                $command = $connection->prepare($query);//prepare statement
                $command->bind_param('s',$arguments[0]);
                $command->execute();//execute
                $command->bind_result($code,$name,$price,$bulkSale);//bind results
                //fetch data
                if($command->fetch()) {
                    //pass tha values of the fields to the attributes
                    $this->code = $code;
                    $this->bulkSale = $bulkSale;
                    $this->name = $name;
                    $this->price = $price;
                }
                else
                    throw new RecordNotFoundException($arguments[0]);
                mysqli_stmt_close($command); //close command
                $connection->close(); //close connection
            }
             
            //2 arguments : create object with dara from the argument
            if(func_num_args() == 2){
                $this->code = $arguments[0];
                $this->bulkSale = $arguments[1];
            }
            if(func_num_args() == 3){
                $this->code = $arguments[0];
                $this->bulkSale = $arguments[1];
                $this->name = $arguments[2];
            }
            if(func_num_args() == 4){
                $this->code = $arguments[0];
                $this->bulkSale = $arguments[1];
                $this->name = $arguments[2];
                $this->price = $arguments[3];
            }
        }
        //instance method
        public function toJson(){   
            return json_encode(array(
                'code'=> $this->code,
                'bulkSale'=> $this->bulkSale,
                'name'=> $this->name,
                'price'=> $this->price
            ));
        }

                //class methods
        //returns a daily temperatures list of a device
        public static function getProducts() {
            $list = array(); //create list
            $connection = MySqlConnection::getConnection();//get connection
            $query = ' select * from productos order by nombre';//query
			$command = $connection->prepare($query);//prepare statement
			$command->execute();//execute
            $command->bind_result($code,$name,$price,$bulkSale);//bind results
            //fetch data
			while ($command->fetch()) {
				array_push($list, new product($code,$bulkSale,$name,$price));//add item to list
            }
            mysqli_stmt_close($command); //close command
            $connection->close(); //close connection
            return $list; //return list
        }
        //returs a JSON array with all the temperatures 
        public static function getAllToJson() {
            $jsonArray = array(); //create JSON array
            //read items
            foreach(self::getProducts() as $item) {
                array_push($jsonArray, json_decode($item->toJson()));
            }
            return json_encode($jsonArray); //return JSON array
        }


        public function add() {
            $connection = MySqlConnection::getConnection();//get connection
            $query = 'insert into productos (codigoBarras,nombre,precio,ventaGranel)values (?,?,?,?)';//query
            $command = $connection->prepare($query);//prepare statement
            $command->bind_param('ssds', $this->code,$this->name,$this->price,$this->bulkSale); //bind parameters
            $result = $command->execute();//execute
            mysqli_stmt_close($command); //close command
            $connection->close(); //close connection
            return $result; //return result
        }

        public function delete() {
            $connection = MySqlConnection::getConnection();//get connection
            $query = 'delete from productos where codigoBarras = ?;';//query
            $command = $connection->prepare($query);//prepare statement
            $command->bind_param('s', $this->code); //bind parameters
            $result = $command->execute();//execute
            mysqli_stmt_close($command); //close command
            $connection->close(); //close connection
            return $result; //return result
        }

        public function update($newCode) {
            $connection = MySqlConnection::getConnection();//get connection
            $query = 'update productos set codigoBarras = ?,nombre = ? , precio=?,ventaGranel=? where codigoBarras=?;';//query
            $command = $connection->prepare($query);//prepare statement
            $command->bind_param('ssdss',$newCode, $this->name, $this->price,$this->bulkSale,  $this->code); //bind parameters
            $result = $command->execute();//execute
            mysqli_stmt_close($command); //close command
            $connection->close(); //close connection
            return $result; //return result
        }

    }
    
?>