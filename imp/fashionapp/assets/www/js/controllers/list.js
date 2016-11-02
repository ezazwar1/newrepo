myApp
.controller('ListCtrl', function($scope, $state, $stateParams, Product, $ionicPlatform, $ionicScrollDelegate, GoFromDiscover, Search, Autocomplete, Collections, $timeout) {

    $scope.offset = 0;
    $scope.max = 20;
    $scope.order = {label : 'Most recent', type: 'recent-desc'};
    $scope.paramsList = {
        order: $scope.order,
        productLevel: 0,
        filterValue: 0
    };

    if ($stateParams.controller == 'brand' || $stateParams.controller == 'user') {
        $scope.orderList = [
            {label : 'Most recent', type: 'recent-desc'},
            {label : 'Name ascendant', type: 'alpha-asc'},
            {label : 'Name descendant', type: 'alpha-desc'},
            {label : 'Most follow', type: 'liked-desc'}
        ];
    }else{
        $scope.orderList = [
            {label : 'Most recent', type: 'recent-desc'},
            {label : 'Name ascendant', type: 'alpha-asc'},
            {label : 'Name descendant', type: 'alpha-desc'},
            {label : 'Most seen', type: 'liked-desc'}
        ];
    }


    $scope.items = null;
    $scope.isLoading = false;
    $scope.isProductDiscover = false;

    var controller = decodeURIComponent($stateParams.controller);
    var options =  $stateParams.options ;

    $scope.showReturn();
    $scope.hasfilter = $stateParams.hasfilter;
    $scope.setPageEvent(false);
    $scope.initForm();



    $scope.oldList = $scope.getLastList();
    $scope.oldScrollPosition = $scope.getOldScrollPosition();
    $scope.backImage = $scope.getDiscoverImage();

    $scope.showProductCategory = function(){
        $scope.up('product-category');
        Product.getTypes().then(function(typesResp){
            $scope.productTypes = typesResp;
        });
    };

    if (controller === 'product' && $scope.oldList === undefined) {
        $scope.isProductDiscover = true;
        $scope.showProductCategory();
    }

    //Check si une ancienne liste existe, sinon on l affiche
    if ($scope.oldList === undefined ) {
        GoFromDiscover.get(controller, '&page_size=' + $scope.max + '&' + options).then(function(resp) {
            $scope.showReturn();
            $scope.paramsList.order = $scope.order;

            $scope.setParamsList($scope.paramsList);

            angular.forEach(resp, function(item , key) {
                if (item.element_type == 'brand' || item.element_type == 'store' ) {
                    if (resp[key].image_banner === null && (resp[key].medias.length > 0)) {
                        resp[key].image__thumbnail = resp[key].medias[0].image__thumbnail;
                    }
                }
            });

            $scope.items = resp;

            $scope.setLastList($scope.items);

            $timeout(function(){
                $ionicScrollDelegate.$getByHandle('scrollList').resize();
            }, 100);
        });

    } else {
        $scope.items = $scope.oldList;
        $scope.offset = $scope.items.length - $scope.max;

        $scope.paramsList = $scope.getParamsList();
        $scope.order = $scope.paramsList.order;
        $scope.productLevel = $scope.paramsList.productLevel;
        $scope.filterValue = $scope.paramsList.filterValue;

        $timeout(function() {
            $ionicScrollDelegate.scrollTo(0, $scope.oldScrollPosition.top);
        },200);
    }

    $scope.orderBy = function(order) {
        $scope.order = order;
        $scope.close('filters');

        $scope.items = null;
        $scope.offset = 0;

        $scope.paramsList.order = $scope.order;

        $scope.setParamsList($scope.paramsList);

        GoFromDiscover.get(controller, '&' + $stateParams.options + '&page_size=' + $scope.max  + '&order=' + $scope.order.type + '&filter-1=producttype-level' + $scope.productLevel + '&filtervalue-1=' + $scope.filterValue).then(function(resp) {
            $scope.showReturn();
            angular.forEach(resp, function(item , key) {
                if (item.element_type == 'brand' || item.element_type == 'store' ) {
                    if (resp[key].image_banner === null && (resp[key].medias.length > 0)) {
                        resp[key].image__thumbnail = resp[key].medias[0].image__thumbnail;
                    }
                }
            });

            $scope.items = resp;
            $scope.setLastList(resp);
            $ionicScrollDelegate.scrollTo(0,0);

        });

    };

    $scope.goProduct = function(id) {
        $state.go('product', {id : id});
    };

    $scope.goBrand = function(id) {
        $state.go('brand', {id : id});
    };

    $scope.goCollection = function(id) {
        $state.go('collection', {id : id});
    };

    $scope.moreItem = function(){

        $scope.isLoading = true;

        $scope.offset = $scope.offset + $scope.max;


        if ($scope.productLevel && $scope.filterValue) {
            options =  'offset=' + $scope.items.length + '&order=' + $scope.order.type + '&page_size=' + $scope.max + '&' + $stateParams.options + 'filter-1=producttype-level' + $scope.productLevel + '&filtervalue-1=' + $scope.filterValue;
        }else{
            options =  'offset=' + $scope.items.length + '&order=' + $scope.order.type + '&page_size=' + $scope.max + '&' + $stateParams.options;
        }


        GoFromDiscover.get(controller, options).then(function(resp) {
            angular.forEach(resp, function(item , key) {
                if (item.element_type == 'brand' || item.element_type == 'store' ) {
                    if (resp[key].image_banner === null && (resp[key].medias.length > 0)) {
                        resp[key].image__thumbnail = resp[key].medias[0].image__thumbnail;
                    }
                }
            });

            $scope.items = $scope.items.concat(resp);
            $scope.setLastList($scope.items);

            $scope.isLoading = false;
            $timeout(function(){
                $ionicScrollDelegate.$getByHandle('scrollList').resize();
            }, 100);
        });
    };


    $scope.goFeed = function(id) {

        $scope.setOldScrollPosition($ionicScrollDelegate.$getByHandle('scrollList').getScrollPosition());

        $state.go('feed', {
            controller : encodeURIComponent(controller),
            current : id,
            options : options + '&order=' + $scope.order.type + '&filter-1=producttype-level' + $scope.productLevel + '&filtervalue-1=' + $scope.filterValue
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
            if (document.querySelector('.filter') !== undefined) {
                document.querySelector('.filter').style.opacity = '0';
            }

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
            if (document.querySelector('.filter') !== undefined) {
                document.querySelector('.filter').style.opacity = '1';
            }
        }
    };

    $scope.searchData = function(data){
        data = encodeURIComponent(data);

        if (controller.indexOf('brand') > -1) {
            $state.go('search', {
                tag : data,
                type : 'brands'
            });
        }
        else if (controller.indexOf('product') > -1) {
            $state.go('search', {
                tag : data,
                type : 'products'
            });
        }
        else if (controller.indexOf('user') > -1) {
            $state.go('search', {
                tag : data,
                type : 'profiles'
            });
        }
        else if (controller.indexOf('collection') > -1) {
            $state.go('search', {
                tag : data,
                type : 'collections'
            });
        } else {
            $state.go('search', {
                tag : data
            });
        }
    };

    $scope.emptySearch = function(){
        $scope.searchResult = {};
        document.querySelector('.result').style.webkitTransform = 'translateY(-100%)';
        document.querySelector('.result').style.opacity = '0';
        document.querySelector('.filter').style.opacity = '1';
        document.querySelector('.search .bts-close').classList.add('hide');
        document.querySelector('.search .bts-search').classList.remove('hide');
        document.querySelector('body').focus();
        $scope.searchText = '';
    };

    $scope.isSearchVisible = true;
    $scope.animate = function(){
        var scrollValue = $ionicScrollDelegate.$getByHandle('scrollList').getScrollPosition().top;

        if (scrollValue < 0){
            scrollValue = 0;
        }

        if ((scrollValue > 10) && $scope.isSearchVisible) {
            if (document.querySelector('.filter') !== undefined) {
                document.querySelector(".filter").style.webkitTransform = 'translateY(-53px)';
            }
            $scope.isSearchVisible = false;
        } else if ((scrollValue < 10) && !$scope.isSearchVisible) {
            if (document.querySelector('.filter') !== undefined) {
                document.querySelector(".filter").style.webkitTransform = 'translateX(0)';
            }
            $scope.isSearchVisible = true;
        }
    };

    $scope.productsByCategory = function(level, categoryId) {
        $scope.close('product-category');
        $scope.close('filters');
        $scope.items = null;

        $scope.productLevel = level;
        $scope.paramsList.productLevel = $scope.productLevel;
        $scope.filterValue = categoryId;
        $scope.paramsList.filterValue = $scope.filterValue;


        options = 'filter-1=producttype-level' + level + '&filtervalue-1=' + categoryId;
        GoFromDiscover.get(controller, '&page_size=' + $scope.max + '&' + options).then(function(resp) {
            $scope.showReturn();

            $scope.paramsList.order = $scope.order;
            $scope.paramsList.productLevel = $scope.productLevel;
            $scope.paramsList.filterValue = $scope.filterValue;

            $scope.setParamsList($scope.paramsList);

            angular.forEach(resp, function(item , key) {
                if (item.element_type == 'brand' || item.element_type == 'store' ) {
                    if (resp[key].image_banner === null && (resp[key].medias.length > 0)) {
                        resp[key].image__thumbnail = resp[key].medias[0].image__thumbnail;
                    }
                }
            });


            $scope.items = resp;

            $scope.setLastList($scope.items);

            $timeout(function(){
                $ionicScrollDelegate.$getByHandle('scrollList').resize();
            }, 100);
        });
    };

});
