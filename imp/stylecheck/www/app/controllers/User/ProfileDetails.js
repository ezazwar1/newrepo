/*global define*/
define([
    'app',
    'services/browse',
    'services/user',
    'services/image',
    'services/style'
], function (app) {

    'use strict';

    app.controller('ProfileDetailsCtrl', [
        '$scope',
        '$ionicSlideBoxDelegate',
        '$timeout',
        'browseService',
        'userService',
        'imageService',
        'styleService',
        function ($scope, $ionicSlideBoxDelegate, $timeout, browseService, userService, imageService, styleService) {
            var stateParams;

            $scope.slide = {
                active: 1
            };

            function getFollowers(id, pager, reset) {
                if (!$scope.followers.pager.page || $scope.followers.pager.page < $scope.followers.pager.pages) {
                    $scope.followers.pager.page = $scope.followers.pager.page + 1;
                }
                if (pager && reset) {
                    pager.page = 1;
                }
                pager = pager || angular.copy($scope.followers.pager);
                userService.follower(id, pager).then(function (followers) {
                    angular.forEach(followers.entries, function (follower) {
                        if (!$scope.followersLoaded) {
                            $scope.followersCount = followers.pager.count;
                        }
                        if (follower && follower.avatar && follower.avatar.variants) {
                            follower.avatarPath = imageService.getPath(follower.avatar, 600);
                        }
                        follower.isMe = ($scope.user._id === follower._id) ? true : false;
                    });

                    if (!$scope.followers.entries || reset) {
                        $scope.followers = followers;
                    } else {
                        $scope.followers.entries = $scope.followers.entries.concat(followers.entries);
                        $scope.followers.pager = followers.pager;
                    }

                    $scope.followersLoaded = true;
                    $scope.followersCount = $scope.followers.pager.count;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }, function () {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
            }

            function updateFollowButton() {
                var idx = userService.user.favUsers.indexOf($scope.currentUser._id);

                if (idx > -1) {
                    $scope.followButtonStyle = 'button-assertive icon-follow';
                } else {
                    $scope.followButtonStyle = 'button-stable icon-follow-me';
                }

                getFollowers($scope.currentUser._id, $scope.followers.pager, true);
            }

            function updateFollowButtonList(favoriteUser) {
                var idx = userService.user.favUsers.indexOf(favoriteUser._id);
                if (idx === -1) {
                    return false;
                } else {
                    return true;
                }
            }

            function getfavoriteUsers(id, pager, reset) {
                if (!$scope.favoriteUsers.pager.page || $scope.favoriteUsers.pager.page < $scope.favoriteUsers.pager.pages) {
                    $scope.favoriteUsers.pager.page = $scope.favoriteUsers.pager.page + 1;
                }
                if (pager && reset) {
                    pager.page = 1;
                }
                pager = pager || angular.copy($scope.favoriteUsers.pager);
                userService.getFavorites(id, pager).then(function (users) {
                    if (!$scope.favoriteUsersLoaded) {
                        $scope.favoritesCount = users.pager.count;
                    }
                    angular.forEach(users.entries, function (user) {
                        user.avatarPath = imageService.getPath(user.avatar, 600);
                        user.isMe = ($scope.user._id === user._id) ? true : false;
                        if (id === $scope.user._id) {
                            user.isFav = true;
                        } else {
                            user.isFav = updateFollowButtonList(user);
                        }
                    });

                    if (!$scope.favoriteUsers.entries || reset) {
                        $scope.favoriteUsers = users;
                    } else {
                        $scope.favoriteUsers.entries = $scope.favoriteUsers.entries.concat(users.entries);
                        $scope.favoriteUsers.pager = users.pager;
                    }

                    $scope.favoriteUsersLoaded = true;
                    $scope.favoritesCount = users.pager.count;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }, function () {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
            }

            function updateScope(user) {
                $scope.avatar = imageService.getPath(angular.copy($scope.currentUser.avatar), 600);
                getfavoriteUsers(user._id);
                getFollowers(user._id);
                $scope.loadStyles();
            }

            function getUser() {
                if (userService.user._id === stateParams.userId) {
                    $scope.loggedInUser = true;
                    userService.account().then(function (user) {
                        $scope.currentUser = user;
                        updateScope($scope.currentUser);
                    });
                } else {
                    $scope.loggedInUser = false;
                    userService.getOne(stateParams.userId).then(function (user) {
                        $scope.currentUser = user;
                        updateScope($scope.currentUser);
                        updateFollowButton();
                    });
                }
            }

            $scope.loadStyles = function () {
                var params = {};
                // increment pager page
                if (!$scope.myStyles.pager.page || $scope.myStyles.pager.page < $scope.myStyles.pager.pages) {
                    $scope.myStyles.pager.page = $scope.myStyles.pager.page + 1;
                }
                if ($scope.currentUser._id) {
                    params = { 'id': $scope.currentUser._id };

                }

                styleService.getOwn(angular.copy($scope.myStyles.pager), params).then(function (result) {
                    // get correct image paths
                    angular.forEach(result.entries, function (style) {
                        if (style && style.image && style.image.variants) {
                            style.imagePath = imageService.getPath(style.image, 600);
                        }
                    });
                    if (!$scope.myStyles.entries) {
                        $scope.myStyles = result;
                        $scope.myStyles.pager.filter.creationDate = Date.now();
                    } else {
                        $scope.myStyles.entries = $scope.myStyles.entries.concat(result.entries);
                        $scope.myStyles.pager = result.pager;
                    }

                    $timeout(function () {
                        $scope.userLoaded = true;
                    }, 100);

                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }, function () {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
            };

            $scope.loadMoreFavorites = function () {
                if (!$scope.favoriteUsers.pager.page || $scope.favoriteUsers.pager.page < $scope.favoriteUsers.pager.pages) {
                    $scope.favoriteUsers.pager.filter.creationDate = Date.now();
                    getfavoriteUsers($scope.currentUser._id);
                }
            };

            $scope.loadMoreFollowers = function () {
                if (!$scope.followers.pager.page || $scope.followers.pager.page < $scope.followers.pager.pages) {
                    $scope.followers.pager.filter.creationDate = Date.now();
                    getFollowers($scope.currentUser._id);
                }
            };

            $scope.setFavorite = function (user, index, event) {
                event.stopImmediatePropagation();
                userService.toggleFavorite(user._id, user.username).then(function (user) {
                    getfavoriteUsers($scope.currentUser._id, $scope.favoriteUsers.pager, true);
                    getFollowers($scope.currentUser._id, $scope.followers.pager, true);
                });
            };

            $scope.toggleFavorites = function () {
                userService.toggleFavorite($scope.currentUser._id, $scope.currentUser.username).then(function (me) {
                    if (me.favUsers.indexOf($scope.currentUser._id) > -1) {
                        $scope.followersCount = $scope.followersCount + 1;
                    } else {
                        $scope.followersCount = $scope.followersCount - 1;
                    }
                    updateFollowButton();
                });
            };

            $scope.$on('styleDeleted', function () {
                $scope.myStyles.pager.count = $scope.myStyles.pager.count - 1;
            });

            $scope.showSlide = function (index) {
                $ionicSlideBoxDelegate.slide(index);
            };

            $scope.setActive = function (index) {
                $scope.slide.active = index + 1;
            };

            $scope.$on('$ionicView.leave', function () {
                $scope.entered = false;
                $scope.favoriteUsersLoaded = false;
            });
            $scope.$on('$ionicView.beforeEnter', function () {
                stateParams = browseService.params();
                $scope.userLoaded = false;
                $scope.loggedInUser = true;
                $scope.followButtonStyle = '';
                $scope.favoritesCount = '';
                $scope.followersCount = '';
                $scope.slide = {
                    active: 1
                };

                $scope.myStyles = {
                    entries: [],
                    pager: {
                        page: 0,
                        limit: 16
                    }
                };

                $scope.favoriteUsers = {
                    entries: [],
                    pager: {
                        page: 0,
                        pages: 0,
                        filter: {
                            creationDate: Date.now()
                        }
                    }
                };
                $scope.favoriteUsersLoaded = false;

                $scope.followers = {
                    entries: [],
                    pager: {
                        filter: {
                            creationDate: Date.now()
                        }
                    }
                };
            });
            $scope.$on('$ionicView.enter', function () {
                getUser();
                $scope.entered = true;
            });
        }
    ]);
});
