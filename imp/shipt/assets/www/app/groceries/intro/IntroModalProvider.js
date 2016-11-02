/**
 * Created by Shipt
 */

(function () {
    'use strict';

    angular.module('shiptApp').factory('IntroModalProvider', [
        '$rootScope',
        '$ionicModal',
        '$ionicSlideBoxDelegate',
        'common',
        'chooseStoreModal',
        'AuthService',
        'AppAnalytics',
        IntroModalProvider]);

    function IntroModalProvider(
                              $rootScope,
                              $ionicModal,
                              $ionicSlideBoxDelegate,
                              common,
                              chooseStoreModal,
                              AuthService,
                              AppAnalytics) {

      var introModal, welcomeModal = null;

      var initIntroModal = function($scope) {
          var promise;
          var tpl = 'app/groceries/intro/intro.html'
          $scope = $scope || $rootScope.$new();
          if(!introModal){
            $ionicModal.fromTemplateUrl(tpl, {
                scope: $scope,
                animation: 'slide-in-up'
              }).then(function(modal) {
                introModal = modal;
                if(!hasIntroModalBeenShown()){
                    AppAnalytics.track('introModalShown');
                    modal.show();
                }
              });
          } else {
              if(!hasIntroModalBeenShown()){
                  introModal.show();
              }
          }
          $scope.closeIntro = function () {
              if($scope.slideIndex != 3){
                  $scope.next();
              } else {
                  setIntroModalShown();
                  introModal.hide();
                  chooseStoreModal.showIfNeeded();
              }
          };
          $scope.slideChanged = function(index) {
              $scope.slideIndex = index;
          };
          $scope.next = function() {
              $ionicSlideBoxDelegate.next();
          };
          $scope.previous = function() {
              $ionicSlideBoxDelegate.previous();
          };
        };

        var initWelcomeModal = function($scope) {
            var promise;
            var tpl = 'app/groceries/intro/welcome.html'
            $scope = $scope || $rootScope.$new();
            if(!welcomeModal && !webVersion){
              $ionicModal.fromTemplateUrl(tpl, {
                  scope: $scope,
                  animation: 'slide-in-up'
                }).then(function(modal) {
                  welcomeModal = modal;
                  welcomeModal.show();
                  AppAnalytics.track('splashScreenShown');
                });
            } else if(webVersion) {
                common.checkLogin();
            } else {
                welcomeModal.show();
            }
            $scope.closeWelcomeIntro = function (screenToShow) {
                if(screenToShow == 'login'){
                    common.checkLogin();
                } else {
                    $rootScope.$broadcast('show-register-page');
                }
                welcomeModal.hide();
            };

        };

        function setIntroModalShown(){
            localStorage.setItem("intro-modal-shown",JSON.stringify({shown:true, customer_id:AuthService.getUserInfo().id}))
        }

        function hasIntroModalBeenShown(){
            try {
                var shown = JSON.parse(localStorage.getItem("intro-modal-shown"))
                return shown.shown == true && shown.customer_id == AuthService.getUserInfo().id;
            } catch (e) {
                return false;
            }
        }

        return {
          showIntroModal: initIntroModal,
          showWelcomModal: initWelcomeModal,
          hasIntroModalBeenShown: hasIntroModalBeenShown
        }

    }
})();
