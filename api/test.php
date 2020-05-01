<?php
    header('Access-Control-Allow-Origin:*');  
    require_once('models/stats.php');
    $stats = new Stat();

    if(isset($_GET['lapse'])){
      $action = $_GET['lapse'];
      
      switch ($action) {
        case 'day':
          getDay($stats);
          break;
        case 'month':
        break;
        
        default:
          # code...
          break;
      }
    }
    function getDay($stats){
      //only if is set
      if(isset($_GET['date'])){
        $date = $_GET['date'];
        $stats->getDayTotal($date);
        echo $stats->toJson();
      }else{
        echo json_encode(array(
          "message"=>"No date set",
          "status"=>400
        ));
      }
    }

    function getMonth($stats){
       
    }
    

?>