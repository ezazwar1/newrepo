angular.module('swMobileApp').directive('customBrandHome', function () {
    return {
        restrict: 'A',
        scope: {
            isPremiumUser: "=", // Might need to be "@"
            workoutCategory: "@"
        },
        controller: function ($scope, $element, $attrs, $sce) {
            $scope.mainScreenBranding = angular.copy(globalSworkitAds.customBrandExperience.mainScreenBranding);
            $scope.mainScreenBranding.firstText = $sce.trustAsHtml(globalSworkitAds.customBrandExperience.mainScreenBranding.firstText);
            $scope.mainScreenBranding.secondText = $sce.trustAsHtml(globalSworkitAds.customBrandExperience.mainScreenBranding.secondText);
        },
        template: '<div ng-if="mainScreenBranding.category == workoutCategory && !isPremiumUser"><p ng-bind-html="mainScreenBranding.firstText"></p><img ng-src="{{mainScreenBranding.companyLogo}}"><p ng-bind-html="mainScreenBranding.secondText"></p></div>'
    }
});