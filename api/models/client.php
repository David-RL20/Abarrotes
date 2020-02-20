<?php
    require_once('mysqlconnection.php');
    require_once('models/exceptions/recordnotfoundexception.php');

    class client {

        //attributes
        private $number ;
        private $name;
        private $limit;

        //getters and setters
        public function getNumber(){ return $this->number;}
        // public function setNumber($number){ return $this->number = $number;}

        public function getName(){ return $this->name;}
        public function setName($name){ return $this->name = $name;}

        public function getLimit(){ return $this->limit;}
        public function setLimit($limit){ return $this->limit = $limit;}

        //constructor
        public function __construct(){
            // get arguments
            $arguments = func_get_args();
            //0 arguments : creates an empty object
            if(func_num_args() == 0){
                $this->number = '';
                $this->name = '';
                $this->limit = '';
            }
            //2 arguments : create object with dara from the argument
            if(func_num_args() == 1){
                $connection = MySqlConnection::getConnection();//get connection
                $query = 'select * from clientecredito where numCliente = ?';//query
                $command = $connection->prepare($query);//prepare statement
                $command->bind_param('i',$arguments[0]);
                $command->execute();//execute
                $command->bind_result($number, $name , $limit);//bind results
                //fetch data
                if($command->fetch()) {
                    //pass tha values of the fields to the attributes
                    $this->number = $number;
                    $this->name = $name;
                    $this->limit = $limit;
                }
                else
                    throw new RecordNotFoundException($arguments[0]);
                mysqli_stmt_close($command); //close command
                $connection->close(); //close connection
            }
            if(func_num_args() == 2){
                $this->number = $arguments[0];
                $this->name = $arguments[1];
            }
            if(func_num_args() == 3){
                $this->number = $arguments[0];
                $this->name = $arguments[1];
                $this->limit = $arguments[2];
            }
        }
        //instance method
        public function toJson(){   
            return json_encode(array(
                'number'=> $this->number,
                'name'=> $this->name,
                'limit'=> $this->limit
            ));
        }

                //class methods
        //returns a daily temperatures list of a device
        public static function getClients() {
            $list = array(); //create list
            $connection = MySqlConnection::getConnection();//get connection
            $query = 'select * from clientecredito';//query
			$command = $connection->prepare($query);//prepare statement
			$command->execute();//execute
            $command->bind_result($number,$name, $limit);//bind results
            //fetch data
			while ($command->fetch()) {
				array_push($list, new client ($number,$name, $limit));//add item to list
            }
            mysqli_stmt_close($command); //close command
            $connection->close(); //close connection
            return $list; //return list
        }
        //returs a JSON array with all the temperatures 
        public static function getAllToJson() {
            $jsonArray = array(); //create JSON array
            //read items
            foreach(self::getClients() as $item) {
                array_push($jsonArray, json_decode($item->toJson()));
            }
            return json_encode($jsonArray); //return JSON array
        }
        public function add() {
            $connection = MySqlConnection::getConnection();//get connection
            $query = 'insert into clientecredito (nombre , limiteCredito) values (?,?);';//query
            $command = $connecti on->prepare($query);//prepare statement
            $command->bind_param('sd', $this->name,$this->limit); //bind parameters
            $result = $command->execute();//execute
            mysqli_stmt_close($command); //close command
            $connection->close(); //close connection
            return $result; //return result
        }

        public function delete() {
            $connection = MySqlConnection::getConnection();//get connection
            $query = 'update clientecredito set limiteCredito=0 where numCliente = ?';//query
            $command = $connection->prepare($query);//prepare statement
            $command->bind_param('i', $this->number); //bind parameters
            $result = $command->execute();//execute
            mysqli_stmt_close($command); //close command
            $connection->close(); //close connection
            return $result; //return result
        }

        public function update() {
            $connection = MySqlConnection::getConnection();//get connection
            $query = 'update clientecredito set limiteCredito= ? , nombre = ? where numCliente = ?';//query
            $command = $connection->prepare($query);//prepare statement
            $command->bind_param('dsi', $this->limit,$this->name, $this->number); //bind parameters
            $result = $command->execute();//execute
            mysqli_stmt_close($command); //close command
            $connection->close(); //close connection
            return $result; //return result
        }
    }
    
?>