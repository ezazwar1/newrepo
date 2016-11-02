/**
 * Routes Configuration
 */
(function(angular, undefined) {
angular
	.module('invisionApp')

	.constant('routesConfig', (function () {
		'use strict';

		var siteURL = 'http://invision.surfit.mobi/';

		var rootRoutesConfig = {
			wpMenu: siteURL + 'wp-json/wp-api-menus/v2/',
			wpComments: siteURL + 'wp-json/wp/v2/comments',
			wpCategories: siteURL + 'wp-json/wp/v2/categories',
			wpItems: siteURL + 'wp-json/wp/v2/posts',
			wpPages: siteURL + 'wp-json/wp/v2/pages'
		};

		var routesConfig = {
			wpMenus: {
				byLocation: function (location) {
					return rootRoutesConfig.wpMenu + 'menu-locations/' + location;
				}
			},
			wpComments: {
				all: function (params) {
					return rootRoutesConfig.wpComments + params;
				},
				single: function (id) {
					return rootRoutesConfig.wpComments + '/' + id;
				}
			},
			wpCategories: {
				all: function () {
					return rootRoutesConfig.wpCategories;
				},
				single: function (id) {
					return rootRoutesConfig.wpCategories + '/' + id;
				}
			},
			wpItems: {
				all: function (params) {
					return rootRoutesConfig.wpItems + params;
				},
				single: function (id) {
					return rootRoutesConfig.wpItems + '/' + id;
				}
			},
			wpPages: {
				all: function () {
					return rootRoutesConfig.wpPages;
				},
				single: function (id) {
					return rootRoutesConfig.wpPages + '/' + id;
				}
			}
		}

		return routesConfig;
	})());

})(window.angular);
