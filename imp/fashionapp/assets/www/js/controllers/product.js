myApp
.controller('ProductCtrl', function($scope, $state, $ionicGesture, $stateParams, $ionicPlatform, Brand, Collections, Product) {

    $scope.showReturn();
    $scope.setPageEvent(true);

    Product.get($stateParams.id).then(function(productResp) {
        $scope.product = productResp;
        Brand.getById($scope.product.collection.brand.id).then(function(brandResp) {
            if (brandResp.image_banner === null && (brandResp.medias.length > 0)) {
                brandResp.image__thumbnail = brandResp.medias[0].image__thumbnail;
            }
            $scope.product.brand_full = brandResp;
        });

        Collections.getById($scope.product.collection.id).then(function(resp) {
            $scope.product.collection_full = resp;
        });

        $scope.initView();
        $scope.setCurrentItem($scope.product);

    });


    $scope.goCollection = function(id) {
        $state.go('collection', {id : id});
    };

    $scope.goBrand = function(id) {
        $state.go('brand', {id : id});
    };



});
