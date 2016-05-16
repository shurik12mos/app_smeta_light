<?php
	require('../config.php'); 
	require('../common.php'); 
	
	$general_result = true;
	$result_message = "";
	$result_error;
		
	if( $_SERVER['REQUEST_METHOD'] == 'GET') {		
		// выбираем базу данных
		$db->select_db("smeta_simple");
		
		
		if ($_GET["material_section_id"]){
			$id = clean($_GET["material_section_id"]);
			$query="SELECT * FROM tbl_materials WHERE `material_section_id`='$id'";
			$result = do_query($query);		
			
			$arr = array();
			if($result->num_rows > 0) {
				$i = 0;
				while($row = $result->fetch_assoc()) {
					$arr[$i] = $row;
					//Get producer name. don`t know how it do better. optimize this
					$id_producer = $row["producer_id"];
					$query_producer = "SELECT `name` FROM tbl_producer WHERE `id`='$id_producer'";
					$result_producer = do_query($query_producer);
					if ($general_result) {
						$result_producer = $result_producer->fetch_assoc();
						$arr[$i]["producer_name"]=$result_producer["name"];
					}					
					//get chars for every material
					$id_material = $row["id"];
					$query_char = "SELECT `value`, `material_char_name_id`, `name`, `measure` FROM tbl_material_char, tbl_material_char_name WHERE tbl_material_char.id IN (SELECT material_char_id FROM tbl_materials_has_tbl_material_char WHERE tbl_materials_has_tbl_material_char.materials_id = '$id_material') AND tbl_material_char_name.id = tbl_material_char.material_char_name_id";
					$result_char = do_query($query_char);				
					if($result_char->num_rows > 0) {
						$j=0;
						while($row_char = $result_char->fetch_assoc()) {
							$arr[$i]["char"][$j] = $row_char;
							$j = $j+1;
						}
					}					
					$i = $i+1;
				}				
			}			
		}		
		
		$db->close(); 
		
		end_result(true);
		$arr = make_answer($arr, true);		
		
		# JSON-encode the response
		echo $json_response = json_encode($arr);
	}
	
	if( $_SERVER['REQUEST_METHOD'] == 'POST') {
		$arrOfResult = true;
		
		// выбираем базу данных
		$db->select_db("smeta_simple");
		
		$params = trim(file_get_contents('php://input'));
		$ar=json_decode($params);
		$ar = (array)$ar;	

		$id = clean((int)$ar["material_section_id"]);
		$id_producer = clean((int)$ar["producer_id"]);
		$description = clean($ar["description"]);
		$keywords = clean($ar["keywords"]);
		$price = 0+$ar["price"];
		$price = clean($price);
		$measure = clean($ar["measure"]);		
		$char = $ar["char"];
		$char = (array)$char;		
		$k = 0;
		
		// Начинаем транзакцию		
		$db->begin_transaction(MYSQLI_TRANS_START_READ_WRITE);
		
		// Вставляем данные в таблицу tbl_materials
		$query="INSERT INTO `tbl_materials`(`material_section_id`, `producer_id`, `description`, `keywords`, `price`, `measure`) VALUES ('$id', '$id_producer', '$description', '$keywords', '$price', '$measure')";	
		$result = do_query($query);		
		
		// Получаем id вставленного материала для вставки этого id  в таблицу tbl_materials_has_tbl_material_char
		$id_material = $db->insert_id;
		// Проходим в цикле по характеристикам, вставляем значения характеристик в таблицу 	tbl_material_char и получаем их id
		for ($i=0;$i<count($char);$i++) {			
			$a = (array)$char[$i];	
			
			$val = $a["value"];
			$char_name_id = $a["material_char_name_id"];
			$query_char = "INSERT INTO `tbl_material_char` (`value`, `material_char_name_id`) VALUES ('$val', '$char_name_id')";
			$result = do_query($query_char);
			
			if($general_result) {
				// Получаем id вставленного значения характеристики
				$id_char = $db->insert_id;
				// Вставляем значения id в tbl_materials_has_tbl_material_char
				$query_temp = "INSERT INTO `tbl_materials_has_tbl_material_char` (`materials_id`, `material_char_id`) VALUES ('$id_material', '$id_char')";
				$result = do_query($query_temp);				
			}			
		}
		//фиксируем транзакцию
		end_transaction();
		
		$arr = array();
		$arr = make_answer($arr, false);
		echo $json_response = json_encode($arr);		
		
		$db->close();		
	}
	
	if( $_SERVER['REQUEST_METHOD'] == 'PUT') {
		
		// выбираем базу данных
		$db->select_db("smeta_simple");
		
		$params = trim(file_get_contents('php://input'));
		$ar=json_decode($params);
		$ar = (array)$ar;	

		$id = clean((int)$ar["material_section_id"]);
		$id_producer = clean((int)$ar["producer_id"]);
		$description = clean($ar["description"]);
		$keywords = clean($ar["keywords"]);
		$price = 0+$ar["price"];
		$price = clean($price);
		$measure = clean($ar["measure"]);		
		$char = $ar["char"];
		$char = (array)$char;
		$id_material = clean($ar["id"]);
		// Начинаем транзакцию		
		$db->begin_transaction(MYSQLI_TRANS_START_READ_WRITE);
		
		// Вставляем данные в таблицу tbl_materials
		$query="UPDATE `tbl_materials`SET `material_section_id` = '$id', `producer_id` = '$id_producer', `description` = '$description', `keywords` = '$keywords', `price` = '$price', `measure` = '$measure' WHERE `id` = '$id_material'";	
		$result = do_query($query);
		
		// Проходим в цикле по характеристикам, вставляем значения характеристик в таблицу 	tbl_material_char и получаем их id
		for ($i=0;$i<count($char);$i++) {			
			$a = (array)$char[$i];	
			$val = $a["value"];
			$char_name_id = $a["material_char_name_id"];
			
			$query_char = "UPDATE `tbl_material_char` SET `value` = '$val' WHERE `material_char_name_id` = '$char_name_id' AND `id` IN (SELECT `material_char_id` FROM `tbl_materials_has_tbl_material_char` WHERE `materials_id` = '$id_material')";
			$result_char = do_query($query_char);			
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
		
		// Удаляем все значения характеристик связанных с этим материалом.
		$query_char = "SELECT `material_char_id` FROM `tbl_materials_has_tbl_material_char` WHERE `materials_id`='$id'";
		$result = do_query($query_char);
		
		if($result->num_rows > 0) {
			while($row = $result->fetch_assoc()) {
			$id_char = $row["material_char_id"];
			$query_del = "DELETE FROM `tbl_material_char` WHERE `id` = $id_char";
			$result_del = do_query($query_del);
			}
		}	
		
		//Удаляем сам материал
		$query="DELETE FROM `tbl_materials` WHERE `id` = '$id'";		
		$result = do_query($query);		
		
		
		//фиксируем транзакцию
		end_transaction();
		
		$arr = array();
		$arr = make_answer($arr, false);
		echo $json_response = json_encode($arr);	
		
		$db->close();		
	}
	
	
?>