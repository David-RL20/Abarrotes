<?php
    require_once('mysqlconnection.php');
    require_once('models/exceptions/recordnotfoundexception.php');
    class sale {

        //attributes
        private $id ;
        private $date;
        private $total;
        private $client;
        private $type;


        //getters and setters
        public function getId(){ return $this->id;}
        //set the last id plus 1 to the sale
        public function setId(){ 
            $connection = MySqlConnection::getConnection();//get connection
            $query = 'select count(*) from ventas;';//query
            $command = $connection->prepare($query);//prepare statement
            $command->execute();//execute
            $command->bind_result($id);//bind results
            //fetch data
            if($command->fetch()) {
                //pass tha values of the fields to the attributes
                $this->id = $id+1;
            }
            else
                throw new RecordNotFoundException($arguments[0]);
            mysqli_stmt_close($command); //close command
            $connection->close(); //close connection
        }

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
                $this->id = '';
                $this->date = '';
                $this->total = '';
                $this->client = '';
                $this->type = '';
            }
            if(func_num_args() == 1){
                $connection = MySqlConnection::getConnection();//get connection
                $query = 'select consecutivo , fechaVenta , montoTotal,numCliente from ventas where consecutivo = ?';//query
                $command = $connection->prepare($query);//prepare statement
                $command->bind_param('i',$arguments[0]);
                $command->execute();//execute
                $command->bind_result($id,$date,$total,$client);//bind results
                //fetch data
                if($command->fetch()) {
                    //pass tha values of the fields to the attributes
                    $this->id = $id;
                    $this->date = $date;
                    $this->total = $total;
                    $this->client = $client; 
                }
                else
                    throw new RecordNotFoundException($arguments[0]);
                mysqli_stmt_close($command); //close command
                $connection->close(); //close connection
            }
            //2 arguments : create object with dara from the argument
            if(func_num_args() == 2){
                $this->id = $arguments[0];
                $this->date = $arguments[1];
            }
            if(func_num_args() == 3){
                $this->id = $arguments[0];
                $this->date = $arguments[1];
                $this->total = $arguments[2];
            }
            if(func_num_args() == 4){
                $this->id = $arguments[0];
                $this->date = $arguments[1];
                $this->total = $arguments[2];
                $this->client = $arguments[3];
            }
             
        }
        //instance method
        public function toJson(){   
            return json_encode(array(
                'id'=> $this->id,
                'date'=> $this->date,
                'total'=> $this->total,
                'client'=> $this->client
            ));
        }

                //class methods
        //returns a daily temperatures list of a device
        public static function getSell() {
            $list = array(); //create list
            $connection = MySqlConnection::getConnection();//get connection
            $query = " select consecutivo,fechaVenta,montoTotal,numCliente from ventas order by fechaVenta desc";//query
			$command = $connection->prepare($query);//prepare statement
			$command->execute();//execute
            $command->bind_result($id, $date,$total,$client);//bind results
            //fetch data
			while ($command->fetch()) {
				array_push($list, new sale ($id, $date,$total,$client));//add item to list
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
            $query = 'insert into ventas (consecutivo , montoTotal , numCliente ) values (?,?,?);';//query
            $command = $connection->prepare($query);//prepare statement
            $command->bind_param('idi', $this->id,$this->total,$this->client); //bind parameters
            $result = $command->execute();//execute
            mysqli_stmt_close($command); //close command
            $connection->close(); //close connection
            return $result; //return result
        }

        public function delete() {
            $connection = MySqlConnection::getConnection();//get connection
            $query = 'update ventas set montoTotal=0 where consecutivo= ?';//query
            $command = $connection->prepare($query);//prepare statement
            $command->bind_param('i', $this->id); //bind parameters
            $result = $command->execute();//execute
            mysqli_stmt_close($command); //close command
            $connection->close(); //close connection
            return $result; //return result
        }

        // public function update() {
        //     $connection = MySqlConnection::getConnection();//get connection
        //     $query = 'update ventas set  numVentaDia=?,montoTotal= ? , numCliente= ? where consecutivo= ?;';//query
        //     $command = $connection->prepare($query);//prepare statement
        //     $command->bind_param('idii',$this->id, $this->total, $this->client ,$this->id); //bind parameters
        //     $result = $command->execute();//execute
        //     mysqli_stmt_close($command); //close command
        //     $connection->close(); //close connection
        //     return $result; //return result
        // }
    
    }
    
?>