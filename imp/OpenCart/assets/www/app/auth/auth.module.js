'use strict';

/**
* @ngdoc overview
* @name auth.module
* @requires ui.router
* @description
* Contains external social api auth providers to customer login/register. By default contains Facebook, Google and
* Twitter authentication providers. OpenCart backend must be configured via i2CSMobile module with extra parameters (i.e., secret keys or app ids)
* to function. Backend auth provider is powered by HybridAuth library.
* */
angular.module('auth.module', ['ui.router']);