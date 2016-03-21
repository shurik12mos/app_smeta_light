<?php
	require('config.php'); 
	
	/*$queryIn2 = "SELECT * FROM  `tbl_materials`, `tbl_material_section`, `tbl_material_category`, `tbl_producer` WHERE  `id_materials` IN (SELECT  `tbl_materials_id_materials` FROM  `tbl_jobs_has_tbl_materials` WHERE  `tbl_jobs_id_jobs` =  '$id_jobs') AND (tbl_material_section.id_material_section = tbl_materials.tbl_material_section_id_material_section) AND (tbl_material_category.id_material_category = tbl_material_section.tbl_material_category_id_material_category) AND (tbl_materials.tbl_producer_id_producer = tbl_producer.id_producer)";
					$resultIn = $db->query($queryIn2) or die($mysqli->error.__LINE__);
					if($resultIn->num_rows > 0) {
						$materials = array();
						while($row2 = $resultIn->fetch_assoc()) {				
							$materials[] = $row2;							
						}
					}

	*/				
	if( $_SERVER['REQUEST_METHOD'] == 'GET') {
		
		// выбираем базу данных
		$db->select_db("smeta_simple");
		
		
		if ($_GET["id_job"]){
			$id = $_GET["id_job"];
			$query="SELECT * FROM tbl_jobs WHERE `id_jobs`='$id'";
			$result = $db->query($query) or die($mysqli->error.__LINE__);
			
			$arr = array();
			if($result->num_rows > 0) {
				while($row = $result->fetch_assoc()) {
				$arr = $row;
				}
			}
			
			$query="SELECT * FROM `tbl_chars_name` WHERE `tbl_job_section_id_job_section`='$id'";
			$result = $db->query($query) or die($mysqli->error.__LINE__);
			
			if($result->num_rows > 0) {
				$i = 0;
				while($row = $result->fetch_assoc()) {				
					$arr["charNames"][$i] = $row;
					$i = $i+1;
				}
			}

			$query="SELECT * FROM `tbl_jobs` WHERE `tbl_job_section_id_job_section`='$id'";
			$result = $db->query($query) or die($mysqli->error.__LINE__);
			
			if($result->num_rows > 0) {
				$i = 0;
				while($row = $result->fetch_assoc()) {				
					$arr["jobs"][$i] = $row;
					$id_jobs = $arr["jobs"][$i]["id_jobs"];
					$arr["jobs"][$i]["sas"] = $id_jobs;
					
					$queryIn2 = "SELECT * FROM  `tbl_chars` WHERE  `id_chars` IN (SELECT  `tbl_chars_id_chars` FROM  `tbl_jobs_has_tbl_chars` WHERE  `tbl_jobs_id_jobs` =  '$id_jobs')";
					$resultIn = $db->query($queryIn2) or die($mysqli->error.__LINE__);
					if($resultIn->num_rows > 0) {
						$j = 0;
						while($row2 = $resultIn->fetch_assoc()) {				
							$arr["jobs"][$i]["chars"][$j] = $row2;
							$j = $j+1;
						}
					}					
					$i = $i+1;
				}
				
			}
		}		
		
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
		
		$id = (int) $ar["id_section"];
		$name = $ar["name"];
		$desc = $ar["description"];
		$measure = $ar["measure"];	
		
		$query="INSERT INTO `tbl_chars_name`(`name`, `measure`, `description`, `tbl_job_section_id_job_section`) VALUES ('$name', '$measure', '$desc', '$id')";
		$result = $db->query($query) or die($mysqli->error.__LINE__);
		
		$id_section = $db->insert_id;		
		$query="INSERT INTO `tbl_job_section_has_tbl_category` (`tbl_job_section_id_job_section`, `tbl_category_id_category`) VALUES ('$id_section', '$id_category')";
		$result = $db->query($query) or die($mysqli->error.__LINE__);
		 
		$db->close();	 
		# JSON-encode the response
		return $json_response = json_encode($result);
	}
	
	if( $_SERVER['REQUEST_METHOD'] == 'PUT') {
		header('Content-type: application/json; charset=utf-8');	
		$params = trim(file_get_contents('php://input'));
		$ar=json_decode($params);
		$ar = (array)$ar;	
		$id = (int) $ar["id"];
		$name = $ar["name"];
		$desc = $ar["description"];
		$measure = $ar["measure"];
		$id_section = $ar["id_section"];
		
		// выбираем базу данных
		$db->select_db("smeta_simple");
		
		$query="UPDATE `tbl_chars_name` SET `name`= '$name', `description` = '$desc', `measure` = '$measure', `tbl_job_section_id_job_section` = '$id_section' WHERE `id_chars_name` = '$id'";		
		$result = $db->query($query) or die($mysqli->error.__LINE__);
		
		$db->close();
		# JSON-encode the response
		echo $json_response = json_encode($id);
	}
	
	if( $_SERVER['REQUEST_METHOD'] == 'DELETE') {	
		
		header('Content-type: application/json; charset=utf-8');	
		$params = trim(file_get_contents('php://input'));
		$ar=json_decode($params);
		$ar = (array)$ar;			
		$id = (int) $_GET["id"];
		
		// выбираем базу данных
		$db->select_db("smeta_simple");
		
		$query="DELETE FROM `tbl_chars_name` WHERE `id_chars_name` = '$id'";		
		$result = $db->query($query) or die($mysqli->error.__LINE__);		 		
		$db->close();	 
		# JSON-encode the response
		return $json_response = json_encode($id);
	}
	
	
?>