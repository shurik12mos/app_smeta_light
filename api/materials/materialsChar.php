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
			$query="SELECT * FROM tbl_material_char_name WHERE `material_section_id`='$id'";
			$result = do_query($query);
			
			$arr = array();
			$i=0;
			if($result->num_rows > 0) {
				while($row = $result->fetch_assoc()) {
					$arr[$i] = $row;
					$material_char_name_id = $row["id"];
					
					$query_values = "SELECT DISTINCT `value` FROM tbl_material_char WHERE `material_char_name_id`='$material_char_name_id'";
					$result_values = $db->query($query_values);
					$j=0;
					$arr[$i]["values"] = array();
					while($row_values = $result_values->fetch_assoc()) {
						$arr[$i]["values"][$j] = $row_values;						
						$j=$j+1;
					}
					
					$i=$i+1;
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
		
		$id = clean($ar["material_section_id"]);	
		$name = clean($ar["name"]);
		$measure = clean($ar["measure"]);
		
		$query="INSERT INTO `tbl_material_char_name`(`name`, `measure`, `material_section_id`) VALUES ('$name', '$measure', '$id')";
		$result = do_query($query);		
		
		
		end_result(false);
		$arr = array();
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
				
		// выбираем базу данных
		$db->select_db("smeta_simple");
		
		$query="UPDATE `tbl_material_char_name` SET `name`= '$name', `measure`= '$measure' WHERE `id` = '$id'";		
		$result = do_query($query);
		
		end_result(false);
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
		
		$query="DELETE FROM `tbl_material_char_name` WHERE `id` = '$id'";		
		$result = do_query($query);		 		
		end_result(false);
		$arr = array();
		$arr = make_answer($arr, false);
		echo $json_response = json_encode($arr);		
		
		$db->close();	
	}
	
	
?>