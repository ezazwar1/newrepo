/**
 * Created by Shipt
 */

(function () {
    'use strict';

    angular.module('shiptApp').controller('OrderHistoryDetailModalController', [
        '$scope',
        '$rootScope',
        'AccountService',
        'UIUtil',
        '$ionicModal',
        '$log',
        '$filter',
        'UserOrderService',
        'AppAnalytics',
        'TippingModalProvider',
        'TextNotesModalProvider',
        '$ionicActionSheet',
        'ShareModalProvider',
        'ShoppingService',
        'FeatureService',
        'OrderRating',
        'ordersModalProvider',
        OrderHistoryDetailModalController]);

    function OrderHistoryDetailModalController($scope,
                                               $rootScope,
                                               AccountService,
                                               UIUtil,
                                               $ionicModal,
                                               $log,
                                               $filter,
                                               UserOrderService,
                                               AppAnalytics,
                                               TippingModalProvider,
                                               TextNotesModalProvider,
                                               $ionicActionSheet,
                                               ShareModalProvider,
                                               ShoppingService,
                                               FeatureService,
                                               OrderRating,
                                               ordersModalProvider) {

        var viewModel = this;
        viewModel.order = $scope.orderDetailOrder;
        var ratingModal = null;
        viewModel.noteModal = null;
        viewModel.addCustomProductToOpenOrderModel = null;
        viewModel.addProductToOrderSearchModal = null;
        $scope.addProductToOrder = null;

        function loadView() {
            var id = viewModel.order.id;
            AccountService.getOrder(id)
                .success(function(order){
                    $log.debug('order from serve', order);
                    angular.forEach(order.order_lines, function(order_line){
                        if(order_line.actual_product) {
                            if(order_line.actual_product_type == "CustomProduct") {
                                order_line.actual_product.isCustom = true;
                            }
                        }
                        if(order_line.requested_product_type == "CustomProduct") {
                            order_line.requested_product.isCustom = true;
                        }
                    });
                    viewModel.order = order;
                    setPageTitle();
                    UIUtil.hideLoading();
                    viewModel.accessibilityFocus();
                    turnOnItemIssueReportingIfNeeded();
                    $scope.$broadcast('scroll.refreshComplete');
                })
                .error(function(error){
                    UIUtil.hideLoading();
                    $scope.$broadcast('scroll.refreshComplete');
                    UIUtil.showErrorAlert('Could not load Order Data.');
                });
        }

        function turnOnItemIssueReportingIfNeeded(){
            try {
                if($scope.rating) {
                    viewModel.rating = new OrderRating($scope.rating);
                    if(viewModel.rating.hasItemIssues()){
                        viewModel.somethingWrongWithOrder = true;
                    }
                }
            } catch (e) {
                $log.error(e);
            }
        }

        function setPageTitle (){
            if(viewModel.order.store && viewModel.order.store.name) {
                viewModel.title = viewModel.order.store.name + " Order";
            } else {
                viewModel.title = "Order";
            }
        }

        function updateCurrentOrder(persistToServer) {
            if(persistToServer) {
                UIUtil.showLoading('Saving Order Changes...');
                UserOrderService.updateOrder(viewModel.order)
                    .success(function(updatedOrder){
                        $log.debug('updated', updatedOrder);
                        $rootScope.$broadcast('order.saved.refresh', updatedOrder);
                        loadView();
                        UIUtil.hideLoading();
                        viewModel.hasChanges = false;
                    })
                    .error(function(error){
                        showUpdateOrderErrorMessage(error);
                        UIUtil.hideLoading();
                    });
            } else {
                viewModel.hasChanges = true;
            }
        }

        function showUpdateOrderErrorMessage(error) {
            try {
                if(!error || !error.errors){
                    UIUtil.showErrorAlert('Error updating order info. \n\n' + JSON.stringify(error));
                }
                var message = '';
                var i;

                if(error.errors.base){
                    for (i=0; i< error.errors.base.length; i++) {
                        message += '\n';
                        message += ' ' + error.errors.base[i];
                    }
                }
                UIUtil.showErrorAlert('Error updating order info. \n\n' + message);
            } catch (exception) {
                UIUtil.showErrorAlert('Error updating order info. \n\n' + JSON.stringify(error));
            }
        }

        viewModel.addSpecialRequest = function() {
            if(viewModel.order.editable) {
                $ionicModal.fromTemplateUrl('app/groceries/account/orders/customProduct/addCustomProductToOpenOrder.html', {scope: $scope,focusFirstInput: true})
                    .then(function(modal) {
                        viewModel.addCustomProductToOpenOrderModel = modal;
                        viewModel.addCustomProductToOpenOrderModel.show();
                    });
            }
        };

        $scope.$on('close.addCustomProduct', function(event,data){
            if(viewModel.addCustomProductToOpenOrderModel)viewModel.addCustomProductToOpenOrderModel.hide();
            viewModel.addCustomProductToOpenOrderModel = null;
            if(data) {
                data.requested_qty = data.qty;
                data.isCustom = true;
                data.requested_product = {description: data.name, isCustom: true};
                viewModel.order.order_lines.push(data);
                updateCurrentOrder();
            }
        });

        viewModel.addProductToOrder = function(){
            //popup search modal
            if(viewModel.order.editable) {
                $scope.addProductToOrder = viewModel.order;
                $ionicModal.fromTemplateUrl('app/groceries/account/orders/addProduct/addProductToOrderSearch.html', {id:'addProductToOrderSearch',scope: $scope,focusFirstInput: true})
                    .then(function(modal) {
                        viewModel.addProductToOrderSearchModal = modal;
                        viewModel.addProductToOrderSearchModal.show();
                    });
            }
        };

        viewModel.getAriaLabel = function(order_line) {
            if (order_line.current_product.on_sale) {
                return viewModel.getDisplayNameForProduct(order_line.current_product)
                    + viewModel.getSalePrice(order_line.current_product)
                    + order_line.current_product.size;
            } else {
                return viewModel.getDisplayNameForProduct(order_line.current_product)
                    + viewModel.getPrice(order_line.current_product)
                    + order_line.current_product.size;
            }
        };

        viewModel.getAriaLabelSubstitutedOrderLine = function(order_line) {
            return viewModel.getDisplayNameForProduct(order_line.requested_product)
                + viewModel.getPrice(order_line.requested_product)
                + order_line.requested_product.size
        };

        $scope.$on('update.OrderHistoryDetailModalController',function(event,order){
            viewModel.order = order;
            updateCurrentOrder();
        });

        $scope.$on('customProduct.addProductToOrderSearch',function(event,data){
            viewModel.addProductToOrderSearchModal.hide();
            viewModel.addSpecialRequest();
        });

        $scope.$on('close.addProductToOrderSearch', function(event,data){
            viewModel.addProductToOrderSearchModal.hide();
        });

        viewModel.shareOrder = function() {
            ShareModalProvider.showModal($scope,'order_detail_modal');
        };

        viewModel.editOrderNotes = function() {
            if(viewModel.order.editable) {
                $ionicModal.fromTemplateUrl('app/groceries/shop/cartProductNotes/cartProductNotes.html', {
                    scope: $scope,
                    focusFirstInput: true,
                    animation: 'scale-in'
                })
                    .then(function(modal) {
                        $scope.$broadcast('data.productNotes', {notes: viewModel.order.notes, title: "Order Notes"});
                        viewModel.noteModal = modal;
                        viewModel.noteModal.show();
                    });
            }
        };

        $scope.$on('close.orderNotes',function(event, data){
            viewModel.order.notes = data;
            viewModel.order.notesLoading = true;
            updateCurrentOrder();
            if(viewModel.noteModal)viewModel.noteModal.hide();
        });

        $scope.$on('cancel.orderNotes', function(){
            if(viewModel.noteModal)viewModel.noteModal.hide();
        });

        viewModel.showShareButton = function() {
            if(webVersion) {
                return true;
            } else {
                return true;
            }
        };

        viewModel.getDisplayDate = function(dateString) {
            return moment(dateString).format("MMM Do YYYY, h:mm a");
        };

        viewModel.saveChanges = function() {
            AppAnalytics.editOrder();
            updateCurrentOrder(true);
        };

        viewModel.getClassForItem = function (order_line) {
            var classString = "";
            classString += order_line.current_product.isCustom ? '':'item-thumbnail-left';
            if(viewModel.orderLineHasSub (order_line)) {
                classString += " sub-order-line-item"
            }
            if(viewModel.somethingWrongWithOrder){
                classString += " reconciliation-item"
            }
            return classString;
        };

        viewModel.somethingWrongWithOrderClick = function() {
            if(!viewModel.somethingWrongWithOrder) {
                //UIUtil.showAlert('Report Problems',
                //'Click the "Issue" button on items that are problems to report problems to us.')
                viewModel.somethingWrongWithOrder = true;
            } else {
                viewModel.somethingWrongWithOrder = false;
            }
        };

        viewModel.showSomethingWrongButton = function() {
            if(!FeatureService.showTipping()){
                return false;
            } else {
                return viewModel.order.status == "delivered" ;
            }
        };

        function isSameObject(obj1, obj2){
            return JSON.stringify(obj1) == JSON.stringify(obj2);
        }

        function isSameProduct(prod1, prod2){

            if(prod1.description && prod2.description){
                if(prod1.description == prod2.description) return true;
                return false;
            }
            if(prod1.id && prod2.id) {
                if(prod1.id == prod2.id) {
                    return true;
                } else {
                    return false;
                }
            }
            return isSameObject(prod1, prod2);
        }

        viewModel.orderLineHasSub = function(order_line) {
            if(order_line.actual_product) {
                if(isSameProduct(order_line.requested_product, order_line.actual_product)){
                    return false;
                } else {
                    return true;
                }
            }
            return false;
        };

        viewModel.refreshOrder = function() {
            loadView();
        };

        viewModel.cancelOrderDetail = function() {
            if(viewModel.hasChanges) {
                UIUtil.showYesNoConfirm('Save Order Changes', 'You have made changes to this order. Would you like to save them?')
                    .then(function(confirmed){
                        if(confirmed){
                            updateCurrentOrder(true);
                            $scope.closeOrderDetailModel();
                        } else {
                            $scope.closeOrderDetailModel();
                        }
                    })
            } else {
                $scope.closeOrderDetailModel();
            }
        };

        viewModel.rateOrderClick = function(order) {
            if($scope.orderDetailFromRateOrder ){
                viewModel.cancelOrderDetail();
                return;
            }
            ordersModalProvider.showOrderRatingModalForOrder($scope, viewModel.order)
        };

        $rootScope.$on('hide.add.rating', function(){
            if(ratingModal) ratingModal.hide();
        });

        $rootScope.$on('rating.saved.refresh', function(event, args){
            $log.info('rating.saved.refresh',args)
            if(viewModel.order) {
                viewModel.order.rating = args;
            }
        });

        viewModel.showRating = function(order){
            return (order.status == "delivered" && order.rating);
        };

        viewModel.showReconciliation = function(){
            if(!FeatureService.showCustomerOrderLineFeedback()){
                return false;
            } else {
                return viewModel.order.status == "delivered";
            }
        };

        viewModel.getDisplayProductForOrderLine = function(order_line) {
            order_line.current_product = order_line.actual_product ? order_line.actual_product : order_line.requested_product;
            return order_line.current_product;
        };

        viewModel.getDisplayNameForProduct = function(product) {
            if(!product) return;
            if(product.isCustom) {
                return product.description;
            } else {
                if(product.brand_name) {
                    return product.brand_name + " " + product.name;
                } else {
                    return product.name;
                }
            }
        };

        viewModel.itemGoodClick = function(order_line) {
            order_line.reconciled = 'good';
        };

        viewModel.itemBadClick = function(order_line) {
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    { text: 'Something Wrong With Item' },
                    { text: 'Item Missing' },
                    { text: 'Wrong Item' }
                ],
                titleText: 'Item Feedback',
                cancelText: 'Cancel',
                destructiveButtonClicked: function(){
                    itemMarkedAsMissing();
                    return true;
                },
                cancel: function() {
                    // add cancel code..
                },
                buttonClicked: function(index) {
                    if(index == 0) {
                        somethingWrongWithItemGetFeedback(order_line, 'Something Wrong');
                    } else if (index == 1) {
                        somethingWrongWithItem(order_line, 'Item Missing');
                    } else if (index = 2) {
                        somethingWrongWithItem(order_line, 'Wrong Item');
                    }
                    return true;
                }
            });
        };

        viewModel.accessibilityFocus = function() {
            $('.order-modal-title').focus();
        }

        function somethingWrongWithItem(order_line, text) {
            UIUtil.showYesNoConfirm(text, 'Are you sure you want to submit this issue?')
                .then(function(doIt){
                    if(doIt){
                        saveOrderLineFeedback(order_line, text);
                    }
                });
        }

        function somethingWrongWithItemGetFeedback(order_line, text){
            TextNotesModalProvider.showModal($scope,text,"Let us know what is wrong with the item","")
                .then(function(reason){
                    saveOrderLineFeedback(order_line, text, reason);
                });
        }

        function saveOrderLineFeedback(order_line, text, reason) {
            UIUtil.showLoading('Saving Feedback...');
            UserOrderService.saveItemReconcileInfo(order_line, text, reason)
                .then(function(response){
                    loadView();
                    var message = response.display_message ? response.display_message : "Thank you for your feedback. We will review your feedback and get back to you as soon as we can.";
                    UIUtil.showAlert('Feedback Saved', message);
                }, function(error){
                    UIUtil.hideLoading();
                    UIUtil.showAlert('Count Not Save Feedback', 'Sorry, but we were not able to save the feedback at this time.');
                });
        }

        function itemMarkedAsMissing(order_line){
            UIUtil.showAlert('Item Missing',
                'Item has been marked as missing. We will be in contact with you for more details.')
        }

        viewModel.addEditNote = function(order_line) {
            $ionicModal.fromTemplateUrl('app/groceries/shop/cartProductNotes/cartProductNotes.html',
                {
                    scope: $scope,
                    focusFirstInput: true,
                    animation: 'scale-in'
                })
                .then(function(modal) {
                    viewModel.notePopoverItem = order_line;
                    $scope.$broadcast('data.productNotes',viewModel.notePopoverItem.notes);
                    viewModel.noteModal = modal;
                    viewModel.noteModal.show();
                });
        };

        $scope.$on('close.productNotes',function(event, data){
            if(viewModel.notePopoverItem){
                viewModel.notePopoverItem.notes = data;
                updateCurrentOrder();
                viewModel.notePopoverItem = null;
                if(viewModel.noteModal)viewModel.noteModal.hide();
            }
        });

        $scope.$on('cancel.productNotes', function(){
            viewModel.notePopoverItem = null;
            if(viewModel.noteModal)viewModel.noteModal.hide();
        });

        viewModel.addOneToOrderLine = function(orderLine){
            if (orderLine.requested_product.product_type == 'by weight'){
                orderLine.requested_qty = (parseFloat((orderLine.requested_qty*100) + (orderLine.requested_product.unit_weight*100))/100);
            } else {
                orderLine.requested_qty ++ ;
            }
            updateCurrentOrder();
        };

        viewModel.removeOneFromOrderLine = function(orderLine){
            if (orderLine.requested_product.product_type == 'by weight'){
                orderLine.requested_qty = (parseFloat((orderLine.requested_qty*100) - (orderLine.requested_product.unit_weight*100))/100 );
            } else {
                orderLine.requested_qty -- ;
            }
            if(orderLine.requested_qty == 0) {
                viewModel.removeOrderLineCompletely (orderLine);
            }
            updateCurrentOrder();
        };

        viewModel.removeOrderLineCompletely = function(orderLine){
            var index;
            index = viewModel.order.order_lines.indexOf(orderLine);
            if (index > -1) {
                viewModel.order.order_lines.splice(index,1);
            }
            updateCurrentOrder();
        };


        $scope.addProduct = function(productToAdd){
            $log.info('add item', productToAdd);
            ShoppingService.addProductToCart(productToAdd);
            $scope.refreshCartData();
        };

        $scope.removeCartItemForProductFromCartCompletely = function(cartItem) {
            ShoppingService.removeProductsCartItemFromCart(cartItem.product);
            $scope.refreshCartData();
        };

        viewModel.cancelOrderClick = function(order) {
            UIUtil.showYesNoConfirm("Cancel Order", "Are you sure you want to cancel this order?")
                .then(function(confirmed){
                    if(confirmed){
                        UIUtil.showLoading();
                        try {
                            AccountService.cancelOrder(order)
                                .success(function(data, status, headers, config){
                                    AppAnalytics.cancelOrder();
                                    UIUtil.hideLoading();
                                    $rootScope.$broadcast('order.saved.refresh');
                                    UIUtil.showAlert('Canceled', 'Order has been canceled.');
                                    viewModel.hasChanges = false;
                                    viewModel.cancelOrderDetail();
                                })
                                .error(function(data, status, headers, config){
                                    UIUtil.hideLoading();
                                    showCancelOrderErrorMessage(data);
                                });
                        } catch (exception) {
                            UIUtil.hideLoading();
                        }
                    }
                });
        };

        function showCancelOrderErrorMessage(error) {
            if(!error.errors){
                UIUtil.showErrorAlert('Not able to cancel order \n\n' + JSON.stringify(error));
            }
            var message = 'Not able to cancel order. \n\n';
            var i;
            if(error.errors.base){
                for (i=0; i< error.errors.base.length; i++) {
                    message += '\n';
                    message += error.errors.base[i];
                }
            }
            UIUtil.showAlert('Cancel Order',message);
        }

        UIUtil.showLoading('Loading Order Info...')
        loadView();

        viewModel.getTipString = function(){
            if(viewModel.order.tip && viewModel.order.tip > 0){
                return $filter('currency')(viewModel.order.tip);
            } else {
                return 'No Tip';
            }
        };

        viewModel.getOrderMessage = function() {
            return UserOrderService.getCheckoutScreenMessageForOrder(viewModel.order);
        };

        viewModel.tipClick = function(){
            if(!viewModel.order.tippable) {
                UIUtil.showAlert('Tipping Not Available', 'Oops! The 24 hour tip window has expired.');
                return;
            }
            TippingModalProvider.showModal($scope ,viewModel.order)
                .then(function(order){
                    viewModel.order = order;
                })
        };

        viewModel.showTipButton = function(){
            if(!FeatureService.showTipping()){
                return false;
            } else {
                if($scope.orderDetailFromRateOrder) {
                    return false;
                }
                return viewModel.order.status == "delivered" || viewModel.order.status == "processed";
            }
        };

        viewModel.customLabel = function(product, quantity) {
            var label = product.description_label;
            if (product.product_type == "by weight") {
                return quantity/product.unit_weight > 1 ? label[1] : label[0];
            } else {
                return quantity > 1 ? label[1] : label[0];
            };
        };

        viewModel.getQuantity = function(product, quantity) {
            if (product.has_custom_label && product.product_type == 'by weight') {
                return $filter('number')(parseInt((quantity*100)/(product.unit_weight*100)));
            } else {
                return parseFloat(quantity);
            }
        }

        viewModel.getPrice = function(product) {
            if (product.product_type == 'by weight') {
                if (product.has_custom_label) {
                    var price = `~${$filter('currency')((product.price)*(product.unit_weight))}`;
                    var label = product.description_label[0];
                } else {
                    var price = $filter('currency')(product.price);
                    var label = weightedLabel(product);
                }
                return `${price} / ${label}`
            } else {
                return $filter('currency')(product.price);
            }
        }

        function weightedLabel(product) {
            if (product.unit_of_measure == "lbs" || product.unit_of_measure == "Per lb") {
                return "lb";
            } else {
                return product.unit_of_measure;
            }
        }

        viewModel.getSalePrice = function(product) {
            if (product.product_type == 'by weight') {
                if (product.has_custom_label) {
                    var price = `~${$filter('currency')((product.sale_price)*(product.unit_weight))}`;
                    var label = product.description_label[0];
                } else {
                    var price = $filter('currency')(product.sale_price);
                    var label = weightedLabel(product);
                }
                return `${price} / ${label}`;
            } else {
                return $filter('currency')(product.sale_price);
            }
        }

        viewModel.inCartCount = function (orderLine) {
            var product = orderLine.current_product
            if(product.product_type == 'by weight') {
                var unit_weight = product.unit_weight;
                if(product.has_custom_label) {
                    var quantity = $filter('number')((parseFloat(orderLine.requested_qty)*100)/(unit_weight*100), 0);
                    var label = quantity > 1 ? product.description_label[1] : product.description_label[0];
                    return `${quantity} ${label}`
                } else {
                    return parseFloat(orderLine.requested_qty);
                }
            } else {
                return orderLine.requested_qty;
                }
            };
    }
})();
