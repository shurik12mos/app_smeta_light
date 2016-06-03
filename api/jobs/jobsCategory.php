<?php
	require('../config.php'); 
	require('../common.php'); 
	
	$general_result = true;
	$result_message = "";
	$result_error;
		
	if( $_SERVER['REQUEST_METHOD'] == 'GET') {
		
		// выбираем базу данных
		$db->select_db("smeta_simple");		
		
		$query="SELECT * FROM tbl_category";
		$result =do_query($query);
			
		$arr = array();		
		if($result->num_rows > 0) {
			while($row = $result->fetch_assoc()) {
				$arr[] = $row;				
			}
		} else {
			$arr[0] = "There no categories";
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
		$description = clean($ar["description"]);			
		
		
		// Начинаем транзакцию		
		$db->begin_transaction(MYSQLI_TRANS_START_READ_WRITE);
		
		$query="INSERT INTO `tbl_category`(`name`, `description`) VALUES ('$name', '$description')";
		$result = do_query($query);
		
		$id_category = $db->insert_id;	
		
		//фиксируем транзакцию
		end_transaction();
		
		$arr = array();
		$arr["id"] = $id_category;			
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
		$description = clean($ar["description"]);	
				
		// выбираем базу данных
		$db->select_db("smeta_simple");
		
		// Начинаем транзакцию		
		$db->begin_transaction(MYSQLI_TRANS_START_READ_WRITE);
		
		$query="UPDATE `tbl_category` SET `name` = '$name', `description` = '$description' WHERE `id` = '$id'";		
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
		
		$query_char="DELETE FROM `tbl_category` WHERE `id` = '$id'";		
		$result_char = do_query($query_char);	
		
		$query_char="DELETE FROM `tbl_jobs` WHERE `job_section_id` NOT IN (SELECT `job_section_id` FROM `tbl_job_section_has_tbl_category` WHERE `category_id` = '$id')";		
		$result_char = do_query($query_char);	
		
		$query_char="DELETE FROM `tbl_job_section` WHERE `id` NOT IN (SELECT `job_section_id` FROM `tbl_job_section_has_tbl_category` WHERE `category_id` = '$id')";		
		$result_char = do_query($query_char);	
		
		//фиксируем транзакцию
		end_transaction();
		
		$arr = array();
		$arr = make_answer($arr, false);
		echo $json_response = json_encode($arr);		
		
		$db->close();
	}	
?>