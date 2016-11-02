(function (angular, ionic) {
    'use strict';
    var purchaseInProgress;
    angular.module('znk.sat').controller('IapModalCtrl', [
        'IapSrv', 'PopUpSrv', '$scope', '$timeout',
        function (IapSrv, PopUpSrv, $scope, $timeout) {
            if(purchaseInProgress){
                $scope.close();
            }
            $scope.purchase = function(productId){
                if(purchaseInProgress){
                    return;
                }
                purchaseInProgress = true;
                $timeout(function(){
                    purchaseInProgress = false;
                },5000);
                $scope.close();
                var purchaseProm = IapSrv.purchase(productId);
                purchaseProm.then(function(){
                    
                },function(err){
                    
                });
            };

            var getProductsProm = IapSrv.getProducts();
            getProductsProm.then(function(productsArr){
                var products = productsArr.map(function(product){

                    if (product.title === null){
                        
                    }

                    //HACK - has to move to IapSrv.getProducts
                    var duration;
                    if (ionic.Platform.isAndroid()){
                        duration = angular.copy(product.title).substr(0,product.title.indexOf('(')).trim();
                    }
                    else{
                        duration = angular.copy(product.title).replace(/\(.*\)/,'').replace('of ZinkerzSAT Pro','');
                    }
                    return {
                        price: product.price,
                        duration: duration,
                        id: product.id
                    };
                });
                $scope.products = products;
            },function(res){
                PopUpSrv.error(undefined,res);
                $scope.close();
            });
        }
    ]);
})(angular, ionic);
