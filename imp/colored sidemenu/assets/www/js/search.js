angular.module('starter')

.controller('SearchCtrl', function($scope, $ionicModal, $timeout, $http) {
    $scope.data = {};

    var _getData = function () {
      var time = new Date().getTime();
      $http({method: 'GET', url: './js/data/tvseries.json'}).then(function successCallback(response) {
        $scope.data.videos = response.data;
        console.log(new Date().getTime() - time);
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
