angular.module('stohke.controllers')

.controller('ProfileController', [
'$scope',
'$state',
'$stateParams',
'STOHKE_CONFIG',
'authService',
'userService',
'$ionicActionSheet',
'lodash',
'ngNotify',
'$localStorage',
'$ionicSideMenuDelegate',
'$ionicNavBarDelegate',
'$ionicModal',
'$ionicLoading',
'$timeout',
'Utils',
'Camera',
'sharingService',
'$rootScope',
function(
    $scope,
    $state,
    $stateParams,
    _STOHKE,
    authService,
    userService,
    $ionicActionSheet,
    _,
    ngNotify,
    $localStorage,
    $ionicSideMenuDelegate,
    $ionicNavBarDelegate,
    $ionicModal,
    $ionicLoading,
    $timeout,
    Utils,
    Camera,
    sharingService,
    $rootScope
) {
    'use strict';
    console.log('Profile Controller');

    $scope.expandSummary = true;
    $timeout(function() {
        $scope.expandSummary = false;
        $timeout(function(){
            // summary has collapsed but no scroll event took place
            // so update lazy image load
            $scope.$broadcast('lazyScrollEvent');
        }, 400);
    }, 1500);

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
    $scope.videoType = 'Youtube';
    $scope.videoId = null;
    $scope.videoCaption = null;
    $scope.disableFlagging = true;

    $timeout(function() {
        $scope.collapseSummary = false;
        $timeout(function(){
            // summary has collapsed but no scroll event took place
            // so update lazy image load
            $scope.$broadcast('lazyScrollEvent');
        }, 400);
    }, 1500);
    $scope.mediaActions = function (mediaItem) {
        // var actionButtons = [];
        var actions = $ionicActionSheet.show({
            // buttons: actionButtons,
            destructiveText: 'Delete',
            titleText: 'Media Actions',
            cancelText: 'Cancel',
            cancel: function() {
                actions();
            },
            destructiveButtonClicked: function () {

                actions();
                var confirmAction = $ionicActionSheet.show({
                    destructiveText: 'Yes. I\'m sure.',
                    titleText: 'Are you sure?',
                    cancelText: 'Cancel',
                    cancel: function() {
                        confirmAction();
                    },
                    destructiveButtonClicked: function () {
                        // Close the confirm action
                        confirmAction();

                        userService.deleteUserMedia(mediaItem.Id, mediaItem.Type)
                        .then(function() {

                            // console.log('Media deleted:', mediaItem.Id);
                            var removedItem; 
                            switch (mediaItem.Type) {
                                case 1:
                                    removedItem =_.remove($scope.userMedia.images, function(n) {
                                        console.log(n, mediaItem);
                                        return n.Id === mediaItem.Id;
                                    });
                                    break;
                                case 2:
                                    removedItem =_.remove($scope.userMedia.videos, function(n) {
                                        console.log(n, mediaItem);
                                        return n.Id === mediaItem.Id;
                                    });
                                    break;
                            }
                            // console.log($scope.userMedia, removedItem);

                            ngNotify.set('Media deleted.', {
                                type:'success',
                                duration: 2000,
                                position: 'bottom'
                            });
                        });
                    }
                });
            }
        });
    };

    function getUserProfileData () {
        userService.getUserDetails('current', 'user')
        .then( function(results) {
            $scope.user = results.data;
        });
    }
    authService.authentication()
        .then(function (result) {
            $scope.userAuth = result;
            $ionicNavBarDelegate.title($scope.userAuth.data.UserName);
        },
        function () {
            $state.go('app.explore.list');
        });
    userService.hasProfile().then(function (result){
        $scope.hasProfile = result.data;
    })
    .then(getUserProfileData());
    userService.getUserMedia('current', 1, 0, 0)
    .then (
          function (results) {
            $scope.userMedia.featured = results.data;
        }
    )
    .then(function () {
        $scope.getImages();
    })
    .then(function () {
        $scope.getVideos();
    });

    $scope.getImages =  function(takeOver, skipOver) {
        console.log('get more images');
        var takeAmt = takeOver || _STOHKE.defaultQuantities.images,
            skipAmt = skipOver || $scope.userMedia.images.length;
        userService.getUserMedia('current', takeAmt, skipAmt, 1)
        .then (
              function (results) {
                console.log(results.data);
                if (results.data && results.data.length < takeAmt) {
                    $scope.canLoadMore.images = false;
                }
                _.each(results.data, function (result) {
                    $scope.userMedia.images.push(result);
                });
            }
        );
    };
    $scope.getVideos =  function() {
        console.log('load videos');
        var takeAmt = 6,
            skipAmt = $scope.userMedia.videos.length;
        userService.getUserMedia('current', takeAmt, skipAmt, 2)
        .then (
              function (results) {
                console.log(results.data);
                if (results.data.length < takeAmt) {
                    $scope.canLoadMore.videos = false;
                }
                _.map(results.data, function (result) {

                    if (result.Url.indexOf('vimeo.com') > -1) {
                        result.Url += '?badge=0&byline=0&title=0&portrait=0&autoplay=1';
                    } else if (result.Url.indexOf('youtube.com') > -1) {
                        result.Url += '?showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&controls=0&autoplay=1';
                    }
                    $scope.userMedia.videos.push(result);
                });
            }
        );
    };
    $scope.toggleSummaryCollapse = function () {
        $scope.expandSummary = !$scope.expandSummary;
    };
    var actionSheetOptions = {
        title: 'Choose media source',
        buttonLabels: ['Camera', 'Photo Library'],
        addCancelButtonWithLabel: 'Cancel',
        androidEnableCancelButton : true,
        winphoneEnableCancelButton : true
    };
    $scope.uploadToGallery =  function () {
        window.plugins.actionsheet.show(actionSheetOptions, function(btnIndex) {
            var index = btnIndex;
            console.log(index);
            if (index <= 0 ) {
                return false;
            }
            if (index > actionSheetOptions.buttonLabels.length) {
                return false;
            }
            var options = {
                allowEdit: false,
                // targetWidth: 1920
            };
            Camera.getPicture(index, options)
            .then( function (data) {

                $ionicLoading.show({
                    template: 'uploading...'
                });
                userService.uploadImage(data)
                .then(
                    function (newImg) {

                        $scope.userMedia.images.unshift(newImg);
                        ngNotify.set('Media added.', {
                            type:'success',
                            duration: 2000,
                            position: 'bottom'
                        });
                    },
                    function () {

                        ngNotify.set('Error uploading image. Please try again later', {
                            type:'error',
                            duration: 2000,
                            position: 'bottom'
                        });
                    }
                )
                .then(function () {
                    $ionicLoading.hide();
                });
            });
        });
    };
    $scope.changeProfilePicture = function () {
        window.plugins.actionsheet.show(actionSheetOptions, function(btnIndex) {
            var index = btnIndex;
            console.log(index);
            if (index <= 0 ) {
                return false;
            }
            if (index > actionSheetOptions.buttonLabels.length) {
                return false;
            }
            var options = {
                allowEdit: false,
                targetWidth: 1920
            };
            Camera.getPicture(index, options)
            .then( function (data) {

                $ionicLoading.show({
                    template: 'uploading pic...'
                });
                userService.updateProfileImage(data)
                .then(
                    function (timeStamp) {
                        // console.log('uploading image success handler');

                        // store the update date in the user service;
                        $scope.user.AvatarUrl200x200 += '?' + timeStamp;

                        ngNotify.set('Profile image updated.', {
                            type:'success',
                            duration: 2000,
                            position: 'bottom'
                        });
                    },
                    function () {
                        // console.error('uploading image error handler');
                        ngNotify.set('Error uploading image. Please try again later', {
                            type:'error',
                            duration: 2000,
                            position: 'bottom'
                        });
                    }
                )
                .then(function () {
                    $ionicLoading.hide();
                });
            });
        });
    };

    $ionicModal.fromTemplateUrl('templates/add-video-modal.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.videoModal = modal;
    });
    $scope.addVideo = function () {
        $scope.videoModal.show();
    };
    $scope.saveVideo = function (type, id, caption) {

        if (!id) {
            ngNotify.set('Invalid ' + type + 'Link or ID.', {
                type:'error',
                duration: 2000,
                position: 'bottom'
            });
            return false;
        }
        var video = {
            url: handleVideoInput(type, id),
            caption: caption
        };

        userService.addVideoLink(video)
        .then(
            function (results) {
                $scope.userMedia.videos.unshift(results.data);
                ngNotify.set('Video added', {
                    type:'success',
                    duration: 1500,
                    position: 'bottom'
                });
                $scope.videoId = null;
                $scope.videoCaption = null;
                $scope.videoModal.hide();
            },
            function () {
                ngNotify.set('Couldn\'t add video. Please try again later.', {
                    type:'error',
                    duration: 2000,
                    position: 'bottom'
                });
            }
        );
    };

    $scope.showImage = function(index) {
        $scope.activeSlide = index;
        $scope.showModal('templates/image-modal.html', function (modal) {
            $scope.mediaModal = modal;
        });
    };
    $scope.showVideo = function(index) {
        $scope.activeSlide = index;
        $scope.mediaModal = $scope.showModal('templates/video-modal.html', function (modal) {
            console.log(modal);
            $scope.mediaModal = modal;
        });
        if (window.ionic.Platform.isAndroid()) {
            window.screen.unlockOrientation();
        }
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

    $scope.dontShowTutorial = $localStorage.skipProfileTutorial;
    $scope.showTutorial = function () {
        $scope.showModal('templates/info/profile-tutorial.html', function (modal) {
            $scope.tutorialModal = modal;
        });
        $scope.$on('modal.hidden', function() {
            // Execute action
            if ($scope.dontShowTutorial) {
                $localStorage.skipProfileTutorial = true;
            } else {
                $localStorage.skipProfileTutorial = false;
            }
        });
    };

    if (!$localStorage.skipProfileTutorial) {
        // open tutorial modal
        $scope.showTutorial();
    }
    $scope.share = function (file) {
        console.log('share', file);
        // Share a media object or, 
        var shareFile = !_.isEmpty(file) ? (file.ImageUrl768X432 || file.ThumbnailLargeUrl) : ($scope.user.AvatarUrl200x200 || $scope.user.LogoLarge);
        var shareUrl = !_.isEmpty(file) ? Utils.getStohkeUrl('media', $scope.user, file) : Utils.getStohkeUrl('profile', $scope.user);
        var shareMessage = 'Check out my ' + (!_.isEmpty(file) ? ((file.Type === 1 ? 'photo' : '' || file.Type === 2 ? 'video' : '')) : 'profile') + ' on Stohke.';
        console.log(shareFile, shareUrl, shareMessage);
        sharingService.share(
            shareMessage,
            'Stohke',
            shareFile,
            shareUrl
        );
    };
    var handleVideoInput = function (type, id, forPreview) {
        var finalLink;
        var isLink = (id.indexOf('http') >= 0);
        switch (type.toLowerCase()) {
            case 'youtube':
                if (isLink) {
                    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                    var match = id.match(regExp);
                    if (match && match[2].length >= 11) {
                        console.log(match);
                        id = match[2];
                    } else {
                        //error
                        ngNotify.set('Invalid Youtube Link or ID.', {
                            type:'error',
                            duration: 2000,
                            position: 'bottom'
                        });
                        return false;
                    }
                }
                finalLink = "http://www.youtube.com/embed/" + id;
                if (forPreview) {
                    finalLink += "?showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&controls=0&autoplay=1";
                }
                break;
            case 'vimeo':
                    if (isLink) {
                        var regExp = /https?:\/\/(?:www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/;
                        var match = id.match(regExp);
                        console.log(match);
                        if (match && match[3].length) {
                            console.log(match[3]);
                            id = match[3];

                            // player.vimeo.com/video/
                        } else {
                            //error
                            ngNotify.set('Invalid Vimeo Link or ID.', {
                                type:'error',
                                duration: 2000,
                                position: 'bottom'
                            });
                            return false;
                        }
                    }
                    finalLink = "http://vimeo.com/" + id;
                    if (forPreview) {
                        finalLink += "?badge=0&byline=0&title=0&portrait=0&autoplay=1";
                    }
                break;
        }
        return finalLink;
    };
    $scope.videoTypes = [
        {
            type: 'Youtube',
            supportedUrls: ['youtube', 'youtu.be']
        },
        {
            type: 'Vimeo',
            supportedUrls: ['vimeo']
        }
    ];

    $scope.checkType =  function (val) {
        if (!val || !val.length) {
            return;
        }
        _.each($scope.videoTypes, function (vidType) {
            _.each(vidType.supportedUrls, function (url) {
                if (val.toLowerCase().indexOf(url) > -1) {
                    $scope.videoType = vidType.type;
                }
            });
        });
    };
    $scope.openExternalUrl = function (url) {
        Utils.openExternalUrl(url, {location: 'no'});
    };
    $scope.previewVideo = function (type, id) {
        if (!type || !id) {
            return false;
        }

        var properLink =handleVideoInput(type, id, true);

        window.open(properLink, '_blank', 'location=no');
        return false;
    };
    $scope.watchVideo = function (url) {
        openWindow = window.open(url+'&autoplay=1', '_blank', 'location=no');
    };
    $scope.visitVideoHost = function (host) {
        if (!host) {
            return false;
        }
        var hostType = host,
            hostUrl;
        switch (host.toLowerCase()) {
            case 'youtube':
                hostUrl = 'http://m.youtube.com';
                break;
            case 'vimeo':
                hostUrl = 'http://www.vimeo.com';
                break;
        }
        if (!hostUrl) {
            return false;
        }
        var browseEvent = function (event) {
            console.log('browseEvent = ', event);

            var url = handleVideoInput(hostType, event.url );
            if (url) {
                $scope.videoId = url;
            }
            console.log($scope.videoId);

        };
        var videoBrowser = Utils.openExternalUrl(hostUrl, {location: 'yes'});
        videoBrowser.addEventListener('loadstart', browseEvent);
        videoBrowser.onbeforeunload = function () {
            videoBrowser.removeEventListener('loadstart');
        };
    };

    $scope.$on('$stateChangeSuccess',
        function(event, toState, toParams, fromState, fromParams) {
            console.log(event, toState, toParams, fromState, fromParams);
            if (fromState.name === 'app.profile-edit') {
                getUserProfileData();
                $ionicSideMenuDelegate.canDragContent(true);
                $rootScope.$broadcast('menu:buttonStatus', {hideMenu: false});
            }
            if (toState.name === 'app.profile-edit') {
                $ionicSideMenuDelegate.canDragContent(false);
                $rootScope.$broadcast('menu:buttonStatus', {hideMenu: true});
            }
        }
    );
}])
.controller('ProfileEditController', [
    '$scope',
    '$state',
    '$stateParams',
    'authService',
    'userService',
    'STOHKE_CONFIG',
    '$ionicPlatform',
    '$ionicNavBarDelegate',
    '$ionicModal',
    '$ionicLoading',
    'Camera',
    'lodash',
    'ngNotify',
    '$timeout',
function(
    $scope,
    $state,
    $stateParams,
    authService,
    userService,
    _STOHKE,
    $ionicPlatform,
    $ionicNavBarDelegate,
    $ionicModal,
    $ionicLoading,
    Camera,
    _,
    ngNotify,
    $timeout
) {
    'use strict';
    console.log('Profile Edit Controller');
    var actionSheetOptions = {
        title: 'Where\'s your new profile pic?',
        buttonLabels: ['Camera', 'Photo Library'],
        addCancelButtonWithLabel: 'Cancel',
        androidEnableCancelButton : true,
        winphoneEnableCancelButton : true
    };
    authService.authentication().then(function (result) {
        $scope.userAuth = result;
    });

    userService.hasProfile().then(function (result){
        $scope.hasProfile = result.data;
    })
    .then(function (){
        userService.getUserDetails('current', 'user')
        .then( function(results) {

            if (!results.data.Sports) {
                results.data.Sports = [];
            }
            $scope.user = results.data;
            $scope.userFresh =  angular.copy($scope.user);
        })
        .then(function () {
            // We've got user Data now

            $scope.sports = _.map(_STOHKE.sports, function (sport) {
                return {
                    'name': sport,
                    'isChecked': $scope.isChecked(sport)
                };
            });
        });
    });

    $scope.isChecked = function (sport) {

        return _.some($scope.user.Sports, function (aSport) {

            return aSport === sport;
        });
    };
    $scope.toggleSport = function (sport) {
        // Check if sport is already in array
        if (_.indexOf($scope.user.Sports, sport) > -1) {
            var sportIndex = _.findIndex($scope.user.Sports, function (aSport) {
                return aSport === sport;
            });
            _.pullAt($scope.user.Sports, sportIndex);
        }else {
            $scope.user.Sports.push(sport);
        }
    };

    $ionicModal.fromTemplateUrl('templates/pick-sports.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.pickSports = function() {
        $scope.modal.show();
    };
    
    var unsavedChangePromptCount = 0;
    $scope.saveProfile = function () {
        console.log('Save profile', $scope.user);
        if ($scope.user.FirstName && $scope.user.FirstName.length) {
            $scope.user.FirstName = $scope.user.FirstName.trim();
        }
        if ($scope.user.MiddleName && $scope.user.MiddleName.length) {
            $scope.user.MiddleName = $scope.user.MiddleName.trim();
        }
        if ($scope.user.LastName && $scope.user.LastName.length) {
            $scope.user.LastName = $scope.user.LastName.trim();
        }
        if ($scope.user.NickName && $scope.user.NickName.length) {
            $scope.user.NickName = $scope.user.NickName.trim();
        }

        // simple checks for values
        userService.updateProfile($scope.user)
        .then( function () {
            ngNotify.set('Changes Saved', {
                type:'success',
                duration: 2000,
                position: 'bottom'
            });
            $scope.userFresh = angular.copy($scope.user);
            $state.go('app.profile');
        });
    };
    $scope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams) {
            console.log(event, toState, toParams, fromState, fromParams);
            if (fromState.name === 'app.profile' & toState.name === 'app.profile-edit') {
                unsavedChangePromptCount = 0;
            }
            if (!angular.equals($scope.user, $scope.userFresh)) {
                if (unsavedChangePromptCount === 0) {
                    ngNotify.set('You have unsaved changes. Press back again discard changes.', {
                        type: 'error',
                        duration: 1500,
                        position: 'top'
                    });
                    unsavedChangePromptCount++;
                    event.preventDefault();
                    return false;
                } else  {
                    // console.log('double tapped back with changes');
                    ngNotify.set('Changes discarded', {
                        type: 'error',
                        duration: 1500,
                        position: 'bottom'
                    });
                }
            } else {
                // console.log('no unsaved changes');
            }
        }
    );

}]);
