<?php
    require_once('mysqlconnection.php');
    require_once('models/exceptions/recordnotfoundexception.php');
    class supplier {

        //attributes
        private $number ;
        private $deliveryDay;
        private $orderDay;
        private $name;


        //getters and setters
        public function getNumber(){ return $this->number;}
        public function setNumber($number){ return $this->number = $number;}

        public function getDeliveryDay(){ return $this->deliveryDay;}
        public function setDeliveryDay($deliveryDay){ return $this->deliveryDay = $deliveryDay;}
    
        public function getOrderDay(){ return $this->orderDay;}
        public function setOrderDay($orderDay){ return $this->orderDay = $orderDay;}
        
        public function getName(){ return $this->name;}
        public function setName($name){ return $this->name = $name;}
        //constructor
        public function __construct(){
            // get arguments
            $arguments = func_get_args();
            //0 arguments : creates an empty object
            if(func_num_args() == 0){
                $this->number = '';
                $this->deliveryDay = '';
                $this->orderDay = '';
                $this->name = '';
            }
            if(func_num_args() == 1){
                $connection = MySqlConnection::getConnection();//get connection
                $query = 'select * from proveedores where numProveedor = ?';//query
                $command = $connection->prepare($query);//prepare statement
                $command->bind_param('i',$arguments[0]);
                $command->execute();//execute
                $command->bind_result($number,$deliveryDay,$orderDay,$name);//bind results
                //fetch data
                if($command->fetch()) {
                    //pass tha values of the fields to the attributes
                    $this->number = $number;
                    $this->deliveryDay = $deliveryDay;
                    $this->orderDay = $orderDay;
                    $this->name = $name;
                }
                else
                    throw new RecordNotFoundException($arguments[0]);
                mysqli_stmt_close($command); //close command
                $connection->close(); //close connection
            }
            //2 arguments : create object with dara from the argument
            if(func_num_args() == 2){
                $this->number = $arguments[0];
                $this->deliveryDay = $arguments[1];
            }
            if(func_num_args() == 3){
                $this->number = $arguments[0];
                $this->deliveryDay = $arguments[1];
                $this->orderDay = $arguments[2];
            }
            if(func_num_args() == 4){
                $this->number = $arguments[0];
                $this->deliveryDay = $arguments[1];
                $this->orderDay = $arguments[2];
                $this->name = $arguments[3];
            }
        }
        //instance method
        public function toJson(){   
            return json_encode(array(
                'number'=> $this->number,
                'deliveryDay'=> $this->deliveryDay,
                'orderDay'=> $this->orderDay,
                'name'=> $this->name
            ));
        }

                //class methods
        //returns a daily temperatures list of a device
        public static function getSupplier() {
            $list = array(); //create list
            $connection = MySqlConnection::getConnection();//get connection
            $query = "select * from proveedores";//query
			$command = $connection->prepare($query);//prepare statement
			$command->execute();//execute
            $command->bind_result($number, $deliveryDay,$orderDay,$name);//bind results
            //fetch data
			while ($command->fetch()) {
				array_push($list, new supplier ($number, $deliveryDay,$orderDay,$name));//add item to list
            }
            mysqli_stmt_close($command); //close command
            $connection->close(); //close connection
            return $list; //return list
        }
        //returs a JSON array with all the temperatures 
        public static function getAllToJson() {
            $jsonArray = array(); //create JSON array
            //read items
            foreach(self::getSupplier() as $item) {
                array_push($jsonArray, json_decode($item->toJson()));
            }
            return json_encode($jsonArray); //return JSON array
        }
        
        public function add() {
            $connection = MySqlConnection::getConnection();//get connection
            $query = 'insert into proveedores (diasReparto,diasPedido,nombreEmpresa) values(?,?,?)';//query
            $command = $connection->prepare($query);//prepare statement
            $command->bind_param('sss', $this->deliveryDay,$this->orderDay,$this->name); //bind parameters
            $result = $command->execute();//execute
            mysqli_stmt_close($command); //close command
            $connection->close(); //close connection
            return $result; //return result
        }

        public function delete() {
            $connection = MySqlConnection::getConnection();//get connection
            $query = 'delete from proveedores where numProveedor=?';//query
            $command = $connection->prepare($query);//prepare statement
            $command->bind_param('i', $this->number); //bind parameters
            $result = $command->execute();//execute
            mysqli_stmt_close($command); //close command
            $connection->close(); //close connection
            return $result; //return result
        }

        public function update() {
            $connection = MySqlConnection::getConnection();//get connection
            $query = 'update proveedores set diasReparto =? ,diasPedido =?  , nombreEmpresa =? where numProveedor=?';//query
            $command = $connection->prepare($query);//prepare statement
            $command->bind_param('sssi', $this->deliveryDay , $this->orderDay, $this->name, $this->number); //bind parameters
            $result = $command->execute();//execute
            mysqli_stmt_close($command); //close command
            $connection->close(); //close connection
            return $result; //return result
        }
        
        
    }
    
?>