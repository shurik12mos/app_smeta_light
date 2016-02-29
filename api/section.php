<?php
	require('config.php'); 
	
		
	if( $_SERVER['REQUEST_METHOD'] == 'GET') {
		
		// выбираем базу данных
		$db->select_db("smeta_simple");
		if ($_GET["id_category"]) {
			$id = $_GET["id_category"];
			$query="SELECT * FROM tbl_job_section WHERE `id_job_section` IN (SELECT `tbl_job_section_id_job_section` FROM `tbl_job_section_has_tbl_category` WHERE `tbl_category_id_category` = '$id')";
			$result = $db->query($query) or die($mysqli->error.__LINE__);
			
			$arr = array();
			if($result->num_rows > 0) {
				while($row = $result->fetch_assoc()) {
				$arr[] = $row;
				}
			}
		}	
		
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
		$id_category = $ar["id_category"];		
		
		$query="INSERT INTO `tbl_job_section`(`name`, `description`, `keywords`) VALUES ('$name', '$desc', '$keywords')";
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
		$id = (int) $ar["id_job_section"];
		$name = $ar["name"];
		$desc = $ar["description"];
		$keywords = $ar["keywords"];
		
		// выбираем базу данных
		$db->select_db("smeta_simple");
		
		$query="UPDATE `tbl_job_section` SET `name`= '$name', `description` = '$desc', `keywords` = '$keywords' WHERE `id_job_section` = '$id'";		
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
		
		$query="DELETE FROM `tbl_job_section` WHERE `id_job_section` = '$id'";
		$result = $db->query($query) or die($mysqli->error.__LINE__);		 
		 
		$db->close();	 
		# JSON-encode the response
		echo $json_response = json_encode($id);
	}
	
	
?>