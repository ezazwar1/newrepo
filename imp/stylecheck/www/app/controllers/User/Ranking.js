/*global define*/
define([
    'app',
    'services/user',
    'services/image',
    'services/browse',
    'factories/popup'
], function (app) {

    'use strict';

    app.controller('RankingCtrl', [
        '$scope',
        '$rootScope',
        'userService',
        'imageService',
        'browseService',
        'PopupFactory',
        function ($scope, $rootScope, userService, imageService, browseService, popupFactory) {
            function getMe() {
                userService.account().then(function (user) {
                    $scope.me = user;
                    $scope.me.avatarPath = imageService.getPath($scope.me.avatar, 600);

                    if ($scope.me.nextLevel) {
                        var totalPoints = $scope.me.nextLevel.points - $scope.me.level.points,
                            myPoints = $scope.me.points - $scope.me.level.points,
                            percent = myPoints / (totalPoints / 100);

                        if (percent > 100) {
                            $scope.me.fillLevel = '100%';
                        } else {
                            $scope.me.fillLevel = myPoints / (totalPoints / 100) + '%';
                        }
                    }
                });
            }

            function getUsers() {
                userService.get($scope.users.pager).then(function (users) {
                    var currentRank;
                    angular.forEach(users.entries, function (user, index) {
                        user.avatarPath = imageService.getPath(user.avatar, 600);
                        if (!index) {
                            currentRank = 1;
                        } else if (user.points < users.entries[index - 1].points) {
                            currentRank = currentRank + 1;
                        }
                        user.rank = currentRank;
                    });

                    $scope.users = users;
                }, function () {});
            }

            $scope.setFavorite = function (user, index, event) {
                event.stopImmediatePropagation();
                userService.toggleFavorite(user._id, user.username).then(function () {
                    if (!$scope.users.entries[index].isFav) {
                        $scope.users.entries[index].isFav = true;
                    } else {
                        $scope.users.entries[index].isFav = false;
                    }
                });
            };

            $scope.showInfo = function () {
                var message;

                if ($scope.me.nextLevel) {
                    if ($scope.me.language === 'de') {
                        message = $scope.me.nextLevel.message[0].text;
                    } else {
                        message = $scope.me.nextLevel.message[1].text;
                    }
                }

                popupFactory({
                    title: $rootScope.dict.nextLevel,
                    template: message,
                    okType: 'button-assertive'
                }, 'alert');
            };

            $scope.goToUser = function (id) {
                browseService.go('base.profile.overview', {userId: id});
            };
            $scope.$on('$ionicView.beforeEnter', function () {
                $scope.users = {
                    entries: [],
                    pager: {
                        orderBy: 'points',
                        orderDesc: true,
                        limit: 20
                    }
                };
                $scope.me = {};
                getMe();
                getUsers();
            });
            $scope.$on('$ionicView.leave', function () {
                $scope.entered = false;
            });
            $scope.$on('$ionicView.enter', function () {
                $scope.entered = true;
            });
        }
    ]);
});
