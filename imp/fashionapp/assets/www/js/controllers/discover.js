myApp
.controller('DiscoverCtrl', function($scope, $state, $stateParams, $ionicPlatform, $location, Discover, Search, Autocomplete) {

    $scope.hideReturn();
    $scope.showMenu();
    $scope.setPageEvent(false);
    $scope.initForm();
    $scope.changeMenuLabel('discover');


    Discover.get().then(function(discoverResp) {
        $scope.discover = discoverResp;

        angular.forEach(discoverResp, function(value, key1) {

            $scope.currentController = value.query.controller;

            var link = value.query.controller;

            angular.forEach(value.query.args, function(value, key) {
                link = $scope.currentController + '?' + key + '=' + value;
            });
            $scope.discover[key1].link = link;
        });
    });

    $scope.goFromDiscover = function(params, picture) {
        var split = params.split("?");

        $scope.setLastList(undefined);
        $scope.setDiscoverImage(picture);

        $state.go('list', {
            controller : encodeURIComponent(split[0]),
            options : split [1],
            hasfilter : 'true'
        });
    };


    //search
    $scope.searchText = '';
    $scope.searchResult = [];

    $scope.search = function() {
        if ($scope.searchText !== '') {
            document.querySelector('.result').style.webkitTransform = 'translateY(0)';
            document.querySelector('.result').style.opacity = '1';
            document.querySelector('.search .bts-close').classList.remove('hide');
            document.querySelector('.search .bts-search').classList.add('hide');

            Autocomplete.get($scope.searchText).then(function(searchResp) {
                if (searchResp.length > 0) {
                    $scope.searchResult = searchResp;
                    $scope.searchResult.unshift({tag : $scope.searchText});
                } else {
                    $scope.searchResult = [{
                        tag: $scope.searchText
                    }];
                }

            });
        } else {
            $scope.searchResult = {};
            document.querySelector('.result').style.webkitTransform = 'translateY(-100%)';
            document.querySelector('.result').style.opacity = '0';
            document.querySelector('.search .bts-close').classList.add('hide');
            document.querySelector('.search .bts-search').classList.remove('hide');
            document.querySelector('.search input').blur();
        }
    };

    $scope.searchData = function(data){
        data = encodeURIComponent(data);
        
        $state.go('search', {
            tag : data
        });
    };

    $scope.emptySearch = function(){
        $scope.searchResult = {};
        document.querySelector('.result').style.webkitTransform = 'translateY(-100%)';
        document.querySelector('.result').style.opacity = '0';
        document.querySelector('.search .bts-close').classList.add('hide');
        document.querySelector('.search .bts-search').classList.remove('hide');
        document.querySelector('body .discover-home').focus();
        $scope.searchText = '';
    };

});
