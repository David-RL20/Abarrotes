<?php
    require_once('mysqlconnection.php');
    require_once('models/exceptions/recordnotfoundexception.php');
    class department {

        //attributes
        private $code ;
        private $name;

        //getters and setters
        public function getCode(){ return $this->code;}
        public function setCode($code){ return $this->code = $code;}

        public function getName(){ return $this->name;}
        public function setName($name){ return $this->name = $name;}

        //constructor
        public function __construct(){
            // get arguments
            $arguments = func_get_args();
            //0 arguments : creates an empty object
            if(func_num_args() == 0){
                $this->code = '';
                $this->name = '';
            }
            //2 arguments : create object with dara from the argument
            if(func_num_args() == 1){
                $connection = MySqlConnection::getConnection();//get connection
                $query = 'select * from departamento where codigoDpto = ?';//query
                $command = $connection->prepare($query);//prepare statement
                $command->bind_param('s',$arguments[0]);
                $command->execute();//execute
                $command->bind_result($code, $name );//bind results
                //fetch data
                if($command->fetch()) {
                    //pass tha values of the fields to the attributes
                    $this->code = $code;
                    $this->name = $name;
                }
                else
                    throw new RecordNotFoundException($arguments[0]);
                mysqli_stmt_close($command); //close command
                $connection->close(); //close connection
            }
            if(func_num_args() == 2){
                $this->code = $arguments[0];
                $this->name = $arguments[1];
            }
        }
        //instance method
        public function toJson(){   
            return json_encode(array(
                'code'=> $this->code,
                'name'=> $this->name
            ));
        }

                //class methods
        //returns a daily temperatures list of a device
        public static function getDepartments() {
            $list = array(); //create list
            $connection = MySqlConnection::getConnection();//get connection
            $query = "select * from departamento";//query
			$command = $connection->prepare($query);//prepare statement
			$command->execute();//execute
            $command->bind_result($code,$name);//bind results
            //fetch data
			while ($command->fetch()) {
				array_push($list, new department($code,$name));//add item to list
            }
            mysqli_stmt_close($command); //close command
            $connection->close(); //close connection
            return $list; //return list
        }
        //returs a JSON array with all the temperatures 
        public static function getAllToJson() {
            $jsonArray = array(); //create JSON array
            //read items
            foreach(self::getDepartments() as $item) {
                array_push($jsonArray, json_decode($item->toJson()));
            }
            return json_encode($jsonArray); //return JSON array
        }

        public static function getDepartments_Product($productCode){
            $list = array();
            $connection = MySqlConnection::getConnection();//get connection
            $query = 'call productos_departamentos (?)';//query
            $command = $connection->prepare($query);//prepare statement
            $command->bind_param('s', $productCode);
            $command->execute();//execute
            $command->bind_result($code, $name);//bind results
            //fetch data
            while ($command->fetch()) {
				array_push($list, new department($code,$name));//add item to list
            }
             mysqli_stmt_close($command); //close command
            $connection->close(); //close connection
            return $list;
        }
        //returs a JSON array with all the temperatures 
        public static function getAllToJsonProducts($productCode) {
            $jsonArray = array(); //create JSON array
            //read items
            foreach(self::getDepartments_Product($productCode) as $item) {
                array_push($jsonArray, json_decode($item->toJson()));
            }
            return json_encode($jsonArray); //return JSON array
        }

        public function add() {
            $connection = MySqlConnection::getConnection();//get connection
            $query = 'insert into departamento values (?,?);';//query
            $command = $connection->prepare($query);//prepare statement
            $command->bind_param('ss', $this->code,$this->name); //bind parameters
            $result = $command->execute();//execute
            mysqli_stmt_close($command); //close command
            $connection->close(); //close connection
            return $result; //return result
        }

        public function delete() {
            $connection = MySqlConnection::getConnection();//get connection
            $query = 'update departamento set codigoDpto = null where codigoDpto = ?';//query
            $command = $connection->prepare($query);//prepare statement
            $command->bind_param('s', $this->code); //bind parameters
            $result = $command->execute();//execute
            mysqli_stmt_close($command); //close command
            $connection->close(); //close connection
            return $result; //return result
        }

        public function update() {
            $connection = MySqlConnection::getConnection();//get connection
            $query = 'update departamento set nombre = ? where codigoDpto = ?;';//query
            $command = $connection->prepare($query);//prepare statement
            $command->bind_param('ss',$this->name, $this->code); //bind parameters
            $result = $command->execute();//execute
            mysqli_stmt_close($command); //close command
            $connection->close(); //close connection
            return $result; //return result
        }
    }
    

   
?>
