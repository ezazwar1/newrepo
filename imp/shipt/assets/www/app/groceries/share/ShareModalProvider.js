/**
 * Created by Shipt
 */

(function () {
    'use strict';

    angular.module('shiptApp').factory('ShareModalProvider', [

        '$rootScope',
        '$ionicModal',
        ShareModalProvider]);

    function ShareModalProvider(
                              $rootScope,
                              $ionicModal) {
      var init = function($scope, source) {
          var promise;
          var tpl = 'app/groceries/share/shareModal.html'
          $scope = $scope || $rootScope.$new();
          $scope.source = source;
          promise = $ionicModal.fromTemplateUrl(tpl, {
            scope: $scope,
            animation: 'slide-in-up'
          }).then(function(modal) {
            $scope.modal = modal;
            modal.show();
          });

          $scope.openModal = function() {
             $scope.modal.show();
           };
           $scope.closeModal = function() {
             $scope.modal.hide();
           };
           $rootScope.$on('hide.share.modal', function(){
               $scope.modal.hide();
           })
           $scope.$on('$destroy', function() {
             $scope.modal.remove();
           });

          return promise;
        }

        return {
          showModal: init
        }

    }
})();
