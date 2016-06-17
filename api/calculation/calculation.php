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
		$kp = clean($_GET["calcId"]);
		
		$file = "calculations/" . $kp . ".json";
		$arr = fopen($file, 'r'); // ("r" - считывать "w" - создавать "a" - добовлять к тексту), мы создаем файл
		$arr = fread($arr, filesize($file));	
		
		$arr=json_decode($arr);
				
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
				
		$object = clean($ar["object_name"]);
		$kp = clean($ar["kp"]);
		$sum_materials = clean($ar["sum_materials"]);			
		$sum_amortisations = clean($ar["sum_amortisations"]);
		$sum_jobs = clean($ar["sum_jobs"]);
		$descriptions = clean($ar["descriptions"]);
		
		
		// Начинаем транзакцию		
		$db->begin_transaction(MYSQLI_TRANS_START_READ_WRITE);
		
		$query="INSERT INTO `tbl_calculations`(`object`, `kp`, `sum_materials`, `sum_amortisations`, `sum_jobs`, `descriptions`) VALUES ('$object', '$kp', '$sum_materials' , '$sum_amortisations', '$sum_jobs', '$descriptions')";
		$result = do_query($query);		
		$id = $db->insert_id;
		
		if ($result) {
			$file = "calculations/" . $kp . ".json";

			$fp = fopen($file, 'w'); // ("r" - считывать "w" - создавать "a" - добовлять к тексту), мы создаем файл
			fwrite($fp, $params); // записываем json в наш файл
			fclose ($fp); // закрываем файл
		}
		//фиксируем транзакцию
		end_transaction();
		
		$arr = array();
		$arr["id"] = $id;			
		$arr = make_answer($arr, false);
		echo $json_response = json_encode($arr);		
		
		$db->close();	
	}
	
	if( $_SERVER['REQUEST_METHOD'] == 'PUT') {
		header('Content-type: application/json; charset=utf-8');	
		$params = trim(file_get_contents('php://input'));
				
		$ar=json_decode($params);
		$ar = (array)$ar;	
		$object = clean($ar["object_name"]);
		$kp = clean($ar["kp"]);
		$sum_materials = clean($ar["sum_materials"]);			
		$sum_amortisations = clean($ar["sum_amortisations"]);
		$sum_jobs = clean($ar["sum_jobs"]);
		$descriptions = clean($ar["descriptions"]);
				
		// выбираем базу данных
		$db->select_db("smeta_simple");
		
		// Начинаем транзакцию		
		$db->begin_transaction(MYSQLI_TRANS_START_READ_WRITE);
		
		$query="UPDATE `tbl_calculations` SET `object` = '$object', `kp` = '$kp', `sum_materials` = '$sum_materials', `sum_amortisations` = '$sum_amortisations', `sum_jobs` = '$sum_jobs', `descriptions` = '$descriptions'  WHERE `kp` = '$kp'";		
		$result = do_query($query);		
		
		if ($result) {
			$file = "calculations/" . $kp . ".json";

			$fp = fopen($file, 'w'); // ("r" - считывать "w" - создавать "a" - добовлять к тексту), мы создаем файл
			fwrite($fp, $params); // записываем json в наш файл
			fclose ($fp); // закрываем файл
		}
		
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