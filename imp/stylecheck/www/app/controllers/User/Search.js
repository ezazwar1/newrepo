/*global define*/
define([
    'app',
    'services/user',
    'services/image',
    'services/browse'
], function (app) {

    'use strict';

    app.controller('SearchCtrl', [
        '$scope',
        '$timeout',
        '$ionicScrollDelegate',
        'userService',
        'imageService',
        'browseService',
        function ($scope, $timeout, $ionicScrollDelegate, userService, imageService, browseService) {
            var timer;

            $scope.users = {
                entries: [],
                pager: {
                    filter: {
                        creationDate: Date.now()
                    }
                }
            };

            $scope.getUsers = function (reset, pager) {
                if (!$scope.users.pager.page || $scope.users.pager.page < $scope.users.pager.pages) {
                    $scope.users.pager.page = $scope.users.pager.page + 1;
                }
                pager = pager || angular.copy($scope.users.pager);
                userService.get(pager).then(function (users) {
                    angular.forEach(users.entries, function (user) {
                        user.avatarPath = imageService.getPath(user.avatar, 600);
                        user.isMe = ($scope.user._id === user._id) ? true : false;
                    });

                    if (!$scope.users.entries || reset) {
                        $scope.users = users;
                    } else {
                        $scope.users.entries = $scope.users.entries.concat(users.entries);
                        $scope.users.pager = users.pager;
                    }

                    $scope.userLoaded = true;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }, function () {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
            };

            // reset search term
            $scope.clear = function () {
                delete $scope.users.pager.filter;
                $scope.getUsers(true);
            };

            $scope.goToUser = function (id) {
                browseService.go('base.profile.overview', {userId: id});
            };

            $scope.searchUsers = function (key) {
                var pagerCopy = angular.copy($scope.users.pager);
                pagerCopy.page = 1;

                $scope.userLoaded = false;

                if (timer) {
                    $timeout.cancel(timer);
                }
                timer = $timeout(function () {
                    if (pagerCopy.filter[key] && pagerCopy.filter[key].length > 2) {
                        $scope.getUsers(true, pagerCopy);
                    } else if (!pagerCopy.filter[key].length) {
                        $scope.clear();
                    }
                }, 600);
            };

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

            $scope.$on('$ionicView.beforeEnter', function () {
                var oldFilter;
                if ($scope.users.pager.filter) {
                    oldFilter = $scope.users.pager.filter;
                }
                $scope.users = {
                    entries: [],
                    pager: {
                        filter: oldFilter
                    }
                };
                $ionicScrollDelegate.resize();
            });

            $scope.$on('$ionicView.leave', function () {
                $scope.userLoaded = false;
                $scope.entered = false;
            });

            $scope.$on('$ionicView.enter', function () {
                $scope.entered = true;
            });
        }
    ]);
});
