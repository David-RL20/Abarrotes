<?php
    require_once('mysqlconnection.php');
    require_once('models/exceptions/recordnotfoundexception.php');
    class product {

        //attributes
        private $code ;
        private $stock;
        private $name;
        private $price;

        //getters and setters
        public function getCode(){ return $this->code;}
        public function setCode($code){ return $this->code = $code;}

        public function getStock(){ return $this->stock;}
        public function setStock($stock){ return $this->stock = $stock;}

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
                $this->stock = '';
                $this->name = '';
                $this->price = '';
            }
            if(func_num_args() == 1){
                $connection = MySqlConnection::getConnection();//get connection
                $query = 'select * from productos where codigoBarras = ?';//query
                $command = $connection->prepare($query);//prepare statement
                $command->bind_param('s',$arguments[0]);
                $command->execute();//execute
                $command->bind_result($code,$stock,$name,$price);//bind results
                //fetch data
                if($command->fetch()) {
                    //pass tha values of the fields to the attributes
                    $this->code = $code;
                    $this->stock = $stock;
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
                $this->stock = $arguments[1];
            }
            if(func_num_args() == 3){
                $this->code = $arguments[0];
                $this->stock = $arguments[1];
                $this->name = $arguments[2];
            }
            if(func_num_args() == 4){
                $this->code = $arguments[0];
                $this->stock = $arguments[1];
                $this->name = $arguments[2];
                $this->price = $arguments[3];
            }
        }
        //instance method
        public function toJson(){   
            return json_encode(array(
                'code'=> $this->code,
                'stock'=> $this->stock,
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
            $command->bind_result($code,$stock,$name,$price,);//bind results
            //fetch data
			while ($command->fetch()) {
				array_push($list, new product($code,$stock,$name,$price));//add item to list
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
            $query = 'insert into productos values (?,?,?,?);';//query
            $command = $connection->prepare($query);//prepare statement
            $command->bind_param('sisd', $this->code,$this->stock,$this->name,$this->price); //bind parameters
            $result = $command->execute();//execute
            mysqli_stmt_close($command); //close command
            $connection->close(); //close connection
            return $result; //return result
        }

        public function delete() {
            $connection = MySqlConnection::getConnection();//get connection
            $query = 'update productos set stock=0 where codigoBarras = ?; ';//query
            $command = $connection->prepare($query);//prepare statement
            $command->bind_param('s', $this->code); //bind parameters
            $result = $command->execute();//execute
            mysqli_stmt_close($command); //close command
            $connection->close(); //close connection
            return $result; //return result
        }

        public function update() {
            $connection = MySqlConnection::getConnection();//get connection
            $query = 'update productos  set codigoBarras=? , stock=? , nombre=? , precio= ?  where codigoBarras = ?';//query
            $command = $connection->prepare($query);//prepare statement
            $command->bind_param('sisds',$this->code, $this->stock, $this->name, $this->price, $this->code); //bind parameters
            $result = $command->execute();//execute
            mysqli_stmt_close($command); //close command
            $connection->close(); //close connection
            return $result; //return result
        }

    }
    
?>