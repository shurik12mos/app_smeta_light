'use strict';

var app = angular.module('myApp.jobs', ['jobsDirectives', 'ngResource', 'ngRoute', 'jobsModelModule']);
app.controller('JobsCtrl', [
	'$http',
	'$scope',	
	'JobsModel',
	'InstrumentsModel',
	'MaterialsModel',
	function(
	$http,
	$scope,	
	JobsModel,
	InstrumentsModel,
	MaterialsModel) {	
	var scope = $scope;		
	scope.jobs = JobsModel;
	scope.instruments = InstrumentsModel;
	scope.model = MaterialsModel;
	
	//console.log(scope.jobs.processResult);
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

