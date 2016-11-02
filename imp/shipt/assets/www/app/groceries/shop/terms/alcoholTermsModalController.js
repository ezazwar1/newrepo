/**
 * Created by Shipt
 */



(function () {
    'use strict';

    angular.module('shiptApp').controller('alcoholTermsModalController', [
        '$scope',
        '$rootScope',
        '$ionicModal',
        '$log',
        '$state',
        'UIUtil',
        '$ionicActionSheet',
        '$timeout',
        alcoholTermsModalController]);

    function alcoholTermsModalController($scope,
                                    $rootScope,
                                    $ionicModal,
                                    $log,
                                    $state,
                                    UIUtil,
                                    $ionicActionSheet,
                                    $timeout) {

      $scope.completeOrder = function() {
          $rootScope.alcohol_terms_accepted = true;
          $scope.alcoholTermsModal.hide()
          $state.go('app.checkout');
      };

      $scope.closeModal = function() {
          $rootScope.alcohol_terms_accepted = false;
          $scope.alcoholTermsModal.hide()
      }

      $scope.termsClass = function () {
          if (webVersion) {
              return "web-alcohol-terms"
          }
      }
     };
})();
