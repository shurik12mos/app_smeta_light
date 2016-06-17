'use strict';

var app = angular.module('myApp.calculation', ['calculationDirectives', 'ngResource', 'ngRoute', 'calculationModelModule']);
app.controller('CalculationCtrl', [
	'$http',
	'$scope',
	'$routeParams',
	'$location',
	'JobsModel',
	'InstrumentsModel',
	'MaterialsModel',
	'NumericIndicatorsModel',
	'CalculationModel',
	function(
	$http,
	$scope,
	$routeParams,
	$location,
	JobsModel,
	InstrumentsModel,
	MaterialsModel,
	NumericIndicatorsModel,
	CalculationModel) {	
	$scope.params = $routeParams;	
	var scope = $scope;		
	scope.jobs = JobsModel;
	scope.instruments = InstrumentsModel;
	scope.model = MaterialsModel;
	scope.ni = NumericIndicatorsModel;	
	scope.calculation = CalculationModel;	
	scope.calculation.getCalc();
	
	scope.addComment = function(item) {
		var time = new Date().toLocaleTimeString();
		var date = new Date().toDateString();
		var allDate = time + "; " + date;
		scope.calculation.comments.unshift(
			{
				text: item.text,
				date: allDate,
				name: "Саша"
			}
		);
	}	
}]);


app.factory('CalculationItem', function($resource){
	var CalculationItem = $resource('api/calculation/calculation.php',	
		{},
		{
			update: {
					method: "PUT"
					}
		}
	); 
	return CalculationItem;
});
/*
app.factory('JobsSections', function($resource){
	var JobsSections = $resource('api/jobs/jobsSections.php',	
		{},
		{
			update: {
					method: "PUT"
					}
		}
	); 
	return JobsSections;
});

app.factory('Jobs', function($resource){
	var Jobs = $resource('api/jobs/job.php',	
		{},
		{
			update: {
					method: "PUT"
					}
		}
	); 
	return Jobs;
});
*/
