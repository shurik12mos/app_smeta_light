<?php
	require('config.php'); 
	
		
	if( $_SERVER['REQUEST_METHOD'] == 'GET') {
		
		// выбираем базу данных
		$db->select_db("smeta_simple");
		
		
		if ($_GET["id_section"]){
			$id = $_GET["id_section"];
			$query="SELECT * FROM tbl_job_section WHERE `id_job_section`='$id'";
			$result = $db->query($query) or die($mysqli->error.__LINE__);
			
			$arr = array();
			if($result->num_rows > 0) {
				while($row = $result->fetch_assoc()) {
				$arr = $row;
				}
			}
			
			$query="SELECT * FROM `tbl_chars_name` WHERE `tbl_job_section_id_job_section`='$id'";
			$result = $db->query($query) or die($mysqli->error.__LINE__);
			$chars = array();
			if($result->num_rows > 0) {				
				while($row = $result->fetch_assoc()) {				
				$chars[]= $row;						
				}
			}
			
			$arr["charNames"] = $chars;

			$query="SELECT * FROM tbl_job_section, tbl_category, tbl_jobs WHERE tbl_job_section.id_job_section = 1 AND tbl_category.id_category = (SELECT tbl_category_id_category FROM tbl_job_section_has_tbl_category WHERE tbl_job_section_id_job_section = 1)AND tbl_jobs.tbl_job_section_id_job_section = '$id'";
			$result = $db->query($query) or die($mysqli->error.__LINE__);
			$jobs = array();
			
			if($result->num_rows > 0) {
				$i = 0;
				while($row = $result->fetch_assoc()) {				
					$jobs[$i] = $row;
					$id_jobs = $jobs[$i]["id_jobs"];					
					
					$queryIn2 = "SELECT * FROM  `tbl_chars` INNER JOIN  `tbl_chars_name` ON tbl_chars.tbl_chars_name_id_chars_name = tbl_chars_name.id_chars_name WHERE  `id_chars` IN (SELECT  `tbl_chars_id_chars` FROM  `tbl_jobs_has_tbl_chars` WHERE  `tbl_jobs_id_jobs` =  '$id_jobs')";
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