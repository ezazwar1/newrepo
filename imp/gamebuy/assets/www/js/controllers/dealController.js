angular.module('deal.controllers', [])

// Deal list
.controller('DealListCtrl', function($scope, $state, DealServ, UtilServ, $ionicHistory, $ionicScrollDelegate){
    $scope.data                              = {};

    $scope.data.watches                      = [];
    $scope.data.watches_placeholderpic_flag  = false;
    $scope.data.watches_active               = false;

    $scope.data.deals                        = [];
    $scope.data.deals_placeholderpic_flag    = false;
    $scope.data.deals_active                 = true;


    // the valid tab names for page navigation
    var valid_tab_names = ["deals"];

    $scope.$on('$ionicView.enter', function(){
        console.log("-------------------------- in deal tab");
        console.log("-------------------------- forward view " + $ionicHistory.forwardView());

        if ($ionicHistory.forwardView() != null) {
            console.log(JSON.stringify($ionicHistory.forwardView().stateName));

            if (JSON.stringify($ionicHistory.forwardView().stateName) != '"tab.deals_deal_profile"') {
                console.log("++++++++");
                if ($scope.data.deals_active === true) {
                    $ionicHistory.clearCache();
                    $scope.init_all_deals();
                    console.log($ionicHistory.forwardView());
                }
            }
        }
    });

    // init tab_deals.html
    $scope.init_all_watches = function(){
        // return to the top after tab switch, since not in-house cache is used
        if ($scope.data.tab_switch_towatch === true){
            $ionicScrollDelegate.scrollTop(false);
        }

        var promise = DealServ.watch_by_gamer();
        promise.then(
            function(data){
                if (data.error_code === "NoErrors"){
                    $scope.data.watches_placeholderpic_flag = false;
                    for (var i = 0; i < data.watches.length; i++){
                        // calculate time ago
                        data.watches[i].updated_on_ago = UtilServ.time_since(data.watches[i].updated_on);
                        // change unit
                        data.watches[i].miles = UtilServ.distance_converter(data.watches[i].miles);
                        data.watches[i].collect_format_message = UtilServ.get_collect_format_message(data.watches[i].collect_format);
                    }
                    $scope.data.watches = data.watches;
                }
                else {
                    $scope.data.watches_placeholderpic_flag = true;
                    $scope.data.watches_message = UtilServ.get_error_message(data.error_code);
                }
            }
            ,
            function (data) {
                console.log('ERROR: while loading deal list ' + data.error_code);
            }
        );
    };

    // init tab_deals.html
    $scope.init_all_deals = function(){
        // return to the top after tab switch, since not in-house cache is used
        if ($scope.data.tab_switch_todeal === true){
            $ionicScrollDelegate.scrollTop(false);
        }

        console.log("init_all_deals is called");
        var promise = DealServ.deal_by_gamer();
        promise.then(
            function(data){
                if (data.error_code === "NoErrors"){
                    $scope.data.deals_placeholderpic_flag = false;

                    for (var i = 0; i < data.deals.length; i++){
                        // calculate if deal should be highlighted
                        if (data.deals[i].my_role === 'buyer' && data.deals[i].status === 'accept'){
                            data.deals[i].highlight = true;
                        } 
                        else if (data.deals[i].my_role === 'seller' && data.deals[i].status === 'request'){
                            data.deals[i].highlight = true;
                        }
                        else{
                            data.deals[i].highlight = false;
                        }
                        // calculate time ago
                        data.deals[i].updated_on_ago = UtilServ.time_since(data.deals[i].updated_on);
                        // get better status message
                        data.deals[i].status_message = UtilServ.get_deal_status_message(data.deals[i].status);
                        data.deals[i].collect_format_message = UtilServ.get_collect_format_message(data.deals[i].collection.collect_format);
                        // trade type
                        data.deals[i].trade_type = data.deals[i].use_credit ? 'Online trade' : 'Cash trade';
                    }
                    $scope.data.deals = data.deals;
                }
                else {
                    $scope.data.deals_placeholderpic_flag = true;
                    $scope.data.deals_message = UtilServ.get_error_message(data.error_code);
                }
            }
            ,
            function (data) {
                console.log('ERROR: while loading deal list ' + data.error_code);
            }
        );
    };

    $scope.decide_shown_list = function(list_name){
        if (list_name === 1 && $scope.data.watches_active === false){
            $scope.data.watches                 = [];
            $scope.data.watches_active          = true;
            $scope.data.deals_active            = false;

            // for tab switch check condition
            $scope.data.tab_switch_todeal       = false;
            $scope.data.tab_switch_towatch      = true;

            $scope.init_all_watches();
        }
        else if (list_name === 2 && $scope.data.deals_active === false){
            $scope.data.deals                   = [];
            $scope.data.watches_active          = false;
            $scope.data.deals_active            = true;

            // for tab switch check condition
            $scope.data.tab_switch_towatch      = false;
            $scope.data.tab_switch_todeal       = true;

            $scope.init_all_deals();
        }
        else {
            console.log("tab did not change");
        }
    };

    //Navigate to deal_profile.html
    $scope.goto_deal_profile_by_tab = function(deal_id, tab_name){
        if(valid_tab_names.indexOf(tab_name) >= 0){
            var routing_url = "tab." + tab_name + "_deal_profile";
            $state.go(routing_url, {deal_id: deal_id, tab_name: tab_name});
        }
        else{
            console.log("ERROR: current tab is not valid which is " + tab_name);
        }
    };
    //Navigate to deal_profile.html
    $scope.goto_collection_profile_by_tab = function(collection_id, tab_name){
        if(valid_tab_names.indexOf(tab_name) >= 0){
            var routing_url = "tab." + tab_name + "_collection_profile";
            $state.go(routing_url, {collection_id: collection_id, tab_name: tab_name});
        }
        else{
            console.log("ERROR: current tab is not valid which is " + tab_name);
        }
    };

    //Navigate to nearme tab
    $scope.goto_nearme_tab = function() {
        $state.go('tab.nearme');
    };

    $scope.init_all_deals();
})

