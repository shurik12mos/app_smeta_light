'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
  'ngRoute',  
  'ngResource',
  'myApp.material',
  'myApp.instruments',
  'myApp.commonChar',
  'myApp.jobs',
  'myApp.numericIndicators',
  'myApp.listCalculations',
  'myApp.calculation'
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
  .when('/jobs/', {
    templateUrl: 'jobs/view/jobs.html',
    controller: 'JobsCtrl'
  })
  .when('/numericIndicators/', {
    templateUrl: 'numericIndicators/view/numericIndicators.html',
    controller: 'NumericIndicatorsCtrl'
  })
 .when('/listCalculations/', {
    templateUrl: 'listCalculations/view/listCalculations.html',
    controller: 'ListCalculationsCtrl'
  }) 
  .when('/calculation/:calcId', {
    templateUrl: 'calculation/view/calculation.html',
    controller: 'CalculationCtrl'
  })
  .otherwise({redirectTo: '/materials/'});
}])
app.controller('AppCtrl', [function(){
	
}]);
