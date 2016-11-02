/*global define, require*/
define([
    'app',
    'settings',
    // common controller
    'controllers/App',
    'controllers/Base',

    // authorized
    'controllers/Dashboard/View',
    'controllers/User/Profile',
    'controllers/User/ProfileDetails',
    'controllers/User/EditProfile',
    'controllers/User/EditImage',
    'controllers/User/Ranking',
    'controllers/User/Search',
    'controllers/User/AccountSettings',
    'controllers/User/FilterSettings',
    'controllers/User/Brands',
    'controllers/Styles/Detail',
    'controllers/Styles/Create/Base',
    'controllers/Styles/Create/ChooseCategory',
    'controllers/Styles/Create/Tags',
    'controllers/Styles/Discover',
    'controllers/Styles/FashionFeed',
    'controllers/Styles/WishList',
    'controllers/Message/View',
    'controllers/Settings/View',
    'controllers/Page/View',

    // unauthorized controllers
    'controllers/Unauthorized/Base',
    'controllers/Unauthorized/Overview',
    'controllers/Unauthorized/Register',
    'controllers/Unauthorized/Login',
    'controllers/Styles/Preview',
    'services/user'
], function (app, settings) {
    'use strict';

    return app.config([
        '$stateProvider',
        '$urlRouterProvider',
        '$ionicConfigProvider',
        function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

            $ionicConfigProvider.platform.android.navBar.alignTitle('center');
            $ionicConfigProvider.backButton.text('');
            $ionicConfigProvider.views.swipeBackEnabled(false);

            // url routes/states
            $urlRouterProvider.otherwise('/unauthorized/overview');

            function setTemplate(area, view) {
                var viewName = view && view !== '' ? view : 'View';

                viewName = viewName[0].toLowerCase() + viewName.slice(1);
                area = area[0].toLowerCase() + area.slice(1);

                return 'app/templates/' + area + '/' + viewName + '.html';
            }

            $stateProvider
                // app states
                .state('unauthorized', {
                    url: '/unauthorized',
                    isAbstract: true,
                    views: {
                        '': {
                            templateUrl: setTemplate('Unauthorized', 'Base'),
                            controller: 'UnauthorizedCtrl'
                        }
                    }
                })
                .state('unauthorized.overview', {
                    url: '/overview',
                    templateUrl: setTemplate('Unauthorized', 'Overview'),
                    controller: 'OverviewCtrl',
                    rootHistory: true,
                    noAuth: true
                })
                .state('unauthorized.register', {
                    url: '/register',
                    templateUrl: setTemplate('Unauthorized', 'Register'),
                    controller: 'RegisterCtrl',
                    noAuth: true
                })
                .state('unauthorized.login', {
                    url: '/login',
                    templateUrl: setTemplate('Unauthorized', 'Login'),
                    controller: 'LoginCtrl',
                    noAuth: true
                })
                .state('unauthorized.preview', {
                    url: '/preview',
                    templateUrl: setTemplate('Styles', 'Preview'),
                    controller: 'PreviewCtrl',
                    noAuth: true
                })
                .state('base', {
                    url: '/',
                    isAbstract: true,
                    templateUrl: 'app/templates/base.html',
                    controller: 'BaseCtrl',
                    resolve: {
                        user: ['$q', '$rootScope', 'userService', function ($q, $rootScope, userService) {
                            var q = $q.defer(),
                                result = {};

                            // before change to base state -> load user account
                            userService.account().then(function (user) {
                                result.object = user;
                                if (settings.languages.indexOf(user.language) !== -1) {
                                    require(['dicts/' + user.language], function (dict) {
                                        // extend default dict with user language dict
                                        $rootScope.dict = angular.extend($rootScope.dict, dict);
                                        q.resolve(user);
                                    });
                                } else {
                                    q.resolve(user);
                                }
                            }, q.resolve);

                            return q.promise;
                        }]
                    }
                })
                .state('base.dashboard', {
                    url: 'dashboard',
                    templateUrl: setTemplate('Dashboard', 'View'),
                    controller: 'DashboardCtrl',
                    rootHistory: true
                })
                .state('base.profile', {
                    url: 'profile',
                    isAbstract: true,
                    templateUrl: setTemplate('User', 'BaseProfile'),
                    controller: 'ProfileCtrl'
                })
                .state('base.profile.overview', {
                    url: '/:userId',
                    templateUrl: setTemplate('User', 'Profile'),
                    controller: 'ProfileDetailsCtrl'
                })
                .state('base.profile.styleDetail', {
                    url: '/styleDetail/:id',
                    templateUrl: setTemplate('Styles', 'Detail'),
                    controller: 'DetailCtrl'
                })
                .state('base.editProfile', {
                    url: 'editProfile/:userId',
                    templateUrl: setTemplate('User', 'EditProfile'),
                    controller: 'EditProfileCtrl'
                })
                .state('base.editProfileFirst', {
                    url: 'editProfile/:userId/:first',
                    templateUrl: setTemplate('User', 'EditProfile'),
                    controller: 'EditProfileCtrl',
                    rootHistory: true
                })
                .state('base.editImage', {
                    url: 'editImage/',
                    templateUrl: setTemplate('User', 'EditImage'),
                    controller: 'EditImageCtrl'
                })
                .state('base.editImageFirst', {
                    url: 'editImage/:first',
                    templateUrl: setTemplate('User', 'EditImage'),
                    controller: 'EditImageCtrl'
                })
                .state('base.createStyle', {
                    url: 'create',
                    isAbstract: true,
                    templateUrl: setTemplate('Styles/create', 'Base'),
                    controller: 'CreateStyleCtrl'
                })
                .state('base.createStyle.chooseCategory', {
                    url: '/chooseCategory',
                    templateUrl: setTemplate('Styles/create', 'ChooseCategory'),
                    controller: 'ChooseCategoryCtrl'
                })
                .state('base.createStyle.tags', {
                    url: '/tags',
                    isAbstract: true,
                    templateUrl: setTemplate('Styles/create', 'BaseTags'),
                    controller: 'TagsCtrl'
                })
                .state('base.createStyle.tags.addTags', {
                    url: '/addTags',
                    templateUrl: setTemplate('Styles/create', 'AddTags')
                })
                .state('base.createStyle.tags.tagOverview', {
                    url: '/tagOverview',
                    templateUrl: setTemplate('Styles/create', 'TagOverview')
                })
                .state('base.createStyle.tags.chooseClothes', {
                    url: '/chooseClothes',
                    templateUrl: setTemplate('Styles/create', 'ChooseClothes')
                })
                .state('base.createStyle.tags.chooseColor', {
                    url: '/chooseColor',
                    templateUrl: setTemplate('Styles/create', 'ChooseColor')
                })
                .state('base.editStyle', {
                    url: 'edit/:styleId',
                    isAbstract: true,
                    templateUrl: setTemplate('Styles/create', 'Base')
                })
                .state('base.editStyle.tags', {
                    url: '/tags',
                    isAbstract: true,
                    templateUrl: setTemplate('Styles/create', 'BaseTags'),
                    controller: 'TagsCtrl'
                })
                .state('base.editStyle.tags.addTags', {
                    url: '/addTags',
                    templateUrl: setTemplate('Styles/create', 'AddTags')
                })
                .state('base.editStyle.tags.tagOverview', {
                    url: '/tagOverview',
                    templateUrl: setTemplate('Styles/create', 'TagOverview')
                })
                .state('base.editStyle.tags.chooseClothes', {
                    url: '/chooseClothes',
                    templateUrl: setTemplate('Styles/create', 'ChooseClothes')
                })
                .state('base.editStyle.tags.chooseColor', {
                    url: '/chooseColor',
                    templateUrl: setTemplate('Styles/create', 'ChooseColor')
                })
                .state('base.styleDetail', {
                    url: 'styles/detail/:id',
                    templateUrl: setTemplate('Styles', 'Detail'),
                    controller: 'DetailCtrl'
                })
                .state('base.styleDiscover', {
                    url: 'styles/discover',
                    isAbstract: true,
                    templateUrl: setTemplate('Styles', 'Discover'),
                    controller: 'DiscoverCtrl'
                })
                .state('base.styleDiscover.detail', {
                    url: '/',
                    views: {
                        'detail@base.styleDiscover': {
                            templateUrl: setTemplate('Styles', 'Detail'),
                            controller: 'DetailCtrl'
                        }
                    },
                    rootHistory: true
                })
                .state('base.fashionFeed', {
                    url: 'fashionFeed',
                    isAbstract: true,
                    templateUrl: setTemplate('Styles', 'BaseFashionFeed'),
                    controller: 'FashionFeedCtrl'
                })
                .state('base.fashionFeed.overview', {
                    url: '/',
                    templateUrl: setTemplate('Styles', 'FashionFeed'),
                    controller: 'FashionFeedCtrl',
                    rootHistory: true
                })
                .state('base.fashionFeed.detail', {
                    url: '/:id',
                    templateUrl: setTemplate('Styles', 'Detail'),
                    controller: 'DetailCtrl'
                })
                .state('base.wishList', {
                    url: 'wishList',
                    isAbstract: true,
                    templateUrl: setTemplate('Styles', 'BaseWishList'),
                    controller: 'WishListCtrl'
                })
                .state('base.wishList.overview', {
                    url: '/',
                    templateUrl: setTemplate('Styles', 'WishList'),
                    controller: 'WishListCtrl',
                    rootHistory: true
                })
                .state('base.wishList.detail', {
                    url: '/:id',
                    templateUrl: setTemplate('Styles', 'Detail'),
                    controller: 'DetailCtrl'
                })
                .state('base.messages', {
                    url: 'messages',
                    templateUrl: setTemplate('Message', 'View'),
                    controller: 'MessageCtrl'
                })
                .state('base.ranking', {
                    url: 'ranking',
                    templateUrl: setTemplate('User', 'Ranking'),
                    controller: 'RankingCtrl'
                })
                .state('base.search', {
                    url: 'search',
                    templateUrl: setTemplate('User', 'Search'),
                    controller: 'SearchCtrl',
                    rootHistory: true
                })
                .state('base.settings', {
                    url: 'settings',
                    templateUrl: setTemplate('Settings', 'View'),
                    controller: 'SettingsCtrl',
                    rootHistory: true
                })
                .state('base.accountSettings', {
                    url: 'accountSettings',
                    templateUrl: setTemplate('User', 'AccountSettings'),
                    controller: 'AccountSettingsCtrl'
                })
                .state('base.filterSettings', {
                    url: 'filterSettings/:first',
                    templateUrl: setTemplate('User', 'FilterSettings'),
                    controller: 'FilterSettingsCtrl'
                })
                .state('base.brands', {
                    url: 'brands',
                    templateUrl: setTemplate('User', 'Brands'),
                    controller: 'BrandsCtrl'
                })
                .state('base.brandsFirst', {
                    url: 'brands/:first',
                    templateUrl: setTemplate('User', 'Brands'),
                    controller: 'BrandsCtrl'
                })
                .state('base.page', {
                    url: 'page/:type/:id',
                    templateUrl: setTemplate('Page', 'View'),
                    controller: 'PageCtrl'
                });
        }
    ]);
});
