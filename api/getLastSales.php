<?php
    header('Access-Control-Allow-Origin:*');
    require_once('mysqlconnection.php');
    require_once('models/exceptions/recordnotfoundexception.php');
    require_once('models/sale.php');

    function getLastSales(){
      $list = array(); //create list
      $connection = MySqlConnection::getConnection();//get connection
      $query = "select consecutivo,fechaVenta,montoTotal,numCliente from ventas where consecutivo >= ((select count(*) from ventas) - 20) and consecutivo <= (select count(*) from ventas) order by fechaVenta desc;";//query
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

    
   function getAllToJson() {
      $jsonArray = array(); //create JSON array
      //read items
      foreach(getLastSales() as $item) {
          array_push($jsonArray, json_decode($item->toJson()));
      }
      return json_encode($jsonArray); //return JSON array
    }


    echo getAllToJson();

?>