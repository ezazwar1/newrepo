angular.module('game.controllers', ['ngSanitize'])

//--------------------------------------------------------------
//collection related
//--------------------------------------------------------------

//Load the NearMe Tab
.controller('NearMeCtrl', function($scope, $state, $stateParams, $http, GameServ, UtilServ, $localstorage, $ionicHistory, $ionicScrollDelegate, $timeout) {
    $scope.data                                     = {};

    $scope.data.all_collections_current_page        = 0;
    $scope.data.all_collections_items               = 20;
    $scope.data.all_collections_there_is_more       = false;
    $scope.data.all_collections                     = [];
    $scope.data.all_collections_active              = false;
    $scope.data.all_collections_placeholderpic_flag = false;

    $scope.data.matches_items                       = 20;
    $scope.data.matches                             = [];
    $scope.data.matches_active                      = true;
    $scope.data.matches_placeholderpic_flag         = false;

    var valid_tab_names = ["search", "deals", "nearme", "chats", "me"];

    $scope.$on('$ionicView.enter', function(){
        console.log($ionicHistory.forwardView());
        if ($ionicHistory.forwardView() != null) {
            console.log(JSON.stringify($ionicHistory.forwardView().stateName));
            console.log(JSON.stringify($ionicHistory.forwardView().stateName) != '"tab.nearme_collection_profile"');

            if (JSON.stringify($ionicHistory.forwardView().stateName) != '"tab.nearme_collection_profile"') {
                console.log("++++++++");
                if ($scope.data.matches_active === true) {
                    $ionicHistory.clearCache();
                    $scope.init_matches();
                    console.log($ionicHistory.forwardView());
                }
            }
        }
    });

    $scope.clear_all = function(){
        $scope.data.all_collections_current_page = 0;
        $scope.data.keywords_flag = true;

        if ($localstorage.get('nearme_input_keywords') != undefined){
            $localstorage.clear('nearme_input_keywords');
        }
        if ($localstorage.get('nearme_platform_filter') != undefined){
            $localstorage.clear('nearme_platform_filter');
        }

        $scope.data.input_keywords = '';
        $scope.data.platform_filter = "all";

        $scope.load_all_collections();
    };

    $scope.init_all_collections = function(){
        if ($scope.data.previous_left_all != undefined && $scope.data.previous_top_all != undefined){
            $timeout(function() {
                $ionicScrollDelegate.scrollTo($scope.data.previous_left_all, $scope.data.previous_top_all, false);
            }, 10);
            console.log('in the scroll if');
        }
        else{
            $timeout(function() {
                $ionicScrollDelegate.scrollTop(false);
            }, 10);
        }

        $scope.data.all_collections_current_page = 0;
        if ($scope.data.input_keywords != undefined){
            $scope.data.keywords_flag = false;
            $scope.data.input_keywords = $localstorage.get('nearme_input_keywords') != undefined ? $localstorage.get('nearme_input_keywords') : '';
        }
        else {
            $scope.data.keywords_flag = true;
            $scope.data.input_keywords = '';
        }

        if ($scope.data.platform_filter != undefined){
            $scope.data.keywords_flag = false;
            console.log("get platform_filter " + $localstorage.get('nearme_platform_filter'));
            $scope.data.platform_filter = $localstorage.get('nearme_platform_filter') != undefined ? $localstorage.get('nearme_platform_filter') : 'all';
        }
        else {
            $scope.data.keywords_flag = true;
            $scope.data.platform_filter = 'all';
        }

        $scope.load_all_collections();
    };

    $scope.init_matches = function(){
        console.log("init_matches() is called");
        if ($scope.data.previous_left_match != undefined && $scope.data.previous_top_match != undefined){
            $timeout(function() {
                $ionicScrollDelegate.scrollTo($scope.data.previous_left_match, $scope.data.previous_top_match, false);
            }, 10);
            console.log('in the scroll if');
        }
        else {
            $timeout(function () {
                $ionicScrollDelegate.scrollTop(false);
            }, 10);
        }
        $scope.load_matches();
    };

    $scope.load_more_all_collections = function(){
        $scope.data.all_collections_current_page++;
        console.log("$scope.data.all_collections_current_page after " + $scope.data.all_collections_current_page);
        $scope.load_all_collections();
    };

    $scope.collection_search = function(){
        console.log("$scope.data.platform_filter " + $scope.data.platform_filter);
        console.log("$scope.data.input_keywords " + $scope.data.input_keywords);
        $localstorage.set('nearme_platform_filter', $scope.data.platform_filter);
        $localstorage.set('nearme_input_keywords', $scope.data.input_keywords);
        $scope.data.all_collections_current_page = 0;
        $scope.data.keywords_flag = false;
        $scope.load_all_collections();
    };

    $scope.load_all_collections = function(){
        var promise = GameServ.collection_by_location($scope.data.input_keywords, $scope.data.platform_filter, $scope.data.all_collections_items, $scope.data.all_collections_current_page);
        promise.then(
            function(data){
                $scope.data.error_code = data.error_code;
                if ($scope.data.error_code === "NoErrors"){
                    $scope.data.all_collections_placeholderpic_flag = false;
                    // check if this is more
                    if (data.collections.length < $scope.data.all_collections_items ){
                        $scope.data.all_collections_there_is_more = false;
                    }
                    else{
                        $scope.data.all_collections_there_is_more = true;
                    }
                    // convert the distance unit
                    for(var i = 0; i < data.collections.length; i++){
                        data.collections[i].miles = UtilServ.distance_converter(data.collections[i].miles);
                        data.collections[i].collect_format_message = UtilServ.get_collect_format_message(data.collections[i].collect_format);
                    }
                    // append to existing collection by location list
                    if ($scope.data.all_collections_current_page === 0){
                        $scope.data.all_collections = data.collections;
                    }
                    else{
                        $scope.data.all_collections = $scope.data.all_collections.concat(data.collections);
                    }

                    // must notify
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }
                else {
                    $scope.data.all_collections_placeholderpic_flag = true;
                    $scope.data.all_collections_message = UtilServ.get_error_message($scope.data.error_code);
                }
            }
            ,
            function(data){console.log('ERROR: while loading all selling collections ' + data.error_code);}
        );
    };

    $scope.load_matches = function () {
        var promise = GameServ.collection_by_wishlist_location($scope.data.matches_items);
        promise.then(
            function(data){
                $scope.data.error_code = data.error_code;
                if ($scope.data.error_code === "NoErrors"){
                    for(var i = 0; i < data.matches.length; i++){
                        data.matches[i].miles = UtilServ.distance_converter(data.matches[i].miles);
                        data.matches[i].collect_format_message = UtilServ.get_collect_format_message(data.matches[i].collect_format);
                    }

                    $scope.data.matches_placeholderpic_flag = false;
                    $scope.data.matches = data.matches;
                }
                else {
                    $scope.data.matches_placeholderpic_flag = true;
                    $scope.data.matches_message = UtilServ.get_error_message($scope.data.error_code);
                }
            }
            ,
            function(data){console.log('ERROR: while loading matched collections ' + data.error_code);}
        );
    };

    $scope.decide_shown_list = function(list_name){
        if (list_name === 1 && $scope.data.all_collections_active === false){
            $scope.data.all_collections         = [];
            $scope.data.all_collections_active  = true;
            $scope.data.matches_active          = false;

            var position = $ionicScrollDelegate.getScrollPosition();
            console.log('match games position: ' + JSON.stringify(position));

            $scope.data.previous_left_match = position['left'];
            $scope.data.previous_top_match = position['top'];
            $scope.init_all_collections();
        }

        else if (list_name === 2 && $scope.data.matches_active === false){
            $scope.data.matches                 = [];
            $scope.data.all_collections_active  = false;
            $scope.data.matches_active          = true;

            var position = $ionicScrollDelegate.getScrollPosition();
            console.log('match games position: ' + JSON.stringify(position));

            $scope.data.previous_left_all = position['left'];
            $scope.data.previous_top_all = position['top'];
            $scope.init_matches();
        }
        else {
            console.log("tab did not change");
        }
    };

    $scope.goto_collection_profile_by_tab = function(collection_id, tab_name){
        if (valid_tab_names.indexOf(tab_name) >= 0){
            var routing_url = "tab." + tab_name + "_collection_profile";
            $state.go(routing_url, {collection_id: collection_id, tab_name: tab_name});
        }
        else {
            console.log("ERROR: in NearMeCtrl goto_collection_profile_by_tab, current tab is not valid which is " + tab_name);
        }
    };

    $scope.goto_gamer_profile_by_tab = function(gamer_id, tab_name){
        if (valid_tab_names.indexOf(tab_name) >= 0){
            var routing_url = "tab." + tab_name + "_gamer_profile";
            $state.go(routing_url, {gamer_id:gamer_id, tab_name: tab_name});
        }
        else {
            console.log("ERROR: in NearMeCtrl goto_gamer_profile_by_tab, current tab is not valid which is " + tab_name);
        }
    };

    //$scope.init_all_collections();
    $scope.init_matches();
})

