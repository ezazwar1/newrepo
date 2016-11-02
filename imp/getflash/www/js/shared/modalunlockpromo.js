angular.module('shared.modalunlockpromo', ['ionic'])
.service('ModalUnlockPromoService', function($ionicModal, $model, $ionicPopup, $ionicPlatform, $localstorage, $rootScope, $http, $q, $ionicModal, $helper, LokiDB, AUTH_EVENTS) {

  var init = function($parentScope, promomessage, nopromo, iscontesant){
    var promise;
    $scope = $rootScope.$new();

    $scope.promoMessage = promomessage;
    $scope.fullname = $localstorage.get(AUTH_EVENTS.CURRFASHNAME);
    $scope.isShowThankYou = false;

    if(iscontesant){
      $scope.isShowThankYou = iscontesant;
    }

    var template = 'templates/shared/unlock-promo.html';
    if(nopromo) {
      template = 'templates/shared/thank-you.html';
    }

    promise = $ionicModal.fromTemplateUrl(template, {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal){
      $scope.modal = modal;
      return modal;
    });

    $scope.closeModal = function() {
      $scope.modal.hide();
      $parentScope.closeModal();
    };

    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });

    return promise;
  }

  return {
    init: init
  }
});