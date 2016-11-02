angular.module('swMobileApp').controller('WelcomeCtrl', function ($rootScope, $scope, $translate, $http, $state, $ionicSideMenuDelegate, $log) {
    $log.info("WelcomeCtrl");

    $scope.init = function () {
        $scope.show_hidden_actions = false;
        $scope.abTestingButton = false;
        $scope.canSkipAccountRegistration = false;
        $scope.welcomeText = '';

        var getUrl = 'http://sworkitapi.herokuapp.com/abtest?language=' + PersonalData.GetUserSettings.preferredLanguage;
        $http.get(getUrl, {timeout: 500})
            .then(function (response) {
                $scope.abTestingButton = response.data.currentTests['createAccountButton'] || false;
                $scope.canSkipAccountRegistration = response.data.currentTests['canSkipAccountRegistration'] || false;
                $scope.welcomeText = response.data.currentTests['welcomeText'] || $translate.instant('ACCOUNTPROP');
            })
            .catch(function (reject) {
                $log.warn("Could not reach A/B testing server", reject);
                $scope.welcomeText = $translate.instant('ACCOUNTPROP');
            });
    };

    $scope.createAccount = function () {
        if ($scope.abTestingButton) {
            trackEvent('Create Account', $scope.abTestingButton, 0);
        }
        $state.go('app.signup');
    };

    $scope.skipAccount = function () {
        if ($scope.abTestingButton) {
            trackEvent('Skip Account', $scope.abTestingButton, 0);
        }
        $state.go('app.home');
    };

    $scope.toggleHiddenActions = function () {
        $scope.show_hidden_actions = !$scope.show_hidden_actions;
    };

    $scope.$on('$ionicView.enter', function () {
        if ($rootScope.showWelcome) {
            $ionicSideMenuDelegate.canDragContent(false);
        }
    });

    $scope.$on('$ionicView.leave', function () {
        $rootScope.showWelcome = false;
        $ionicSideMenuDelegate.canDragContent(true);
    });

    $scope.init();
});
