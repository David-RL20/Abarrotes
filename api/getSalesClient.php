<?php
    header('Access-Control-Allow-Origin:*');
    require_once('mysqlconnection.php');
    require_once('models/exceptions/recordnotfoundexception.php');
    if(isset($_GET['client'])){
               //class methods
        //returns a daily temperatures list of a device
         function getSales() {
            $list = array(); //create list
            $connection = MySqlConnection::getConnection();//get connection
            $query = 'select v.fechaVenta,v.montoTotal,v.numCliente,numVenta from ventas_credito as vc join ventas as v on numVenta = consecutivo and vc.status=0 and  vc.numCliente =?;';//query
            $command = $connection->prepare($query);//prepare statement
            $command->bind_param('s',$_GET['client']);
			$command->execute();//execute
            $command->bind_result($date,$total,$client,$sale);//bind results
            //fetch data
			while ($command->fetch()) {
				array_push($list, json_decode(json_encode(array(
                    'date'=>$date,
                    'total'=>$total,
                    'client'=>$client,
                    'sale'=>$sale
                ))));//add item to list
            }
            mysqli_stmt_close($command); //close command
            $connection->close(); //close connection
            return $list; //return list
        }
         

        echo json_encode(getSales()); 
    }

?>