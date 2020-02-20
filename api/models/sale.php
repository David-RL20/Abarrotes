<?php
    require_once('mysqlconnection.php');
    require_once('models/exceptions/recordnotfoundexception.php');
    class sale {

        //attributes
        private $numDailySell ;
        private $date;
        private $total;
        private $client;
        private $type;


        //getters and setters
        public function getNumDailySell(){ return $this->numDailySell;}
        public function setNumDailySell($numDailySell){ return $this->numDailySell = $numDailySell;}

        public function getDate(){ return $this->date;}
        public function setDate($date){ return $this->date = $date;}
    
        public function getTotal(){ return $this->total;}
        public function setTotal($total){ return $this->total = $total;}
        
        public function getClient(){ return $this->client;}
        public function setClient($client){ return $this->client = $client;}

        public function getType(){ return $this->type;}
        public function setType($type){ return $this->type = $type;}
        //constructor
        public function __construct(){
            // get arguments
            $arguments = func_get_args();
            //0 arguments : creates an empty object
            if(func_num_args() == 0){
                $this->numDailySell = '';
                $this->date = '';
                $this->total = '';
                $this->client = '';
                $this->type = '';
            }
            if(func_num_args() == 1){
                $connection = MySqlConnection::getConnection();//get connection
                $query = 'select numVentaDia , fechaVenta , montoTotal,numCliente, tipoVenta from ventas where numVentaDia = ?';//query
                $command = $connection->prepare($query);//prepare statement
                $command->bind_param('i',$arguments[0]);
                $command->execute();//execute
                $command->bind_result($numDailySell,$date,$total,$client, $type);//bind results
                //fetch data
                if($command->fetch()) {
                    //pass tha values of the fields to the attributes
                    $this->numDailySell = $numDailySell;
                    $this->date = $date;
                    $this->total = $total;
                    $this->client = $client;
                    $this->type = $type;
                }
                else
                    throw new RecordNotFoundException($arguments[0]);
                mysqli_stmt_close($command); //close command
                $connection->close(); //close connection
            }
            //2 arguments : create object with dara from the argument
            if(func_num_args() == 2){
                $this->numDailySell = $arguments[0];
                $this->date = $arguments[1];
            }
            if(func_num_args() == 3){
                $this->numDailySell = $arguments[0];
                $this->date = $arguments[1];
                $this->total = $arguments[2];
            }
            if(func_num_args() == 4){
                $this->numDailySell = $arguments[0];
                $this->date = $arguments[1];
                $this->total = $arguments[2];
                $this->client = $arguments[3];
            }
            if(func_num_args() == 5){
                $this->numDailySell = $arguments[0];
                $this->date = $arguments[1];
                $this->total = $arguments[2];
                $this->client = $arguments[3];
                $this->type = $arguments[4];
            }
        }
        //instance method
        public function toJson(){   
            return json_encode(array(
                'number'=> $this->numDailySell,
                'date'=> $this->date,
                'total'=> $this->total,
                'client'=> $this->client,
                'type'=> $this->type 
            ));
        }

                //class methods
        //returns a daily temperatures list of a device
        public static function getSell() {
            $list = array(); //create list
            $connection = MySqlConnection::getConnection();//get connection
            $query = "select numVentaDia , fechaVenta , montoTotal,numCliente, tipoVenta from ventas";//query
			$command = $connection->prepare($query);//prepare statement
			$command->execute();//execute
            $command->bind_result($numDailySell, $date,$total,$client,$type);//bind results
            //fetch data
			while ($command->fetch()) {
				array_push($list, new sale ($numDailySell, $date,$total,$client,$type));//add item to list
            }
            mysqli_stmt_close($command); //close command
            $connection->close(); //close connection
            return $list; //return list
        }
        //returs a JSON array with all the temperatures 
        public static function getAllToJson() {
            $jsonArray = array(); //create JSON array
            //read items
            foreach(self::getSell() as $item) {
                array_push($jsonArray, json_decode($item->toJson()));
            }
            return json_encode($jsonArray); //return JSON array
        }
        public function add() {
            $connection = MySqlConnection::getConnection();//get connection
            $query = 'insert into ventas (numVentaDia , montoTotal , numCliente ,tipoVenta) values (?,?,?, ?)';//query
            $command = $connection->prepare($query);//prepare statement
            $command->bind_param('idis', $this->numDailySell,$this->total,$this->client,$this->type); //bind parameters
            $result = $command->execute();//execute
            mysqli_stmt_close($command); //close command
            $connection->close(); //close connection
            return $result; //return result
        }

        public function delete() {
            $connection = MySqlConnection::getConnection();//get connection
            $query = 'update ventas set montoTotal=0 where consecutivo= ?';//query
            $command = $connection->prepare($query);//prepare statement
            $command->bind_param('i', $this->numDailySell); //bind parameters
            $result = $command->execute();//execute
            mysqli_stmt_close($command); //close command
            $connection->close(); //close connection
            return $result; //return result
        }

        public function update() {
            $connection = MySqlConnection::getConnection();//get connection
            $query = 'update ventas set  numVentaDia=?,montoTotal= ? , numCliente= ?, tipoVenta=? where consecutivo= ?;';//query
            $command = $connection->prepare($query);//prepare statement
            $command->bind_param('idisi',$this->numDailySell, $this->total, $this->client, $this->type,$this->numDailySell); //bind parameters
            $result = $command->execute();//execute
            mysqli_stmt_close($command); //close command
            $connection->close(); //close connection
            return $result; //return result
        }
    }
    
?>