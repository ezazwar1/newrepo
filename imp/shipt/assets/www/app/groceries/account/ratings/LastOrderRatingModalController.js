/**
 * Created by Shipt
 */

(function () {
    'use strict';

    angular.module('shiptApp').controller('LastOrderRatingModalController', [
        '$scope',
        '$log',
        '$rootScope',
        'UIUtil',
        'OrderRating',
        'LogService',
        '$ionicModal',
        'ShareModalProvider',
        '$filter',
        'TippingModalProvider',
        'FeatureService',
        'UserOrderService',
        'ordersModalProvider',
        LastOrderRatingModalController]);

    function LastOrderRatingModalController($scope,
                                            $log,
                                            $rootScope,
                                            UIUtil,
                                            OrderRating,
                                            LogService,
                                            $ionicModal,
                                            ShareModalProvider,
                                            $filter,
                                            TippingModalProvider,
                                            FeatureService,
                                            UserOrderService,
                                            ordersModalProvider) {

        var viewModel = this;
        viewModel.rating = null;
        viewModel.ratingSaved = false;
        viewModel.savingRatingInProgress = false;
        viewModel.tipMode = true;
        viewModel.rateMode = $scope.forceRatingMode ? true : false;

        var orderDetailModal = null;
        viewModel.init = function(rateOrder) {
            var rateOrder = $scope.rateOrder;
            viewModel.order = rateOrder;
            if(rateOrder.rating) {
                viewModel.rating = new OrderRating(rateOrder.rating);
            } else {
                viewModel.rating = new OrderRating();
            }
            viewModel.rating.order_id = rateOrder.id;
            viewModel.rating.driver_id = rateOrder.driver_id;
            loadViewData();
        };

        viewModel.showTipping = function() {
            if(FeatureService.showTipping() && viewModel.tipMode){
                return true;
            } else {
                return false;
            }
        };

        $scope.$on('last.order.rating.load', function(event,data) {
            $scope.rateOrder = data;
            viewModel.init($scope.rateOrder);
            initTip();
        });

        viewModel.getTipString = function(){
            if(viewModel.order.tip && viewModel.order.tip > 0){
                return $filter('currency')(viewModel.order.tip);
            } else {
                return 'No Tip';
            }
        };

        viewModel.tipClick = function(){
            if(!viewModel.order.tippable) {
                UIUtil.showAlert('Tipping Not Available','Sorry, but tipping is not available anymore for this order.');
                return;
            }
            TippingModalProvider.showModal($scope ,viewModel.order)
                .then(function(order){
                    viewModel.order = order;
                })
        };

        viewModel.viewOrderClick = function() {
            if($scope.showingForOrderDetail){
                viewModel.closeRating();
                return;
            }
            $scope.orderDetailOrder = $scope.rateOrder;
            $scope.orderDetailFromRateOrder = true;
            $scope.closeOrderDetailModel = function(){
                if(orderDetailModal) orderDetailModal.hide();
            };
            ordersModalProvider.orderHistoryModal($scope);
        };

        $scope.$watch('viewModel.rating.rating', function(){
            if(viewModel.rating && viewModel.rating.isValid()) {
                viewModel.changesToSave = true;
            } else {
                viewModel.changesToSave = false;
            }
        });

        viewModel.saveChanges = function() {
            if(viewModel.tipMode){
                viewModel.rateMode = true;
                viewModel.tipMode = false;
                return;
            }
            UIUtil.showLoading('Saving Feedback...');
            if(viewModel.rating.isValid){
                if(viewModel.otherAmount) {
                    viewModel.saveOtherTipAmount();
                }
                viewModel.savingRatingInProgress = true;
                viewModel.ratingSaved = false;

                if (viewModel.orderItemsMode && !$scope.showingForOrderDetail) {
                    $scope.orderDetailOrder = $scope.rateOrder;
                    $scope.orderDetailFromRateOrder = true;
                    $scope.closeOrderDetailModel = function(){
                        if(orderDetailModal) orderDetailModal.hide();
                    };
                    ordersModalProvider.orderHistoryModal($scope,null,viewModel.rating);
                }

                // UIUtil.hideLoading();
                // return;
                viewModel.rating.save()
                    .success(function(data){
                        viewModel.rating.id = data.id;
                        viewModel.ratingSaved = true;
                        viewModel.savingRatingInProgress = false;
                        viewModel.closeRating();
                        UIUtil.hideLoading();
                        if(viewModel.rating.rating == 5) {
                            ShareModalProvider.showModal($scope, 'rate_last_order_modal');
                        }
                        $rootScope.$broadcast('rating.saved.refresh', viewModel.rating);
                    })
                    .error(function(error){
                        viewModel.savingRatingInProgress = false;
                        viewModel.ratingSaved = false;
                        viewModel.closeRating();
                        UIUtil.hideLoading();
                        $log.error('error', error);
                        LogService.error(error);
                        UIUtil.showErrorAlert(JSON.stringify(error));
                    });
            }
        };

        viewModel.getRatingTextTitle = function() {
            var name = "<strong>"+$filter('driverNameFilter')(viewModel.order.driver.name)+"</strong>";
            if(viewModel.tipMode){
                return name + " has completed your order.";
            }
            var message = "";
            switch (viewModel.rating.rating) {
                case 1:
                    message = name + " was a complete disaster.";
                    break;
                case 2:
                    message = name + " was not good.";
                    break;
                case 3:
                    message = name + " was so-so.";
                    break;
                case 4:
                    message = name + " did ok, could be better.";
                    break;
                case 5:
                    message = name + " is the best of the best!";
                    break;
                default:
                    message = "Rate " + name + " for this order.";
            }
            return message;
        }

        viewModel.tipUntilTimeString = function(){
            if(viewModel.order.tippable){
                var formatString = moment(viewModel.order.tippable_until)
                                        .format('MMMM Do YYYY, h:mm a');
                return formatString;
            } else {
                return 'n/a';
            }
        };

        viewModel.tipOptions = [
            {
                amount:0,
                text: 'No Tip'
            },
            {
                amount:5,
                text: '$5'
            },
            {
                amount:10,
                text: '$10'
            },
            {
                amount:15,
                text: '$15'
            },
            {
                amount:0,
                text: 'Other'
            }
        ];
        viewModel.otherTipAmount = null;

        $scope.$watch('viewModel.otherTipAmount', function(){
            if(viewModel.otherTipAmount != null && viewModel.otherTipAmount != ""){
                viewModel.tipOption = null;
                viewModel.otherAmount = true;
            } else {
                viewModel.otherAmount = false;
            }
        });

        viewModel.selectTipOption = function(tipOption){
            if(tipOption.text == "Other") {
                viewModel.otherAmount = true;
                viewModel.tipOption = tipOption;
                return;
            }
            viewModel.otherTipAmount = null;
            viewModel.otherAmount = false;
            viewModel.tipOption = tipOption;
            viewModel.order.tip = tipOption.amount;
            UserOrderService.tipOrder(viewModel.order);
        };

        viewModel.saveOtherTipAmount = function(){
            viewModel.order.tip = viewModel.otherTipAmount;
            UserOrderService.tipOrder(viewModel.order);
        };

        viewModel.closeRating = function(){
            $rootScope.$broadcast('hide.order.rating');
        };

        viewModel.clickReason = function (reason) {
            reason.value = !reason.value;
            viewModel.rating[reason.property] = reason.value;
            if(reason.triggerItemFlow){
                viewModel.orderItemsMode = true;
            }
        };

        function initTip() {
            try {
                viewModel.tipOption = null;
                if(!viewModel.order.tip || viewModel.order.tip == 0){
                    //leave the selections blank if they have not chosen anything yet
                } else {
                    for(var i = 0; i <  viewModel.tipOptions.length; i++){
                        var to = viewModel.tipOptions[i];
                        if(viewModel.order.tip == to.amount){
                            viewModel.tipOption = to;
                            break;
                        }
                    }
                    if(viewModel.tipOption == null){
                        viewModel.otherAmount = true;
                        viewModel.otherTipAmount = viewModel.order.tip;
                    }
                    viewModel.tipMode = false;
                    viewModel.rateMode = true;
                }
                if($scope.forceRatingMode) {
                    viewModel.tipMode = false;
                    viewModel.rateMode = true;
                }
            } catch(exception){
                LogService.error(['error in initTip', exception]);
            }
        }

        viewModel.getBadRatingReasons = function() {
            if(viewModel.rating.rating && viewModel.rating.rating == 5){
                return viewModel.fiveStarBadRatingReasons;
            } else {
                return viewModel.badRatingReasons;
            }
        }

        function loadViewData() {
            viewModel.fiveStarBadRatingReasons = [
                {
                    name: "Went Above and Beyond",
                    property: "went_above_and_beyond",
                    value: viewModel.rating.went_above_and_beyond,
                    triggerItemFlow: false
                },
                {
                    name: "Good Communicator",
                    property: "good_communication",
                    value: viewModel.rating.good_communication,
                    triggerItemFlow: true
                },
                {
                    name: "Friendly",
                    property: "friendly_driver",
                    value: viewModel.rating.unfriendly_driver,
                    triggerItemFlow: false
                },
                {
                    name: "Wrong Items",
                    property: "wrong_items",
                    value: viewModel.rating.wrong_items,
                    triggerItemFlow: true
                },
                {
                    name: "Missing Items",
                    property: "missing_items",
                    value: viewModel.rating.missing_items,
                    triggerItemFlow: true
                },
                {
                    name: "Damaged Items",
                    property: "damaged_items",
                    value: viewModel.rating.damaged_items,
                    triggerItemFlow: true
                }
            ];

            viewModel.badRatingReasons = [
                {
                    name: "Wrong Items",
                    property: "wrong_items",
                    value: viewModel.rating.wrong_items,
                    triggerItemFlow: true
                },
                {
                    name: "Missing Items",
                    property: "missing_items",
                    value: viewModel.rating.missing_items,
                    triggerItemFlow: true
                },
                {
                    name: "Damaged Items",
                    property: "damaged_items",
                    value: viewModel.rating.damaged_items,
                    triggerItemFlow: true
                },
                {
                    name: "Late Delivery",
                    property: "late_delivery",
                    value: viewModel.rating.late_delivery,
                    triggerItemFlow: false
                },
                {
                    name: "Poor Substitutions",
                    property: "poor_replacements",
                    value: viewModel.rating.poor_replacements,
                    triggerItemFlow: true
                },
                {
                    name: "Unfriendly Shopper",
                    property: "unfriendly_driver",
                    value: viewModel.rating.unfriendly_driver,
                    triggerItemFlow: false
                }
            ];
        }
    }
})();
