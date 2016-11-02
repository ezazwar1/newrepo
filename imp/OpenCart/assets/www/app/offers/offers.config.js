'use strict';

angular.module('offers.module')
    .config(function config($stateProvider) {
        $stateProvider
           .state('app.menu.offers', {
               url: '/offers',
               abstract: true,
               views: {
                   'tab-offers': {
                       templateUrl: 'app/offers/templates/layout.html'
                   },
                   'menu': {
                       templateUrl: 'app/offers/templates/layout.html'
                   }
               }
           })
           .state('app.menu.offers.home', {
               url: '/home',
               views: {
                   'offersContent': {
                       templateUrl: 'app/offers/templates/offers-list.html',
                       controller: 'OffersCtrl',
                       controllerAs: 'vm'
                   }
               }
           })
    });