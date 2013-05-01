angular.module('AdView', ['ngResource'], function($routeProvider, $locationProvider){

  $routeProvider
    .when('/admin/campaigns', {
      templateUrl: '/template/campaigns',
      controller: CampaignsCtrl
    })
    .when('/admin/campaigns/:id', {
      templateUrl: '/template/campaign-details',
      controller: CampaignDetailsCtrl
    })
    .otherwise({
      templateUrl: '/template/home'
    });

  $locationProvider.html5Mode(true);

})
.factory('Campaign', function($resource){
  return $resource('/api/campaigns/:id', {id: '@id'});
});

window.CampaignsCtrl = function($scope, Campaign){
  $scope.campaigns = Campaign.query();
};

window.CampaignDetailsCtrl = function($scope, $route, $location, Campaign){

  $scope.errors = null;

  $scope.campaign = Campaign.get({id: $route.current.params.id});

  $scope.save = function(){
    $scope.campaign.$save(function(res){
      if (res.errors) {
        $scope.errors = res.errors;
        return;
      }
      console.log($scope.campaign.id, 'has been saved!');
      $location.path('/admin/campaigns');
    });
  };
};
