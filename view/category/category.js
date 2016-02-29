'use strict';

var app = angular.module('myApp.category', ['ngRoute'])
.controller('CategoryCtrl', ['$http', '$scope', 'Category', 'Section', function($http, $scope, Category, Section) {
	
	var scope = $scope;	
	
	function listCategory() {
		var categories = Category.query(function(){
			$scope.categories = categories;
			if (scope.categories.length>0) {
				scope.active_category = scope.categories[0].id_category;
				scope.getSections(scope.active_category);
								
				scope.categories[0].active = true;				
			} 			
		});
	}
	
	listCategory();	
	
	$scope.add_category = function ($scope) {			
		var newCategory = new Category();
		newCategory.name = this.categoryName;
		newCategory.desc = this.categoryDescription;
		this.categoryName="";
		this.categoryDescription="";
		newCategory.$save().then(function (responce){
			listCategory();			
		})
		
	}

	$scope.update_category = function (category, name, desc, $scope) {
		var updateCategory = new Category();
		updateCategory.id_category = category.id_category;
		updateCategory.name = name;
		updateCategory.desc =desc;
		category.name = name;
		category.description = desc;
		updateCategory.$update().then(function (response) {
				
		});		
	}
	
	$scope.delete_category = function (id) {
		
		var del = new Category();
		del.$delete({id: id}).then(function(response) {
			listCategory();						
		});			
	}
	
	$scope.getSections = function(id) {			
		$scope.active_category = id;		
		var getSection = Section.query({id_category: id},function(response) {			
			$scope.sections = response;				
		});		
	}		
	
	$scope.add_section = function ($scope) {		
		var newSection = new Section();
		newSection.name = this.sectionName;		
		newSection.desc = this.sectionDescription;
		newSection.keywords = this.sectionKeywords;
		newSection.id_category = this.active_category;
		
		if (newSection.id_category) {
			this.sectionName="";
			this.sectionDescription="";
			this.sectionKeywords = "";
			newSection.$save().then(function (response){				
				scope.getSections(scope.active_category);
			})
		}		
	}

	$scope.update_section = function (section, name, desc, keywords, $scope) {
		var updateSection = new Section();
		updateSection.id_job_section = section.id_job_section;
		updateSection.name = name;
		updateSection.description =desc;
		updateSection.keywords =keywords;		
		updateSection.$update().then(function (response) {
			scope.getSections(scope.active_category);
		});		
	}
	
	$scope.delete_section = function (id) {		
		var del = new Section();
		del.$delete({id: id}).then(function(response) {
			scope.getSections(scope.active_category);
		});			
	}
	
	//включение активной категории
	$scope.activatedCategory = function(id) {		
		var length = $scope.categories.length;
		for (var i=0; i<length; i++) {
			if (scope.categories[i].id_category == id) {				
				scope.categories[i].active = true;
			} else {				
				scope.categories[i].active = false;
			}						
		}		
	}
			
}]);
