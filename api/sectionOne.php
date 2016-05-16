<?php
	require('config.php'); 
	
		
	if( $_SERVER['REQUEST_METHOD'] == 'GET') {
		
		// выбираем базу данных
		$db->select_db("smeta_simple");
		
		
		if ($_GET["id_section"]){
			$id = $_GET["id_section"];
			$query="SELECT * FROM tbl_job_section WHERE `job_section_id`='$id'";
			$result = $db->query($query) or die($mysqli->error.__LINE__);
			
			$arr = array();
			if($result->num_rows > 0) {
				while($row = $result->fetch_assoc()) {
				$arr = $row;
				}
			}
			
			$query="SELECT * FROM `tbl_chars_name` WHERE `job_section_id`='$id'";
			$result = $db->query($query) or die($mysqli->error.__LINE__);
			$chars = array();
			if($result->num_rows > 0) {				
				while($row = $result->fetch_assoc()) {				
				$chars[]= $row;						
				}
			}
			
			$arr["charNames"] = $chars;

			$query="SELECT * FROM tbl_job_section, tbl_category, tbl_jobs WHERE tbl_job_section.job_section_id = $id AND tbl_category.category_id = (SELECT tbl_category.category_id FROM tbl_job_section_has_tbl_category WHERE job_section_id = $id)AND tbl_jobs.job_section_id = '$id'";
			$result = $db->query($query) or die($mysqli->error.__LINE__);
			$jobs = array();
			
			if($result->num_rows > 0) {
				$i = 0;
				while($row = $result->fetch_assoc()) {				
					$jobs[$i] = $row;
					$id_jobs = $jobs[$i]["id_jobs"];					
					
					$queryIn2 = "SELECT * FROM  `tbl_chars` INNER JOIN  `tbl_chars_name` ON tbl_chars.chars_name_id = tbl_chars_name.chars_name_id WHERE  `chars_id` IN (SELECT  `chars_id` FROM  `tbl_jobs_has_tbl_chars` WHERE  `jobs_id` =  '$id_jobs')";
					$resultIn = $db->query($queryIn2) or die($mysqli->error.__LINE__);
					$charvalue = array();
					if($resultIn->num_rows > 0) {							
						while($row2 = $resultIn->fetch_assoc()) {				
							$charvalue[] = $row2;							
						}
					}					
					
					$jobs[$i]["chars"] = $charvalue;					
					$i = $i+1;
				}				
			}
			$arr["jobs"] = $jobs;
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
		
		$query="INSERT INTO `tbl_chars_name`(`chars_name_name`, `chars_name_measure`, `chars_name_description`, `job_section_id`) VALUES ('$name', '$measure', '$desc', '$id')";
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
		
		$query="UPDATE `tbl_chars_name` SET `chars_name_name`= '$name', `chars_name_description` = '$desc', `chars_name_measure` = '$measure', `job_section_id` = '$id_section' WHERE `chars_name_id` = '$id'";		
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
		
		$query="DELETE FROM `tbl_chars_name` WHERE `chars_name_id` = '$id'";		
		$result = $db->query($query) or die($mysqli->error.__LINE__);		 		
		$db->close();	 
		# JSON-encode the response
		return $json_response = json_encode($id);
	}
	
	
?>