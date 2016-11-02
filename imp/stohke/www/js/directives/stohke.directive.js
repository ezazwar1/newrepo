/*global window*/
'use strict';
angular.module('stohke')
    .directive('userProfile', ['userService', '$timeout', function (userService, $timeout) {
        return {
            restirct: 'E',
            replace: true,
            templateUrl: 'templates/directives/profile-widget-small.html',
            // scope: {},
            link: function ($scope, el, iAttrs) {

                // console.log(iAttrs.userType);

                $timeout(function(){
                    userService.getUserDetails(iAttrs.userId, iAttrs.userType)
                        .success(function (data) {

                            $scope.profile = data;
                        }, 
                        function (err) {
                            console.error(err);
                        });
                }, 0);
            }
        }
    }])
    .directive('stohkeButton', ['$q', '$timeout', 'stohkeService', 'authService', '$rootScope', '$ionicPopup',
            function($q, $timeout, stohkeService, authService, $rootScope, $ionicPopup) {
                return {
                    restrict: 'E',
                    replace: true,
                    scope: {
                        mediaId: '=mediaOwner',
                        mediaType: '=mediaType'
                    },
                    templateUrl: 'templates/stohke-button.html',
                    link: function($scope) {
                        // console.log('stohke button!!');
                        $scope.auth = authService._authentication();
                        $scope.$watch('mediaId', function(newVal) {
                            if (!newVal) {
                                return;
                            }

                            if (newVal && newVal.length > 1) {
                                switch ($scope.mediaType) {
                                    case 1:
                                        $scope.mediaTypeString = 'Image';
                                        break;
                                    case 2:
                                        $scope.mediaTypeString = 'Video';
                                        break;
                                    default:
                                        $scope.mediaTypeString = 'Image';
                                }
                                $scope.getStatus();
                            }
                        });
                        $scope.getStatus = function() {
                            // Check status if logged in

                            if ($scope.auth.isAuth) {
                                stohkeService.isStohkedBy($scope.mediaId, $scope.mediaTypeString)
                                    .then(function(status) {
                                        // console.log($scope.mediaId, $scope.mediaTypeString, 'isStohked');
                                        $scope.isStohked = ((status === 'true' || status === true) ? true : false);
                                    });
                            } else {
                                // Set to false if not logged in.
                                $scope.isStohked = false;
                            }
                        };

                        $scope.stohke = function() {
                            // console.log('stohke button clicked');
                            if (!$scope.auth.isAuth) {
                                var confirmPopup = $ionicPopup.confirm({
                                    title: 'Must be logged in to <br/> stohke media.',
                                    // template: 'Would you like to log in?',
                                    buttons: [
                                        {
                                            text: 'Later',
                                            type: 'button-stable',
                                            onTap: function () {
                                                confirmPopup.close();
                                                return false;
                                            }
                                        },
                                        {
                                            text: '<b>Log in</b>',
                                            type: 'button-positive',
                                            onTap: function(e) {
                                                // console.log(e);
                                                authService.socialLogin('Facebook')
                                                .then(function () {
                                                    $q.when(authService.authentication())
                                                    .then(
                                                        function(){
                                                            confirmPopup.close();
                                                            $scope.stohke();
                                                        }
                                                    );
                                                });
                                            }
                                        }
                                    ]
                                });

                            } else {
                                // console.log(($scope.isStohked ? 'do Unstohke' : 'do Stohke') + ' mediaId: ' + $scope.mediaId + ' mediaTypeString: ' + $scope.mediaTypeString);
                                if ($scope.isStohked === 'true' || $scope.isStohked === true) {
                                    $scope.isStohked = false;
                                    stohkeService.unstohke($scope.mediaId, $scope.mediaTypeString).then(
                                        // This handles the count
                                        function (newStohkeCount) {
                                            // console.log('media stohked');
                                            $rootScope.$broadcast('media:stohke-change', $scope.mediaId, newStohkeCount);
                                        },
                                        function (reason) {
                                            console.error(reason);
                                            // Error while unstohking
                                            $scope.isStohked = true;
                                        });
                                } else {
                                    $scope.isStohked = true;
                                    stohkeService.stohke($scope.mediaId, $scope.mediaTypeString)
                                        .then(
                                            function (newStohkeCount) {
                                                // console.log(data);
                                                $rootScope.$broadcast('media:stohke-change', $scope.mediaId, newStohkeCount);
                                            }, function (reason) {
                                                console.error(reason);
                                                $scope.isStohked = false;
                                            }
                                        );
                                }
                            }
                        };
                        $scope.$on('stohke:media-external', function (e, media) {
                            // console.log(media, $scope.mediaId);
                            if (media.Id === $scope.mediaId.substr($scope.mediaId.indexOf('_') + 1)) {
                                $scope.stohke();
                            }
                        });
                    }
                };
            }])
            // display a media item's stohke count
            .directive('stohkeCount', ['$timeout', '$location', 'stohkeService', '$rootScope', 'Utils',
                function($timeout, $location, stohkeService, $rootScope, Utils) {
                    return {
                        restrict: 'E',
                        replace: true,
                        scope: {
                            mediaId: '=mediaOwner',
                            mediaType: '=mediaType'
                        },
                        templateUrl: 'templates/stohke-count.html',
                        link: function($scope, elm, attrs) {

                            $scope.counterOnly = attrs.counterOnly ? true : false;
                            // Don't use scope straight, directive will probably initialize before scope has the value we need.
                            function getCount () {
                                stohkeService.stohkedCount($scope.mediaId, $scope.mediaTypeString)
                                .then(function (count){
                                    $scope.stohkeCount = Utils.prettyCount(count);
                                });
                            }

                            $scope.$watch('mediaId', function(newVal) {
                                if (!newVal) {
                                    return;
                                }
                                if (newVal && newVal.length > 1) {
                                    // console.log('mediaId changed get new sthoke count');
                                    switch ($scope.mediaType) {
                                        case 1:
                                            $scope.mediaTypeString = 'Image';
                                            break;
                                        case 2:
                                            $scope.mediaTypeString = 'Video';
                                            break;
                                        default:
                                            $scope.mediaTypeString = 'Image';
                                    }
                                    getCount();
                                }
                            });
                            $scope.$on('media:stohke-change', function (event, data, newCount) {

                                if (data === $scope.mediaId) {
                                    if (typeof newCount === 'number' && !isNaN(newCount)) {
                                        var direction = (newCount < $scope.stohkeCount) ? 'down' : 'up';
                                        $scope.stohkeCount = newCount;
                                    } else {
                                        getCount();
                                    }
                                }
                            });

                        }
                    };
                }
            ])

            .directive('featuredAthletes', ['$q', 'userService', 'homeService', function ($q, userService, homeService) {
                // Runs during compile
                return {
                    restrict: 'E',
                    replace: true,
                    templateUrl: 'templates/directives/featured-athletes.html',
                    link: function ($scope, iElm, iAttrs) {
                        $scope.featured = {
                            athletes: []
                        };

                        homeService.getFeaturedUsers()
                        .then(function (data) {
                            $scope.featured.athletes = data;
                        });
                    }
                };
            }])
            .directive('featuredCollections', ['$q', 'userService', 'homeService', function ($q, userService, homeService) {
                // Runs during compile
                return {
                    restrict: 'E',
                    replace: true,
                    templateUrl: 'templates/directives/featured-collections.html',
                    link: function ($scope, iElm, iAttrs) {
                        $scope.featured = {
                            collections: []
                        };

                        homeService.getFeaturedCollections()
                        .then(function (data) {
                            $scope.featured.collections = data;
                        });
                    }
                };
            }])
            
            .directive('featuredImages', ['$q', 'userService', 'homeService', '$ionicModal', 'sharingService', 'Utils', 'lodash',  function ($q, userService, homeService, $ionicModal, sharingService, Utils, _) {

                return {
                    restrict: 'E',
                    replace: true,
                    // scope: {},
                    templateUrl: 'templates/directives/featured-images.html',
                    link: function ($scope, iElm, iAttrs) {

                        $scope.userMedia = {};

                        userService.getFeaturedMediaInterim()
                            .success(function (data) {

                                data.images.forEach(function (image) {

                                    userService.getUserMedia(image.Alias, 1, 0, 1, image.mediaId)
                                    .success( function (imageData) {

                                        imageData[0].userDetails = image;

                                        if (!$scope.userMedia.images) {
                                                $scope.userMedia.images = [];
                                            }
                                        $scope.userMedia.images.push(imageData[0]);
                                    })
                                });
                            });
                    }
                }

            }])
            .directive('featuredVideos', ['$q', 'userService', 'homeService', '$ionicModal', 'sharingService', 'Utils', 'lodash',  function ($q, userService, homeService, $ionicModal, sharingService, Utils, _) {
                // Runs during compile
                return {
                    restrict: 'E',
                    replace: true,
                    templateUrl: 'templates/directives/featured-videos.html',
                    link: function ($scope, iElm, iAttrs) {
                        var openWindow;

                        $scope.userMedia = {};

                        if (iAttrs.featuredType && iAttrs.featuredType === "stohkepicks") {

                            userService.getFeaturedMediaInterim()
                                .success(function (data) {

                                    data.videos.forEach(function (video){
                                        userService.getUserMedia(video.Alias, 1, 0, 2, video.mediaId)
                                        .success( function (videoData) {
                                            if (!$scope.userMedia.videos) {
                                                $scope.userMedia.videos = [];
                                            }
                                            videoData[0].userDetails = video;
                                            $scope.userMedia.videos.push(videoData[0]);
                                        });
                                    });
                                });
                        } else if (iAttrs.featuredType && iAttrs.featuredType === "stohkeaboutvids") {
                            userService.getFeaturedMediaInterim()
                                .success(function (data) {
                                    console.log(data);
                                    if (!$scope.userMedia.videos) {
                                            $scope.userMedia.videos = [];
                                        }

                                    data.aboutVideos.forEach(function (video){
                                        userService.getUserMedia(video.Alias, 1, 0, 2, video.mediaId)
                                        .success( function (videoData) {

                                            videoData[0].userDetails = video;
                                            $scope.userMedia.videos.push(videoData[0]);
                                        });
                                    });
                                });
                        }else {
                            homeService.getFeaturedVideos()
                                .then(function (data) {
                                    $scope.userMedia.videos = data;
                                });
                        }
                        $scope.activeSlide = 0;

                        $scope.showVideo = function(index) {
                            $scope.activeSlide = index;
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

                        $scope.watchVideo = function (url) {
                            // console.log(url);
                            if (window.ionic.Platform.isAndroid() && window.screen) {
                                window.screen.unlockOrientation();
                            }
                            openWindow = window.open(url+'&autoplay=1', '_blank', 'location=no');

                            openWindow.addEventListener('exit', function () {
                                if (window.ionic.Platform.isAndroid()  && window.screen) {
                                    window.screen.lockOrientation('portrait-primary');
                                }
                            });
                        };

                        $scope.share = function (file) {
                            console.log('share', file);
                            // Share a media object or, 
                            var shareFile = !_.isEmpty(file) ? (file.ImageUrl768X432 || file.ThumbnailLargeUrl) : null;
                            var shareUrl = !_.isEmpty(file) ? Utils.getStohkeUrl('media', file.userDetails, file) : Utils.getStohkeUrl('profile', file.userDetails);
                            var shareMessage = 'Check out this ' + (!_.isEmpty(file) ? ( (file.Type === 1 ? 'photo' : '' || file.Type === 2 ? 'video' : '')) : 'profile') + ' on Stohke.';
                            console.log(shareFile, shareUrl, shareMessage);
                            sharingService.share(
                                shareMessage,
                                'Stohke',
                                shareFile,
                                shareUrl
                            );
                        };
                        $scope.slideChanged = function (index, type) {
                            $scope.$broadcast('slideChanged', index);
                            // update the activeSlide index
                            $scope.activeSlide = index;
                        };
                    }
                };
            }])
            // All Sports list directive
            .directive('sportsList', ['STOHKE_CONFIG', function (_stohke) {
                // Runs during compile
                return {
                    restrict: 'E',
                    replace: true,
                    templateUrl: 'templates/directives/sports-list.html',
                    link: function ($scope, iElm, iAttrs) {

                        $scope.sports = [_stohke.sports, _stohke.menuPostSports];

                    }
                };
            }])
            // display a user's combined Stohkes
            .directive('stohkeTotal', ['$timeout', '$location', 'stohkeService', 'lodash', 'Utils',
                function($timeout, $location, stohkeService, _, Utils) {
                    return {
                        restrict: 'E',
                        replace: true,
                        scope: {
                            userData: '=userId',
                            userType: '=userType'
                        },
                        templateUrl: 'templates/stohke-count.html',
                        link: function($scope) {
                            // Don't use scope straight, directive will probably initialize before scope has the value we need.
                            var getStohkesTotal = function(userId) {
                                // console.info('actually getting stohke Totals');
                                stohkeService.totalStohkesCount(userId, $scope.userType)
                                    .then(function(data) {

                                        $scope.stohkeCount = Utils.prettyCount(data, 'x,x');
                                    });
                            };
                            $scope.$watch('userData', function(newVal) {

                                // We wait until our scope has the userId
                                if (newVal) {
                                    getStohkesTotal(newVal);
                                } else {
                                    return;
                                }
                            });
                            $scope.$on('media:stohke-change', 
                                _.debounce(function () {
                                    // console.info('get totals, bebouncedified!!!');
                                    getStohkesTotal($scope.userData);
                                }, 1500)
                            );
                        }
                    };
                }
            ])
            // hotspot directive
            .directive('hotspot', ['$timeout', 'lodash', '$rootScope', 'Utils',
                function($timeout, _, $rootScope, Utils) {
                    return {
                        restrict: 'E',
                        replace: false,
                        scope: {
                            hotspot: '=data',
                        },
                        templateUrl: 'templates/directives/hotspot.html',
                        link: function($scope, el) {
                            // console.log('render hotspot');
                            var tooltip;
                            // Calculate random timeout to stagger the initial hotspot hide
                            function getRandomDelay (maximum, minimum) {
                                return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
                            }
                            var delay = getRandomDelay(800, 500);
                            
                            $scope.hotspot.isVisible = true;

                            $timeout(function(){
                                tooltip = el.find('span');
                                $scope.hotspot.isVisible = false;
                                setPosition();
                            }, 0);
                            function setPosition () {
                                console.log('setPosition for hotspot', $scope.hotspot, tooltip);
                                tooltip[0].classList.add('display-virtually');
                                // Check if hidden...
                                // temporarily set visibility hidden before calcuting position
                                // $timeout(function(){
                                    if ($scope.hotspot.Coordinates.Left < 5) {
                                        $scope.hotspot.Coordinates.Left = 5;
                                    } else if ($scope.hotspot.Coordinates.Left > 95) {
                                        $scope.hotspot.Coordinates.Left = 95;
                                    }
                                    if ($scope.hotspot.Coordinates.Top < 5) {
                                        $scope.hotspot.Coordinates.Top = 5;
                                    } else if ($scope.hotspot.Coordinates.Top > 95) {
                                        $scope.hotspot.Coordinates.Top = 95;
                                    }
                                    // tooltip[0].style.visibility = 'visible';
                                    // console.log(tooltip[0].getBoundingClientRect().width, $scope.hotspot.Description.length, ($scope.hotspot.Description.length * 8.5 + 'px'));
                                    if ($scope.hotspot.Coordinates.Left >= 70) {
                                        tooltip[0].style.left = '-' + (tooltip[0].getBoundingClientRect().width - 20) + 'px';
                                        el.addClass('right');
                                    }
                                    $timeout(function(){
                                        tooltip[0].style.visibility = 'visible';
                                        tooltip[0].classList.remove('display-virtually');
                                    }, 100);
                                // }, 0);
                            }
                            $scope.toggleHotspots = function () {
                                console.log('toggle function');
                                if (!$scope.hotspot.isVisible) {
                                    setPosition();
                                    $rootScope.$broadcast('hotspot:interacted');
                                    $rootScope.$broadcast('hideHotspots', $scope.hotspot);
                                    $timeout(function(){
                                        el.addClass('active');
                                        $scope.hotspot.isVisible = true;
                                    }, getRandomDelay(200,100));
                                } else {

                                    el.toggleClass('active');
                                    // console.log('hide self', $scope.hotspot.isVisible);
                                    $scope.hotspot.isVisible = !$scope.hotspot.isVisible;
                                }
                            };

                            $scope.$on('hideHotspots', function (e, data) {
                                // console.log('hideHotspots triggered', data);
                                if (data && data.$$hashKey !== $scope.hotspot.$$hashKey) {
                                    $scope.hotspot.isVisible = false;
                                    el.removeClass('active');
                                } else if (!data) {
                                    el.removeClass('active');
                                    $scope.hotspot.isVisible = false;
                                }
                            });
                            $scope.visitLink = function (link) {
                                Utils.openExternalUrl(link, {location: 'yes'});
                            };
                        }
                    };
                }
            ])
.directive('simpleSlider', ['$window', '$compile', '$timeout', '$ionicGesture', '$ionicSideMenuDelegate', '$ionicScrollDelegate', function ($window, $compile, $timeout, $ionicGesture, $ionicSideMenuDelegate, $ionicScrollDelegate) {

    return {
        scope: {
            data: '='
        },
        link: function(scope, elm, iAttrs, controller) {
            
            scope.currentPage = 1;
            scope.pageCount = 1;
            scope.currentPosition = 0;

            // setup
            if (elm && elm.wrapInner) {
                elm.wrapInner('<div class="simple-slider-inner" style="webkit-transform: translate3d(0,0,0);"></div>');
            } else {
                // console.error('jquery wrapInner not available. Manually the slider for now.');
            }
            elm.append($compile('<div class="slider-controls" ng-show="pageCount > 1"><span ng-click="pageDown()" ng-disabled="currentPage == 1" class="button button-small button-icon icon ion-ios-arrow-left left"></span> <span ng-click="pageUp()" ng-disabled="currentPage == pageCount" class="button button-small button-icon icon ion-ios-arrow-right right"></span></div>')(scope));
            elm.addClass('simple-slider');

            var sliderContent = elm[0].getElementsByClassName('simple-slider-inner')[0];
            
            // scope.wrapperStyles = {
            //     'left': '0%'
            // };
            // Mappped control functions
            scope.pageDown = function () {
                if (scope.currentPage > 1) {
                    // scope.currentPosition += 100;
                    // sliderContent.setAttribute('style', 'left: '+ scope.currentPosition +'%');

                    scope.currentPage--;
                    // getCurrentPosition (which has now been adjusted by a drag);

                    // multiply currentPage * containerWidth
                    var x = (scope.currentPage - 1) * getContainerWidth();
                    sliderContent.style.webkitTransform = 'translate3d(' + (x * -1) +'px,0,0)';
                    // subtract that value from the current position

                } else {
                    sliderContent.style.webkitTransform = 'translate3d(' + dragStartPosition +'px,0,0)';
                }
            };
            scope.pageUp = function () {
                if (scope.currentPage < getPageCount() ) {

                    // sliderContent.style.webkitTransform = 'translate3d(' + scope.currentPosition +'px,0,0)';
                    scope.currentPage++;

                    // scope.wrapperStyles.left = scope.currentPage * -100 + '%';
                    var x = (scope.currentPage - 1) * getContainerWidth();

                    sliderContent.style.webkitTransform = 'translate3d(' + (x *-1) +'px,0,0)';

                } else {
                    sliderContent.style.webkitTransform = 'translate3d(' + dragStartPosition +'px,0,0)';
                }
            };
            scope.readjust = function () {
                // should reposition on window size

                // if current page is no longer available...

                if (scope.currentPage > getPageCount()) {

                    // set last page equals to new pageCount
                    scope.currentPage = angular.copy(scope.pageCount);
                    // moving backwards so adjust by + 100;
                    scope.currentPosition = scope.currentPosition +100;
                    // sliderContent.style.webkitTransform = 'translate3d(' + scope.currentPosition +'px,0,0)';
                }
            };
            var autoplay;
            function getRandomDelay (maximum, minimum) {
                return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
            }
            function startAutoPlay () {
                autoplay = setInterval( function () {
                    scope.pageUp();
                }, getRandomDelay(3000, 4000));
            }
            function stopAutoPlay() {
                clearInterval(autoplay);
            }
            // Page size is equal to container's width 
            function getContainerWidth() {
                // parent container width
                return parseInt(elm[0].getBoundingClientRect().width);
            }

            // Get wrapper width.
            function getWidth() {
                // parent container width
                return angular.element(sliderContent)[0].getBoundingClientRect().width;
            }

            function getPageCount () {
                var nodeCount = sliderContent.children.length;
                if (!nodeCount || !sliderContent.children[0] || !sliderContent.children[0].getBoundingClientRect) {
                    return false;
                }
                var nodeWidth = sliderContent.children[0].getBoundingClientRect().width;
                var pageCount = Math.ceil(nodeCount / (getContainerWidth() / nodeWidth));
                // console.log('children:', nodeCount, 'nodeWidth: ', nodeWidth, 'getContainerWidth:', getContainerWidth(), 'pageCount:', pageCount);
                scope.pageCount = pageCount;
                return pageCount;
            }

            $timeout(function(){
                getPageCount();
            }, 1000);

            startAutoPlay();

            function getCurrentPosition() {
                var transRegex = /translate3d\(([^,]+)[^)]*\)/g;
                // var transRegex = /left:.(\d)/i;
                var val = transRegex.exec(sliderContent.getAttribute('style'))[1];

                return parseFloat(val) || 0;
            }

            // Get page count (can change on page resize)
            angular.element($window).bind('resize', function () {
                $timeout(function(){
                    var nodeCount = sliderContent.children.length;

                    if (!nodeCount || !sliderContent.children[0].getBoundingClientRect) {
                        return false;
                    }
                    var nodeWidth = sliderContent.children[0].getBoundingClientRect().width;
                     var pageCount = Math.ceil(nodeCount / (getContainerWidth() / nodeWidth));
                     scope.pageCount = pageCount;
                     if (scope.currentPage > scope.pageCount) {
                        scope.readjust();
                     }
                }, 0);
            });

            var dragDirection,
                dragStartPosition;

            $ionicGesture.on('dragstart', function (e) {
                dragStartPosition = getCurrentPosition();
                stopAutoPlay();
            }, elm);
            $ionicGesture.on('drag', function (e) {
                // console.log(e.gesture.deltaX);

                sliderContent.classList.add('dragging');
                $ionicSideMenuDelegate.canDragContent(false);

                if (e.gesture.eventType === 'move' && (e.gesture.direction === 'left' || e.gesture.direction === 'right')) {

                        $ionicScrollDelegate.freezeScroll(true);
                        sliderContent.style.transform = 'translate3d(' + (dragStartPosition + e.gesture.deltaX) +'px,0,0)';
                        sliderContent.style.webkitTransform = 'translate3d(' + (dragStartPosition + e.gesture.deltaX) +'px,0,0)';

                        if ( e.gesture.distance > 25 && (!dragDirection || dragDirection === e.gesture.direction)) {
                            dragDirection = e.gesture.direction;
                        } else if (dragDirection && dragDirection !== e.gesture.direction) {
                            dragDirection = null;
                        }

                }

            }, elm);

            $ionicGesture.on('dragend', function (e) {
                var resetDrag = false;
                sliderContent.classList.remove('dragging');
                switch(dragDirection) {
                    case 'left':
                        scope.pageUp();
                        e.preventDefault();
                        resetDrag = true;
                        break;
                    case 'right':
                        scope.pageDown();
                        resetDrag = true;
                    break;

                    case null:
                        // No direction so reset to startPosition;
                        sliderContent.style.webkitTransform = 'translate3d(' + dragStartPosition +'px,0,0)';
                        break;
                }
                dragDirection = null;
                $ionicScrollDelegate.freezeScroll(false);
                $ionicSideMenuDelegate.canDragContent(true);

                getCurrentPosition();

                // $timeout(function(){
                //     sliderContent.style.transform = 'translate3d(' + 0 +',0,0)';
                //     sliderContent.style.webkitTransform = 'translate3d(' + 0 +',0,0)';
                // }, (resetDrag ? 100 : 0));
            }, elm);
            scope.$watch('data', function (newVal) {
                if (newVal) {
                    angular.element($window).trigger('resize');
                }
            }, true);

            scope.$on('$destroy', function () {
                // console.log('slider destroyed');
                angular.element($window).unbind('resize');
            });
        }
    };
}]);
