var myApp = angular.module('ionicApp', ['ionic', 'APIServices']);

myApp.filter('dateToISO', function() {
    return function(input) {
        input = new Date(input).toISOString();
        return input;
    };
});

myApp.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('intro', {
            url: '/intro',
            templateUrl: 'templates/intro.html',
            controller: 'IntroCtrl'
        })

        .state('discover', {
            url: '/discover',
            templateUrl: 'templates/discover.html',
            controller: 'DiscoverCtrl'
        })

        .state('brand', {
            url: '/brand/:id',
            templateUrl: 'templates/brand.html',
            controller: 'BrandCtrl'
        })

        .state('product', {
            url: '/product/:id',
            templateUrl: 'templates/product.html',
            controller: 'ProductCtrl'
        })

        .state('product-category', {
            url: '/product-category',
            templateUrl: 'templates/product-category.html',
            controller: 'ProductCategoryCtrl'
        })

        .state('variant', {
            url: '/product/:id',
            templateUrl: 'templates/product.html',
            controller: 'ProductCtrl'
        })

        .state('collection', {
            url: '/collection/:id/products',
            templateUrl: 'templates/collection.html',
            controller: 'CollectionCtrl'
        })

        .state('main', {
            url: '/',
            templateUrl: 'templates/main.html',
            controller: 'MainCtrl'
        })

        .state('fb', {
            url: '/fb',
            templateUrl: 'templates/fb.html',
            controller: 'FbCtrl'
        })

        .state('search', {
            url: '/search-all/:tag/:type',
            templateUrl: 'templates/search.html',
            controller: 'SearchCtrl'
        })

        .state('seen', {
            url: '/seen',
            templateUrl: 'templates/seen.html',
            controller: 'SeenCtrl'
        })

        .state('profile', {
            url: '/profile/:id',
            templateUrl: 'templates/profile.html',
            controller: 'ProfileCtrl'
        })

        .state('myprofile', {
            url: '/myprofile/:tab',
            templateUrl: 'templates/myprofile.html',
            controller: 'MyProfileCtrl'
        })

        .state('selection', {
            url: '/selection/:id',
            templateUrl: 'templates/selection.html',
            controller: 'SelectionCtrl'
        })

        .state('edit-profile', {
            url: '/edit/profile',
            templateUrl: 'templates/profile-edit.html',
            controller: 'EditProfileCtrl'
        })

        .state('list', {
            url: '/list/:controller/:options/:hasfilter',
            templateUrl: 'templates/list.html',
            controller: 'ListCtrl'
        })

        .state('about', {
            url: '/about',
            templateUrl: 'templates/about.html',
            controller: 'PageCtrl'
        })

        .state('help', {
            url: '/help',
            templateUrl: 'templates/help.html',
            controller: 'HelpCtrl'
        })

        .state('feed', {
            url: '/feed/:controller/:current/:options',
            templateUrl: 'templates/feed.html',
            controller: 'FeedCtrl'
        })

        .state('news', {
            url: '/news/:id',
            templateUrl: 'templates/news.html',
            controller: 'NewsCtrl'
        })

        .state('activity', {
            url: '/activity',
            templateUrl: 'templates/activity.html',
            controller: 'ActivityCtrl'
        })

        .state('contact', {
            url: '/contact',
            templateUrl: 'templates/contact.html',
            controller: 'ContactCtrl'
        });

    $urlRouterProvider.otherwise("/intro");

});

