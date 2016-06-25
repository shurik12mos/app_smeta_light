'use strict'

var app = angular.module('calculationModelModule', ['ngRoute']);

app.factory('CalculationModel', ['$routeParams' , '$location', '$route', 'CalculationItem', 'NumericIndicatorsModel', 'JobsModel',  function($routeParams, $location, $route, CalculationItem, NumericIndicatorsModel, JobsModel){
		
	var date = new Date();	
	var ni = NumericIndicatorsModel;
	var jobs = JobsModel;
	//Функция калькуляции переменных объекта Работы(стоимость, амортизация) в зависимости от числовых показателей сметы(стоимость часа и прочее)
	var jobCalculate = jobs.jobCalculate;
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
		calculation.sum = calculation.sum.toFixed(2)
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
			sum += Number(current.sum);			
			return sum;
		},0);		
		calculation.sum_jobs = Number(result).toFixed(2);
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
		var ni = calculation.numIndicators;
		calculation.jobs.forEach(function(item){			
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
		
	calculation.getCalc = function(id) {			
		function getCalcFromServer(){
			var temp = CalculationItem.get({calcId: id}, function(response){
				response = angular.fromJson(response);				
				calculation.copyObject(response);	
				calculation.numIndicators.forEach(function(item, i, arr){				
					arr[item.alias] = Number(item.value) || 0;					
				});
				
			}, function(error){
				alert("Запрос не удался. Ошибка: " + error);			
			});
		}
		console.log("id=", id);
		if (id !== "new") {					
			getCalcFromServer();
		}else {				
			calculation.kp = null;
			calculation.date = date.toDateString();
			calculation.object_name = "";
			calculation.maker_name = "";
			calculation.customer_name = "";
			calculation.responsible_name = "";
			calculation.contact_phone = null;
			calculation.contact_mail = "";
			calculation.other_info = "";
			calculation.jobs = [];
			calculation.materials = [];
			calculation.instruments = [];	
			calculation.comments = [];
			calculation.numIndicators = [];
			calculation.niPromise = ni.list.$promise;
			
			getNI();		
		}			
	}
	
	calculation.jobChanged = function(job) {		
		jobCalculate(job, calculation.numIndicators);
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
	
	return calculation;	
}]);