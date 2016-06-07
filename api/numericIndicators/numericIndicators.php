<?php
	require('../config.php'); 
	require('../common.php'); 
	
	$general_result = true;
	$result_message = "";
	$result_error;
		
	if( $_SERVER['REQUEST_METHOD'] == 'GET') {
		
		// выбираем базу данных
		$db->select_db("smeta_simple");		
		
		$query="SELECT * FROM tbl_numeric_indicators";
		$result =do_query($query);
			
		$arr = array();		
		if($result->num_rows > 0) {
			while($row = $result->fetch_assoc()) {
				$arr[] = $row;	
			}
		} else {
			$arr = [];
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
		$measure = clean($ar["measure"]);
		$description = clean($ar["description"]);			
		$value = clean($ar["value"]);
		$alias = clean($ar["alias"]);
		
		
		// Начинаем транзакцию		
		$db->begin_transaction(MYSQLI_TRANS_START_READ_WRITE);
		
		$query="INSERT INTO `tbl_numeric_indicators`(`name`, `measure`, `value`, `alias`, `description`) VALUES ('$name', '$measure', '$value' , '$alias', '$description')";
		$result = do_query($query);		
		
		//фиксируем транзакцию
		end_transaction();
		
		$arr = array();
		$arr["id"] = $id_char;			
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
		$alias = clean($ar["alias"]);
		$measure = clean($ar["measure"]);
		$description = clean($ar["description"]);			
		$value = clean($ar["value"]);
				
		// выбираем базу данных
		$db->select_db("smeta_simple");
		
		// Начинаем транзакцию		
		$db->begin_transaction(MYSQLI_TRANS_START_READ_WRITE);
		
		$query="UPDATE `tbl_numeric_indicators` SET `name` = '$name', `measure` = '$measure', `value` = '$value', `alias` = '$alias', `description` = '$description' WHERE `id` = '$id'";		
		$result = do_query($query);		
		
		//фиксируем транзакцию
		end_transaction();
		
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
		
		// Начинаем транзакцию		
		$db->begin_transaction(MYSQLI_TRANS_START_READ_WRITE);
		
		$query_char="DELETE FROM `tbl_numeric_indicators` WHERE `global_char_name_id` = '$id'";		
		$result_char = do_query($query_char);	
				
		//фиксируем транзакцию
		end_transaction();
		
		$arr = array();
		$arr = make_answer($arr, false);
		echo $json_response = json_encode($arr);		
		
		$db->close();
	}
	
	
?>