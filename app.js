'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
  'ngRoute',
  'myApp.category', 
  'myApp.section', 
  'ngResource'
])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/category/', {
    templateUrl: 'view/category/category.html',
    controller: 'CategoryCtrl'
  })    
  .when('/category/:id_job_section', {
    templateUrl: 'view/section/section.html',
    controller: 'SectionCtrl'
  })  
  .otherwise({redirectTo: '/category/'});
}])
app.controller('AppCtrl', [function(){}]);

app.factory('Category', function($resource) {
	var Category = $resource('api/category.php',	
			{},
			{
				update: {
						method: "PUT"
						}
			}
		); 
		return Category;
	});

app.factory('Section', function($resource) {
	var Section = $resource('api/section.php',	
			{},
			{
				update: {
						method: "PUT"
						}
			}
		); 
		return Section;
	});

