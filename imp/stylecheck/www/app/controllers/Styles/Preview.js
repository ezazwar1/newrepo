/*global define*/
define([
    'app',
    'services/productedelight',
    'services/preview',
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
], function (app) {

    'use strict';

    app.controller('PreviewCtrl', [
        '$q',
        '$scope',
        '$rootScope',
        '$window',
        '$timeout',
        '$ionicScrollDelegate',
        '$ionicPopover',
        'browseService',
        'imageService',
        'productService',
        'userService',
        'previewService',
        'ModalFactory',
        'PopupFactory',
        'StorageFactory',
        function ($q, $scope, $rootScope, $window, $timeout, $ionicScrollDelegate, $ionicPopover, browseService, imageService, productService, userService, previewService, modalFactory, popupFactory, StorageFactory) {
            var productsModal,
                currentIndex,
                howToModal;

            $scope.styles = previewService.styles;

            $scope.openPopover = function ($event) {
                if (!$scope.popOver) {
                    return $ionicPopover.fromTemplateUrl('popover.html', {
                        scope: $scope
                    }).then(function (popover) {
                        $scope.popOver = popover;
                        $scope.popOver.show($event);
                    });
                }
                $scope.popOver.show($event);
            };

            $scope.closePopover = function () {
                if ($scope.popOver && $scope.popOver.isShown()) {
                    $scope.popOver.hide();
                }
            };

            $scope.onPopoverClick = function () {
                $scope.showRegisterHint();
            };

            modalFactory($scope, 'app/templates/styles/partials/productsModal.html').then(function (modal) {
                productsModal = modal;
            });

            if (!StorageFactory.get('firstPreview')) {
                $scope.rateHelp = true;
                modalFactory($scope, 'app/templates/partials/howToModal.html').then(function (modal) {
                    howToModal = modal;
                    howToModal.show().then(function () {
                        $scope.contentLoaded = true;
                    });
                });
                StorageFactory.add({firstPreview: true});
            }

            $scope.closeModal = function (modal) {
                if (modal === 'howTo') {
                    return howToModal.hide();
                }
                productsModal.hide();
            };

            $scope.$on('$ionicView.beforeEnter', function () {
                $scope.showStyle = false;
                $scope.showInfos = false;
                currentIndex = 0;
            });

            $scope.$on('$ionicView.enter', function () {
                $scope.tags = false;
                delete $scope.tagIndex;
                $scope.fadeInStyle = false;
                $scope.showStyle = false;
                $scope.productsLoaded = false;
                $scope.productList = {};
                delete $scope.style;
                $scope.sort = 'score';

                $scope.style = $scope.styles[currentIndex];
                $scope.style.user.thumbnail = $scope.style.user.avatar.path;
                $scope.style.imagePath = $scope.style.image.path;
                $scope.fadeInStyle = true;

                if ($scope.style) {
                    $timeout(function () {
                        $scope.showStyle = true;
                    });
                }
            });

            $scope.$on('tagChanged', function (event, index) {
                if ($scope.tagIndex !== index) {
                    $scope.tagIndex = index;
                    $scope.sort = 'score';
                    $scope.getProducts(index);
                    $scope.productList = {};
                }
                productsModal.show().then(function () {
                    $ionicScrollDelegate.$getByHandle('products').resize();
                });
            });

            function getAverageRating() {
                if ($scope.style.ratingCount >= 5) {
                    $scope.style.averageRatingInPercent = Math.ceil($scope.style.averageRating / 0.04);
                } else {
                    $scope.style.averageRatingInPercent = 0;
                }
            }

            $scope.$on('rated', function (event, rate) {
                if (rate) {
                    currentIndex = currentIndex + 1;
                    $scope.noProducts = false;
                    $scope.productsLoaded = false;
                    $scope.productList = {};
                    $scope.tagIndex = false;
                    if (currentIndex <= $scope.styles.length - 1) {
                        $scope.showStyle = false;
                        $scope.style = $scope.styles[currentIndex];
                        $scope.style.user.thumbnail = $scope.style.user.avatar.path;
                        $scope.style.imagePath = $scope.style.image.path;
                        $scope.fadeInStyle = true;
                        getAverageRating();

                        $timeout(function () {
                            $scope.showStyle = true;
                        });
                    } else {
                        popupFactory({
                            title: $rootScope.dict.previewFinished,
                            template: $rootScope.dict.previewFinishedHint,
                            buttons: [
                                {
                                    text: $rootScope.dict.close,
                                    type: 'button button-block button-outline button-dark'
                                },
                                {
                                    text: $rootScope.dict.register,
                                    type: 'button button-block button-outline button-assertive',
                                    onTap: function () {
                                        $scope.closePopover();
                                        $scope.goToRegister();
                                    }
                                }
                            ]
                        });
                    }

                }
            });

            $scope.showRegisterHint = function () {
                popupFactory({
                    title: $rootScope.dict.sorry + '!',
                    template: $rootScope.dict.registrationHint,
                    buttons: [
                        {
                            text: $rootScope.dict.close,
                            type: 'button button-block button-outline button-dark',
                            onTap: function () {
                                $scope.closePopover();
                            }
                        },
                        {
                            text: $rootScope.dict.register,
                            type: 'button button-block button-outline button-assertive',
                            onTap: function () {
                                $scope.closePopover();
                                $scope.goToRegister();
                            }
                        }
                    ]
                });
            };

            $scope.goToRegister = function () {
                browseService.go('unauthorized.register');
            };

            $scope.back = function () {
                browseService.go('unauthorized.overview');
            };

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
                            return;
                        }
                        if (data2[0] && data2[0].Products && data2[0].Products.length) {
                            $scope.productList[$scope.sort] = data2[0].Products;
                            $scope.productsLoaded = true;
                            return;
                        }
                        $scope.productsLoaded = true;
                        $scope.noProducts = true;
                        data2[0] = {
                            'Products': []
                        };
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
        }
    ]);
});