//Load the collection profile 
.controller('CollectionProfileCtrl', function($scope, $state, $stateParams, $localstorage, ChatServ, GameServ, DealServ, UtilServ, $ionicPopup, $ionicBackdrop, $sce, $ionicHistory, $cordovaSocialSharing, gbgConfig, $timeout, $ionicLoading) {
    $scope.data             = {};
    $scope.data.collection  = {};
    $scope.data.thread      = [];
    $scope.data.me_id       = $localstorage.getObject('me_id');

    var share_link = gbgConfig.url;
    var share_file = null;
    var share_message = "Check out this cool game on GameBuyGame!!";
    var share_subject = $localstorage.get('me_name') + ' shared a cool posting from GameBuyGame with you';

    var valid_tab_names = ["search", "deals", "nearme", "chats", "me"];
    var valid_metric_status = ["sold", "bought", "favourite", "rate"];

    $scope.init = function(){
        $scope.data.collection_id  = $stateParams.collection_id;
        var promise = GameServ.collection_by_id($scope.data.collection_id);
        promise.then(
            function(data){
                $scope.data.collection = data.collection;

                // share collection related
                share_file = $scope.data.collection.picture;
                share_link = gbgConfig.url + "share/" + $scope.data.collection.share_code;
                share_message = "Check out " + $scope.data.collection.title + " on GameBuyGame!!";
                // gamer profile pic
                if ($scope.data.collection.profile_pic === null){
                    $scope.data.gamer_profile_pic_link = "https://graph.facebook.com/" + $scope.data.collection.fb_id + "/picture?type=normal";
                }
                else {
                    $scope.data.gamer_profile_pic_link = $scope.data.collection.profile_pic;
                }
                // distance
                $scope.data.collection.miles = UtilServ.distance_converter($scope.data.collection.miles);

                // buy button
                if ($scope.data.collection.in_deal_status === 1){
                    $scope.data.buy_button_message = "Offer placed";
                }
                else if ($scope.data.collection.collect_as === "have"){
                    $scope.data.buy_button_message = "Not for sale yet";
                }
                else if ($scope.data.collection.collect_as === "buy"){
                    $scope.data.buy_button_message = "In wish list";
                }
                else {
                    $scope.data.buy_button_message = "Take it";
                }
                // watch button
                if ($scope.data.collection.is_watching === true){
                    $scope.data.watch_button_message = "Watching";
                } else {
                    $scope.data.watch_button_message = "Watch it";
                }

                $scope.data.collect_format_message = UtilServ.get_collect_format_message($scope.data.collection.collect_format);

                //calculate the star display
                var decimal_value = Math.round(($scope.data.collection.rate_score - Math.floor($scope.data.collection.rate_score)) * 10)/10;
                var rounded_value = Math.round(decimal_value/0.25)*0.25;
                $scope.data.rate_score = (parseInt($scope.data.collection.rate_score) + rounded_value) * 100;
            }
            ,
            function(data){console.log('ERROR: while loading collection profile ' + data.error_code);}
        );
    };

    $scope.loading_effect = function(){
        $ionicLoading.show({
            template: '<ion-spinner icon="ripple"></ion-spinner>',
            hideOnStageChange: true
        });
    };

    $scope.share_collection= function(){ //share_subject is only used for email sharing, if file != null, FB Messegner does not work
        console.log("share_file is " + share_file);
        console.log("share_link is " + share_link);
        $cordovaSocialSharing.share(share_message, share_subject, share_file, share_link).then();
    };

    $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
    };

    $scope.goto_chat_thread_add = function(gamer_id, currentchat_placeholder){
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $scope.data.gamer_id = gamer_id;

        var promise = ChatServ.thread_add($scope.data.gamer_id);
        promise.then(
            function(data){
                $scope.data.thread.thread_id = data.thread.thread_id;
                if (currentchat_placeholder === undefined){
                    currentchat_placeholder = "About " + $scope.data.collection.title + ": ";
                }
                console.log("placeholder + " + currentchat_placeholder);
                $state.go('chat', {thread_id:$scope.data.thread.thread_id, partner_id: $scope.data.gamer_id, currentchat_placeholder: currentchat_placeholder});
            }
            ,
            function(data){console.log('ERROR: while adding chat thread ' + data.error_code);}
        );
    };

    $scope.goto_gamer_profile_by_tab = function(gamer_id){
        if (valid_tab_names.indexOf($stateParams.tab_name) >= 0){
            var routing_url = "tab." + $stateParams.tab_name + "_gamer_profile";
            $state.go(routing_url, {gamer_id:gamer_id, tab_name: $stateParams.tab_name});
        }
        else {
            console.log("ERROR: current tab is not valid which is " + $stateParams.tab_name);
        }
    };

    $scope.goto_deal_list_by_tab = function(){
        if (valid_tab_names.indexOf($stateParams.tab_name) >= 0){
            var routing_url = "tab." + $stateParams.tab_name + "_deals_list";
            $state.go(routing_url, {tab_name: $stateParams.tab_name});
        }
        else {
            console.log("ERROR: current tab is not valid which is " + $stateParams.tab_name);
        }
    };

    $scope.goto_gamer_gamemetrics_by_type = function (metric, tab_name){
        $scope.tab_name = tab_name === undefined ? $stateParams.tab_name : tab_name;

        if (valid_metric_status.indexOf(metric) >=0 && valid_metric_status.indexOf(metric) < 2){
            var routing_url = "tab." + $scope.tab_name + "_gamer_gamemetrics";
            metric = valid_metric_status.indexOf(metric);
            $state.go(routing_url, {gamer_id: $scope.data.collection.gamer_id, gamer_name: $scope.data.collection.name, metric: parseInt(metric), tab_name: $scope.tab_name});
        }
        else if (valid_metric_status.indexOf(metric) == 2){
            var routing_url = "tab." + $scope.tab_name + "_gamer_favourite";
            $state.go(routing_url, {gamer_id: $scope.data.collection.gamer_id, tab_name: $scope.tab_name});
        }
        else if (valid_metric_status.indexOf(metric) == 3){
            var routing_url = "tab." + $scope.tab_name + "_gamer_rate";
            $state.go(routing_url, {gamer_id: $scope.data.collection.gamer_id, tab_name: $scope.tab_name});
        }
        else{
            console.log("Current metric_status is not valid which is " + metric);
        }
    };

    $scope.deal_watch = function(){
        if ($scope.data.collection.is_watching){
            var promise = DealServ.watch_delete($scope.data.collection_id);
            promise.then(
                function(data){
                    if (data.error_code === "NoErrors"){
                        $scope.init();
                    }
                }
                ,
                function(data){console.log('ERROR: while requesting to buy a game ' + data.error_code);}
            );
        }
        else {
            var promise = DealServ.watch_add($scope.data.collection_id);
            promise.then(
                function(data){
                    if (data.error_code === "NoErrors"){
                        $scope.init();
                    }
                }
                ,
                function(data){console.log('ERROR: while requesting to buy a game ' + data.error_code);}
            );
        }
        $ionicHistory.clearCache();
    };

    $scope.show_popup_choose_how_to_pay = function() {
        var action_popup = $ionicPopup.show({
            templateUrl: 'templates/popup_collection_tobuy.html',
            scope: $scope
        });

        $scope.use_cash = function() {
            action_popup.close();
            $scope.loading_effect();
            var promise = DealServ.deal_request($scope.data.collection_id, false);
            promise.then(
                function(data){
                    $ionicLoading.hide();
                    if (data.error_code === "NoErrors" || data.error_code === "NoEmailConfirmation"){
                        //$scope.init();
                        var currentchat_placeholder = "Hi, I just placed an offer to buy " + $scope.data.collection.title + ", please take a look";
                        $scope.goto_chat_thread_add($scope.data.collection.gamer_id, currentchat_placeholder);
                    }
                }
                ,
                function(data){
                    $ionicLoading.hide();
                    console.log('ERROR: while requesting to buy a game ' + data.error_code);
                }
            );
            $ionicHistory.clearCache(); // so that active trade list can be updated
        };

        $scope.use_credit = function() {
            action_popup.close();
            $scope.loading_effect();
            if ($scope.data.collection.price_unit != $localstorage.get('me_currency_unit')){
                $ionicLoading.hide();
                $ionicBackdrop.retain();
                $ionicPopup.alert({
                    title: 'Oops, the order could not be requested due to different currencies'
                });
            }
            else {
                var promise = DealServ.deal_request($scope.data.collection_id, true);
                promise.then(
                    function(data){
                        $ionicLoading.hide();
                        if (data.error_code === "NoErrors" || data.error_code === "NoEmailConfirmation"){
                            //$scope.init();
                            var currentchat_placeholder = "Hi, I just placed an offer to buy " + $scope.data.collection.title + ", please take a look";
                            $scope.goto_chat_thread_add($scope.data.collection.gamer_id, currentchat_placeholder);
                        }
                        else {
                            $ionicPopup.alert({
                                title: UtilServ.get_error_message(data.error_code)
                            });
                        }
                    }
                    ,
                    function(data){
                        $ionicLoading.hide();
                        console.log('ERROR: while requesting to buy a game ' + data.error_code);
                    }
                );
                $ionicHistory.clearCache(); // so that active trade list can be updated
            }
        };

        $scope.cancel_button = function(){
            action_popup.close();
        };
    };

    $scope.init();
})


