
(function () {
    'use strict';

    angular.module('shiptApp').controller('AppController', [
        '$scope',
        '$ionicModal',
        '$log',
        'common',
        'AuthService',
        'ShoppingCartService',
        '$cordovaPush',
        '$ionicPlatform',
        'UIUtil',
        'LogService',
        '$state',
        '$ionicHistory',
        'AccountService',
        '$rootScope',
        '$timeout',
        'UserOrderService',
        '$q',
        'ShareModalProvider',
        'IntroModalProvider',
        'Geolocator',
        'FeatureService',
        'AppAnalytics',
        'ordersModalProvider',
        'chooseStoreModal',
        '$ionicSideMenuDelegate',
        'OpenUrlService',
        'CommonConfig',
        AppController]);

    function AppController($scope,
                           $ionicModal,
                           $log,
                           common,
                           AuthService,
                           ShoppingCartService,
                           $cordovaPush,
                           $ionicPlatform,
                           UIUtil,
                           LogService,
                           $state,
                           $ionicHistory,
                           AccountService,
                           $rootScope,
                           $timeout,
                           UserOrderService,
                           $q,
                           ShareModalProvider,
                           IntroModalProvider,
                           Geolocator,
                           FeatureService,
                           AppAnalytics,
                           ordersModalProvider,
                           chooseStoreModal,
                           $ionicSideMenuDelegate,
                           OpenUrlService,
                           CommonConfig) {


        var registerModal, introModal, lastOrderRatingModal, orderDetailModal;
        var checkingToOpenLastOrderModal = false;

        if(webVersion) {
            $scope.hideShareButton = true;
        }

        $scope.webVersion = webVersion && nonMobileWebApp;

        $scope.$on('user.loggedin', function (event, data) {
            common.loadConfiguration(CommonConfig.groceriesContext);
            common.userLoggedIn();
            showLastOrderModal();
            configurePushNotificationServices();
            if(!webVersion) {
                showIntro();
            }
            ShoppingCartService.loadServerCart();
            AccountService.refreshCustomerInfo();
            getGeolocation();
            AppAnalytics.login();
            AppAnalytics.identify();
            if(IntroModalProvider.hasIntroModalBeenShown()){
                showChooseStoreModal();
            }
        });

        $scope.signoutClick = function(){
            common.logoutCurrentUser();
        };

        $scope.$on('show-register-page', function(event,data){
            common.userLoggedIn();
            var registerPageUrl = 'app/groceries/register/registerNewUser.html'
            if(webVersion && nonMobileWebApp) {
                registerPageUrl = 'app/groceries/register/webRegisterNewUser.html'
            }
            $ionicModal.fromTemplateUrl(registerPageUrl,
                {
                    scope: $scope,
                    backdropClickToClose: false,
                    hardwareBackButtonClose: false,
                    focusFirstInput: true,
                    animation: 'asdfasdf'
                })
                .then(function(modal) {
                    registerModal = modal;
                    registerModal.show();
                });
        });

        $scope.$on('cancel-register', function(event, data){
            registerModal.hide();
            showWelcome();
            common.configureRollBarUserInfo();
        });

        $scope.$on('user.registered', function(event,data){
            common.loadConfiguration(CommonConfig.groceriesContext);
            common.userLoggedIn();
            registerModal.hide();
            common.configureRollBarUserInfo();
            configurePushNotificationServices();
            showIntro();
            getGeolocation();
            AppAnalytics.signup();
            AppAnalytics.identify();
        });

        function showIntro() {
            if(AuthService.isAuthenticated()){
                IntroModalProvider.showIntroModal($scope);
            }
        }

        function showWelcome() {
            if(!AuthService.isAuthenticated()){
                IntroModalProvider.showWelcomModal($scope);
            }
        }

        function showChooseStoreModal() {
            if(AuthService.isAuthenticated() ){
                $ionicPlatform.ready(function () {
                    chooseStoreModal.showIfNeeded($scope);
                });
            }
        }

        function configurePushNotificationServices() {
            if(AuthService.getCustomerInfo() != null) {
                $ionicPlatform.ready(function () {
                    var pushConfig = null;
                    var isIOS = ionic.Platform.isIOS();
                    var isAndroid = ionic.Platform.isAndroid();
                    var deviceType = "";
                    if(isIOS) {
                        pushConfig = {
                            "badge": true,
                            "sound": true,
                            "alert": true
                        };
                    } else if (isAndroid) {
                        pushConfig = {
                            "senderID": "897704621141"
                        };
                    }
                    if (isIOS || isAndroid) {
                        try {
                            var push = PushNotification.init({
                                "android": {
                                    "senderID": "897704621141"
                                },
                                "ios": {
                                    "badge": true,
                                    "sound": true,
                                    "alert": true
                                }
                            });
                            push.on('registration', function(data) {
                                AccountService.registerUserForPush(data.registrationId)
                                    .success(function(data){
                                        LogService.info('Success Registering user for push '+ JSON.stringify(data));
                                    })
                                    .error(function(error){
                                        LogService.error('Error Registering user for push '+ JSON.stringify(error));
                                    });
                            });
                            push.on('notification', function(data) {
                                if(ionic.Platform.isIOS()){
                                    handleIOSNotification(data);
                                } else {
                                    handleAndroidNotification(data);
                                }

                            });
                            push.on('error', function(e){
                                LogService.error('push error '+ JSON.stringify(e));
                            });
                            push.setApplicationIconBadgeNumber(function() {}, function() {}, 0);

                        } catch (exception) {
                        }
                    }
                });
            }
        }

        function rateOrderPush(notification) {
            try {
                if( !checkingToOpenLastOrderModal && !lastOrderRatingModalIsShown() ){
                    if (notification.additionalData.order_id && notification.additionalData.driver_id) {
                        $ionicHistory.nextViewOptions({disableBack: true});
                        $state.go('app.ordersRate', {
                            order: angular.toJson({
                                driver_id: notification.additionalData.driver_id,
                                order_id:notification.additionalData.order_id,
                                status: notification.additionalData.order_status
                            })
                        });
                        return true;
                    } else if (notification.additionalData.order_id && notification.additionalData.driver_id) {
                        $ionicHistory.nextViewOptions({disableBack: true});
                        $state.go('app.ordersRate', {
                            order: angular.toJson({
                                driver_id: notification.additionalData.driver_id,
                                order_id:notification.additionalData.order_id,
                                status: notification.additionalData.order_status
                            })
                        });
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            } catch (exception) {
                LogService.error(exception);
                return false;
            }
        }

        function handleIOSNotification (notification) {
            try {
                if (notification.message) {
                    if(rateOrderPush(notification)) {
                        //dont show the push if its a rate push
                        //we will just open the modal if needed
                    } else {
                        var alert = notification.message;
                        navigator.notification.alert(notification.message);
                    }
                }
                if (notification.sound) {
                    try {
                        var snd = new Media(event.sound);
                        snd.play();
                    } catch (exception){
                        $log.error('error playing sound', exception);
                    }
                }
            } catch (exception) {
                LogService.error(exception);
            }
        }

        function handleAndroidNotification (notification) {
            var message = notification.message;
            if(rateOrderPush(notification)) {
                //dont show the push if its a rate push
                //we will just open the modal if needed
            } else {
                navigator.notification.alert(notification.message);
            }
        }

        $ionicPlatform.on("resume", function(event) {
            showLastOrderModal();
            ShoppingCartService.loadServerCart();
            //refresh local users info
            AccountService.refreshCustomerInfo();
            getGeolocation();
            configurePushNotificationServices();
            showChooseStoreModal();
        });

        $scope.showRecipeButton = function() {
            return FeatureService.mealKits();
        };

        $scope.showFavorites = function() {
            return FeatureService.favorites();
        };

        function lastOrderRatingModalIsShown() {
            //safety method to wrap the isShown() method
            if(lastOrderRatingModal) {
                return lastOrderRatingModal.isShown();
            } else {
                return false;
            }
        }

        function orderDetailModalIsShown() {
            //safety method to wrap the isShown() method
            if(orderDetailModal) {
                return orderDetailModal.isShown();
            } else {
                return false;
            }
        }

        function showLastOrderModal() {
            ordersModalProvider.currentOrderModal($scope);
        }

        function showOrderDetailForCurrentOpenOrder(order) {
            $scope.orderDetailOrder = order;
            getOrderDetailModal()
                .then(function(modal){
                    orderDetailModal = modal;
                    if(!orderDetailModalIsShown()){
                        orderDetailModal.show();
                    }
                    checkingToOpenLastOrderModal = false;
                });
        }

        function showLastOrderRateModal(order) {
            $scope.rateOrder = order;
            getLastOrderModal()
                .then(function(modal){
                    lastOrderRatingModal = modal;
                    if(!lastOrderRatingModalIsShown()){
                        $scope.$broadcast('last.order.rating.load', $scope.rateOrder);
                        lastOrderRatingModal.show();
                    }
                    checkingToOpenLastOrderModal = false;
                })
        }

        function getOrderDetailModal() {
            var defer = $q.defer();
            if(!orderDetailModal){
                $scope.closeOrderDetailModel = function() {
                    orderDetailModal.hide();
                };
                return $ionicModal.fromTemplateUrl('app/groceries/account/orders/OrderHistoryDetailModal.html', {
                    scope: $scope,
                    backdropClickToClose: false,
                    hardwareBackButtonClose: false
                });
            } else {
                defer.resolve(orderDetailModal);
            }
            return defer.promise;
        }

        function getLastOrderModal() {
            var defer = $q.defer();
            if(!lastOrderRatingModal){
                if(webVersion) {
                    return $ionicModal.fromTemplateUrl('app/groceries/account/ratings/webLastOrderRatingModal.html', {
                        scope: $scope,
                        backdropClickToClose: false,
                        hardwareBackButtonClose: false
                    });
                } else {
                    return $ionicModal.fromTemplateUrl('app/groceries/account/ratings/lastOrderRatingModal.html', {
                        scope: $scope,
                        backdropClickToClose: false,
                        hardwareBackButtonClose: false
                    });
                }

            } else {
                defer.resolve(lastOrderRatingModal);
            }
            return defer.promise;
        }

        $rootScope.$on('hide.order.rating', function(event, notification) {
            if(lastOrderRatingModal){
                lastOrderRatingModal.hide();
            }
        });

        function showShareModal() {
            ShareModalProvider.showModal($scope,'side_menu_item');
        }

        $scope.shareFriendsClick = function() {
            showShareModal();
        };

        function getGeolocation(){
            $ionicPlatform.ready(function() {
                if(AuthService.isAuthenticated()){
                    Geolocator.getCurrentPosition();
                }
            });
        }

        $scope.homeClick = function(){
            $scope.$broadcast('nav.home-menu-item-click', $scope.rateOrder);
        };

        common.loadConfiguration(CommonConfig.groceriesContext);
        showWelcome();
        showLastOrderModal();
        common.configureRollBarUserInfo();
        configurePushNotificationServices();
        //refresh local users info
        AccountService.refreshCustomerInfo();
        getGeolocation();
        ShoppingCartService.loadServerCart();
        showChooseStoreModal();
        AppAnalytics.identify();

        //this is the part that will handle the quick launch stuff for iphones
        $ionicPlatform.ready(function() {
            try {
                ThreeDeeTouch.onHomeIconPressed = function (payload) {
                    if(payload.type == 'shoppingCart') {
                        $state.go('app.shoppingCart');
                    } else if (payload.type == 'yourOrders') {
                        $ionicHistory.nextViewOptions({disableBack: true});
                        $state.go('app.orders');
                    } else if (payload.type == 'account') {
                        $ionicHistory.nextViewOptions({disableBack: true});
                        $state.go('app.account');
                    }
                }
            } catch (e) {
            }
        });

        $scope.$watch(
            function () {
                return $ionicSideMenuDelegate.isOpen();
            },
            function (isOpen) {
                if (isOpen){
                    AppAnalytics.track('sideMenuOpened');
                }
            }
        );


    }
})();
