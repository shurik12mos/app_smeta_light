'use strict';

var app = angular.module('myApp.commonChar', ['ngResource', 'ngRoute', 'commonCharModelModule']);
app.controller('CommonCharCtrl', [	
	'$http',
	'$scope',
	'CommonCharModel',
	function($http, $scope, CommonCharModel) {	
	var scope = $scope;	
	scope.feature = CommonCharModel;	
}]);

app.factory('CommonCharFactory', function($resource){
	var CommonCharFactory = $resource('api/commonChar/commonChar.php',	
			{},
			{
				update: {
						method: "PUT"
						}
			}
		); 
		return CommonCharFactory;
	});
	
app.directive('commonChars', function(CommonCharModel){
	return {
		restrict: "E",
		templateUrl: "commonChar/directives/CommonChar.html",		
		link: function(scope, element, attrs){
			
		}
	}
});

app.directive('addChar', function(CommonCharModel){
	return {
		restrict: "E",
		templateUrl: "commonChar/directives/addChar.html",		
		link: function(scope, element, attrs){
			function cleanForm () {
				element.find('input').val("");				
				element.find('textarea').val("");	
			}
			
			scope.form.values = [];
			scope.form.values[0] = {number: 0};			
			scope.addValue = function(){
				var length = scope.form.values.length;
				scope.form.values.unshift({});
			}
			
			scope.delValue = function(number) {
				if (scope.form.values.length==1) {
					alert("Должно быть хотя бы 1 значение!");
					return;
				}
				scope.form.values.splice(number,1);
			}
			
			scope.addChar = function(form) {
				if (form.values.length==0 || !form.values.length) {
					alert("Должно быть хотя бы одно значение характеристики.");
					return;
				}
				for (var i=0;i<form.values.length;i++) {
					var item = form.values[i];
					item.coefficient = item.coefficient.replace(new RegExp(",",'g'),".");					
					if (!isFinite(item.coefficient)) {
						alert("Коэффициент должен быть числом");
						return;
					} 			
				};
				
				scope.feature.addChar(form)
				cleanForm();		
				scope.showAddChar = false;
			}
		}
	}
});

app.directive('charValue', function(){
	return {
		restrict: "E",
		templateUrl: "commonChar/directives/charValue.html",		
		link: function(scope, element, attrs){
			
		}
	}
});

app.directive('changeChar', function(){
	return {
		restrict: "E",
		templateUrl: "commonChar/directives/changeChar.html",		
		link: function(scope, element, attrs){
			
			scope.changeChar = angular.copy(scope.oneChar);		
								
			scope.addValue = function(){				
				var length = scope.changeChar.values.length;
				scope.changeChar.values.unshift({});
			}
			
			scope.delValue = function(number) {
				if (scope.changeChar.values.length==1) {
					alert("Должно быть хотя бы 1 значение!");
					return;
				}
				scope.changeChar.values.splice(number,1);
			}
			
			scope.editChar = function(changeChar) {
				for (var i=0;i<changeChar.values.length;i++) {
					var item = changeChar.values[i];
					item.coefficient = item.coefficient.replace(new RegExp(",",'g'),".");					
					if (!isFinite(item.coefficient)) {
						alert("Коэффициент должен быть числом");
						return;
					} 			
				};
				
				scope.feature.changeChar(changeChar);						
				scope.showChangeChar = false;
			}
		}	
	}
});