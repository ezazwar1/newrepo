'use strict';

angular.module('pp_express.module')
    .config(function config($stateProvider) {
        $stateProvider.state('app.menu.payment_modules.pp_express', {
            url: '/pp_express',
               abstract: true,
               views: {
                   'paymentsContent': {
                       templateUrl: 'app/payment_modules/pp_express/templates/layout.html'
                   }
               }
           })
           .state('app.menu.payment_modules.pp_express.home', {
               url: '/home',
               views: {
                   'ppExpressContent': {
                       templateUrl: 'app/payment_modules/pp_express/templates/home.html',
                       controller: 'PaymentPPExpressCtrl'
                   }
               }
           })
    });