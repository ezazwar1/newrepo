'use strict';

angular.module('advertikon_stripe.module')
    .config(function config($stateProvider, StripeCheckoutProvider) {
        $stateProvider.state('app.menu.payment_modules.advertikon_stripe', {
            url: '/advertikon_stripe',
               abstract: true,
               resolve: {
                   // checkout.js isn't fetched until this is resolved.
                   stripe: StripeCheckoutProvider.load
               },
               views: {
                   'paymentsContent': {
                       templateUrl: 'app/payment_modules/advertikon_stripe/templates/layout.html'
                   }
               }
           })
           .state('app.menu.payment_modules.advertikon_stripe.home', {
               url: '/home',
               views: {
                   'stripeContent': {
                       templateUrl: 'app/payment_modules/advertikon_stripe/templates/home.html',
                       controller: 'PaymentStripeCtrl',
                       controllerAs: 'vm'
                   }
               }
           })
    });