'use strict';

var app = angular.module('jobsDirectives', ['jobsModelModule']);

app.directive('addJobsCategory', function(){
	return {
		restrict: "E",
		templateUrl: "jobs/directives/addJobsCategory.html",		
		link: function(scope, element, attrs){
			
		}
	}
});

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

app.directive('chooseJob', function(){
	return {
		restrict: "E",
		templateUrl: "jobs/directives/choose-job.html",		
		link: function(scope, element, attrs){
			scope.chooseJob = function(job) {				
				var target = eval("scope."+attrs.target);				
				var addingJob = new Object(), isExist = false;
				if (!target.jobs) target.jobs=[];
				target.jobs.forEach(function(item){
					if (item.id==job.id) {
						alert("Такая работа уже есть");
						isExist = true;
					}
				});
				if (isExist) return;
				addingJob.copyObject(job);
				addingJob.materials?addingJob.materials:[];
				addingJob.number = 0;
				addingJob.lastNumber = 0;
				addingJob.materials.forEach(function(item,i,items) {
					var existMaterial = false, copyItem = {};
					item.number = Number(item.number);	
					item.price = Number(item.price);					
					target.materials.forEach(function(itemMat){
						if (itemMat.id == item.id) {							
							existMaterial = true;
						}
					});
					if (!existMaterial) {						
						copyItem.copyObject(item);		
						copyItem.number = 0;						
						target.materials.unshift(copyItem);		
					} 			
				});
				addingJob.instruments?addingJob.instruments:[];
				addingJob.instruments.forEach(function(item,i,items) {
					var existInstrument = false, copyItem = {};
					target.instruments.forEach(function(itemInst){
						if (iteminst.id == item.id) {							
							existInstrument = true;
						}
					});
					if (!existInstrument) {						
						copyItem.copyObject(item);						
						target.instruments.unshift(copyItem);	
					}	
				});
				//addingJob.name = addingJob.charInString;				
				target.jobs.unshift(addingJob);
				target.jobChanged(addingJob);
				scope.showchooseJob=false;
			}
		}
	}
});