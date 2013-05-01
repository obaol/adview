angular.module('AdView', ['ngResource'], function($routeProvider, $locationProvider){

  $routeProvider
    .when('/admin/campaigns', {
      templateUrl: '/template/campaigns',
      controller: CampaignsCtrl
    })
    .otherwise({
      templateUrl: '/template/home'
    });

  $locationProvider.html5Mode(true);

})
.factory('Campaign', function($resource){
  return $resource('/api/campaigns');
});

window.CampaignsCtrl = function($scope, Campaign){
  $scope.campaigns = Campaign.query();
};