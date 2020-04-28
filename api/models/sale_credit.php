<?php
    require_once('mysqlconnection.php');
    require_once('models/exceptions/recordnotfoundexception.php');
    class Sell_Credit {

        //attributes
        private $client ;
        private $total;
        private $sale;
        private $status;

        //getters and setters
        public function getClient(){ return $this->client;}
        public function setClient($client){ return $this->client = $client;}

        public function getTotal(){ return $this->total;}
        public function setTotal($total){ return $this->total = $total;}

        public function getSale(){ return $this->sale;}
        public function setSale($sale){ return $this->sale = $sale;}

        public function getStatus(){ return $this->status;}
        public function setStatus($status){ return $this->status = $status;}

        //constructor
        public function __construct(){
            // get arguments
            $arguments = func_get_args();
            if(func_num_args() == 1){
                $this->client = $arguments[0]; 
            }
             
            //2 arguments : create object with dara from the argument
            if(func_num_args() == 4){
                $this->client = $arguments[0];
                $this->total = $arguments[1];
                $this->sale = $arguments[2];
                $this->status = $arguments[3];
            }
        }
        //instance method
        public function toJson(){   
            return json_encode(array(
                'client'=> $this->client,
                'total'=> $this->total,
                'sale'=> $this->sale,
                'status'=> $this->status
            ));
        }

                //class methods
        public function add() {
            $connection = MySqlConnection::getConnection();//get connection
            $query = 'insert into ventas_credito (total,numCliente,numVenta) values(?,?,?);';//query
            $command = $connection->prepare($query);//prepare statement
            $command->bind_param('sss', $this->total,$this->client,$this->sale); //bind parameters
            $result = $command->execute();//execute
            mysqli_stmt_close($command); //close command
            $connection->close(); //close connection
            return $result; //return result
        }

        public function delete() {
            $connection = MySqlConnection::getConnection();//get connection
            $query = 'update ventas_credito set status=1 where numCliente =?';//query
            $command = $connection->prepare($query);//prepare statement
            $command->bind_param('s', $this->client); //bind parameters
            $result = $command->execute();//execute
            mysqli_stmt_close($command); //close command
            $connection->close(); //close connection
            return $result; //return result
        }

                //class methods
        //returns a daily temperatures list of a device
        public static function getSalesCredit($client) {
            $list = array(); //create list
            $connection = MySqlConnection::getConnection();//get connection
            $query = 'select * from ventas_credito where numCliente =? and status=0';//query
            $command = $connection->prepare($query);//prepare statement
            $command->bind_param('s',$client); //bind parameters
			$command->execute();//execute
            $command->bind_result($total,$client,$sale,$status);//bind results
            //fetch data
			while ($command->fetch()) {
				array_push($list, new Sell_Credit($client,$total,$sale,$status));//add item to list
            }
            mysqli_stmt_close($command); //close command
            $connection->close(); //close connection
            return $list; //return list
        }
        //returs a JSON array with all the temperatures 
        public static function getAllToJson($client) {
            $jsonArray = array(); //create JSON array
            //read items
            foreach(self::getSalesCredit($client) as $item) {
                array_push($jsonArray, json_decode($item->toJson()));
            }
            return json_encode($jsonArray); //return JSON array
        }
    }
    
?>