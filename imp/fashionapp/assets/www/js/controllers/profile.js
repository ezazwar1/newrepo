myApp
.controller('EditProfileCtrl', function($scope, $stateParams, Profile, User, $state) {
    $scope.setPageEvent(false);
    $scope.changeMenuLabel('profile');
    $scope.showReturn();

    $scope.civilities = [{id: 1, label: 'Mrs.'},{id:3, label: 'Mr.'}];

    $scope.user = $scope.profile;
    $scope.user.avatar_base64 = '';
    $scope.user.civ_id = 3;

    Profile.getTypes().then(function(resp){
        $scope.types = resp;
    });
    Profile.getCountries().then(function(resp){
        $scope.countries = resp;
    });

    $scope.update = function(user) {
        Profile.update($scope.user).then(function(resp){
            if (resp.status === true) {
                $scope.user = resp.info.updated_profile;
                $scope.setProfile(resp.info.updated_profile);
                $state.go('myprofile');
            } else {
                navigator.notification.alert(
                    resp.info.errors.toString(),
                    null,
                    'Edit my profile',
                    'Try again'
                );
            }
        });
    };

    $scope.changeAvatar = function(){
        navigator.camera.getPicture(function(imageData){
            $scope.user.avatar_base64 = imageData;
            document.querySelector('#avatar-image').style.backgroundImage = "url('data:image/jpg;base64," + imageData + "')";
        }, function(message){
           //to do handle errors
        }, { quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
            targetWidth: 500
        });
    };

});

myApp
.controller('ProfileCtrl', function($scope, $stateParams, $timeout, Profile, User, Likes, $ionicScrollDelegate) {

    // $scope.showReturn();
    $scope.setPageEvent(false);

    $scope.offset = 0;
    $scope.max = 20;

    $scope.user = {};
    $scope.isMine = false;

    if (parseInt($stateParams.id) > 0) {
        $scope.showReturn();

        User.getById($stateParams.id).then(function(resp){
            $scope.user = resp;
            $scope.initView();
            User.getLikes($stateParams.id).then(function(resp){
                angular.forEach(resp, function(item , key) {
                    if (item.element_type == 'brand' || item.element_type == 'store' ) {
                        if (resp[key].image === null && (resp[key].medias.length > 0)) {
                            resp[key].image__thumbnail = resp[key].medias[0].image__thumbnail;
                        }
                    }
                });

                $scope.user.likes = resp;
                $scope.setCurrentItem($scope.user);
                $scope.setPageEvent(true);

                User.getUserBoards($stateParams.id).then(function(boardsResp){
                    $scope.user.boards = boardsResp;
                });

                Likes.getLikesByExcludingAndUserId(
                    $stateParams.id,
                    'exclude-news', '1',
                    'exclude-collection', '1',
                    'exclude-product', '1',
                    'exclude-profile', '1',
                    'exclude-selection', '1')
                .then(function(excludedLikesResp){
                    $scope.user.brands = excludedLikesResp;
                });

                Likes.getLikesCountByExcludingAndUserId(
                    $stateParams.id,
                    'exclude-news', '1',
                    'exclude-collection', '1',
                    'exclude-product', '1',
                    'exclude-brand', '1',
                    'exclude-selection', '1')
                .then(function(resp){
                    $scope.user.followings = resp;
                });
            });
        });
    } 
    $scope.moreItem = function(){

        $scope.isLoading = true;

        $scope.offset = $scope.offset + $scope.max;

        Profile.getLikes($scope.offset).then(function(resp){
            angular.forEach(resp, function(item , key) {
                if (item.element_type == 'brand' || item.element_type == 'store' ) {
                    if (resp[key].image === null && (resp[key].medias.length > 0)) {
                        resp[key].image__thumbnail = resp[key].medias[0].image__thumbnail;
                    }
                }
            });

            $scope.profile.likes = $scope.profile.likes.concat(resp);

            $scope.isLoading = false;
            $timeout(function(){
                $ionicScrollDelegate.$getByHandle('scrollList').resize();
            }, 100);

        });
    };

});


