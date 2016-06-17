'use strict';

var app = angular.module('myApp.jobs', ['jobsDirectives', 'ngResource', 'ngRoute', 'jobsModelModule', 'numericIndicatorsModelModule']);
app.controller('JobsCtrl', [
	'$http',
	'$scope',	
	'JobsModel',
	'InstrumentsModel',
	'MaterialsModel',
	'NumericIndicatorsModel',
	function(
	$http,
	$scope,	
	JobsModel,
	InstrumentsModel,
	MaterialsModel,
	NumericIndicatorsModel) {	
	var scope = $scope;		
	scope.jobs = JobsModel;
	scope.instruments = InstrumentsModel;
	scope.model = MaterialsModel;
	scope.ni = NumericIndicatorsModel;	
}]);

app.factory('JobsCategory', function($resource){
	var JobsCategory = $resource('api/jobs/jobsCategory.php',	
		{},
		{
			update: {
					method: "PUT"
					}
		}
	); 
	return JobsCategory;
});

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

