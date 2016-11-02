/*global angular*/
'use strict';
angular.module('stohke.controllers')

.controller('DiscoverController', ['$scope', '$stateParams', '$ionicModal', 'userService', '$timeout', 'lodash', '$q', 'authService', 'Utils', 'sharingService', function($scope, $stateParams, $ionicModal, userService, $timeout, _, $q, authService, Utils, sharingService) {

    console.log('Discover Controller');
    authService.checkAuth()
    .then(function (data) {
        $scope.user = data;
        $timeout(function(){
            getMedia();
        }, 0);
    });
    $scope.media = [];
    $scope.loading = true;
    $scope.discoverType = $stateParams.type;
    function getMedia () {
        if ($stateParams.type === 'featured') {
            userService.getFeaturedMediaExt({take: 10, skip: 0, isFeatured: true})
            .then(function (results) { 

                _.each(results.data, function (result) {
                    var item = {
                        Media: result,
                        Author: {}
                    };
                    switch (item.Media.Type) {
                        case 1: 
                            item.Type = 'image';
                        break;
                        case 2:
                            item.Type = 'video';
                        break;
                    }
                    // console.log(item);
                    userService.getUserDetails(item.Media.UserId, 'user')
                    .success(function (results) {

                        // Either use a better api to get details to match
                        // that of getRandomImagesExt or switch on gender to decide
                        // whether or not they are a comany
                        if (results.Gender) {
                            results.Type = 'user';
                        } else {
                            results.Type = 'company';
                        }

                        item.Author = results;
                        $scope.media.push(item);
                    });
                });
            })
            .then(function () {
                $scope.loading = false;
            });
        } else if ($stateParams.type === 'random') {

            var getMoreRandom = function () {
                
                return $timeout(function(){
                    return userService.getRandomImagesExt({batchSize: 1})
                    .then(function (results) { 
                        $scope.media.push(results.data.pop());
                    });
                }, 0);
            };
            getMoreRandom().then( function () {
                if ($scope.media.length < 10) {
                    // Loop to get more media if under 10
                    getMoreRandom();
                } else {
                    $scope.loading = false;
                }
            });
            
        }
    }

    $scope.getMore = function () {
        switch ($stateParams.type) {
            case 'random' :
                for (var i = 0; i < 10; i++) {

                }
                break;
        }
    };
    $scope.showHotspots = function(item) {
        if (!item.length) {
            return false;
        }
        $scope.activeMediaHotspots = item;
        $scope.showModal('templates/hotspots.html', function (modal) {
            console.log(modal);
            $scope.hotspotModal = modal;
        });
    };
    $scope.watchVideo = function (url) {
        // window.open(url+'&autoplay=1', '_blank', 'location=no');
        Utils.openExternalUrl(url+'&autoplay=1');
    };
    $scope.openUrl = function (url) {
        Utils.openExternalUrl(url, {location: 'yes'});
    };
    $scope.showModal = function(templateUrl, cb) {
        $ionicModal.fromTemplateUrl(templateUrl, {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            modal.show();
            (cb || angular.noop)(modal);
        });
    };
    $scope.share = function (file) {
        // console.log('share', file);
 
        var user = file.Author,
            media = file.Media;
        var shareFile = !_.isEmpty(media) ? media.ImageUrl768X432 : (user.AvatarUrl200x200 || user.LogoLarge);
        var shareUrl = Utils.getStohkeUrl('media', user, media);
        var shareMessage = 'Check out ' + (user.Title || (user.FirstName + ' ' + user.LastName)) + (!_.isEmpty(media) ? ('\'s ' + (media.Type === 1 ? 'photo' : '' || media.Type === 2 ? 'video' : '')) : '') + ' on Stohke. Via the @Stohke app.';
        console.log(shareFile, shareUrl, shareMessage);
        sharingService.share(
            shareMessage,
            'Stohke',
            shareFile,
            shareUrl
        );
    };
}]);