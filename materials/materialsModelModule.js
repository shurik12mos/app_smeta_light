var app = angular.module('materialsModelModule', []);

app.service('MaterialsModel', function(MaterialCategory, MaterialSection, Materials, MaterialsChar, MaterialProducers){
	var materials = {};	
	materials.showAddCategory = false;
	//private
	function makeOneActiveCategory(id) {
		materials.categories.forEach(function(item, i, arr) {
			if (item.id === id) {
				item.active = !item.active;
				materials.categories.acive_category_id = id;
			}else {
				item.active = false;
			}
		});
		
		
		materials.materialAll = false;		
	};
	
	function makeOneActiveSection(id) {
		materials.sections.forEach(function(item, i, arr) {
			if (item.id === id) {
				item.active = true;
			}else {
				item.active = false;
			}
		});
	};
	
	function lastAddedMaterial() {
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
	
	// Проверяет является ли материал уникальным
	function isDifferenceMaterial(add) {		
		if (!add) return true;
		if (!materials.materialAll || materials.materialAll === 0) return true;		
		var same = false;
		materials.materialAll.forEach(function(item){			
			var sameChar = 0;
			item["char"].forEach(function(itemChar){				
				add["char"].forEach(function(addChar){					
					if (itemChar.material_char_name_id == addChar.material_char_name_id && itemChar.value.toString().toLowerCase() == addChar.value.toString().toLowerCase()) {
						sameChar+=1;
					}
				});
			});
			
			if (sameChar==add["char"].length) {
				// Если количество совпавших характеристик равно количеству характеристик, то два материала равны
				//и надо проверить совпадение производителей
				if (item.producer_id === add.producer_id) {
					same = true
				}	
			} 	
		});
		
		if (same) return false;
		return true	
	}
	
	/*--------------
		CATEGORIES
	--------------*/
	
	//list of categories
	materials.listMaterialCategories = function () {
		var materialCategory = MaterialCategory.query(function(){				
			materials.categories = materialCategory;
		});
	};

	materials.listMaterialCategories();
	
	// delete categories by id
	materials.deleteMaterialCategory = function(id, index) {
		var result = confirm("Вы действительно хотите удалить категорию?");		
		if (result) {
			var del = new MaterialCategory();
			del.$delete({id: id}).then(function(response) {				
				materials.categories.splice(index,1);									
			});
		};
	};
	
	//change category	
	materials.showChangeMaterialCategory = function(id, name, description){
		materials.showChangeCategory = true;
		materials.changeCategoryName = name;
		materials.changeCategoryDescription = description;
		materials.changeCategoryId = id;		
	}
	
	materials.changeMaterialCategory = function(name, description) {						
		var changeMaterialCategory = new MaterialCategory();
		changeMaterialCategory.id = materials.changeCategoryId;
		changeMaterialCategory.name = name;
		changeMaterialCategory.description =description;					
		changeMaterialCategory.$update().then(function (response) {			
			materials.categories.forEach(function(item, i , arr) {
				if (item.id === materials.changeCategoryId) {
					arr[i].id = materials.changeCategoryId;
					arr[i].name = name;
					arr[i].description = description;					
				}
			});				
			materials.showChangeCategory = false;			
		});	
	}
	
	//add category
	materials.addMaterialCategory = function(name, description) {
		//check if category with this name already exist
		var alreadyExist = false;		
		for (var i=0;i<materials.categories.length;i++) {			
			if (name===materials.categories[i].name) {
				materials.showAddCategory = false;
				setTimeout(function(){alert("Категория с таким именем уже существует")},100);
				alreadyExist = true;
				materials.CategoryName = "";
				materials.CategoryDescription = "";
				break;
			}
		}
		//do the add
		if (!alreadyExist) {
			materials.showAddCategory = true;
			var addMaterialCategory = new MaterialCategory();
			addMaterialCategory.name = name;		
			addMaterialCategory.description = description;		
			addMaterialCategory.$save().then(function(response){				
				materials.listMaterialCategories();
				materials.showAddCategory = false;	
				materials.CategoryName = "";
				materials.CategoryDescription = "";
			});	
		}	
	}
	
	/*-----------
		SECTIONS
	------------*/	
	// list of sections by category id
	materials.listMaterialSection = function(id, notChange) {
		if (!notChange) {
			makeOneActiveCategory(id);
		}		
		var materialSection = MaterialSection.query({material_category_id: id}, function(){				
			materials.sections = materialSection;
		});	
	};
	
	//	delete section by id
	materials.deleteMaterialSection = function(id) {
		if (!confirm("Вы уверены, что хотите удалить раздел?")) return false;
		var del = new MaterialSection();
		del.$delete({id: id}).then(function(response) {			
			materials.sections.forEach(function(item,i,arr){
				if (item.id = id) {
					arr.splice(i,1);
				}
			});					
		});
	};	
	
	//add section
	materials.addSection = function(id, name, description, keywords) {
		var alreadyExist = false;		
		for (var i=0;i<materials.sections.length;i++) {			
			if (name===materials.sections[i].name) {
				materials.showAddCategory = false;
				setTimeout(function(){alert("Раздел с таким именем уже существует")},100);
				alreadyExist = true;
				materials.SectionName = "";
				materials.SectionDescription = "";
				materials.SectionKeywords = "";
				break;
			}
		};
		if (!alreadyExist) {
			var addMaterialSection = new MaterialSection();
			addMaterialSection.material_category_id = id;
			addMaterialSection.name = name;		
			addMaterialSection.description = description;		
			addMaterialSection.keywords = keywords;
			addMaterialSection.$save().then(function(response){
				materials.listMaterialSection(id, true);
				materials.sectionName = "";
				materials.sectionDescription = "";	
				materials.SectionKeywords = "";				
			});
		}		
	}
	
	//change section
	materials.showChangeMaterialSection = function(id,name,description, keywords) {
		materials.showChangeSection = true;
		materials.changeSectionId = id;
		materials.changeSectionName = name;
		materials.changeSectionDescription = description;
		materials.changeSectionKeywords = keywords;
	}
	
	materials.changeMaterialSection = function(name, description, keywords) {
		var changeMaterialSection = new MaterialSection();
		changeMaterialSection.id = materials.changeSectionId;
		changeMaterialSection.name = name;
		changeMaterialSection.description = description;
		changeMaterialSection.keywords = keywords;
		changeMaterialSection.$update().then(function (response) {					
			materials.sections.forEach(function(item, i , arr) {
				if (item.id === materials.changeSectionId) {
					arr[i].id = materials.changeSectionId;
					arr[i].name = name;
					arr[i].description = description;
					arr[i].keywords = keywords;
				}
			});				
			materials.showChangeSection = false;	
		});			
	}
	
	/*-----------
		MATERIALS
	------------*/	
	//list of materials with all chars and producers
	materials.listMaterials = function(id, name) {
		makeOneActiveSection(id);		
		var material = Materials.query({material_section_id: id}, function(response){			
			if (response.length>0 && response[0]) {
				if (response[0].result===false) {
					alert(response[0].message + ": " + response[0].error);
				}
				
				
				materials.materialAll = material;
				materials.materialAll.section_id = id;
				materials.materialAll.section_name = name;			
				for (var i=0; i<materials.materialAll.length; i++) {
					var charInString = name + " ";				
					for (var j=0; j<materials.materialAll[i]["char"].length; j++) {
						var temp = materials.materialAll[i]["char"][j];					
						charInString += temp.name + " " + temp.value + " " + temp.measure + "; ";
					}
					charInString += materials.materialAll[i].producer_name; 
					materials.materialAll[i].charInString = charInString;				
				};
			}else {
				materials.materialAll = [];
				materials.materialAll.section_id = id;
				materials.materialAll.section_name = name;				
			}
			
		});		
		
		materials.getChars(id);		
		materials.getProducers();
	};
	
	// !!!!!!!!!add Material in 2 stage
	materials.showAddMaterial = function(section_id) {		
		materials.lastMaterial = lastAddedMaterial();		
		//Если есть ластМатериал, то работаем
		if (typeof(materials.lastMaterial)!== "object") {			
			materials.lastMaterial = {};
			materials.lastMaterial["char"]=[];
			materials.lastMaterial["material_section_id"] = materials.materialAll.section_id;
			
			//Копируем свойства char			
			materials.chars.forEach(function(item, i){
				var newChar = {};
				newChar["material_char_name_id"] = item.id;
				newChar["name"] = item.name;
				newChar["measure"] = item.measure;
				newChar["value"] = "";				
				materials.lastMaterial["char"].push(newChar);				
			});
			
		} else {
			// Проверяем список общих характеристик раздела и характеристик последнего добавляемого материала. Если одной из общих характеристик нет, то добавляем ее.
			materials.chars.forEach(function(itemChars) {
				var charIs = false;
				materials.lastMaterial["char"].forEach(function(itemLastMaterialChars, i) {
					if (itemChars["id"]==itemLastMaterialChars["material_char_name_id"]) {
						charIs = true;
					}
				});
				if (!charIs) {
					var newChar={};
					newChar["material_char_name_id"] = itemChars.id;
					newChar["name"] = itemChars.name;
					newChar["measure"] = itemChars.measure;
					newChar["value"] = "";
					materials.lastMaterial["char"].push(newChar);
				}
			});			
		}
		
		//Показываем форму
		materials.showAddMaterialForm = true;	
	}
	
	materials.addMaterial = function() {
		//Функция сохранения Материала
		function saveMaterial() {
			 materials.showAddMaterialForm = false
			for (p in materials.lastMaterial) {					
				addMaterial[p] = materials.lastMaterial[p];					
			}			
				
			addMaterial.$save(function(response){
				console.log(response);
				if (response.result) {
					//Преобразовуем характеристики в charInString
					var charInString=materials.materialAll.section_name + " " ;					
					for (var j=0; j<materials.lastMaterial["char"].length; j++) {
						var temp = materials.lastMaterial["char"][j];					
						charInString += temp.name + " " + temp.value + " " + temp.measure + "; ";
					}
					charInString += materials.lastMaterial.producer_name; 
					materials.lastMaterial.charInString = charInString;
					
					// Обновляем id  для материала
					materials.lastMaterial["id"] = response["id"];
					// Добавляем материал в массив
					materials.materialAll.push(materials.lastMaterial);
					
					materials.getProducers();
					materials.getChars(materials.materialAll.section_id);	
				} else {
					alert(response.message + " Ошибка: " + response.error);
				}
				
			}, function(error){				
				alert("Приносим извинения, но что то пошло не так. Неудачный запрос к серверу. Попробуйте еще раз.");
			});
		}
		//Конец сохранения материала
		
		// Преобразуем цену в число
		if (toFloat(materials.lastMaterial.price)===false) {
			alert("Цена должна быть числом");
			return false;
		}else {
			materials.lastMaterial.price = toFloat(materials.lastMaterial.price);
		}
		
		var addMaterial = new Materials();
		var alreadyExist = false;
		//проверяем новое ли это имя Производителя
		if (materials.producers!==undefined && materials.producers.length>0) {
			materials.producers.forEach(function(item, i, arr) {			
				if (item["name"].toLowerCase() === materials.lastMaterial["producer_name"].toLowerCase()) {
					materials.lastMaterial["producer_id"] = item["id"];				
					alreadyExist = true;				
				}
			});
		}
		
		// Если новое имя Производителя, то меняем id_producer и сохраняем. Если нет, то просто сохраняем.
		if (!alreadyExist) {
			var producer = new MaterialProducers();
			producer.name = materials.lastMaterial["producer_name"];
			producer.material_category_id = materials.categories.acive_category_id;
			producer.$save(function(value){					
				materials.lastMaterial["producer_id"] = value.id;				
				saveMaterial();
			});
		} else {
			if (isDifferenceMaterial(materials.lastMaterial)) {
				saveMaterial();	
			} else {
				alert("Такой материал уже существует. Создайте материал, который отличается хоть одной характеристикой или производителем.");
			}
					
		};		
	};
	// !!!!!!!!!!!!!!!!!!!!!
	
	
	//Удаление материала по id
	materials.deleteMaterial = function(id) {
		if (confirm("Вы уверены, что хотите удалить этот материал?")) {
			var material = new Materials()
			material.$delete({id: id}).then(function(response){				
				if (response.result) {
					materials.materialAll.forEach(function(item, i, items){
						if (item.id===id) {
							materials.materialAll.splice(i,1);
						}
					});
					
					materials.getProducers();
					if (materials.materialAll.section_id) {
						materials.getChars(materials.materialAll.section_id);
					}					
				} else {
					alert(response.message + " Ошибка: " + response.error);
				}						
			});
		}		
	};
	
	// Изменение материала
	materials.showChangeMaterial = function(id) {
		var index;
		materials.materialAll.forEach(function(item, i){
			if (item.id==id) {
				index = i;
			}
		});		
		materials.materialIsChange = angular.copy(materials.materialAll[index]);
		materials.materialIsChange.index = index;
	}
	
	materials.changeMaterial = function() {
		//Функция изменения Материала
		function changingMaterial() {
			 materials.showChangeMaterialForm = false;
			for (p in materials.materialIsChange) {					
				addMaterial[p] = materials.materialIsChange[p];					
			}				
						
			addMaterial.$update(function(response){	
				console.log(response);
				if (response.result) {
					//Преобразовуем характеристики в charInString
					var charInString=materials.materialAll.section_name + " " ;					
					for (var j=0; j<materials.materialIsChange["char"].length; j++) {
						var temp = materials.materialIsChange["char"][j];					
						charInString += temp.name + " " + temp.value + " " + temp.measure + "; ";
					}
					charInString += materials.materialIsChange.producer_name; 
					materials.materialIsChange.charInString = charInString;
					
					// Добавляем материал в массив
					materials.materialAll[materials.materialIsChange.index] = materials.materialIsChange;
					
					materials.getProducers();
					materials.getChars(materials.materialAll.section_id);	
				} else {
					alert(response.message + " Ошибка: " + response.error);
				}
				
			}, function(error){				
				alert("Приносим извинения, но что то пошло не так. Неудачный запрос к серверу. Попробуйте еще раз.");
			});
		}
		//Конец сохранения материала
		
		// Преобразуем цену в число
		if (toFloat(materials.materialIsChange.price)===false) {
			alert("Цена должна быть числом");
			return false;
		}else {
			materials.materialIsChange.price = toFloat(materials.materialIsChange.price);
		}
		
		var addMaterial = new Materials();
		var alreadyExist = false;
		//проверяем новое ли это имя Производителя
		if (materials.producers!==undefined && materials.producers.length>0) {
			materials.producers.forEach(function(item, i, arr) {			
				if (item["name"].toLowerCase() === materials.materialIsChange["producer_name"].toLowerCase()) {
					materials.materialIsChange["producer_id"] = item["id"];				
					alreadyExist = true;				
				}
			});
		}
		
		// Если новое имя Производителя, то меняем id_producer и сохраняем. Если нет, то просто сохраняем.
		if (!alreadyExist) {
			var producer = new MaterialProducers();
			producer.name = materials.materialIsChange["producer_name"];
			producer.material_category_id = materials.categories.acive_category_id;
			producer.$save(function(value){					
				materials.materialIsChange["producer_id"] = value.id;				
				changingMaterial();
			});
		} else {
			if (isDifferenceMaterial(materials.materialIsChange) || materials.priceChanged) {
				changingMaterial();	
			} else {				
				materials.showChangeMaterialForm = false;
				alert("Материал с такими характеристиками уже существует");
			}					
		};		
	}
	
	
	
	//Список характеристик
	materials.getChars = function(id) {
		var materialChar = MaterialsChar.query({material_section_id: id}, function(){	
			materials.chars = materialChar;			
			if (materials.chars.length===0) {
				materials.canAddMaterial = true;
			} else {
				materials.canAddMaterial = false;
			}
		});
	}
	
	
	// Добавление характеристик
	materials.addChars = function(name, measure) {		
		var materialChar = new MaterialsChar();
		materialChar.material_section_id = materials.materialAll.section_id;
		materialChar.name = name;		
		materialChar.measure = measure;			
		materialChar.$save().then(function(response){			
			materials.getChars(materials.materialAll.section_id);
		});
	}
	
	// Удаление характеристик
	materials.deleteChars = function(id) {
		if (!confirm("Вы уверены, что хотите удалить характеристику?")) return false; 
	//Проверяем используется ли эта характеристика
		var usedChar = false;
		materials.materialAll.forEach(function(item, i, arr){
			item["char"].forEach(function(itemChar){
				if (itemChar["material_char_name_id"]==id) {
					usedChar = true;
				}
			});		
		});
		//Если используется, то не удаляем и выводим сообщение об этом
		if (usedChar) {
			alert("Нельзя удалить эту характеристику. Она используется в существующих материалах");
		} else {
			// Если не используется, то удаляем
			var material = new MaterialsChar();
			material.$delete({id: id}).then(function(response){
				materials.getChars(materials.materialAll.section_id);		
			});
		};		
	};
	
	// !!!!!!!!!!! Изменение характеристики
	
	
	// Получение списка производителей
	materials.getProducers = function(){
		var materialProducers = MaterialProducers.query(function(response){
			if (response.length!==0 && response[0] instanceof Object) {
				materials.producers = materialProducers;
			}			
		});
	}
		
	
	
	return materials;
});