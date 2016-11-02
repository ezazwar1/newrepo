/*global define*/
define([
    'app',
    'moment',
    'services/message',
    'services/image',
    'services/api',
    'services/user',
    'services/browse',
    'factories/modal'
], function (app, moment) {

    'use strict';

    app.controller('MessageCtrl', [
        '$scope',
        '$rootScope',
        '$ionicScrollDelegate',
        'messageService',
        'imageService',
        'apiService',
        'userService',
        'browseService',
        'ModalFactory',
        function ($scope, $rootScope, $ionicScrollDelegate, messageService, imageService, apiService, userService, browseService, modalFactory) {
            var priceDetailsModal;

            $scope.messages = {
                entries: [],
                pager: {
                    filter: {
                        creationDate: Date.now()
                    }
                }
            };

            $scope.messageTexts = apiService.config.pushNotification.messages;

            modalFactory($scope, 'app/templates/priceDetailsModal.html').then(function (modal) {
                priceDetailsModal = modal;
            });

            function getMessages(pager) {

                if (!$scope.messages.pager.page || $scope.messages.pager.page < $scope.messages.pager.pages) {
                    $scope.messages.pager.page = $scope.messages.pager.page + 1;
                }
                pager = pager || angular.copy($scope.messages.pager);
                messageService.get(pager).then(function (messages) {
                    angular.forEach(messages.entries, function (message) {
                        if (message.style && message.style.image) {
                            message.imagePath = imageService.getPath(message.style.image, 600);
                        }

                        if (message.type === 'inFeed' || message.type === 'comment' || message.type === 'rating') {
                            if (userService.user.language === 'de') {
                                message.textToShow = $scope.messageTexts[message.type].text.de;
                            } else {
                                message.textToShow = $scope.messageTexts[message.type].text.en;
                            }
                            if (message.type === 'rating') {
                                if (message.data.ratingCount === 25) {
                                    message.textToShow = message.textToShow.replace('{rating}', message.data.ratingCount + 25);
                                } else if (message.data.ratingCount === 75) {
                                    message.textToShow = message.textToShow.replace('{rating}', message.data.ratingCount + 25);
                                } else {
                                    message.textToShow = message.textToShow.replace('{rating}', message.data.ratingCount + 50);
                                }
                            }
                        } else {
                            message.textToShow = $scope.messageTexts[message.type] ? $scope.messageTexts[message.type].text.en : $rootScope.dict.messageTypes[message.type];
                        }
                    });
                    if (!$scope.messages.entries) {
                        $scope.messages = messages;
                    } else {
                        $scope.messages.entries = $scope.messages.entries.concat(messages.entries);
                        $scope.messages.pager = messages.pager;
                    }
                    $scope.loaded = true;
                    $scope.$emit('messageCount');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    $scope.$broadcast('scroll.refreshComplete');
                }, function () {
                    $scope.loaded = true;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    $scope.$broadcast('scroll.refreshComplete');
                });
            }

            $scope.loadMore = function (reset) {
                if (reset) {
                    $scope.messages.entries = [];
                    $scope.messages.pager.page = 0;
                    $scope.messages.pager.filter.creationDate = Date.now();
                }
                getMessages();
            };

            // stop lagging transition
            $scope.$on('$ionicView.enter', function () {
                $scope.entered = true;
            });
            $scope.$on('$ionicView.leave', function () {
                $scope.entered = false;
                $scope.loaded = false;
            });
            $scope.$on('$ionicView.beforeEnter', function () {
                $scope.messages = {
                    entries: [],
                    pager: {
                        filter: {
                            creationDate: Date.now()
                        }
                    }
                };
                $ionicScrollDelegate.resize();
            });

            $scope.getDate = function (date, timeOnly) {
                var t = new Date(),
                    y = new Date().setDate(t.getDate() - 1);
                if (timeOnly) {
                    return moment(date).format('HH:mm');
                }
                if (moment(date).format('DD.MM.YYYY') === moment(t).format('DD.MM.YYYY')) {
                    return $rootScope.dict.today;
                }
                if (moment(date).format('DD.MM.YYYY') === moment(y).format('DD.MM.YYYY')) {
                    return $rootScope.dict.yesterday;
                }
                return moment(date).format('DD.MM.YYYY');
            };

            $scope.goTo = function (type, message) {
                if (type === 'levelUp') {
                    if (message.data.level.priceDetails) {
                        if (message.data.level.priceDetails.length) {
                            if (userService.user.language === 'de') {
                                $scope.priceDetails = message.data.level.priceDetails[0];
                            } else {
                                $scope.priceDetails = message.data.level.priceDetails[1];
                            }
                            priceDetailsModal.show();
                        }
                    }
                } else if (type === 'comment' || type === 'rating' && message.style) {
                    browseService.go('base.styleDetail', {id: message.style._id});
                } else if (type === 'inFeed') {
                    browseService.go('base.fashionFeed.overview');
                }

            };

            $scope.closeModal = function () {
                priceDetailsModal.hide();
            };
        }
    ]);
});
