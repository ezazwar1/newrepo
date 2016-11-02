angular.module('swMobileApp').controller('UserTierCtrl', function ($scope, AccessService, $state, $rootScope, $timeout, $log) {
    $log.info("UserTierCtrl");
    var EVENT_ACTION = "Launch Tier";

    $scope.selectPremium = function () {
        $log.debug("selectPremium()");
        trackEvent(EVENT_ACTION, 'premium', 0);
        $rootScope.showPremium('onboarding');
        $timeout(function(){
            //$timeout allows the Premium modal to be present before changing screen behind it
            $state.go('app.home');
        },1000);
    };

    $scope.selectFree = function () {
        $log.debug("selectFree()");
        trackEvent(EVENT_ACTION, 'free', 0);
        $state.go('app.home');
    };

    $scope.$on('$ionicView.leave', function () {
        // Gives time for AccountService.addNewUserToQueue to have completed
        AccessService.getBasicAccess()
            .then(function (legacyBasicAccess) {
                $log.debug("UserTierCtrl > getBasicAccess() resolved", legacyBasicAccess);
            })
            .catch(function (rejected) {
                $log.warn("UserTierCtrl > getBasicAccess() rejected", rejected);
            });
    });

});
