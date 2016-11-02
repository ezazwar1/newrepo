/*global define*/
define([
    'app',
    'services/api',
    'services/browse',
    'services/style',
    'services/productedelight',
    'services/user',
    'directives/addTag',
    'directives/inputDelimiter',
    'factories/popup',
    'factories/storage',
    'factories/modal',
    'factories/loading'
], function (app) {

    'use strict';

    app.controller('TagsCtrl', [
        '$q',
        '$scope',
        '$rootScope',
        '$window',
        '$timeout',
        '$ionicHistory',
        'apiService',
        'browseService',
        'styleService',
        'productService',
        'userService',
        'PopupFactory',
        'StorageFactory',
        'ModalFactory',
        'LoadingFactory',
        function ($q, $scope, $rootScope, $window, $timeout, $ionicHistory, apiService, browseService, styleService, productService, userService, popupFactory, StorageFactory, modalFactory, loadingFactory) {
            var stateParams = browseService.params(),
                howToModal;
            $scope.modals = {};
            $scope.image = styleService.newStyle.image;
            $scope.editing = false;
            $scope.newStyle = styleService.newStyle;

            if (!StorageFactory.get('firstTag')) {
                $scope.tagHelp = true;
                modalFactory($scope, 'app/templates/partials/howToModal.html').then(function (modal) {
                    howToModal = modal;
                    howToModal.show().then(function () {
                        $scope.contentLoaded = true;
                    });
                });
                StorageFactory.add({firstTag: true});
            }

            function saveTag(styleId, tag) {
                var q = $q.defer();

                styleService.createTag(styleId, tag, true).then(q.resolve, q.reoslve);

                return q.promise;
            }
            function setVars() {
                $scope.clothes = apiService.config.clothCategories;
                $scope.colors = apiService.config.colors;
            }
            function createAndShowModal(type) {
                modalFactory($scope, 'app/templates/modalChoose' + type + '.html').then(function (modal) {
                    $scope.modals[type.toLowerCase()] = modal;
                    modal.show();
                });
            }
            function showModal(type) {
                if (['Color', 'Cloth'].indexOf(type) !== -1) {
                    if ($scope.modals[type.toLowerCase()]) {
                        $scope.modals[type.toLowerCase()].show();
                    } else {
                        createAndShowModal(type);
                    }
                }
            }

            setVars();
            if (stateParams.styleId) {
                $scope.existingStyle = true;
                styleService.get(stateParams.styleId).then(function (style) {
                    $scope.newStyle = style;
                    $scope.image = style.image;
                });
            }

            $scope.showModal = showModal;

            $scope.closeModal = function (type) {
                if ($scope.modals[type.toLowerCase()]) {
                    return $scope.modals[type.toLowerCase()].hide();
                }
                howToModal.hide();
            };

            $scope.add = function () {
                if ($scope.newStyle.tags.length <= 5) {
                    $scope.editing = true;
                } else {
                    popupFactory({
                        title: $rootScope.dict.errors.limit_exceeded,
                        template: $rootScope.dict.errors.tag_limit_exceeded,
                        okType: 'button-assertive'
                    }, 'alert');
                }
            };

            $scope.editTag = function () {
                if (!$scope.existingStyle) {
                    browseService.go('base.createStyle.tags.tagOverview');
                } else {
                    browseService.go('base.editStyle.tags.tagOverview');
                }
            };

            $scope.removeTag = function () {
                popupFactory({
                    title: $rootScope.dict.delete,
                    template: $rootScope.dict.deleteTagHint,
                    buttons: [
                        {
                            text: $rootScope.dict.cancel,
                            type: 'button button-block button-outline button-dark'
                        },
                        {
                            text: $rootScope.dict.delete,
                            type: 'button button-block button-outline button-assertive',
                            onTap: function () {
                                if ($scope.existingStyle) {
                                    var tagId = $scope.newStyle.tags[$scope.newStyle.activeTag]._id;
                                    loadingFactory().then(function (loadingOverlay) {
                                        styleService.deleteTag($scope.newStyle._id, tagId).then(loadingOverlay.hide, loadingOverlay.hide);
                                    });
                                }
                                if ($scope.newStyle.activeTag !== undefined) {
                                    $scope.newStyle.tags.splice($scope.newStyle.activeTag, 1);
                                    $scope.newStyle.activeTag = undefined;
                                }
                                $scope.editing = false;
                            }
                        }
                    ]
                });
            };

            $scope.saveStyle = function () {
                var tasks = [],
                    tags = angular.copy($scope.newStyle.tags),
                    imagePath = $scope.newStyle.image.originalPath || $scope.newStyle.image.path;

                loadingFactory().then(function (loadingOverlay) {
                    styleService.create({category: $scope.newStyle.category}, true).then(function (style) {
                        angular.forEach(tags, function (tag) {
                            tasks.push(saveTag(style._id, tag));
                        });
                        $q.all(tasks).then(function () {
                            if ($window.cordova) {
                                styleService.uploadImage(style._id, imagePath).then(function () {
                                    $rootScope.resetHistory();
                                    browseService.go('base.profile.overview', {'userId': userService.user._id}).then(loadingOverlay.hide, loadingOverlay.hide);
                                }, loadingOverlay.hide);
                            } else {
                                $rootScope.resetHistory();
                                browseService.go('base.profile.overview', {'userId': userService.user._id}).then(loadingOverlay.hide, loadingOverlay.hide);
                            }
                        });
                    }, loadingOverlay.hide);
                });
            };

            $scope.saveTag = function () {
                var tag = $scope.newStyle.tags[$scope.newStyle.activeTag];
                if (tag.category && tag.name && tag.color) {
                    $scope.editing = false;
                    $scope.newStyle.activeTag = undefined;
                } else {
                    popupFactory({
                        title: $rootScope.dict.errors.errorTitle,
                        template: $rootScope.dict.errors.missing_tag_details,
                        okType: 'button-assertive'
                    }, 'alert');
                }
                if ($scope.existingStyle) {
                    loadingFactory().then(function (loadingOverlay) {
                        if (!tag._id) {
                            styleService.createTag($scope.newStyle._id, tag).then(function (style) {
                                $scope.newStyle = style;
                                loadingOverlay.hide();
                            }, loadingOverlay.hide);
                        } else {
                            styleService.updateTag($scope.newStyle._id, tag._id, tag).then(function (style) {
                                $scope.newStyle = style;
                                loadingOverlay.hide();
                            }, loadingOverlay.hide);
                        }
                    });
                }
            };

            $scope.chooseGender = function (gender) {
                var tag = $scope.newStyle.tags[$scope.newStyle.activeTag];
                tag.gender = gender;
                tag.category = '';
                tag.name = '';
            };

            $scope.chooseCat = function (category) {
                $timeout(function () {
                    $scope.subcategories = $scope.clothes[category].sub;
                    showModal('Cloth');
                }, 300);
            };

            $scope.chooseSub = function () {
                $timeout(function () {
                    $scope.closeModal('Cloth').then(function () {
                        $ionicHistory.goBack();
                    });
                }, 300);
            };

            $scope.chooseColor = function () {
                $timeout(function () {
                    $ionicHistory.goBack();
                }, 300);
            };

            $scope.getProducts = function (index) {
                $scope.tempTagIndex = index;
                var tag = $scope.newStyle.tags[index],
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
                        'sort': $scope.sort.popularity
                    };

                // reset data
                $scope.noProducts = false;
                $scope.productsLoaded = false;
                $scope.productList = [];

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
                            $scope.productList = data.Products;
                            $scope.productsLoaded = true;
                            return;
                        }
                        if (data2[0] && data2[0].Products && data2[0].Products.length) {
                            $scope.productList = data2[0].Products;
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

            $scope.$on('$ionicView.enter', function () {
                $scope.show = true;
                $scope.sort = {
                    popularity: true
                }
            });

            $scope.$on('tagChanged', function (event, index) {
                if (!$scope.editing && $scope.newStyle.activeTag === undefined) {
                    $scope.editing = true;
                    $scope.newStyle.activeTag = index;
                }
            });

            $scope.openChooseClothes = function () {
                if (!$scope.existingStyle) {
                    browseService.go('base.createStyle.tags.chooseClothes');
                } else {
                    browseService.go('base.editStyle.tags.chooseClothes');
                }
            };

            $scope.openChooseColor = function () {
                if (!$scope.existingStyle) {
                    browseService.go('base.createStyle.tags.chooseColor');
                } else {
                    browseService.go('base.editStyle.tags.chooseColor');
                }
            };

            $scope.openLink = function (link) {
                $window.open(link, '_blank', 'location=yes');
            };

            $scope.backToOverview = function () {
                if ($window.cordova && $window.cordova.plugins.Keyboard) {
                    $window.cordova.plugins.Keyboard.close();
                }
                loadingFactory().then(function (loadingOverlay) {
                    $timeout(function () {
                        $ionicHistory.goBack();
                        loadingOverlay.hide();
                    }, 500);
                });
            };
        }
    ]);
});
