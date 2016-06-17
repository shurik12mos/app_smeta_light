'use strict';

var app = angular.module('calculationDirectives', ['calculationModelModule']);

app.directive('dropdownNi', function(){
	return {
		restrict: "E",
		templateUrl: "calculation/directives/dropdown-ni.html",		
		link: function(scope, element, attrs){				
			scope.changeNI = function(){
				scope.calculation.changed();
			}
		}
	}
});
/*
app.directive('jobsCategory', function(){
	return {
		restrict: "E",
		templateUrl: "jobs/directives/jobsCategory.html",		
		link: function(scope, element, attrs){
			
		}
	}
});

app.directive('addJobsSection', function(){
	return {
		restrict: "E",
		templateUrl: "jobs/directives/addJobsSection.html",		
		link: function(scope, element, attrs){
			
		}
	}
});

app.directive('jobsSection', function(){
	return {
		restrict: "E",
		templateUrl: "jobs/directives/jobsSection.html",		
		link: function(scope, element, attrs){
			
		}
	}
});

app.directive('job', function(JobsModel){
	return {
		restrict: "E",
		templateUrl: "jobs/directives/job.html",		
		link: function(scope, element, attrs){
			scope.changeJobChar = function(char1, index) {
				char1.values.forEach(function(item, i) {
					if (index==i) {
						item.active=true;
					} else {
						item.active=false;
					}
				});				
				scope.jobs.chooseOneJob();
			}
		}
	}
});

app.directive('addJob', function(){
	return {
		restrict: "E",
		templateUrl: "jobs/directives/addJob.html",		
		link: function(scope, element, attrs){
			scope.remove = function(target, i) {				
				target.splice(i,1);
			}
		}
	}
});
*/