//--------------------------------------------------------------
//game related
//--------------------------------------------------------------

.controller('GameProfileCtrl', function($scope, $state, $stateParams, GameServ, $ionicPopup, $window, $localstorage, $sce, UtilServ, $ionicBackdrop, $ionicHistory, $cordovaInAppBrowser) {
    $scope.data                         = {};
    $scope.data.game                    = [];
    $scope.data.flag_gameadd            = false;
    $scope.priceconfirm_disabled        = true;


    var valid_tab_names = ["search", "deals", "nearme", "chats", "me"];

    $scope.init = function(){
        $scope.data.game_id = $stateParams.game_id;

        console.log("gamer id " + $localstorage.get('me_id'));
        if ($localstorage.get('me_id') < 17){
            $scope.data.classifieds_name = 'Kijiji';
            $scope.data.country_for_price = 'all';
        }
        else if ($localstorage.get('me_country') == 'Canada'){
            $scope.data.classifieds_name = 'Kijiji';
            $scope.data.country_for_price = 'Canada';
        }
        else {
            $scope.data.classifieds_name = 'Craigslist';
            $scope.data.country_for_price = 'US';
        }

        console.log('$scope.data.country_for_price is ' + $scope.data.country_for_price);
        $scope.get_game_by_game_id();
    };


    $scope.get_game_by_game_id = function(){
        var promise = GameServ.game_by_id($scope.data.game_id);
        promise.then(
            function (data){
                $scope.data.game = data.game;
                //if (data.game.trailer){
                //    $scope.data.game.trailer_src = "https://www.youtube.com/embed/"+data.game.trailer+"?autoplay=0&showinfo=0&controls=0";
                //}
                if ($scope.data.game.collection_description === null || $scope.data.game.collection_description === ""){
                    $scope.data.description_button = "Add Description";
                }
                else {
                    $scope.data.description_button = "Edit Description";
                }

                if ($scope.data.game.collect_as === "have"){
                    $scope.data.had             = true;
                    $scope.data.wished          = false;
                    $scope.data.sell            = false;
                }
                else if ($scope.data.game.collect_as === "buy"){
                    $scope.data.wished          = true;
                    $scope.data.had             = false;
                    $scope.data.sell            = false;
                }
                else if ($scope.data.game.collect_as === "sell" || $scope.data.game.collect_as === "hide") {
                    $scope.data.wished          = false;
                    $scope.data.had             = false;
                    $scope.data.sell            = true;
                }
                else {
                    $scope.data.wished          = false;
                    $scope.data.had             = false;
                    $scope.data.sell            = false;
                }
                console.log("Before util called");
                $scope.data.collect_format_message  = UtilServ.get_collect_format_message($scope.data.game.collect_format);
                $scope.data.collect_format          = UtilServ.get_collect_format_value($scope.data.game.collect_format);
                console.log("After util called");
            }
            ,
            function (data){console.log('ERROR: while loading game profile ' + data.error_code);}
        );
    };

    $scope.add_game = function(collect_as){
        if(collect_as === 3){ // Have
            var promise = GameServ.collection_add($scope.data.game.game_id, collect_as, 0);
            promise.then(
                function (data){
                    $scope.data.game    = data.collection;
                    $scope.data.wished  = false;
                    $scope.data.had     = true;
                    $scope.data.sell    = false;
                    $scope.init();
                }
                ,
                function (data){console.log('ERROR: while adding a collection ' + data.error_code);}
            )
        } 
        else if (collect_as === 2){ // buy
            var promise = GameServ.collection_add($scope.data.game.game_id, collect_as, 0);
            promise.then(
                function (data){
                    $scope.data.game    = data.collection;
                    $scope.data.wished  = true;
                    $scope.data.had     = false;
                    $scope.data.sell    = false;
                    $scope.init();
                }
                ,
                function (data){console.log('ERROR: while adding a collection ' + data.error_code);}
            )
        }
        else if (collect_as === 1) { // sell
            //allow 10 and 10.0 and 10.00 and 0, but not 10. 10.000 or 10.0.0
            var regex=/^\d+(\.\d{1,2})?$/;

            if ($scope.data.price_sell == undefined || !regex.test($scope.data.price_sell) || parseFloat($scope.data.price_sell) <= 0){
                $scope.data.price_sell = "Please Enter Price Here";
            }
            else{
                var promise = GameServ.collection_add($scope.data.game.game_id, collect_as, $scope.data.price_unit, parseFloat($scope.data.price_sell), $scope.data.collection_description, $scope.data.collect_format);
                promise.then(
                    function (data){
                        $scope.data.game = data.collection;
                        $scope.close_action_popup();
                        $scope.data.wished  = false;
                        $scope.data.had     = false;
                        $scope.data.sell    = true;
                    }
                    ,
                    function(data){console.log('ERROR: while adding a collection ' + data.error_code);}
                )
            }
        }
        $scope.data.flag_gameadd = true;
    };

    $scope.delete_game = function(){

        if ($scope.data.game.collect_as != null){
            var promise = GameServ.collection_delete($scope.data.game.collection_id);
            promise.then(
                function (data){
                    if ($stateParams.tab_name === "me"){
                        $state.go("tab.me");
                    }
                    else{
                        $ionicHistory.goBack(-1);
                    }
                    console.log('Deleted Successfully');
                }
                ,
                function (data){console.log('ERROR: while deleting a collection ' + data.error_code);}
            )
        }
        else {
            console.log("ERROR: in GameProfileCtrl delete_game, attempting to delete an uncollected game");
        }
    };

    $scope.edit_game = function(collect_as){
        if(collect_as === 3){ // have
            var promise = GameServ.collection_update($scope.data.game.collection_id, collect_as, 0);
            promise.then(
                function (data){
                    $scope.init();
                }
                ,
                function (data){console.log('ERROR: while updating collection status ' + data.error_code);}
            )
        }
        else if (collect_as === 2){ // buy
            var promise = GameServ.collection_update($scope.data.game.collection_id, collect_as, 0);
            promise.then(
                function (data){
                    $scope.init();
                }
                ,
                function (data){console.log('ERROR: while updating collection status ' + data.error_code);}
            )
        }
        else { // sell
            //if ($scope.data.price_sell === undefined) {
            //    $scope.data.price_sell = $scope.data.game.price_sell;
            //}
            $scope.data.price_sell = $scope.data.price_sell === undefined ? $scope.data.game.price_sell : $scope.data.price_sell;
            $scope.data.collection_description = $scope.data.collection_description === undefined ? $scope.data.game.collection_description : $scope.data.collection_description;
            console.log('$scope.data.collect_format is ' + $scope.data.collect_format);

            var promise = GameServ.collection_update($scope.data.game.collection_id, collect_as, $scope.data.price_unit, $scope.data.price_sell, $scope.data.collection_description, $scope.data.collect_format);
            promise.then(
                function(data){
                    $scope.close_action_popup();
                    $scope.init();
                }
                ,
            function (data){console.log('ERROR: while updating collection status ' + data.error_code);}
            )
        }
    };

    $scope.showAlert = function(action_type) {
        $scope.data.action_type = action_type;

        if ($scope.data.game.collect_as === "sell" || $scope.data.game.collect_as === "hide"){
            var title = "If an item is removed from 'sell it', all the trade offers associated with it will be cancelled!";
        }
        else{
            if ($scope.data.action_type === 2 && $scope.data.wished === false){
                var title = "Item has been added to your wishlist";
            }
            else if ($scope.data.action_type === 2 && $scope.data.wished === true){
                var title = "Item is already in your wishlist";
            }
            else if ($scope.data.action_type === 3 && $scope.data.had === false){
                var title = "Item has been added to your collection";
            }
            else if ($scope.data.action_type === 3 && $scope.data.had === true){
                var title = "Item is already in your collection";
            }
            else {
                console.log("ERROR: in GameProfileCtrl showConfirm, invalid value for action_type " + action_type);
            }
        }

        var alertPopup = $ionicPopup.alert({
            title: title
        });
        alertPopup.then(function(res) {
            if(res) {
                if ($scope.data.action_type === 2 && $scope.data.game.collect_as != null && $scope.data.wished === false){
                    $scope.edit_game(2);
                }
                else if ($scope.data.action_type === 2 && $scope.data.game.collect_as === null && $scope.data.wished === false){
                    $scope.add_game(2); 
                }
                else if ($scope.data.action_type === 3 && $scope.data.game.collect_as != null && $scope.data.had === false){
                    $scope.edit_game(3);
                }
                else if ($scope.data.action_type === 3 && $scope.data.game.collect_as === null && $scope.data.had === false){
                    $scope.add_game(3);
                }
                else {
                    console.log('no further action is needed');
                }
             } 
             else {
               console.log('You are not sure');
             }
        });
    };

    $scope.showConfirm_delete = function() {
        if ($scope.data.game.collect_as === "sell" || $scope.data.game.collect_as === "hide"){
            var title = "If an item is removed from 'sell it', all the trade offers associated with it will be cancelled!";
        }
        else{
            var title = "Are you sure you want to remove this item?";
        }
        var confirmPopup = $ionicPopup.confirm({
            title: title
        });
        confirmPopup.then(function(res) {
            if(res) {
                $scope.delete_game();
             } 
             else {
               console.log('You are not sure');
             }
        });
    };

    $scope.showConfirm_classifieds = function() {
        if ($scope.data.classifieds_name === 'Kijiji'){
            var title = "Get more exposure and sell faster, also post the Ad on Kijiji?";
        }
        else{
            var title = "Get more exposure and sell faster, also post the Ad on Craigslist?";
        }
        $ionicBackdrop.retain();
        var confirmPopup = $ionicPopup.confirm({
            title: title
        });
        confirmPopup.then(function(res) {
            if(res) {
                $scope.post_on_classifieds();
            }
            else {
                console.log('You are not sure');
                $scope.init();
            }
        });
    };

    $scope.show_action_popup = function(action_type){
        $scope.action_type = action_type;
        if ($scope.action_type === "NewtoSell") {
            $scope.data.action_template = 'templates/popup_game_tosell.html'
        }
        else {
            console.log("ERROR: in GameProfileCtrl showConfirm, invalid value for action_type " + action_type);
        }

        var action_popup = $ionicPopup.show({
            templateUrl: $scope.data.action_template,
            scope: $scope
        });

        action_popup.then(function(res) {
            console.log('Tapped!', res);
        });

        $scope.close_action_popup = function() {
            action_popup.close();
            $scope.init();
            $scope.showConfirm_classifieds();
        };

        $scope.cancel_button = function(){
            action_popup.close();
        };
    };

    // display the popup to add the collection description 
    $scope.edit_gamer_description = function () {
        $scope.data.action_template = 'templates/popup_game_description.html';

        var action_popup = $ionicPopup.show({
            templateUrl: $scope.data.action_template,
            scope: $scope
        });

        action_popup.then(function (res) {
            console.log('INFO: in GameProfileCtrl edit_gamer_description tapped!', res);
        });

        $scope.close_action_popup = function () {
            action_popup.close();
            $scope.init();
        };

        $scope.cancel_button = function () {
            action_popup.close();
        };
    };

    $scope.pop_init = function(){
        $scope.data.price_unit = $localstorage.get('me_currency_unit');

        if ($scope.data.collect_format === -1 && $scope.data.game.platform != 'console'){
            $scope.data.collect_format = 0;
        }

        console.log($scope.data.collect_format);

        if ($scope.data.game.collect_as != null){
            $scope.fill_previous_price();
        }
        else {
            $scope.fill_default_price();
        }
        if ($scope.data.game.collection_description != null){
            $scope.data.collection_description = $scope.data.game.collection_description;
        }
    };

    $scope.$watch("data.price_sell", function (price_value) {
        //allow 10 and 10.0 and 10.00 and 0, but not 10. 10.000 or 10.0.0
        var regex=/^\d+(\.\d{1,2})?$/;

        if (price_value != undefined && regex.test(price_value) && parseFloat(price_value) > 0) {
            $scope.priceconfirm_disabled = false;
        }
        else {
            $scope.priceconfirm_disabled = true;
        }
    });

    $scope.fill_default_price = function() { 
        $scope.data.price_sell = $scope.data.game.used_price;
    };

    $scope.fill_previous_price = function(){
        if($scope.data.game.price_sell === 0){
            $scope.data.price_sell = $scope.data.game.used_price;
        }
        else{
            $scope.data.price_sell = ($scope.data.game.price_sell).toFixed(2);
        }
    };

    $scope.format_selection = function(new_format){
        if ($scope.data.collect_format != new_format){
            $scope.data.collect_format = new_format;
        }
    };

    $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
    };

    //$scope.$on( "$ionicView.leave", function( scopes, states ) {
    //    $scope.stop_video();
    //});

    //$scope.stop_video = function(){
    //    var div = document.getElementById("trailer");
    //    var iframe = div.getElementsByTagName("iframe")[0].contentWindow;
    //    iframe.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
    //};

    $scope.game_action_router = function (){
        if ($scope.data.game.collect_as){
            $scope.edit_game(1);
        }
        else {
            $scope.add_game(1);
        }
    };

    $scope.goto_gamers_list_by_tab = function(game_id, collect_as){
        if (valid_tab_names.indexOf($stateParams.tab_name) >= 0){
            var routing_url = "tab." + $stateParams.tab_name + "_gamers_list";
            $state.go(routing_url, {game_id:game_id, collect_as:collect_as, tab_name: $stateParams.tab_name});
        }
        else {
            console.log("Current tab is not valid which is " + $stateParams.tab_name);
        }
    };

    $scope.post_on_classifieds = function(){
        $state.go("tab." + $stateParams.tab_name + "_game_post_classified", {collection_id:$scope.data.game.collection_id, tab_name: $stateParams.tab_name});
    };

    $scope.goto_partner_link = function(partner_name){
        var defaultOptions = {
            location: 'no',
            clearcache: 'no',
            toolbar: 'yes'
        };

        console.log('partner_name is ' + partner_name);
        if (partner_name === 'amazon'){
            $cordovaInAppBrowser.open($scope.data.game.amazon_link, '_system', defaultOptions)
        }
        else if(partner_name === 'amazonca'){
            $cordovaInAppBrowser.open($scope.data.game.amazonca_link, '_system', defaultOptions)
        }
        else if(partner_name === 'bestbuynew'){
            $cordovaInAppBrowser.open($scope.data.game.bestbuy_new_link, '_system', defaultOptions)
        }
        else if(partner_name === 'bestbuyused'){
            $cordovaInAppBrowser.open($scope.data.game.bestbuy_used_link, '_system', defaultOptions)
        }
        else if(partner_name === 'bestbuycanew'){
            $cordovaInAppBrowser.open($scope.data.game.bestbuyca_new_link, '_system', defaultOptions)
        }
        else if(partner_name === 'bestbuycaused'){
            $cordovaInAppBrowser.open($scope.data.game.bestbuyca_used_link, '_system', defaultOptions)
        }
        else if(partner_name === 'ebgames'){
            $cordovaInAppBrowser.open($scope.data.game.ebgames_link, '_system', defaultOptions)
        }
        else if(partner_name === 'gamestop'){
            $cordovaInAppBrowser.open($scope.data.game.gamestop_link, '_system', defaultOptions)
        }
        else {
            console.log('unexpected partner_name');
        }

    };

    $scope.init();
})

