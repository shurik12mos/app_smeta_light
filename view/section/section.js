'use strict';

var app = angular.module('myApp.section', ['ngRoute'])
.controller('SectionCtrl', ['$http', '$scope', '$routeParams', 'SectionOne', function($http, $scope, $routeParams, SectionOne) {	
	var scope = $scope;
	
	$scope.params = $routeParams;
	
	var id_section = $scope.params.id_job_section;	
	function getSection(id) {	
		console.log(id);
		var section = SectionOne.get({id_section: id}, function(response) {
			console.log(response);
			$scope.section = section;
			
		});		
	}
	
	getSection(id_section);
	
	$scope.add_char = function($scope) {
		var newChar = new SectionOne();
		newChar.id_section = id_section;
		newChar.name = this.charName;
		newChar.description = this.charDescription;
		newChar.measure = this.charMeasure;
		console.log(newChar);
		this.charName="";
		this.charDescription="";
		this.charMeasure="";
		console.log(newChar);
		newChar.$save().then(function (responce){
			getSection(id_section);		
		})
	}
	
	$scope.update_charName = function(id, name, measure, description) {
		var updateCharName = new SectionOne();
		updateCharName.id = id;
		updateCharName.name = name;
		updateCharName.measure = measure;
		updateCharName.description = description;
		updateCharName.id_section = id_section;
		console.log(updateCharName);
		updateCharName.$update().then(function (response) {			
			getSection(id_section);
		});	
	}
	
	$scope.delete_charName = function(id) {
		var deleteCharName = new SectionOne();		
		deleteCharName.id = id;		
		deleteCharName.$delete({id: id}).then(function(response, headers) {				
			getSection(id_section);
		});	
	}
	
}]);

app.directive("addJob", function(Job, Material, Instrument){
	return {
		restrict: "E",
		templateUrl: "directives/addJob/addJob.html",		
		link: function(scope, element, attrs){
			scope.add_category = function ($scope) {				
				var newCategory = new Category();
				newCategory.name = this.categoryName;
				newCategory.desc = this.categoryDescription;
				this.categoryName="";
				this.categoryDescription="";
				newCategory.$save().then(function (responce){
					scope.listCategory();
					scope.addCategoryShow = false;
				})			
			}			
		}
	}
});