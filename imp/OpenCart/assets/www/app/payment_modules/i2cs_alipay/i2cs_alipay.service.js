(function () {
    'use strict';
    angular
        .module('i2cs_alipay.module')
        .service('PaymentAlipayService', function ($http, $q, $ionicLoading, dataService, BASE_API_URL) {

            this.OpenPaymetWindow = function (id) {
                var deferred = $q.defer();

                if (cordova && cordova.InAppBrowser) {
                    $ionicLoading.show();
                    var inappbrowser = cordova.InAppBrowser.open(BASE_API_URL + "/payment_handlers/i2cs_alipay/checkout&order_id=" + id, '_blank', 'location=no,hidden=yes');
                    inappbrowser.addEventListener('loadstop', function (e) {
                        inappbrowser.show();
                        $ionicLoading.hide();
                        try {
                            if (e.url.substring(0, BASE_API_URL.length) === BASE_API_URL) {
                                if (e.url.indexOf("api2/payment_handlers/i2cs_alipay/checkout/success") > -1) {
                                    deferred.resolve({ id: getParameterByName("id", e.url) });
                                    inappbrowser.close();
                                } else if (e.url.indexOf("api2/payment_handlers/i2cs_alipay/checkout/error") > -1) {
                                    deferred.reject({ error: getParameterByName("error", e.url) });
                                    inappbrowser.close();
                                }
                            }
                        } catch (e) {

                        }
                    });
                } else {
                    deferred.reject({ error: "No inAppBrowser" });
                }

                return deferred.promise;
            }

            var getParameterByName = function (name, url) {
                if (!url) url = window.location.href;
                name = name.replace(/[\[\]]/g, "\\$&");
                var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                    results = regex.exec(url);
                if (!results) return null;
                if (!results[2]) return '';
                return decodeURIComponent(results[2].replace(/\+/g, " "));
            }

        })
})();