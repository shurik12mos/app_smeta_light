'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
  'ngRoute',  
  'ngResource',
  'myApp.material',
  'myApp.instruments',
  'myApp.commonChar'
])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/instruments/', {
    templateUrl: '/instruments/view/instruments.html',
    controller: 'InstrumentsCtrl'
  })
  .when('/commonChar/', {
    templateUrl: '/commonChar/view/commonChar.html',
    controller: 'CommonCharCtrl'
  })   
  .when('/materials/', {
    templateUrl: 'materials/view/materials.html',
    controller: 'MaterialCtrl'
  }) 
  .otherwise({redirectTo: '/materials/'});
}])
app.controller('AppCtrl', [function(){}]);
