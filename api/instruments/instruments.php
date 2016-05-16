<?php
	require('../config.php'); 
	require('../common.php'); 
	
	$general_result = true;
	$result_message = "";
	$result_error;
		
	if( $_SERVER['REQUEST_METHOD'] == 'GET') {
		
		// выбираем базу данных
		$db->select_db("smeta_simple");		
		
		$query="SELECT * FROM tbl_instrument";
		$result =do_query($query);
			
		$arr = array();
		if($result->num_rows > 0) {
			while($row = $result->fetch_assoc()) {
			$arr[] = $row;
			}
		} else {
			$arr[0] = "There no instruments";
		}			
		
		end_result(true);
		$arr = make_answer($arr, true);		
		$db->close(); 
		
		# JSON-encode the response
		echo $json_response = json_encode($arr);
	}
	
	if( $_SERVER['REQUEST_METHOD'] == 'POST') {
		
		// выбираем базу данных
		$db->select_db("smeta_simple");
		
		$params = trim(file_get_contents('php://input'));
		$ar=json_decode($params);
		$ar = (array)$ar;	
		
		$name = clean($ar["name"]);
		$characteristics = clean($ar["characteristics"]);
		$price_usd = 0+$ar["price-usd"];
		$price_usd = clean($price_usd);
		$life_time = 0+$ar["life-time"];
		$life_time = clean($life_time);
		$keywords = clean($ar["keywords"]);
		
		$query="INSERT INTO `tbl_instrument`(`name`, `characteristics`, `price-usd`, `life-time`, `keywords`) VALUES ('$name', '$characteristics', '$price_usd', '$life_time', '$keywords')";
		$result = do_query($query);
		
		$arr = array();
		$arr["id"] = $db->insert_id;
		end_result(false);		
		$arr = make_answer($arr, false);
		echo $json_response = json_encode($arr);		
		
		$db->close();	
	}
	
	if( $_SERVER['REQUEST_METHOD'] == 'PUT') {
		header('Content-type: application/json; charset=utf-8');	
		$params = trim(file_get_contents('php://input'));
				
		$ar=json_decode($params);
		$ar = (array)$ar;	
		$id = clean((int) $ar["id"]);
		$name = clean($ar["name"]);
		$characteristics = clean($ar["characteristics"]);
		$price_usd = 0+$ar["price-usd"];
		$price_usd = clean($price_usd);
		$life_time = 0+$ar["life-time"];
		$life_time = clean($life_time);
		$keywords = clean($ar["keywords"]);
				
		// выбираем базу данных
		$db->select_db("smeta_simple");
		
		$query="UPDATE `tbl_instrument` SET `name` = '$name', `characteristics` = '$characteristics', `price-usd` = '$price_usd', `life-time` = '$life_time', `keywords` = '$keywords' WHERE `id` = '$id'";		
		$result = do_query($query);
		
		end_result(false);
		$arr = array();
		$arr = make_answer($arr, false);
		echo $json_response = json_encode($arr);		
		
		$db->close();
	}
	
	if( $_SERVER['REQUEST_METHOD'] == 'DELETE') {	
		
		header('Content-type: application/json; charset=utf-8');	
		$params = trim(file_get_contents('php://input'));
		$ar=json_decode($params);
		$ar = (array)$ar;			
		$id = clean((int) $_GET["id"]);
		
		// выбираем базу данных
		$db->select_db("smeta_simple");
		
		$query="DELETE FROM `tbl_instrument` WHERE `id` = '$id'";		
		$result = do_query($query);		 		
		end_result(false);
		$arr = array();
		$arr = make_answer($arr, false);
		echo $json_response = json_encode($arr);		
		
		$db->close();
	}
	
	
?>