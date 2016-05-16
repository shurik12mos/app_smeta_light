<?php
	require('../config.php'); 
	require('../common.php'); 
	
	$general_result = true;
	$result_message = "";
	$result_error;
		
	if( $_SERVER['REQUEST_METHOD'] == 'GET') {
		
		// выбираем базу данных
		$db->select_db("smeta_simple");
		
		
		if ($_GET["material_category_id"]){
			$id = $_GET["material_category_id"];
			$query="SELECT * FROM tbl_material_section WHERE `material_category_id`='$id'";
			$result = $db->query($query) or die($mysqli->error.__LINE__);
			
			$arr = array();
			if($result->num_rows > 0) {
				while($row = $result->fetch_assoc()) {
				$arr[] = $row;
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
		
		// выбираем базу данных
		$db->select_db("smeta_simple");
		
		$params = trim(file_get_contents('php://input'));
		$ar=json_decode($params);
		$ar = (array)$ar;			
		
		$id = clean((int) $ar["material_category_id"]);
		$name = clean($ar["name"]);
		$desc = clean($ar["description"]);
		if ($ar["keywords"]) {
			$keywords = clean($ar["keywords"]);
		} else {
			$keywords = "Не заполнено";
		}
		
		$query="INSERT INTO `tbl_material_section`(`name`, `description`, `keywords`, `material_category_id`) VALUES ('$name', '$desc', '$keywords', '$id')";
		$result = do_query($query);		
		
		$arr = array();
		$arr["id"] = $db->insert_id;
		end_result(false);		
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
		$desc = clean($ar["description"]);
		if ($ar["keywords"]) {
			$keywords = clean($ar["keywords"]);
		} else {
			$keywords = "Не заполнено";
		}
				
		// выбираем базу данных
		$db->select_db("smeta_simple");
		
		$query="UPDATE `tbl_material_section` SET `name`= '$name', `description` = '$desc', `keywords` = '$keywords' WHERE `id` = '$id'";		
		$result = do_query($query);
		
		$arr = array();		
		end_result(false);		
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
		
		$query="DELETE FROM `tbl_material_section` WHERE `id` = '$id'";		
		$result = do_query($query);	

		$arr = array();
		$arr["id"] = $db->insert_id;
		end_result(false);		
		$arr = make_answer($arr, false);
		echo $json_response = json_encode($arr);		
		
		$db->close();		
	}
	
?>