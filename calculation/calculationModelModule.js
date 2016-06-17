'use strict'

var app = angular.module('calculationModelModule', ['ngRoute']);

app.factory('CalculationModel', ['$routeParams' , '$location', '$route', 'CalculationItem', 'NumericIndicatorsModel', 'JobsModel',  function($routeParams, $location, $route, CalculationItem, NumericIndicatorsModel, JobsModel){
	var date = new Date();	
	var ni = NumericIndicatorsModel;
	var jobs = JobsModel;
	var calculation = {
		kp: null,
		date: date.toDateString(),
		object_name: "",
		maker_name: "",
		customer_name: "",
		responsible_name: "",
		contact_phone: null,
		contact_mail: "",
		other_info: "",
		jobs: [],
		materials: [],
		instruments: [],	
		comments: [],
		numIndicators: [],
		niPromise: ni.list.$promise
	}	

	function getSum() {
		calculation.sum = Number(calculation.sum_materials)+ Number(calculation.sum_jobs);
		return calculation;
	}
	
	function getSumMaterials() {				
		if (!calculation.materials || !calculation.materials.length) return 0;
		var result = calculation.materials.reduce(function(sums, current){
			sums += current.price*current.number;				
			return sums;				
		},0)
		
		calculation.sum_materials = result.toFixed(2);
		return calculation;
	}
	
	function getSumJobs() {
		if (!calculation.jobs || !calculation.jobs.length) return 0;		
		var result = calculation.jobs.reduce(function(sum, current){			
			sum += current.sum;
			return sum;
		},0);		
		calculation.sum_jobs = Number(result);
		return calculation;
	};
		
	function getSumInstruments() {
		if (!calculation.jobs || !calculation.jobs.length) return 0;
		var result = calculation.jobs.reduce(function(sum, current){
			sum += (current['human-hour']*ni.cost_hour).toFixed(2);
		},0)
		calculation.sum_instruments = result;
		return calculation;
	};
	
	function materialsChanged(){
		calculation.materials.forEach(function(item){
			if (item.number<0) item.number = 0;
			item.sum = (item.price*(item.number || 0)).toFixed(2);			
		});
	}
	
	function jobsChanged(){
		calculation.jobs.forEach(function(item){
			var ni = calculation.numIndicators;
			if (item.number<0) item.number = 0;
			item = jobCalculate(item, ni);
			item.sum = (item.price*(item.number || 0)).toFixed(2);			
		});
	}
		
	calculation.changed = function (){
		jobsChanged();
		materialsChanged();
		getSumJobs();
		getSumMaterials();
		getSum();
	}		
	
	
		
	calculation.saveCalc = function (){			
		var calc = new CalculationItem();
		calc.copyObject(calculation);
		if ($routeParams.calcId === "new") {
			console.log("save", calc);
			calc.$save(function(response){					
				var url = "/calculation/" + calculation.kp;
				 $location.url(url);					 
			}, function(error){
				alert("Запрос не удался. Ошибка: " + error);
			});
		} else {
			console.log("update", calc);
			calc.$update(function(response){
				
			}, function(error){
				alert("Запрос не удался. Ошибка: " + error);
			});
		}
		
	};
	
	function getNI(){
		ni.list.$promise.then(function(success){
			success.forEach(function(item, i, arr){				
				arr[item.alias] = Number(item.value) || 0;
			});
			calculation.numIndicators = success;				
		});		
	}
		
	calculation.getCalc = function() {		
		var id;	
		function getCalcFromServer(){
			var temp = CalculationItem.get({calcId: id}, function(response){
				response.numIndicators.forEach(function(item, i, arr){				
					arr[item.alias] = Number(item.value) || 0;					
				});
				calculation.copyObject(response);
				calculation.changed();
			}, function(error){
				alert("Запрос не удался. Ошибка: " + error);			
			});
		}
		
		if ($routeParams.calcId !== "new") {		
			id = $routeParams.calcId;	
			getCalcFromServer();
		}else {				
			getNI();		
		}			
	}
	
	calculation.jobChanged = function(job) {		
		job.sum = (job.price*job.number).toFixed(2);
		job.materials.forEach(function(jItem){
			calculation.materials.forEach(function(mItem){
				if (jItem.id==mItem.id) {
					mItem.number = mItem.number?mItem.number:0;
					mItem.number += jItem.number*(job.number-job.lastNumber);
					if (mItem.number<0) mItem.number = 0;
				}
			})			
		});
		job.lastNumber = job.number;
		materialsChanged();		
		calculation.changed();
	}

	var jobCalculate = jobs.jobCalculate;
		
	return calculation;
}]);