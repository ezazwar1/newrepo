/*global define*/
define([
    'app',
    'services/style',
    'services/image',
    'services/browse'
], function (app) {

    'use strict';

    app.controller('WishListCtrl', [
        '$scope',
        '$ionicScrollDelegate',
        'styleService',
        'imageService',
        'browseService',
        function ($scope, $ionicScrollDelegate, styleService, imageService, browseService) {
            $scope.favorites = {
                entries: [],
                pager: {
                    limit: 16,
                    filter: {
                        creationDate: Date.now()
                    }
                }
            };

            $scope.getFavs = function (reset) {
                if (reset) {
                    $scope.favorites.entries = [];
                    $scope.favorites.pager.page = 0;
                    $scope.favsLoaded = false;
                }

                $scope.favorites.pager.filter.creationDate = Date.now();

                if (!$scope.favorites.pager.page || $scope.favorites.pager.page < $scope.favorites.pager.pages) {
                    $scope.favorites.pager.page = $scope.favorites.pager.page + 1;
                }

                styleService.getFavorites(angular.copy($scope.favorites.pager)).then(function (favorites) {
                    angular.forEach(favorites.entries, function (favorite) {
                        if (favorite && favorite.image && favorite.image.variants) {
                            favorite.imagePath = imageService.getPath(favorite.image, 600);
                        }
                    });

                    if (!$scope.favorites.entries.length) {
                        $scope.favorites = favorites;
                    } else {
                        $scope.favorites.entries = $scope.favorites.entries.concat(favorites.entries);
                        $scope.favorites.pager = favorites.pager;
                    }

                    if (!$scope.favsLoaded) {
                        $scope.favsLoaded = true;
                    }

                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    $scope.$broadcast('scroll.refreshComplete');
                }, function () {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    $scope.$broadcast('scroll.refreshComplete');
                });
            };

            $scope.showDetail = function (id) {
                browseService.go('base.wishList.detail', {id: id});
            };

            $scope.$on('$ionicView.beforeEnter', function () {
                $scope.favorites = {
                    entries: [],
                    pager: {
                        limit: 16,
                        filter: {
                            creationDate: Date.now()
                        }
                    }
                };
            });

            $scope.$on('$ionicView.leave', function () {
                $scope.favsLoaded = false;
                $scope.entered = false;
            });

            $scope.$on('$ionicView.enter', function () {
                $ionicScrollDelegate.resize();
                $scope.entered = true;
            });
        }
    ]);
});
