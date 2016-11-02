'use strict';

angular.module('info.module')
    .config(function config($stateProvider) {
        $stateProvider
           .state('app.menu.info', {
               url: '/info',
               abstract: true,
               views: {
                   'tab-info': {
                       templateUrl: 'app/info/templates/layout.html'
                   },
                   'menu': {
                       templateUrl: 'app/info/templates/layout.html'
                   }
               }
           })
           .state('app.menu.info.home', {
               url: '/home',
               views: {
                   'infoContent': {
                       templateUrl: 'app/info/templates/info-home.html',
                       controller: 'InfoCtrl'
                   }
               },
               params: { redirect: null }
           })
           .state('app.menu.info.orders', {
               url: '/orders',
               views: {
                   'infoContent': {
                       templateUrl: 'app/info/templates/info-orders-list.html',
                       controller: 'InfoOrdersCtrl'
                   }
               }
           })
           .state('app.menu.info.order', {
               url: '/order/:id',
               views: {
                   'infoContent': {
                       templateUrl: 'app/info/templates/info-order.html',
                       controller: 'InfoLoadOrderCtrl'
                   }
               }
           })
           .state('app.menu.info.wishlist', {
               url: '/wishlist',
               views: {
                   'infoContent': {
                       templateUrl: 'app/info/templates/info-wishlist.html',
                       controller: 'InfoWishlistCtrl'
                   }
               }
           })
    });