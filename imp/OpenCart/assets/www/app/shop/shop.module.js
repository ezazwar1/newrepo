'use strict';

/**
* @ngdoc overview
* @name shop.module
* @requires ui.router
* @description
* Shop module contains product catalog of the system and main banner displays.
* Home page has banners and product list views (i.e., Latest products and Featured products).
* Featured products needs additional configuration settings to be done from the OpenCart API.
* 
* Shop is the default landing module of the app. It has all the functionality related to the product catalog of the shopping cart application.

> Shop home view

- Promotional banners
- Categories view
- Featured items
- Latest items
- Infinite scroll

> Product view

- Image slide show
- Specifications
- Product options (checkbox, radio, select, text, textarea, date, datetime, .etc)
- Share with friends

> Product search view

- Search for keywords
- Infinite scroll

> Product category view

- Latest products of selected category
- Infinite scroll
*/
angular.module('shop.module', ['ui.router']);