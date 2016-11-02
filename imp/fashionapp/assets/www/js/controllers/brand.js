myApp
.controller('BrandCtrl', function($scope, $state, $stateParams, $ionicPlatform, $ionicGesture, Brand, Collections) {

    $scope.showReturn();
    $scope.setPageEvent(true);

    Brand.getById($stateParams.id).then(function(brandResp) {

        if (brandResp.image_banner === null && (brandResp.medias.length > 0)) {
            brandResp.image__large = brandResp.medias[0].image__large;
        }

        $scope.brand = brandResp;

        $scope.initView();

        Brand.getCollections($stateParams.id).then(function(collectionResp){
            $scope.collections = collectionResp;
        });

        $scope.setCurrentItem($scope.brand);

    });


    $scope.goCollection = function(id) {
        $state.go('collection', {id : id});
    };


});
