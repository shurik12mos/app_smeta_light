<?php
	require('config.php'); 
	
		
	if( $_SERVER['REQUEST_METHOD'] == 'GET') {
		
		// выбираем базу данных
		$db->select_db("smeta_simple");
		if ($_GET["category_id"]) {
			$id = $_GET["category_id"];
			$query="SELECT * FROM tbl_job_section WHERE `job_section_id` IN (SELECT `job_section_id` FROM `tbl_job_section_has_tbl_category` WHERE `category_id` = '$id')";
			$result = $db->query($query) or die($mysqli->error.__LINE__);
			
			$arr = array();
			if($result->num_rows > 0) {
				while($row = $result->fetch_assoc()) {
				$arr[] = $row;
				}
			}
		}	
		
		if ($_GET["section_id"]){
			$id = $_GET["section_id"];
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
					$chars = $row;					
				}
			}
			
			$arr["sadas"] = $chars;

			$query="SELECT * FROM `tbl_jobs` WHERE `job_section_id`='$id'";
			$result = $db->query($query) or die($mysqli->error.__LINE__);
			
			if($result->num_rows > 0) {
				$i = 0;
				while($row = $result->fetch_assoc()) {				
					$arr["jobs"][$i] = $row;
					$id_jobs = $arr["jobs"][$i]["id_jobs"];
					$arr["jobs"][$i]["sas"] = $id_jobs;
					
					$queryIn2 = "SELECT * FROM  `tbl_chars` WHERE  `chars_id` IN (SELECT  `chars_id` FROM  `tbl_jobs_has_tbl_chars` WHERE  `jobs_id` =  '$id_jobs')";
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
		
		$name = $ar["name"];
		$desc = $ar["desc"];	
		$keywords = $ar["keywords"];
		$id_category = $ar["category_id"];		
		
		$query="INSERT INTO `tbl_job_section`(`job_section_name`, `job_section_description`, `job_section_keywords`) VALUES ('$name', '$desc', '$keywords')";
		$result = $db->query($query) or die($mysqli->error.__LINE__);
		
		$id_section = $db->insert_id;		
		$query="INSERT INTO `tbl_job_section_has_tbl_category` (`job_section_id`, `category_id`) VALUES ('$id_section', '$id_category')";
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
		$id = (int) $ar["job_section_id"];
		$name = $ar["name"];
		$desc = $ar["description"];
		$keywords = $ar["keywords"];
		
		// выбираем базу данных
		$db->select_db("smeta_simple");
		
		$query="UPDATE `tbl_job_section` SET `job_section_name`= '$name', `job_section_description` = '$desc', `job_section_keywords` = '$keywords' WHERE `job_section_id` = '$id'";		
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
		$id = (int) $_GET["job_section_id"];
		
		// выбираем базу данных
		$db->select_db("smeta_simple");
		
		$query="DELETE FROM `tbl_job_section` WHERE `job_section_id` = '$id'";
		$result = $db->query($query) or die($mysqli->error.__LINE__);		 
		 
		$db->close();	 
		# JSON-encode the response
		echo $json_response = json_encode($id);
	}
	
	
?>