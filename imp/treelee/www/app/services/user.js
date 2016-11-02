/*global define*/
define([
    'app',
    'angular',
    'services/request'
], function (app, angular) {

    'use strict';

    app.service('userService', [
        'requestService',
        'localStorageService',
        function (requestService, localStorageService) {

            this.logged_in = false;

            // get register form fields
            this.getRegisterForm = function () {

                return requestService.send({
                    method: 'get',
                    url: '/customer/form',
                    success: function (res, promise) {
                        var form = res && res.form && res.form.fieldset ? res.form.fieldset : undefined,
                            formFields = [];

                        // check if there are form fields an put it in an array
                        if (form && form.field) {
                            if (angular.isArray(form.field)) {
                                formFields = form.field;
                            } else if (angular.isObject(form.field)) {
                                formFields = [form.field];
                            }
                        }

                        // check if there are select fields put options in an array
                        angular.forEach(formFields, function (field) {
                            if (field['@attributes'] && field['@attributes'].type === 'select') {
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

                        promise.resolve(formFields);
                    }
                });
            };

            this.loggedIn = function () {
                var self = this;
                return requestService.send({
                    method: 'get',
                    url: '/customer/isLoggined',
                    success: function (res, promise) {
                        var loggedIn = res && res.is_loggined && res.is_loggined === '1' ? true : false;

                        if (loggedIn) {
                            localStorageService.add('auth.treelee.logged_in', true);
                        }

                        self.logged_in = loggedIn;

                        promise.resolve(loggedIn);
                    }
                });
            };

            // register a new user
            this.register = function (params) {

                return requestService.send({
                    method: 'post',
                    url: '/customer/save',
                    data: params,
                    success: function (res, promise) {

                        localStorageService.add('auth.treelee.logged_in', true);

                        promise.resolve(res);
                    }
                });
            };

            this.buildBillingAddress = function (params) {
                var addressData = {
                    "firstname": params['billing[firstname]'],
                    "lastname": params['billing[lastname]'],
                    "street[]": params['billing[street][]'],
                    "city": params['billing[city]'],
                    "country_id": params['billing[country_id]'],
                    "region_id": params['billing[region_id]'],
                    "postcode": params['billing[postcode]'],
                    "telephone": params['billing[telephone]'],
                    "default_billing": 1
                };
                this.saveAddress(addressData);
            };

            this.buildShippingAddress = function (params) {
                var addressData = {
                    "firstname": params['shipping[firstname]'],
                    "lastname": params['shipping[lastname]'],
                    "street[]": params['shipping[street][]'],
                    "city": params['shipping[city]'],
                    "country_id": params['shipping[country_id]'],
                    "region_id": params['shipping[region_id]'],
                    "postcode": params['shipping[postcode]'],
                    "telephone": params['shipping[telephone]'],
                    "default_shipping": 1
                };
                this.saveAddress(addressData);
            };

            this.saveAddress = function (params) {
                return requestService.send({
                    method: 'post',
                    url: '/customer/saveAddress',
                    data: params,
                    success: function (res, promise) {
                        promise.resolve(res);
                    }
                });
            };

            // recover your password
            this.recoverPassword = function (params) {
                return requestService.send({
                    method: 'post',
                    url: '/customer/forgotPassword',
                    data: params
                });
            };

            // login
            this.login = function (params) {

                return requestService.send({
                    method: 'post',
                    url: '/customer/login',
                    data: params,
                    success: function (res, promise) {

                        localStorageService.add('auth.treelee.logged_in', true);

                        promise.resolve(res);
                    }
                });
            };

            // get username and email
            this.getUserData = function () {
                return requestService.send({
                    method: 'get',
                    url: '/customer/info'
                });
            };

            // get Address Data
            this.getUserAddress = function () {
                var self = this;

                return requestService.send({
                    method: 'get',
                    url: '/customer/address',
                    auth: true,
                    success: function (res, promise) {
                        var address = {},
                            i = 0;

                        if (angular.isArray(res.address.item)) {
                            for (i; i < res.address.item.length; i = i + 1) {
                                if (res.address.item[i]['@attributes'].default_billing === '1') {
                                    address.billing = res.address.item[i];
                                } else if (res.address.item[i]['@attributes'].default_shipping === '1') {
                                    address.shipping = res.address.item[i];
                                } else if (res.address.item[i]['@attributes'].additional === '1') {
                                    address.additional = [];
                                    address.additional.push(res.address.item[i]);
                                }
                            }
                        } else if (angular.isObject(res.address.item)) {
                            address.billing = res.address.item;
                        }

                        self.address = address;

                        promise.resolve(address);
                    }
                });
            };

            this.deleteAddress = function (customerId) {
                return requestService.send({
                    method: 'get',
                    url: '/customer/deleteAddress/id/' + customerId,
                    auth: true
                });
            };

            // logout
            this.logout = function () {

                return requestService.send({
                    method: 'get',
                    url: '/customer/logout',
                    auth: true,
                    success: function (res, promise) {

                        localStorageService.remove('auth.treelee.logged_in');

                        promise.resolve();
                    }
                });
            };
        }
    ]);
});