// All activities on deal profile
.controller('DealProfileCtrl', function($scope, $state, $stateParams, $ionicPopup, DealServ, GameServ, ChatServ, UtilServ, $localstorage, $ionicBackdrop, $ionicHistory, $timeout, $ionicLoading) {
    $scope.data                     = {};
    $scope.data.deal                = {};
    $scope.data.partner             = {};
    $scope.data.partner_role        = undefined;
    $scope.data.terminate_button    = '\u2002'; // unicode space to hold place
    $scope.data.proceed_button      = '\u2002'; // unicode space to hold place
    $scope.data.firstbuttondisable  = false;
    $scope.data.secondbuttondisable = false;
    $scope.data.rate_score          = 0;
    $scope.data.rate_comment        = "";

    $scope.data.temp_button_disable = false;

    var valid_tab_names    = ["search", "deals", "nearme", "chats"];
    var button_names       = ["Abort", "Accept", "Reject", "Receive", "Provide Rating", "Close"];

    $scope.init = function () {
        var deal_id = $stateParams.deal_id;
        var promise = DealServ.deal_by_id(deal_id);
        promise.then(
            function (data) {
                $scope.data.temp_button_disable = false;
                $scope.data.deal = data.deal;
                $scope.action_router();
                $scope.data.deal.miles = UtilServ.distance_converter($scope.data.deal.miles);
                $scope.data.deal.collect_format_message = UtilServ.get_collect_format_message($scope.data.deal.collection.collect_format);
                if ($scope.data.deal.my_role === "seller"){
                    $scope.data.partner = $scope.data.deal.buyer;
                    $scope.data.partner_role = "Buyer";
                    if ($scope.data.deal.buyer.profile_pic === null){
                        $scope.data.gamer_profile_pic_link = "https://graph.facebook.com/" + $scope.data.deal.buyer.fb_id + "/picture?type=normal";
                    }
                    else {
                        $scope.data.gamer_profile_pic_link = $scope.data.deal.buyer.profile_pic;
                    }
                }
                else{
                    $scope.data.partner = $scope.data.deal.seller;
                    $scope.data.partner_role = "Seller";
                    if ($scope.data.deal.seller.profile_pic === null){
                        $scope.data.gamer_profile_pic_link = "https://graph.facebook.com/" + $scope.data.deal.seller.fb_id + "/picture?type=normal";
                    }
                    else {
                        $scope.data.gamer_profile_pic_link = $scope.data.deal.seller.profile_pic;
                    }
                }
                // convert the deal action name to readable message for deal history
                for (var i=0; i<$scope.data.deal.deal_history.length; i++){
                    $scope.data.deal.deal_history[i].history_message = UtilServ.get_deal_status_history_message($scope.data.deal.deal_history[i].action,
                        $scope.data.deal.listing_price, $scope.data.deal.price_unit, $scope.data.deal.use_credit);
                }
            }
            ,
            function (data) {
                console.log('ERROR: while loading deal profile ' + data.error_code);
            }
        );
    };

    $scope.action_router = function() {
        if ($scope.data.deal.my_role === "buyer" && $scope.data.deal.status === "request"){
            $scope.data.firstbuttondisable          = false;
            $scope.data.secondbuttondisable         = true;
            $scope.data.terminate_button            = button_names[0];
            $scope.data.proceed_button              = UtilServ.get_deal_unaction_display_message("buyer_request");
            $scope.deal_terminate_activity_router   = $scope.deal_buyer_withdraw;
        }
        else if ($scope.data.deal.my_role === "buyer" && $scope.data.deal.status === "accept"){
            $scope.data.firstbuttondisable          = false;
            $scope.data.secondbuttondisable         = false;
            $scope.data.terminate_button            = button_names[0];
            $scope.data.proceed_button              = button_names[3];
            $scope.deal_proceeed_activity_router    = $scope.deal_receive;
            $scope.deal_terminate_activity_router   = $scope.deal_buyer_cancel;
        }
        else if($scope.data.deal.my_role === "buyer" && ($scope.data.deal.status === "buyer_withdraw" || $scope.data.deal.status === "seller_reject")){
            $scope.data.firstbuttondisable          = false;
            $scope.data.secondbuttondisable         = true;
            $scope.data.terminate_button            = button_names[5];
            $scope.data.proceed_button              = UtilServ.get_deal_unaction_display_message("delete");
            $scope.deal_terminate_activity_router   = $scope.deal_buyer_delete_action;
        }
        else if($scope.data.deal.my_role === "buyer" && $scope.data.deal.buyer_rated === false){
            $scope.data.firstbuttondisable          = true;
            $scope.data.secondbuttondisable         = false;
            $scope.data.terminate_button            = UtilServ.get_deal_unaction_display_message("close");
            $scope.data.proceed_button              = button_names[4];
            $scope.deal_proceeed_activity_router    = $scope.show_action_popup;
        }
        else if($scope.data.deal.my_role === "buyer"){
            $scope.data.firstbuttondisable          = false;
            $scope.data.secondbuttondisable         = true;
            $scope.data.terminate_button            = button_names[5];
            $scope.data.proceed_button              = UtilServ.get_deal_unaction_display_message("delete_rate");
            $scope.deal_terminate_activity_router   = $scope.deal_buyer_delete_action;
        }
        else if($scope.data.deal.my_role === "seller" && $scope.data.deal.status === "request"){
            $scope.data.firstbuttondisable          = false;
            $scope.data.secondbuttondisable         = false;
            $scope.data.terminate_button            = button_names[2];
            $scope.data.proceed_button              = button_names[1];
            $scope.deal_proceeed_activity_router    = $scope.deal_seller_accept;
            $scope.deal_terminate_activity_router   = $scope.deal_seller_reject;
        }
        else if($scope.data.deal.my_role === "seller" && ($scope.data.deal.status === "buyer_withdraw" || $scope.data.deal.status === "seller_reject")){
            $scope.data.firstbuttondisable          = false;
            $scope.data.secondbuttondisable         = true;
            $scope.data.terminate_button            = button_names[5];
            $scope.data.proceed_button              = UtilServ.get_deal_unaction_display_message("delete");
            $scope.deal_terminate_activity_router   = $scope.deal_seller_delete_action;
        }
        else if($scope.data.deal.my_role === "seller" && $scope.data.deal.status === "accept"){
            $scope.data.firstbuttondisable          = false;
            $scope.data.secondbuttondisable         = true;
            $scope.data.terminate_button            = button_names[0];
            $scope.data.proceed_button              = UtilServ.get_deal_unaction_display_message("seller_accept");
            $scope.deal_terminate_activity_router   = $scope.deal_seller_cancel;
        }
        else if($scope.data.deal.my_role === "seller" && $scope.data.deal.seller_rated === false){
            $scope.data.firstbuttondisable          = true;
            $scope.data.secondbuttondisable         = false;
            $scope.data.terminate_button            = UtilServ.get_deal_unaction_display_message("close");
            $scope.data.proceed_button              = button_names[4];
            $scope.deal_proceeed_activity_router    = $scope.show_action_popup;
        }
        else if ($scope.data.deal.my_role === "seller"){
            $scope.data.firstbuttondisable          = false;
            $scope.data.secondbuttondisable         = true;
            $scope.data.terminate_button            = button_names[5];
            $scope.data.proceed_button              = UtilServ.get_deal_unaction_display_message("delete_rate");
            $scope.deal_terminate_activity_router   = $scope.deal_seller_delete_action;
        }
        else{
            console.log("ERROR: Caught unexpected condition is " + $scope.data.deal.my_role + " and status is " + $scope.data.deal.status);
        }
    };

    $scope.loading_effect = function(){
        $ionicLoading.show({
            template: '<ion-spinner icon="ripple"></ion-spinner>',
            hideOnStageChange: true
        });
    };

    //Seller activity popup to confirm, accept the deal
    $scope.deal_seller_accept = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Are you sure you want to accept this offer?'
        });
        confirmPopup.then(function(res) {
            if(res) {
                $scope.data.temp_button_disable = true;
                $scope.loading_effect();
                $scope.deal_seller_accept_action();
             } else {
               console.log('You are not sure');
             }
        });
    };

    //Seller activity, accept the deal
    $scope.deal_seller_accept_action = function () {
        var promise = DealServ.deal_accept($scope.data.deal.deal_id);
        promise.then(
            function (data) {
                $ionicLoading.hide();
                if (data.error_code === "NoErrors" || data.error_code === "NoEmailConfirmation"){
                    var currentchat_placeholder = "Hi, I just accepted your offer, thank you";
                    $scope.goto_chat_thread_add($scope.data.partner.gamer_id, currentchat_placeholder);
                }
            }
            ,
            function (data) {
                $ionicLoading.hide();
                console.log('ERROR: while accepting the offer request ' + data.error_code);
            }
        );
        $ionicHistory.clearCache();
    };

    //Seller activity popup to confirm, reject the deal
    $scope.deal_seller_reject = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Are you sure you want to reject this offer?'
        });
        confirmPopup.then(function(res) {
            if(res) {
                $scope.data.temp_button_disable = true;
                $scope.loading_effect();
                $scope.deal_seller_reject_action();
             } else {
               console.log('You are not sure');
             }
        });
    };

    //Seller activity, reject the deal
    $scope.deal_seller_reject_action = function () {
        var promise = DealServ.deal_seller_reject($scope.data.deal.deal_id);
        promise.then(
            function (data) {
                $ionicLoading.hide();
                if (data.error_code === "NoErrors"){
                    $scope.init();
                }
            }
            ,
            function (data) {
                $ionicLoading.hide();
                console.log('ERROR: while rejecting the offer request ' + data.error_code);
            }
        );
        $ionicHistory.clearCache();
    };

    //Seller activity popup to confirm, cancel the deal
    $scope.deal_seller_cancel = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Are you sure you want to cancel this offer?'
        });
        confirmPopup.then(function(res) {
            if(res) {
                $scope.data.temp_button_disable = true;
                $scope.loading_effect();
                $scope.deal_seller_cancel_action();
             } else {
               console.log('You are not sure');
             }
        });
    };

    //Seller activity, cancel the deal
    $scope.deal_seller_cancel_action = function () {
        var promise = DealServ.deal_seller_cancel($scope.data.deal.deal_id);
        promise.then(
            function (data) {
                $ionicLoading.hide();
                if (data.error_code === "NoErrors"){
                    $scope.init();
                }
            }
            ,
            function (data) {
                $ionicLoading.hide();
                console.log('ERROR: while seller cancels the offer ' + data.error_code);
            }
        );
        $ionicHistory.clearCache();
    };

    //Seller activity, delete the deal item
    $scope.deal_seller_delete_action = function () {
        var promise = DealServ.deal_seller_delete($scope.data.deal.deal_id);
        promise.then(
            function (data) {
                if (data.error_code === "NoErrors"){
                    $state.go('tab.deals');
                }
            }
            ,
            function (data) {
                console.log('ERROR: while seller deletes the deal ' + data.error_code);
            }
        );
        $ionicHistory.clearCache();
    };

    //Seller activity popup to confirm, withdraw the deal
    $scope.deal_buyer_withdraw = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Are you sure you want to withdraw this offer?'
        });
        confirmPopup.then(function(res) {
            if(res) {
                $scope.data.temp_button_disable = true;
                $scope.loading_effect();
                $scope.deal_buyer_withdraw_action();
             } else {
               console.log('You are not sure');
             }
        });
    };

    // buyer activity, withdraw the deal request
    $scope.deal_buyer_withdraw_action = function () {
        var promise = DealServ.deal_buyer_withdraw($scope.data.deal.deal_id);
        promise.then(
            function (data) {
                $ionicLoading.hide();
                if (data.error_code === "NoErrors"){
                    $scope.init();
                }
            }
            ,
            function (data) {
                $ionicLoading.hide();
                console.log('ERROR: while withdrawing the offer request ' + data.error_code);
            }
        );
        $ionicHistory.clearCache();
    };

    //Seller activity popup to confirm, receive the deal
    $scope.deal_receive = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Item received?'
        });
        confirmPopup.then(function(res) {
            if(res) {
                $scope.data.temp_button_disable = true;
                $scope.loading_effect();
                $scope.deal_receive_action();
             } else {
               console.log('You are not sure');
             }
        });
    };

    // buyer activity, receive the deal
    $scope.deal_receive_action = function () {
        var promise = DealServ.deal_receive($scope.data.deal.deal_id);
        promise.then(
            function (data) {
                $ionicLoading.hide();
                if (data.error_code === "NoErrors" || data.error_code === "NoEmailConfirmation"){
                    var currentchat_placeholder = "Just to confirm that I have received the item, thank you!";
                    $scope.goto_chat_thread_add($scope.data.partner.gamer_id, currentchat_placeholder);
                }
            }
            ,
            function (data) {
                $ionicLoading.hide();
                console.log('ERROR: while receiving the game item ' + data.error_code);
            }
        );
        $ionicHistory.clearCache();
    };

    //buyer activity popup to confirm, cancel the deal
    $scope.deal_buyer_cancel = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Are you sure you want to cancel this offer?'
        });
        confirmPopup.then(function(res) {
            if(res) {
                $scope.data.temp_button_disable = true;
                $scope.loading_effect();
                $scope.deal_buyer_cancel_action();
             } else {
               console.log('You are not sure');
             }
        });
    };

    // buyer activity, cancel the deal
    $scope.deal_buyer_cancel_action = function () {
        var promise = DealServ.deal_buyer_cancel($scope.data.deal.deal_id);
        promise.then(
            function (data) {
                $ionicLoading.hide();
                if (data.error_code === "NoErrors"){
                    $scope.init();
                }
            }
            ,
            function (data) {
                $ionicLoading.hide();
                console.log('ERROR: while buyers cancels the deal ' + data.error_code);
            }
        );
        $ionicHistory.clearCache();
    };

    // buyer activity, delete the deal
    $scope.deal_buyer_delete_action = function () {
        var promise = DealServ.deal_buyer_delete($scope.data.deal.deal_id);
        promise.then(
            function (data) {
                if (data.error_code === "NoErrors"){
                    $state.go('tab.deals');
                }
            }
            ,
            function (data) {
                console.log('ERROR: while buyer close the deal ' + data.error_code);
            }
        );
        $ionicHistory.clearCache();
    };

    // mutual activity, gamer the deal partner
    $scope.gamer_rate = function () {
        var promise = GameServ.gamer_rate($scope.data.partner.gamer_id, $scope.data.deal.my_role, $scope.data.deal.deal_id, $scope.data.rate_score, $scope.data.rate_comment);
        promise.then(
            function (data) {
                $scope.close_action_popup();
            }
            ,
            function (data) {
                console.log('ERROR: while providing the rate ' + data.message);
            }
        );
        $ionicHistory.clearCache();
    };

    $scope.rate_display = function(rate_score) {
        if (rate_score === 1){
            $scope.data.css_rate_class = 'data_star-100';
            $scope.data.rate_score = 1;
        }
        else if (rate_score === 2){
            $scope.data.css_rate_class = 'data_star-200';
            $scope.data.rate_score = 2;
        }
        else if (rate_score === 3){
            $scope.data.css_rate_class = 'data_star-300';
            $scope.data.rate_score = 3;
        }
        else if (rate_score === 4){
            $scope.data.css_rate_class = 'data_star-400';
            $scope.data.rate_score = 4;
        }
        else if (rate_score === 5){
            $scope.data.css_rate_class = 'data_star-500';
            $scope.data.rate_score = 5;
        }
        else{
            console.log("ERROR: unexpected rate score");
            $scope.data.css_rate_class = 'data_star-100';
            $scope.data.rate_score = 0;
        }
    };

    // display the popup to add the rate scores
    $scope.show_action_popup = function () {
        $scope.data.action_template = 'templates/popup_add_rate.html';

        var action_popup = $ionicPopup.show({
            templateUrl: $scope.data.action_template,
            scope: $scope
        });

        $scope.close_action_popup = function () {
            action_popup.close();
            $scope.data.css_rate_class          = 'data_star-000';
            $scope.data.rate_score              = 0;
            $scope.data.firstbuttondisable      = false;
            $scope.data.secondbuttondisable     = true;
            $scope.data.terminate_button        = button_names[5];
            $scope.data.proceed_button          = UtilServ.get_deal_unaction_display_message("delete_rate");
            $scope.init();
        };

        $scope.cancel_button = function () {
            action_popup.close();
            $scope.data.css_rate_class = 'data_star-000';
            $scope.data.rate_score = 0;
        };
    };

    //Navigate to chat instance with the deal partner
    $scope.goto_chat_thread_add = function(gamer_id, currentchat_placeholder){
        var promise = ChatServ.thread_add(gamer_id);
        promise.then(
            function(data){
                $state.go('chat', {thread_id: data.thread.thread_id, partner_id: gamer_id, currentchat_placeholder: currentchat_placeholder});
            }
            ,
            function(data){console.log('ERROR: current tab is not valid which is ' + data.message);}
        );
    };

    //Navigate to gamer profile
    $scope.goto_gamer_profile_by_tab = function(gamer_id){
        $scope.tab_name = $stateParams.tab_name;

        if (valid_tab_names.indexOf($scope.tab_name) >= 0){
            var routing_url = "tab." + $scope.tab_name + "_gamer_profile";
            $state.go(routing_url, {gamer_id: gamer_id, tab_name: $scope.tab_name});
        }
        else{
            console.log("ERROR: current tab is not valid which is " + $scope.tab_name);
        }
    };

    $scope.init();
});
