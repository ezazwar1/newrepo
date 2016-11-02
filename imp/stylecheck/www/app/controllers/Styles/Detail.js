/*global define, Instagram*/
define([
    'app',
    'moment',
    'services/productedelight',
    'services/style',
    'services/user',
    'directives/rateStyle',
    'directives/addTag',
    'directives/imageOnLoad',
    'services/image',
    'factories/loading',
    'factories/modal',
    'factories/popup',
    'factories/storage',
    'services/browse'
], function (app, moment) {

    'use strict';

    app.controller('DetailCtrl', [
        '$q',
        '$scope',
        '$rootScope',
        '$window',
        '$timeout',
        '$ionicScrollDelegate',
        'browseService',
        'imageService',
        'productService',
        'userService',
        'styleService',
        'ModalFactory',
        'PopupFactory',
        'StorageFactory',
        'LoadingFactory',
        function ($q, $scope, $rootScope, $window, $timeout, $ionicScrollDelegate, browseService, imageService, productService, userService, styleService, modalFactory, popupFactory, StorageFactory, loadingFactory) {
            var productsModal,
                commentsModal,
                reportModal,
                howToModal,
                stateParams,
                modalShown;

            modalFactory($scope, 'app/templates/styles/partials/productsModal.html').then(function (modal) {
                productsModal = modal;
            });

            modalFactory($scope, 'app/templates/styles/partials/commentsModal.html').then(function (modal) {
                commentsModal = modal;
            });

            modalFactory($scope, 'app/templates/styles/partials/reportModal.html').then(function (modal) {
                reportModal = modal;
            });

            if (!StorageFactory.get('firstRate')) {
                $scope.rateHelp = true;
                modalFactory($scope, 'app/templates/partials/howToModal.html').then(function (modal) {
                    howToModal = modal;
                    howToModal.show().then(function () {
                        $scope.contentLoaded = true;
                    });
                });
                StorageFactory.add({firstRate: true});
            }

            $scope.$on('$ionicView.leave', function () {
                $scope.showStyle = false;
                $scope.showFilter = false;
            });

            $scope.$on('$ionicView.enter', function () {
                stateParams = browseService.params();
                $scope.tags = false;
                delete $scope.tagIndex;
                $scope.reportStyle = { 'reason': '' };
                $scope.newComment = {
                    text: ''
                };
                $scope.styleComments = [];
                $scope.user = userService.user;
                $scope.fadeInStyle = false;
                $scope.productsLoaded = false;
                $scope.styleCreationDate = '';
                delete $scope.style;
                $scope.sort = 'score';
                $scope.productList = {};
                $scope.styleNotFound = false;

                if (browseService.current().name !== 'base.styleDiscover.detail') {
                    // ordinary detail page
                    styleService.get(stateParams.id).then(function (style) {
                        style.user.thumbnail = imageService.getPath(style.user.avatar, 300);
                        $scope.style = style;
                        $scope.style.imagePath = imageService.getPath($scope.style.image, 1200, true);
                        $scope.fadeInStyle = true;
                        
                        if (userService.user.favStyles.indexOf($scope.style._id) !== -1) {
                            $scope.isFav = true;
                        } else {
                            $scope.isFav = false;
                        }

                        var styleCreationDate = $scope.style.creationDate;
                        $scope.styleCreationDate = moment(styleCreationDate).format('DD.MM.YYYY');
                        $scope.styleCreationTime = moment(styleCreationDate).format('H:mm');
                        $scope.showStyle = true;
                    }, function (response) {
                        if (response.data.error === 'style_not_found') {
                            $scope.styleNotFound = true;
                        }
                    });
                } else {
                    // discover detail view
                    $scope.$emit('loadStyles');
                    $scope.showFilter = true;
                }
            });

            if (browseService.current().name === 'base.styleDiscover.detail') {
                $scope.$on('styleLoaded', function (event, nextStyle) {
                    nextStyle.user.thumbnail = imageService.getPath(nextStyle.user.avatar, 300);
                    $scope.style = nextStyle;
                    $scope.style.imagePath = imageService.getPath($scope.style.image, 1200, true);
                    $scope.fadeInStyle = true;

                    if (userService.user.favStyles.indexOf($scope.style._id) !== -1) {
                        $scope.isFav = true;
                    } else {
                        $scope.isFav = false;
                    }

                    if ($scope.style) {
                        $timeout(function () {
                            $scope.showStyle = true;
                        });
                    }
                });
                // hide style temporary when filter is changing
                $scope.$on('filerStyles', function () {
                    $scope.showStyle = false;
                });
            }

            function convertImgToBase64URL(url, callback, outputFormat) {
                var canvas = document.createElement('CANVAS'),
                    ctx = canvas.getContext('2d'),
                    img = new Image();

                img.crossOrigin = 'Anonymous';
                img.onload = function () {
                    var dataURL;
                    canvas.height = img.height;
                    canvas.width = img.width;
                    ctx.drawImage(img, 0, 0);
                    dataURL = canvas.toDataURL(outputFormat);
                    callback(dataURL);
                    canvas = null;
                };
                img.src = url;
            }

            function getAverageRating() {
                if ($scope.style.ratingCount >= 5) {
                    $scope.style.averageRatingInPercent = Math.ceil($scope.style.averageRating / 0.04);
                } else {
                    $scope.style.averageRatingInPercent = 0;
                }
            }

            $scope.share = function (service) {
                var path = $scope.style.imagePath;
                if ($window.cordova) {
                    if (service === 'facebook') {
                        $window.plugins.socialsharing.shareViaFacebookWithPasteMessageHint($rootScope.dict.sharedWithStylecheck, path, null, null, function () {
                        }, function (err) {
                            if (err !== 'not available') {
                                popupFactory({
                                    title: $rootScope.dict.sorry,
                                    template: $rootScope.dict.onlyWithApp,
                                    buttons: [
                                        {
                                            text: $rootScope.dict.ok,
                                            type: 'button button-block button-outline button-dark'
                                        }
                                    ]
                                });
                            }
                        });
                    } else if (service === 'twitter') {
                        $window.plugins.socialsharing.shareViaTwitter($rootScope.dict.sharedWithStylecheck, path, null, function () {
                        }, function (err) {
                            if (err !== 'not available') {
                                popupFactory({
                                    title: $rootScope.dict.sorry,
                                    template: $rootScope.dict.onlyWithApp,
                                    buttons: [
                                        {
                                            text: $rootScope.dict.ok,
                                            type: 'button button-block button-outline button-dark'
                                        }
                                    ]
                                });
                            }
                        });
                    } else {
                        Instagram.isInstalled(function (err, installed) {
                            if (installed) {
                                convertImgToBase64URL(path, function (base64Img) {
                                    path = base64Img;
                                    Instagram.share(path, $rootScope.dict.sharedWithStylecheck, function () {});
                                });
                            } else {
                                popupFactory({
                                    title: $rootScope.dict.sorry,
                                    template: $rootScope.dict.onlyWithApp,
                                    buttons: [
                                        {
                                            text: $rootScope.dict.ok,
                                            type: 'button button-block button-outline button-dark'
                                        }
                                    ]
                                });
                            }
                        });
                    }
                }
            };

            $scope.$on('rated', function (event, rate) {
                if (rate) {
                    loadingFactory().then(function (loadingOverlay) {
                        delete $scope.tagIndex;
                        styleService.rating($scope.style._id, {value: rate}).then(function (updatedStyle) {
                            if (styleService.currentDiscoverStyle && styleService.currentDiscoverStyle._id === $scope.style._id) {
                                styleService.currentDiscoverStyle = {};
                            }
                            var i = 0;
                            for (i; i < styleService.discoverStyles.length; i = i + 1) {
                                if (styleService.discoverStyles[i]._id === $scope.style._id) {
                                    styleService.discoverStyles.splice(i, 1);
                                    break;
                                }
                            }
                            if (browseService.current().name === 'base.styleDiscover.detail') {
                                // discover detail view
                                $scope.showStyle = false;
                                $scope.$emit('loadStyles');
                                $scope.isFav = false;
                            } else {
                                $scope.style.rating = true;
                                $scope.style.ratingSum = updatedStyle.ratingSum;
                                $scope.style.ratingCount = updatedStyle.ratingCount;
                                $scope.style.averageRating = updatedStyle.averageRating;

                                getAverageRating();
                                $scope.$broadcast('successfullyRated');
                            }
                            loadingOverlay.hide();
                        }, loadingOverlay.hide);
                    });
                }
            });

            $scope.openReportStyle = function () {
                reportModal.show();
            };

            $scope.reportStyleAndSend = function () {
                if ($scope.reportStyle.reason || $scope.reportStyle.otherReason) {
                    if (!$scope.reportStyle.reason || $scope.reportStyle.otherReason) {
                        $scope.reportStyle.reason = $scope.reportStyle.otherReason;
                    }

                    styleService.createReport($scope.style._id, {'reason': $scope.reportStyle.reason}).then(function () {
                        $scope.reportStyle.reason = '';
                        $scope.reportStyle.otherReason = '';
                        $scope.closeModal('report');
                    });
                }
            };

            $scope.shareStyle = function () {
                popupFactory({
                    title: $rootScope.dict.shareStyle,
                    template:
                        '<p>{{dict.whereToShare}}</p>' +
                        '<div class="social-share">' +
                            '<div class="social-share-wrapper display-flex align-center center">' +
                                '<button class="button button-clear button-dark button-large icon icon-facebook" ng-click="share(\'facebook\')"></button>' +
                                '<button class="button button-clear button-dark button-large icon icon-twitter" ng-click="share(\'twitter\')"></button>' +
                                '<button class="button button-clear button-dark button-large icon icon-instagram" ng-click="share(\'instagram\')"></button>' +
                            '</div>' +
                        '</div>',
                    scope: $scope,
                    buttons: [
                        {
                            text: $rootScope.dict.cancel,
                            type: 'button-outline button-dark'
                        }
                    ]
                });
            };

            $scope.$on('tagChanged', function (event, index) {
                if ($scope.tagIndex !== index) {
                    $scope.tagIndex = index;
                    $scope.sort = 'score';
                    $scope.productList = {};
                    $scope.getProducts(index);
                }
                productsModal.show().then(function () {
                    $ionicScrollDelegate.$getByHandle('products').resize();
                });
            });

            $scope.filterProducts = function (index, sort) {
                $scope.sort = sort;
                $ionicScrollDelegate.$getByHandle('products').scrollTop();
                if (!$scope.productList[$scope.sort]) {
                    $scope.getProducts(index);
                }
            };

            $scope.getProducts = function (index) {
                $scope.tempTagIndex = index;

                var tag = $scope.style.tags[index],
                    productRequests = [],
                    params = {
                        'category': tag.category,
                        'gender': tag.gender,
                        'color': tag.color,
                        'clothes': tag.category,
                        'name': tag.name,
                        'brand': tag.brand,
                        'genderMap': {
                            'keys': ['cf_geschlecht', 'cf_gender', 'cf_diviv'],
                            'female': ['f', 'w', 'damen', 'women', 'woman', 'female', 'unisex'],
                            'male': ['m', 'herren', 'men', 'man', 'male', 'unisex']
                        },
                        'maxHits': 36,
                        'sort': $scope.sort
                    };

                // reset data
                $scope.noProducts = false;
                $scope.productsLoaded = false;
                $scope.productList[$scope.sort] = [];

                if (!params.name || !params.color) {
                    return;
                }

                productService.getProducts(params).then(function (data) {
                    if (data.Products.length <= 0 && params.brand) {
                        //no product found with brand and gender, trying without brand
                        delete params.brand;
                        productRequests.push(productService.getProducts(params));
                    }
                    $q.all(productRequests).then(function (data2) {
                        if (data.Products.length > 0) {
                            //First Request has data
                            $scope.productList[$scope.sort] = data.Products;
                            $scope.productsLoaded = true;
                            $ionicScrollDelegate.$getByHandle('products').scrollTop();
                            return;
                        }
                        if (data2[0] && data2[0].Products && data2[0].Products.length) {
                            $scope.productList[$scope.sort] = data2[0].Products;
                            $scope.productsLoaded = true;
                            $ionicScrollDelegate.$getByHandle('products').scrollTop();
                            return;
                        }
                        $scope.productsLoaded = true;
                        $scope.noProducts = true;
                        data2[0] = {
                            'Products': []
                        };

                        $ionicScrollDelegate.$getByHandle('products').scrollTop();
                    }, function (res) {
                        if (res.status !== 0) {
                            $scope.noProducts = true;
                            $scope.productsLoaded = true;
                        }
                    });
                }, function (res) {
                    if (res.status !== 0) {
                        $scope.noProducts = true;
                        $scope.productsLoaded = true;
                    }
                });
            };

            $scope.openLink = function (link) {
                $window.open(link, '_blank', 'location=yes,closebuttoncaption=' + $rootScope.dict.backToApp);
            };

            $scope.onInfoButtonClick = function () {
                $scope.showInfos = !$scope.showInfos;

                if ($scope.fadeInStyle) {
                    $scope.fadeInStyle = false;
                }

                getAverageRating();
            };

            $scope.closeModal = function (modal) {
                if (modal === 'products') {
                    productsModal.hide();
                } else if (modal === 'comments') {
                    commentsModal.hide();
                } else if (modal === 'report') {
                    reportModal.hide();
                } else {
                    howToModal.hide();
                }
            };

            $scope.showCommentsModal = function () {
                styleService.getComments($scope.style._id).then(function (comments) {
                    if (comments.entries.length !== 0) {
                        angular.forEach(comments.entries, function (comment) {
                            if (comment.user && comment.user.avatar) {
                                comment.user.avatar.path = imageService.getPath(comment.user.avatar, 600);
                            }
                        });
                    }
                    $scope.styleComments = comments;
                    commentsModal.show();
                });
            };

            $scope.createComment = function () {
                styleService.comment($scope.style._id, {text: $scope.newComment.text}).then(function (comment) {
                    comment.user.avatar.path = imageService.getPath(comment.user.avatar, 600);
                    $scope.styleComments.entries = $scope.styleComments.entries.concat(comment);
                    $scope.style.commentCount = $scope.style.commentCount + 1;
                    $scope.newComment.text = '';
                });
            };

            $scope.deleteComment = function (id, index, event) {
                event.stopImmediatePropagation();
                popupFactory({
                    title: $rootScope.dict.delete,
                    template: $rootScope.dict.deleteCommentHint,
                    buttons: [
                        {
                            text: $rootScope.dict.cancel,
                            type: 'button button-block button-outline button-dark'
                        },
                        {
                            text: $rootScope.dict.delete,
                            type: 'button button-block button-outline button-assertive',
                            onTap: function () {
                                styleService.deleteComment($scope.style._id, id).then(function () {
                                    $scope.styleComments.entries.splice(index, 1);
                                    $scope.style.commentCount = $scope.style.commentCount - 1;
                                });
                            }
                        }
                    ]
                });
            };

            $scope.$on('modal.shown', function () {
                modalShown = true;
            });

            $scope.openUserProfile = function (id) {
                if (modalShown) {
                    commentsModal.hide();
                    modalShown = false;
                }

                if (browseService.current().name === 'base.styleDiscover.detail') {
                    styleService.currentDiscoverStyle = $scope.style;
                }
                
                browseService.go('base.profile.overview', {'userId': id});
            };

            $scope.deleteStyle = function () {
                popupFactory({
                    title: $rootScope.dict.deleteStyle,
                    template: $rootScope.dict.reallyDeleteStyle,
                    buttons: [
                        {
                            text: $rootScope.dict.no,
                            type: 'button button-block button-outline button-dark'
                        },
                        {
                            text: $rootScope.dict.yes,
                            type: 'button button-block button-outline button-assertive',
                            onTap: function () {
                                styleService.deleteStyle($scope.style._id).then(function () {
                                    browseService.go('base.profile.overview', {'userId': $scope.user._id});
                                    $scope.$emit('styleDeleted');
                                });
                            }
                        }
                    ]
                });
            };

            $scope.editStyle = function () {
                browseService.go('base.editStyle.tags.addTags', {styleId: $scope.style._id});
            };

            $scope.toggleShoplist = function () {
                if (userService.user.favStyles.indexOf($scope.style._id) >= 0) {
                    popupFactory({
                        title: $rootScope.dict.remove,
                        template: $rootScope.dict.reallyRemoveStyleFromWishlist,
                        buttons: [
                            {
                                text: $rootScope.dict.no,
                                type: 'button button-block button-outline button-dark'
                            },
                            {
                                text: $rootScope.dict.yes,
                                type: 'button button-block button-outline button-assertive',
                                onTap: function () {
                                    loadingFactory().then(function (loadingOverlay) {
                                        styleService.favorize($scope.style._id).then(function (user) {
                                            if (user.favStyles.indexOf($scope.style._id) !== -1) {
                                                $scope.isFav = true;
                                            } else {
                                                $scope.isFav = false;
                                            }
                                            loadingOverlay.hide();
                                        }, function () {
                                            loadingFactory.hide();
                                        });
                                    });
                                }
                            }
                        ]
                    });
                } else {
                    loadingFactory().then(function (loadingOverlay) {
                        styleService.favorize($scope.style._id).then(function (user) {
                            if (user.favStyles.indexOf($scope.style._id) !== -1) {
                                $scope.isFav = true;
                            } else {
                                $scope.isFav = false;
                            }
                            loadingOverlay.hide();
                        }, function () {
                            loadingOverlay.hide();
                        });
                    });
                }
            };
        }
    ]);
});
