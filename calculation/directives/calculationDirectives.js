'use strict';

var app = angular.module('calculationDirectives', ['calculationModelModule']);

app.directive('dropdownNi', function(CalculationModel){
	return {
		scope: {},
		restrict: "E",
		templateUrl: "calculation/directives/dropdown-ni.html",		
		link: function(scope, element, attrs){	
			scope.calculation = CalculationModel; 
			scope.changeNI = function(){
				scope.calculation.numIndicators.forEach(function(item, i, arr){				
					arr[item.alias] = Number(item.value) || 0;					
				});
				scope.calculation.changed();
			}
		}
	}
});

app.directive('calculationJobs',['CalculationModel', 'JobsModel', function(CalculationModel, JobsModel){
	return {
		scope: {},
		restrict: "E",
		templateUrl: "calculation/directives/calculation-jobs.html",		
		link: function(scope, element, attrs){
			var calculation = scope.calculation = CalculationModel;
			scope.oneJob = {
				price: 0
			};
			scope.showAddUserJob = false;
			var jobCalculate = JobsModel.jobCalculate;			
						
			scope.addUserJob = function(oneJob) {
				var jobsArr = calculation.jobs, job;
				
				job = {
					made_by_user: true,
					id: "Польз",			
					materials: []
				}
				
				job.copyObject(oneJob);
				jobsArr.unshift(job);
				calculation.jobChanged(job);		
				
				scope.oneJob = {};
			}
			
			scope.calculateUserJob = function(oneJob) {
				var ni = calculation.numIndicators;
				if (!oneJob['job-rank'] || !oneJob['human-hour']) {
					oneJob.price = 0;
					return;
				}
				
				oneJob.number = oneJob.number?oneJob.number:0;				
				oneJob = jobCalculate(oneJob, ni);			
			}
					
			console.log("scope", scope);
		}
	}
}]);
/*
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