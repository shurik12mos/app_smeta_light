'use strict';

var app = angular.module('myApp.instruments', ['ngResource', 'ngRoute', 'instrumentsModelModule']);
app.controller('InstrumentsCtrl', [	
	'$http',
	'$scope',
	'InstrumentsModel',
	function($http, $scope, InstrumentsModel) {	
	var scope = $scope;	
	scope.instruments = InstrumentsModel;	
}]);

app.factory('InstrumentsFactory', function($resource){
	var InstrumentsFactory = $resource('api/instruments/instruments.php',	
			{},
			{
				update: {
						method: "PUT"
						}
			}
		); 
		return InstrumentsFactory;
	});
	
app.directive('instrument', function(InstrumentsModel){
	return {
		restrict: "E",
		templateUrl: "instruments/directives/instrument.html",		
		link: function(scope, element, attrs){
			
		}
	}
});

app.directive('addInstrument', function(InstrumentsModel){
	return {
		restrict: "E",
		templateUrl: "instruments/directives/addInstrument.html",		
		link: function(scope, element, attrs){
			
		}
	}
});

app.directive('changeInstrument', function(InstrumentsModel){
	return {
		restrict: "E",
		templateUrl: "instruments/directives/changeInstrument.html",		
		link: function(scope, element, attrs){
			var val = [];
			
			
			
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
			
			scope.name = scope.oneInstrument.name;
			scope.characteristics = scope.oneInstrument.characteristics;
			scope.priceUsd = scope.oneInstrument['price-usd'];
			scope.lifeTime = scope.oneInstrument['life-time'];
			scope.keywords = scope.oneInstrument.keywords;
			
			scope.hide = function(){
				scope.showChangeInstrument = false;
			}
			
			scope.checkForm = function(){				
				if (!toFloat(scope.priceUsd)) {
					alert("Цена должна быть числом");
					return;
				}
				if (!toFloat(scope.priceUsd)) {
					alert("Число часов работы должно быть числом");
					return;
				}
				
				var instrument = {};
				instrument.id = scope.oneInstrument.id;
				instrument.name = scope.name;
				instrument.characteristics = scope.characteristics;
				instrument['price-usd'] = scope.priceUsd;
				instrument['life-time'] = scope.lifeTime;
				instrument.keywords = scope.keywords;
				
				scope.instruments.changeInstrument(instrument);
				scope.hide();
			}
		}
	}
});