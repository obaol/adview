angular.module('AdView', ['ngResource'], function($routeProvider, $locationProvider){

  $routeProvider
    .when('/admin/campaigns', {
      templateUrl: '/template/campaigns'
    })
    .otherwise({
      templateUrl: '/template/home'
    });


  $locationProvider.html5Mode(true);

});