/*global define, document, navigator, ionic, StatusBar*/
define([
    'app',
    'services/cart',
    'services/browse',
    'factories/popup'
], function (app) {

    'use strict';

    app.controller('AppCtrl', [
        '$scope',
        '$rootScope',
        '$ionicPlatform',
        '$ionicSideMenuDelegate',
        '$state',
        '$document',
        '$window',
        'browseService',
        'PopupFactory',
        function ($scope, $rootScope, $ionicPlatform, $ionicSideMenuDelegate, $state, $document, $window, browseService, PopupFactory) {

            //overwrite a href
            $document.on('click', function (e) {
                e = e ||  $window.event;
                var element = e.target || e.srcElement;
                //alert(element.tagName)
                if (element.tagName === 'DIV') {
                    return false;
                }

                if (element.tagName.toLowerCase() === 'a' && element.href && element.href !== '#') {
                    e.preventDefault();
                    // check if phone number
                    if (element.href.indexOf('tel:') !== -1) {
                        $window.open(element.href, '_system', 'location=yes,enableViewportScale=yes');
                        return false; // prevent default action and stop event propagation
                    }
                    // check if mail
                    if (element.href.indexOf('mailto:') !== -1) {
                        $window.open(element.href, '_system', 'location=yes,enableViewportScale=yes');
                        return false; // prevent default action and stop event propagation
                    }
                    // check if external link
                    if (element.href.match(/^(http|https|www)/)) {
                        $window.open(element.href, '_blank', 'location=yes,enableViewportScale=yes');
                        return false; // prevent default action and stop event propagation
                    }
                }
            });

            // exit app on back button
            // set own back button functionality
            $ionicPlatform.registerBackButtonAction(function () {
                if ($state.current.name === 'shop.start') {
                    return new PopupFactory({
                        title: $rootScope.dict.exit.title,
                        template: $rootScope.dict.exit.message,
                        buttons: [
                            {
                                text: $rootScope.dict.no,
                                type: 'button-default'
                            },
                            {
                                text: $rootScope.dict.yes,
                                type: 'button-energized',
                                onTap: function () {
                                    navigator.app.exitApp();
                                }
                            }
                        ]
                    });
                }
                browseService.back();
            }, 100);

            // hide splashscreen
            if (navigator.splashscreen) {
                navigator.splashscreen.hide();
            }

            if ($window.cordova && ionic.Platform.isIOS()) {
                StatusBar.overlaysWebView(true);
                StatusBar.styleLightContent();
            }

            $scope.$watch(function () {
                return $rootScope.forceReload;
            }, function (forceReload) {
                if (forceReload && $state.current.name !== 'shop.start') {
                    browseService.navigate('/start');
                } else if (forceReload && $state.current.name === 'shop.start') {
                    browseService.reload(true);
                }
            });

            $scope.$watch(function () {
                return $state.current.name;
            }, function (name) {
                //$ionicSideMenuDelegate.canDragContent(false);
                if (name === 'shop.start' && $rootScope.forceReload) {
                    browseService.reload(true);
                }
            });

            $scope.$watch(function () {
                return $state.current.contentPage;
            }, function (contentPage) {
                $scope.noContentPage = !contentPage ? true : false;
            });

            $scope.$watch(function () {
                return $state.current.checkout;
            }, function (checkout) {
                $scope.noCheckout = !checkout ? true : false;
                if (checkout) {
                    $ionicSideMenuDelegate.canDragContent(false);
                } else {
                    $ionicSideMenuDelegate.canDragContent(true);
                }
            });
        }
    ]);
});