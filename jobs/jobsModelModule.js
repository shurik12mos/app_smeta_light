var app = angular.module('jobsModelModule', []);

app.service('JobsModel', function(JobsCategory, JobsSections, Jobs, NumericIndicatorsModel){
	var jobs = new Object();
	var ni = NumericIndicatorsModel;
	jobs.common = {
		showAddCategory: false,
		newCategory: {
			name: "",
			description: ""
		},
		showAddSection: false,
		newSection: {
			name: "",
			description: ""
		}
	};
	jobs.categories = [];
	jobs.sections = [];
	jobs.job = {};
	
	//private
	function makeOneActiveCategory(id, target) {
		jobs.categories.forEach(function(item, i, arr) {
			if (item.id === id) {
				item.active = !item.active;
				jobs.common.acive_category_id = id;
				delete jobs.common.active_section_id;
				delete jobs.common.active_section_name;
			}else {
				item.active = false;
			}
		});				
	};
	
	function makeOneActiveSection(id) {
		jobs.sections.forEach(function(item, i, arr) {
			if (item.id === id) {
				item.active = true;
				jobs.common.active_section_id = item.id;
				jobs.common.active_section_name = item.name;
				jobs.job = {};
			}else {
				item.active = false;
			}
		});
	};
	
	/*function lastAddedMaterial() {
		var temp = materials.materialAll;
		if (temp.length>0) {
			var lastIndex = 0;
			var lastId = 0;
			var lastMaterial = {};
			temp.forEach(function(item, i, arr) {
				if (temp[i]["id"]>lastId) {
					lastIndex = i;
					lastId = temp[i]["id"];
				}
			});	
			
			lastMaterial = angular.copy(temp[lastIndex]);	
			
			return lastMaterial;
		} else {
			return false
		}
	}*/
	
	// Преобразует к числу, оставляя 2 знака после запятой
	function toFloat(n) {
		 n=n.toString(); 
		 n=n.split(",").join(".");
		 if (!isNaN(parseFloat(n)) && isFinite(n) && parseFloat(n)>0) {
			n =  parseFloat(n).toFixed(2);
			return  n
		 } else {
			 return false;
		 }	
	}
	
	function isExistSame (name, obj, id) {
		var exist = false;
		if (id && obj) {
			obj.forEach(function(item, i, items) {
				if(item.id==id) exist = true;
			});
		} else if (name && obj) {			
			obj.forEach(function(item,i,items) {
				
				if(item.name==name) exist = true;
			});
		}
		return exist?true:false;
	}
	
	function activeCategory () {
		var id;		
		jobs.categories.forEach(function(item, i, items){			
			if (item.active) {				
				id = item.id;
			}
		});
		return id;
	}
	
	function makePossibleChars() {
		var chars = [],ids=[];	
		if(!jobs.jobsList || jobs.jobsList.length==0) return;
		jobs.jobsList.forEach(function(item,i,items){
			
			if (i==0) {
				item.chars.forEach(function(itemChar){
					var temp = new Object();
					temp.copyObject(itemChar);	
					chars.push(temp);
					chars[chars.length-1].values = [];
					chars[chars.length-1].values.push({value: itemChar.value, active: true, id: itemChar.id});
					delete chars[chars.length-1].value;
				});
			}else {
				/*
					Проходит по всем характеристикам каждой работы и если такого значения в массиве 
					возможных характеристик нет, то вставляет значение.
				*/
				item.chars.forEach(function(itemChar){
					chars.forEach(function(posChar){						
						if (posChar.chars_name_id == itemChar.chars_name_id) {
							var exist = posChar.values.some(function(a) {return a.id == itemChar.id || a.value == itemChar.value});
							if (!exist) {
								posChar.values.push({value: itemChar.value, active: false, id: itemChar.id})
							}
						}
					});
				})
			}								
		});			
		return chars;
	}		
	//public
	jobs.chooseOneJob = function () {
		var chars=[], eqChar, exist = false;
		jobs.jobsList.chars.forEach(function(item, i){
			chars[i] = {};
			chars[i].name = item.name;
			chars[i].chars_name_id = item.chars_name_id;
			item.values.forEach(function(item){
				if (item.active) chars[i].value = item.value;
			});
		});
			
		jobs.jobsList.forEach(function(item){			
			eqChar =true;
			if (item.chars) {
					item.chars.forEach(function(charOne){				
					var temp = chars.some(function(x){return x.chars_name_id == charOne.chars_name_id && x.value==charOne.value});				
					if (!temp) eqChar = false;					
				});
			}else {
				eqChar = false;
			}	
			
			if (eqChar) {
				var name = jobs.common.active_section_name;
				jobs.job={};
				Object.copyObject(jobs.job, item);
				if (jobs.job.chars) {
					jobs.job.chars.forEach(function(item, i, items){					
						name+=" "+item.name + " " + item.value + " " + item.measure;					
						if (i!=items.length-1) {
							name+=", ";
						}
					});
				}				
				jobs.job.name = name;
				exist = true;
			} else if (!exist) {
				jobs.job={};
			}
			
		});
		
		if (jobs.job["human-hour"]) jobs.jobCalculate(jobs.job, ni);
	}
	/*
	---------------------
			Category
	---------------------
	*/
	jobs.addJobsCategory = function(id){
		if(id) {
			changeCategory2();
			return;
		}
		var jobsCategory = new JobsCategory();
		for (var prop in jobs.common.newCategory) {
			jobsCategory[prop] = jobs.common.newCategory[prop];
		}
		if(isExistSame(jobsCategory.name, jobs.categories)) {
			alert("Категория с таким именем уже существует");
			return;
		}else {			
			jobsCategory.$save(function(response){				
				if(processResult(response) && response.id) {
					var newCategory = new Object();
					for (var prop in jobs.common.newCategory) {
						newCategory[prop] = jobs.common.newCategory[prop];
						jobs.common.newCategory[prop] = "";
					}
					newCategory.id = response.id;
					jobs.categories.push(newCategory);					
				}
			}, function(error){
				alert("Запрос не удался. Ошибка: " + error);
			});
		}
		 jobs.common.showAddCategory = false;
	};
	
	jobs.getCategories = function(){		
		try {			
			var categories = JobsCategory.query(function(response){
				if(processResult(response)) {
					jobs.categories = categories;								
				}				
			}, function(error){
				alert("Запрос не удался. Ошибка: " + error);
			});			 
		}catch (e){
			alert("Произошла ошибка. Попробуйте позже или сообщите администратору. Ошибка:" + e);
		}
	};
	jobs.getCategories();
	
	jobs.deleteCategory = function(id) {
		if (!id) {
			alert("У категории нет id. Странно. Обратитесь к администратору");
			return;
		}
		var delCategory = new JobsCategory();
		delCategory.id = id;
		delCategory.$delete({id:id}, function(response) {
			if(processResult(response)) {
				jobs.categories.forEach(function(item, i, items){
					if(item.id==id) {
						items.splice(i,1);
					}
				});
			}
		}, function(error){
			alert("Запрос не удался. Ошибка: " + error);
		});
	};
	
	jobs.changeCategory = function(id, name, description) {		
		jobs.common.newCategory.id = id;
		jobs.common.newCategory.name = name;
		jobs.common.newCategory.description = description;
		jobs.common.showAddCategory = true;		
	}
	
	function changeCategory2 () {
		var changeCategory = new JobsCategory();
		changeCategory = Object.copyObject(changeCategory, jobs.common.newCategory);		
		changeCategory.$update(function(response) {
			if(processResult(response)) {
				jobs.categories.forEach(function(item, i, items){						
					if (item.id == jobs.common.newCategory.id) {							
						items[i] = Object.copyObject(items[i], jobs.common.newCategory);
					}
				});
				jobs.common.showAddCategory = false;
			}
			jobs.common.newCategory = {};				
		}, function(error) {
			alert("Запрос не удался. Ошибка: " + error);
		});		
	}
	
	/*
	---------------------
			Sections
	---------------------
	*/
	jobs.getSections = function(category_id){		
		try {			
			var sections = JobsSections.query({category_id: category_id}, function(response){				
				if(processResult(response)) {
					makeOneActiveCategory(category_id);
					jobs.sections = response;
					jobs.job = {};	
					jobs.jobsList = [];
				}				
			}, function(error){
				alert("Запрос не удался. Ошибка: " + error);
			});			 
		}catch (e){
			alert("Произошла ошибка. Попробуйте позже или сообщите администратору. Ошибка:" + e);
		}
	};	
	
	jobs.addJobsSection = function(id){		
		if(id) {
			changeSection2();
			return;
		}		
		var category_id = activeCategory();
				
		var jobsSection = new JobsSections();
		for (var prop in jobs.common.newSection) {
			jobsSection[prop] = jobs.common.newSection[prop];
			jobsSection.category_id = category_id;
		}
		if(isExistSame(jobsSection.name, jobs.sections)) {
			alert("Категория с таким именем уже существует");
			return;
		}else {			
			jobsSection.$save(function(response){				
				if(processResult(response) && response.id) {
					var newSection = new Object();
					for (var prop in jobs.common.newSection) {
						newSection[prop] = jobs.common.newSection[prop];
						jobs.common.newSection[prop] = "";
					}
					newSection.id = response.id;
					jobs.sections.push(newSection);					
				}
			}, function(error){
				alert("Запрос не удался. Ошибка: " + error);
			});
		}
		jobs.common.showAddSection = false;
	};
	
	jobs.deleteSection = function(id) {
		if (!id) {
			alert("У категории нет id. Странно. Обратитесь к администратору");
			return;
		}
		var delSection = new JobsSections();		
		delSection.$delete({id:id}, function(response) {
			if(processResult(response)) {
				jobs.sections.forEach(function(item, i, items){
					if(item.id==id) {
						items.splice(i,1);
					}
				});
			}
			jobs.getSections(jobs.common.active_category_id);
		}, function(error){
			alert("Запрос не удался. Ошибка: " + error);
		});
	};
	
	jobs.changeSection = function(id, name, description, keywords) {
		jobs.common.newSection.category_id = activeCategory();
		jobs.common.newSection.id = id;
		jobs.common.newSection.name = name;
		jobs.common.newSection.description = description;
		jobs.common.newSection.keywords = keywords;
		jobs.common.showAddSection = true;			
	}
	
	function changeSection2 () {
		var changeSection = new JobsSections();
		changeSection = Object.copyObject(changeSection, jobs.common.newSection);		
		changeSection.$update(function(response) {
			if(processResult(response)) {
				jobs.sections.forEach(function(item, i, items){						
					if (item.id == jobs.common.newSection.id) {							
						items[i] = Object.copyObject(items[i], jobs.common.newSection);
					}
				});
				jobs.common.showAddSection = false;
			}
			jobs.common.newSection = {};				
		}, function(error) {
			alert("Запрос не удался. Ошибка: " + error);
		});		
	}
	
	/*
	---------------------
			Jobs
	---------------------
	*/
	
	jobs.getJobs = function(section_id) {
		makeOneActiveSection(section_id);
		try {			
			var jobsList = Jobs.query({job_section_id: section_id}, function(response){					
				if(processResult(response)) {					
					jobs.jobsList = response;
					response.forEach(function(item){
						item = jobs.jobCalculate(item,ni);
					});
					jobs.jobsList.chars = makePossibleChars();
					jobs.chooseOneJob();					
				} else {					
					jobs.jobsList = [];
				}				
			}, function(error){				
				alert("Запрос не удался. Ошибка: " + error + " " + error.status + " " +  error.statusText);
			});			 
		}catch (e){
			alert("Произошла ошибка. Попробуйте позже или сообщите администратору. Ошибка:" + e);
		}		
	};
	
	jobs.addJob = function(section_id, chars) {
		jobs.common.newJob = new Object();
		if(!section_id) return;	
		
		if (jobs.jobsList.length>0) {
			jobs.common.newJob.copyObject(jobs.jobsList[jobs.jobsList.length-1]);
			delete jobs.common.newJob.id;
		} else {
			jobs.common.newJob.chars = [];
			jobs.common.newJob.materials = [];
			jobs.common.newJob.instruments = [];
		}			
			
		jobs.common.newJob.section_id = section_id;		
		// Вызываем модальное окно(директиву) добавления работы
		jobs.common.showAddJob = true;
	}
	
	jobs.addJob2 = function(job){
		var changed = false;
		var addingJob = new Jobs();
		
		if (!toFloat(job["human-hour"])) {
			alert("Поле нормы времени должно быть положительным числом");
			return;
		}
		
		if (!toFloat(job["job-rank"])) {
			alert("Поле разряда работ должно быть положительным числом");
			return;
		}
		
		function addJob() {	
			jobs.common.changeJob = false;		
			addingJob.$save(function(response) {
				console.log(response);
				if(processResult(response) && response.id) {
					jobs.getJobs(jobs.common.active_section_id);
					jobs.common.newJob = new Object();						
				}
				jobs.common.showAddJob =false;
			}, function(error){
				alert("Запрос не удался. Ошибка: " + error);
			})
		}
		
		function changeJob() {	
			jobs.common.changeJob = false;		
			addingJob.$update(function(response){				
				if(processResult(response)) {					
					jobs.getJobs(jobs.common.active_section_id);			
					jobs.common.newJob = new Object();						
				}
				jobs.common.showAddJob =false;
			}, function(error) {
				alert("Запрос не удался. Ошибка: " + error);
			});
		}		
		
		//Если значение характеристики изменено, то удаляем id характеристики, чтобы сохранилось новое значение
		if (job.chars.forEach) {			
			job.chars.forEach(function(item){
				if(item.id && item.change && !jobs.common.changeJob) {
					delete item.id;
					if (job.id ) {
						delete job.id;
					}
					changed = true;
				} else if (!item.id) {
					changed = true;
				}
			});			
		}		
		
		addingJob.copyObject(job);		
		if (job.id) {
			changeJob();
		} else {
			addJob();
		}	
	}
	
	jobs.changeJob = function(section_id, job) {
		jobs.common.newJob = new Object();
		jobs.common.changeJob = true;
		if(!section_id) return;		
		// Если есть активная работа, то копируем ее
		if (job.id) {
			jobs.common.newJob.copyObject(job);			
		}
		jobs.common.newJob.section_id = section_id;
		
		// Вызываем модальное окно(директиву) добавления работы
		jobs.common.showAddJob = true;		
	}
	
	jobs.deleteJob = function(id) {
		if(!confirm("Вы уверены, что хотите удалить эту работу?")) return;
		var delJob = new Jobs();
		delJob.$delete({id: id},function(response){
			if(processResult(response)) {
				jobs.getJobs(jobs.common.active_section_id);	
			}				
		}, function(error){
			alert("Запрос не удался. Ошибка: " + error);
		});
	}
	
	//Calculate price for job
	jobs.jobCalculate = function(job, ni) {	
		console.log(".jobCalculate     ", ni, job);
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
				var temp = item["price-usd"]*job["human-hour"]*ni.dollar/item["life-time"];
				item.amortization = temp;
				sum += temp;
				return toFixed(sum,2);
			}, 0)
		})();
		job.amortizations = toFixed(job.amortization*(job.number || 0), 2);
		job.risks = toFixed(((common_sallary+job.profit+job.common_expenses+job.admin_expenses+job.amortization)*ni.risks/100),2); //Поощрения и Риски
		job.income_tax = toFixed(((common_sallary+job.risks)*(1/(1-(ni.income_tax/100))-1)),2); //Подоходный налог+военный сбор
		job.unified_social = toFixed(((common_sallary+job.risks+job.income_tax)*ni.unified_social/100),2); //Единый социальный взнос
		common_expenses = common_sallary+job.profit+job.common_expenses+job.admin_expenses+job.amortization+job.risks+job.income_tax;
		job.unified_tax = toFixed((common_expenses*(1/(1-(ni.unified_tax/100))-1)),2); //Налог единый
		job.tax_on_costs = toFixed(((common_expenses+job.unified_tax)*ni.tax_on_costs),2) //НДС
		
		job.price = toFixed((common_expenses+job.unified_tax+job.tax_on_costs),2); //Стоимость работы
		return job;
	}
	
	return jobs;
});