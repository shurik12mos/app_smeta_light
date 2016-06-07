'use strict';

var app = angular.module('myApp.numericIndicators', ['ngResource', 'ngRoute', 'numericIndicatorsModelModule']);
app.controller('NumericIndicatorsCtrl', [	
	'$http',
	'$scope',
	'NumericIndicatorsModel',
	function($http, $scope, NumericIndicatorsModel) {	
	var scope = $scope;	
	scope.numericIndicators = NumericIndicatorsModel;	
}]);

app.factory('NumericIndicators', function($resource){
	var NumericIndicators = $resource('api/numericIndicators/numericIndicators.php',	
			{},
			{
				update: {
						method: "PUT"
						}
			}
		); 
		return NumericIndicators;
	});
	

app.directive('addNi', function(){
	return {
		restrict: "E",
		templateUrl: "numericIndicators/directives/addNI.html",		
		link: function(scope, element, attrs){
			
		}
	}
});