//--------------------------------------------------------------
//game ad post related
//--------------------------------------------------------------

.controller('GameAdPostCtrl', function($scope, $state, $stateParams, GameServ, $window, $ionicPopup, $localstorage){
    $scope.data                         = {};
    $scope.data.collection_id           = 0;
    $scope.data.ad_posting_info         = {};


    $scope.init = function(){
        $scope.data.collection_id = $stateParams.collection_id;
        var promise = GameServ.post_to_kijiji($scope.data.collection_id);
        promise.then(
            function (data){
                $scope.data.ad_posting_info = data.ad_posting_info;
            }
            ,
            function (data){
                console.log('ERROR: while loading game profile ' + data.error_code);
                if (data.error_code == 'PostTooFrequent') {
                    $window.history.back();
                    $ionicPopup.alert({title: "Please don't re-post the same item within 48 hours"});
                }
            }
        );
    };

    $scope.confirm = function(){

        if ($localstorage.get('me_country') == 'Canada')
            $scope.data.classifieds_name = 'Kijiji';
        else
            $scope.data.classifieds_name = 'Craigslist';

        var promise = GameServ.post_to_kijiji_confirm($scope.data.collection_id, $scope.data.ad_posting_info.ad_title,
            $scope.data.ad_posting_info.price, $scope.data.ad_posting_info.ad_type, $scope.data.ad_posting_info.city,
            $scope.data.ad_posting_info.province, $scope.data.ad_posting_info.email, $scope.data.ad_posting_info.post_code,
            $scope.data.ad_posting_info.description, $scope.data.classifieds_name);
        promise.then(
            function (data){
                if (data.error_code == 'NoErrors') {
                    $window.history.back();
                    $ionicPopup.alert({title: "Your ad will be posted shortly. " +
                    "You will get an activation email from " + $scope.data.classifieds_name + ". " +
                    "Once you click activate from the email, your ad will be visible to public."});
                }
            }
            ,
            function (data){console.log('ERROR: while loading game profile ' + data.error_code);}
        );
    };

    $scope.init();
})


