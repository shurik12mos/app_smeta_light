'use strict';

var app = angular.module('materialDirectives', []);

app.directive('materialCategory', function(MaterialCategory){
	return {
		restrict: "E",
		templateUrl: "materials/directives/materialCategory.html",		
		link: function(scope, element, attrs){}
	}
});

app.directive('addMaterialCategory', function(MaterialCategory){
	return {
		restrict: "E",
		templateUrl: "materials/directives/addMaterialCategory.html",		
		link: function(scope, element, attrs){}
	}
});

app.directive('materialSection', function(MaterialsModel){
	return {
		restrict: "E",
		templateUrl: "materials/directives/materialSection.html",		
		link: function(scope, element, attrs){}
	}
});

app.directive('addMaterialSection', function(MaterialSection){
	return {
		restrict: "E",
		templateUrl: "materials/directives/addMaterialSection.html",		
		link: function(scope, element, attrs){}
	}
});

app.directive('materials', function(){
	return {		
		restrict: "E",
		templateUrl: "materials/directives/materials.html",		
		link: function(scope, element, attrs){
			
		}
	}
});

app.directive('addMaterial', function(MaterialsModel){
	return {
		restrict: "E",
		templateUrl: "materials/directives/addMaterial.html",		
		link: function(scope, element, attrs){
			
		}
	}
});

app.directive('changeMaterial', function(MaterialsModel){
	return {
		restrict: "E",
		templateUrl: "materials/directives/changeMaterial.html",		
		link: function(scope, element, attrs){
			
		}
	}
});

app.directive('chooseMaterial', function(MaterialsModel){
	return {
		restrict: "E",
		templateUrl: "materials/directives/chooseMaterial.html",		
		link: function(scope, element, attrs){
			scope.chooseMaterial = function(material) {
				var target = eval("scope."+attrs.target);				
				var mat = new Object(), isExist = false;
				if (!target.materials) target.materials=[];
				target.materials.forEach(function(item){
					if (item.id==material.id) {
						alert("Такой инструмент уже есть");
						isExist = true;
					}
				});
				if (isExist) return;
				mat.copyObject(material);
				mat.name = mat.charInString;
				mat.price = Number(mat.price);	
				mat.number = 0;
				delete mat.charInString;
				target.materials.unshift(mat);
				scope.showchooseMaterial=false;
			}
		}
	}
});
