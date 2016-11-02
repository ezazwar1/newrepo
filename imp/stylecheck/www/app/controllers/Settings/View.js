/*global define*/
define([
    'app',
    'factories/popup',
    'factories/modal'
], function (app) {

    'use strict';

    app.controller('SettingsCtrl', [
        '$scope',
        '$rootScope',
        'PopupFactory',
        'ModalFactory',
        function ($scope, $rootScope, popupFactory, modalFactory) {
            var howToModal;

            $scope.allHelp = true;

            $scope.$on('$ionicView.enter', function () {
                $scope.showMenu = true;
            });

            modalFactory($scope, 'app/templates/partials/howToModal.html').then(function (modal) {
                howToModal = modal;
            });

            $scope.showHowToModal = function () {
                howToModal.show().then(function () {
                    $scope.contentLoaded = true;
                });
            };

            $scope.closeModal = function () {
                howToModal.hide();
            };

            $scope.logout = function () {
                popupFactory({
                    title: $rootScope.dict.logout,
                    template: $rootScope.dict.reallyLogOut,
                    buttons: [
                        {
                            text: $rootScope.dict.cancel,
                            type: 'button button-block button-outline button-dark'
                        },
                        {
                            text: $rootScope.dict.logout,
                            type: 'button button-block button-outline button-assertive',
                            onTap: function () {
                                // logout
                                $scope.$emit('clearLogin');
                            }
                        }
                    ]
                });
            };
        }
    ]);
});
