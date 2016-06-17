'use strict';

var app = angular.module('myApp.listCalculations', ['ngResource', 'ngRoute', 'listCalculationsModelModule']);
app.controller('ListCalculationsCtrl', [	
	'$http',
	'$scope',
	'$location',
	'listCalculationsModel',
	function($http, $scope, $location, listCalculationsModel) {	
	var scope = $scope;	
	scope.listCalculations = listCalculationsModel;		
}]);

app.factory('ListCalculations', function($resource){
	var ListCalculations = $resource('api/listCalculations/listCalculations.php',	
			{},
			{
				update: {
						method: "PUT"
						}
			}
		); 
		return ListCalculations;
	});

