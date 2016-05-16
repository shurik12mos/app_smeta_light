'use strict';

var app = angular.module('commonCharModelModule', []);

app.service('CommonCharModel', function(CommonCharFactory){
	var  feature = {};
//private methods
		//Обработка результатов. В случае неудачи выдает сообщение с кодом ошибки.
		function processResult(response){			
			if (Array.isArray(response) || (({}.toString).call(response).slice(8, -1)=="Array")) {
				if (response[0]["result"] && response[0]["result"]==false) {
					alert(response[0]["message"]+ "Код ошибки: " + response[0]["error"]);
					return false;
				}else {
					return true;
				};
			}else if (typeof response === "object") {
				if (response.result===false) {
					alert(response.message + "Код ошибки: " + response.error);
					return false;
				}else {
					return true;
				}
			} else {
				alert ("Ответ сервера не является объектом или массивом. Ответ: " + response);
				return false;
			}
		};
		// Копирование свойств объекта
		function copyObject (objectTo, objectFrom) {
			if (objectTo && objectFrom) {
				for (var prop in objectFrom) {
					objectTo[prop] = objectFrom[prop];
				}
			}
			
			return objectTo;
		}
		
		// Преобразует к числу, оставляя 2 знака после запятой
		function toFloat(n) {
			 n=n.toString(); 
			 n=n.split(",").join(".");
			 if (!isNaN(parseFloat(n)) && isFinite(n)) {
				n =  parseFloat(n).toFixed(2);
				return  n
			 } else {
				 false
			 }	
		}
		
//variables for view
	
//feature methods
	//get char list
	feature.getChar = function() {
		try {			
			var getChar = CommonCharFactory.query(function(response){
				if(processResult(response)) {
					feature.chars = response;					
				}
			}); 
		}catch (e){
			alert("Произошла ошибка. Попробуйте позже или сообщите администратору. Ошибка:" + e);
		}		
	}
	feature.getChar();
	
	//add char
	feature.addChar = function(oneChar){		
		//oneChar.values.forEach(function(item, i, items){
		//	item.coefficient = toFloat(item.coefficient);
		//});		
		var addChar = new CommonCharFactory();		
		addChar = copyObject(addChar, oneChar);			
		addChar.$save(function(response){			
			if(processResult(response)) {
					if (response.id) oneChar.id = response.id;
					feature.chars.push(oneChar);					
			}
		}, function(error){
			alert("Запрос не удался. Ошибка: " + error);
		});
	};
	
	// delete char	
	feature.deleteChar = function(id) {
		if (!confirm("Вы уверены, что хотите удалить эту характеристику?")) return;
		var delChar = new CommonCharFactory();
		delChar.id = id;
		delChar.$delete({id: id}, function(response){			
			if(processResult(response)) {					
				feature.chars.forEach(function(item, i, items){
					if (item.id == id) {
						items.splice(i,1);
					}
				});
			}
		}, function(error){
			alert("Запрос не удался. Ошибка: " + error);
		});
	}
	
	
	//change char
	feature.changeChar = function(oneChar){				
		var changeChar = new CommonCharFactory();		
		changeChar = copyObject(changeChar, oneChar);
		changeChar.$update(function(response){			
			if(processResult(response)) {
				feature.chars.forEach(function(item, i, items){
					if (item.id == oneChar.id) {
						items[i] = oneChar;
					}
				});									
			}
		}, function(error){
			alert("Запрос не удался. Ошибка: " + error);
		});
	};
	
	
//RESULTS  
	return feature;
});