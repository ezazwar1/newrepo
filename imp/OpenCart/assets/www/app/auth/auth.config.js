'use strict';

angular.module('auth.module')
    .config(function config($stateProvider) {
        $stateProvider
           .state('app.main.auth', {
               url: '/auth',
               abstract: true,
               views: {
                   'main': {
                       templateUrl: 'app/auth/templates/layout.html'
                   }
               }
           })
           .state('app.main.auth.home', {
               url: '/home/:back',
               views: {
                   'authContent': {
                       templateUrl: 'app/auth/templates/auth-home.html',
                       controller: 'AuthMainCtrl',
                       controllerAs: 'vm'
                   }
               }
           })
    });