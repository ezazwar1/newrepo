angular.module('account.controllers', [])

    .controller('AccountCtrl', function ($scope, $window, $state, $http, $cordovaFacebook, $ionicPopup, AccountServ, PushServ, UtilServ, $cordovaInAppBrowser, $localstorage, $ionicHistory) {
        $scope.data                 = {};
        $scope.data.email           = "";
        $scope.data.name            = "";
        $scope.data.password        = "";
        $scope.data.message         = "";
        $scope.login_disabled       = true;
        $scope.register_disabled    = true;
        $scope.forgot_disabled      = true;

        var defaultOptions = {
            location: 'no',
            clearcache: 'no',
            toolbar: 'yes'
        };

        $scope.fblogin = function () {
            $cordovaFacebook.login(["public_profile", "email"])
                .then(function (login_response) {
                    $scope.info = JSON.stringify(login_response);
                    if (login_response.status === 'connected') {
                        $cordovaFacebook.api("me", ["public_profile", "email"])
                            .then(function (me_response) {
                                var gamer = me_response;
                                gamer.access_token = login_response.authResponse.accessToken;
                                $scope.info2 = JSON.stringify(gamer);
                                // register on server
                                var promise = AccountServ.fblogin(gamer);
                                promise.then(
                                    function (data) {
                                        // save api_key to localstorage
                                        $localstorage.set('api_key', data.api_key);
                                        $localstorage.set('me_id', data.me_id);
                                        $localstorage.set('me_name', data.me_name);
                                        $localstorage.set('me_currency_unit', data.currency_unit);
                                        $http.defaults.headers.common.gbgapikey = data.api_key;

                                        // register push notification
                                        if (ionic.Platform.isIOS() || ionic.Platform.isAndroid())
                                            PushServ.register();
                                        else
                                            console.log('Not a real device. Not registering push notification');

                                        AccountServ.start_location_tracking();
                                        if (data.new_gamer === true || data.show_survey === true){
                                            $state.go('survey_platform');
                                        }
                                        else{
                                            $ionicHistory.clearCache();
                                            $state.go('tab.nearme');
                                        }
                                    }
                                    ,
                                    function (data) {
                                        console.log('FB login failed: ' + data.error_code);
                                    }
                                );
                            }, function (error) {
                                console.log("FB login: error calling facebook graph api for me");

                            });
                    }
                }, function (error) {
                    console.log("FB login: error logging in from facebook");
                });
        };

        // Email register
        $scope.register = function() {
            var promise = AccountServ.register($scope.data.email, $scope.data.name, $scope.data.password);
            promise.then(
                function (data) {
                    $localstorage.set('api_key', data.api_key);
                    $localstorage.set('me_id', data.me_id);
                    $localstorage.set('me_name', data.me_name);
                    $localstorage.set('me_currency_unit', data.currency_unit);
                    $http.defaults.headers.common.gbgapikey = data.api_key;

                    // register push notification
                    if (ionic.Platform.isIOS() || ionic.Platform.isAndroid())
                        PushServ.register();
                    else
                        console.log('Not a real device. Not registering push notification');

                    AccountServ.start_location_tracking();
                    if (data.new_gamer === true){
                        $state.go('survey_platform');
                    }
                    else{
                        $ionicHistory.clearCache();
                        $state.go('tab.nearme');
                    }
                }
                ,
                function (data) {
                    console.log('ERROR: while email registering, API returned error ' + data.error_code);
                }
            )
        };

        // monitor and check the input email and password for email login
        $scope.$watch('[data.email, data.password]', function (newValues, oldValues) {
            if (newValues[0] != undefined && newValues[0].length > 5 && newValues[0].indexOf("@") != -1 && newValues[0].indexOf(".") != -1 && newValues[1].length > 0){
                $scope.login_disabled = false;
            }
            else {
                $scope.login_disabled = true;
            }
        });

        // monitor and check the input email and password for email register
        $scope.$watch('[data.email, data.password, data.name]', function (newValues, oldValues) {
            if (newValues[0] != undefined && newValues[0].length > 5 && newValues[0].indexOf("@") != -1 && newValues[0].indexOf(".") != -1 && newValues[1].length > 0 && newValues[2].length > 0){
                $scope.register_disabled = false;
            }
            else {
                $scope.register_disabled = true;
            }
        });

        // monitor and check the input email and password for email forget password
        $scope.$watch('data.email', function (newValue, oldValue) {
            if (newValue != undefined && newValue.length > 5 && newValue.indexOf("@") != -1 && newValue.indexOf(".") != -1){
                $scope.forgot_disabled = false;
            }
            else {
                $scope.forgot_disabled = true;
            }
        });

        // Email login
        $scope.login = function(){
            var promise = AccountServ.login($scope.data.email,  $scope.data.password);
            promise.then(
                function (data) {
                    $localstorage.set('api_key', data.api_key);
                    $localstorage.set('me_id', data.me_id);
                    $localstorage.set('me_name', data.me_name);
                    $localstorage.set('me_currency_unit', data.currency_unit);
                    $http.defaults.headers.common.gbgapikey = data.api_key;

                    // register push notification
                    if (ionic.Platform.isIOS() || ionic.Platform.isAndroid())
                        PushServ.register();
                    else
                        console.log('Not a real device. Not registering push notification');

                    AccountServ.start_location_tracking();
                    if (data.show_survey === true){
                        $state.go('survey_platform');
                    }
                    else{
                        $ionicHistory.clearCache();
                        $state.go('tab.nearme');
                    }
                }
                ,
                function (data) {
                    if (data.error_code === "EmailPasswordIncorrect"){
                        $scope.data.error_message = UtilServ.get_error_message(data.error_code);
                        $scope.showConfirm_incorrect_login();
                    }
                    console.log('ERROR: while email logging in, API returned errors ' + data.error_code);
                }
            )
        };

        $scope.showConfirm_incorrect_login = function() {
            var alertPopup = $ionicPopup.alert({
                title: $scope.data.error_message,
                template: ''
            });
            alertPopup.then(function(res) {
                $scope.data.email = "";
                $scope.data.password = "";
            });
        };

        $scope.send_reset_email = function () {
            if ($scope.data.email.length > 0) {
                var promise = AccountServ.send_reset_email($scope.data.email);
                promise.then(
                    function(data){
                        if (data.error_code === "NoErrors"){
                            var send_reset_email_error_code = "send_reset_email_" + data.error_code;
                            $scope.data.send_reset_email_message = UtilServ.get_error_message(send_reset_email_error_code) + $scope.data.email;
                            $scope.showConfirm_send_reset_email(true);
                        }
                        else {
                            $scope.data.send_reset_email_message = UtilServ.get_error_message(data.error_code);
                            $scope.showConfirm_send_reset_email(false);
                        }
                    }
                    ,
                    function(data){
                        console.log('ERROR: while resetting password, API returned errors ' + $scope.data.message);
                    }
                );
            }
            else {
                $scope.data.message = "Please fill in email address.";
            }
        };

        $scope.showConfirm_send_reset_email = function(reset_case) {
            var alertPopup = $ionicPopup.alert({
                title: $scope.data.send_reset_email_message,
                template: ''
            });
            alertPopup.then(function(res) {
                if (reset_case === true){
                    $window.history.back();
                }
            });
        };

        $scope.open_pp = function(){
            $cordovaInAppBrowser.open('http://gamebuygame.com/pp', '_blank', defaultOptions)
        };

        $scope.open_eula = function(){
            $cordovaInAppBrowser.open('http://gamebuygame.com/eula', '_blank', defaultOptions)
        };

    })

    .controller('AccountPaymentCtrl', function ($scope, $stateParams, $state, $http, $ionicPopup, GameServ, AccountServ) {
        $scope.data                                 = {};
        $scope.data.gamer_id                        = 0;
        $scope.data.gamer                           = {};
        $scope.data.sell_credit                     = 20;
        $scope.data.sell_credit_limit               = 20;
        $scope.data.sell_credit_wallet              = 'paypal';
        $scope.data.sell_credit_email               = '';
        $scope.email_submitconfirm_disabled         = true;
        $scope.sellcredit_submitconfirm_disabled    = false;

        $scope.data.amount                          = 20;
        $scope.data.cvc                             = '';
        $scope.data.expyr                           = '';
        $scope.data.expmonth                        = '';
        $scope.data.card_number                     = '';
        $scope.deposit_submitconfirm_disabled       = false;

        $scope.data.withdraw_flag                   = true;

        $scope.init = function(){
            var promise = GameServ.gamer_by_id($scope.data.gamer_id);
            promise.then(
                function(data){
                    $scope.data.gamer = data.gamer;
                    $scope.data.withdraw_flag = $scope.data.gamer.wallet < $scope.data.sell_credit_limit ? false : true;
                    console.log('$scope.data.withdraw_flag is ' + $scope.data.withdraw_flag);
                }
                ,
                function(data){console.log('Failed: ' + data.error_code);}
            );
        };

        $scope.send_token = function(token){
            var promise = AccountServ.post_payment(token, $scope.data.amount);
            promise.then(
                function(data){
                    if (data.result === 'okay' && data.error_code === 'NoErrors'){
                        $scope.data.gamer.wallet += parseFloat($scope.data.amount);
                        $scope.data.title = $scope.data.amount + ' ' + data.currency_unit + ' have been added to your wallet, and a confirmation has been sent to ' + data.recipient_email;
                    }
                    else if (data.result === 'okay' && data.error_code === 'NoEmailConfirmation'){
                        $scope.data.gamer.wallet += parseFloat($scope.data.amount);
                        $scope.data.title = $scope.data.amount + ' ' + data.currency_unit + ' have been added to your wallet';
                    }
                    else {
                        $scope.data.title = 'The payment did not go through. ' + data.error_code;
                    }
                    $scope.showConfirm_post_payment();
                }
                ,
                function(data){console.log('ERROR: while depositing, API returned error ' + data.error_code);}
            );
        };

        $scope.$watch('data.amount', function (deposit_amount) {
            //allow 10 and 10.0 and 10.00 and 0, but not 10. 10.000 or 10.0.0
            var regex=/^\d+(\.\d{1,2})?$/;

            if (deposit_amount != undefined && regex.test(deposit_amount) && parseFloat(deposit_amount) >= 1) {
                $scope.deposit_submitconfirm_disabled = false;
            }
            else {
                $scope.deposit_submitconfirm_disabled = true;
            }
        });

        $scope.showConfirm_post_payment = function() {
            var alertPopup = $ionicPopup.alert({
                title: $scope.data.title,
                template: ''
            });
            alertPopup.then(function(res) {
                $scope.data.cvc                         = '';
                $scope.data.expyr                       = '';
                $scope.data.expmonth                    = '';
                $scope.data.card_number                 = '';
                $scope.data.amount                      = 20;
                $scope.init();
            });
        };

        $scope.put_sell_order = function(){
            if ($scope.data.sell_credit > $scope.data.gamer.wallet) {
                $scope.data.title = 'There are not enough money in the wallet.';
                $scope.showConfirm_not_enough_wallet();
            }
            else {
                var promise = AccountServ.post_payment_sell($scope.data.sell_credit, $scope.data.sell_credit_wallet, $scope.data.sell_credit_email);
                promise.then(
                    function(data){
                        if (data.result === 'okay' && data.error_code === 'NoErrors'){
                            $scope.data.gamer.wallet -= $scope.data.sell_credit;
                            $scope.data.title = 'After handling fee ' + data.credit + ' ' + data.currency_unit + ' will be transferred back to your provided account in 3 business days, and a confirmation has been sent to ' + data.recipient_email;
                        }
                        if (data.result === 'okay' && data.error_code === 'NoEmailConfirmation'){
                            $scope.data.gamer.wallet -= $scope.data.sell_credit;
                            $scope.data.title = 'After handling fee ' + data.credit + ' ' + data.currency_unit + ' will be transferred back to your provided account in 3 business days';
                        }
                        $scope.showConfirm_put_sell_order();
                    }
                    ,
                    function(data){console.log('ERROR: while withdrawing, API returned error ' + data.error_code);}
                );
            };
        };

        $scope.$watch('data.sell_credit_email', function (email_value) {
            if (email_value != undefined && (email_value.length < 1 || email_value.indexOf('.') === -1)) {
                $scope.email_submitconfirm_disabled = true;
            }
            else {
                $scope.email_submitconfirm_disabled = false;
            }
        });

        $scope.$watch("data.sell_credit", function (cashout_amount) {
            //allow 10 and 10.0 and 10.00 and 0, but not 10. 10.000 or 10.0.0
            var regex=/^\d+(\.\d{1,2})?$/;
            if (cashout_amount != undefined && regex.test(cashout_amount) && parseFloat(cashout_amount) >= $scope.data.sell_credit_limit) {
                $scope.sellcredit_submitconfirm_disabled = false;
            }
            else {
                $scope.sellcredit_submitconfirm_disabled = true;
            }
        });

        $scope.showConfirm_put_sell_order = function() {
            var alertPopup = $ionicPopup.alert({
                title: $scope.data.title,
                template: ''
            });
            alertPopup.then(function(res) {
                $state.go('tab.me_wallet');
            });
        };

        $scope.showConfirm_not_enough_wallet = function() {
            var alertPopup = $ionicPopup.alert({
                title: $scope.data.title,
                template: ''
            });
            alertPopup.then(function(res) {
                $state.go('tab.me_wallet');
            });
        };

        $scope.init();
    })

    .controller('AccountSettingCtrl', function ($scope, $cordovaSocialSharing, $ionicPlatform, AccountServ, $cordovaInAppBrowser, $localstorage, $state, gbgConfig) {
        var file    = 'https://s3.amazonaws.com/gbgprod/image/social-buzz/twitter-share-image.jpg';
        var toArr   = null;
        var bccArr  = null;
        var email_subject   = "Check out this APP, Gamers love it!!";
        var email_message   = gbgConfig.url;

        var message_support = "";
        var subject_support = "Feedback about GameBuyGame from " + $localstorage.get('me_name');
        var toArr_support   = 'support@gamebuygame.com';
        var file_support    = null;

        var share_link = gbgConfig.url;
        var share_file = null;
        var share_message = "On GameBuyGame you can trade video games with gamers nearby. Simply sign up to join in the gamer community.";
        var share_subject = $localstorage.get('me_name') + ' invited you to GameBuyGame';

        var defaultOptions = {
            location: 'no',
            clearcache: 'no',
            toolbar: 'yes'
        };

        $scope.follow_us_on_twitter = function(){
            $cordovaInAppBrowser.open('https://twitter.com/gamebuygame', '_blank', defaultOptions);
        };

        $scope.like_us_on_facebook = function(){
            $cordovaInAppBrowser.open('https://m.facebook.com/gamebuygame', '_blank', defaultOptions);
        };

        $scope.share_with_friends= function(){ //share_subject is only used for email sharing
            $cordovaSocialSharing.share(share_message, share_subject, share_file, share_link).then();
        };

        $scope.logout = function(){
            AccountServ.logout();
        };

        $scope.open_pp = function(){
            $cordovaInAppBrowser.open(gbgConfig.url + 'pp', '_blank', defaultOptions);
        };

        $scope.open_eula = function(){
            $cordovaInAppBrowser.open(gbgConfig.url + 'eula', '_blank', defaultOptions);
        };

        $scope.open_aboutus = function(){
            $cordovaInAppBrowser.open(gbgConfig.url + 'about_us', '_blank', defaultOptions);
        };

        $scope.open_faq = function(){
            $cordovaInAppBrowser.open(gbgConfig.url + 'faq', '_blank', defaultOptions);
        };

        $scope.send_us_feedback = function(){
            $cordovaSocialSharing.shareViaEmail(message_support, subject_support, toArr_support, bccArr, file_support).then();
        };

        $scope.rate_this_app = function () {
            if ($ionicPlatform.is('ios')) {
                window.open('itms-apps://itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?type=Purple+Software&id=995849422'); // or itms://
            }
            else if ($ionicPlatform.is('android')) {
                window.open('market://details?id=com.hextom.gamebuygame.iosprod', '_system');
            }
            else {
                console.log('This is not an ios or android device.');
            }
        };

        $scope.goto_notification_control = function(){
          $state.go('tab.me_notification_control');
        };

    })

    .controller('NotificationControlCtrl', function ($scope, AccountServ, $state) {
        $scope.data = {};

        $scope.init = function(){
            var promise = AccountServ.notification_control_by_gamer();
            promise.then(
                function(data){
                    if (data.error_code === "NoErrors"){
                        $scope.data.notification_control = data.notification_control;
                        console.log($scope.data.notification_control.deal_enable);
                        console.log($scope.data.notification_control.match_enable);
                        console.log($scope.data.notification_control.watch_enable);
                        console.log($scope.data.notification_control.reminder_enable);
                    }
                }
                ,
                function(data){console.log('Failed: ' + data.error_code);}
            );
        };

        $scope.notification_control_submit = function(){
            console.log($scope.data.notification_control.deal_enable);
            console.log($scope.data.notification_control.match_enable);
            console.log($scope.data.notification_control.watch_enable);
            console.log($scope.data.notification_control.reminder_enable);

            var promise = AccountServ.notification_control($scope.data.notification_control.deal_enable, $scope.data.notification_control.match_enable, $scope.data.notification_control.watch_enable, $scope.data.notification_control.reminder_enable);
            promise.then(
                function(data){
                    if (data.error_code === "NoErrors"){
                        console.log("GOOD!!");
                        $state.go('tab.me_setttings');
                    }
                }
                ,
                function(data){console.log('Failed: ' + data.error_code);}
            );
        };

        $scope.init();

    });

