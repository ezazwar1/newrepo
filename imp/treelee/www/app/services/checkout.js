/*global define*/
define([
    'app',
    'angular',
    'services/request'
], function (app, angular) {

    'use strict';

    app.service('checkoutService', [
        'requestService',
        function (requestService) {

            this.checkout = {};

            this.method = function (method) {
                return requestService.send({
                    method: 'post',
                    url: '/checkout/saveMethod',
                    data: {
                        method: method
                    }
                });
            };

            this.prefillRegistered = function (registration) {
                this.checkout.billingAddress = {};
                this.checkout.billingAddress['billing[firstname]'] = registration.firstname;
                this.checkout.billingAddress['billing[lastname]'] = registration.lastname;
                this.checkout.billingAddress['billing[save_in_address_book]'] = 1;
                this.checkout.billingAddress['billing[use_for_shipping]'] = 0;
            };

            this.prefillSaved = function (userAddress) {
                if (userAddress.billing) {
                    this.checkout.billingAddress = {};
                    this.checkout.billingAddress['billing[entity_id]'] = userAddress.billing.entity_id;
                    this.checkout.billingAddress['billing[firstname]'] = userAddress.billing.firstname;
                    this.checkout.billingAddress['billing[lastname]'] = userAddress.billing.lastname;
                    this.checkout.billingAddress['billing[company]'] = userAddress.billing.company;
                    this.checkout.billingAddress['billing[street][]'] = userAddress.billing.street;
                    this.checkout.billingAddress['billing[city]'] = userAddress.billing.city;
                    this.checkout.billingAddress['billing[country_id]'] = userAddress.billing.country_id;
                    this.checkout.billingAddress['billing[postcode]'] = userAddress.billing.postcode;
                    this.checkout.billingAddress['billing[telephone]'] = userAddress.billing.telephone;
                    this.checkout.billingAddress['billing[save_in_address_book]'] = 0;
                    this.checkout.billingAddress['billing[use_for_shipping]'] = 0;
                } else if (userAddress.additional && userAddress.additional[0]) {
                    this.checkout.billingAddress = {};
                    this.checkout.billingAddress['billing[entity_id]'] = userAddress.additional[0].entity_id;
                    this.checkout.billingAddress['billing[firstname]'] = userAddress.additional[0].firstname;
                    this.checkout.billingAddress['billing[lastname]'] = userAddress.additional[0].lastname;
                    this.checkout.billingAddress['billing[company]'] = userAddress.additional[0].company;
                    this.checkout.billingAddress['billing[street][]'] = userAddress.additional[0].street;
                    this.checkout.billingAddress['billing[city]'] = userAddress.additional[0].city;
                    this.checkout.billingAddress['billing[country_id]'] = userAddress.additional[0].country_id;
                    this.checkout.billingAddress['billing[postcode]'] = userAddress.additional[0].postcode;
                    this.checkout.billingAddress['billing[telephone]'] = userAddress.additional[0].telephone;
                    this.checkout.billingAddress['billing[save_in_address_book]'] = 0;
                    this.checkout.billingAddress['billing[use_for_shipping]'] = 0;
                }
                if (userAddress.shipping) {
                    this.checkout.shippingAddress = {};
                    this.checkout.shippingAddress['shipping[entity_id]'] = userAddress.shipping.entity_id;
                    this.checkout.shippingAddress['shipping[firstname]'] = userAddress.shipping.firstname;
                    this.checkout.shippingAddress['shipping[lastname]'] = userAddress.shipping.lastname;
                    this.checkout.shippingAddress['shipping[company]'] = userAddress.shipping.company;
                    this.checkout.shippingAddress['shipping[street][]'] = userAddress.shipping.street;
                    this.checkout.shippingAddress['shipping[city]'] = userAddress.shipping.city;
                    this.checkout.shippingAddress['shipping[country_id]'] = userAddress.shipping.country_id;
                    this.checkout.shippingAddress['shipping[postcode]'] = userAddress.shipping.postcode;
                    this.checkout.shippingAddress['shipping[telephone]'] = userAddress.shipping.telephone;
                }
            };

            this.billingForm = function () {
                var self = this;

                return requestService.send({
                    method: 'get',
                    url: '/checkout/newBillingAddressForm',
                    success: function (res, promise) {
                        var form = res && res.form ? res.form : undefined,
                            formFields = [];

                        // check if there are form fields and put it in an array
                        if (form && form.field) {
                            if (angular.isArray(form.field)) {
                                formFields = form.field;
                            } else if (angular.isObject(form.field)) {
                                formFields = [form.field];
                            }
                        }

                        // check if there are select fields put options in an array
                        angular.forEach(formFields, function (field, key) {
                            if (field['@attributes'] && (field['@attributes'].id === 'street_2' || field['@attributes'].id === 'save_in_address_book')) {
                                formFields.splice(key, 1);
                            } else if (field['@attributes'] && field['@attributes'].type === 'select') {
                                if (field.values && field.values.item) {
                                    if (angular.isArray(field.values.item)) {
                                        field.values = field.values.item;
                                    } else if (angular.isObject(field.values.item)) {
                                        field.values = [field.values.item];
                                    } else {
                                        field.values = [];
                                    }
                                } else {
                                    field.values = [];
                                }
                            }
                        });

                        self.checkout.billingForm = formFields;

                        promise.resolve(formFields);
                    }
                });
            };

            this.saveBilling = function (params) {
                var self = this;

                return requestService.send({
                    method: 'post',
                    url: '/checkout/saveBillingAddress',
                    data: params,
                    success: function (res, promise) {
                        // reset payment method/methods, if country has changed
                        if (self.checkout.billingAddress && self.checkout.billingAddress['billing[country_id]'] && params['billing[country_id]'] && params['billing[country_id]'] !== self.checkout.billingAddress['billing[country_id]']) {
                            self.checkout.payment = undefined;
                            self.checkout.payments = undefined;
                        }

                        if (params['billing[use_for_shipping]'] && params['billing[use_for_shipping]'] === '1') {
                            var newKey;
                            self.checkout.shippingAddress = {};

                            angular.forEach(params, function (value, key) {
                                newKey = key.replace(/^billing/, 'shipping');
                                self.checkout.shippingAddress[newKey] = value;
                            });
                        } else if (!self.checkout.shippingAddress) {
                            self.checkout.shippingAddress = undefined;
                        }
                        self.checkout.billingAddress = params;

                        promise.resolve(res);
                    }
                });
            };

            this.shippingForm = function () {
                var self = this;

                return requestService.send({
                    method: 'get',
                    url: '/checkout/newShippingAddressForm',
                    success: function (res, promise) {
                        var form = res && res.form ? res.form : undefined,
                            formFields = [];

                        // check if there are form fields and put it in an array
                        if (form && form.field) {
                            if (angular.isArray(form.field)) {
                                formFields = form.field;
                            } else if (angular.isObject(form.field)) {
                                formFields = [form.field];
                            }
                        }

                        // check if there are select fields put options in an array
                        angular.forEach(formFields, function (field, key) {
                            if (field['@attributes'] && (field['@attributes'].id === 'street_2' || field['@attributes'].id === 'save_in_address_book')) {
                                formFields.splice(key, 1);
                            } else if (field['@attributes'] && field['@attributes'].type === 'select') {
                                if (field.values && field.values.item) {
                                    if (angular.isArray(field.values.item)) {
                                        field.values = field.values.item;
                                    } else if (angular.isObject(field.values.item)) {
                                        field.values = [field.values.item];
                                    } else {
                                        field.values = [];
                                    }
                                } else {
                                    field.values = [];
                                }
                            }
                        });

                        self.checkout.shippingForm = formFields;

                        promise.resolve(formFields);
                    }
                });
            };

            this.saveShipping = function (params) {
                var self = this;

                return requestService.send({
                    method: 'post',
                    url: '/checkout/saveShippingAddress',
                    data: params,
                    success: function (res, promise) {
                        // reset shipping method/methods, if country has changed
                        if (self.checkout.shippingAddress && self.checkout.shippingAddress['shipping[country_id]'] && params['shipping[country_id]'] && params['shipping[country_id]'] !== self.checkout.shippingAddress['shipping[country_id]']) {
                            self.checkout.shippingMethod = undefined;
                            self.checkout.shippingMethods = undefined;
                        }
                        self.checkout.shippingAddress = params;

                        promise.resolve(res);
                    }
                });
            };

            this.shippingMethods = function () {
                var self = this;

                return requestService.send({
                    method: 'get',
                    url: '/checkout/shippingMethodsList',
                    success: function (res, promise) {
                        var shippingMethods = res && res.shipping_methods && res.shipping_methods.method ? res.shipping_methods.method : undefined,
                            methods = [],
                            validMethods = []; // filtered methods with error_message (not available)

                        if (shippingMethods) {
                            if (angular.isArray(shippingMethods)) {
                                methods = shippingMethods;
                            } else if (angular.isObject(shippingMethods)) {
                                methods = [shippingMethods];
                            }
                        }

                        angular.forEach(methods, function (method) {
                            // filter empty or not available shipping methods
                            if (method.rates && method.rates.rate && !method.rates.error_message) {
                                if (angular.isArray(method.rates.rate)) {
                                    method.rates = method.rates.rate;
                                } else if (angular.isObject(method.rates.rate)) {
                                    method.rates = [method.rates.rate];
                                } else {
                                    method.rates = [];
                                }
                                if (method.rates.length) {
                                    validMethods.push(method);
                                }
                            }
                        });

                        // save methods for this checkout
                        self.checkout.shippingMethods = validMethods;

                        promise.resolve(validMethods);
                    }
                });
            };

            this.saveShippingMethod = function (params) {
                var self = this;

                return requestService.send({
                    method: 'post',
                    url: '/checkout/saveShippingMethod',
                    data: params,
                    success: function (res, promise) {
                        // save methods for this checkout
                        self.checkout.shippingMethod = params.shipping_method;

                        promise.resolve(res);
                    }
                });
            };

            this.payments = function () {
                var self = this;

                return requestService.send({
                    method: 'get',
                    url: '/checkout/paymentMethodList',
                    success: function (res, promise) {
                        var paymentMethods = res && res.payment_methods && res.payment_methods.method_list ? res.payment_methods.method_list : undefined,
                            methods = [];

                        if (paymentMethods && paymentMethods.method) {
                            if (angular.isArray(paymentMethods.method)) {
                                methods = paymentMethods.method;
                            } else if (angular.isObject(paymentMethods.method)) {
                                methods = [paymentMethods.method];
                            }
                        }

                        // save methods for this checkout
                        self.checkout.payments = methods;

                        promise.resolve(methods);
                    }
                });
            };

            this.savePayment = function (params) {
                var self = this;

                return requestService.send({
                    method: 'post',
                    url: '/checkout/savePayment',
                    data: params,
                    success: function (res, promise) {
                        // save methods for this checkout
                        self.checkout.payment = params['payment[method]'];

                        promise.resolve(res);
                    }
                });
            };

            this.orderReview = function () {
                return requestService.send({
                    method: 'get',
                    url: '/checkout/orderReview',
                    success: function (res, promise) {
                        var order = res && res.order ? res.order : undefined,
                            price,
                            i = 0;

                        if (order) {
                            // correct formatting for products
                            if (order.products && order.products.item) {
                                if (angular.isArray(order.products.item)) {
                                    order.products = order.products.item;
                                } else if (angular.isObject(order.products.item)) {
                                    order.products = [order.products.item];
                                } else {
                                    order.products = [];
                                }
                            }
                            // correct formatting for agreements
                            if (order.agreements && order.agreements.item) {
                                if (angular.isArray(order.agreements.item)) {
                                    order.agreements = order.agreements.item;
                                } else if (angular.isObject(order.agreements.item)) {
                                    order.agreements = [order.agreements.item];
                                } else {
                                    order.agreements = [];
                                }
                            }
                        }

                        if (order.billing && order.billing.saved_billing && order.billing.saved_billing.match(/undefined/gi)) {
                            order.billing.saved_billing = order.billing.saved_billing.replace('<br />undefined', '');
                        }

                        if (order.shipping && order.shipping.saved_shipping && order.shipping.saved_shipping.match(/undefined/gi)) {
                            order.shipping.saved_shipping = order.shipping.saved_shipping.replace('<br />undefined', '');
                        }

                        // correct formatting for product.options
                        if (order.products.length) {
                            angular.forEach(order.products, function (product) {
                                if (product.options && product.options.option) {
                                    if (angular.isArray(product.options.option)) {
                                        product.options = product.options.option;
                                    } else if (angular.isObject(product.options.option)) {
                                        product.options = [product.options.option];
                                    } else {
                                        product.options = [];
                                    }
                                }
                            });

                            // format price
                            if (angular.isArray(order.products)) {
                                for (i; i < order.products.length; i = i + 1) {
                                    price = order.products[i].formated_price['@attributes'].regular;
                                    order.products[i].formated_price['@attributes'].regular = price.replace("\u00a0", " ");
                                }
                            }
                        }

                        promise.resolve(order);
                    }
                });
            };

            this.saveOrder = function (params) {
                var self = this;

                return requestService.send({
                    method: 'post',
                    url: '/checkout/saveOrder',
                    data: params,
                    success: function (res, promise) {
                        // clean up checkout object
                        self.checkout = {};

                        promise.resolve(res);
                    }
                });
            };
        }
    ]);
});
