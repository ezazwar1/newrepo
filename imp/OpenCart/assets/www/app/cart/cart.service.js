'use strict';


/**
* @ngdoc service
* @name cart.module.CartService
* @requires ng.$q
* @requires dateService
* @description 
* This service class contains methods needed from add an item to the cart upto checkout with online purchase.
*/
angular
    .module('cart.module')
    .service('CartService', function ($q, dataService) {

        this.OrderComment = "";

        /**
         * @ngdoc function
         * @name shop.module.CartService#GetShippingMethods
         * @methodOf cart.module.CartService
         * @kind function
         * 
         * @description
         * Returns available shipping methods for the current cart and customer
         * 
         * @example
         <pre>
            CartService.GetShippingMethods().then(function (data) {
                $scope.shippingMethods = data;
            });
         </pre>
         *Resolved Object
         <pre>
         [{
             "code":"flat.flat",
             "title":"Flat Shipping Rate",
             "cost":"5.00",
             "tax_class_id":"9",
             "text":"$5.00",
             "method":"flat",
             "main_title":"Flat Rate"
         }]
         </pre>
         * 
         * @returns {promise} Returns a promise of the array of shipping method objects
         */
        this.GetShippingMethods = function () {
            return dataService.apiSecuredPost('/shipping/methods').then(function (data) {

                var array = [];
                angular.forEach(data.shipping_methods, function (value, key) {
                    var title = value.title;
                    value = value.quote[key];
                    value.method = key;
                    value.main_title = title;
                    array.push(value);
                });

                return $q.all(array);
            });
        }

        /**
         * @ngdoc function
         * @name shop.module.CartService#GetPaymentMethods
         * @methodOf cart.module.CartService
         * @kind function
         * 
         * @description
         * Returns available payment methods depending on the shipping selection
         * 
         * @example
         <pre>
            CartService.GetPaymentMethods().then(function (data) {
                $scope.paymentMethods = data;
            });
         </pre>
         *Resolved Object
         <pre>
         [{
            "code":"cod",
            "title":"Cash On Delivery",
            "terms":"",
            "sort_order":"5"
         }]
         </pre>
         * 
         * @returns {promise} Returns a promise of the array of payment method objects
         */
        this.GetPaymentMethods = function () {

            return dataService.apiSecuredPost('/payment/methods').then(function (data) {
                if (data.error) {
                    $q.reject(data.error);
                }

                var array = [];

                angular.forEach(data.payment_methods, function (value) {
                    var title = value.title;
                    array.push(value);
                });

                return $q.all(array);
            });
        }

        /**
         * @ngdoc function
         * @name shop.module.CartService#LoadZones
         * @methodOf cart.module.CartService
         * @kind function
         * 
         * @description
         * Returns an array of zone objects relevent to a country
         * @param {String} country_id Selected country id
         * @returns {promise} Returns a promise of the array of zone objects
         */
        this.LoadZones = function (country_id) {
            return dataService.apiSecuredPost('/address/getzones', { country_id: country_id }).then(function (data) {
                if (data.error) {
                    return $q.reject(data.error);
                }

                return data;
            });
        }

        /**
         * @ngdoc function
         * @name shop.module.CartService#AddOrder
         * @methodOf cart.module.CartService
         * @kind function
         * 
         * @description
         * Adds a new order
         * @param {object} order The order object
         * @param {number} order.shipping_method Shipping method if previously not set
         * @param {number} order.payment_method Payment method if previously not set
         * @param {string} order.comment Additional comment for the Order
         * @param {number} order.affiliate_id Affiliate id
         * @param {number} order.order_status_id Order history status id
         * 
         * @returns {promise} Promise of the API call
         */
        this.AddOrder = function (order) {

            return dataService.apiSecuredPost('/order/add', order).then(function (data) {
                if (data.error) {
                    return $q.reject(data.error);
                }

                return data;
            });
        }

        /**
         * @ngdoc function
         * @name shop.module.CartService#SetPersonalInfo
         * @methodOf cart.module.CartService
         * @kind function
         * 
         * @description
         * Saves user info section on checkout
         * 
         * @param {object} personal_info Personal info object
         * @param {number=} personal_info.customer_id Existing Customer ID to be loaded
         * @param {string} personal_info.firstname Customers first name. must be between 1 and 32 characters
         * @param {string} personal_info.lastname Customers last name. must be between 1 and 32 characters
         * @param {email} personal_info.email Customers email address. must be a valid email address
         * @param {string} personal_info.telephone Customers telephone number. must be between 3 and 32 characters
         * @param {number} personal_info.customer_group_id Customer group id. if none provided `config_customer_group_id` will be assigned
         * 
         * @returns {promise} Returns a promise of the update response
         */
        this.SetPersonalInfo = function (personal_info) {
            return dataService.apiSecuredPost('/customer', personal_info).then(function (data) {
                if (data.error) {
                    return $q.reject(data.error);
                }

                return data;
            });
        }

        /**
         * @ngdoc function
         * @name shop.module.CartService#SetShippingAddress
         * @methodOf cart.module.CartService
         * @kind function
         * 
         * @description
         * Saves user shipping address
         * 
         * @param {object} personal_info Personal info object with shipping address info
         * @param {string} personal_info.firstname Customers first name. must be between 1 and 32 characters
         * @param {string} personal_info.lastname Customers last name. must be between 1 and 32 characters
         * @param {string} personal_info.company Customers company name
         * @param {string} personal_info.address_1 Address line 1. must be between 3 and 128 characters
         * @param {string=} personal_info.address_2 Address line 2
         * @param {string} personal_info.city Address City. must be between 2 and 128 characters
         * @param {string} personal_info.postcode Postal code
         * @param {number} personal_info.country_id Country id
         * @param {number} personal_info.zone_id Zone id
         * 
         * @returns {promise} Returns a promise of the update response
         */
        this.SetShippingAddress = function (personal_info) {

            return dataService.apiSecuredPost('/shipping/address', personal_info).then(function (data) {
                if (data.error) {
                    return $q.reject(data.error);
                }

                return data;
            });
        }

        /**
         * @ngdoc function
         * @name shop.module.CartService#SetPaymentAddress
         * @methodOf cart.module.CartService
         * @kind function
         * 
         * @description
         * Saves user payment address
         * 
         * @param {object} personal_info Personal info object with shipping address info
         * @param {string} personal_info.firstname Customers first name. must be between 1 and 32 characters
         * @param {string} personal_info.lastname Customers last name. must be between 1 and 32 characters
         * @param {string} personal_info.company Customers company name
         * @param {string} personal_info.address_1 Address line 1. must be between 3 and 128 characters
         * @param {string=} personal_info.address_2 Address line 2
         * @param {string} personal_info.city Address City. must be between 2 and 128 characters
         * @param {string} personal_info.postcode Postal code
         * @param {number} personal_info.country_id Country id
         * @param {number} personal_info.zone_id Zone id
         * @param {object} personal_info Personal info object with payment address info
         * 
         * @returns {promise} Returns a promise of the update response
         */
        this.SetPaymentAddress = function (personal_info) {

            return dataService.apiSecuredPost('/payment/address', personal_info).then(function (data) {
                if (data.error) {
                    return $q.reject(data.error);
                }

                return data;
            });
        }

        /**
         * @ngdoc function
         * @name shop.module.CartService#SaveShippingMethod
         * @methodOf cart.module.CartService
         * @kind function
         * 
         * @description
         * Sets shipping method for the shopping cart
         * @param {object} info User selected shipping method
         * @param {string} info.shipping_method Shipping method code, ex : `flat`
         * 
         * @returns {promise} Returns a promise of the update response
         */
        this.SaveShippingMethod = function (info) {

            return dataService.apiSecuredPost('/shipping/method', info).then(function (data) {
                if (data.error) {
                    return $q.reject(data.error);
                }

                return data;
            });
        }

        /**
         * @ngdoc function
         * @name shop.module.CartService#SavePaymentMethod
         * @methodOf cart.module.CartService
         * @kind function
         * 
         * @description
         * Sets payment method for the shopping cart
         * @param {object} info User selected payment method
         * @param {string} info.payment_method Payment method code, ex : `cod`
         * 
         * @returns {promise} Returns a promise of the update response
         */
        this.SavePaymentMethod = function (info) {

            return dataService.apiSecuredPost('/payment/method', info).then(function (data) {
                if (data.error) {
                    return $q.reject(data.error);
                }

                return data;
            });
        }

        /**
         * @ngdoc function
         * @name shop.module.CartService#RemoveCartItem
         * @methodOf cart.module.CartService
         * @kind function
         * 
         * @description
         * Removes an item from the cart
         * 
         * @param {number} id Cart item id. cart_id is the key given for each cart item. See `cart/products` to find the `cart_id`
         * 
         * @returns {promise} Returns a promise of the update response
         */
        this.RemoveCartItem = function (id) {

            return dataService.apiSecuredPost('/cart/remove', { key: id }).then(function (data) {
                return data;
            });
        }

        /**
         * @ngdoc function
         * @name shop.module.CartService#GetCart
         * @methodOf cart.module.CartService
         * @kind function
         * 
         * @description
         * Returns the cart object
         * 
         * @example
         <pre>
         CartService.GetCart().then(function (data) {
            $scope.cart = data;
         });
         </pre>
         *Resolved Object
         <pre>
         {
          "total_item_count": 2,
          "products": [
            {
              "0": "USD",
              "1": "USD",
              "cart_id": "7",
              "product_id": "43",
              "name": "MacBook",
              "model": "Product 16",
              "thumb": "full_image_path75x75.jpg",
              "option": [],
              "quantity": "2",
              "stock": true,
              "shipping": "0",
              "price": "$602.00",
              "total": "$1,204.00",
              "price_clean": 602,
              "total_clean": 1204,
              "reward": 1200
            }
          ],
          "vouchers": [],
          "totals": [
            {
              "title": "Sub-Total",
              "text": "$1,000.00"
            },
            {
              "title": "Eco Tax (-2.00)",
              "text": "$4.00"
            },
            {
              "title": "VAT (20%)",
              "text": "$200.00"
            },
            {
              "title": "Total",
              "text": "$1,204.00"
            }
          ],
          "currency": "USD",
          "total_amount" : "$1,204.00",
          "total_amount_clean" : 1204
         }
         </pre>
         * 
         * @returns {promise} Returns a promise of the cart object
         */
        this.GetCart = function () {

            return dataService.apiSecuredPost('/cart/products').then(function (data) {
                var total_item_count = 0;

                for (var value in data.products) {
                    total_item_count += parseInt(data.products[value].quantity);
                    data.products[value].name = !data.products[value].stock ? data.products[value].name + " ***" : data.products[value].name;
                }

                if (data["totals"] && data["totals"][data["totals"].length - 1] && data["totals"][data["totals"].length - 1].text) {
                    data.total_amount = data["totals"][data["totals"].length - 1].text;
                    data.total_amount_clean = data["totals"][data["totals"].length - 1].text_clean;
                }

                data.total_item_count = total_item_count;
                return data;
            });
        }

        /**
         * @ngdoc function
         * @name shop.module.CartService#GetAddress
         * @methodOf cart.module.CartService
         * @kind function
         * 
         * @description
         * Get users default address
         * 
         * @example
         <pre>
         CartService.GetAddress().then(function (data) {
            $scope.address = data;
         });
         </pre>
         *Resolved Object
         <pre>
         {
          "defaultAddress": {
              "address_id": "7",
              "firstname": "Madusha",
              "lastname": "Kumarasiri",
              "company": "",
              "address_1": "Address Line 1",
              "address_2": "Address Line 2",
              "postcode": "00100",
              "city": "Colombo",
              "zone_id": "35131",
              "zone": "",
              "zone_code": "",
              "country_id": "94",
              "country": "Heard and Mc Donald Islands",
              "iso_code_2": "HM",
              "iso_code_3": "HMD",
              "address_format": "",
              "custom_field": null
            },
          "address_id": "7",
          "countries": [
            {
              "country_id": "244",
              "name": "Aaland Islands",
              "iso_code_2": "AX",
              "iso_code_3": "ALA",
              "address_format": "",
              "postcode_required": "0",
              "status": "1"
            }
          ],
          "addresses": {
            "7": {
              "address_id": "7",
              "firstname": "Madusha",
              "lastname": "Kumarasiri",
              "company": "",
              "address_1": "Address Line 1",
              "address_2": "Address Line 2",
              "postcode": "00100",
              "city": "Colombo",
              "zone_id": "35131",
              "zone": "",
              "zone_code": "",
              "country_id": "94",
              "country": "Heard and Mc Donald Islands",
              "iso_code_2": "HM",
              "iso_code_3": "HMD",
              "address_format": "",
              "custom_field": null
            }
          },
          "country_id": "222",
          "zone_id": "254",
          "custom_fields": [],
          "payment_address_custom_field": []
         }
         </pre>
         * 
         * @returns {promise} Returns a promise of the address object
         */
        this.GetAddress = function () {
            return dataService.apiSecuredPost('/address').then(function (data) {
                if (data.addresses && data.address_id && data.address_id != null) {
                    data.defaultAddress = data.addresses[data.address_id];
                }

                return data;
            });
        }

        /**
         * @ngdoc function
         * @name shop.module.CartService#SetAddress
         * @methodOf cart.module.CartService
         * @kind function
         * 
         * @description
        * Saves user address
        * @param {object} address_info User address info
        * @returns {promise} Returns a promise of the update response
        */
        this.SetAddress = function (address_info) {

            return dataService.apiSecuredPost('/address/save', address_info).then(function (data) {
                if (data.error) {
                    return $q.reject(data.error);
                }

                return data;
            });
        }

        /**
         * @ngdoc function
         * @name shop.module.CartService#AddToCart
         * @methodOf cart.module.CartService
         * @kind function
         * 
         * @description
         * Adds an item to the cart.
         * Option array should be in the format of `option[product_option_id] = product_option_value_id`. 
         * If the product option field of a Product is as follows,
           <pre>
            "options": [
                {
                  "product_option_id": "218",
                  "product_option_value": [
                    {
                      "product_option_value_id": "5",
                      "option_value_id": "32",
                      "name": "Small",
                      "image": null,
                      "price": "$12.00",
                      "price_prefix": "+"
                    }
                  ],
                  "option_id": "1",
                  "name": "Radio",
                  "type": "radio",
                  "value": "",
                  "required": "1"
                }
              ]
            </pre>

            the `option` array should be,

            <pre>
            option[218] = 5
            </pre>

            in the post parameters to select the value `Small`
         * @param {number} product_id Product id
         * @param {number} quantity Quantity
         * @param {object[]} option Selected options of the product. ex. `option[218] = 5`
         * @returns {promise} Returns a promise of the cart object 
         */
        this.AddToCart = function (product_id, quantity, option) {

            return dataService.apiSecuredPost('/cart/add', { product_id: product_id, quantity: quantity, option: option }).then(function (data) {
                if (data.error) {
                    return $q.reject(data.error);
                }

                return data;
            });
        }

        /**
        * @ngdoc function
        * @name shop.module.CartService#UpdateCartItemQuantity
        * @methodOf cart.module.CartService
        * @kind function
        * 
        * @description
        * Updates the item quantity of a cart item
        * 
        * @param {number} id Cart item id. cart_id is the key given for each cart item. See `cart/` to find the `cart_id`
        * @param {number} quantity New quantity of the item
        * 
        * @returns {promise} Returns a promise of the update response
        */
        this.UpdateCartItemQuantity = function (id, quantity) {
            return dataService.apiSecuredPost('/cart/edit', { key: id, quantity: quantity }).then(function (data) {
                if (data.error) {
                    return $q.reject(data.error);
                }

                return data;
            });
        }

        /**
        * @ngdoc function
        * @name shop.module.CartService#ApplyCoupon
        * @methodOf cart.module.CartService
        * @kind function
        * 
        * @description
        * Apply coupon to the shopping cart
        * 
        * @param {string} coupon Coupon number or string
        * 
        * @returns {promise} Returns a promise of the update response
        */
        this.ApplyCoupon = function (coupon) {
            return dataService.apiSecuredPost('/coupon', { coupon: coupon }).then(function (data) {
                if (data.error) {
                    return $q.reject(data.error);
                }

                return data;
            });
        }

    })