myApp
.controller('MyProfileCtrl', function($scope, $stateParams, $state, $timeout, Profile, User, Likes, $ionicScrollDelegate) {

    // $scope.showReturn();
    $scope.setPageEvent(false);

    $scope.offset = 0;
    $scope.max = 20;

    $scope.me = $scope.profile;
    $scope.isMine = true;

    $scope.changeMenuLabel('profile');

    $scope.activeZone = ($stateParams.tab === null || $stateParams.tab === '') ? '#zone2' : '#zone' + $stateParams.tab;
    $scope.activeTab = ($stateParams.tab === null || $stateParams.tab === '') ? '#tab2' : '#tab' + $stateParams.tab;

    [].forEach.call(document.querySelectorAll('.tab-content'), function(tab) {
        tab.classList.add('hide');
    });

    $timeout( function() {
        document.querySelector($scope.activeZone).classList.remove('hide');
        [].forEach.call(document.querySelectorAll('.bts-tabs li'), function(li) {
            li.classList.remove('active');
        });
        document.querySelector($scope.activeTab).classList.add('active');
    }, 200);

        

    Profile.getLikes().then(function(resp){
        angular.forEach(resp, function(item , key) {
            if (item.element_type == 'brand' || item.element_type == 'store' ) {
                if (resp[key].image === null && (resp[key].medias.length > 0)) {
                    resp[key].image__thumbnail = resp[key].medias[0].image__thumbnail;
                }
            }
        });

        $scope.profile.likes = resp;
        if ($scope.profile.img_banner === null) {
            $scope.profile.image__thumbnail = '';
        }

        Profile.getBoards().then(function(boardsResp){
            $scope.me.boards = boardsResp;
        });

        Likes.getLikesByExcluding(
            'exclude-news', '1',
            'exclude-collection', '1',
            'exclude-product', '1',
            'exclude-profile', '1',
            'exclude-selection', '1')
        .then(function(excludedLikesResp){
            $scope.me.brands = excludedLikesResp;
        });
    });
    

    $scope.moreItem = function(){

        $scope.isLoading = true;

        $scope.offset = $scope.offset + $scope.max;

        Profile.getLikes($scope.offset).then(function(resp){
            angular.forEach(resp, function(item , key) {
                if (item.element_type == 'brand' || item.element_type == 'store' ) {
                    if (resp[key].image === null && (resp[key].medias.length > 0)) {
                        resp[key].image__thumbnail = resp[key].medias[0].image__thumbnail;
                    }
                }
            });

            $scope.profile.likes = $scope.profile.likes.concat(resp);

            $scope.isLoading = false;
            $timeout(function(){
                $ionicScrollDelegate.$getByHandle('scrollList').resize();
            }, 100);

        });
    };

    $scope.goTab = function(tab) {
        $state.go('myprofile', {tab : tab});
    };

});

myApp
.controller('PageCtrl', function($scope, Profile) {
    $scope.setPageEvent(false);
    $scope.hideReturn();
    $scope.changeMenuLabel('about');

});
myApp
.controller('HelpCtrl', function($scope, Profile) {
    $scope.setPageEvent(false);
    $scope.changeMenuLabel('help');

});

myApp
.controller('SeenCtrl', function($scope, Profile, $timeout) {

    $scope.offset = 0;
    $scope.max = 20;

    $scope.hideReturn();
    $scope.setPageEvent(false);
    $scope.changeMenuLabel('seen');

    Profile.getLikes().then(function(resp){

        angular.forEach(resp, function(item , key) {
            if (item.element_type == 'brand' || item.element_type == 'store' ) {
                if (resp[key].image === null && (resp[key].medias.length > 0)) {
                    resp[key].image__thumbnail = resp[key].medias[0].image__thumbnail;
                }
            }
        });

        $scope.profile.likes = resp;

    }, function(error) {
        console.error('Unable to find profile likes', error);
    });


    $scope.moreItem = function(){

        $scope.isLoading = true;

        $scope.offset = $scope.offset + $scope.max;

        Profile.getLikes($scope.offset).then(function(resp){
            angular.forEach(resp, function(item , key) {
                if (item.element_type == 'brand' || item.element_type == 'store' ) {
                    if (resp[key].image === null && (resp[key].medias.length > 0)) {
                        resp[key].image__thumbnail = resp[key].medias[0].image__thumbnail;
                    }
                }
            });

            $scope.profile.likes = $scope.profile.likes.concat(resp);

            $scope.isLoading = false;
            $timeout(function(){
                $ionicScrollDelegate.$getByHandle('scrollList').resize();
            }, 100);

        });
    };



    $scope.isBrand = function(like){
        return like.hasOwnProperty('brand');
    };
    $scope.isCollection = function(like){
        return like.hasOwnProperty('collection');
    };
    $scope.isProduct = function(like){
        return like.hasOwnProperty('product');
    };

});
