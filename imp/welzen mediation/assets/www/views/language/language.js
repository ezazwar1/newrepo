'use strict';

angular.module('welzen')

.controller('LanguageController', function($scope, $ionicHistory){

  $scope.goBack = function(count) {
   $ionicHistory.goBack(count);
  };

  $scope.english = true;
  $scope.spanish = false;

})

;