//--------------------------------------------------------------
//gamer related
//--------------------------------------------------------------

.controller('CollectionGamersListCtrl', function($scope, $state, $stateParams, GameServ, UtilServ) {
    $scope.data                             = {};
    $scope.data.current_page                = 0;
    $scope.data.items                       = 10;
    $scope.data.there_is_more               = false;
    $scope.data.gamers                      = [];
    $scope.data.gamers_placeholderpic_flag  = false;

    var valid_tab_names = ["search", "deals", "nearme", "chats", "me"];

    $scope.init = function(){
        $scope.data.current_page = 0;
        $scope.load_gamer();
    };

    $scope.load_more = function(){
        $scope.data.current_page++;
        $scope.load_gamer();
    };

    $scope.load_gamer = function(){
        var promise = GameServ.collection_by_game($stateParams.game_id, $stateParams.collect_as, $scope.data.items, $scope.data.current_page);
        promise.then(
            function(data){
                if (data.error_code === "NoErrors"){
                    $scope.data.gamers_placeholderpic_flag = false;
                    // if is end
                    if (data.gamers.length < $scope.data.items){
                        $scope.data.there_is_more = false;
                    }
                    else {
                        $scope.data.there_is_more = true;
                    }
                    // change unit
                    for(var i = 0; i < data.gamers.length; i++){
                        data.gamers[i].miles = UtilServ.distance_converter(data.gamers[i].miles);
                        data.gamers[i].collect_format_message = UtilServ.get_collect_format_message(data.gamers[i].collect_format);

                    }
                    // append to existing list
                    $scope.data.gamers = $scope.data.gamers.concat(data.gamers);
                    // must notify
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }
                else {
                    $scope.data.gamers_placeholderpic_flag = true;
                    $scope.data.gamerslist_message = UtilServ.get_error_message(data.error_code);
                }
            }
            ,
            function(data){console.log('ERROR: while loading who has/buys/sells game list ' + data.error_code);}
        );
    };

    $scope.goto_collection_profile_by_tab = function(collection_id){
        $scope.tab_name = $stateParams.tab_name;

        if (valid_tab_names.indexOf($scope.tab_name) >= 0){
            var routing_url = "tab." + $scope.tab_name + "_collection_profile";
            $state.go(routing_url, {collection_id:collection_id, tab_name: $scope.tab_name});
        }
        else {
            console.log("Current tab is not valid which is " + $scope.tab_name);
        }
    };

    $scope.init();
})

