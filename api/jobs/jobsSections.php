<?php
	require('../config.php'); 
	require('../common.php'); 
	
	$general_result = true;
	$result_message = "";
	$result_error;
		
	if( $_SERVER['REQUEST_METHOD'] == 'GET') {
		
		// выбираем базу данных
		$db->select_db("smeta_simple");		
		
		$params = trim(file_get_contents('php://input'));
		$ar=json_decode($params);
		$ar = (array)$ar;	
		
		$category_id = (int)$_GET["category_id"];	
		
		$query="SELECT * FROM tbl_job_section WHERE `id` in (SELECT `job_section_id` FROM tbl_job_section_has_tbl_category WHERE `category_id` = '$category_id')";
		$result =do_query($query);
			
		$arr = array();	
		$i = 0;
		if($result->num_rows > 0) {
			while($row = $result->fetch_assoc()) {
				$arr[$i] = $row;	
				$arr[$i][category_id] = $category_id;
				$i = $i+1;
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
		
		$category_id = clean((int) $ar["category_id"]);
		$name = clean($ar["name"]);		
		$description = clean($ar["description"]);	
		$keywords = clean($ar["keywords"]);		
		
		
		// Начинаем транзакцию		
		$db->begin_transaction(MYSQLI_TRANS_START_READ_WRITE);
		
		$query="INSERT INTO `tbl_job_section`(`name`, `description`, `keywords`) VALUES ('$name', '$description', '$keywords')";
		$result = do_query($query);
		
		$id_section = $db->insert_id;	
		
		$query_category = "INSERT INTO `tbl_job_section_has_tbl_category` (`category_id`,`job_section_id`) VALUES ('$category_id', '$id_section')";
		$result = do_query($query_category);
		
		
		//фиксируем транзакцию
		end_transaction();
		
		$arr = array();
		$arr["id"] = $id_section;			
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
		$category_id = clean((int) $ar["category_id"]);
		$name = clean($ar["name"]);		
		$description = clean($ar["description"]);	
		$keywords = clean($ar["keywords"]);	
				
		// выбираем базу данных
		$db->select_db("smeta_simple");
		
		// Начинаем транзакцию		
		$db->begin_transaction(MYSQLI_TRANS_START_READ_WRITE);
		
		$query="UPDATE `tbl_job_section` SET `name` = '$name', `description` = '$description', `keywords` = '$keywords' WHERE `id` = '$id'";		
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
		
		$query_char="DELETE FROM `tbl_job_section` WHERE `id` = '$id'";		
		$result_char = do_query($query_char);	
		
		$query_char="DELETE FROM `tbl_jobs` WHERE `job_section_id` = '$id'";		
		$result_char = do_query($query_char);	
		
		//фиксируем транзакцию
		end_transaction();
		
		$arr = array();
		$arr = make_answer($arr, false);
		echo $json_response = json_encode($arr);		
		
		$db->close();
	}	
?>