<?php

// Проверка корректности данных
function clean($value = "") {
    $value = trim($value);
    $value = stripslashes($value);
    $value = strip_tags($value);
    $value = htmlspecialchars($value);
    
    return $value;
}		

// выполнение запроса. Если неудачный результат, то изменение глобальной переменной для запроса.
function do_query($query){
	global $general_result, $db, $result_message, $result_error;
	$result = $db->query($query);
	
	if (isset($result) && isset($db)) {		
		if ($result===false) {
			$general_result = false;
			$result_error = $db->error;
			$result_message = "Запрос не получился";
			return $result;
		} else {
			return $result;
		}	
	}
}

// завершение транзакции. В случае неудачных запросов к БД - откат изменений. 
//(Только для множественных запросов /INSERT, UPDATE, DELETE / к БД)
function end_transaction() {
	global $general_result, $result_message, $result_error, $db;
	
	if (isset($general_result) && $general_result) {
		$comit = $db->commit();
		
		if ($comit) {
			$general_result = true;
			$result_message = "Данные записаны. Транзакция завершена.";
			$result_error = true;
		} else {
			$general_result = false;
			$result_message = "Произошла ошибка. Во время фиксации транзакции произошла ошибка.";
			$result_error = $comit;
		}
	} else {
		$comit = $db->rollback();
		
		if ($comit) {
			$general_result = false;
			$result_message = "Произошла ошибка при записи данных. Транзакция успешно отменена.";
			$result_error = $result_error;
		} else {
			$general_result = false;
			$result_message = "Произошла ошибка. При записи данных произошла ошибка. Транзакция не отменена. ВНИМАНИЕ! Целостность данных может быть нарушена.";
			$result_error = $comit;
		}
	}
}


// Проверка результатов запросов, определение переменных о результатах.
function end_result($is_select) {
	global $general_result, $result_message, $result_error;
	
	if (!$is_select) {
		if (isset($general_result) && $general_result) {
			$general_result = true;		
			$result_message = "Данные записаны.";		
		} else {
			$general_result = false;	
			$result_message = "Произошла ошибка";	
		}
	} else {
		if (isset($general_result) && $general_result) {
			$general_result = true;		
			$result_message = "Данные получены.";		
		} else {
			$general_result = false;	
			$result_message = "Произошла ошибка";	
		}
	}
}

function make_answer($answer, $is_select) {
	global $general_result, $result_message, $result_error;
	
	if ($is_select && !$general_result) {
		$answer[0]["result"] = $general_result;
		$answer[0]["message"] = $result_message;
		$answer[0]["error"] = $result_error;
	}
	if (!$is_select) {
		$answer["result"] = $general_result;
		$answer["message"] = $result_message;
		$answer["error"] = $result_error;
	}	
	
	return $answer;
}
?>