/*global define*/
define([
    'app',
    'services/style',
    'services/browse',
    'services/image'
], function (app) {

    'use strict';

    app.controller('FashionFeedCtrl', [
        '$scope',
        '$ionicScrollDelegate',
        'styleService',
        'browseService',
        'imageService',
        function ($scope, $ionicScrollDelegate, styleService, browseService, imageService) {
            $scope.feeds = {
                entries: [],
                pager: {
                    limit: 16,
                    filter: {
                        creationDate: Date.now()
                    }
                }
            };
            $scope.favs = false;

            $scope.getFeeds = function (reset) {
                $scope.loaded = false;

                if (reset) {
                    $scope.feeds.entries = [];
                    $scope.feeds.pager.page = 0;
                }

                $scope.feeds.pager.filter.creationDate = Date.now();

                if (!$scope.feeds.pager.page || $scope.feeds.pager.page < $scope.feeds.pager.pages) {
                    $scope.feeds.pager.page = $scope.feeds.pager.page + 1;
                }

                styleService.feed(angular.copy($scope.feeds.pager), $scope.favs).then(function (feeds) {
                    angular.forEach(feeds.entries, function (feed) {
                        if (feed && feed.image && feed.image.variants) {
                            feed.imagePath = imageService.getPath(feed.image, 600);
                        }
                    });
                    if (!$scope.feeds.entries) {
                        $scope.feeds = feeds;
                    } else {
                        $scope.feeds.entries = $scope.feeds.entries.concat(feeds.entries);
                        $scope.feeds.pager = feeds.pager;
                    }

                    $scope.loaded = true;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    $scope.$broadcast('scroll.refreshComplete');

                    if (reset) {
                        $ionicScrollDelegate.scrollTop();
                    }
                }, function () {
                    $scope.loaded = true;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    $scope.$broadcast('scroll.refreshComplete');
                });
            };

            $scope.showDetail = function (id) {
                browseService.go('base.fashionFeed.detail', {id: id});
            };

            $scope.$on('$ionicView.leave', function () {
                $scope.entered = false;
                $scope.loaded = false;
            });

            $scope.$on('$ionicView.enter', function () {
                $ionicScrollDelegate.resize();
                $scope.entered = true;
            });
        }
    ]);
});
