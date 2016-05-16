'use strict';

var app = angular.module('instrumentsModelModule', []);

app.service('InstrumentsModel', function(InstrumentsFactory){
	var instruments = {};
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
	
//instruments methods
	//instrumets list
	instruments.getInstruments = function() {
		try {			
			var getInstruments = InstrumentsFactory.query(function(response){
				if(processResult(response)) {
					instruments.instruments = response;
				}
			}); 
		}catch (e){
			alert("Произошла ошибка. Попробуйте позже или сообщите администратору. Ошибка:" + e);
		}		
	}
	instruments.getInstruments();
	
	//add instrument
	instruments.addInstrument = function(instrument){
		instrument["price-usd"] = toFloat(instrument["price-usd"]);
		instrument["life-time"] = toFloat(instrument["life-time"]);
		var addInstrument = new InstrumentsFactory();		
		addInstrument = copyObject(addInstrument, instrument);		
		addInstrument.$save(function(response){			
			if(processResult(response)) {
					if (response.id) instrument.id = response.id;
					instruments.instruments.push(instrument);
			}
		}, function(error){
			alert("Запрос не удался. Ошибка: " + error);
		});
	};
	
	// delete instrument
	instruments.deleteInstrument = function(id) {
		if (!confirm("Вы уверены, что хотите удалить этот материал?")) return;
		var deleteInstrument = new InstrumentsFactory();
		deleteInstrument.id = id;
		deleteInstrument.$delete({id: id}, function(response){
			if(processResult(response)) {
				instruments.instruments.forEach(function(item, i, items){
					if(item.id == id) {
						items.splice(i,1);
					}
				});	
			}
		}, function(error){
			alert("Запрос не удался. Ошибка: " + error);
		});
	}
	
	//change instrument
	instruments.changeInstrument = function(instrument){		
		instrument["price-usd"] = toFloat(instrument["price-usd"]);
		instrument["life-time"] = toFloat(instrument["life-time"]);
		var changeInstrument = new InstrumentsFactory();		
		changeInstrument = copyObject(changeInstrument, instrument);		
		changeInstrument.$update(function(response){			
			if(processResult(response)) {
					instruments.instruments.forEach(function(item, i, items){
						if (item.id == instrument.id) {							
							items[i] = copyObject(items[i], instrument);
						}
					});
			}
		}, function(error){
			alert("Запрос не удался. Ошибка: " + error);
		});
	};
	
//RESULTS
	return instruments;
});