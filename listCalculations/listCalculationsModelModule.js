'use strict';

var app = angular.module('listCalculationsModelModule', []);

app.service('listCalculationsModel', function(ListCalculations){
	var listCalculations = new Object();
	listCalculations.query = function () {
		try {		
			var query = ListCalculations.query(function(response){		
				if(processResult(response)) {
					listCalculations.list = response;					
				}				
			}, function(error){
				alert("Запрос не удался. Ошибка: " + error);
			});			 
		}catch (e){
			alert("Произошла ошибка. Попробуйте позже или сообщите администратору. Ошибка:" + e);
		}
	}	
	
	listCalculations.query();
	listCalculations.deleteCalc = function(kp) {
		var deleteCalc = new ListCalculations();
		deleteCalc.kp = kp.toString();
		console.log(deleteCalc);
		deleteCalc.$remove({kp: kp}, function(response){			
			if(processResult(response)) {
				listCalculations.query();					
			}else {
				console.log(response);
			}
		}, function(error){			
			alert("Запрос не удался. Ошибка: " + error);
		});
	}
	
	return listCalculations;
	
	/*var nis = new Object(),ni_copy = {};	
//private methods
	//get list of NI
	function query(factory) {
		try {		
			var query = factory.query(function(response){		
				if(processResult(response)) {
					query = response;
					haveGet(response);
				}				
			}, function(error){
				alert("Запрос не удался. Ошибка: " + error);
			});			 
		}catch (e){
			alert("Произошла ошибка. Попробуйте позже или сообщите администратору. Ошибка:" + e);
		}finally {
			return query;
		}	
	}	
	
	//called when have get list of NI
	function haveGet(response) {		
		if (!response || !response.forEach) return;
		response.forEach(function(item) {
			nis[item.alias] = item.value;
		});
	};

	function save(item) {
		var ni = new NumericIndicators();
		ni.copyObject(item);
		if(toFloat(ni.value)) {
			ni.value = toFloat(ni.value);
		}else {
			alert("Значение должно быть числом");
			return false;
		}			
		ni.$update(function(response){
			if(processResult(response)) {				
				nis.list.forEach(function(item ,i ,items){
					if (item.id == ni.id) {
						items[i] = ni;
					}
				});								
			}			
		}, function(error){
			alert("Запрос не удался. Ошибка: " + error);			
		});	
		return true;
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

	//Сохранение нового элемента
	function add(item) {
		var ni = new NumericIndicators();
		ni.copyObject(item);
		if(toFloat(ni.value)) {
			ni.value = toFloat(ni.value);
		}else {
			alert("Значение должно быть числом");
			return false;
		}			
		ni.$save(function(response){
			if(processResult(response)) {				
				nis.getNI();							
			}			
		}, function(error){
			alert("Запрос не удался. Ошибка: " + error);			
		});
		return true;
	}
	
//public methods	
	//get all Numeric Indicators
	nis.getNI = function(){
		nis.list = query(NumericIndicators);		
	}
	nis.getNI();
	
	// prepare changes
	nis.prepareChange = function(item) {
		ni_copy.copyObject(item);
	}
	//save 
	nis.save = function(item) {
		console.log("step1", item);
		if (!save(item)) {			
			return false;
		}else {			
			return true;
		};
	}
	
	nis.undoChange = function(index) {
		if (ni_copy) {
			nis.list[index] = ni_copy;
			ni_copy = {};
		}
	}
	
	//add
	nis.add = function(item) {
		if (!add(item)) return true;
		return false;
	}
//RESULTS  
	return nis;*/
});