function InAppPurchaseFunction(FirebaseService, $q, $log) {
    var InAppPurchase = {};

    InAppPurchase.getProduct = function (productID) {
        var getProductPromise = $q.defer();

        if (!productID) {
            getProductPromise.reject('Please Specify A Product ID');
        }

        var product = store.get(productID);
        if (product) {
            getProductPromise.resolve(product);
        } else {
            getProductPromise.reject('Invalid Product');
        }

        return getProductPromise.promise;
    };

    InAppPurchase.orderProduct = function (productID) {
        var orderedProductPromise = $q.defer();

        store.order(productID)
            .then(function (orderedProduct) {
                if (ionic.Platform.isAndroid()) {
                    var firebaseUID = FirebaseService.getUserUID();
                    FirebaseService.ref.child(firebaseUID).child('receipts').child('google/transactions').update(
                        {
                            "purchaseDate": Firebase.ServerValue.TIMESTAMP,
                            "product": orderedProduct
                        },
                        function (error) {
                            if (error) {
                                console.log('Synchronization failed', error);
                            } else {
                                console.log('Synchronization succeeded');
                            }
                        });
                }
                orderedProductPromise.resolve(orderedProduct);
            })
            .error(function (error) {
                orderedProductPromise.reject(error);
            });

        return orderedProductPromise.promise;
    };

    InAppPurchase.finishOrder = function (order) {
        order.finish();
    };

    InAppPurchase.refreshStore = function () {
        store.refresh();
    };

    InAppPurchase.turnOffEvent = function (eventHandler) {
        store.off(eventHandler)
    };

    return InAppPurchase;

}

angular.module('swMobileApp').factory('InAppPurchase', ['FirebaseService', '$q', '$log', InAppPurchaseFunction]);
