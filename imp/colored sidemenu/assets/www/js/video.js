angular.module('starter')

.controller('VideoCtrl', function($scope, $ionicModal, $timeout, localStorageService, $sce) {

    $scope.data = {};

    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src);
    }


    $scope.data.video = localStorageService.get('viewVideo');
    $scope.data.video.listEp = _.range($scope.data.video.ep);
    console.log($scope.data, _.range($scope.data.video.ep));




  });
