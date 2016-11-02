//ordersModalProvider

(function() {
    'use strict';

    angular
        .module('shiptApp')
        .factory('ordersModalProvider', ordersModalProvider);

    ordersModalProvider.$inject = [
        '$rootScope',
        '$ionicModal',
        '$q',
        'UserOrderService'];

    /* @ngInject */
    function ordersModalProvider($rootScope,
                                    $ionicModal,
                                    $q,
                                    UserOrderService) {

        var orderDetailUrl = 'app/groceries/account/orders/orderDetail/OrderHistoryDetailModal.html';
        if(webVersion) {
            orderDetailUrl = 'app/groceries/account/orders/orderDetail/webOrderHistoryDetailModal.html';
        }

        function orderHistoryModal($scope, order, rating) {
            if(orderDetailModalIsShown()) {
                return;
            }
            var orderDetailModal = null;
            $scope = $scope || $rootScope.$new();
            if(order){
                $scope.orderDetailOrder = order;
                $scope.orderDetailOrder.order_lines = [];
            }
            $scope.rating = rating;
            $ionicModal.fromTemplateUrl(orderDetailUrl, {
                scope: $scope,
                backdropClickToClose: false,
                hardwareBackButtonClose: false
            })
                .then(function(modal) {
                    orderDetailModal = modal;
                    orderDetailModal.show();
                });
            $scope.closeOrderDetailModel = function() {
                orderDetailModal.hide();
                $scope.orderDetailOrder = null;
            };
        }

        var checkingToOpenLastOrderModal = false;
        var orderDetailModal = null;
        var lastOrderRatingModal = null;
        var $scope = null;

        function currentOrderModal(scope){
            $scope = scope;
            //set a flag saying that this is checking for an order.
            //this will prevent the push notification from also opening a modal if it has been received as well.
            checkingToOpenLastOrderModal = true;
            UserOrderService.getLastOrderForCustomer()
                .then(function(order){
                    if(!order){
                        return;
                    }
                    if(order.status == "delivered" && !order.rating ){
                        showLastOrderRateModal(order);
                    } else if(order.status != "delivered" && order.status != "cancelled"){
                        showOrderDetailForCurrentOpenOrder(order);
                    } else {
                        checkingToOpenLastOrderModal = false;
                    }
                });
        }

        function getOrderDetailModal() {
            var defer = $q.defer();
            if(!orderDetailModal){
                $scope.closeOrderDetailModel = function() {
                    orderDetailModal.hide();
                };
                return $ionicModal.fromTemplateUrl(orderDetailUrl, {
                    scope: $scope,
                    backdropClickToClose: false,
                    hardwareBackButtonClose: false
                });
            } else {
                defer.resolve(orderDetailModal);
            }
            return defer.promise;
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

        function orderDetailModalIsShown() {
            //safety method to wrap the isShown() method
            if(orderDetailModal) {
                return orderDetailModal.isShown();
            } else {
                return false;
            }
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

        function lastOrderRatingModalIsShown() {
            //safety method to wrap the isShown() method
            if(lastOrderRatingModal) {
                return lastOrderRatingModal.isShown();
            } else {
                return false;
            }
        }

        function getLastOrderModal(scope) {
            var defer = $q.defer();
            if(scope) {
                $scope = scope;
            }
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
                lastOrderRatingModal = null;
            }
        });

        function showOrderRatingModalForOrder(scope, order) {
            try {
                $scope = scope;
                $scope.rateOrder = order;
                $scope.showingForOrderDetail = true;
                $scope.forceRatingMode = true;
                getLastOrderModal(scope)
                    .then(function(modal){
                        lastOrderRatingModal = modal;
                        if(!lastOrderRatingModalIsShown()){
                            $scope.$broadcast('last.order.rating.load', $scope.rateOrder);
                            lastOrderRatingModal.show();
                        }
                    })

            } catch (e) {

            }
        }

        var service = {
            orderHistoryModal: orderHistoryModal,
            currentOrderModal: currentOrderModal,
            showOrderRatingModalForOrder: showOrderRatingModalForOrder
        };

        return service;

    }
})();
