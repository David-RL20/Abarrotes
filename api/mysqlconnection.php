<?php
	class MySqlConnection
	{
		//get connection
		public static function getConnection()
		{
            //paramaters
            $server = 'localHost';
            $database ='abarrotes';
            $user = 'root';
            $password = '';
            //open connection
            $connection = mysqli_connect($server, $user, $password, $database);
            //error in connection
            if ($connection === false) { 
                echo 'Could not connect to MySql'; 
                die; 
            }
            //character set 
            $connection->set_charset('utf8');
            //return connection object
            return $connection;
            
		}
	}
?>