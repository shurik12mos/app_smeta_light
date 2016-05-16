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
