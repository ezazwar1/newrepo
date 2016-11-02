myApp
.controller('CollectionCtrl', function($scope, $state, $stateParams, $ionicPlatform, $ionicGesture, Collections) {

    $scope.showReturn();
    $scope.setPageEvent(true);

    Collections.getProducts($stateParams.id).then(function(productsResp) {
        $scope.products = productsResp;
        $scope.initView();

        Collections.getById($stateParams.id).then(function(resp) {
            $scope.collection = resp;
            $scope.setCurrentItem($scope.collection);
            console.log($scope.collection.title);
        });

    });



    $scope.goProduct = function(id) {
        $state.go('product', {id : id});
    };

});
