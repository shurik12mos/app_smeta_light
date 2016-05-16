'use strict';

var app = angular.module('myApp.material', ['materialDirectives', 'ngResource', 'ngRoute', 'materialsModelModule']);
app.controller('MaterialCtrl', [
	'$http',
	'$scope',	
	'MaterialsModel',
	function(
	$http,
	$scope,	
	MaterialsModel) {	
	var scope = $scope;	
	scope.changeCategory = false;	
	scope.model = MaterialsModel;
	scope.canAddMaterial = scope.model.chars?true:false;
	
}]);

app.factory('MaterialCategory', function($resource){
	var MaterialCategory = $resource('api/materials/materialCategory.php',	
			{},
			{
				update: {
						method: "PUT"
						}
			}
		); 
		return MaterialCategory;
	});

app.factory('MaterialSection', function($resource){
	var MaterialSection = $resource('api/materials/materialSection.php',	
			{},
			{
				update: {
						method: "PUT"
						}
			}
		); 
		return MaterialSection;
	});

app.factory('Materials', function($resource){
	var Materials = $resource('api/materials/materials.php',	
			{},
			{
				update: {
						method: "PUT"
						}
			}
		); 
		return Materials;
	});
	
app.factory('MaterialsChar', function($resource){
	var Materials = $resource('api/materials/materialsChar.php',	
			{},
			{
				update: {
						method: "PUT"
						}
			}
		); 
		return Materials;
	});
	
app.factory('MaterialProducers', function($resource){
	var Materials = $resource('api/materials/materialProducers.php',	
			{},
			{
				update: {
						method: "PUT"
						}
			}
		); 
		return Materials;
	});
	
	
app.filter('materialFilter', function() {
  return function(items, producers, chars) {	   
	if (!items) return items;   
	if (!producers) return items;
	if (!chars) return items;
	
	// Функция филтрации массива по свойствам.
	function filterArray (result, chars) {
		if (!result) return result;
		if(!chars) return result;
		if (chars.length<1) return result;
		
		var resultArray = [];
		
		result.forEach(function(item){
			var evenOneTime = false;
			var lowerCaseItem = item.charInString.toLowerCase();
			for (var i=0, len=chars.length; i<len; i++) {
				
				if (lowerCaseItem.indexOf(chars[i]) !== -1) {
					evenOneTime = true;
				}
			}
			if (evenOneTime) {
				resultArray.push(item);
			}
			
		});
		
		return resultArray;
	}
	
	var result = [];
	var prodArr=[];
	
	// Фильтрация по производителю
	producers.forEach(function(prodItem,i,producers) {		
		if (prodItem.active) {
			prodArr.push(prodItem.id);			
		}
	});
	
	if (prodArr.length!=0) {
		items.forEach(function(item, j, items) {		
			for (var k = 0; k<prodArr.length; k++) {
				if (item.producer_id == prodArr[k]) {
					result.push(item);
				}
			}		
		});
	} else {
		result = items;
	}	
	
	// Фильтрация по свойствам (!!!!!!!!!!!!!!!! Неправильная фильтрация. используется поиск по строковому совпадению названия характеристик
	// лучше сделать совпадение по id)
	var resultChar = [];
	var resultFilterChar = [];
	var string="";
	for (var i=0; i<chars.length; i++) {
		resultChar[i] = [];		
		for (var j=0; j<chars[i].values.length; j++) {			
			var value = chars[i].values[j];			
			if (value.active) {							
				string = chars[i].name + " " + value.value + " " + chars[i].measure;
				string = string.toLowerCase();
				resultChar[i].push(string);
				resultChar.notEmpty = true;
			}			
		}
	}
	
	if (resultChar.notEmpty) {		
		for (var i = 0, len = resultChar.length; i<len; i++) {			
			result = filterArray(result, resultChar[i]);
		}		
	}
	
	return result;	
  }
});

app.filter('producerFilter', function() {
  return function(items, id) {
	if (!items) return items;
	if (!id) return id;
	  
	var result = items.filter(function(item){
		if (item.material_category_id == id) return true;
		return false;
	});  
	
	return result
  }
});