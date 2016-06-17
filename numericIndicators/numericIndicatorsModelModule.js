'use strict';

var app = angular.module('numericIndicatorsModelModule', []);

app.service('NumericIndicatorsModel', function(NumericIndicators){
	var nis = new Object(),ni_copy = {};	
//private methods
	//get list of NI
	function query(factory) {
		try {		
			var query = factory.query(function(response){		
				if(processResult(response)) {
					query = response;
					haveGet(response);
				}				
			}, function(error){
				alert("Запрос не удался. Ошибка: " + error);
			});			 
		}catch (e){
			alert("Произошла ошибка. Попробуйте позже или сообщите администратору. Ошибка:" + e);
		}finally {
			return query;
		}	
	}	
	
	//called when have get list of NI
	function haveGet(response) {		
		if (!response || !response.forEach) return;
		response.forEach(function(item) {
			nis[item.alias] = item.value;
			item.value = Number(item.value);
		});
	};

	function save(item) {
		var ni = new NumericIndicators();
		ni.copyObject(item);
		if(toFloat(ni.value)) {
			ni.value = toFloat(ni.value);
		}else {
			alert("Значение должно быть числом");
			return false;
		}			
		ni.$update(function(response){
			if(processResult(response)) {				
				nis.list.forEach(function(item ,i ,items){
					if (item.id == ni.id) {
						items[i] = ni;
					}
				});								
			}			
		}, function(error){
			alert("Запрос не удался. Ошибка: " + error);			
		});	
		return true;
	}
	
	// Преобразует к числу, оставляя 2 знака после запятой
	function toFloat(n) {
		 n=n.toString(); 
		 n=n.split(",").join(".");
		 if (!isNaN(parseFloat(n)) && isFinite(n)) {
			n =  parseFloat(n).toFixed(2);
			return  n
		 } else {
			 false
		 }	
	}

	//Сохранение нового элемента
	function add(item) {
		var ni = new NumericIndicators();
		ni.copyObject(item);
		if(toFloat(ni.value)) {
			ni.value = toFloat(ni.value);
		}else {
			alert("Значение должно быть числом");
			return false;
		}			
		ni.$save(function(response){
			if(processResult(response)) {				
				nis.getNI();							
			}			
		}, function(error){
			alert("Запрос не удался. Ошибка: " + error);			
		});
		return true;
	}
	
//public methods	
	//get all Numeric Indicators
	nis.getNI = function(){
		nis.list = query(NumericIndicators);		
	}
	nis.getNI();
	
	// prepare changes
	nis.prepareChange = function(item) {
		ni_copy.copyObject(item);
	}
	//save 
	nis.save = function(item) {
		console.log("step1", item);
		if (!save(item)) {			
			return false;
		}else {			
			return true;
		};
	}
	
	nis.undoChange = function(index) {
		if (ni_copy) {
			nis.list[index] = ni_copy;
			ni_copy = {};
		}
	}
	
	//add
	nis.add = function(item) {
		if (!add(item)) return true;
		return false;
	}
	
	//Calculate price for job
	nis.jobCalculate = function(job, ni) {		
		function toFixed(item, n) {
			item = Math.round(item * Math.pow(10, n)) / Math.pow(10, n);
			return item;
		}
		
		for (var prop in ni ) {
			ni[prop] = ni[prop] || 0;
		}
		
		var common_sallary = 0, common_expenses=0;
		job.salary_workers = toFixed(job["human-hour"]*ni.cost_hour*job["job-rank"],2);//Заработная плата основных рабочих
		job.salary_brigadier = toFixed((job.salary_workers*ni.salary_brigadier/100),2);//З/п в общепроизводственных расходах (бригадир) 
		job.salary_manager = toFixed((job.salary_workers*ni.salary_manager/100),2); //З/п в общепроизводственных расходах (менеджер)
		job.salary_project = toFixed((job.salary_workers*ni.salary_project/100),2); //Проектирование	
		common_sallary = (job.salary_workers+job.salary_brigadier+job.salary_manager+job.salary_project);//Общая ЗП	
		job.profit = toFixed((job.salary_workers*ni.profit/100),2); // Прибыль
		job.common_expenses = toFixed((job.salary_workers*ni.common_expenses/100),2); //Общепроизводственные расходы 
		job.admin_expenses = toFixed((job.salary_workers*ni.admin_expenses/100),2); //Административные расходы
		job.amortization = (function(){
			if(!job.instruments || job.instruments.length==0) return 0;
			return job.instruments.reduce(function(sum, item){
				var temp = item["price-usd"]*job["human-hour"]*ni.dollar*(job.number || 0)/item["life-time"];
				item.amortization = temp;
				sum += temp;
				return toFixed(sum,2);
			}, 0)
		})();
		job.risks = toFixed(((common_sallary+job.profit+job.common_expenses+job.admin_expenses+job.amortization)*ni.risks/100),2); //Поощрения и Риски
		job.income_tax = toFixed(((common_sallary+job.risks)*(1/(1-(ni.income_tax/100))-1)),2); //Подоходный налог+военный сбор
		job.unified_social = toFixed(((common_sallary+job.risks+job.income_tax)*ni.unified_social/100),2); //Единый социальный взнос
		common_expenses = common_sallary+job.profit+job.common_expenses+job.admin_expenses+job.amortization+job.risks+job.income_tax;
		job.unified_tax = toFixed((common_expenses*(1/(1-(ni.unified_tax/100))-1)),2); //Налог единый
		job.tax_on_costs = toFixed(((common_expenses+job.unified_tax)*ni.tax_on_costs),2) //НДС
		
		job.price = toFixed((common_expenses+job.unified_tax+job.tax_on_costs),2); //Стоимость работы
		return job;
	}
	
	
//RESULTS  
	return nis;
});