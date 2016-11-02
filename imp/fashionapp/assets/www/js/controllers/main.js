myApp
.controller('MainCtrl', function($scope, Feed, Likes, ImageTool,$ionicGesture, $timeout, GoFromDiscover, $ionicSlideBoxDelegate, $ionicScrollDelegate, Storage, $ionicPlatform) {

    $scope.showMenu();
    $scope.hideReturn();

    $scope.setPageEvent(true);
    $scope.feedUp = true;
    $scope.changeMenuLabel('main');


    //pager
    $scope.offset = 0;
    $scope.max = 5;

    //tuto
    // if(Storage.get('tutorialOk') === null){
    //     $scope.up('tuto');
    //     Storage.save('tutorialOk', 'ok');
    // }

    // disable back button on android
    function onHardwareBackButton(e) {
        e.preventDefault();
    }

    $ionicPlatform.registerBackButtonAction(onHardwareBackButton, 100);


    //Feed Action
    $scope.getFeed = function(current){

        var options =  'offset=' + current + '&page_size=' + $scope.max;

        GoFromDiscover.get('feed', options).then(function(resp) {
            $scope.feed = resp;

            angular.forEach(resp, function(item , key) {
                if (item.element_type == 'brand') {
                    Brand.getCollections($scope.feed[key].id).then(function(collectionResp){
                        console.log('resp collections ' + collectionResp);
                        $scope.feed[key].collections = collectionResp;
                    });
                } else if (item.element_type == 'store') {
                    Store.getBrands($scope.feed[key].id).then(function(storeBrandsResp) {
                        $scope.feed[key].brands = storeBrandsResp;
                    });
                } else if (item.element_type == 'news') {
                    Feed.getById($scope.feed[key].id).then(function(resp) {
                        $scope.feed[key].content = resp.content;
                    });
                    var date = $scope.feed[key].created.split(' ');
                    var dateNews = new Date(date[0]);
                    $scope.feed[key].dateNews = dateNews.toISOString();

                } else if (item.element_type == 'collections') {
                    Collections.getProducts($scope.feed[key].id).then(function(productsResp) {
                       $scope.feed[key].products = productsResp;
                    });
                } else if (item.element_type == 'product') {
                    Brand.getById($scope.feed[key].id).then(function(brandResp) {
                        $scope.feed[key].brand_full = brandResp;
                    });
                } else if (item.element_type == 'store') {

                }

            });


            $scope.offset += $scope.max;
            $scope.slideUpdate();

        }, function(error) {
            console.error('Unable to feed', error);
            navigator.notification.alert(
                'Connection problem',
                null,
                'Error',
                'Try again later'
            );
        });
    };
    $scope.getFeed($scope.offset);


    $scope.goCollection = function(id) {
        $state.go('collectionProducts', {id : id});
    };

    $scope.goBrand = function(id) {
        $state.go('brand', {id : id});
    };

    //Update slide box
    $scope.slideUpdate = function(){

        //init
        $scope.isTitleTop = false;
        $scope.isMenuVisible = true;

        $timeout( function() {
            $ionicSlideBoxDelegate.update();

            for (var i = $scope.feed.length - 1; i >= 0; i--) {
                //scroll to top
                $ionicScrollDelegate.$getByHandle('scroll' + i).scrollTop();

                //init view feed
                document.querySelector("#title" + i).style.webkitTransform = 'translateY(-100%)';
                document.querySelector("#content" + i + " h1").style.display = 'table';

                var content = document.querySelector("#content" + i);
                content.style.webkitTransform = 'translateY(0)';
                content.style.height = '100%';

                var contentElement  = angular.element(content);

                $scope.likeElement = '';

                //show menu
                document.querySelector("#nav").style.opacity = 1;
            }

        }, 50).then(function() {
            $scope.initView();

            $timeout( function() {
                if ( $scope.feedUp ) {
                    $ionicSlideBoxDelegate.slide(1, 10);
                } else {
                    $ionicSlideBoxDelegate.slide($scope.max, 10);
                }
            }, 400);
        });
    };


    //Load Previous/Next Feed
    $scope.slideChanged = function(index){

        //next
        if (index == $scope.feed.length + 1) {
            $scope.getFeed($scope.offset);
            console.log($scope.offset);
            $scope.feedUp = true;

        }
        //previous
        if (index === 0) {
            if ($scope.offset == 5 ) {
                $ionicSlideBoxDelegate.slide(1, 10);
            } else {
                $scope.offset -= 2 * $scope.max;
                if ($scope.offset < 0) {
                    $scope.offset = 0;
                }
                $scope.feedUp = false;

                $scope.getFeed($scope.offset);
            }
        }

        $scope.setCurrentItem($scope.feed[($ionicSlideBoxDelegate.currentIndex() - 1)]);
    };
});
