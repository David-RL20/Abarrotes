<?php
    require_once('mysqlconnection.php');
    require_once('models/exceptions/recordnotfoundexception.php');
    class purcharse {

        //attributes
        private $numDailyBuy ;
        private $date;
        private $total;
        private $supplier;


        //getters and setters
        public function getNumDailyBuy(){ return $this->numDailyBuy;}
        public function setNumDailyBuy($numDailyBuy){ return $this->numDailyBuy = $numDailyBuy;}

        public function getDate(){ return $this->date;}
        public function setDate($date){ return $this->date = $date;}
    
        public function getTotal(){ return $this->total;}
        public function setTotal($total){ return $this->total = $total;}
        
        public function getSupplier(){ return $this->supplier;}
        public function setSupplier($supplier){ return $this->supplier = $supplier;}
        
        //constructor
        public function __construct(){
            // get arguments
            $arguments = func_get_args();
            //0 arguments : creates an empty object
            if(func_num_args() == 0){
                $this->numDailyBuy = '';
                $this->date = '';
                $this->total = '';
                $this->supplier = '';
            }
            if(func_num_args() == 1){
                $connection = MySqlConnection::getConnection();//get connection
                $query = 'select numCompraDia,fechaCompra,montoTotal,numProveedor from compras where numCompraDia = ?';//query
                $command = $connection->prepare($query);//prepare statement
                $command->bind_param('i',$arguments[0]);
                $command->execute();//execute
                $command->bind_result($numDailyBuy,$date,$total,$supplier);//bind results
                //fetch data
                if($command->fetch()) {
                    //pass tha values of the fields to the attributes
                    $this->numDailyBuy = $numDailyBuy;
                    $this->date = $date;
                    $this->total = $total;
                    $this->supplier = $supplier;
                }
                else
                    throw new RecordNotFoundException($arguments[0]);
                mysqli_stmt_close($command); //close command
                $connection->close(); //close connection
            }
            //2 arguments : create object with dara from the argument
            if(func_num_args() == 2){
                $this->numDailyBuy = $arguments[0];
                $this->date = $arguments[1];
            }
            if(func_num_args() == 3){
                $this->numDailyBuy = $arguments[0];
                $this->date = $arguments[1];
                $this->total = $arguments[2];
            }
            if(func_num_args() == 4){
                $this->numDailyBuy = $arguments[0];
                $this->date = $arguments[1];
                $this->total = $arguments[2];
                $this->supplier = $arguments[3];
            }
        }
        //instance method
        public function toJson(){   
            return json_encode(array(
                'number'=> $this->numDailyBuy,
                'date'=> $this->date,
                'total'=> $this->total,
                'supplier'=> $this->supplier
            ));
        }

                //class methods
        //returns a daily temperatures list of a device
        public static function getSell() {
            $list = array(); //create list
            $connection = MySqlConnection::getConnection();//get connection
            $query = "select numCompraDia,fechaCompra,montoTotal,numProveedor from compras;";//query
			$command = $connection->prepare($query);//prepare statement
			$command->execute();//execute
            $command->bind_result($numDailyBuy, $date,$total,$supplier);//bind results
            //fetch data
			while ($command->fetch()) {
				array_push($list, new purcharse ($numDailyBuy, $date,$total,$supplier));//add item to list
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
            $query = 'insert into compras (numCompraDia,montoTotal,numProveedor) values (?,?,?);';//query
            $command = $connection->prepare($query);//prepare statement
            $command->bind_param('idi', $this->numDailyBuy,$this->total,$this->supplier); //bind parameters
            $result = $command->execute();//execute
            mysqli_stmt_close($command); //close command
            $connection->close(); //close connection
            return $result; //return result
        }

        public function delete() {
            $connection = MySqlConnection::getConnection();//get connection
            $query = 'update compras set montoTotal = 0 where numCompraDia = ?;';//query
            $command = $connection->prepare($query);//prepare statement
            $command->bind_param('i', $this->numDailyBuy); //bind parameters
            $result = $command->execute();//execute
            mysqli_stmt_close($command); //close command
            $connection->close(); //close connection
            return $result; //return result
        }

        public function update() {
            $connection = MySqlConnection::getConnection();//get connection
            $query = 'update compras set numCompraDia=?,montoTotal=?,numProveedor=? where numCompraDia=?;';//query
            $command = $connection->prepare($query);//prepare statement
            $command->bind_param('idii',$this->numDailyBuy, $this->total, $this->supplier, $this->numDailyBuy); //bind parameters
            $result = $command->execute();//execute
            mysqli_stmt_close($command); //close command
            $connection->close(); //close connection
            return $result; //return result
        }
    }
    
?>