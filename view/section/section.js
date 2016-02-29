'use strict';

var app = angular.module('myApp.section', ['ngRoute'])
.controller('SectionCtrl', ['$http', '$scope', '$routeParams', 'Section', function($http, $scope, $routeParams, Section) {	
	
	$scope.params = $routeParams;
	var id_section = $scope.params.id_job_section;	
	function getSection(id) {		
		var section = Section.get({id_section: id}, function(response) {
			$scope.section = section;			
		});		
	}
	
	getSection(id_section);
	
	
}]);