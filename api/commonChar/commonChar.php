<?php
	require('../config.php'); 
	require('../common.php'); 
	
	$general_result = true;
	$result_message = "";
	$result_error;
		
	if( $_SERVER['REQUEST_METHOD'] == 'GET') {
		
		// выбираем базу данных
		$db->select_db("smeta_simple");		
		
		$query="SELECT * FROM tbl_global_char_name";
		$result =do_query($query);
			
		$arr = array();
		$i = 0;
		if($result->num_rows > 0) {
			while($row = $result->fetch_assoc()) {
				$arr[$i] = $row;
				// Получаем значения для каждой характеристики
				$id_char = $row["id"];
				$query_char = "SELECT * FROM tbl_global_char WHERE `global_char_name_id` = '$id_char'";
				$result_char =do_query($query_char);
				$j = 0;
				if($result_char->num_rows > 0) {
					while($row_char = $result_char->fetch_assoc()) {
						$arr[$i]["values"][$j] = $row_char;
						$j = $j+1;
					}	
				}
				$i = $i+1;
			}
		} else {
			$arr[0] = "There no chars";
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
		$values = $ar["values"];
		$values = (array)$values;		
		$k = 0;
		
		// Начинаем транзакцию		
		$db->begin_transaction(MYSQLI_TRANS_START_READ_WRITE);
		
		$query="INSERT INTO `tbl_global_char_name`(`name`, `measure`, `description`) VALUES ('$name', '$measure', '$description')";
		$result = do_query($query);
		
		$id_char = $db->insert_id;
		
		for ($i=0;$i<count($values);$i++) {			
			$a = (array)$values[$i];				
			$val = $a["value"];
			$coef = $a["coefficient"];			
			
			$query_val = "INSERT INTO `tbl_global_char` (`value`, `coefficient`, `global_char_name_id`) VALUES ('$val', '$coef', '$id_char')";
			
			$result_val = do_query($query_val);				
		}
		
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
		$measure = clean($ar["measure"]);
		$description = clean($ar["description"]);			
		$values = $ar["values"];
		$values = (array)$values;		
		$k = 0;
				
		// выбираем базу данных
		$db->select_db("smeta_simple");
		
		// Начинаем транзакцию		
		$db->begin_transaction(MYSQLI_TRANS_START_READ_WRITE);
		
		$query="UPDATE `tbl_global_char_name` SET `name` = '$name', `measure` = '$measure', `description` = '$description' WHERE `id` = '$id'";		
		$result = do_query($query);
		
		//Находим все значения связанные с этой характеристикой.
		$possible = array();
		$query_ar = "SELECT * FROM tbl_global_char WHERE `global_char_name_id` = '$id'";
		$result_char =do_query($query_ar);
		$j = 0;
		if($result_char->num_rows > 0) {
			while($row_pos = $result_char->fetch_assoc()) {
				$possible[$j] = $row_pos["id"];
				$j = $j+1;				
			};	
		};		
		
		
		
		for ($i=0;$i<count($values);$i++) {			
			$a = (array)$values[$i];				
			$val = $a["value"];
			$coef = $a["coefficient"];
			$id_val = $a["id"];
			
			if ($id_val && $id_val>0) {	
				//Если такой элемент есть, то удаляем его из массива возможных значений
				$number = array_search($id_val, $possible);
				if ($number!==FALSE) {
					unset($possible[$number]);
				}
				
				$query_char = "SELECT * FROM tbl_global_char WHERE `id` = '$id_val'";
				$result_char = do_query($query_char);
				if($result_char->num_rows > 0) {
					$query_val = "UPDATE `tbl_global_char` SET `value` = '$val', `coefficient` = '$coef', `global_char_name_id` = '$id' WHERE `id` = '$id_val'";
					$result_val = do_query($query_val);
				} else {
					$query_val = "INSERT INTO `tbl_global_char` (`value`, `coefficient`, `global_char_name_id`) VALUES ('$val', '$coef', '$id')";			
					$result_val = do_query($query_val);	
				}
			} else {
				$query_val = "INSERT INTO `tbl_global_char` (`value`, `coefficient`, `global_char_name_id`) VALUES ('$val', '$coef', '$id')";			
				$result_val = do_query($query_val);	
			}									
		}
		
		for ($i=0;$i<count($possible);$i++) {
			$query="DELETE FROM `tbl_global_char` WHERE `id` = '$possible[$i]'";		
			$result = do_query($query);			
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
		
		$query_char="DELETE FROM `tbl_global_char` WHERE `global_char_name_id` = '$id'";		
		$result_char = do_query($query_char);	
		
		$query="DELETE FROM `tbl_global_char_name` WHERE `id` = '$id'";		
		$result = do_query($query);	

		
		//фиксируем транзакцию
		end_transaction();
		
		$arr = array();
		$arr = make_answer($arr, false);
		echo $json_response = json_encode($arr);		
		
		$db->close();
	}
	
	
?>