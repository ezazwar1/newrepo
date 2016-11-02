
(function () {
    'use strict';

    angular.module('shiptApp').factory('SubstitutionOptionsModalProvider', [
        '$rootScope',
        '$ionicModal',
        '$q',
        SubstitutionOptionsModalProvider]);

    function SubstitutionOptionsModalProvider(
        $rootScope,
        $ionicModal,
        $q) {

        var selectorModal = null;

        function getModal($scope) {
            var defer = $q.defer();

            if(selectorModal){
                defer.resolve(selectorModal);
            } else {
                var tpl = 'app/groceries/shop/checkOut/substitutionOptions/substitutionOptionsModal.html';
                $ionicModal.fromTemplateUrl(tpl, {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function(modal) {
                    selectorModal = modal;
                    defer.resolve(selectorModal);
                });
            }
            return defer.promise;
        }


        var init = function($scope, options, selectedOption) {
            var defer = $q.defer();
            $scope = $scope || $rootScope.$new();
            $scope.selectedOption = selectedOption;
            $scope.options = options;
            if(selectorModal)selectorModal.remove();
            selectorModal = null;
            getModal($scope)
                .then(function(modal){
                    $scope.$broadcast('refresh.substitution.options.selector');
                    modal.show();
                });

            $scope.closeModal = function(selectedOption) {
                defer.resolve(selectedOption);
                selectorModal.hide();
            };

            $scope.$on('$destroy', function() {
                if(selectorModal)selectorModal.remove();
                selectorModal = null;
            });

            return defer.promise;
        };

        return {
            showSubstitutionOptionsModal: init
        }

    }
})();
