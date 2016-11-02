/*global angular*/
'use strict';
angular.module('stohke.controllers')

.controller('StartController', ['$scope', '$stateParams', '$state', 'authService', 'analyticsService', '$localStorage', 'ngNotify', '$ionicHistory', '$timeout', function($scope, $stateParams, $state, authService, analyticsService, $localStorage, ngNotify, $ionicHistory, $timeout) {
    console.log('Start Controller');
    function goHome() {
        // Where to go upon launch
        $state.go('app.home');

        $timeout(function () {
            $ionicHistory.clearHistory();
        }, 100);
    }
    if ($localStorage.skipStart) {
        console.log('forward to explore');
        goHome();
    }
    $scope.signIn = function () {
        analyticsService.trackEvent('Authentication', 'User Logged In');
        authService.socialLogin('Facebook').then(function () {
            $localStorage.skipStart = true;
            goHome();
        }, function () {
            ngNotify.set('There was a problem signing in. Please try again later.', {
                type: 'error',
            });
        });
    };
    $scope.skip = function () {
        analyticsService.trackEvent('Authentication', 'Login Skipped');
        $localStorage.skipStart = true;
        goHome();
    };
    $scope.panels = [
        {
            text: 'A place online to be inspired <br/> to go offline',
            style: {
                'background': 'url(img/0.jpg) no-repeat',
                'background-size': 'cover',
                'background-position': 'center',
                'transition': 'background-image .5s ease'
            }
        }
    ];

    $scope.activePanel = 0;
}])
.controller('SearchController', ['$scope', '$stateParams', '$state', function($scope, $stateParams, $state) {
    console.log('Search Controller', $stateParams);
    if (!$stateParams.query.length) {
        $state.go('app.explore.main');
    } else {
        $scope.query = $stateParams.query;
    }
}])
.controller('StaticController', ['$scope', 'authService', '$ionicNavBarDelegate', function($scope, authService, $ionicNavBarDelegate) {
    console.log('Static Controller');
    authService.authentication().then(function (result) {
        $scope.userAuth = result;
    });
    $scope.playVideo = function (url) {
        window.open(url + '?&autoplay=1', '_blank', 'location=no');
    };
    $scope.signIn = function () {
        authService.socialLogin('Facebook');
    };
    $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        if (toState.name === 'app.about') {
            $ionicNavBarDelegate.title('About Stohke');
        };
    });
}]);