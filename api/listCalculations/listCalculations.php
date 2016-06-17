<?php
	require('../config.php'); 
	require('../common.php'); 
	
	$general_result = true;
	$result_message = "";
	$result_error;
		
	if( $_SERVER['REQUEST_METHOD'] == 'GET') {
		
		// выбираем базу данных
		$db->select_db("smeta_simple");	
		
		$query="SELECT * FROM `tbl_calculations`";
		$result = do_query($query);	
		
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
		
	if( $_SERVER['REQUEST_METHOD'] == 'DELETE') {			
		header('Content-type: application/json; charset=utf-8');	
		$params = trim(file_get_contents('php://input'));		
		
		$ar=json_decode($params);
		$ar = (array)$ar;			
		$kp =$_GET["kp"];
		
		$file = "1488";

			$fp = fopen($file, 'w'); // ("r" - считывать "w" - создавать "a" - добовлять к тексту), мы создаем файл			
			fwrite($fp, $kp); // записываем json в наш файл
		fclose ($fp); // закрываем файл
		
		// выбираем базу данных
		$db->select_db("smeta_simple");
		
		// Начинаем транзакцию		
		$db->begin_transaction(MYSQLI_TRANS_START_READ_WRITE);
		
		$query="DELETE FROM `tbl_calculations` WHERE `kp` = '$kp'";			
		$result = do_query($query);	
		$way = '../calculation/calculations/' . $kp . '.json';
		if ($result) {
			$result = unlink($way);
		}
		
		//фиксируем транзакцию
		end_transaction();
		
		$arr = array();
		$arr = make_answer($arr, false);
		echo $json_response = json_encode($arr);		
		
		$db->close();
	}
	
	
?>