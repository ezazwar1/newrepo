angular.module('starter')

.controller('FeatureCtrl', function($scope, $ionicModal, $timeout, $http, localStorageService, $state) {

    $scope.data = {};

    $scope.doRefresh = function() {
      $timeout(function () {
        _getData();
        $scope.$broadcast('scroll.refreshComplete');
      }, 2000);
    };
    
    var _getData = function () {
      $http({method: 'GET', url: './js/data/videos.json'}).then(function successCallback(response) {
        $scope.data.videos = response.data;
      }, function errorCallback(response) {
        console.log(response)
      });
    };

    var _init = function () {
      $scope.data.videos = [];
      _getData();
    };

    _init();

});
