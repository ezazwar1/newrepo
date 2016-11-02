/*global angular*/
'use strict';
angular.module('stohke.controllers')

.controller('ExploreController', [
    '$scope',
    '$state',
    '$stateParams',
    'authService',
    'userService',
    'analyticsService',
    'lodash',
    '$timeout',
    '$ionicScrollDelegate',
    '$ionicNavBarDelegate',
    '$ionicHistory',
    function (
        $scope,
        $state,
        $stateParams,
        authService,
        userService,
        analyticsService,
        _,
        $timeout,
        $ionicScrollDelegate,
        $ionicNavBarDelegate,
        $ionicHistory
    ) {
        console.log('Explore Controller');

        $scope.data = [];
        $scope.maximumItems = 30;
        $scope.canLoadMore = true;
        if ($state.params) {
            if ($state.params.category) {
                $scope.category = $state.params.category;
            } else if ($state.params.query) {
                $scope.query = $state.params.query;
            }

            $timeout(function(){
                $ionicNavBarDelegate.title($scope.category || ($scope.query ? ('<i class="ion-ios-search-strong"></i> "' + $scope.query + '"') : undefined) ||'Featured');
            }, 400);
        }

        var loadingData = false,
            fetchFeatured = true;

        var getUsers = function (searchTerm, take, skip, sport, locations, type, isFeatured, clearOffset) {
            if (loadingData) {
                return;
            }
            loadingData = true;
            userService.getUsers(searchTerm, take, skip, sport, locations, type, isFeatured, clearOffset)
            .then(function (results) {
                // console.log('length of results vs take',results.length, take);

                if (fetchFeatured && (!results.length || results.length < take)) {
                    fetchFeatured = false;
                }
                if ((!results.length || results.length < take) && !isFeatured) {
                    // console.log('no more to load');
                    $scope.canLoadMore = false;
                }
                // console.log(results);

                _.each(results, function (item) {
                    $scope.data.push(item);
                });
                $timeout(function(){
                    loadingData = false;
                    $scope.$broadcast('lazyScrollEvent');
                    $ionicScrollDelegate.resize();
                }, 0);
                $timeout(function(){
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }, 800);
            },
            function () {
                $timeout(function(){
                    loadingData = false;
                    $scope.canLoadMore = false;
                    $scope.query = undefined;
                }, 10000);
            });
        };

        $scope.loadMore = function () {
            if (!$scope.canLoadMore) {
                return false;
            }
            if (!loadingData) {
                // TODO: implement a maximum here
                getUsers($scope.query, 16, $scope.data.length, $scope.category, null, null, fetchFeatured);
            }
        };
        $scope.viewProfile = function (itemType, itemAlias) {
            var type = itemType === 0 ? 'user': 'company';
            $state.go('app.explore.' + type, {alias: itemAlias});
        };

        // First pull of data is featured profiles
        getUsers($scope.query, 20, 0, $scope.category, null, null, true, fetchFeatured);
        // This will watch for route change and also get initial user bunch;

        $scope.$on('$stateChangeSuccess',
            function(event, toState, toParams, fromState, fromParams) {

                // Analytics.trackView(toState.)

                // console.log('$stateChangeSuccess',toState, toParams, fromState, fromParams);
                $timeout(function(){
                    
                    console.log('going from '+ fromState.name + '(' + (fromParams.category || fromParams.query) + ')' +' to -> ' + toState.name + '(' + (toParams.category || toParams.query) + ')');

                    if (toState.name === 'app.explore.list' || toState.name === 'app.explore.list.category' || toState.name === 'app.explore.list.search') {
                        if (fromState.name === 'app.explore.list' || fromState.name === 'app.explore.list.category' || fromState.name === 'app.explore.list.search' || fromState.name === 'app.about' || fromState.name === 'app.static')
                        {
                            // $state.go($state.$current, $state.$current.params, {refresh: true});

                            if (toParams.category && toParams.category.length > 2) {
                                console.log(' state change success [explore]', $scope.data);
                                $scope.category = toParams.category || fromParams.category || undefined;
                                $scope.query = undefined;
                                // empty data 
                                $scope.data = [];
                                fetchFeatured = true;
                                $scope.canLoadMore = true;
                                $timeout(function(){
                                    console.info('set title', $scope.category || 'Featured');
                                    $ionicNavBarDelegate.title($scope.category || 'Featured');
                                }, 300);
                                
                                $timeout(function(){
                                    getUsers($scope.query, 20, 0, $scope.category, null, null, fetchFeatured, true);
                                    analyticsService.trackView('Category:' + $scope.title);
                                    $ionicScrollDelegate.$getByHandle('exploreList').scrollTop();
                                }, 0);
                                // console.log('after state change success [explore]', $scope.data);
                            } else if (toParams.query && toParams.query.length > 1) {
                                console.log('state change success [search]', $scope.data);
                                $scope.query = toParams.query;
                                $scope.category = undefined;
                                $scope.data = [];
                                fetchFeatured = true;
                                $scope.canLoadMore = true;
                                $timeout(function(){
                                    console.info('set title', '<i class="ion-ios-search-strong"></i> "' + $scope.query + '"');
                                    $ionicNavBarDelegate.title('<i class="ion-ios-search-strong"></i> "' + $scope.query + '"');
                                }, 300);
                                $timeout(function(){
                                    getUsers($scope.query, 20, 0, null, null, null, fetchFeatured, true);
                                    $ionicScrollDelegate.$getByHandle('exploreList').scrollTop();
                                    analyticsService.trackView('Search: ' + $scope.query);
                                    // console.log('after state change success [search]', $scope.data);
                                }, 0);
                            } else {
                                console.log('state change success [default]', $scope.data);

                                $timeout(function(){
                                    console.info('set title', 'Featured');
                                    $ionicNavBarDelegate.title('Featured');
                                    analyticsService.trackView('Category: Featured');
                                    getUsers($scope.query, 20, 0, $scope.category, null, null, fetchFeatured, true);
                                    $scope.canLoadMore = true;
                                    $ionicScrollDelegate.$getByHandle('exploreList').scrollTop();
                                }, 0);
                                // console.log('after state change success [default]', $scope.data);
                            }
                        } else if (fromState.name === 'app.explore.company' || fromState.name === 'app.explore.user') {

                            // For handling title changing after deep linking to users/companies
                            if ($scope.category && !$scope.query) {
                                $timeout(function(){
                                    console.info('set title', $scope.category || 'Featured');
                                    $ionicNavBarDelegate.title($scope.category || 'Featured');
                                }, 300);
                            }else if ($scope.query && !$scope.category) {
                                $ionicNavBarDelegate.title('<i class="ion-ios-search-strong"></i> "' + $scope.query + '"');
                            } 
                        } else {
                            console.log('state change success [undefined] ??', $scope.data);
                            $timeout(function(){
                                console.info('set title', $scope.category || ($scope.query ? ('<i class="ion-ios-search-strong"></i> "' + $scope.query + '"') : undefined) ||'Featured');
                                $ionicNavBarDelegate.title($scope.category || ($scope.query ? ('<i class="ion-ios-search-strong"></i> "' + $scope.query + '"') : undefined) ||'Featured');
                            }, 300);
                        }
                    }

                }, 0);
            }
        );
        $scope.$on('$destroy', function () {
            $scope.query = undefined;
        });
    }

])
.controller('ExploreProfileController', [
'$scope',
'$stateParams',
'$location',
'user',
'Utils',
'analyticsService',
'userService',
'flagService',
'$ionicModal',
'$ionicSlideBoxDelegate',
'$ionicNavBarDelegate',
'$ionicActionSheet',
'$ionicPopup',
'$sce',
'lodash',
'sharingService',
'STOHKE_CONFIG',
'$timeout',
function (
    $scope,
    $stateParams,
    $location,
    user,
    Utils,
    analyticsService,
    userService,
    flagService,
    $ionicModal,
    $ionicSlideBoxDelegate,
    $ionicNavBarDelegate,
    $ionicActionSheet,
    $ionicPopup,
    $sce,
    _,
    sharingService,
    _STOHKE,
    $timeout
) {

    console.log('Explore Profile Controller');
    // $ionicNavBarDelegate.title((user.FirstName + ' ' + user.LastName) || user.Title);
    $scope.user = user;
    $scope.expandSummary = false;
    $scope.hotspotsVisible = true;
    $scope.disableFlagging = false;

    $scope.userMedia = {
        images : [],
        videos :[],
        featured: null
    };
    $scope.canLoadMore = {
        images: true,
        videos: true
    };
    var openWindow;

    $scope.showImage = function(index) {
        analyticsService.trackView('Image view: ' + ((user.FirstName + ' ' + user.LastName) || user.Title) + ' | ' + $scope.userMedia.images[index].Id);
        $scope.activeSlide = index;
        $scope.showModal('templates/image-modal.html', function (modal) {
            $scope.mediaModal = modal;
        });
    };
    $scope.showVideo = function(index) {
        $scope.activeSlide = index;
        analyticsService.trackView('Video view: ' + ((user.FirstName + ' ' + user.LastName) || user.Title) + ' | ' + $scope.userMedia.videos[index].Id);
        $scope.mediaModal = $scope.showModal('templates/video-modal.html', function (modal) {
            // console.log(modal);
            $scope.mediaModal = modal;
        });
    };
    // This can probably be made into a service
    $scope.showModal = function(templateUrl, cb) {
        $ionicModal.fromTemplateUrl(templateUrl, {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            modal.show();
            (cb || angular.noop)(modal);
        });
    };

    if ($stateParams.mediaId && $stateParams.mediaType) {
        // console.log('trying to get user details with media', user);
        // userId, take, skip, type, mediaId
        var type = ($stateParams.mediaType  === 'photo' ? 0 : 1);
        userService.getUserMedia(user.UserId, 1, 0, $stateParams.mediaType, $stateParams.mediaId).then(function(result) {
            console.log(result);
            // analyticsService.trackView('User Profile:' + results.data.FirstName + ' ' + results.data.LastName);
            $scope.userMedia.images.push(result.data[0]);
        }).then(function () {
            $timeout(function(){
                $scope.showImage(0);
            }, 200);
        });
    }

    userService.getUserMedia($stateParams.alias, 1, 0, 0)
    .then (
          function (results) {
            console.log(results.data);
            $scope.userMedia.featured = results.data;
        }
    )
    .then(function () {
        $scope.getImages();
    })
    .then(function () {
        $scope.getVideos();
    })
    .then(function () {
        if ($scope.user.Type === 'company'){
            userService.getCompanyTeam($scope.user.Alias).then(function (results) {
                // console.log(results);
                $scope.companyTeam = results.data;
            })
            .then(function () {
                $scope.$broadcast('lazyScrollEvent');
            });
        } else if ($scope.user.Type === 'user'){
            userService.getPageLikes($scope.user.Alias, 10, 0, 0).then(function (results) {
                // console.log(results);
                $scope.following = results.data;
            })
            .then(function () {
                $scope.$broadcast('lazyScrollEvent');
            });
            userService.getPageLikes($scope.user.Alias, 10, 0, 1).then(function (results) {
                console.log(results);
                _.each(function (item) {
                    $scope.following.push(item);
                });
            })
            .then(function () {
                $scope.$broadcast('lazyScrollEvent');
            });
        }
    });
    var actionButtons = [
        {
            text: 'Innapproriate'
        },
        {
            text: 'Spam'
        },
        {
            text: 'Suspicious'
        },
        {
            text: 'Other'
        }
    ];
    $scope.flag =  function (media) {
        $scope.reasonForFlag = null;
        var actions = $ionicActionSheet.show({
            buttons: actionButtons,
            titleText: 'Flag this as',
            cancelText: 'Cancel',
            cancel: function() {
                actions();
            },
            buttonClicked: function(index) {
                console.log('flag media: ', actionButtons[index].text, media.Id, media.UserId);

                if (actionButtons[index].text === 'Other') {
                    $ionicPopup.show({
                        template: '<input type="text" ng-model="$parent.reasonForFlag"/>',
                        title: 'Reason for flagging',

                        scope: $scope,
                        buttons: [
                            { text: 'Cancel' },
                            {
                                text: '<b>Flag</b>',
                                type: 'button-positive',
                                onTap: function(e) {
                                    console.log($scope.reasonForFlag);
                                    if (!$scope.reasonForFlag) {
                                        e.preventDefault();
                                    } else {
                                        flagItem($scope.reasonForFlag);
                                        return true;
                                    }
                                }
                            }
                        ]
                    });
                } else {
                    flagItem(actionButtons[index].text);
                }

                function flagItem (reason) {
                    // mediaId, mediaOwnerId, reason
                    flagService.flag(media.Id, media.UserId, reason)
                    .then(function (huh) {
                        console.log(huh);
                    });
                }
                // return true to close actions
                return true;
            }
        });
    };
    $scope.share = function (file) {
        console.log('share', file);
        // Share a media object or, 
        var shareFile = !_.isEmpty(file) ? (file.ImageUrl768X432 || file.ThumbnailLargeUrl) : ($scope.user.AvatarUrl200x200 || $scope.user.LogoLarge);
        var shareUrl = !_.isEmpty(file) ? Utils.getStohkeUrl('media', $scope.user, file) : Utils.getStohkeUrl('profile', $scope.user);
        var shareMessage = 'Check out ' + ($scope.user.Title || ($scope.user.FirstName + ' ' + ($scope.user.LastName || '')) ) + (!_.isEmpty(file) ? ('\'s ' + (file.Type === 1 ? 'photo' : '' || file.Type === 2 ? 'video' : '')) : '\'s profile') + ' on Stohke.';
        console.log(shareFile, shareUrl, shareMessage);
        sharingService.share(
            shareMessage,
            'Stohke',
            shareFile,
            shareUrl
        );
    };
    $scope.getImages =  function() {
        console.log('get more images');
        var takeAmt = _STOHKE.defaultQuantities.images,
            skipAmt = $scope.userMedia.images.length;
        userService.getUserMedia($stateParams.alias, takeAmt, skipAmt, 1)
        .then (
              function (results) {
                console.log(results.data);
                if (results.data.length < takeAmt) {
                    $scope.canLoadMore.images = false;
                }
                _.each(results.data, function (result, index) {
                    if (index < 3 && $scope.userMedia.images === 0){
                        result.HotSpots.visible = true;
                    } else {
                        result.HotSpots.visible = false;
                    }
                    $scope.userMedia.images.push(result);
                });
                if ($scope.mediaModal) {
                    $ionicSlideBoxDelegate.update();
                }
            }
        );
    };
    $scope.getVideos =  function() {
        console.log('load videos');
        var takeAmt = _STOHKE.defaultQuantities.videos,
            skipAmt = $scope.userMedia.videos.length;
        userService.getUserMedia($stateParams.alias, takeAmt, skipAmt, 2)
        .then (
              function (results) {

                if (results.data.length < takeAmt) {
                    $scope.canLoadMore.videos = false;
                }

                _.each(results.data, function (result) {
                    $scope.userMedia.videos.push(result);
                });

                if ($scope.mediaModal) {
                    $ionicSlideBoxDelegate.update();
                }
            }
        );
    };
    // Get initial bunch of media

    $scope.toggleSummaryCollapse = function () {
        $scope.expandSummary = !$scope.expandSummary;
    };

    $scope.toggleHotspots = function(hotspots) {
        console.log('toggleHotspots from explore controller', hotspots);
        $scope.hotspotsVisible = !$scope.hotspotsVisible;
        if (typeof hotspots.visible === 'undefined') {
            hotspots.visible = true;
        } else {
            hotspots.visible = !hotspots.visible;
        }
    };

    $scope.watchVideo = function (url) {
        openWindow = window.open(url+'&autoplay=1', '_blank', 'location=no');

        openWindow.addEventListener('exit', function () {
            if (window.ionic.Platform.isAndroid()  && window.screen) {
                window.screen.lockOrientation('portrait-primary');
            }
        });
    };
    $scope.openUrl = function (url) {
        if (url.indexOf('http') === -1) {
            url = 'http://' + url;
        }
        window.open(url, '_blank', 'location=yes');
    };

    $scope.doStohke = function (media) {
        console.log('Do Stohke on ', media);
        $scope.$broadcast('stohke:media-external', media);
    };
    $scope.doReset = function () {
        console.log('doReset() of hotspots');
        // show hotspots then start countdown
        var toggleHotspotVisibility = function () {
            $scope.userMedia.images[$scope.activeSlide].HotSpots.visible = !$scope.userMedia.images[$scope.activeSlide].HotSpots.visible;
        };

        $scope.userMedia.images[$scope.activeSlide].HotSpots.visible = true;
        var hotspotTimeout = $timeout(function(){
            // console.log('timeout called');
            toggleHotspotVisibility();
        }, 800);

        $scope.$on('hotspot:interacted', function () {
            $timeout.cancel(hotspotTimeout);
        });
    };

    var autoplayHotspotChange = 0;

    $scope.slideChanged = function (index, type) {
        $scope.$broadcast('slideChanged', index);
        // update the activeSlide index
        $scope.activeSlide = index;
        var typeString = (type === 'images' ? 'Image' : 'Video');
        analyticsService.trackView(typeString + ' view: ' + ((user.FirstName + ' ' + user.LastName) || user.Title) + ' | ' + $scope.userMedia[type][index].Id);
        // get more images
        // console.log('slideChanged', index, $scope.userMedia[type].length - 2)
        if (index >= $scope.userMedia[type].length - 2) {
            if ($scope.canLoadMore[type]) {
                switch (type) {
                    case 'images':
                        $scope.getImages();
                    break;
                    case 'videos':
                        $scope.getVideos();
                    break;
                }
            }
        }
        autoplayHotspotChange++;
        if (autoplayHotspotChange <= 3) {
            $scope.doReset();
        } else {
            $scope.userMedia.images[$scope.activeSlide].HotSpots.visible = false;
        }
    };

    $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
    };

}]);