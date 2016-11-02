myApp
.controller('ProductCategoryCtrl', function($scope, $state, $ionicGesture, $stateParams, $ionicPlatform, Product) {

    $scope.showReturn();
    $scope.setPageEvent(true);

    Product.getTypes().then(function(typesResp){
        $scope.productTypes = typesResp;
    });
});
