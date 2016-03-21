'use strict';

var app = angular.module('myApp.category', ['ngRoute'])
.controller('CategoryCtrl', ['$http', '$scope', 'Category', 'Section', function($http, $scope, Category, Section) {
	
	var scope = $scope;	
	
	function listCategory() {
		var categories = Category.query(function(){
			$scope.categories = categories;
			if (scope.categories.length>0) {
				scope.active_category = scope.categories[0].category_id;
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
		updateCategory.category_id = category.category_id;
		updateCategory.name = name;
		updateCategory.desc =desc;
		category.name = name;
		category.description = desc;
		console.log(updateCategory);
		updateCategory.$update().then(function (response) {
			listCategory();	
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
		var getSection = Section.query({category_id: id},function(response) {			
			$scope.sections = response;				
		});		
	}		
	
	$scope.add_section = function ($scope) {		
		var newSection = new Section();
		newSection.name = this.sectionName;		
		newSection.desc = this.sectionDescription;
		newSection.keywords = this.sectionKeywords;
		newSection.category_id = this.active_category;
		
		
		if (newSection.category_id) {
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
		updateSection.job_section_id = section.job_section_id;
		updateSection.name = name;
		updateSection.description =desc;
		updateSection.keywords =keywords;		
		updateSection.$update().then(function (response) {
			scope.getSections(scope.active_category);
		});		
	}
	
	$scope.delete_section = function (id) {		
		var del = new Section();		
		del.$delete({job_section_id: id}).then(function(response) {
			scope.getSections(scope.active_category);
		});			
	}
	
	//включение активной категории
	$scope.activatedCategory = function(id) {		
		var length = $scope.categories.length;
		for (var i=0; i<length; i++) {
			if (scope.categories[i].category_id == id) {				
				scope.categories[i].active = true;
			} else {				
				scope.categories[i].active = false;
			}						
		}		
	}
			
}]);
