<?php

// подключаемся к серверу баз данных MySQL
		$db = new mysqli("localhost", "root", "");

		// устанавливаем кодировку общения с MySQL
		$db->query("SET NAMES 'utf8'");	
		
?>