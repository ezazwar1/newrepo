'use strict';

/**
* @ngdoc overview
* @name cart.module
* @requires ui.router
* @description
* Cart module consists of the functionality of the Cart tab of the mobile app. It communicates 
* with the API to add items to cart, checkout and place new orders. Further more it can invoke 
* payment modules and start online payment procedures.
* 

> Cart home view

- Load current shopping cart
- Remove items from shopping cart

> Cart checkout view

- Fill user data
- Select shipping method
- Select payment method
- Place the order
- Start online payment procedure
*/
angular.module('cart.module', ['ui.router']);