/*global angular*/
'use strict';
angular.module('stohke.controllers')

.controller('AppController', [
    '$scope',
    '$ionicModal',
    '$ionicPopup',
    '$timeout',
    '$state',
    '$location',
    '$ionicHistory',
    '$ionicPlatform',
    '$ionicScrollDelegate',
    '$ionicSideMenuDelegate',
    'authService',
    'analyticsService',
    'ngNotify',
    '$localStorage',
    'STOHKE_CONFIG',
    'Utils',
    function(
        $scope,
        $ionicModal,
        $ionicPopup,
        $timeout,
        $state,
        $location,
        $ionicHistory,
        $ionicPlatform,
        $ionicScrollDelegate,
        $ionicSideMenuDelegate,
        authService,
        analyticsService,
        ngNotify,
        $localStorage,
        _STOHKE,
        Utils
    ) {
        console.log('App Controller');
        $ionicHistory.clearHistory();

        // When to expose side menu
        $scope.exposeAsideWhen = 'large';
        $scope.hideMenu = false;

        $scope.$on('$cordovaNetwork:offline', function(event, networkState){
            console.error(event, networkState);
            ngNotify.set('Lost network connection', {
                type: 'error',
                sticky: true,
                position: 'bottom'
            });
        });
        $scope.$on('$cordovaNetwork:online', function(event, networkState){
            console.log(event, networkState);
            ngNotify.dismiss();
            ngNotify.set('Back online!', {
                type: 'info',
                sticky: false,
                duration: 1000,
                position: 'bottom'
            });
        });
        $scope.sports = _STOHKE.sports;
        $scope.categories = _STOHKE.menuPostSports;

        $scope.login = function() {
            authService.socialLogin('Facebook');
        };
        $scope.logout =  function () {
            authService.logout();
            $localStorage.skipStart = false;
            // $localStorage.hasAuthenticated = false;
            $state.go('app.home');
            $ionicHistory.clearHistory();
            analyticsService.trackEvent('Authentication', 'User Logged Out');
        };

        // Perform the login action when the user submits the login form
        $scope.doLogin = function() {
            // OpenFB login
            authService.socialLogin('Facebook');
            analyticsService.trackEvent('Authentication', 'User Logged In');
        };

        $scope.getUserInfo = function () {
            authService.checkAuth().then(function (data) {
                $scope.userInfo = data;
            });
        };
        $scope.onKey = function (e) {

            if (e.which === 13) {
                if (!$scope.query.length) {
                    return false;
                }
                e.target.blur();
                $scope.search();
            }
        };

        $scope.onFocus = function (e) {
            // var menu = $ionicSideMenuDelegate.$getByHandle('mainmenu');
            // console.log('focused on search', e, menu);
            $ionicScrollDelegate.freezeAllScrolls(true);
            window.addEventListener('native.keyboardshow', function (e) {
                $scope.exposeAsideWhen = '';
                if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                    window.cordova.plugins.Keyboard.disableScroll(true);
                }
                $scope.$broadcast('$ionicExposeAside');
            });
            window.addEventListener('native.keyboardhide', function (e) {
                // override aside to be open only when large
                $scope.exposeAsideWhen = 'large';
                if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                    window.cordova.plugins.Keyboard.disableScroll(false);
                }
                $scope.$broadcast('$ionicExposeAside', false);
            });
        };

        $scope.$on('user:profileImageUpdated', function (ev, timeStamp) {
            // console.log('user:profileImageUpdated', timeStamp);
            $timeout(function(){
                $scope.userInfo.data.UrlPic += '?' + timeStamp;
            }, 0);
        });

        $scope.openExternalLink = function (link) {
            Utils.openExternalUrl(link);
        };
        $scope.search = function () {
            console.log('do search:', $scope.query);

            // $state.go('app.explore.list.search', {'query': $scope.query});
            $location.path('/explore/search/' + $scope.query);
            $scope.query = '';
            $ionicHistory.nextViewOptions({historyRoot: true});
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                window.cordova.plugins.Keyboard.close();
                window.cordova.plugins.Keyboard.disableScroll(false);
            }
            // Close left menu
            $ionicSideMenuDelegate.toggleLeft();
            $ionicScrollDelegate.freezeAllScrolls(false);
            window.removeEventListener('native.keyboardshow');
            return false;
        };
        $scope.$on('menu:buttonStatus', function (evt, data) {
            $scope.hideMenu = data.hideMenu;
        });
        $scope.$on('user:loggedIn', function(e, authData) {
            $scope.userInfo = authData;
        });
        $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $scope.currentPage = $location.$$path;
        });

        $ionicPlatform.registerBackButtonAction(function (event) {

            console.log($state.current.data);

            if ($state.current.data.exitPromptOnBack) {

                var confirmPopup = $ionicPopup.confirm({
                   title: 'Exit Stohke App?',
                   // template: 'Are you sure you want to exit?',
                   cancelText: 'No',
                   okText: 'Yes'
                });
                
                confirmPopup.then(function (res) {
                   if (res) {
                      navigator.app.exitApp();
                   }
                });
            } else {
                window.history.back();
            }
        }, 100);

        // Default page
        $scope.currentPage = $location.$$path;
    }
])
.controller('hotspotsController', ['$scope', '$timeout', function($scope, $timeout) {
    console.log('hotspotController init');
    // Initial delay for the hotspots to disappear
    var delay = 1000;
    // var parentSlide = $scope.$parent.$index;
    var hotspotTimeout;
    $scope.hotspotsVisible = false;
    $scope.toggleHotspots = function () {
        $scope.hotspotsVisible = !$scope.hotspotsVisible;
        $timeout.cancel(hotspotTimeout);
    };
    $scope.doReset = function () {
        $scope.hotspotsVisible = true;
        hotspotTimeout = $timeout(function(){
            // console.log('timeout called');
            $scope.toggleHotspots();
        }, delay);
    };
    $scope.$on('hotspot:interacted', function () {
        // console.log('cancel timeout');
        $timeout.cancel(hotspotTimeout);
    });
    $timeout(function(){
        if ($scope.slideIndex < 3) {
            $scope.doReset();
        }
    }, 0);
    // $scope.$on('$destroy', function() {
    //     $scope.$off('hotspot:interacted');
    // });
}])
;