.controller('GamerProfileCtrl', function ($scope, $stateParams, $state, $http, $localstorage, $cordovaCamera, $cordovaFile, GameServ, AccountServ, ChatServ, UtilServ, $ionicHistory, $ionicActionSheet) {
    $scope.data                                 = {};
    $scope.data.gamer_id                        = $stateParams.gamer_id === 'undefined' ? 0 : $stateParams.gamer_id;
    $scope.data.gamer                           = {};
    $scope.data.collections_current_page        = 0;
    $scope.data.collections_items               = 20;
    $scope.data.collections_there_is_more       = false;
    $scope.data.collections                     = [];
    $scope.data.own_tab_active                  = false;
    $scope.data.offer_tab_active                = true;
    $scope.data.wish_tab_active                 = false;
    $scope.data.warning_flag                    = false;
    $scope.data.thread_id                       = $stateParams.thread_id === 'undefined' ? undefined : $stateParams.thread_id;
    $scope.data.collect_as_value                = 1;
    $scope.data.newpic_flag                     = false;
    $scope.data.gamer_profile_pic_flag          = undefined;
    $scope.data.gamer_email                     = undefined;
    $scope.data.gamer_name                      = undefined;
    $scope.data.gamer_description               = undefined;
    $scope.data.gamer_city                      = undefined;
    $scope.data.gamer_email                     = undefined;
    $scope.data.sell_placeholderpic_flag        = false;
    $scope.data.wish_placeholderpic_flag        = false;
    $scope.data.own_placeholderpic_flag         = false;
    $scope.data.backchat_flag                   = false;
    $scope.data.rate_score                      = "";

    var valid_tab_names     = ["search", "deals", "nearme", "chats", "me"];
    var valid_metric_status = ["sold", "bought", "favourite", "rate"];

    if ($ionicHistory.backView() === null){
        $scope.data.backchat_flag = true;
    }

    $scope.init = function(){
        $scope.data.me_id = $localstorage.getObject('me_id'); //Need to use this to disable the chat/favourites button
        var promise = GameServ.gamer_by_id($scope.data.gamer_id);
        promise.then(
            function(data){
                $scope.data.gamer = data.gamer;
                if ($scope.data.gamer.profile_pic === null){
                    $scope.data.gamer_profile_pic_link = "https://graph.facebook.com/" + $scope.data.gamer.fb_id + "/picture?type=normal";
                }
                else {
                    $scope.data.gamer_profile_pic_link = $scope.data.gamer.profile_pic;
                }
                // favourite or unfavourite
                if ($scope.data.gamer.fav_added === true)
                    $scope.data.favbutton = "Favourited";
                else
                    $scope.data.favbutton = "Favourite";

                // distance
                $scope.data.gamer.miles = UtilServ.distance_converter($scope.data.gamer.miles);

                // save the current values to scope temp to check if there are changes from edit profile
                $scope.data.gamer_name          = $scope.data.gamer.name;
                $scope.data.gamer_description   = $scope.data.gamer.description;
                $scope.data.gamer_city          = $scope.data.gamer.city;
                $scope.data.gamer_email         = $scope.data.gamer.email;
                $scope.data.image               = $scope.data.gamer_profile_pic_link;

                //calculate the star display
                var decimal_value = Math.round(($scope.data.gamer.rate_score - Math.floor($scope.data.gamer.rate_score)) * 10)/10;
                var rounded_value = Math.round(decimal_value/0.25)*0.25;
                $scope.data.rate_score = (parseInt($scope.data.gamer.rate_score) + rounded_value) * 100;
            }
            ,
            function(data){console.log('ERROR: while loading gamer profile ' + data.error_code);}
        );
    };

    $scope.init_collections = function(){
        $scope.data.collections_current_page = 0;
        $scope.load_collection_by_gamer();
    };

    $scope.load_more_collections = function(){
        $scope.data.collections_current_page++;
        $scope.load_collection_by_gamer();
    };

    $scope.load_collection_by_gamer = function(){
        var promise = GameServ.collection_by_gamer($scope.data.gamer_id, $scope.data.collect_as_value, $scope.data.collections_items, $scope.data.collections_current_page);
        promise.then(
            function(data){
                $scope.data.error_code = data.error_code;
                if ($scope.data.error_code === "NoErrors"){
                    if ($scope.data.collect_as_value === 1) {
                        $scope.data.sell_placeholderpic_flag = false;
                        for(var i=0; i<data.collections.length; i++){
                            data.collections[i].collect_format_message = UtilServ.get_collect_format_message(data.collections[i].collect_format);
                        }
                    }
                    else if ($scope.data.collect_as_value === 2) {
                        $scope.data.wish_placeholderpic_flag = false;
                    }
                    else if ($scope.data.collect_as_value === 3) {
                        $scope.data.own_placeholderpic_flag = false;
                    }
                    // go over the list
                    for(var i=0; i<data.collections.length; i++){
                        data.collections[i].collect_as_message = UtilServ.get_collect_as_message(data.collections[i].collect_as);
                    }
                    // if is end
                    if (data.collections.length < $scope.data.collections_items){
                        $scope.data.collections_there_is_more = false;
                    }
                    else {
                        $scope.data.collections_there_is_more = true;
                    }
                    // append
                    $scope.data.collections = $scope.data.collections.concat(data.collections);
                    // must notify
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }
                else {
                    if ($scope.data.collect_as_value === 1) {
                        $scope.data.sell_placeholderpic_flag = true;
                    }
                    else if ($scope.data.collect_as_value === 2) {
                        $scope.data.wish_placeholderpic_flag = true;
                    }
                    else if ($scope.data.collect_as_value === 3) {
                        $scope.data.own_placeholderpic_flag = true;
                    }
                    if ($scope.data.me_id != $scope.data.gamer.gamer_id){
                        var gamerprofile_error_code = $scope.data.error_code + "_others";
                        $scope.data.collection_by_gamer_message = UtilServ.get_error_message(gamerprofile_error_code);
                    }
                    else {
                        $scope.data.collection_by_gamer_message = UtilServ.get_error_message($scope.data.error_code);
                    }
                }
            }
            ,
            function(data){console.log('ERROR: while loading collections for gamer ' + data.error_code);}
        )
    };

    $scope.decide_shown_list = function(collect_as){
        if (collect_as === "have" && $scope.data.own_tab_active === false){
            $scope.data.collect_as_value            = 3;
            $scope.data.collections                 = [];
            $scope.data.own_tab_active              = true;
            $scope.data.offer_tab_active            = false;
            $scope.data.wish_tab_active             = false;
            $scope.data.sell_placeholderpic_flag    = false;
            $scope.data.wish_placeholderpic_flag    = false;
            $scope.data.own_placeholderpic_flag     = false;
            $scope.init_collections();
        }
        else if (collect_as === "sell" && $scope.data.offer_tab_active === false){
            $scope.data.collect_as_value            = 1;
            $scope.data.collections                 = [];
            $scope.data.own_tab_active              = false;
            $scope.data.offer_tab_active            = true;
            $scope.data.wish_tab_active             = false;
            $scope.data.sell_placeholderpic_flag    = false;
            $scope.data.wish_placeholderpic_flag    = false;
            $scope.data.own_placeholderpic_flag     = false;
            $scope.init_collections();
        }
        else if (collect_as === "buy" && $scope.data.wish_tab_active === false){
            $scope.data.collect_as_value            = 2;
            $scope.data.collections                 = [];
            $scope.data.own_tab_active              = false;
            $scope.data.offer_tab_active            = false;
            $scope.data.wish_tab_active             = true;
            $scope.data.sell_placeholderpic_flag    = false;
            $scope.data.wish_placeholderpic_flag    = false;
            $scope.data.own_placeholderpic_flag     = false;
            $scope.init_collections();
        }       
        else {
            console.log("Invalid list name");
        }
    };

    $scope.gamer_editprofile = function(){
        if (($scope.data.gamer.email != undefined && $scope.data.gamer.email.indexOf(".") === -1) && $scope.data.gamer.email != ""){
            $scope.data.warning_flag = true;
            $scope.data.emailalert = "The input email address is missing '.'";
        }
        else if($scope.data.gamer.email === $scope.data.gamer_email && $scope.data.gamer.city === $scope.data.gamer_city && $scope.data.gamer.name === $scope.data.gamer_name && $scope.data.gamer.description === $scope.data.gamer_description && $scope.data.newpic_flag === false){
            $state.go('tab.me');
        } 
        // profile picture update only
        else if ($scope.data.gamer.email === $scope.data.gamer_email && $scope.data.gamer.city === $scope.data.gamer_city && $scope.data.gamer.name === $scope.data.gamer_name && $scope.data.gamer.description === $scope.data.gamer_description && $scope.data.newpic_flag === true){
            var promise = GameServ.gamer_uploadpic($scope.data.image);
            promise.then(
                function(response){
                    $scope.data.newpic_flag = false;
                    $state.go('tab.me');
                }
                ,
                function(response){console.log('ERROR: while uploading gamer profile picture ' + response.result);}
            )
        }
        // anything without profile picture change
        else if (($scope.data.gamer.email != $scope.data.gamer_email || $scope.data.gamer.city != $scope.data.gamer_city || $scope.data.gamer.name != $scope.data.gamer_name || $scope.data.gamer.description != $scope.data.gamer_description) && $scope.data.newpic_flag === false){
            var promise = GameServ.gamer_editprofile($scope.data.gamer.name, $scope.data.gamer.email, $scope.data.gamer.city, $scope.data.gamer.description);
            promise.then(
                function(data){
                    $state.go('tab.me')
                }
                ,
                function(data){console.log('ERROR: while updating the gamer profile ' + data.error_code);}
            );   
        }
        // both profile picture and string changed
        else {
            var promise = GameServ.gamer_uploadpic($scope.data.image);
            promise.then(
                function(response){
                    $scope.data.newpic_flag = false;
                    var promise = GameServ.gamer_editprofile($scope.data.gamer.name, $scope.data.gamer.email, $scope.data.gamer.city, $scope.data.gamer.description);
                    promise.then(
                        function(data){
                            $state.go('tab.me')
                        }
                        ,
                        function(data){console.log('ERROR: while uploading gamer profile picture ' + data.error_code);}
                    );
                }
                ,
                function(response){console.log('ERROR: while uploading gamer profile picture ' + response.result);}
            )
        }
    };

    $scope.edit_photo = function() {
        // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
            buttons: [
                { text: 'Photo Library' },
                { text: 'Take Photo' }
            ],
            //destructiveText: 'Delete',
            //titleText: 'Modify your album',
            cancelText: 'Cancel',
            cancel: function() {
                console.log('test');
            },
            buttonClicked: function(index) {
                console.log("clicked");
                if (index === 0){
                    $scope.select_photo();
                }
                else if (index === 1){
                    $scope.take_photo();
                }
                else{
                    console.log("unexpected index is " + index);
                }
                return true;
            }
        });

        // For example's sake, hide the sheet after two seconds
        //$timeout(function() {
        //    hideSheet();
        //}, 3000);
    };

    $scope.select_photo = function() {
        var options = {
            quality         : 50,
            destinationType : Camera.DestinationType.FILE_URI,
            sourceType      : Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit       : true,
            encodingType    : Camera.EncodingType.JPEG,
            targetWidth     : 320,
            targetHeight    : 320
        };

        $cordovaCamera.getPicture(options).then( function(fileURI) {
                //window.resolveLocalFileSystemURI(fileURI, function(fileEntry) {
                //    //$scope.picData = fileEntry.nativeURL;
                //    //$scope.ftLoad = true;
                //    //var image = document.getElementById('myImage');
                //    //image.src = fileEntry.nativeURL;
                //    $scope.data.image = fileEntry.nativeURL;
                //    $scope.data.newpic_flag = true;
                //});
                window.resolveLocalFileSystemURL(fileURI, copyFile, fail);

                // copy file from temp folder to library folder
                function copyFile(fileEntry) {
                    var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
                    var newName = makeid() + name;

                    window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
                            fileEntry.copyTo(
                                fileSystem2,
                                newName,
                                onCopySuccess,
                                fail
                            );
                        },
                        fail);
                }

                function onCopySuccess(entry) {
                    $scope.$apply(function () {
                        $scope.data.image = entry.nativeURL;
                        $scope.data.newpic_flag = true;
                    });
                }

                function fail(error) {
                    console.log("fail: " + error.code);
                }

                // Generate random 5 digits and add to the file name
                function makeid() {
                    var text = "";
                    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                    for (var i=0; i < 5; i++) {
                        text += possible.charAt(Math.floor(Math.random() * possible.length));
                    }
                    return text;
                }

            }, function(err){
                console.log('ERROR on select photo');
            });
    };

    $scope.take_photo = function() {
        var options = {
            quality         : 50,
            destinationType : Camera.DestinationType.FILE_URI,
            sourceType      : Camera.PictureSourceType.CAMERA, // Camera.PictureSourceType.PHOTOLIBRARY
            allowEdit       : true,
            encodingType    : Camera.EncodingType.JPEG,
            popoverOptions  : CameraPopoverOptions,
            saveToPhotoAlbum: true,
            targetWidth     : 320,
            targetHeight    : 320,
            cameraDirection : 1
        };

        $cordovaCamera.getPicture(options).then(function(imageData){
            onImageSuccess(imageData);

            function onImageSuccess(fileURI) {
                createFileEntry(fileURI);
            }
 
            function createFileEntry(fileURI) {
                window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
            }

            // copy file from temp folder to library folder
            function copyFile(fileEntry) {
                var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
                var newName = makeid() + name;

                window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
                    fileEntry.copyTo(
                        fileSystem2,
                        newName,
                        onCopySuccess,
                        fail
                    );
                },
                fail);
            }

            function onCopySuccess(entry) {
                $scope.$apply(function () {
                    $scope.data.image = entry.nativeURL;
                    $scope.data.newpic_flag = true;
                });
            }
 
            function fail(error) {
                console.log("fail: " + error.code);
            }
            // Generate random 5 digits and add to the file name
            function makeid() {
                var text = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
 
                for (var i=0; i < 5; i++) {
                    text += possible.charAt(Math.floor(Math.random() * possible.length));
                }
                return text;
            }
 
        }, function(err) {
            console.log(err);
        }
        );
    };

    $scope.gamer_favourite_add = function(){
        $scope.data.favbutton        = "Favourited";
        $scope.data.gamer.fav_added  = true;

        var promise = GameServ.gamer_favourite_add($scope.data.gamer_id);
        promise.then(
            function(data){console.log('Okay');}
            ,
            function(data){console.log('ERROR: while favourite a gamer ' + data.error_code);}
        );
    };

    $scope.gamer_favourite_remove = function(){
        $scope.data.favbutton          = "Favourite";
        $scope.data.gamer.fav_added    = false;

        var promise = GameServ.gamer_favourite_remove($scope.data.gamer_id);
        promise.then(
            function(data){console.log('Okay');}
            ,
            function(data){console.log('ERROR: while unfavourite a gamer ' + data.error_code);}
        )
    };

    $scope.click_favourite_unfavourite_button = function(){
        if ($scope.data.gamer.fav_added === false){
            $scope.gamer_favourite_add();
        }
        else if ($scope.data.gamer.fav_added === true){
            $scope.gamer_favourite_remove();
        }
        else {
            console.log("Invalid list name");
        }
    };

    $scope.goto_chat_thread_add = function(){
        $ionicHistory.nextViewOptions({
            disableBack: true
        });

        var promise = ChatServ.thread_add($scope.data.gamer_id);
        promise.then(
            function(data){
                $state.go('chat', {thread_id: data.thread.thread_id, partner_id: $scope.data.gamer_id});
            }
            ,
            function(data){console.log('ERROR: while adding thread ' + data.error_code);}
        );
    };

    $scope.goto_collection_profile_by_tab = function(collection_id, tab_name){
        $scope.tab_name = tab_name === undefined ? $stateParams.tab_name : tab_name;

        if (valid_tab_names.indexOf($scope.tab_name) >= 0){
            var routing_url = "tab." + $scope.tab_name + "_collection_profile"
            $state.go(routing_url, {collection_id:collection_id, tab_name:$scope.tab_name});
        }
        else {
            console.log("ERROR: in GamerProfileCtrl goto_collection_profile_by_tab, current tab is not valid which is " + $scope.tab_name);
        }
    };

    $scope.goto_game_profile_by_tab = function(game_id, tab_name){
        $scope.tab_name = tab_name === undefined ? $stateParams.tab_name : tab_name;

        if (valid_tab_names.indexOf($scope.tab_name) >= 0){
            var routing_url = "tab." + $scope.tab_name + "_game_profile"
            $state.go(routing_url, {game_id:game_id, tab_name:$scope.tab_name});
        }
        else {
            console.log("ERROR: in GamerProfileCtrl goto_game_profile_by_tab, current tab is not valid which is " + $scope.tab_name);
        }
    };

    $scope.goto_gamer_gamemetrics_by_type = function (metric, tab_name){
        $scope.tab_name = tab_name === undefined ? $stateParams.tab_name : tab_name;
        console.log($scope.tab_name);

        if (valid_metric_status.indexOf(metric) >=0 && valid_metric_status.indexOf(metric) < 2){
            var routing_url = "tab." + $scope.tab_name + "_gamer_gamemetrics";
            metric = valid_metric_status.indexOf(metric);
            $state.go(routing_url, {gamer_id: $scope.data.gamer.gamer_id, gamer_name: $scope.data.gamer.name, metric: parseInt(metric), tab_name: $scope.tab_name});
        }
        else if (valid_metric_status.indexOf(metric) == 2){
            var routing_url = "tab." + $scope.tab_name + "_gamer_favourite";
            $state.go(routing_url, {gamer_id: $scope.data.gamer.gamer_id, tab_name: $scope.tab_name});
        }
        else if (valid_metric_status.indexOf(metric) == 3){
            var routing_url = "tab." + $scope.tab_name + "_gamer_rate";
            $state.go(routing_url, {gamer_id: $scope.data.gamer.gamer_id, tab_name: $scope.tab_name});
        }
        else{
            console.log("Current metric_status is not valid which is " + metric);
        }
    };


    $scope.init();
    $scope.init_collections();
})

