/**
 * Created by Shipt
 */


(function () {
    'use strict';

    angular.module('shiptApp').controller('CheckoutController', [
        '$scope',
        '$rootScope',
        '$ionicModal',
        'ShoppingService',
        'UserOrderService',
        '$log',
        '$state',
        'UIUtil',
        'common',
        'LogService',
        '$ionicPopover',
        'AccountService',
        'ShareModalProvider',
        'DeliveryWindowSelectorProvider',
        'SubstitutionOptionsModalProvider',
        'ErrorHandler',
        'AppAnalytics',
        'createPaymentMethodModal',
        'selectAddressModal',
        '$q',
        '$ionicHistory',
        'StoreService',
        'FeatureService',
        'ShiptLogItemsService',
        'ordersModalProvider',
        CheckoutController]);

    function CheckoutController($scope,
                                $rootScope,
                                $ionicModal,
                                ShoppingService,
                                UserOrderService,
                                $log,
                                $state,
                                UIUtil,
                                common,
                                LogService,
                                $ionicPopover,
                                AccountService,
                                ShareModalProvider,
                                DeliveryWindowSelectorProvider,
                                SubstitutionOptionsModalProvider,
                                ErrorHandler,
                                AppAnalytics,
                                createPaymentMethodModal,
                                selectAddressModal,
                                $q,
                                $ionicHistory,
                                StoreService,
                                FeatureService,
                                ShiptLogItemsService,
                                ordersModalProvider) {

        var viewModel = this;
        $log.info('CheckoutController Start');
        var resetAddress = true;
        var resetCard = true;
        var needsRefresh = true;
        viewModel.title = "Checkout";

        viewModel.substitutionOptions = common.getCustomerOrderSubstitutionPreferenceOptions();

        viewModel.selectedSubstitutionOption = viewModel.substitutionOptions[0];
        var order =  new common.Order();

        viewModel.checkout = {
            selectedAddress: null,
            deliveryWindow: null,
            selectedCard: null
        };

        $scope.guest_account = function(){
            return AccountService.isCustomerGuest();
        };

        var buildUpOrderObject = function() {
            order = new common.Order();
            if(viewModel.checkout.selectedAddress) {
                order.customer_address_id = viewModel.checkout.selectedAddress.id;
            }
            if(viewModel.checkout.deliveryWindow) {
                order.time_slot_id = viewModel.checkout.deliveryWindow.time_slot_id;
            }
            if(viewModel.checkout.selectedCard) {
                order.credit_card_id = viewModel.checkout.selectedCard.id;
            }
            order.notes = viewModel.notes;
            order.alcohol_terms_accepted = $rootScope.alcohol_terms_accepted
            order.substitution_preference = viewModel.selectedSubstitutionOption.value;
            addOrderLinesToOrderObject();
        };

        var addOrderLinesToOrderObject = function() {
            var i;
            order.order_lines = [];
            for(i = 0; i < viewModel.cart.length; i++ ) {
                var cartItem = viewModel.cart[i];
                if(cartItem.product.isCustom) {
                    var orderLine = new common.CustomOrderLine();
                    orderLine.requested_qty = cartItem.qty;
                    orderLine.requested_product_attributes.description = cartItem.product.name;
                    orderLine.notes = cartItem.note;
                    order.order_lines.push(orderLine);
                } else {
                    var orderLine = new common.OrderLine();
                    orderLine.requested_product_id = cartItem.product.id;
                    orderLine.product = cartItem.product;
                    orderLine.requested_qty = cartItem.qty;
                    orderLine.notes = cartItem.note;
                    order.order_lines.push(orderLine);
                }
            }
        };

        viewModel.showDeliveryWindowSelector = function(){
            var windows = viewModel.newOrder.time_slots;
            var selectedWindow = viewModel.checkout.deliveryWindow;
            DeliveryWindowSelectorProvider.showSelectDeliveryWindowModal($scope, windows, selectedWindow)
                .then(function(newSelectedWindow){
                    viewModel.checkout.deliveryWindow = newSelectedWindow;
                    AppAnalytics.track('checkoutDeliveryWindowSelected',newSelectedWindow);
                })
            AppAnalytics.track('checkoutChangeDeliveryWindowClicked');
        };

        viewModel.showSubstitutionOptionsModal = function() {
            var selectedWindow = viewModel.checkout.deliveryWindow;
            SubstitutionOptionsModalProvider.showSubstitutionOptionsModal($scope,viewModel.substitutionOptions , viewModel.selectedSubstitutionOption)
                .then(function(newselectedSubstitutionOption){
                    viewModel.selectedSubstitutionOption = newselectedSubstitutionOption;
                    AppAnalytics.track('checkoutSubstitutionOptionSelected',newselectedSubstitutionOption);
                })
            AppAnalytics.track('checkoutSubstitutionOptionsClicked');
        };

        viewModel.checkOrder = function(){
            if(!viewModel.checkout){
                return false;
            }
            if(!viewModel.checkout.selectedAddress){
                UIUtil.showAlert('Address Required','Please select an address.');
                return false;
            }
            if(!viewModel.checkout.deliveryWindow ){
                UIUtil.showAlert('Delivery Window Required','Please select a delivery window.');
                return false;
            }
            if (!viewModel.checkout.selectedCard){
                UIUtil.showAlert('Payment Method Required','Please select payment method.');
                return false;
            }
            return true;
        };

        function removeSelectedTimeSlotFromArrayThatIsNotAvailable() {
            try {

                var indexToRemove = viewModel.newOrder.time_slots.indexOf(viewModel.checkout.deliveryWindow);
                if (indexToRemove > -1) {
                    viewModel.newOrder.time_slots[indexToRemove].available = false;
                }
                if(viewModel.checkout.deliveryWindow) {
                    viewModel.checkout.deliveryWindow = null;
                }
            } catch (exception) {
                LogService.error('removeSelectedTimeSlotFromArrayThatIsNotAvailable' + exception)
            }
        }

        viewModel.submitOrder = function() {
            if(viewModel.checkOrder()){
                UIUtil.showLoading();
                buildUpOrderObject();
                AppAnalytics.checkoutButtonClicked();
                $log.info("submitOrder" , order);
                UserOrderService.postNewOrder(order)
                    .then(function(createdOrder){
                        viewModel.createdOrder = createdOrder;
                        showOrderDetailAfterPurchaseComplete(createdOrder);
                        ShoppingService.clearCart();
                        UIUtil.hideLoading();
                        AppAnalytics.checkoutComplete(createdOrder, order.order_lines, viewModel.checkout.selectedAddress);
                    },function(error){
                        AppAnalytics.checkoutButtonClickedError();
                        LogService.error(['submitOrder error ', error, order]);
                        var message = ErrorHandler.displayShiptAPIError(error, 'Problem Submitting Order', 'Not able to submit your order at this time.')
                        if(message.includes("should be available_for_delivery")) {
                            removeSelectedTimeSlotFromArrayThatIsNotAvailable();
                        }
                        UIUtil.hideLoading();
                    });
            }
        };

        viewModel.addressChanged = function() {
            if(!viewModel.checkout.selectedAddress){
                resetAddress = true;
                viewModel.addAddress();
            }
        };

        function addressIsChoosableBasedOnCurrentStoreAndStuff(newAddress) {
            var deferred = $q.defer();
            if(!FeatureService.chooseStoreInApp()){
                deferred.resolve();
                return deferred.promise;
            }
            var currentDefaultAddress = viewModel.newOrder.available_customer_addresses.find(a => a.id == viewModel.customer.default_shopping_address_id);
            if(!currentDefaultAddress){
                deferred.resolve();
                return deferred.promise;
            }
            if (currentDefaultAddress.store_location_id == newAddress.store_location_id){
                StoreService.selectStoreIdWithAddress(newAddress.store_id, newAddress);
                deferred.resolve();
            } else if (currentDefaultAddress.store_id == newAddress.store_id ) {
                UIUtil.showYesNoConfirm('This address is serviced by a different store.', "We can update your cart however: Some items may have changed price. Sales may not be applicable. Some items may be unavailable. Want us to update your cart?", "Yes","No")
                    .then(function(shouldChangeStoreAndStuff){
                        if(shouldChangeStoreAndStuff){
                            AppAnalytics.track('customerCheckoutChangeStoreLocationWarned',{customerChangedAddress:true});
                            ShiptLogItemsService.logInfo('analytics','customerCheckoutChangeStoreLocationWarned',{customerChangedAddress:true});
                            deferred.reject();
                            $ionicHistory.goBack();
                            StoreService.selectStoreIdWithAddress(newAddress.store_id,newAddress);
                        } else {
                            deferred.reject();
                            AppAnalytics.track('customerCheckoutChangeStoreLocationWarned',{customerChangedAddress:false});
                            ShiptLogItemsService.logInfo('analytics','customerCheckoutChangeStoreLocationWarned',{customerChangedAddress:false});
                        }
                    })
                // if store is same but location is different then
                // log it and tell the customer that some item availability may change and send back to cart
            } else if (currentDefaultAddress.store_id != newAddress.store_id) {
                // if store is differnt say NA BITCH
                AppAnalytics.track('customerCheckoutChangeStoreBlocked');
                ShiptLogItemsService.logInfo('analytics','customerCheckoutChangeStoreBlocked');
                UIUtil.showAlert('This address is not in your selected store\'s service area.', "To change where you are shopping please change your location on the home screen of the app.")
                deferred.reject();
            }
            return deferred.promise;
        };

        viewModel.selectAddress = function() {
            selectAddressModal.showModal($scope, viewModel.newOrder.available_customer_addresses, viewModel.checkout.selectedAddress, viewModel.addAddress)
                .then(function(selectedAddress){
                    if(selectedAddress) {
                        AppAnalytics.track('checkoutNewAddressSelected');
                        addressIsChoosableBasedOnCurrentStoreAndStuff(selectedAddress)
                            .then(function(){
                                viewModel.checkout.selectedAddress = selectedAddress;
                            }, function(){

                            })
                    }
                },function(){

                })
            AppAnalytics.track('checkoutSelectAddressClicked');
        };

        viewModel.cardChanged = function() {
            if(!viewModel.checkout.selectedCard){
                resetCard = true;
                viewModel.addCard();
            }
            AppAnalytics.track('checkoutCardChanged');
        };

        viewModel.getOrderMessage = function() {
            return UserOrderService.getCheckoutScreenMessageForOrder(viewModel.newOrder);
        };

        function showOrderDetailAfterPurchaseComplete (createdOrder) {
            ordersModalProvider.orderHistoryModal(null, createdOrder)
            if(!webVersion){
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
            }
            // Go back to home
            $state.go('app.home');
        }

        function selectFirstItemsForOrder() {
            if(viewModel.newOrder) {
                viewModel.checkout.selectedCard = viewModel.newOrder.available_credit_cards[0];
                viewModel.checkout.selectedAddress = viewModel.newOrder.available_customer_addresses.find(a => a.id == viewModel.customer.default_shopping_address_id);
                if(!viewModel.checkout.selectedAddress) {
                    viewModel.checkout.selectedAddress = viewModel.newOrder.available_customer_addresses[0];
                }
            }
        }

        function loadData() {
            try {
                $log.info('loadData() Start');
                viewModel.customer = AccountService.getCustomerInfo(true);
                UIUtil.showLoading();
                viewModel.cart = ShoppingService.getCartItems();
                $log.info('cart items passed to checkout:' , viewModel.cart);
                viewModel.subtotal = ShoppingService.getCartTotal();
                addOrderLinesToOrderObject();
                order.alcohol_terms_accepted = $rootScope.alcohol_terms_accepted
                UserOrderService.getNewOrderForCustomer(order)
                    .then(function(data){
                        viewModel.newOrder = data;
                        $log.info('new order', data);
                        selectFirstItemsForOrder();
                        UIUtil.hideLoading();
                    }, function(error, status){
                        if(isSubscriptionError(error)) {
                            //continue to checkout screen
                            viewModel.subscriptionErrorDontAllowCheckout = true;
                            viewModel.subscriptionErrorMessage = '';
                            viewModel.newOrder = error;
                            selectFirstItemsForOrder();
                            if(error.errors.subscription){
                                for (var i=0; i< error.errors.subscription.length; i++) {
                                    viewModel.subscriptionErrorMessage += ' \n';
                                    viewModel.subscriptionErrorMessage += error.errors.subscription[i];
                                }
                            }
                            UIUtil.hideLoading();
                        }
                        if(isLaunchError(error)){
                            viewModel.launchErrorDontAllowCheckout = true;
                            viewModel.launchErrorMessage = '';
                            viewModel.newOrder = error;
                            selectFirstItemsForOrder();
                            if(error.errors.launch){
                                for (var i=0; i< error.errors.launch.length; i++) {
                                    viewModel.launchErrorMessage += ' \n';
                                    viewModel.launchErrorMessage += error.errors.launch[i];
                                }
                            }
                            UIUtil.hideLoading();
                        }
                        if(!isSubscriptionError(error) && !isLaunchError(error)){
                            var logError = {
                                message:'loadData create new order error',
                                error: error,
                                cart: viewModel.cart,
                                status: status
                            };
                            LogService.error(logError);
                            UIUtil.hideLoading();
                            $log.error('error', error);
                            ErrorHandler.displayShiptAPIError(error);
                            window.history.back();
                        }
                    });

                $log.info('loadData() END');
            } catch(e) {
                $log.error('error',e);
            }
        }

        function isLaunchError(error){
            if(error && error.errors && error.errors.launch) {
                return true;
            }
            return false;
        }
        function isSubscriptionError(error){
            if(error && error.errors && error.errors.subscription) {
                return true;
            }
            return false;
        }

        function callGetNewOrderForNewAddressSelected() {
            UIUtil.showLoading();
            buildUpOrderObject();
            UserOrderService.getNewOrderForCustomer(order)
                .then(function(data){
                    viewModel.checkout.deliveryWindow = null;
                    viewModel.newOrder.total_with_tax = data.total_with_tax;
                    viewModel.newOrder.requested_tax = data.requested_tax;
                    viewModel.newOrder.delivery_fee = data.delivery_fee;
                    viewModel.newOrder.total_with_tax = data.total_with_tax;
                    viewModel.newOrder.available_time_slots = data.available_time_slots;
                    viewModel.newOrder.time_slots = data.time_slots;
                    $log.info('callGetNewOrder new order', data);
                    UIUtil.hideLoading();
                }, function(error){
                    if(isSubscriptionError(error)) {
                        //continue to checkout screen
                        viewModel.subscriptionErrorDontAllowCheckout = true;
                        viewModel.subscriptionErrorMessage = '';
                        if(error.errors.subscription){
                            for (var i=0; i< error.errors.subscription.length; i++) {
                                viewModel.subscriptionErrorMessage += ' \n';
                                viewModel.subscriptionErrorMessage += error.errors.subscription[i];
                            }
                        }

                        viewModel.checkout.deliveryWindow = null;
                        viewModel.newOrder.total_with_tax = error.total_with_tax;
                        viewModel.newOrder.requested_tax = error.requested_tax;
                        viewModel.newOrder.delivery_fee = error.delivery_fee;
                        viewModel.newOrder.total_with_tax = error.total_with_tax;
                        viewModel.newOrder.available_time_slots = error.available_time_slots;
                        viewModel.newOrder.time_slots = error.time_slots;
                        $log.info('callGetNewOrder new order', error);
                        UIUtil.hideLoading();
                    }
                    if(isLaunchError(error)){
                        viewModel.launchErrorDontAllowCheckout = true;
                        viewModel.launchErrorMessage = '';
                        selectFirstItemsForOrder();
                        if(error.errors.launch){
                            for (var i=0; i< error.errors.launch.length; i++) {
                                viewModel.launchErrorMessage += ' \n';
                                viewModel.launchErrorMessage += error.errors.launch[i];
                            }
                        }
                        viewModel.checkout.deliveryWindow = null;
                        viewModel.newOrder.total_with_tax = error.total_with_tax;
                        viewModel.newOrder.requested_tax = error.requested_tax;
                        viewModel.newOrder.delivery_fee = error.delivery_fee;
                        viewModel.newOrder.total_with_tax = error.total_with_tax;
                        viewModel.newOrder.available_time_slots = error.available_time_slots;
                        viewModel.newOrder.time_slots = error.time_slots;
                        $log.info('callGetNewOrder new order', error);
                        UIUtil.hideLoading();
                    }
                    if(!isSubscriptionError(error) && !isLaunchError(error)){
                        var logError = {
                            message:'callGetNewOrderForNewAddressSelected create new order error',
                            error: error,
                            cart: viewModel.cart
                        };
                        LogService.error(logError);
                        UIUtil.hideLoading();
                        $log.error('error', error);
                        ErrorHandler.displayShiptAPIError(error);
                        window.history.back();
                    }
                });
        }

        viewModel.clickAddressToSelectIt = function(address){
            addressIsChoosableBasedOnCurrentStoreAndStuff(address)
                .then(function(){
                    viewModel.checkout.selectedAddress = address;
                }, function(){
                    //dont select it.
                })
        }

        $scope.$watch('viewModel.checkout.selectedAddress',function(newValue, oldValue){
            if (newValue) {
                callGetNewOrderForNewAddressSelected();
            }
        });

        viewModel.addCard = function() {
            if(webVersion){
                createPaymentMethodModal.showModal($scope)
                    .then(function(newCard){
                        loadData();
                    },function(error){
                        //canceled the payment modal
                    })
            } else {
                $state.go('app.addEditCard', {card: angular.toJson(null)});
            }
            AppAnalytics.track('checkouAddCardClicked');
        };

        viewModel.addAddress = function() {
            $state.go('app.addEditAddressMap', {address: angular.toJson(null), fromCheckout: true});
            AppAnalytics.track('checkouAddAddressClicked');
        };

        $rootScope.$on('refresh.user-data', function(){
            needsRefresh = true;
        });

        $scope.$on('$ionicView.beforeEnter', function() {
            if(needsRefresh){
                needsRefresh = false;
                loadData();
            }
            //only going to reset the address or card if it needs to be changed back from the "add" option.
            if(viewModel.newOrder) {
                if (resetAddress) {
                    viewModel.checkout.selectedAddress = viewModel.newOrder.available_customer_addresses[0];
                    resetAddress = false;
                }
                if (resetCard) {
                    viewModel.checkout.selectedCard = viewModel.newOrder.available_credit_cards[0];
                    resetCard = false;
                }
            }
        });

        AppAnalytics.beginCheckout();

        var previousNotesPopover = null;

        function getOldOrderNotess() {
            var orders = AccountService.getOrders();
            var notes = _.uniq( _.map(orders, function(order){ if(order.notes)return order.notes; }));
            return notes;
        }

        viewModel.viewPreviousNotes = function($event){
            $ionicPopover.fromTemplateUrl('templates/previousNotesPopover.html', {
                scope: $scope
            }).then(function(popover) {
                $scope.oldOrderNotess = getOldOrderNotess();
                previousNotesPopover = popover;
                previousNotesPopover.show($event).then(function() {
                    $('.old-notes-item')[0].focus(); //accessibility
                });
            });
            AppAnalytics.track('checkoutChoosePreviousDeliveryNoteClicked');
        };

        $scope.clickOldOrderNotes = function(notes) {
            if(viewModel.notes && viewModel.notes != '') {
                viewModel.notes += '\n\n' + notes;
            } else {
                viewModel.notes = notes;
            }
            previousNotesPopover.hide();
            AppAnalytics.track('checkoutPreviousDeliveryNoteChoosen');
        };

        $log.info('CheckoutController End');
    }
})();
