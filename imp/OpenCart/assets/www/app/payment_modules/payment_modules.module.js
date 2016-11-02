'use strict';

/**
* @ngdoc overview
* @name payments.module
* @requires ui.router
* @description
* Payments module registeres payment method modules as dependencies. If a new payment method
* module is introduced, you have to register it as a dependency.
* 
* @example
``` 
angular.module('payments.module', ['ui.router', 'advertikon_stripe.module']);
```
*
**/
angular.module('payments.module', ['ui.router', 'advertikon_stripe.module', 'i2cs_alipay.module', 'pp_express.module']);