.controller('GamerMetricsListCtrl', function($scope, $state, $stateParams, GameServ, UtilServ) {
    $scope.data                                 = {};
    $scope.data.current_page                    = 0;
    $scope.data.items                           = 20;
    $scope.data.there_is_more                   = false;
    $scope.data.record_detail_list              = [];
    $scope.data.gamemetrics_placeholderpic_flag = false;
    $scope.data.metric                          = $stateParams.metric;

    var valid_tab_names     = ["search", "deals", "nearme", "chats", "me"];

    $scope.init = function(){
        if (parseInt($scope.data.metric) === 0 && $stateParams.tab_name === 'me'){
            $scope.data.page_title = "Games Sold by You";
        }
        else if (parseInt($scope.data.metric) === 1 && $stateParams.tab_name === 'me'){
            $scope.data.page_title = "Games Bought by You";
        }
        else if (parseInt($scope.data.metric) === 0 && $stateParams.tab_name != 'me'){
            $scope.data.page_title = "Games Sold by " + $stateParams.gamer_name;
        }
        else{
            $scope.data.page_title = "Games Bought by " + $stateParams.gamer_name;
        }
        $scope.data.current_page = 0;
        $scope.load_gamer();
    };

    $scope.load_more = function(){
        $scope.data.current_page++;
        $scope.load_gamer();
    };

    $scope.load_gamer = function(){
        var promise = GameServ.gamer_deal_record($stateParams.gamer_id, $scope.data.metric, $scope.data.items, $scope.data.current_page);
        promise.then(
            function(data){
                $scope.data.error_code = data.error_code;
                if ($scope.data.error_code === "NoErrors"){
                    $scope.data.gamemetrics_placeholderpic_flag = false;
                    // if is end
                    if (data.record_detail_list.length < $scope.data.items){
                        $scope.data.there_is_more = false;
                    }
                    else{
                        $scope.data.there_is_more = true;
                    }
                    // append to existing list
                    $scope.data.record_detail_list = $scope.data.record_detail_list.concat(data.record_detail_list);
                    // must notify
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }
                else{
                    $scope.data.gamemetrics_placeholderpic_flag = true;
                    $scope.data.GamerMetricsListCtrl_message = UtilServ.get_error_message($scope.data.error_code);
                }
            }
            ,
            function(data){console.log('ERROR: while loading gamer sold/bought ' + data.error_code);}
        );
    };

    $scope.goto_game_profile_by_tab = function (game_id) {
        $scope.data.tab_name = $stateParams.tab_name;
        if (valid_tab_names.indexOf($scope.data.tab_name) >= 0){
            var routing_url = "tab." + $scope.data.tab_name + "_game_profile"
            $state.go(routing_url, {game_id: game_id, tab_name: $scope.data.tab_name});
        }
        else {
            console.log("ERROR: in GamerGameMetricsListCtrl goto_game_profile_by_tab, current tab is not valid which is " + $scope.data.tab_name);
        }    
    };

    $scope.init();
})

