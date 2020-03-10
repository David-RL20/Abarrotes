<?php
    require_once('mysqlconnection.php');
    require_once('models/exceptions/recordnotfoundexception.php');
    class Sell_Credit {

        //attributes
        private $codeProduct ;
        private $codeDpto;

        //getters and setters
        public function getCodeProduct(){ return $this->codeProduct;}
        public function setCodeProduct($codeProduct){ return $this->codeProduct = $codeProduct;}

        public function getCodeDpto(){ return $this->codeDpto;}
        public function setCodeDpto($codeDpto){ return $this->codeDpto = $codeDpto;}

        //constructor
        public function __construct(){
            // get arguments
            $arguments = func_get_args();
             
            //2 arguments : create object with dara from the argument
            if(func_num_args() == 2){
                $this->codeProduct = $arguments[0];
                $this->codeDpto = $arguments[1];
            }
        }
        //instance method
        public function toJson(){   
            return json_encode(array(
                'codeProduct'=> $this->codeProduct,
                'codeDepto'=> $this->codeDpto
            ));
        }

                //class methods
        public function add() {
            $connection = MySqlConnection::getConnection();//get connection
            $query = 'insert into productos_departamento values (?,?);';//query
            $command = $connection->prepare($query);//prepare statement
            $command->bind_param('ss', $this->codeProduct,$this->codeDpto); //bind parameters
            $result = $command->execute();//execute
            mysqli_stmt_close($command); //close command
            $connection->close(); //close connection
            return $result; //return result
        }

        public function delete() {
            $connection = MySqlConnection::getConnection();//get connection
            $query = 'insert into productos_departamento values (?,?); ';//query
            $command = $connection->prepare($query);//prepare statement
            $command->bind_param('s', $this->codeProduct); //bind parameters
            $result = $command->execute();//execute
            mysqli_stmt_close($command); //close command
            $connection->close(); //close connection
            return $result; //return result
        }

        public function update() {
            $connection = MySqlConnection::getConnection();//get connection
            $query = 'update productos  set codigoBarras=? , stock=? , nombre=? , precio= ?  where codigoBarras = ?';//query
            $command = $connection->prepare($query);//prepare statement
            $command->bind_param('ss',$this->codeProduct, $this->codeDpto); //bind parameters
            $result = $command->execute();//execute
            mysqli_stmt_close($command); //close command
            $connection->close(); //close connection
            return $result; //return result
        }
    }
    
?>