angular.module('survey.controllers', [])

    .controller('SurveyPlatformCtrl', function($scope, $state, $stateParams, SurveyServ, $ionicHistory){
        $scope.data                         = {};
        $scope.data.available_platforms     = [];
        $scope.data.select_platform         = [];
        $scope.data.platform_selected_flag  = [];

        $scope.init = function (){
            var promise = SurveyServ.ape_available_platforms();
            promise.then(
                function(data){
                    if (data.error_code === "NoErrors"){
                        $scope.data.available_platforms = data.platforms;
                    }
                }
                ,
                function (data) {
                    console.log('ERROR: while loading wish game options ' + data.error_code);
                }
            );
        };

        $scope.platform_select = function(platform_name){
            var platform_index = $scope.data.select_platform.indexOf(platform_name);

            if (platform_index >= 0){
                $scope.data.select_platform.splice(platform_index, 1);
                console.log($scope.data.select_platform.indexOf(platform_name));
            }
            else {
                $scope.data.select_platform.splice(0, 0, platform_name);
                console.log($scope.data.select_platform.indexOf(platform_name));
            }
        };

        $scope.platforms_submit = function(){
            $state.go('survey_wish', {platforms: $scope.data.select_platform});
        };

        $scope.skip_platform = function(){
            $ionicHistory.clearCache();
            $state.go('tab.nearme');
        };

        $scope.init();
    })

    .controller('SurveyWishCtrl', function($scope, $state, $stateParams, SurveyServ, $ionicHistory){
        $scope.data                         = {};
        $scope.data.wish_games              = [];
        $scope.data.select_wishgames        = [];

        $scope.data.select_platform         = $stateParams.platforms;
        if($scope.data.select_platform.length > 0){
            $scope.data.select_platform     = $scope.data.select_platform.split(',');
        }

        $scope.init = function (){
            var promise = SurveyServ.ape_platform_to_wish($scope.data.select_platform);
            promise.then(
                function(data){
                    if (data.error_code === "NoErrors"){
                        $scope.data.wish_games = data.wishgames;
                    }
                }
                ,
                function (data) {
                    console.log('ERROR: while loading wish game options ' + data.error_code);
                }
            );
        };

        $scope.wish_select = function(wishgame_id){
            var wishgame_index = $scope.data.select_wishgames.indexOf(wishgame_id);
            if (wishgame_index >= 0){
                $scope.data.select_wishgames.splice(wishgame_index, 1);
            }
            else {
                $scope.data.select_wishgames.splice(0, 0, wishgame_id);
            }
        };

        $scope.wishgames_submit = function(){
            $state.go('survey_sell', {wishgames: $scope.data.select_wishgames});
        };

        $scope.back_to_platform = function(){
            $ionicHistory.goBack();
        };

        $scope.skip_wish = function(){
            $scope.data.select_wishgames = [];
            $state.go('survey_sell', {wishgames: $scope.data.select_wishgames});
        };

        $scope.init();
    })

    .controller('SurveySellCtrl', function($scope, $state, $stateParams, $ionicPopup, SurveyServ, $ionicHistory, $localstorage){
        $scope.data                         = {};
        $scope.data.sell_games              = [];
        $scope.data.select_sellgames        = [];
        $scope.data.price_unit              = $localstorage.get('me_currency_unit');
        $scope.priceconfirm_disabled        = true;

        $scope.data.select_wishgames        = $stateParams.wishgames;
        if($scope.data.select_wishgames.length > 0){
            $scope.data.select_wishgames    = $scope.data.select_wishgames.split(',');
        }

        $scope.init = function (){
            var promise = SurveyServ.ape_wish_to_sell($scope.data.select_wishgames);
            promise.then(
                function(data){
                    if (data.error_code === "NoErrors"){
                        $scope.data.sell_games = data.sellgames;
                        for(var i = 0; i < data.sellgames.length; i++){
                            $scope.data.sell_games[i].price_sell = data.sellgames[i].used_price;
                            $scope.data.sell_games[i].collect_format = 0;
                        }
                    }
                }
                ,
                function (data) {
                    console.log('ERROR: while loading wish game options ' + data.error_code);
                }
            );
        };

        $scope.sell_select = function(sellgame_id, sell_price, collect_format){
            var sellgame_item = sellgame_id + "+" + sell_price + "+" + collect_format;
            var sellgame_index = $scope.data.select_sellgames.indexOf(sellgame_item);

            if (sellgame_index >= 0){
                $scope.data.select_sellgames.splice(sellgame_index, 1);
            }
            else {
                $scope.data.select_sellgames.splice(0, 0, sellgame_item);
            }
        };

        $scope.sellgames_submit = function(){
            var promise = SurveyServ.ape_add_to_sell($scope.data.select_sellgames, $scope.data.price_unit);
            promise.then(
                function(data){
                    if (data.error_code === "NoErrors"){
                        $ionicHistory.clearCache();
                        $state.go('tab.nearme');
                    }
                }
                ,
                function (data) {
                    console.log('ERROR: while loading wish game options ' + data.error_code);
                }
            );
        };

        $scope.back_to_wish = function(){
            $ionicHistory.goBack();
        };

        $scope.skip_sell = function(){
            $scope.sellgames_submit();
        };

        $scope.click_router = function (sellgame_id, sell_price, collect_format){
            console.log("sell_price  is " + sell_price);
            console.log("collect_format is " + collect_format);
            var sellgame_item = sellgame_id + "+" + sell_price + "+" + collect_format;

            if ($scope.data.select_sellgames.indexOf(sellgame_item) >= 0){
                $scope.sell_select(sellgame_id, sell_price, collect_format);
            }
            else {
                $scope.load_sellprice_popup(sellgame_id, sell_price, collect_format);
            }
        };

        $scope.load_sellprice_popup = function(sellgame_id, sell_price, collect_format){
            $scope.data.action_template = 'templates/popup_survey_game_sellprice.html';
            $scope.data.price_sell = sell_price;
            $scope.data.collect_format = collect_format;

            var action_popup = $ionicPopup.show({
                templateUrl: $scope.data.action_template,
                scope: $scope
            });

            action_popup.then(function(res) {
                console.log('Tapped!', res);
            });

            $scope.close_action_popup = function() {
                action_popup.close();
                $scope.sell_select(sellgame_id, $scope.data.price_sell, $scope.data.collect_format);
                $scope.update_price_display(sellgame_id, $scope.data.price_sell, $scope.data.collect_format);
            };

            $scope.cancel_button = function(){
                action_popup.close();
            };
        };

        $scope.pop_init = function() {
            $scope.data.price_sell = $scope.data.price_sell;
            $scope.data.collect_format = $scope.data.collect_format;
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

        $scope.format_selection = function(new_format){
            console.log("format_selection is " + $scope.data.collect_format);
            if ($scope.data.collect_format != new_format){
                $scope.data.collect_format = new_format;
            }
        };

        $scope.update_price_display = function(sellgame_id, sell_price, collect_format){
            for(var i = 0; i < $scope.data.sell_games.length; i++){
                if ($scope.data.sell_games[i].game_id === sellgame_id){
                    $scope.data.sell_games[i].price_sell = sell_price;
                    $scope.data.sell_games[i].collect_format = collect_format;
                    break;
                }
            }
        };

        $scope.init();
    });