myApp.run(function($rootScope, $http, Api, Boards, Profile, Likes, Storage, $state, $timeout, $window, $ionicGesture, $ionicScrollDelegate) {
    //init
    $rootScope.transitionClass = "rl";

    //Animation
    $rootScope.togglePage = function(selector) {
        document.querySelector(selector).classList.toggle('show-page');
    };
    $rootScope.up = function(id) {
        document.querySelector('#' + id).classList.add('show-page');
    };

    $rootScope.close = function(id) {
       document.querySelector('#' + id).classList.remove('show-page');
    };

    $rootScope.selectTab = function(id){
        var tabs = document.querySelectorAll('.tab-content');
        [].forEach.call(tabs, function(tab) {
            tab.classList.add('hide');
        });

        var menu = document.querySelectorAll('.bts-tabs li');
        [].forEach.call(menu, function(li) {
            li.classList.remove('active');
        });

        document.querySelector('#tab' + id).classList.add('active');
        document.querySelector('#zone' + id).classList.remove('hide');
    };

    $rootScope.selectFeedTab = function(id, zone){
        var tabs = document.querySelectorAll(zone + ' .tab-content');
        [].forEach.call(tabs, function(tab) {
            tab.classList.add('hide');
        });

        var menu = document.querySelectorAll(zone + ' .bts-tabs li');
        [].forEach.call(menu, function(li) {
            li.classList.remove('active');
        });

        document.querySelector(zone +  ' #tab' + id).classList.add('active');
        document.querySelector(zone +  ' #zone' + id).classList.remove('hide');
    };

    //Login
    $rootScope.login = function(log) {
        Profile.login(log.email, log.password).then(function(resp) {
            if (resp.status) {
                //Storage
                Storage.save('login', log.email);
                Storage.save('pass', log.password);
                Storage.save('token', resp.info.token);

                Api.init(resp.info.token);

                //Profile
                $rootScope.getProfile();

            } else {
                navigator.notification.alert(
                    'Wrong login or password !',
                    null,
                    'Login',
                    'Try again'
                );
            }
        }, function(error) {
            console.error('Unable to log', error);
        });

    };

    $rootScope.retreivePassword = function(email) {
        var re       = /\S+@\S+\.\S+/;
        var validity = re.test(email);

        if (validity) {
            Profile.retreivePassword(email).then(function(resp) {
                navigator.notification.alert(
                    'Check your emails',
                    null,
                    null,
                    'OK'
                );
            });
        }else {
            navigator.notification.alert(
                'Wrong Email adress',
                null,
                null,
                'Try again'
            );
        }
    };

    $rootScope.saveUser = function(user) {

        Profile.register(user).then(function(resp) {
            if (resp.status) {
                console.log('Logged');

                //Storage
                Storage.save('login', user.email);
                Storage.save('pass', user.password);
                Storage.save('token', resp.info.token);

                Api.init(resp.info.token);

                //Profile
                $rootScope.getProfile();

            } else {
                navigator.notification.alert(
                    resp.info.errors.toString(),
                    null,
                    'Register',
                    'Try again'
                );
            }
        }, function(error) {
            console.error('Unable to register', error);
        });

    };

    $rootScope.logout = function() {
        Storage.remove('token');
        $state.go('intro');
    };

    $rootScope.getProfile = function(){
        Profile.get().then(function(resp){
            $rootScope.profile = resp;

            Profile.getLikes().then(function(resp){
                $rootScope.profile.likes = resp;
            });

            Profile.getLikesProfile().then(function(contactResp) {
                $rootScope.profile.contacts = contactResp;
            });

            //Go Feed Page
            $rootScope.addLikeEvent();
            $state.go('discover');
        }, function(error) {
            $state.go('intro');
        });

    };

    $rootScope.setProfile = function(user){
        $rootScope.profile = user;
    };

    $rootScope.getImage = function(url, type){
        ImageTool.getUrl({filename:url, module: type}).then(function(resp){
            console.log(resp.url);
            $rootScope.profile.avatar = resp.url;
        }, function(error) {
            console.error('Unable to find image', error);
        });
    };

    //Start
    if(Storage.get('token') === null){
        $state.go('intro');
    } else{
        Api.init(Storage.get('token'));
        $rootScope.getProfile();
    }


    //Menu
    $rootScope.toggleMenu = function(){
        document.querySelector("#nav").style.opacity = '0';
        document.querySelector("#menu").style.webkitTransform = 'translate3d(0,0,0)';
        document.querySelector("ion-view").style.webkitTransform = 'translate3d(85%,0,0)';
        document.querySelector("ion-view").style.position = 'fixed';
    };
    $rootScope.hideMenu = function(){
        document.querySelector("#menu").style.display = 'none';
        document.querySelector("#nav").style.display = 'none';
    };
    $rootScope.showMenu = function(){
        document.querySelector("#menu").style.display = 'block';
        document.querySelector("#nav").style.display = 'block';
        document.querySelector("#menu").addEventListener("touchmove", function(){
            $rootScope.closeMenu();
        }, false);
    };
    $rootScope.showReturn = function(){
        document.querySelector("#return").style.display = 'block';
    };
    $rootScope.hideReturn = function(){
        $rootScope.showMenu();
        document.querySelector("#return").style.display = 'none';
        $rootScope.transitionClass = "rl";
    };
    $rootScope.backPrevious = function(){
        $rootScope.transitionClass = "pop";
        $window.history.back();
    };

    $rootScope.reportEvent = function(event)  {
        console.log('event');
        $rootScope.closeMenu();
    };

    $rootScope.closeMenu = function()  {
        document.querySelector("#nav").style.opacity = '1';
        document.querySelector("#menu").style.webkitTransform = 'translate3d(-100%,0,0)';
        document.querySelector("ion-view").style.webkitTransform = 'translate3d(0,0,0)';
        document.querySelector('body').focus();
    };
    $rootScope.goMenu = function(url) {
        $rootScope.closeMenu();
        $state.go(url, {id : ''});
    };

    $rootScope.hideReturn();

    //Links
    $rootScope.go = function(url) {
        $state.go(url);
    };

    $rootScope.goId = function(url, id) {
        $state.go(url, {id : id});
    };

    $rootScope.sendFeed = function(controller,current,options){
        $state.go('feed', {
            controller : encodeURIComponent(controller),
            current : current,
            options : options
        });
    };

    $rootScope.menuItem = 'discover';
    $rootScope.changeMenuLabel = function(label) {
        $rootScope.menuItem = label;
    };

    $rootScope.$on("$locationChangeSuccess", function (event, next, current) {

        // current = current.slice( current.lastIndexOf('#')+1, current.length );
        // next =    next.slice( next.lastIndexOf('#')+1, next.length );

        var menuLi = document.querySelectorAll('#menu li');
        [].forEach.call(menuLi, function(el) {
            el.classList.remove('active');
            if ($rootScope.menuItem == el.getAttribute('data-menu')){
                el.classList.add('active');
            }
        });
    });

    //Animation
    $rootScope.scrolling = 0;
    $rootScope.isTitleTop = false;

    $rootScope.off = function(index) {
        var scrollValue = $ionicScrollDelegate.$getByHandle('scroll'+index).getScrollPosition().top;
        if (scrollValue < 0){
            scrollValue = 0;
        }
        //Calcul opacité
        var opacity = Math.abs(scrollValue/(0.8*screen.height));
        if (opacity > 0.7) {
            opacity = 0.7;
        } else if (opacity <= 0){
            opacity = 0;
        }

        //Evolution opacité du background du contenu au scroll

        document.querySelector('#content' + index).style.backgroundColor = 'rgba(0,0,0,' + opacity + ')';


        //Toggle Menu
        if ((scrollValue > (window.innerHeight - 200)) && $rootScope.isMenuVisible) {
           //hide nav
            document.querySelector("#nav").style.opacity = 0;
            $rootScope.isMenuVisible = false;

            //if exists hide return button
            if (document.querySelector("#return") != undefined) {
               document.querySelector("#return").style.opacity = '0';
            }

        } else if ((scrollValue < (window.innerHeight - 200)) && !$rootScope.isMenuVisible) {
            //show menu
            document.querySelector("#nav").style.opacity = 1;
            $rootScope.isMenuVisible = true;

            //show return
            document.querySelector("#return").style.opacity = '1';
        }

        //Accroche du titre en haut
        if ((scrollValue > (window.innerHeight - 100)) && !$rootScope.isMenuVisible) {
           $rootScope.openTopMenu(index);
           $ionicScrollDelegate.$getByHandle('scroll'+index).resize;

        } else if ((scrollValue < (window.innerHeight - 100)) && $rootScope.isTitleTop) {
            $rootScope.closeTopMenu(index);
        }

        //show brand if exists
        if (document.querySelector("#content" + index + " .avatarBrand") != undefined) {
            if ((Math.abs(scrollValue) / screen.height) > 0.1 && (Math.abs(scrollValue) / screen.height) < 0.6) {
                document.querySelector("#content" + index + " .avatarBrand").style.opacity = '1' ;
            } else {
                document.querySelector("#content" + index + " .avatarBrand").style.opacity = '0' ;
            }
        }

    };

    $rootScope.initView = function(){

        [].forEach.call(document.querySelectorAll('.news .content-scroll'), function(el) {
            el.style.webkitTransform = 'translate3d(0,' + (window.innerHeight - 499) + 'px,0)';
        });

        $timeout( function() {
            [].forEach.call(document.querySelectorAll('h1'), function(el) {
                el.style.width = '100%';
            });
            [].forEach.call(document.querySelectorAll('h1 span'), function(el) {
                el.style.width = '100%';
            });
            [].forEach.call(document.querySelectorAll('h1 small'), function(el) {
                el.style.width = '100%';
            });
        }, 200);
    };

    $rootScope.openTopMenu = function(index){
        //hide old title  - show top title
        document.querySelector("#content" + index + " h1").style.visibility = 'hidden';
        document.querySelector("#content" + index + " h1").style.height = '400px';
        document.querySelector("#content" + index + " .element").style.paddingTop = '0px';
        document.querySelector("#content" + index + " .element").style.paddingBottom = '100px';
        document.querySelector("#content" + index + " .scroll").style.backgroundColor = 'white';
        document.querySelector("#title" + index).style.webkitTransform = 'translateY(0)';
        document.querySelector("#content" + index).style.webkitTransform = 'translateY(100px)';
        //document.querySelector("#content" + index).style.height = (window.innerHeight - 100) + 'px';

        $rootScope.isTitleTop = true;
        //document.querySelector('#slide' + index).classList.add('top-menu');


        if (document.querySelector("#content" + index + " .avatarBrand") != undefined) {
            document.querySelector("#content" + index + " .avatarBrand").style.opacity = '0' ;
        }
    };

    $rootScope.closeTopMenu = function(index){
        //document.querySelector('#slide' + index).classList.remove('top-menu');
        //hide top title - show old title
        document.querySelector("#title" + index).style.webkitTransform = 'translateY(-100%)';
        document.querySelector("#content" + index + " h1").style.visibility = 'visible';
        document.querySelector("#content" + index + " .element").style.paddingTop = '0';
        document.querySelector("#content" + index + " .scroll").style.backgroundColor = 'transparent';
        document.querySelector("#content" + index + " .element").style.paddingBottom = '0px';
        document.querySelector("#content" + index + " h1").style.height = '500px';
        document.querySelector("#content" + index).style.webkitTransform = 'translateY(0)';
        //document.querySelector("#content" + index).style.height = '100%';
        $rootScope.isTitleTop = false;


    };

    $rootScope.scrollToTop = function(id) {
        $ionicScrollDelegate.$getByHandle(id).scrollTop();
    };

    $rootScope.seeMore = function(id) {
        [].forEach.call(document.querySelectorAll('#list' + id + ' .hide'), function(el) {
            el.classList.toggle('hide');
        });
        document.querySelector('#list' + id + ' .more-item').classList.toggle('hide');

        $timeout( function() {
            $ionicScrollDelegate.$getByHandle('scroll' + id).resize();
        },100);
    };

    //toggle button on click on top title
    $rootScope.isMenuVisible = true;
    $rootScope.toggleButton = function() {
        if ($rootScope.isMenuVisible) {
            document.querySelector("#nav").style.opacity = 0;
            $rootScope.isMenuVisible = false;
        } else {
            document.querySelector("#nav").style.opacity = 1;
            $rootScope.isMenuVisible = true;
        }
    };

    //modal
    $rootScope.modal = function(id) {
        document.querySelector('#bts-modal div.modal-content').innerHTML = document.querySelector('#' + id).innerHTML;
        $rootScope.togglePage('#bts-modal');
    };


    //share & like
    $rootScope.currentItem = {liked : '0'};

    $rootScope.setCurrentItem = function(item) {
        $rootScope.currentItem = item;
    };

    //Like
    $rootScope.like = function(){
        if ( $rootScope.currentItem.liked === '0') {
            $rootScope.currentItem.liked = '1';
        } else {
            $rootScope.currentItem.liked = '0';
        }

        Likes.toggle($rootScope.currentItem.element_type, $rootScope.currentItem.id).then(function(resp) {
            //to do le vert

        });
    };

    //show boards
    $rootScope.showBoards = function(){
        var form = document.querySelector("#boards-form");
        var share = document.querySelector(".like-content");

        var formState = getComputedStyle(form).display;
        var shareState = getComputedStyle(share).display;

        Profile.getBoards().then(function(boardsResp){
            $rootScope.boards = boardsResp;
        });

        if (formState == 'none' && shareState != 'none') {
            form.style.display = 'block';
            share.style.display = 'none';
        }else {
            form.style.display = 'none';
            share.style.display = 'block';
        }
    };

    //add to board
    $rootScope.addToBoard = function(board_id){
        Boards.addToBoard(board_id, $rootScope.currentItem.element_type, $rootScope.currentItem.id).then(function(resp){
            $rootScope.closeBoard();
            $rootScope.close('like');
        });
    };

    //new board
    $rootScope.showNewBoard = function(){
        document.querySelector('#boards-form').style.display = 'none';
        document.querySelector('#new-board-form').style.display = 'block';
    };

    //cancel board
    $rootScope.closeBoard = function(){
        document.querySelector('#boards-form').style.display = 'none';
        document.querySelector('#new-board-form').style.display = 'none';
        document.querySelector('#like-zone').style.display = 'block';
    };

    //add item to a on the fly created board
    $rootScope.createNewBoard = function(){
        Profile.createBoard($rootScope.boardform.title, $rootScope.boardform.content).then(function(resp){
            board_id = resp.info.created_selection.id;

            Boards.addToBoard(board_id, $rootScope.currentItem.element_type, $rootScope.currentItem.id).then(function(resp){
                $rootScope.closeBoard();
                $rootScope.close('like');
            });
        });
    };

    $rootScope.addToWishlistBoard = function(){
        Profile.getBoards().then(function(boardsResp){
            var userBoards = boardsResp;
            var totalBoards = boardsResp.length;
            var isWishlistBoardFound = false;
            var coverWishlist = "iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQCAMAAAC3Ycb+AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3ppVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0iMzc2RjBDQjczQjMyNDdCM0ZDMTA2RDhGOUY1MTM5NDUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OUU2N0U1RkEzNjZBMTFFNEExMUJCNTlFNDZGQkIxQkQiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OUU2N0U1RjkzNjZBMTFFNEExMUJCNTlFNDZGQkIxQkQiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowOTVjZmU4MC1kMTdlLTQ2NmEtODFhMy00YTQwMDA5NGJlMzIiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo4Zjc5MjQ2ZC03YTYyLTExNzctODllOC1mNDZhNmVlZmE3YmIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6VLJEIAAAAclBMVEXY2Nj5+vzX19f6+vz4+fv5+fv6+vrZ2dn6+/37+/35+fnX2djW1tb09PT5+/r4+vnX2NrW19nW2Nf7+/vY2Nry8vLx8fH3+Pr39/f4+Pjw8PDz8/Pu7/H19fXu7u7z8/X29/nY2dvY2tn29vb09ffX19k1U8jOAAAEYUlEQVR42uzc6W7bOBQGUJk0aVm2sy/dO+v7v+KIkuzYMymsASrZKM5pkxRI+odfLi9JLVUFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPz6QhXav8PX8oUriOTwiWvI4yQZLp3HKgy1ESRyLRWy7yMSuZpEVvv6EMjl82jFGHMlj6uR20CaHCrL3iuZslIspHEteTzGLpEsjytp6X2BtF3EIutKOkiXSIqNsbgKfXl0XUSJXE2BNKVEkr5+eX/HuE6lQlJfIlx6wkop7aesrq9zyU16VS3eLBeL+zu7w4va5pM8lou7PiaRXMKqHfZ8lMeylIg4LrglXIUcj+qjbjNZiONygay21VEgdR9JOYrXRi62B0lpcZxIm0mutm0aW2NzkTVWu9g9aemt5nDLA/P6tsv5KJCupbdyk/MnozNPEy8fd3df/vptqIYzvtzd3933/1PBTJHH7mtbE10UY+Jof+a1/ZSbP7tbUwzgz+/g5fjwcVwa+9CWi/iYcyWPSVZU5RAxtWNcv47Io19z1ctypSQbvQlmrHKhtk1kWY+csoZ1V4pOgaeasbrLgv0hyahAukS6GINAfr6Xkse6nbLqtzXuiBqJcZ2/VRKZYBv4ksov+8iWfpjWYmxe5DGNT2XS6kb59uZ2XCj1IucXJ1uT7QvTOna/+fXtzZh1Vmk2OaxWNobT5BHCU7vKKo2hrm9H5FEvuuN4W/Wpmkj5iON36nWZ2jbh8KwCE1RJqBb/o6nf3Gw2w03xK6M3QQspRbIZn8ftzcPDpr/Sq0SmmLLKEWF42JRdyHJMS7/ZPPyx6ZNUIJNMV+XPpktkVJFsCqUxw9yVc4rn0shumptxuXV8pfAHHrcax4wbkvXZQDzgNlceq7CtwvkKqcJ2WJcx/fq3GhHI/iI8k1dIO8oxna8Qc9Z8NfL5/Crrs/uzZvTh/JT10SjNt2Ov0umU9d4+MQYNfb5MYlyfnOsu3wvEOM23yoppfRrHfxOJlZefzLdTT+vjxxDq984ak0XWbHGE3Tod3fX+/hWruAsu3c64yIonVwbf6yEfKjUyVw/JR6usdzt6CSTbqc8WSf5XhSxff7//QSDMUSI5t109Di9lavLw0pmmfylQiv1NwI2TxfmmrHUZ8zLyKebcXzXvV8P7RNbllvfgtHeeRL73VdDuDrs4ytO4+3E/JNJWyM619JkqJHVPipS7qJvuICW8vY80hPLNMp/FpulfVsrEVtXHoUDSsDEZ7hDqx/7pKQ3N5aMZa6YSeS6P367T81tT6aamQy6hKT/QPDs6mauph93uuVodXsJ/GPdweMf17uv3aqU+5spj/8/hte9vJyShOsxiTy5QAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAr+YfAQYAN40YEKg5vxkAAAAASUVORK5CYII=";

            userBoards.forEach(function(item) {
                if (item.slug == 'wishlist') {
                    $rootScope.addToBoard(item.id);
                    isWishlistBoardFound = true;
                }
            });

            if (!isWishlistBoardFound) {
                Profile.createBoard('wishlist', 'My BETOSEE wishlist', coverWishlist).then(function(resp){
                    board_id = resp.info.created_selection.id;

                    Boards.addToBoard(board_id, $rootScope.currentItem.element_type, $rootScope.currentItem.id).then(function(resp){
                        $rootScope.closeBoard();
                        $rootScope.close('like');
                    });
                });
            }
        });
        $rootScope.up('added-wishlist');
        $timeout(function(){
            if (document.querySelector("#iwish")) {
                document.querySelector("#iwish").innerHTML = "WISHED";
                document.querySelector("#iwish").style.color = "white";
                document.querySelector("#iwish").style.background = "black";
            }
             $rootScope.close('added-wishlist');
        },1000);
    };

    //Get Picture Camera
    $rootScope.getCameraPicture = function(){
        navigator.camera.getPicture(function(imageData){
            alert(imageData);
        }, function(message){
            alert('Failed because: ' + message);
        }, { quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType : Camera.PictureSourceType.PHOTOLIBRARY
        });
    };

    //Base64

    $rootScope.getBase64FromImageUrl = function(URL) {
        var img = new Image();
        img.src = URL;
        img.onload = function () {

            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.width;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            var dataURL = canvas.toDataURL("image/png");

        };


        alert(dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));
        return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    };

    //Share

    $rootScope.shareInstagram = function(){

    // var base64img = $rootScope.getBase64FromImageUrl($rootScope.currentItem.image__medium);
    // console.log(base64img);

        Instagram.share(base64img, $rootScope.currentItem.title + ' #BETOSEE', function (err) {
            if (err) {
                console.log("not shared");
            } else {
                console.log("shared");
            }
        });
    };

    $rootScope.shareFacebook = function(){

        if (ionic.Platform.isIOS()) {
            window.plugins.socialsharing.shareVia(
                'com.apple.social.facebook',
                $rootScope.currentItem.title,
                null,
                $rootScope.currentItem.image__medium,
                'http://www.betosee.com',
                function() {
                    document.querySelector('#like').classList.toggle('show-page');
                },
                function(msg) {
                    alert('Facebook account not found');
                }
            );
        }else{
            window.plugins.socialsharing.shareVia(
                'facebook',
                $rootScope.currentItem.title,
                null,
                $rootScope.currentItem.image__medium,
                'http://www.betosee.com',
                function() {
                    document.querySelector('#like').classList.toggle('show-page');
                },
                function(msg) {
                    alert('Facebook account not found');
                }
            );
        }
    };

    $rootScope.goHelp = function() {
            $rootScope.up('tuto');
            Storage.save('tutorialOk', 'ok');
            $rootScope.closeMenu();
    };

    $rootScope.shareTwitter = function(){

        if (ionic.Platform.isIOS()) {
            window.plugins.socialsharing.shareVia(
                'com.apple.social.twitter',
                $rootScope.currentItem.title + ' as seen on BeToSee',
                null,
                $rootScope.currentItem.image__medium,
                'http://www.betosee.com',
                function() {
                    document.querySelector('#like').classList.toggle('show-page');
                },
                function(msg) {
                    alert('Twitter account not found');
                }
            );
        }else{
            window.plugins.socialsharing.shareVia(
                'twitter',
                $rootScope.currentItem.title + ' as seen on BeToSee',
                null,
                $rootScope.currentItem.image__medium,
                'http://www.betosee.com',
                function() {
                    document.querySelector('#like').classList.toggle('show-page');
                },
                function(msg) {
                    alert('Twitter account not found');
                }
            );
        }
    };

    $rootScope.shareMail = function(){

        window.plugins.socialsharing.shareViaEmail(
            $rootScope.currentItem.title + ' as seen on BeToSee.com',
            'BeToSee.com',
            null,
            null,
            null,
            $rootScope.currentItem.image__medium,
            function() {
                document.querySelector('#like').classList.toggle('show-page');
            },
            function(msg) {
                alert('error: ' + msg);
            }
        );
    };

    //Events
    $rootScope.isItemPage = false;
    $rootScope.setPageEvent = function(bool) {
        $rootScope.isItemPage = bool;
    };

    $rootScope.addLikeEvent = function() {
        var content = document.querySelector("ion-nav-view");
        var contentElement  = angular.element(content);
        $ionicGesture.on('doubletap', function(e){
            console.log(e);
            if ($rootScope.isItemPage) {
                //ScrollTotop or like view
                if (e.gesture.center.pageY < 110) {
                    var handle = $rootScope.closestScroll(e.srcElement);
                    $rootScope.scrollToTop(handle);
                } else {
                    $rootScope.likeElement = $rootScope.currentItem;
                    $rootScope.up('like');
                }
            }
        }, contentElement);
    };

    $rootScope.closestScroll = function(elm) {
        var i = 0;
        while ( i < 5 && elm.parentNode.querySelector('ion-content') === null) {
            elm = elm.parentNode;
            i++;
        }
        var info = elm.parentNode.querySelector('ion-content').getAttribute('id').split('content');

        return 'scroll' + info[1];
    };

    //Fix webview input
    $rootScope.initForm = function() {
        [].forEach.call(document.querySelectorAll('input'), function(el) {
            el.addEventListener('focus',function(e){
                $timeout(function(){
                   window.scrollTo(0,0);
                },20);
            }, true);
            el.addEventListener('blur',function(e){
                $timeout(function(){
                   window.scrollTo(0,0);
                },20);
            }, true);
        });
    };

    //General
    $rootScope.setLastList = function(lastList){
        $rootScope.lastList = lastList;

        return $rootScope.lastList;
    };
    $rootScope.getLastList = function(){

        return $rootScope.lastList;
    };

    $rootScope.setOldScrollPosition = function(oldScrollPosition){
        $rootScope.oldScrollPosition = oldScrollPosition;

        return $rootScope.oldScrollPosition;
    };

    $rootScope.getOldScrollPosition = function(){

        return $rootScope.oldScrollPosition;
    };

    $rootScope.setDiscoverImage = function(discoverImage){
        $rootScope.discoverImage = discoverImage;

        return $rootScope.discoverImage;
    };

    $rootScope.getDiscoverImage = function(){

        return $rootScope.discoverImage;
    };

    $rootScope.setParamsList = function(paramsList){
        $rootScope.paramsList = paramsList;
        console.log(paramsList);
        return $rootScope.paramsList;
    };

    $rootScope.getParamsList = function(){

        return $rootScope.paramsList;
    };

    $rootScope.callFb = function(){

        var fbLoginSuccess = function (userData) {

            if (ionic.Platform.isIOS()) {

                console.log('ios');

                $http({method: 'GET', url: 'https://graph.facebook.com/v2.0/me?fields=picture%2Cfirst_name%2Clast_name%2Cemail&method=GET&format=json&suppress_http_code=1&access_token=' + userData.authResponse.accessToken
                }).
                success(function(data, status, headers, config) {

                    var firstName  = data.first_name;
                    var lastName   = data.last_name;
                    var facebookId = data.id;
                    var picture    = data.picture.data.url;
                    var email      = data.email;

                    var userFb = {};

                    userFb.email       = email;
                    userFb.password    = Math.random().toString(36).substring(7);
                    userFb.firstname   = firstName;
                    userFb.lastname    = lastName;
                    userFb.fbToken     = facebookId;
                    userFb.fbAvatarUrl = picture;

                    // call register or just log him
                    Profile.registerFb(userFb).then(function(respFb){
                        if (respFb.status) {
                            console.log('Logged');

                            //Storage
                            Storage.save('login', userFb.email);
                            Storage.save('pass', userFb.password);
                            Storage.save('token', respFb.info.token);

                            Api.init(respFb.info.token);

                            //Profile
                            $rootScope.getProfile();

                        } else {
                            navigator.notification.alert(
                                respFb.info.errors.toString(),
                                null,
                                'Register',
                                'Try again'
                            );
                        }
                    }, function(error) {
                        console.error('Unable to register', error);
                    });
                }).
                error(function(data, status, headers, config) {
                    alert(JSON.stringify(data));
                });

            } else if (ionic.Platform.isAndroid()){

                console.log('android');

                facebookConnectPlugin.getAccessToken(function(token) {

                    $http({method: 'GET', url: 'https://graph.facebook.com/v2.0/me?fields=picture%2Cfirst_name%2Clast_name%2Cemail&method=GET&format=json&suppress_http_code=1&access_token=' + token
                    }).
                    success(function(data, status, headers, config) {

                        var firstName  = data.first_name;
                        var lastName   = data.last_name;
                        var facebookId = data.id;
                        var picture    = data.picture.data.url;
                        var email      = data.email;

                        var userFb = {};

                        userFb.email       = email;
                        userFb.password    = Math.random().toString(36).substring(7);
                        userFb.firstname   = firstName;
                        userFb.lastname    = lastName;
                        userFb.fbToken     = facebookId;
                        userFb.fbAvatarUrl = picture;

                        Profile.registerFb(userFb).then(function(respFb){
                            if (respFb.status) {
                                console.log('Logged');

                                //Storage
                                Storage.save('login', userFb.email);
                                Storage.save('pass', userFb.password);
                                Storage.save('token', respFb.info.token);

                                Api.init(respFb.info.token);

                                //Profile
                                $rootScope.getProfile();

                            } else {
                                navigator.notification.alert(
                                    respFb.info.errors.toString(),
                                    null,
                                    'Register',
                                    'Try again'
                                );
                            }
                        }, function(error) {
                            console.error('Unable to register', error);
                        });
                    }).
                    error(function(data, status, headers, config) {

                    });

                }, function(err) {
                    alert("Could not get access token: " + err);
                });
            }
        };

        facebookConnectPlugin.login(["email"],
            fbLoginSuccess,
            function (error) {
                alert('Oops, something went wrong, are you connected to Internet?');
            }
        );
    };

    $rootScope.$on("$locationChangeSuccess", function (event, next, current) {
        next =    next.slice( next.lastIndexOf('#')+1, next.length );
        ga_storage._trackPageview(next);
    });
});