.controller('GameRankCtrl', function($scope, $state, $stateParams, GameServ, UtilServ) {
    $scope.data                                 = {};
    $scope.data.collections_ranking             = [];
    $scope.data.page_title                      = "";
    $scope.data.collect_as                      = $stateParams.collect_as;
    $scope.data.gamerank_placeholderpic_flag    = false;

    var valid_tab_names = ["search", "deals", "nearme", "chats", "me"];

    $scope.get_page_title = function(){
        if ($scope.data.collect_as == '1')
            return 'Top 10 games for sale nearby';
        else if ($scope.data.collect_as == '2')
            return 'Top 10 wanted games nearby';
        else if ($scope.data.collect_as == '3')
            return 'Top 10 owned games nearby';
    };

    $scope.init = function(){
        $scope.data.page_title = $scope.get_page_title();

        var promise = GameServ.game_by_collect_as($stateParams.collect_as);
        promise.then(
            function(data){
                $scope.data.error_code = data.error_code;
                if ($scope.data.error_code === "NoErrors"){
                    $scope.data.gamerank_placeholderpic_flag = false;
                    $scope.data.collections_ranking = data.games;
                }
                else {
                    $scope.data.gamerank_placeholderpic_flag = true;
                    $scope.data.GameRankCtrl_message = UtilServ.get_error_message($scope.data.error_code);
                }
            }
            ,
            function(data){console.log('ERROR: while loading game rank list ' + data.error_code);}
        )
    };

    $scope.goto_game_profile_by_tab = function (game_id, tab_name) {
        if (valid_tab_names.indexOf(tab_name) >= 0){
            var routing_url = "tab." + tab_name + "_game_profile";
            $state.go(routing_url, {game_id: game_id, tab_name: tab_name});
        }
        else {
            console.log("ERROR: in CollectionListCtrl goto_game_profile_by_tab, current tab is not valid which is " + tab_name);
        }    
    };

    $scope.init();
})

.controller('GamerMetricsFavouriteCtrl', function($scope, $state, $stateParams, GameServ, UtilServ) {
    $scope.data                                 = {};
    $scope.data.gamer_id                        = $stateParams.gamer_id === 'undefined' ? 0 : $stateParams.gamer_id;
    $scope.data.gamer                           = {};
    $scope.data.favourite_current_page          = 0;
    $scope.data.favourite_items                 = 30;
    $scope.data.favourite_there_is_more         = false;
    $scope.data.favourite                       = [];
    $scope.data.favourite_placeholderpic_flag   = false;

    var valid_tab_names = ["search", "deals", "nearme", "chats", "me"];

    $scope.init = function(){
        $scope.data.favourite_current_page = 0;
        $scope.load_favourite();
    };

    $scope.load_more_favourite = function(){
        $scope.data.favourite_current_page++;
        $scope.load_favourite();
    };

    $scope.load_favourite = function(){
        var promise = GameServ.favourite_by_gamer($scope.data.gamer_id, $scope.data.favourite_items, $scope.data.favourite_current_page);
        promise.then(
            function(data){
                $scope.data.error_code = data.error_code;
                if ($scope.data.error_code === "NoErrors"){
                    $scope.data.favourite_placeholderpic_flag = false;
                    // if is end
                    if (data.favourite.length < $scope.data.favourite_items){
                        $scope.data.favourite_there_is_more = false;
                    }
                    else {
                        $scope.data.favourite_there_is_more = true;
                    }
                    // append
                    $scope.data.favourite = $scope.data.favourite.concat(data.favourite);
                    // must notify
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }
                else {
                    $scope.data.favourite_placeholderpic_flag = true;
                    $scope.data.GamerMetricsFavouriteCtrl_message = UtilServ.get_error_message($scope.data.error_code);
                }
            }
            ,
            function(data){console.log('ERROR: while loading favourites by gamer ' + data.error_code);}
        )
    };

    $scope.goto_gamer_profile_by_tab = function (gamer_id) {
        if (valid_tab_names.indexOf($stateParams.tab_name) >= 0){
            var routing_url = "tab." + $stateParams.tab_name + "_gamer_profile";
            $state.go(routing_url, {gamer_id: gamer_id, tab_name: $stateParams.tab_name});
        }
        else {
            console.log("ERROR: current tab is not valid which is " + $stateParams.tab_name);
        }    
    };

    $scope.init();
})

.controller('GamerMetricsRateCtrl', function($scope, $state, $stateParams, $localstorage, GameServ, UtilServ) {
    $scope.data                             = {};
    $scope.data.gamer_id                    = $stateParams.gamer_id === 'undefined' ? 0 : $stateParams.gamer_id;
    $scope.data.gamer                       = {};
    $scope.data.rate_current_page           = 0;
    $scope.data.rate_items                  = 20;
    $scope.data.rate_there_is_more          = false;
    $scope.data.rates                       = [];
    $scope.data.rates_placeholderpic_flag   = false;

    var valid_tab_names = ["search", "deals", "nearme", "chats", "me"];

    $scope.init = function(){
        $scope.data.rate_current_page = 0;
        $scope.load_rate();
    };

    $scope.load_more_rate = function(){
        $scope.data.rate_current_page++;
        $scope.load_rate();
    };

    $scope.load_rate = function(){
        $scope.data.me_id = $localstorage.getObject('me_id'); //Need to use this to disable the chat/like button
        var promise = GameServ.rate_by_gamer($scope.data.gamer_id, $scope.data.rate_items, $scope.data.rate_current_page);
        promise.then(
            function(data){
                $scope.data.error_code = data.error_code;
                if ($scope.data.error_code === "NoErrors"){
                    $scope.data.rates_placeholderpic_flag = false;
                    // if is end
                    if (data.rates.length < $scope.data.rate_items){
                        $scope.data.rate_there_is_more = false;
                    }
                    else{
                        $scope.data.rate_there_is_more = true;
                    }
                    // append
                    $scope.data.rates = $scope.data.rates.concat(data.rates);
                    // must notify
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }
                else {
                    $scope.data.rates_placeholderpic_flag = true;
                    if ($scope.data.me_id != $scope.data.gamer_id){
                        var rates_error_code = $scope.data.error_code + "_others";
                        $scope.data.GamerMetricsRatesCtrl_message = UtilServ.get_error_message(rates_error_code);
                    }
                    else {
                        $scope.data.GamerMetricsRatesCtrl_message = UtilServ.get_error_message($scope.data.error_code);
                    }
                }
            }
            ,
            function(data){console.log('ERROR: while loading reviews by gamer ' + data.error_code);}
        )
    };

    $scope.goto_gamer_profile_by_tab = function (gamer_id) {
        if (gamer_id != null){
            if (valid_tab_names.indexOf($stateParams.tab_name) >= 0){
                var routing_url = "tab." + $stateParams.tab_name + "_gamer_profile";
                $state.go(routing_url, {gamer_id: gamer_id, tab_name: $stateParams.tab_name});
            }
            else {
                console.log("ERROR: in GamerMetricsRatesCtrl goto_gamer_profile_by_tab, current tab is not valid which is " + $stateParams.tab_name);
            }
        }
    };

    $scope.init();
});
//EOF