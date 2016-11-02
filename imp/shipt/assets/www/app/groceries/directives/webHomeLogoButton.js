angular
    .module('shiptApp')
    .directive('webHomeLogoButton', ['UIUtil','$ionicHistory','$state','ErrorHandler','$rootScope','FeatureService',webHomeLogoButton]);

function webHomeLogoButton(UIUtil,$ionicHistory,$state,ErrorHandler,$rootScope,FeatureService) {
    var guestAccount = false;
    var directive = {
        restrict: 'EA',
        template: `
            <button href="#/home" ng-click="homeClick()" class="button button-icon icon shipt-logo-button" aria-label="shipped home button">
                <img src="img/logo.png" alt="" aria-hidden="true">
            </button>`,
        link: function(scope, element, attrs) {
            scope.homeClick = function(){
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                // Go back to home
                $state.go('app.home');
                $rootScope.$broadcast('nav.home-menu-item-click');
            }
        },
        scope: { value: '='},
    };
    return directive;
}
