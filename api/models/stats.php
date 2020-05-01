<?php
    require_once('mysqlconnection.php');
    require_once('models/exceptions/recordnotfoundexception.php');
    class Stat {

      //attributes
      private $total ; 
      //constructor
      public function __construct(){
          // get arguments
          $arguments = func_get_args();
          //0 arguments : creates an empty object
          if(func_num_args() == 0){
            $this->total = ''; 
          }  
      }
      //instance method
      public function toJson(){   
        return json_encode(array(
            'total'=> $this->total
        ));
      }
      public function getDayTotal($date){
        $connection = MySqlConnection::getConnection();//get connection
        $query = 'select sum(montoTotal) from ventas where fechaVenta like "%'.$date.'%";';//query
        $command = $connection->prepare($query);//prepare statement 
        $command->execute();//execute
        $command->bind_result($total);//bind results
        //fetch data
        if($command->fetch()) {
            //pass tha values of the fields to the attributes 
            $this->total = $total; 
        }
        else
            throw new RecordNotFoundException($date);
        mysqli_stmt_close($command); //close command
        $connection->close(); //close connection
      }
      public function getWeekTotal($week){
        $connection = MySqlConnection::getConnection();//get connection
        $query = '';//query
        $command = $connection->prepare($query);//prepare statement 
        $command->execute();//execute
        $command->bind_result($total);//bind results
        //fetch data
        if($command->fetch()) {
          //pass tha values of the fields to the attributes 
          $this->total = $total; 
        }
        else
            throw new RecordNotFoundException($week);
        mysqli_stmt_close($command); //close command
        $connection->close(); //close connection
      }
      public function getMonthTotal($month){
        $connection = MySqlConnection::getConnection();//get connection
        $query = '';//query
        $command = $connection->prepare($query);//prepare statement 
        $command->execute();//execute
        $command->bind_result($total);//bind results
        //fetch data
        if($command->fetch()) {
          //pass tha values of the fields to the attributes 
          $this->total = $total; 
        }
        else
            throw new RecordNotFoundException($month);
        mysqli_stmt_close($command); //close command
        $connection->close(); //close connection
      }
      public function getYearTotal($year){
        $connection = MySqlConnection::getConnection();//get connection
        $query = '';//query
        $command = $connection->prepare($query);//prepare statement 
        $command->execute();//execute
        $command->bind_result($total);//bind results
        //fetch data
        if($command->fetch()) {
          //pass tha values of the fields to the attributes 
          $this->total = $total; 
        }
        else
            throw new RecordNotFoundException($year);
        mysqli_stmt_close($command); //close command
        $connection->close(); //close connection
      }

    
    }
    
?>