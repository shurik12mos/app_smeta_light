<?php
	require('../config.php'); 
	require('../common.php'); 
	
	$general_result = true;
	$result_message = "";
	$result_error;
		
	if( $_SERVER['REQUEST_METHOD'] == 'GET') {		
		// выбираем базу данных
		$db->select_db("smeta_simple");
		$arr = array();
		
		if ($_GET["job_section_id"]){
			$job_section_id = clean((int)$_GET["job_section_id"]);
			$query="SELECT * FROM tbl_jobs WHERE `job_section_id`='$job_section_id'";
			$result = do_query($query);		
			
			
			if($result->num_rows > 0) {
				$i = 0;
				while($row = $result->fetch_assoc()) {
					$arr[$i] = $row;
					$job_id = $arr[$i]["id"];
					
					//Get characteristics for job
					$query_char_name="SELECT * FROM tbl_chars_name, tbl_chars WHERE `tbl_chars_name`.`job_section_id`='$job_section_id' AND `tbl_chars_name`.`id`= `tbl_chars`.`chars_name_id` AND tbl_chars.id IN (SELECT `chars_id` FROM tbl_jobs_has_tbl_chars WHERE `jobs_id` = '$job_id')";
					$result_char_name = do_query($query_char_name);	
					if($result_char_name->num_rows > 0) {
						$j = 0;
						while($row_char_name = $result_char_name->fetch_assoc()) {
							$arr[$i]["chars"][$j] = $row_char_name;
							$j = $j+1;
						}
					}
					//Get instruments
					$query_instrument="SELECT t1 . * FROM tbl_jobs_has_tbl_instrument AS t2 LEFT JOIN tbl_instrument AS t1 ON t1.id = t2.instrument_id WHERE t2.jobs_id ='$job_id'";
					$result_instrument = do_query($query_instrument);	
					if($result_instrument->num_rows > 0) {
						$j = 0;
						while($row_instrument = $result_instrument->fetch_assoc()) {
							$arr[$i]["instruments"][$j] = $row_instrument;
							$j = $j+1;
						}
					}
					
					//Get related materials
					$query_materials="SELECT mat.id, mat.price, mat.measure, section.name, t1.number, producer.name as producer_name FROM tbl_jobs_has_tbl_materials AS t1, tbl_materials AS mat, tbl_material_section AS section, tbl_producer AS producer ";
					$query_materials.=" WHERE t1.jobs_id = '$job_id' AND mat.id = t1.materials_id AND section.id = mat.material_section_id AND producer.id = mat.producer_id";
					$result_materials = do_query($query_materials);	
					if($result_materials->num_rows > 0) {
						$j = 0;
						while($row_materials = $result_materials->fetch_assoc()) {
							$arr[$i]["materials"][$j] = $row_materials;
							$mat_id = $row_materials["id"];		
							
							$query_mat_char = "SELECT char_name.id, char_name.name, char_name.measure, char_n.value FROM tbl_material_char_name AS char_name, tbl_materials_has_tbl_material_char AS t1, tbl_material_char AS char_n WHERE char_n.id=t1.material_char_id AND char_name.id = char_n.material_char_name_id AND t1.materials_id = '$mat_id'";
							$result_mat_char = do_query($query_mat_char);	
							if($result_mat_char->num_rows > 0) {
								$k = 0;
								while($row_mat_char = $result_mat_char->fetch_assoc()) {
									$arr[$i]["materials"][$j]["name"] .= $row_mat_char["name"] . " " . $row_mat_char["value"] . " " . $row_mat_char["measure"];
									if ($k<($result_mat_char->num_rows-1)) {
										$arr[$i]["materials"][$j]["name"].= ", ";
									}
									
									$k=$k+1;							
								}								
							}	
						$j = $j+1;
						}						
					}
					$i = $i+1;
				}							
			}			
		}
		//Get global chars
		/*$query_global_char = "SELECT * FROM tbl_global_char_name";
		$result_global_char = do_query($query_global_char);	
		if($result_global_char->num_rows > 0) {
			$k = 0;
			while($row_global_char = $result_global_char->fetch_assoc()) {
				$arr[0]["global_char"][$k] = $row_global_char;						
				$glob_id = $row_global_char[$k]["id"];						
					$query_global_value = "SELECT value, coefficient, id FROM tbl_global_char WHERE `global_char_name_id` = '$glob_id'";
				$result_global_value = do_query($query_global_value);
				if($result_global_value->num_rows > 0) {
					$l = 0;
					while($row_global_value = $result_global_value->fetch_assoc()) {
						$arr[0]["global_char"][$k]["value"][$l] = $row_global_value;
						$l = $l+1;
					}
				}	
				$k=$k+1;
			}								
		}	*/			
		
		
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
		
		$section_id = clean((int)$ar["section_id"]);
		$human_hour = (float)$ar["human-hour"];
		$human_hour = clean($human_hour);		
		$description = clean($ar["description"]);
		$keywords = clean($ar["keywords"]);
		$how_estimated = clean($ar["how-estimated"]);
		$how_do_master = clean($ar["how-do-master"]);		
		$measure = clean($ar["measure"]);
		$job_rank = clean((float)$ar["job-rank"]);		
			
		$char = $ar["chars"];
		$char = (array)$char;	
		$instruments = $ar["instruments"];
		$instruments = (array)$instruments;	
		$materials = $ar["materials"];
		$materials = (array)$materials;			
		
		// Начинаем транзакцию		
		$db->begin_transaction(MYSQLI_TRANS_START_READ_WRITE);
		
		// Вставляем данные в таблицу tbl_materials
		$query = "INSERT INTO `tbl_jobs`(`job_section_id`, `human-hour`, `description`, `keywords`, `how-estimated`, `how-do-master`, `measure`, `job-rank`) ";
		$query .= "VALUES ('$section_id', '$human_hour', '$description', '$keywords', '$how_estimated', '$how_do_master', '$measure', '$job_rank')";	
		$result = do_query($query);		
		
		// Получаем id вставленной работы для вставки этого id  в таблицу tbl_jobs_has_tbl_chars
		$id_job = $db->insert_id;
		
		
		// Проходим в цикле по характеристикам, вставляем значения характеристик в таблицу 	tbl_jobs_has_tbl_chars и получаем их id
		for ($i=0;$i<count($char);$i++) {			
			$a = (array)$char[$i];	
			
			if (!isset($a["chars_name_id"])) {				
				$name_char = $a["name"];
				$measure_char = $a["measure"];				
					
				$query_char = "INSERT INTO `tbl_chars_name` (`name`, `measure`, `job_section_id`) VALUES ('$name_char', '$measure_char', '$section_id')";			
				$result = do_query($query_char);				
				$chars_name_id = $db->insert_id;
					
				$value_char = $a["value"];
				$query_char = "INSERT INTO `tbl_chars` (`value`, `chars_name_id`) VALUES ('$value_char', '$chars_name_id')";
				$result = do_query($query_char);
				$chars_id = $db->insert_id;
					
				$query_char = "INSERT INTO `tbl_jobs_has_tbl_chars` (`jobs_id`, `chars_id`) VALUES ('$id_job', '$chars_id')";
				$result = do_query($query_char);
			} elseif (!isset($a["id"])){
				$value_char = $a["value"];
				$chars_name_id = $a["chars_name_id"];
				$query_char = "INSERT INTO `tbl_chars` (`value`, `chars_name_id`) VALUES ('$value_char', '$chars_name_id')";
				$result = do_query($query_char);
				$chars_id = $db->insert_id;
					
				$query_char = "INSERT INTO `tbl_jobs_has_tbl_chars` (`jobs_id`, `chars_id`) VALUES ('$id_job', '$chars_id')";
				$result = do_query($query_char);
			} else {
				$chars_id = $a["id"];
				$query_char = "INSERT INTO `tbl_jobs_has_tbl_chars` (`jobs_id`, `chars_id`) VALUES ('$id_job', '$chars_id')";
				$result = do_query($query_char);
			}				
		}
		// Сохраняем инструменты
		for ($i=0;$i<count($instruments);$i++) {
			$inst = (array)$instruments[$i];
				
			$instrument_id = $inst["id"];
			$query_inst = "INSERT INTO `tbl_jobs_has_tbl_instrument` (`jobs_id`, `instrument_id`) VALUES ('$id_job', '$instrument_id')";
			$result = do_query($query_inst);
		}
			
		// Сохраняем материалы
		for ($i=0;$i<count($materials);$i++) {
			$mat = (array)$materials[$i];		
				
			$materials_id = $mat["id"];
			$materials_number = $mat["number"];
			$query_mat = "INSERT INTO `tbl_jobs_has_tbl_materials` (`jobs_id`, `materials_id`, `number`) VALUES ('$id_job', '$materials_id', '$materials_number')";
			$result = do_query($query_mat);			
		}		
		
		//фиксируем транзакцию
		end_transaction();
		
		$arr = array();
		$arr["id"] = $id_job;
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

		$params = trim(file_get_contents('php://input'));
		$ar=json_decode($params);
		$ar = (array)$ar;	
		
		$id_job = clean((int)$ar["id"]);
		$section_id = clean((int)$ar["section_id"]);
		$human_hour = 0+$ar["human-hour"];
		$human_hour = clean($human_hour);		
		$description = clean($ar["description"]);
		$keywords = clean($ar["keywords"]);
		$how_estimated = clean($ar["how-estimated"]);
		$how_do_master = clean($ar["how-do-master"]);		
		$measure = clean($ar["measure"]);
		$job_rank = clean($ar["job-rank"]);		
			
		$char = $ar["chars"];
		$char = (array)$char;	
		$instruments = $ar["instruments"];
		$instruments = (array)$instruments;	
		$materials = $ar["materials"];
		$materials = (array)$materials;	
		
		// Начинаем транзакцию		
		$db->begin_transaction(MYSQLI_TRANS_START_READ_WRITE);
		
		// Вставляем данные в таблицу tbl_jobs
		$query = "UPDATE `tbl_jobs` SET `job_section_id` = '$section_id', `human-hour` = '$human_hour', `description` = '$description', ";
		$query .= "`keywords` = '$keywords', `how-estimated` = '$how_estimated', `how-do-master` = '$how_do_master', `measure` = '$measure', ";
		$query .= "`job-rank` =  '$job_rank' WHERE `id` = '$id_job'";
		$result = do_query($query);			
		
		// Проходим в цикле по характеристикам, вставляем значения характеристик в таблицу 	tbl_jobs_has_tbl_chars и получаем их id
		for ($i=0;$i<count($char);$i++) {			
			$a = (array)$char[$i];		
		
			if (!isset($a["chars_name_id"])) {
				$name_char = $a["name"];
				$measure_char = $a["measure"];
				$description_char = $a["description"];
					
				$query_char = "INSERT INTO `tbl_chars_name` (`name`, `measure`, `description`, `job_section_id`) VALUES ('$name_char', '$measure_char', '$description', '$section_id')";
				$result = do_query($query_char);				
				$chars_name_id = $db->insert_id;
					
				$value_char = $a["value"];
				$query_char = "INSERT INTO `tbl_chars` (`value`, `chars_name_id`) VALUES ('$value_char', '$chars_name_id')";
				$result = do_query($query_char);
				$chars_id = $db->insert_id;
					
				$query_char = "INSERT INTO `tbl_jobs_has_tbl_chars` (`jobs_id`, `chars_id`) VALUES ('$id_job', '$chars_id')";
				$result = do_query($query_char);
			} elseif (!isset($a["id"])){
				$value_char = $a["value"];
				$chars_name_id = $a["chars_name_id"];
				$query_char = "INSERT INTO `tbl_chars` (`value`, `chars_name_id`) VALUES ('$value_char', '$chars_name_id')";
				$result = do_query($query_char);
				$chars_id = $db->insert_id;
					
				$query_char = "INSERT INTO `tbl_jobs_has_tbl_chars` (`jobs_id`, `chars_id`) VALUES ('$id_job', '$chars_id')";
				$result = do_query($query_char);
			} else {
				$value_char = $a["value"];
				$chars_name_id = $a["chars_name_id"];
				$id_char = $a["id"];
				$query_char = "UPDATE `tbl_chars` SET `value` = '$value_char', `chars_name_id` = '$chars_name_id' WHERE `id` = '$id_char'";
				$result = do_query($query_char);				
			}				
		}
		// Удалить все инструменты связанные с работой
		$query_a = "DELETE FROM `tbl_jobs_has_tbl_instrument` WHERE `jobs_id` = '$id_job'";
		$result_a = do_query($query_a);		
		// Сохраняем инструменты
		for ($i=0;$i<count($instruments);$i++) {
			$inst = (array)$instruments[$i];
			$instrument_id = $inst["id"];
			
			$query_inst = "INSERT INTO `tbl_jobs_has_tbl_instrument` (`jobs_id`, `instrument_id`) VALUES ('$id_job', '$instrument_id')";
			$result = do_query($query_inst);					
		}
			
		
		// Удалить все материалы связанные с работой
		$query_a = "DELETE FROM `tbl_jobs_has_tbl_materials` WHERE `jobs_id` = '$id_job'";
		$result_a = do_query($query_a);
		// Сохраняем материалы, которые переданы
		for ($i=0;$i<count($materials);$i++) {
			$mat = (array)$materials[$i];		
				
			$materials_id = $mat["id"];
			$materials_number = $mat["number"];
					
			$query_mat = "INSERT INTO `tbl_jobs_has_tbl_materials` (`jobs_id`, `materials_id`, `number`) VALUES ('$id_job', '$materials_id', '$materials_number')";
			$result = do_query($query_mat);				
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
		
		//Удаляем работу
		$query="DELETE FROM `tbl_jobs` WHERE `id` = '$id'";		
		$result = do_query($query);		
		//Удаляем неисполбзуемые характеристики
		$query="DELETE FROM `tbl_chars` WHERE `id` NOT IN (SELECT `chars_id` FROM `tbl_jobs_has_tbl_chars`)";
		$result = do_query($query);	
		
		//фиксируем транзакцию
		end_transaction();
		
		$arr = array();
		$arr = make_answer($arr, false);
		echo $json_response = json_encode($arr);	
		
		$db->close();		
	}
	
	
?>