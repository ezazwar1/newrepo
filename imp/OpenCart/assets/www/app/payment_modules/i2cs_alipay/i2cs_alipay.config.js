'use strict';

angular.module('i2cs_alipay.module')
    .config(function config($stateProvider) {
        $stateProvider.state('app.menu.payment_modules.i2cs_alipay', {
            url: '/i2cs_alipay',
               abstract: true,
               views: {
                   'paymentsContent': {
                       templateUrl: 'app/payment_modules/i2cs_alipay/templates/layout.html'
                   }
               }
           })
           .state('app.menu.payment_modules.i2cs_alipay.home', {
               url: '/home',
               views: {
                   'stripeContent': {
                       templateUrl: 'app/payment_modules/i2cs_alipay/templates/home.html',
                       controller: 'PaymentAlipayCtrl'
                   }
               }
           })
    });