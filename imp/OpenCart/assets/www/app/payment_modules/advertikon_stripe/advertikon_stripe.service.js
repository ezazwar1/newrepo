(function () {
    'use strict';
    angular
        .module('advertikon_stripe.module')
        .service('PaymentStripeService', function ($http, $q, dataService) {

            this.MakePayment = function (data) {

                return dataService.apiSecuredPost('/payment_handlers/advertikon_stripe/checkout', data).then(function (data) {
                    if (data && data.error)
                        return $q.reject(data.error);
                    else
                        return data;
                });
            }

            this.GetPublicKey = function (data) {

                return dataService.apiSecuredPost('/payment_handlers/advertikon_stripe/checkout/publickey').then(function (data) {
                    if (data && data.error)
                        return $q.reject(data.error);
                    else
                        return data;
                });
            }
        })
})();