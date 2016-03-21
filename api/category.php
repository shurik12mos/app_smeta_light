<?php
	require('config.php'); 
	
		
	if( $_SERVER['REQUEST_METHOD'] == 'GET') {
		
		// выбираем базу данных
		$db->select_db("smeta_simple");
		
		if (!$_GET["category_id"]) {
			$query="SELECT * FROM tbl_category GROUP BY `category_name`";
			$result = $db->query($query) or die($mysqli->error.__LINE__);
			 
			$arr = array();
			if($result->num_rows > 0) {
				while($row = $result->fetch_assoc()) {
				$arr[] = $row;
				}
			}
		} elseif ($_GET["category_id"]) {
			$id = $_GET["category_id"];
			$query="SELECT * FROM tbl_job_section WHERE `job_section_id` = (SELECT `job_section_id` FROM `tbl_job_section_has_tbl_category` WHERE `category_id` = '$id') GROUP BY `job_section_name`";
			$result = $db->query($query) or die($mysqli->error.__LINE__);
			 
			$arr = array();
			if($result->num_rows > 0) {
				while($row = $result->fetch_assoc()) {
				$arr[] = $row;
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
			
		$query="INSERT INTO `tbl_category`(`category_name`, `category_description`) VALUES ('$name', '$desc')";
		$result = $db->query($query) or die($mysqli->error.__LINE__);
		 
		$db->close();	 
		# JSON-encode the response
		return $json_response = json_encode($ar);
		
		
	}
	
	if( $_SERVER['REQUEST_METHOD'] == 'PUT') {
		header('Content-type: application/json; charset=utf-8');	
		$params = trim(file_get_contents('php://input'));
		$ar=json_decode($params);
		$ar = (array)$ar;	
		$id = (int) $ar["category_id"];
		$name = $ar["name"];
		$desc = $ar["desc"];
		
		// выбираем базу данных
		$db->select_db("smeta_simple");
		
		$query="UPDATE `tbl_category` SET `category_name`= '$name', `category_description` = '$desc' WHERE `category_id` = '$id'";		
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
		
		$query="DELETE FROM `tbl_category` WHERE `category_id` = '$id'";
		$result = $db->query($query) or die($mysqli->error.__LINE__);
				 
		$db->close();	 
		# JSON-encode the response
		echo $json_response = json_encode($id);
	}
	
	
?>