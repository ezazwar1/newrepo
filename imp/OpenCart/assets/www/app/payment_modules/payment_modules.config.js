'use strict';

angular.module('payments.module')
    .config(function config($stateProvider) {
        $stateProvider.state('app.menu.payment_modules', {
            url: '/payment_modules',
            abstract: true,
            views: {
                'tab-cart': {
                    templateUrl: 'app/payment_modules/templates/layout.html'
                },
                'menu': {
                    templateUrl: 'app/payment_modules/templates/layout.html'
                }
            },
            params: { checkout: null, currency: null, total_amount: null, total_amount_clean: null, success_state: null }
        })
    });