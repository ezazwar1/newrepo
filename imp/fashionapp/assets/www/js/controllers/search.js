myApp
.controller('SearchCtrl', function($scope, $state, $timeout, $stateParams, $ionicPlatform, $ionicScrollDelegate, Search, Autocomplete) {


    $scope.search = decodeURIComponent($stateParams.tag);
    $scope.tag = decodeURIComponent($stateParams.tag);
    $scope.type = $stateParams.type;

    $scope.showReturn();
    $scope.setPageEvent(false);


    $scope.goProduct = function(id) {
        $state.go('product', {id : id});
    };

    $scope.goBrand = function(id) {
        $state.go('brand', {id : id});
    };

    $scope.goStore = function(id) {
        $state.go('store', {id : id});
    };

    $scope.goProfile = function(id) {
        $state.go('profile', {id : id});
    };

    $scope.goCollection = function(id) {
        $state.go('collection', {id : id});
    };

    Search.get($scope.search).then(function(dataResp) {
        angular.forEach(dataResp.brands, function(item , key) {
            if (dataResp.brands[key].image === null && (dataResp.brands[key].medias.length > 0)) {
                dataResp.brands[key].image__thumbnail = dataResp.brands[key].medias[0].image__thumbnail;
            }
        });
        angular.forEach(dataResp.stores, function(item , key) {
            if (dataResp.stores[key].image === null && (dataResp.stores[key].medias.length > 0)) {
                dataResp.stores[key].image__thumbnail = dataResp.stores[key].medias[0].image__thumbnail;
            }
        });

        var types = new Array('brands','feeds','profiles','products','collections');
        if (types.indexOf($scope.type) != -1){
            $scope.items = {};
            $scope.items[$scope.type] = dataResp[$scope.type];
        } else {
            $scope.items = dataResp;
        }

    });


    //search
    $scope.searchText = '';
    $scope.searchResult = [];


    $scope.seeMoreSearch = function(id) {
        $scope.setLastList(undefined);

        $state.go('list', {
            controller : encodeURIComponent(id + '/search'),
            options : 's=' + $scope.search,
            hasfilter : 'false'
        });
    };
});
