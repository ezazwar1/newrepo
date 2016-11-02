myApp
.controller('FeedCtrl', function($scope, $state, $stateParams,$ionicGesture, $ionicPlatform,Feed, Store, Brand, Collections, GoFromDiscover, User, Likes, $ionicScrollDelegate, $timeout, $ionicSlideBoxDelegate) {

    //init
    $scope.showReturn();
    $scope.setPageEvent(true);

    //pager
    $scope.offset = 0;
    $scope.max = 5;
    $scope.feedUp = true;
    $scope.feed = [];
    $scope.begin = false;


    //Params url
    var controller = decodeURIComponent($stateParams.controller);
    var current =  $stateParams.current ;


    //Get params from url

    $scope.offset = parseInt(current);

    //Feed Action
    $scope.getFeed = function(current){

        var options = $stateParams.options + '&offset=' + current + '&page_size=' + $scope.max;

        GoFromDiscover.get(controller, options).then(function(resp) {
            if ($scope.offset == 0){
                $scope.begin = true;
            } else {
                $scope.begin = false;
            }

            if (resp.length < 5) {
                $scope.feed = $scope.feed.concat(resp);
            }
            else if (resp.length > 0) {
                $scope.feed = resp;
                $scope.offset += $scope.max;
            }



            angular.forEach($scope.feed, function(item , key) {
                if (item.element_type == 'brand') {
                    Brand.getCollections($scope.feed[key].id).then(function(collectionResp){
                        $scope.feed[key].collections = collectionResp;
                    });

                    if ($scope.feed[key].image_banner === null && ($scope.feed[key].medias.length > 0)) {
                        $scope.feed[key].image__large = $scope.feed[key].medias[0].image__large;
                    }
                } else if (item.element_type == 'store') {
                    Store.getBrands($scope.feed[key].id).then(function(storeBrandsResp) {
                        $scope.feed[key].brands = storeBrandsResp;
                    });
                    if ($scope.feed[key].image_banner === null && ($scope.feed[key].medias.length > 0)) {
                        $scope.feed[key].image__large = $scope.feed[key].medias[0].image__large;
                    }
                } else if (item.element_type == 'news') {
                    Feed.getById($scope.feed[key].id).then(function(newsResp) {
                        $scope.feed[key].content = newsResp.content;
                    });
                    var date = $scope.feed[key].created.split(' ');
                    var dateNews = new Date(date[0]);
                    $scope.feed[key].dateNews = dateNews.toISOString();
                } else if (item.element_type == 'collection') {
                    Collections.getProducts($scope.feed[key].id).then(function(productsResp) {
                       $scope.feed[key].products = productsResp;
                    });
                } else if (item.element_type == 'profile') {
                    User.getLikes($scope.feed[key].id).then(function(likesResp){
                        $scope.feed[key].likes = likesResp;
                        User.getUserBoards($scope.feed[key].id).then(function(boardsResp){
                            $scope.feed[key].boards = boardsResp;
                        });
                        Likes.getLikesByExcludingAndUserId(
                            $scope.feed[key].id,
                            'exclude-news', '1',
                            'exclude-collection', '1',
                            'exclude-product', '1',
                            'exclude-profile', '1',
                            'exclude-selection', '1')
                        .then(function(excludedLikesResp){
                            $scope.feed[key].brands = excludedLikesResp;
                        });
                        Likes.getLikesCountByExcludingAndUserId(
                            $scope.feed[key].id,
                            'exclude-news', '1',
                            'exclude-collection', '1',
                            'exclude-product', '1',
                            'exclude-brand', '1',
                            'exclude-selection', '1')
                        .then(function(resp){
                            $scope.feed[key].followings = resp;
                        });
                    });
                } else if (item.element_type == 'product') {
                    Brand.getById($scope.feed[key].collection.brand.id).then(function(brandResp) {
                        if (brandResp.image_banner === null && (brandResp.medias.length > 0)) {
                            brandResp.image__thumbnail = brandResp.medias[0].image__thumbnail;
                        }
                        $scope.feed[key].brand_full = brandResp;
                    });

                    Collections.getById($scope.feed[key].collection.id).then(function(collectionResp) {
                        $scope.feed[key].collection_full = collectionResp;
                    });
                }

            });




            $scope.slideUpdate();

        }, function(error) {
            console.error('Unable to feed', error);
        });
    };
    $scope.getFeed(current);


    $scope.goCollection = function(id) {
        $state.go('collection', {id : id});
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
                if ($scope.feed.length > 5 ) {
                     $ionicSlideBoxDelegate.slide(6, 10);
                } else {
                    if ( $scope.feedUp ) {
                        $ionicSlideBoxDelegate.slide(1, 10);
                    } else {
                        $ionicSlideBoxDelegate.slide($scope.max, 10);
                    }
                }
            }, 400);
        });
    };



    //Load Previous/Next Feed
    $scope.slideChanged = function(index){
        //next
        if ((index == $scope.feed.length + 1) && $scope.feed.length == 5) {
            $scope.getFeed($scope.offset);
            $scope.feedUp = true;

        }
        //previous
        if (index == 0) {
             if ($scope.begin) {
                $ionicSlideBoxDelegate.slide(1, 10);
            } else {
                $scope.offset -= 2 * $scope.max;
                $scope.feedUp = false;
                if ($scope.offset < 0) {
                    $scope.offset = 0;
                }
                $scope.getFeed($scope.offset);
            }
        }
        $scope.setCurrentItem($scope.feed[($ionicSlideBoxDelegate.currentIndex() - 1)]);
    };

});
