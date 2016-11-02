'use strict';

/**
 * Created by Shipt
 */

(function () {
    'use strict';

    var commonModule = angular.module('common', ['ionic', 'ngCordova', 'ngIOS9UIWebViewPatch', 'common.inAppMessaging']);

    commonModule.factory('$exceptionHandler', ['$injector', function ($injector) {
        return function (exception, cause) {
            try {
                var LogService = $injector.get("LogService");
                LogService.error(exception);
            } catch (exception) {
                //rollbar was not defined or something.
            }
        };
    }]);

    commonModule.run(['OpenUrlService', function (OpenUrlService) {
        if (OpenUrlService) {
            document.addEventListener('handleopenurl', OpenUrlService.handleOpenUrl, false);
            document.addEventListener('resume', OpenUrlService.onResume, false);
        }
    }]);

    commonModule.factory('common', ['$q', '$rootScope', '$timeout', '$ionicModal', '$log', '$filter', 'AuthService', 'GroceryCartItem', 'AppAnalytics', 'Order', 'OrderLine', 'CustomOrderLine', 'LogService', 'KahunaService', 'ConfigService', 'CommonConfig', common]);

    function common($q, $rootScope, $timeout, $ionicModal, $log, $filter, AuthService, GroceryCartItem, AppAnalytics, Order, OrderLine, CustomOrderLine, LogService, KahunaService, ConfigService, CommonConfig) {

        var service = {
            // common angular dependencies
            $broadcast: $broadcast,
            $q: $q,
            $timeout: $timeout,
            getFraction: getlowestfraction,
            isNumber: isNumber,
            textContains: textContains,
            checkLogin: checkLogin,
            logoutCurrentUser: logoutCurrentUser,
            userLoggedIn: userLoggedIn,
            getNameWithLastRemoved: getNameWithLastRemoved,
            getCustomerOrderSubstitutionPreferenceOptions: getSubstitutionPreferenceOptions,
            getSubstitutionPreferenceText: getSubstitutionPreferenceText,
            GroceryCartItem: GroceryCartItem,
            Order: Order,
            OrderLine: OrderLine,
            CustomOrderLine: CustomOrderLine,
            configureRollBarUserInfo: configureRollBarUserInfo,
            weightedQuantity: weightedQuantity, // weighted products
            loadConfiguration: loadConfiguration
        };

        return service;

        var loginModal;

        function getlowestfraction(x0) {
            var eps = 1.0E-15;
            var h, h1, h2, k, k1, k2, a, x;

            x = x0;
            a = Math.floor(x);
            h1 = 1;
            k1 = 0;
            h = a;
            k = 1;

            while (x - a > eps * k * k) {
                x = 1 / (x - a);
                a = Math.floor(x);
                h2 = h1;h1 = h;
                k2 = k1;k1 = k;
                h = h2 + a * h1;
                k = k2 + a * k1;
            }

            return h + "/" + k;
        }

        function getSubstitutionPreferenceOptions() {
            return [{ text: "Contact Me", value: "contact_me" }, { text: "Use Best Judgment", value: "use_best_judgment" }, { text: "Don't Substitute", value: "do_not_substitute" }];
        }

        function getSubstitutionPreferenceText(substitution_preference) {
            try {
                var options = getSubstitutionPreferenceOptions();
                return options.find(function (element) {
                    return element.value == substitution_preference;
                }).text;
            } catch (exception) {
                LogService.error(exception);
                return 'n/a';
            }
        }

        function getNameWithLastRemoved(name) {
            name = $.trim(name);
            var names = name.split(' ');
            var namesLength = names.length;
            if (namesLength > 1) {
                names[namesLength - 1] = names[namesLength - 1].charAt(0) + '.';
            }
            var adjustedName = names.join(' ');
            return adjustedName;
        }

        function configureRollBarUserInfo() {
            try {
                var custInfo = AuthService.getCustomerInfo();
                LogService.configUserLogInfo(custInfo);
            } catch (exception) {
                $log.error('Error configureRollBarUserInfo', exception);
            }
        }

        function checkIfAuthenticated() {
            return AuthService.isAuthenticated();
        }

        function checkLoginAuth() {
            var authed = checkIfAuthenticated();
            $log.info("is auth: ", authed);
            if (authed) {
                //good to go
            } else {
                AppAnalytics.track('loginModalStart');
                loginModal.show();
            }
        }

        function logoutCurrentUser() {
            var deferred = $q.defer();
            AuthService.logoutCurrentUser().then(function (loggedOut) {
                if (loggedOut) {
                    deferred.resolve();
                    checkLogin();
                    KahunaService.logout();
                } else {
                    deferred.reject();
                }
            });
            return deferred.promise;
        }

        function userLoggedIn() {
            if (loginModal) loginModal.hide();
        }

        function checkLogin() {
            var modalUrl = "templates/login.html";
            if (webVersion && nonMobileWebApp) {
                modalUrl = "templates/webLogin.html";
            }
            $ionicModal.fromTemplateUrl(modalUrl, {
                scope: $rootScope,
                backdropClickToClose: false,
                hardwareBackButtonClose: false,
                animation: 'asdf',
                focusFirstInput: true
            }).then(function (modal) {
                loginModal = modal;

                //check login after the modal is loaded.
                checkLoginAuth();
            });
        }

        function $broadcast() {
            return $rootScope.$broadcast.apply($rootScope, arguments);
        }

        function activateController(promises, controllerId) {
            return $q.all(promises).then(function (eventArgs) {
                var data = { controllerId: controllerId };
                $broadcast(commonConfig.config.controllerActivateSuccessEvent, data);
            });
        }

        function isNumber(val) {
            // negative or positive
            return (/^[-]?\d+$/.test(val)
            );
        }

        function textContains(text, searchText) {
            return text && -1 !== text.toLowerCase().indexOf(searchText.toLowerCase());
        }

        function weightedQuantity(product, quantity) {
            return $filter('number')(parseInt(quantity * 100 / (product.unit_weight * 100)));
        }

        function loadConfiguration(context) {
            ConfigService.loadConfig(context).then(function (configData) {
                // Success
                $log.info('successfully loaded config: ' + JSON.stringify(configData));
            }, function (error) {
                // Error
                $log.error(error);
            });
        }
    }
})();
'use strict';

angular.module('common')

/**
 * @ngdoc constant
 * @name CommonConfig
 * @description Defines the shopper config constants.
 */
.constant('CommonConfig', {
    groceriesContext: 'GroceriesApp',
    groceriesConfigUrl: 'api/v1/app_config.json',
    shopperContext: 'ShopperApp',
    shopperConfigUrl: 'api/v1/shopper/app_config.json',
    configStoreKey: 'appConfig', // this is the key for configuration data in local storage
    shopperAppIdentity: 'shopperAppIdentity',
    groceryAppIdentity: 'groceryAppIdentity',
    webAppIdentity: 'webAppIdentity',
    kahunaKey: 'c7f0f05869b34099be54a22b5336710e',
    stagingEnvironmentName: 'staging',
    productionEnvironmentName: 'production'
})

/**
 * Defines constants for in app messages.
 */
.constant('IN_APP_MESSAGE', {
    TYPES: {
        NEW_STORE_ANNOUNCEMENT: 'newStoreAnnouncement',
        ACKNOWLEDGEMENT: 'acknowledgement'
    },
    EVENTS: {
        OPEN_CHOOSE_STORE_MODAL: 'event.openChooseStoreModal'
    }
})

/**
 * @ngdoc constant
 * @name FILTER_SORT
 * @description Defines the key constants for the filter sort feature.
 */
.constant('FILTER_SORT', {
    EVENTS: {
        APPLY_FILTER: 'apply-filter-sort',
        CLEAR_FILTER: 'clear-search-filtersort',
        RESET: 'reset-filter-sort'
    },
    OPTIONS: {
        SORT_POPULARITY: 'Popularity',
        SORT_PRICE_LOW_HIGH: 'Price: Low to High',
        SORT_PRICE_HIGH_LOW: 'Price: High to Low',
        SORT_BRAND_A_Z: 'Brand: A-Z',
        SORT_BRAND_Z_A: 'Brand: Z-A',
        DEFAULT_CATEGORIES: 'All Categories',
        DEFAULT_BRANDS: 'All Brands'
    },
    FACETS: {
        BRANDS: 'brand_name',
        CATEGORIES: 'categories.name'
    },
    INDEXES: {
        STAGING: {
            SORT_PRICE_LOW_HIGH: 'StoreProductSetting_staging_price_asc',
            SORT_PRICE_HIGH_LOW: 'StoreProductSetting_staging_price_desc',
            SORT_BRAND_A_Z: 'StoreProductSetting_staging_brand_az',
            SORT_BRAND_Z_A: 'StoreProductSetting_staging_brand_za'
        },
        PRODUCTION: {
            SORT_PRICE_LOW_HIGH: 'StoreProductSetting_production_price_asc',
            SORT_PRICE_HIGH_LOW: 'StoreProductSetting_production_price_desc',
            SORT_BRAND_A_Z: 'StoreProductSetting_production_brand_az',
            SORT_BRAND_Z_A: 'StoreProductSetting_production_brand_za'
        }
    }
});
'use strict';

(function () {
    'use strict';

    angular.module('common')

    /**
     * @ngdoc constant
     * @name COMMON_FEATURE_TOGGLES
     * @description Defines the key constants for the feature toggles in the common module.
     */
    .constant('COMMON_FEATURE_TOGGLES', {
        BARCODE_SCAN_SEARCH: 'barcode_scan_search',
        ALGOLIA_SEARCH_ENABLED: 'use_algolia_client_search_results',
        ALGOLIA_INSTANT_SEARCH_ENABLED: 'algolia_instant_search',
        ALGOLIA_FILTER_SORT_ENABLED: 'algolia_filter_sort',
        ALGOLIA_SORT_ENABLED: 'algolia_sort_indexes'
    });
})();
'use strict';

angular.module('common').directive("ngTouchstart", ngTouchstart);
function ngTouchstart() {
    return {
        controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
            $element.bind('touchstart', onTouchStart);
            function onTouchStart(event) {
                var method = $element.attr('ng-touchstart');
                $scope.$event = event;
                $scope.$apply(method);
            };
        }]
    };
}
'use strict';

/**
 * Created by Shipt
 */

angular.module('common').directive('validated', ['$parse', validated]);

function validated($parse) {
    return {
        restrict: 'AEC',
        require: '^form',
        link: function link(scope, element, attrs, form) {
            var inputs = element.find("*");
            for (var i = 0; i < inputs.length; i++) {
                (function (input) {
                    var attributes = input.attributes;
                    if (attributes.getNamedItem('ng-model') != void 0 && attributes.getNamedItem('name') != void 0) {
                        var field = form[attributes.name.value];
                        if (field != void 0) {
                            angular.element(input).bind('blur', function () {
                                scope.$apply(function () {
                                    field.$blurred = true;
                                });
                            });
                            scope.$watch(function () {
                                return form.$submitted + "_" + field.$valid + "_" + field.$blurred;
                            }, function () {
                                console.log(arguments);
                                if (!field.$blurred && form.$submitted != true) return;
                                var inp = angular.element(input);
                                if (inp.hasClass('ng-invalid')) {
                                    element.removeClass('has-success');
                                    element.addClass('has-error');
                                } else {
                                    element.removeClass('has-error').addClass('has-success');
                                }
                            });
                        }
                    }
                })(inputs[i]);
            }
        }
    };
}
'use strict';

/*
Custom implementation
*/
(function () {
  angular.module('ionic.rating', [])
  /**
   * @ngdoc module
   * @name IonicRating
   * @description Custom implementation of ionic-rating (https://github.com/fraserxu/ionic-rating).
   */
  .constant('ratingConfig', {
    max: 5
  }).controller('RatingController', ['$scope', '$attrs', 'ratingConfig', function ($scope, $attrs, ratingConfig) {
    var ngModelCtrl;
    ngModelCtrl = {
      $setViewValue: angular.noop
    };
    this.init = function (ngModelCtrl_) {
      var max, ratingStates;
      ngModelCtrl = ngModelCtrl_;
      ngModelCtrl.$render = this.render;
      max = angular.isDefined($attrs.max) ? $scope.$parent.$eval($attrs.max) : ratingConfig.max;
      return $scope.range = this.buildTemplateObjects(ngModelCtrl.$modelValue, max);
    };
    this.buildTemplateObjects = function (stateValue, max) {
      var i,
          j,
          len,
          states = [];

      for (j = 0; j < max; j++) {
        if (stateValue > j && stateValue < j + 1) states[j] = 2;else if (stateValue > j) states[j] = 1;else states[j] = 0;
      }

      return states;
    };
    $scope.rate = function (value) {
      if (!$scope.readonly && value >= 0 && value <= $scope.range.length) {
        ngModelCtrl.$setViewValue(value);
        return ngModelCtrl.$render();
      }
    };
    $scope.onKeydown = function (evt) {
      if (/(37|38|39|40)/.test(evt.which)) {
        evt.preventDefault();
        evt.stopPropagation();
        return $scope.rate($scope.value + (evt.which === 38 || evt.which === 39 ? {
          1: -1
        } : void 0));
      }
    };
    this.render = function () {
      return $scope.value = ngModelCtrl.$viewValue;
    };
    return this;
  }]).directive('rating', ['$timeout', function ($timeout) {
    return {
      restrict: 'EA',
      require: ['rating', 'ngModel'],
      scope: {
        readonly: '=?'
      },
      controller: 'RatingController',
      templateUrl: 'templates/rating.html',
      replace: true,
      link: function link(scope, element, attrs, ctrls) {
        var ngModelCtrl, ratingCtrl;
        ratingCtrl = ctrls[0];
        ngModelCtrl = ctrls[1];
        if (ngModelCtrl) {
          $timeout(function () {
            return ratingCtrl.init(ngModelCtrl);
          });
        }
      }
    };
  }]);
}).call(undefined);
'use strict';

angular.module('common').directive('selectOnClick', function selectOnClick() {
  return {
    restrict: 'A',
    link: function link(scope, element, attrs) {
      var hasSelectedAll = false;
      element.on('click', function ($event) {
        if (!hasSelectedAll) {
          try {
            //IOs, Safari, thows exception on Chrome etc
            this.selectionStart = 0;
            this.selectionEnd = this.value.length + 1;
            hasSelectedAll = true;
          } catch (err) {
            //Non IOs option if not supported, e.g. Chrome
            this.select();
            hasSelectedAll = true;
          }
        }
      });
      //On blur reset hasSelectedAll to allow full select
      element.on('blur', function ($event) {
        hasSelectedAll = false;
      });
    }
  };
});
'use strict';

/**
 * Created by Shipt
 */

angular.module('common').directive('stopEvent', function () {
    function stopEvent(e) {
        e.stopPropagation();
    }
    return {
        restrict: 'A',
        link: function link(scope, element, attr) {
            element.bind(attr.stopEvent, stopEvent);
        }
    };
});
'use strict';

/**
 * Created by Shipt
 */

angular.module('common').directive('onValidSubmit', ['$parse', '$timeout', onValidSubmit]);

function onValidSubmit($parse, $timeout) {
    return {
        require: '^form',
        restrict: 'A',
        link: function link(scope, element, attrs, form) {
            form.$submitted = false;
            var fn = $parse(attrs.onValidSubmit);
            element.on('submit', function (event) {
                scope.$apply(function () {
                    element.addClass('ng-submitted');
                    form.$submitted = true;
                    if (form.$valid) {
                        if (typeof fn === 'function') {
                            fn(scope, { $event: event });
                        }
                    }
                });
            });
        }
    };
}
'use strict';

/**
 * Created by Shipt
 */

angular.module('common').filter('capitalize', function () {
    return function (input, all) {
        return !!input ? input.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }) : '';
    };
});
'use strict';

angular.module('common').filter('driverNameFilter', function () {
    return function (name) {
        name = $.trim(name);
        var names = name.split(' ');
        var namesLength = names.length;
        if (namesLength > 1) {
            names[namesLength - 1] = names[namesLength - 1].charAt(0) + '.';
        }
        var adjustedName = names.join(' ');
        return adjustedName;
    };
});
'use strict';

/**
 * Created by Shipt
 */

angular.module('common').filter('tel', function () {
    return function (tel) {
        if (!tel) {
            return '';
        }

        var value = tel.toString().trim().replace(/^\+/, '');

        if (value.match(/[^0-9]/)) {
            return tel;
        }

        var country, city, number;

        switch (value.length) {
            case 10:
                // +1PPP####### -> C (PPP) ###-####
                country = 1;
                city = value.slice(0, 3);
                number = value.slice(3);
                break;

            case 11:
                // +CPPP####### -> CCC (PP) ###-####
                country = value[0];
                city = value.slice(1, 4);
                number = value.slice(4);
                break;

            case 12:
                // +CCCPP####### -> CCC (PP) ###-####
                country = value.slice(0, 3);
                city = value.slice(3, 5);
                number = value.slice(5);
                break;

            default:
                return tel;
        }

        if (country == 1) {
            country = "";
        }

        number = number.slice(0, 3) + '-' + number.slice(3);

        return (country + " (" + city + ") " + number).trim();
    };
});
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/**
 * Coppied over from angular-input-masks repo and added to it
 * Personalized input masks for AngularJS
 * @version v1.4.2
 * @link http://github.com/assisrafael/angular-input-masks
 * @license MIT
 */
(function (angular) {

	var StringMask = function () {
		var tokens = {
			'0': { pattern: /\d/, _default: '0' },
			'9': { pattern: /\d/, optional: true },
			'#': { pattern: /\d/, optional: true, recursive: true },
			'S': { pattern: /[a-zA-Z]/ },
			'$': { escape: true }
		};
		var isEscaped = function isEscaped(pattern, pos) {
			var count = 0;
			var i = pos - 1;
			var token = { escape: true };
			while (i >= 0 && token && token.escape) {
				token = tokens[pattern.charAt(i)];
				count += token && token.escape ? 1 : 0;
				i--;
			}
			return count > 0 && count % 2 === 1;
		};
		var calcOptionalNumbersToUse = function calcOptionalNumbersToUse(pattern, value) {
			var numbersInP = pattern.replace(/[^0]/g, '').length;
			var numbersInV = value.replace(/[^\d]/g, '').length;
			return numbersInV - numbersInP;
		};
		var concatChar = function concatChar(text, character, options) {
			if (options.reverse) return character + text;
			return text + character;
		};
		var hasMoreTokens = function hasMoreTokens(pattern, pos, inc) {
			var pc = pattern.charAt(pos);
			var token = tokens[pc];
			if (pc === '') return false;
			return token && !token.escape ? true : hasMoreTokens(pattern, pos + inc, inc);
		};
		var insertChar = function insertChar(text, char, position) {
			var t = text.split('');
			t.splice(position >= 0 ? position : 0, 0, char);
			return t.join('');
		};
		var StringMask = function StringMask(pattern, opt) {
			this.options = opt || {};
			this.options = {
				reverse: this.options.reverse || false,
				usedefaults: this.options.usedefaults || this.options.reverse
			};
			this.pattern = pattern;

			StringMask.prototype.process = function proccess(value) {
				if (!value) return '';
				value = value + '';
				var pattern2 = this.pattern;
				var valid = true;
				var formatted = '';
				var valuePos = this.options.reverse ? value.length - 1 : 0;
				var optionalNumbersToUse = calcOptionalNumbersToUse(pattern2, value);
				var escapeNext = false;
				var recursive = [];
				var inRecursiveMode = false;

				var steps = {
					start: this.options.reverse ? pattern2.length - 1 : 0,
					end: this.options.reverse ? -1 : pattern2.length,
					inc: this.options.reverse ? -1 : 1
				};

				var continueCondition = function continueCondition(options) {
					if (!inRecursiveMode && hasMoreTokens(pattern2, i, steps.inc)) {
						return true;
					} else if (!inRecursiveMode) {
						inRecursiveMode = recursive.length > 0;
					}

					if (inRecursiveMode) {
						var pc = recursive.shift();
						recursive.push(pc);
						if (options.reverse && valuePos >= 0) {
							i++;
							pattern2 = insertChar(pattern2, pc, i);
							return true;
						} else if (!options.reverse && valuePos < value.length) {
							pattern2 = insertChar(pattern2, pc, i);
							return true;
						}
					}
					return i < pattern2.length && i >= 0;
				};

				for (var i = steps.start; continueCondition(this.options); i = i + steps.inc) {
					var pc = pattern2.charAt(i);
					var vc = value.charAt(valuePos);
					var token = tokens[pc];
					if (!inRecursiveMode || vc) {
						if (this.options.reverse && isEscaped(pattern2, i)) {
							formatted = concatChar(formatted, pc, this.options);
							i = i + steps.inc;
							continue;
						} else if (!this.options.reverse && escapeNext) {
							formatted = concatChar(formatted, pc, this.options);
							escapeNext = false;
							continue;
						} else if (!this.options.reverse && token && token.escape) {
							escapeNext = true;
							continue;
						}
					}

					if (!inRecursiveMode && token && token.recursive) {
						recursive.push(pc);
					} else if (inRecursiveMode && !vc) {
						if (!token || !token.recursive) formatted = concatChar(formatted, pc, this.options);
						continue;
					} else if (recursive.length > 0 && token && !token.recursive) {
						// Recursive tokens most be the last tokens of the pattern
						valid = false;
						continue;
					} else if (!inRecursiveMode && recursive.length > 0 && !vc) {
						continue;
					}

					if (!token) {
						formatted = concatChar(formatted, pc, this.options);
						if (!inRecursiveMode && recursive.length) {
							recursive.push(pc);
						}
					} else if (token.optional) {
						if (token.pattern.test(vc) && optionalNumbersToUse) {
							formatted = concatChar(formatted, vc, this.options);
							valuePos = valuePos + steps.inc;
							optionalNumbersToUse--;
						} else if (recursive.length > 0 && vc) {
							valid = false;
							break;
						}
					} else if (token.pattern.test(vc)) {
						formatted = concatChar(formatted, vc, this.options);
						valuePos = valuePos + steps.inc;
					} else if (!vc && token._default && this.options.usedefaults) {
						formatted = concatChar(formatted, token._default, this.options);
					} else {
						valid = false;
						break;
					}
				}

				return { result: formatted, valid: valid };
			};

			StringMask.prototype.apply = function (value) {
				return this.process(value).result;
			};

			StringMask.prototype.validate = function (value) {
				return this.process(value).valid;
			};
		};

		StringMask.process = function (value, pattern, options) {
			return new StringMask(pattern, options).process(value);
		};

		StringMask.apply = function (value, pattern, options) {
			return new StringMask(pattern, options).apply(value);
		};

		StringMask.validate = function (value, pattern, options) {
			return new StringMask(pattern, options).validate(value);
		};

		return StringMask;
	}();

	/** Used to determine if values are of the language type Object */
	var objectTypes = {
		'boolean': false,
		'function': true,
		'object': true,
		'number': false,
		'string': false,
		'undefined': false
	};

	if (objectTypes[typeof module === 'undefined' ? 'undefined' : _typeof(module)]) {
		module.exports = StringMask;
	}

	'use strict';

	angular.module('ui.utils.masks.us', ['ui.utils.masks.helpers', 'ui.utils.masks.us.phone', 'ui.utils.masks.us.ssn', 'ui.utils.masks.us.card', 'ui.utils.masks.us.expDate']);

	//ui.utils.masks.us.expDate
	//ui.utils.masks.us.card
	//CUSTOM MOTHA FUCKING MASKS.

	'use strict';

	angular.module('ui.utils.masks.us.expDate', []).directive('uiUsExpDate', [function () {
		var expDateMaskUS = new StringMask('00/00');

		function removeNonDigits(value) {
			return value.replace(/[^0-9]/g, '');
		}

		function applyExpDateMask(value) {
			var formatedValue;
			formatedValue = expDateMaskUS.apply(value) || '';
			return formatedValue.trim().replace(/[^0-9]$/, '');
		}

		return {
			restrict: 'A',
			require: 'ngModel',
			link: function link(scope, element, attrs, ctrl) {
				function formatter(value) {
					if (ctrl.$isEmpty(value)) {
						return value;
					}

					return applyExpDateMask(removeNonDigits(value));
				}

				function parser(value) {
					if (ctrl.$isEmpty(value)) {
						return value;
					}

					var formatedValue = applyExpDateMask(removeNonDigits(value));
					var actualValue = removeNonDigits(formatedValue);

					if (ctrl.$viewValue !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}

					return actualValue;
				}

				function validator(value) {
					var valid = ctrl.$isEmpty(value) || value.length > 9;
					ctrl.$setValidity('usExpDate', valid);
					return value;
				}

				ctrl.$formatters.push(formatter);
				ctrl.$formatters.push(validator);
				ctrl.$parsers.push(parser);
				ctrl.$parsers.push(validator);
			}
		};
	}]);

	'use strict';

	angular.module('ui.utils.masks.us.card', []).directive('uiUsCardNumber', [function () {
		var cardMaskUS = new StringMask('0000 0000 0000 0000 0000');

		function removeNonDigits(value) {
			return value.replace(/[^0-9]/g, '');
		}

		function applyCardMask(value) {
			var formatedValue;
			formatedValue = cardMaskUS.apply(value) || '';
			return formatedValue.trim().replace(/[^0-9]$/, '');
		}

		return {
			restrict: 'A',
			require: 'ngModel',
			link: function link(scope, element, attrs, ctrl) {
				function formatter(value) {
					if (ctrl.$isEmpty(value)) {
						return value;
					}

					return applyCardMask(removeNonDigits(value));
				}

				function parser(value) {
					if (ctrl.$isEmpty(value)) {
						return value;
					}

					var formatedValue = applyCardMask(removeNonDigits(value));
					var actualValue = removeNonDigits(formatedValue);

					if (ctrl.$viewValue !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}

					return actualValue;
				}

				function validator(value) {
					var valid = ctrl.$isEmpty(value) || value.length > 9;
					ctrl.$setValidity('usCardNumber', valid);
					return value;
				}

				ctrl.$formatters.push(formatter);
				ctrl.$formatters.push(validator);
				ctrl.$parsers.push(parser);
				ctrl.$parsers.push(validator);
			}
		};
	}]);

	'use strict';

	angular.module('ui.utils.masks.us.ssn', []).directive('uiUsSsnNumber', [function () {
		var ssnMaskUS = new StringMask('000-00-0000');

		function removeNonDigits(value) {
			return value.replace(/[^0-9]/g, '');
		}

		function applyCardMask(value) {
			var formatedValue;
			formatedValue = ssnMaskUS.apply(value) || '';
			return formatedValue.trim().replace(/[^0-9]$/, '');
		}

		return {
			restrict: 'A',
			require: 'ngModel',
			link: function link(scope, element, attrs, ctrl) {
				function formatter(value) {
					if (ctrl.$isEmpty(value)) {
						return value;
					}

					return applyCardMask(removeNonDigits(value));
				}

				function parser(value) {
					if (ctrl.$isEmpty(value)) {
						return value;
					}

					var formatedValue = applyCardMask(removeNonDigits(value));
					var actualValue = removeNonDigits(formatedValue);

					if (ctrl.$viewValue !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}

					return actualValue;
				}

				function validator(value) {
					var valid = ctrl.$isEmpty(value) || value.length > 9;
					ctrl.$setValidity('usSsnNumber', valid);
					return value;
				}

				ctrl.$formatters.push(formatter);
				ctrl.$formatters.push(validator);
				ctrl.$parsers.push(parser);
				ctrl.$parsers.push(validator);
			}
		};
	}]);

	'use strict';

	angular.module('ui.utils.masks.us.phone', []).directive('uiUsPhoneNumber', [function () {
		var phoneMaskUS = new StringMask('(000) 000-0000'),
		    phoneMaskINTL = new StringMask('+00-00-000-000000');

		function removeNonDigits(value) {
			return value.replace(/[^0-9]/g, '');
		}

		function applyPhoneMask(value) {
			var formatedValue;

			if (value.length < 11) {
				formatedValue = phoneMaskUS.apply(value) || '';
			} else {
				formatedValue = phoneMaskINTL.apply(value);
			}

			return formatedValue.trim().replace(/[^0-9]$/, '');
		}

		return {
			restrict: 'A',
			require: 'ngModel',
			link: function link(scope, element, attrs, ctrl) {
				function formatter(value) {
					if (ctrl.$isEmpty(value)) {
						return value;
					}

					return applyPhoneMask(removeNonDigits(value));
				}

				function parser(value) {
					if (ctrl.$isEmpty(value)) {
						return value;
					}

					var formatedValue = applyPhoneMask(removeNonDigits(value));
					var actualValue = removeNonDigits(formatedValue);

					if (ctrl.$viewValue !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}

					return actualValue;
				}

				function validator(value) {
					var valid = ctrl.$isEmpty(value) || value.length > 9;
					ctrl.$setValidity('usPhoneNumber', valid);
					return value;
				}

				ctrl.$formatters.push(formatter);
				ctrl.$formatters.push(validator);
				ctrl.$parsers.push(parser);
				ctrl.$parsers.push(validator);
			}
		};
	}]);

	'use strict';

	angular.module('ui.utils.masks.global', ['ui.utils.masks.helpers', 'ui.utils.masks.global.date', 'ui.utils.masks.global.money', 'ui.utils.masks.global.weight', 'ui.utils.masks.global.number', 'ui.utils.masks.global.percentage', 'ui.utils.masks.global.scientific-notation', 'ui.utils.masks.global.time']);

	'use strict';

	/*global moment*/
	var globalMomentJS;
	if (typeof moment !== 'undefined') {
		globalMomentJS = moment;
	}

	var dependencies = [];

	try {
		//Check if angular-momentjs is available
		angular.module('angular-momentjs');
		dependencies.push('angular-momentjs');
	} catch (e) {}

	angular.module('ui.utils.masks.global.date', dependencies).directive('uiDateMask', ['$locale', '$log', '$injector', function ($locale, $log, $injector) {
		var moment;

		if (typeof globalMomentJS === 'undefined') {
			if ($injector.has('MomentJS')) {
				moment = $injector.get('MomentJS');
			} else {
				throw new Error('Moment.js not found. Check if it is available.');
			}
		} else {
			moment = globalMomentJS;
		}

		var dateFormatMapByLocalle = {
			'pt-br': 'DD/MM/YYYY'
		};

		var dateFormat = dateFormatMapByLocalle[$locale.id] || 'YYYY-MM-DD';

		return {
			restrict: 'A',
			require: 'ngModel',
			link: function link(scope, element, attrs, ctrl) {
				var dateMask = new StringMask(dateFormat.replace(/[YMD]/g, '0'));

				function applyMask(value) {
					var cleanValue = value.replace(/[^0-9]/g, '');
					var formatedValue = dateMask.process(cleanValue).result || '';

					return formatedValue.trim().replace(/[^0-9]$/, '');
				}

				function formatter(value) {
					$log.debug('[uiDateMask] Formatter called: ', value);
					if (ctrl.$isEmpty(value)) {
						return value;
					}

					var formatedValue = applyMask(moment(value).format(dateFormat));
					validator(formatedValue);
					return formatedValue;
				}

				function parser(value) {
					$log.debug('[uiDateMask] Parser called: ', value);
					if (ctrl.$isEmpty(value)) {
						validator(value);
						return value;
					}

					var formatedValue = applyMask(value);
					$log.debug('[uiDateMask] Formated value: ', formatedValue);

					if (ctrl.$viewValue !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}
					validator(formatedValue);

					var modelValue = moment(formatedValue, dateFormat);
					return modelValue.toDate();
				}

				function validator(value) {
					$log.debug('[uiDateMask] Validator called: ', value);

					var isValid = moment(value, dateFormat).isValid() && value.length === dateFormat.length;
					ctrl.$setValidity('date', ctrl.$isEmpty(value) || isValid);
				}

				ctrl.$formatters.push(formatter);
				ctrl.$parsers.push(parser);
			}
		};
	}]);

	'use strict';

	angular.module('ui.utils.masks.global.money', ['ui.utils.masks.helpers']).directive('uiMoneyMask', ['$locale', '$parse', 'PreFormatters', 'NumberValidators', function ($locale, $parse, PreFormatters, NumberValidators) {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function link(scope, element, attrs, ctrl) {
				var decimalDelimiter = $locale.NUMBER_FORMATS.DECIMAL_SEP,
				    thousandsDelimiter = $locale.NUMBER_FORMATS.GROUP_SEP,
				    currencySym = $locale.NUMBER_FORMATS.CURRENCY_SYM,
				    decimals = $parse(attrs.uiMoneyMask)(scope);

				if (angular.isDefined(attrs.uiHideGroupSep)) {
					thousandsDelimiter = '';
				}

				if (isNaN(decimals)) {
					decimals = 2;
				}

				var decimalsPattern = decimals > 0 ? decimalDelimiter + new Array(decimals + 1).join('0') : '';
				var maskPattern = currencySym + ' #' + thousandsDelimiter + '##0' + decimalsPattern;
				var moneyMask = new StringMask(maskPattern, { reverse: true });

				function formatter(value) {
					if (ctrl.$isEmpty(value)) {
						return value;
					}

					var valueToFormat = PreFormatters.prepareNumberToFormatter(value, decimals);
					return moneyMask.apply(valueToFormat);
				}

				function parser(value) {
					if (ctrl.$isEmpty(value)) {
						return value;
					}

					var actualNumber = value.replace(/[^\d]+/g, '');
					actualNumber = actualNumber.replace(/^[0]+([1-9])/, '$1');
					var formatedValue = moneyMask.apply(actualNumber);

					if (value !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}

					return formatedValue ? parseInt(formatedValue.replace(/[^\d]+/g, '')) / Math.pow(10, decimals) : null;
				}

				ctrl.$formatters.push(formatter);
				ctrl.$parsers.push(parser);

				if (attrs.uiMoneyMask) {
					scope.$watch(attrs.uiMoneyMask, function (decimals) {
						if (isNaN(decimals)) {
							decimals = 2;
						}
						decimalsPattern = decimals > 0 ? decimalDelimiter + new Array(decimals + 1).join('0') : '';
						maskPattern = currencySym + ' #' + thousandsDelimiter + '##0' + decimalsPattern;
						moneyMask = new StringMask(maskPattern, { reverse: true });

						parser(ctrl.$viewValue);
					});
				}

				if (attrs.min) {
					ctrl.$parsers.push(function (value) {
						var min = $parse(attrs.min)(scope);
						return NumberValidators.minNumber(ctrl, value, min);
					});

					scope.$watch(attrs.min, function (value) {
						NumberValidators.minNumber(ctrl, ctrl.$modelValue, value);
					});
				}

				if (attrs.max) {
					ctrl.$parsers.push(function (value) {
						var max = $parse(attrs.max)(scope);
						return NumberValidators.maxNumber(ctrl, value, max);
					});

					scope.$watch(attrs.max, function (value) {
						NumberValidators.maxNumber(ctrl, ctrl.$modelValue, value);
					});
				}
			}
		};
	}]);

	'use strict';

	angular.module('ui.utils.masks.global.weight', ['ui.utils.masks.helpers']).directive('uiWeightMask', ['$locale', '$parse', 'PreFormatters', 'NumberValidators', function ($locale, $parse, PreFormatters, NumberValidators) {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function link(scope, element, attrs, ctrl) {
				var decimalDelimiter = $locale.NUMBER_FORMATS.DECIMAL_SEP,
				    thousandsDelimiter = $locale.NUMBER_FORMATS.GROUP_SEP,
				    currencySym = '$',
				    units = $parse(attrs.uiWeightMask)(scope);
				var decimals = 2;

				if (angular.isDefined(attrs.uiHideGroupSep)) {
					thousandsDelimiter = '';
				}

				if (isNaN(decimals)) {
					decimals = 2;
				}
				var decimalsPattern = decimals > 0 ? decimalDelimiter + new Array(decimals + 1).join('0') : '';
				var maskPattern = '#' + thousandsDelimiter + '##0' + decimalsPattern + " " + units;
				var moneyMask = new StringMask(maskPattern, { reverse: true });

				function formatter(value) {
					if (ctrl.$isEmpty(value)) {
						return value;
					}

					var valueToFormat = PreFormatters.prepareNumberToFormatter(value, decimals);
					return moneyMask.apply(valueToFormat);
				}

				function parser(value) {
					if (ctrl.$isEmpty(value)) {
						return value;
					}

					var actualNumber = value.replace(/[^\d]+/g, '');
					actualNumber = actualNumber.replace(/^[0]+([1-9])/, '$1');
					var formatedValue = moneyMask.apply(actualNumber);

					if (value !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}

					return formatedValue ? parseInt(formatedValue.replace(/[^\d]+/g, '')) / Math.pow(10, decimals) : null;
				}

				ctrl.$formatters.push(formatter);
				ctrl.$parsers.push(parser);

				if (attrs.uiWeightMask) {
					scope.$watch(attrs.uiWeightMask, function (decimals) {
						if (isNaN(decimals)) {
							decimals = 2;
						}
						decimalsPattern = decimals > 0 ? decimalDelimiter + new Array(decimals + 1).join('0') : '';
						maskPattern = '#' + thousandsDelimiter + '##0' + decimalsPattern + " " + units;
						moneyMask = new StringMask(maskPattern, { reverse: true });

						parser(ctrl.$viewValue);
					});
				}

				if (attrs.min) {
					ctrl.$parsers.push(function (value) {
						var min = $parse(attrs.min)(scope);
						return NumberValidators.minNumber(ctrl, value, min);
					});

					scope.$watch(attrs.min, function (value) {
						NumberValidators.minNumber(ctrl, ctrl.$modelValue, value);
					});
				}

				if (attrs.max) {
					ctrl.$parsers.push(function (value) {
						var max = $parse(attrs.max)(scope);
						return NumberValidators.maxNumber(ctrl, value, max);
					});

					scope.$watch(attrs.max, function (value) {
						NumberValidators.maxNumber(ctrl, ctrl.$modelValue, value);
					});
				}
			}
		};
	}]);

	'use strict';

	angular.module('ui.utils.masks.global.number', ['ui.utils.masks.helpers']).directive('uiNumberMask', ['$locale', '$parse', 'PreFormatters', 'NumberMasks', 'NumberValidators', function ($locale, $parse, PreFormatters, NumberMasks, NumberValidators) {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function link(scope, element, attrs, ctrl) {
				var decimalDelimiter = $locale.NUMBER_FORMATS.DECIMAL_SEP,
				    thousandsDelimiter = $locale.NUMBER_FORMATS.GROUP_SEP,
				    decimals = $parse(attrs.uiNumberMask)(scope);

				if (angular.isDefined(attrs.uiHideGroupSep)) {
					thousandsDelimiter = '';
				}

				if (isNaN(decimals)) {
					decimals = 2;
				}

				var viewMask = NumberMasks.viewMask(decimals, decimalDelimiter, thousandsDelimiter),
				    modelMask = NumberMasks.modelMask(decimals);

				function parser(value) {
					if (ctrl.$isEmpty(value)) {
						return value;
					}

					var valueToFormat = PreFormatters.clearDelimitersAndLeadingZeros(value) || '0';
					var formatedValue = viewMask.apply(valueToFormat);
					var actualNumber = parseFloat(modelMask.apply(valueToFormat));

					if (angular.isDefined(attrs.uiNegativeNumber)) {
						var isNegative = value[0] === '-',
						    needsToInvertSign = value.slice(-1) === '-';

						//only apply the minus sign if it is negative or(exclusive)
						//needs to be negative and the number is different from zero
						if (needsToInvertSign ^ isNegative && !!actualNumber) {
							actualNumber *= -1;
							formatedValue = '-' + formatedValue;
						}
					}

					if (ctrl.$viewValue !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}

					return actualNumber;
				}

				function formatter(value) {
					if (ctrl.$isEmpty(value)) {
						return value;
					}

					var prefix = '';
					if (angular.isDefined(attrs.uiNegativeNumber) && value < 0) {
						prefix = '-';
					}

					var valueToFormat = PreFormatters.prepareNumberToFormatter(value, decimals);
					return prefix + viewMask.apply(valueToFormat);
				}

				ctrl.$formatters.push(formatter);
				ctrl.$parsers.push(parser);

				if (attrs.uiNumberMask) {
					scope.$watch(attrs.uiNumberMask, function (decimals) {
						if (isNaN(decimals)) {
							decimals = 2;
						}
						viewMask = NumberMasks.viewMask(decimals, decimalDelimiter, thousandsDelimiter);
						modelMask = NumberMasks.modelMask(decimals);

						parser(ctrl.$viewValue);
					});
				}

				if (attrs.min) {
					ctrl.$parsers.push(function (value) {
						var min = $parse(attrs.min)(scope);
						return NumberValidators.minNumber(ctrl, value, min);
					});

					scope.$watch(attrs.min, function (value) {
						NumberValidators.minNumber(ctrl, ctrl.$modelValue, value);
					});
				}

				if (attrs.max) {
					ctrl.$parsers.push(function (value) {
						var max = $parse(attrs.max)(scope);
						return NumberValidators.maxNumber(ctrl, value, max);
					});

					scope.$watch(attrs.max, function (value) {
						NumberValidators.maxNumber(ctrl, ctrl.$modelValue, value);
					});
				}
			}
		};
	}]);

	'use strict';

	angular.module('ui.utils.masks.global.percentage', ['ui.utils.masks.helpers']).directive('uiPercentageMask', ['$locale', '$parse', 'PreFormatters', 'NumberMasks', 'NumberValidators', function ($locale, $parse, PreFormatters, NumberMasks, NumberValidators) {
		function preparePercentageToFormatter(value, decimals) {
			return PreFormatters.clearDelimitersAndLeadingZeros((parseFloat(value) * 100).toFixed(decimals));
		}

		return {
			restrict: 'A',
			require: 'ngModel',
			link: function link(scope, element, attrs, ctrl) {
				var decimalDelimiter = $locale.NUMBER_FORMATS.DECIMAL_SEP,
				    thousandsDelimiter = $locale.NUMBER_FORMATS.GROUP_SEP,
				    decimals = parseInt(attrs.uiPercentageMask);

				if (angular.isDefined(attrs.uiHideGroupSep)) {
					thousandsDelimiter = '';
				}

				if (isNaN(decimals)) {
					decimals = 2;
				}

				var numberDecimals = decimals + 2;
				var viewMask = NumberMasks.viewMask(decimals, decimalDelimiter, thousandsDelimiter),
				    modelMask = NumberMasks.modelMask(numberDecimals);

				function formatter(value) {
					if (ctrl.$isEmpty(value)) {
						return value;
					}

					var valueToFormat = preparePercentageToFormatter(value, decimals);
					return viewMask.apply(valueToFormat) + ' %';
				}

				function parse(value) {
					if (ctrl.$isEmpty(value)) {
						return value;
					}

					var valueToFormat = PreFormatters.clearDelimitersAndLeadingZeros(value) || '0';
					if (value.length > 1 && value.indexOf('%') === -1) {
						valueToFormat = valueToFormat.slice(0, valueToFormat.length - 1);
					}
					var formatedValue = viewMask.apply(valueToFormat) + ' %';
					var actualNumber = parseFloat(modelMask.apply(valueToFormat));

					if (ctrl.$viewValue !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}

					return actualNumber;
				}

				ctrl.$formatters.push(formatter);
				ctrl.$parsers.push(parse);

				if (attrs.uiPercentageMask) {
					scope.$watch(attrs.uiPercentageMask, function (decimals) {
						if (isNaN(decimals)) {
							decimals = 2;
						}
						numberDecimals = decimals + 2;
						viewMask = NumberMasks.viewMask(decimals, decimalDelimiter, thousandsDelimiter);
						modelMask = NumberMasks.modelMask(numberDecimals);

						parse(ctrl.$viewValue);
					});
				}

				if (attrs.min) {
					ctrl.$parsers.push(function (value) {
						var min = $parse(attrs.min)(scope);
						return NumberValidators.minNumber(ctrl, value, min);
					});

					scope.$watch('min', function (value) {
						NumberValidators.minNumber(ctrl, ctrl.$modelValue, value);
					});
				}

				if (attrs.max) {
					ctrl.$parsers.push(function (value) {
						var max = $parse(attrs.max)(scope);
						return NumberValidators.maxNumber(ctrl, value, max);
					});

					scope.$watch('max', function (value) {
						NumberValidators.maxNumber(ctrl, ctrl.$modelValue, value);
					});
				}
			}
		};
	}]);

	'use strict';

	angular.module('ui.utils.masks.global.scientific-notation', []).directive('uiScientificNotationMask', ['$locale', '$parse', '$log', function ($locale, $parse, $log) {
		var decimalDelimiter = $locale.NUMBER_FORMATS.DECIMAL_SEP,
		    defaultPrecision = 2;

		function significandMaskBuilder(decimals) {
			var mask = '0';

			if (decimals > 0) {
				mask += decimalDelimiter;
				for (var i = 0; i < decimals; i++) {
					mask += '0';
				}
			}

			return new StringMask(mask, {
				reverse: true
			});
		}

		return {
			restrict: 'A',
			require: 'ngModel',
			link: function link(scope, element, attrs, ctrl) {
				var decimals = $parse(attrs.uiScientificNotationMask)(scope);

				if (isNaN(decimals)) {
					decimals = defaultPrecision;
				}

				var significandMask = significandMaskBuilder(decimals);

				function splitNumber(value) {
					var stringValue = value.toString(),
					    splittedNumber = stringValue.match(/(-?[0-9]*)[\.]?([0-9]*)?[Ee]?([\+-]?[0-9]*)?/);

					return {
						integerPartOfSignificand: splittedNumber[1],
						decimalPartOfSignificand: splittedNumber[2],
						exponent: splittedNumber[3] | 0
					};
				}

				function formatter(value) {
					$log.debug('[uiScientificNotationMask] Formatter called: ', value);

					if (ctrl.$isEmpty(value)) {
						return value;
					}

					if (typeof value === 'string') {
						value = value.replace(decimalDelimiter, '.');
					} else if (typeof value === 'number') {
						value = value.toExponential(decimals);
					}

					var formattedValue, exponent;
					var splittedNumber = splitNumber(value);

					var integerPartOfSignificand = splittedNumber.integerPartOfSignificand || 0;
					var numberToFormat = integerPartOfSignificand.toString();
					if (angular.isDefined(splittedNumber.decimalPartOfSignificand)) {
						numberToFormat += splittedNumber.decimalPartOfSignificand;
					}

					var needsNormalization = (integerPartOfSignificand >= 1 || integerPartOfSignificand <= -1) && (angular.isDefined(splittedNumber.decimalPartOfSignificand) && splittedNumber.decimalPartOfSignificand.length > decimals || decimals === 0 && numberToFormat.length >= 2);

					if (needsNormalization) {
						exponent = numberToFormat.slice(decimals + 1, numberToFormat.length);
						numberToFormat = numberToFormat.slice(0, decimals + 1);
					}

					formattedValue = significandMask.apply(numberToFormat);

					if (splittedNumber.exponent !== 0) {
						exponent = splittedNumber.exponent;
					}

					if (angular.isDefined(exponent)) {
						formattedValue += 'e' + exponent;
					}

					return formattedValue;
				}

				function parser(value) {
					$log.debug('[uiScientificNotationMask] Parser called: ', value);

					if (ctrl.$isEmpty(value)) {
						return value;
					}

					var viewValue = formatter(value),
					    modelValue = parseFloat(viewValue.replace(decimalDelimiter, '.'));

					if (ctrl.$viewValue !== viewValue) {
						ctrl.$setViewValue(viewValue);
						ctrl.$render();
					}

					return modelValue;
				}

				function validator(value) {
					$log.debug('[uiScientificNotationMask] Validator called: ', value);

					if (ctrl.$isEmpty(value)) {
						return value;
					}

					var isMaxValid = value < Number.MAX_VALUE;
					ctrl.$setValidity('max', isMaxValid);
					return value;
				}

				ctrl.$formatters.push(formatter);
				ctrl.$formatters.push(validator);
				ctrl.$parsers.push(parser);
				ctrl.$parsers.push(validator);
			}
		};
	}]);

	'use strict';

	angular.module('ui.utils.masks.global.time', []).directive('uiTimeMask', ['$log', function ($log) {
		if (typeof StringMask === 'undefined') {
			throw new Error('StringMask not found. Check if it is available.');
		}

		return {
			restrict: 'A',
			require: 'ngModel',
			link: function link(scope, element, attrs, ctrl) {
				var unformattedValueLength = 6,
				    formattedValueLength = 8,
				    timeFormat = '00:00:00';

				if (angular.isDefined(attrs.uiTimeMask) && attrs.uiTimeMask === 'short') {
					unformattedValueLength = 4;
					formattedValueLength = 5;
					timeFormat = '00:00';
				}

				var timeMask = new StringMask(timeFormat);

				function clearValue(value) {
					return value.replace(/[^0-9]/g, '').slice(0, unformattedValueLength);
				}

				function formatter(value) {
					$log.debug('[uiTimeMask] Formatter called: ', value);
					if (ctrl.$isEmpty(value)) {
						return value;
					}

					var cleanValue = clearValue(value);

					if (cleanValue.length === 0) {
						return '';
					}

					var formattedValue = timeMask.process(cleanValue).result;
					return formattedValue.replace(/[^0-9]$/, '');
				}

				function parser(value) {
					$log.debug('[uiTimeMask] Parser called: ', value);

					var viewValue = formatter(value);
					var modelValue = viewValue;

					if (ctrl.$viewValue !== viewValue) {
						ctrl.$setViewValue(viewValue);
						ctrl.$render();
					}

					return modelValue;
				}

				function validator(value) {
					$log.debug('[uiTimeMask] Validator called: ', value);

					if (angular.isUndefined(value)) {
						return value;
					}

					var splittedValue = value.toString().split(/:/).filter(function (v) {
						return !!v;
					});

					var hours = parseInt(splittedValue[0]),
					    minutes = parseInt(splittedValue[1]),
					    seconds = parseInt(splittedValue[2] || 0);

					var isValid = value.toString().length === formattedValueLength && hours < 24 && minutes < 60 && seconds < 60;

					ctrl.$setValidity('time', ctrl.$isEmpty(value) || isValid);
					return value;
				}

				ctrl.$formatters.push(formatter);
				ctrl.$formatters.push(validator);
				ctrl.$parsers.push(parser);
				ctrl.$parsers.push(validator);
			}
		};
	}]);

	'use strict';

	angular.module('ui.utils.masks.helpers', []).factory('PreFormatters', [function () {
		function clearDelimitersAndLeadingZeros(value) {
			var cleanValue = value.replace(/^-/, '').replace(/^0*/, '');
			cleanValue = cleanValue.replace(/[^0-9]/g, '');
			return cleanValue;
		}

		function prepareNumberToFormatter(value, decimals) {
			return clearDelimitersAndLeadingZeros(parseFloat(value).toFixed(decimals));
		}

		return {
			clearDelimitersAndLeadingZeros: clearDelimitersAndLeadingZeros,
			prepareNumberToFormatter: prepareNumberToFormatter
		};
	}]).factory('NumberValidators', [function () {
		return {
			maxNumber: function maxValidator(ctrl, value, limit) {
				var max = parseFloat(limit);
				var validity = ctrl.$isEmpty(value) || isNaN(max) || value <= max;
				ctrl.$setValidity('max', validity);
				return value;
			},
			minNumber: function minValidator(ctrl, value, limit) {
				var min = parseFloat(limit);
				var validity = ctrl.$isEmpty(value) || isNaN(min) || value >= min;
				ctrl.$setValidity('min', validity);
				return value;
			}
		};
	}]).factory('NumberMasks', [function () {
		return {
			viewMask: function viewMask(decimals, decimalDelimiter, thousandsDelimiter) {
				var mask = '#' + thousandsDelimiter + '##0';

				if (decimals > 0) {
					mask += decimalDelimiter;
					for (var i = 0; i < decimals; i++) {
						mask += '0';
					}
				}

				return new StringMask(mask, {
					reverse: true
				});
			},
			modelMask: function modelMask(decimals) {
				var mask = '###0';

				if (decimals > 0) {
					mask += '.';
					for (var i = 0; i < decimals; i++) {
						mask += '0';
					}
				}

				return new StringMask(mask, {
					reverse: true
				});
			}
		};
	}]);

	'use strict';

	var availableDependencies = ['ui.utils.masks.global', 'ui.utils.masks.br', 'ui.utils.masks.us'].filter(function (dependency) {
		try {
			angular.module(dependency);
			return true;
		} catch (e) {
			return false;
		}
	});

	angular.module('ui.utils.masks', availableDependencies).config(['$logProvider', function ($logProvider) {
		$logProvider.debugEnabled(false);
	}]);
})(angular);
'use strict';

/**
 * Created by patrick on 2/23/15.
 */

(function () {
    'use strict';

    angular.module('common').controller('LoginController', ['$scope', '$log', '$rootScope', 'UIUtil', 'AuthService', 'AppAnalytics', LoginController]);

    function LoginController($scope, $log, $rootScope, UIUtil, AuthService, AppAnalytics) {

        $log.info('LoginController loaded');

        $scope.appName = appName;
        if ($scope.appName == 'grocery') {
            $scope.userInputType = 'email';
            $scope.userInputLabel = "Email";
            $scope.title = "Shipt";
        } else {
            $scope.userInputType = 'text';
            $scope.userInputLabel = "Email";
            $scope.title = "Pilot Shopper";
        }

        $scope.invalidLogin = false;
        $scope.login = {
            username: null,
            password: null
        };

        $scope.invalidLoginMessage = "";
        $scope.errorLoginMessage = "There was an error.";

        $scope.loginSubmit = function (loginData) {
            if (loginForm.$valid) {
                return false;
            }
            UIUtil.showLoading();
            AuthService.authenticateUser(loginData).then(function (data) {
                $log.info('login success');
                loginData = null;
                $scope.login = {
                    username: null,
                    password: null
                };
                $scope.loginError = false;
                $scope.invalidLogin = false;
                $rootScope.$broadcast('user.loggedin', data);
                UIUtil.hideLoading();
            }, function (data) {
                $log.error('error', data);
                if (data) {
                    if (data.errors) {
                        $scope.invalidLoginMessage = data.errors;
                    } else {
                        $scope.invalidLoginMessage = "Invalid credentials";
                    }

                    $scope.invalidLogin = true;
                    $scope.loginError = false;
                } else {
                    $scope.loginError = true;
                    $scope.invalidLogin = false;
                }
                UIUtil.hideLoading();
            });
        };

        $scope.signUp = function () {
            $log.info('signup');
            $rootScope.$broadcast('show-register-page');
        };

        $scope.resetPassword = function () {
            if (webVersion) {
                var url = 'https://app.shipt.com/password_resets/new';
                window.open(url, '_blank');return false;
            } else {
                var url = 'https://app.shipt.com/password_resets/new';
                window.open(url, '_system', 'location=yes');return false;
            }
            AppAnalytics.track('resetPasswordClicked');
        };

        $scope.resetPasswordShopper = function () {
            var url = 'https://app.shipt.com/shopper/password_resets/new';
            window.open(url, '_system', 'location=yes');return false;
            AppAnalytics.track('resetPasswordClicked');
        };
    }
})();
'use strict';

/**
 * Created by Shipt
 */

(function () {
    'use strict';

    angular.module('common').factory('CustomOrderLine', ['$http', '$q', '$timeout', '$log', CustomOrderLine]);

    function CustomOrderLine($http, $q, $timeout, $log) {

        function CustomOrderLineObject() {
            this.requested_product_attributes = {
                cost: 0.00,
                description: null
            };
            this.requested_product_type = 'CustomProduct';
            this.requested_qty = 0;
        }

        return CustomOrderLineObject;
    }
})();
'use strict';

(function () {
    'use strict';

    var serviceId = 'GroceryCartItem';

    angular.module('common').factory(serviceId, GroceryCartItem);

    function GroceryCartItem() {

        function GroceryCartItemObject(cartItem) {
            this.product = null;
            this.qty = 0;
            this.note = null;
            var me = this;
            if (cartItem) {
                me.product = cartItem.product;
                me.note = cartItem.note;
                if (cartItem.qty) {
                    me.qty = cartItem.qty;
                } else if (cartItem.count) {
                    me.qty = cartItem.count;
                }
            }
        }

        return GroceryCartItemObject;
    }
})();
'use strict';

/**
 * Created by patrick on 3/3/15.
 */

(function () {
    'use strict';

    var serviceId = 'Order';

    angular.module('common').factory(serviceId, ['$http', '$q', '$timeout', '$log', 'VersionProvider', Order]);

    function Order($http, $q, $timeout, $log, VersionProvider) {

        function OrderObject() {
            this.id = 0;
            this.store_location_id = null;
            this.time_window = "";
            this.customer_id = null;
            this.credit_card_id = null;
            this.stripe_transaction_id = "";
            this.total = 0.00;
            this.driver_id = null;
            this.delivery_id = null;
            this.notes = "";
            this.customer_address_id = null;
            this.created_at = null;
            this.updated_at = null;
            this.order_lines = [];
            this.substitution_preference = null;
            this.source = "customer-" + VersionProvider.getPlatformName();
        }

        return OrderObject;
    }
})();
'use strict';

/**
 * Created by patrick on 3/3/15.
 */

(function () {
    'use strict';

    var serviceId = 'OrderLine';

    angular.module('common').factory(serviceId, ['$http', '$q', '$timeout', '$log', OrderLine]);

    function OrderLine($http, $q, $timeout, $log) {

        function OrderLineObject() {
            this.id = null;
            this.requested_product_id = 0;
            this.store_order_id = 0;
            this.requested_qty = 0;
            this.notes = "";
            this.created_at = null;
            this.updated_at = null;
        }

        return OrderLineObject;
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('common').service('AppAnalytics', AppAnalytics);

    AppAnalytics.$inject = ['$log', '$q', '$filter', 'LogService', 'KahunaService', 'AuthService', 'VersionProvider', 'ApiEndpoint', 'AppIdentity'];

    function AppAnalytics($log, $q, $filter, LogService, KahunaService, AuthService, VersionProvider, ApiEndpoint, AppIdentity) {

        this.initSegment = function () {
            try {
                var analytics = window.analytics;
                var stagingKey = "UBvTMXnqZhfJlYn8fWfG4blYql7lpWol";
                var groceryProdKey = "BIaY9OeQh3JzvmufawdnMtWPJGcQUUyx";
                var shopperProdKey = "3BzfhEj7hf6HZpeyGSz8ACco2j8xQ0ih";
                if (!AppIdentity.isProduction()) {
                    analytics.load(stagingKey);
                } else if (AppIdentity.isGroceryApp()) {
                    analytics.load(groceryProdKey);
                } else if (AppIdentity.isShopperApp()) {
                    analytics.load(shopperProdKey);
                }
                analytics.page();
            } catch (e) {
                $log.info(e);
            }
        };

        //page is called from the root of the app on the route change success event
        this.page = function (event, toState, toParams, fromState, fromParams) {
            try {
                //parse the params objects into objects if they are there.
                if (Object.keys(toParams).length != 0) {
                    toParams = JSON.parse(toParams[Object.keys(toParams)[0]]);
                } else {
                    toParams = null;
                }
                if (Object.keys(fromParams).length != 0) {
                    fromParams = JSON.parse(fromParams[Object.keys(fromParams)[0]]);
                } else {
                    fromParams = null;
                }
                if (isBlockedPageEvent(fromState.name, toState.name)) {
                    return;
                }

                analytics.page(toState.name, {
                    fromName: fromState.name,
                    toParams: toParams,
                    fromParams: fromParams,
                    store: getUserStore(),
                    metro: getUserMetro()
                });
            } catch (e) {
                $log.error(e);
            }
        };

        this.track = function (name) {
            var properties = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
            var includeMetroStore = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

            try {
                if (includeMetroStore) {
                    properties.store = getUserStore();
                    properties.metro = getUserMetro();
                }
                analytics.track(name, properties);
            } catch (e) {
                $log.error(e);
            }
        };

        this.login = function () {
            try {
                analytics.track('login', {
                    store: getUserStore(),
                    metro: getUserMetro()
                });
                KahunaService.login();
            } catch (e) {
                $log.error(e);
            }
        };

        this.identify = function () {
            try {
                var platform;

                (function () {
                    var identifyCall = function identifyCall(version) {
                        if (AuthService.isAuthenticated()) {
                            if (appName == "grocery") {

                                var user = AuthService.getUserInfo();
                                analytics.identify(user.id, {
                                    name: user.name,
                                    firstName: firstName(user.name),
                                    lastName: lastName(user.name),
                                    email: user.email,
                                    guest: user.guest_account,
                                    metro: user.metro.name,
                                    platform: platform,
                                    version: version,
                                    feature_toggles: user.features,
                                    accountAge: getAccountAge(user),
                                    subscriptionAge: getAccountSubscriptionAge(user)
                                });
                            } else if (appName == "shopper") {

                                var user = AuthService.getUserInfo();
                                analytics.identify(user.id, {
                                    name: user.name,
                                    firstName: firstName(user.name),
                                    lastName: lastName(user.name),
                                    email: user.email,
                                    metro: user.metro.name,
                                    platform: platform,
                                    version: version,
                                    accountAge: getAccountAge(user)
                                });
                            }
                        }
                    };

                    var getAccountSubscriptionAge = function getAccountSubscriptionAge(account) {
                        try {
                            if (account.subscription) {
                                var a = moment();
                                var b = moment(account.subscription.created_at);
                                var diffInDays = a.diff(b, 'days');
                                return diffInDays;
                            } else {
                                return null;
                            }
                        } catch (e) {
                            return null;
                        }
                    };

                    var getAccountAge = function getAccountAge(account) {
                        try {
                            if (!account.created_at) {
                                return null;
                            }
                            var a = moment();
                            var b = moment(account.created_at);
                            var diffInDays = a.diff(b, 'days');
                            return diffInDays;
                        } catch (e) {
                            return null;
                        }
                    };

                    platform = ionic.Platform.platform();

                    if (webVersion) {
                        platform = "web";
                        identifyCall();
                    } else {
                        VersionProvider.getVersionString().then(function (version) {
                            identifyCall(version);
                        }, function () {
                            identifyCall();
                        });
                    }
                })();
            } catch (e) {
                // $log.error(e);
            }
        };

        this.signup = function () {
            try {
                analytics.track('signup', {
                    store: getUserStore(),
                    metro: getUserMetro()
                });
                KahunaService.signup();
            } catch (e) {
                $log.error(e);
            }
        };

        this.addProductToCart = function (product, source) {
            var fromDetail = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

            try {
                analytics.track('addProductToCart', {
                    product: product,
                    source: source,
                    fromDetail: fromDetail,
                    store: getUserStore(),
                    metro: getUserMetro()
                });
                KahunaService.addProductToCart(product, source);
            } catch (e) {
                $log.error(e);
            }
        };

        this.addSpecialRequest = function (specialRequest) {
            try {
                analytics.track('addSpecialRequest', {
                    specialRequest: specialRequest,
                    store: getUserStore(),
                    metro: getUserMetro()
                });
                KahunaService.addSpecialRequest(specialRequest.name);
            } catch (e) {
                $log.error(e);
            }
        };

        this.createSpecialRequest = function (specialRequest) {
            try {
                analytics.track('createSpecialRequest', {
                    specialRequest: specialRequest,
                    store: getUserStore(),
                    metro: getUserMetro()
                });
                KahunaService.addSpecialRequest(specialRequest.name);
            } catch (e) {
                $log.error(e);
            }
        };

        this.productSearch = function (searchValue) {
            try {
                analytics.track('search', {
                    search: searchValue,
                    store: getUserStore(),
                    metro: getUserMetro()
                });
                KahunaService.productSearch(searchValue);
            } catch (e) {
                $log.error(e);
            }
        };

        this.viewProduct = function (product, source) {
            try {
                analytics.track('viewProduct', {
                    product: product,
                    source: source,
                    store: getUserStore(),
                    metro: getUserMetro()
                });
                KahunaService.viewProduct(product, source);
            } catch (e) {
                $log.error(e);
            }
        };

        this.viewCategory = function (categoryName) {
            try {
                analytics.track('viewCategory', {
                    categoryName: categoryName,
                    store: getUserStore(),
                    metro: getUserMetro()
                });
                KahunaService.viewCategory(categoryName);
            } catch (e) {
                $log.error(e);
            }
        };

        this.checkoutComplete = function (order, order_lines, address) {
            try {
                analytics.track('checkoutComplete', {
                    order_id: order.id,
                    revenue: order.charge_total,
                    order_lines: order_lines,
                    delivery_zip: address ? address.zip_code : null,
                    store: getUserStore(),
                    metro: getUserMetro()
                });
                KahunaService.checkoutComplete(order, order_lines);
            } catch (e) {
                $log.error(e);
            }
        };

        this.membershipPurchase = function (data) {
            try {
                analytics.track('membershipPurchase', {
                    plan_id: data.plan.id,
                    revenue: data.plan.amount / 100,
                    store: getUserStore(),
                    metro: getUserMetro()
                });
                KahunaService.membershipPurchase(data);
            } catch (e) {
                $log.error(e);
            }
        };

        this.beginCheckout = function () {
            try {
                KahunaService.beginCheckout();
            } catch (e) {
                $log.error(e);
            }
        };

        this.checkoutButtonClicked = function (order) {
            try {
                analytics.track('checkoutButtonClicked', {
                    store: getUserStore(),
                    metro: getUserMetro()
                });
            } catch (e) {
                $log.error(e);
            }
        };

        this.checkoutButtonClickedError = function () {
            try {
                analytics.track('checkoutButtonClickedError', {
                    store: getUserStore(),
                    metro: getUserMetro()
                });
            } catch (e) {
                $log.error(e);
            }
        };

        this.editOrder = function () {
            try {
                analytics.track('editOrder', {
                    store: getUserStore(),
                    metro: getUserMetro()
                });
            } catch (e) {
                $log.error(e);
            }
        };

        this.cancelOrder = function () {
            try {
                analytics.track('cancelOrder', {
                    store: getUserStore(),
                    metro: getUserMetro()
                });
            } catch (e) {
                $log.error(e);
            }
        };

        this.rateShopper = function (rating) {
            try {
                analytics.track('rateShopper', {
                    rating: rating,
                    store: getUserStore(),
                    metro: getUserMetro()
                });
                KahunaService.rateShopper(rating);
            } catch (e) {
                $log.error(e);
            }
        };

        this.tipShopper = function (tip) {
            try {
                analytics.track('tipShopper', {
                    tip: tip,
                    store: getUserStore(),
                    metro: getUserMetro()
                });
                KahunaService.tipShopper();
            } catch (e) {
                $log.error(e);
            }
        };

        this.addAddress = function (address) {
            try {
                analytics.track('addAddress', {
                    address: address,
                    store: getUserStore(),
                    metro: getUserMetro()
                });
                KahunaService.addAddress(address);
            } catch (e) {
                $log.error(e);
            }
        };

        this.updateUser = function () {
            try {
                analytics.track('updateUser', {
                    store: getUserStore(),
                    metro: getUserMetro()
                });
                KahunaService.updateUser();
            } catch (e) {} finally {}
        };

        this.addCard = function () {
            try {
                analytics.track('addCard', {
                    store: getUserStore(),
                    metro: getUserMetro()
                });
                KahunaService.addCard();
            } catch (e) {
                $log.error(e);
            }
        };

        this.filterSort = function (filterSort) {
            try {
                if (filterSort) {
                    analytics.track('filterSort', {
                        sortBy: filterSort.sortBy,
                        filterCategories: filterSort.filterCategories,
                        filterBrands: filterSort.filterBrands
                    });
                } else {
                    analytics.track('filterSortModalOpened');
                }
            } catch (e) {
                $log.error(e);
            }
        };

        function getUserStore() {
            try {
                var store = AuthService.getCustomerInfo().store.name;
                console.log('store', store);
                return store;
            } catch (e) {
                // $log.error(e);
                return null;
            }
        }

        function getUserMetro() {
            try {
                var metro = AuthService.getCustomerInfo().metro.name;
                console.log('metro', metro);
                return metro;
            } catch (e) {
                // $log.error(e);
                return null;
            }
        }

        function firstName(name) {
            try {
                var nameString = name;
                if (name.split(' ').length > 0) {
                    nameString = name.split(' ')[0];
                }
                return nameString;
            } catch (e) {
                return name;
            }
        }

        function lastName(name) {
            try {
                var nameString = name;
                if (name.split(' ').length > 1) {
                    nameString = name.split(' ')[1];
                }
                return nameString;
            } catch (e) {
                return name;
            }
        }

        function isBlockedPageEvent(fromName, toName) {
            if (fromName === "app.addEditCard" && toState.name === "app.checkout" || fromName === "" && toName === "app.home") {
                return true;
            } else {
                return false;
            }
        }
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('common').service('AppIdentity', AppIdentity);

    AppIdentity.$inject = ['CommonConfig'];

    function AppIdentity(CommonConfig) {

        this.identity = function () {
            if (webVersion && webVersion === true) {
                return CommonConfig.webAppIdentity;
            } else if (appName === 'grocery') {
                return CommonConfig.groceryAppIdentity;
            } else if (appName === 'shopper') {
                return CommonConfig.shopperAppIdentity;
            }
        };

        this.isShopperApp = function () {
            return this.identity() === CommonConfig.shopperAppIdentity;
        };

        this.isGroceryApp = function () {
            return this.identity() === CommonConfig.groceryAppIdentity;
        };

        this.isWebApp = function () {
            return this.identity() === CommonConfig.webAppIdentity;
        };

        this.isProduction = function (url) {
            if (!url) {
                url = document.location.hostname;
            }
            var isLocalhost = url.indexOf('localhost') > -1;
            var isStaging = url.indexOf('staging') > -1;
            if (isLocalhost || isStaging) {
                return false;
            } else {
                return true;
            }
        };

        this.isLocalhost = function () {
            return document.location.hostname === "localhost";
        };
    }
})();
'use strict';

/**
 * Created by patrick on 2/24/15.
 */

(function () {
    'use strict';

    var serviceId = 'AuthService';

    angular.module('common').factory(serviceId, ['$http', '$q', '$log', 'ApiEndpoint', 'UIUtil', 'LogService', AuthService]);

    var keyAuthToken = 'authToken';
    function AuthService($http, $q, $log, ApiEndpoint, UIUtil, LogService) {

        var service = {
            isAuthenticated: isAuthenticated,
            shouldMakeShiptApiCall: shouldMakeShiptApiCall,
            authenticateUser: authenticateUser,
            registerUser: registerUser,
            logoutCurrentUser: logoutCurrentUser,
            getCustomerId: getCustomerId,
            getAuthToken: getAuthToken,
            getCustomerInfo: getCustomerInfo,
            getUserInfo: getCustomerInfo,
            saveAuthToken: saveAccountData,
            saveAccountData: saveAccountData,
            getMetros: getMetros
        };

        return service;

        function getMetros() {
            var deferred = $q.defer();
            $http.defaults.headers.common['X-Shipt-API-Token'] = getAuthToken();
            var req = {
                method: 'GET',
                url: ApiEndpoint.apiurl + '/api/v1/metros.json'
            };

            $http(req).success(function (data) {
                deferred.resolve(data);
            }).error(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function getAuthToken() {
            //check for the token here.
            var authString = window.localStorage[keyAuthToken];
            if (authString) {
                var authToken = angular.fromJson(authString).auth_token;
                return authToken;
            } else {
                return null;
            }
        };

        function shouldMakeShiptApiCall() {
            return isAuthenticated();
        }

        function isAuthenticated() {
            var token = getAuthToken();
            if (token) {
                return true;
            } else {
                return false;
            }
        };

        function saveAccountData(token) {
            try {
                var merged = mergeNotErasableFieldsFromCustomerToNew(token);
                if (merged != null && !merged) {
                    token = merged;
                }
                window.localStorage[keyAuthToken] = angular.toJson(token);
            } catch (e) {
                $log.error(e);
            }
        };

        function mergeNotErasableFieldsFromCustomerToNew(token) {
            try {
                var customer = getCustomerInfo();
                if (!token.credit_cards && customer.credit_cards) {
                    token.credit_cards = customer.credit_cards;
                }
                if (!token.customer_addresses && customer.customer_addresses) {
                    token.customer_addresses = customer.customer_addresses;
                }
                if (!token.orders && customer.orders) {
                    token.orders = customer.orders;
                }
                return token;
            } catch (e) {
                $log.error(e);
                return null;
            }
        }

        function authenticateUser(user) {
            var response = null;
            var deferred = $q.defer();

            var req = {
                method: 'POST',
                url: ApiEndpoint.authurl,
                data: user
            };

            $http(req).success(function (data) {
                $log.info('auth success');
                //success
                saveAccountData(data);
                LogService.info('Successful Login');
                deferred.resolve(data);
            }).error(function (error) {
                $log.error('error', error);
                LogService.error(error);
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function logoutCurrentUser() {
            var deferred = $q.defer();
            UIUtil.showYesNoConfirm('Sign Out', 'Are you sure you want to sign out?').then(function (confirmed) {
                if (confirmed) {
                    LogService.info('User Sign Out');
                    clearLocalStorage();
                }
                deferred.resolve(confirmed);
            });
            return deferred.promise;
        }

        function clearLocalStorage() {
            var introModalShown = localStorage.getItem("intro-modal-shown");
            localStorage.clear();
            localStorage.setItem("intro-modal-shown", introModalShown);
        }

        function getCustomerId() {
            var customerInfo = getCustomerInfo();
            return customerInfo ? customerInfo.id : null;
        }

        function getCustomerInfo() {
            var customerString = window.localStorage[keyAuthToken];
            if (customerString) {
                var customer = angular.fromJson(customerString);
                return customer;
            } else {
                return null;
            }
        }

        function registerUser(registerData) {
            var deferred = $q.defer();

            var req = {
                method: 'POST',
                url: ApiEndpoint.apiurl + "/api/v1/customers.json",
                headers: {
                    'Accept': 'application/vnd.shiptauthapi.v1+json'
                },
                data: registerData
            };

            $http(req).success(function (data) {
                $log.info('register success');
                saveAccountData(data);
                LogService.info('Successful Register');
                deferred.resolve(data);
            }).error(function (error) {
                $log.error('error', error);
                LogService.error(error);
                deferred.reject(error);
            });

            return deferred.promise;
        }
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('common').factory('ConfigService', ['$http', '$q', 'ApiEndpoint', 'CommonConfig', 'DefaultHeaders', '$rootScope', 'AppIdentity', ConfigService]);

    /**
     * @ngdoc service
     * @name ConfigService
     * @description Provides common functionality for application configuration.
     *
     * @author Connor Eggleston
     */
    function ConfigService($http, $q, ApiEndpoint, CommonConfig, DefaultHeaders, $rootScope, AppIdentity) {

        return {
            loadConfig: loadConfig,
            getConfig: getConfig,
            getLocalConfig: getLocalConfig
        };

        /**
         * @ngdoc function
         * @name loadConfig
         * @description Retrieves the configuration data from the underlying API.
         *
         * @param context The context representing which app is targeted.
         * @returns {Promise} A promise containing the result of the api call.
         */
        function loadConfig(context) {
            var deferred = $q.defer(),
                configUrl = initializeConfig(context);

            $http({
                method: 'GET',
                url: ApiEndpoint.apiurl + configUrl
            }).then(function (response) {
                // Success
                saveLocalConfig(response.data);
                $rootScope.$broadcast('config.data.changed');
                deferred.resolve(response.data);
            }, function (error) {
                // Error
                deferred.reject(error);
            });

            return deferred.promise;
        }

        /**
         * @ngdoc function
         * @name initializeConfig
         * @description Adds the proper headers and sets the configuration url based on the given context.
         *
         * @param context The context of the app. (Grocery vs. Shopper)
         * @returns {*} The configuration url to retrieve data.
         */
        function initializeConfig(context) {
            var configUrl;
            if (context === CommonConfig.groceriesContext) {
                DefaultHeaders.customer();
                configUrl = CommonConfig.groceriesConfigUrl;
            } else if (context === CommonConfig.shopperContext) {
                DefaultHeaders.shopper();
                configUrl = CommonConfig.shopperConfigUrl;
            }

            return configUrl;
        }

        /**
         * @ngdoc function
         * @name getConfig
         * @description gets the config object and returns it. if for some reason the context is not loaded, load it and resolves the with the fresh context
         *
         * @returns {Promise} promise that resolves with the config data
         */
        function getConfig() {
            var deferred = $q.defer();
            var config = getLocalConfig();
            if (config) {
                deferred.resolve(config);
            } else {
                return loadConfig(currentConfigContext());
            }
            return deferred.promise;
        }

        /**
         * @ngdoc function
         * @name currentConfigContext
         * @description gets the config context for the current app
         *
         * @returns CommonConfig Context
         */
        function currentConfigContext() {
            if (AppIdentity.isGroceryApp()) {
                return CommonConfig.groceriesContext;
            } else {
                return CommonConfig.shopperContext;
            }
        }

        function saveLocalConfig(config) {
            localStorage.setItem(CommonConfig.configStoreKey, JSON.stringify(config));
        }

        function getLocalConfig() {
            var localConfig = localStorage.getItem(CommonConfig.configStoreKey);
            if (localConfig) {
                return JSON.parse(localConfig);
            } else {
                return null;
            }
        }
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('common').factory('DefaultHeaders', ['$log', '$http', 'AuthService', 'Geolocator', 'VersionProvider', '$ionicPlatform', DefaultHeaders]);

    function DefaultHeaders($log, $http, AuthService, Geolocator, VersionProvider, $ionicPlatform) {

        var service = {
            shopper: getShopperHeaders,
            customer: getCustomerHeaders
        };

        return service;

        function getShopperHeaders() {
            $ionicPlatform.ready(function () {
                if (AuthService.isAuthenticated()) {
                    Geolocator.getCurrentPosition();
                }
            });
            addShiptApiTokenHeader();
            addShiptGeoLatLongHeaders();
            addShiptVersionHeader();
        }

        function getCustomerHeaders() {
            addShiptApiTokenHeader();
            addShiptVersionHeader();
            addShiptGeoLatLongHeaders();
        }

        function addShiptApiTokenHeader() {
            $http.defaults.headers.common['X-Shipt-API-Token'] = AuthService.getAuthToken();
        }

        function addShiptGeoLatLongHeaders() {
            $http.defaults.headers.common['X-Shipt-Geo-Lat'] = Geolocator.latitude();
            $http.defaults.headers.common['X-Shipt-Geo-Long'] = Geolocator.longitude();
        }

        function addShiptVersionHeader() {
            VersionProvider.getVersionString().then(function (versionString) {
                $http.defaults.headers.common['X-Shipt-App-Version'] = versionString;
            });
        }
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('common').service('ErrorHandler', ErrorHandler);

    ErrorHandler.$inject = ['$log', '$q', '$filter', 'LogService', 'UIUtil'];

    //Call like this ErrorHandler.handleHttpError(error);
    function ErrorHandler($log, $q, $filter, LogService, UIUtil) {

        //handle things like the status text on heroku erros
        //and also have a better way of handling erros our platform sends back. :)
        this.handlError = function (error) {
            var title = arguments.length <= 1 || arguments[1] === undefined ? "Error" : arguments[1];
            var subTitle = arguments.length <= 2 || arguments[2] === undefined ? "" : arguments[2];
        };

        this.displayError = function (error) {
            var title = arguments.length <= 1 || arguments[1] === undefined ? "Error" : arguments[1];
            var subTitle = arguments.length <= 2 || arguments[2] === undefined ? "" : arguments[2];
        };

        this.handleAPIError = function (error) {
            var title = arguments.length <= 1 || arguments[1] === undefined ? "Error" : arguments[1];
            var subTitle = arguments.length <= 2 || arguments[2] === undefined ? "" : arguments[2];
        };

        this.displayShiptAPIError = function (error) {
            var title = arguments.length <= 1 || arguments[1] === undefined ? "Error" : arguments[1];
            var subTitle = arguments.length <= 2 || arguments[2] === undefined ? "" : arguments[2];

            try {
                var errorMessage = getMessageFromShiptAPIErrorObject(error);
                UIUtil.showAlert(title, subTitle + ' ' + errorMessage);
                return errorMessage;
            } catch (e) {
                $log.error(e);
                return false;
            }
        };

        this.displayStripeError = function (error) {
            var title = arguments.length <= 1 || arguments[1] === undefined ? "Error" : arguments[1];
            var subTitle = arguments.length <= 2 || arguments[2] === undefined ? "" : arguments[2];

            try {
                if (error.errors || error.status) {
                    // shipt api error, handle as such
                    this.displayShiptAPIError(error, 'Couldn\'t Save Card');
                } else {
                    // stripe error
                    UIUtil.showAlert(title, error);
                    return error;
                }
            } catch (e) {
                $log.error(e);
                return false;
            }
        };

        function getMessageFromShiptAPIErrorObject(error) {
            var fullErrorMessage = "";
            try {
                if (error.errors) {
                    //rails api error object. parse as such.
                    if (typeof error.errors == "string") {
                        fullErrorMessage = error.errors;
                    } else {
                        Object.keys(error.errors).forEach(function (element, index) {
                            fullErrorMessage += getErrorKey(element) + ' ' + getErrorElement(error, element);
                            $log.info(fullErrorMessage);
                        });
                    }
                } else if (error.status) {
                    //check for status headers and stuff here from heroku timout and stuff
                    if (error.statusText) {
                        fullErrorMessage += error.statusText + '. ';
                    }
                    if (error.status) {
                        fullErrorMessage += 'Response status was ' + error.status + '. ';
                    }
                }
                return fullErrorMessage;
            } catch (e) {
                $log.error(e);
                return '';
            }
        }

        function getErrorKey(element) {
            var errorKey = replaceAllInString("_", " ", element);
            errorKey = replaceAllInString(".", " ", errorKey);
            errorKey = $filter('capitalize')(errorKey);
            if (errorKey != "Base") {
                return errorKey;
            } else {
                return "";
            }
        }

        function getErrorElement(error, element) {
            var errorElement = replaceAllInString("_", " ", error.errors[element].toString());
            errorElement = replaceAllInString(".", " ", errorElement);
            errorElement = $filter('capitalize')(errorElement);
            if (!errorElement.includes('.')) {
                errorElement += ".";
            };
            return errorElement;
        }

        function replaceAllInString(replaceThis, withThis, string) {
            //now for a little recursion to make sure they are all gone
            string = string.replace(replaceThis, withThis);
            if (string.includes(replaceThis)) {
                return replaceAllInString(replaceThis, withThis, string);
            } else {
                return string;
            }
        }
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('common').factory('FeatureService', ['$http', '$log', '$q', 'LogService', 'AuthService', 'ApiEndpoint', 'DefaultHeaders', FeatureService]);

    function FeatureService($http, $log, $q, LogService, AuthService, ApiEndpoint, DefaultHeaders) {

        return {
            getFeatureToggle: getFeatureToggle,
            getAllFeatureToggles: getAllFeatures,
            showTipping: showTipping,
            showOrderLineReconciliation: showOrderLineReconciliation,
            mealKits: mealKits,
            subscription: subscription,
            subscriptionCancellation: subscriptionCancellation,
            favorites: favorites,
            chooseStoreInApp: chooseStoreInApp,
            categorySearchGoesToGlobalSearch: categorySearchGoesToGlobalSearch,
            useAlgoliaClientSearchResults: useAlgoliaClientSearchResults,
            multipleStores: multipleStores,
            showAvailableOrders: showAvailableOrders,
            refreshFeatures: refreshFeatures,
            showAmbassador: showAmbassador,
            showTaxExemptReminder: showTaxExemptReminder
        };

        /**
         * @ngdoc function
         * @name getFeatureToggle
         * @description Retrieves the given feature toggle.
         *
         * @param featureName The name of the feature toggle to try retrieving.
         * @returns {*} The status of the feature toggle (true/false) or null if an error occurred.
         */
        function getFeatureToggle(featureName) {
            try {
                return AuthService.getCustomerInfo().features[featureName] === true;
            } catch (error) {
                return null;
            }
        }

        function categorySearchGoesToGlobalSearch() {
            try {
                var userInfo = AuthService.getCustomerInfo();
                if (userInfo && userInfo.features) {
                    return userInfo.features.category_search_goes_to_global_search === true;
                }
                return false;
            } catch (e) {
                LogService.error(['FeatureService.categorySearchGoesToGlobalSearch', e]);
                return false;
            }
        }

        function chooseStoreInApp() {
            try {
                var userInfo = AuthService.getCustomerInfo();
                if (userInfo && userInfo.features) {
                    return userInfo.features.choose_store_in_app === true;
                }
                return false;
            } catch (e) {
                LogService.error(['FeatureService.chooseStoreInApp', e]);
                return false;
            }
        }

        function subscriptionCancellation() {
            try {
                var userInfo = AuthService.getCustomerInfo();
                if (userInfo && userInfo.features) {
                    return userInfo.features.subscription_cancellation === true;
                }
                return false;
            } catch (e) {
                LogService.error(['FeatureService.subscriptionCancellation', e]);
                return false;
            }
        };

        function useAlgoliaClientSearchResults() {
            try {
                var userInfo = AuthService.getCustomerInfo();
                if (userInfo && userInfo.features) {
                    return userInfo.features.use_algolia_client_search_results === true;
                }
                return false;
            } catch (e) {
                LogService.error(['FeatureService.useAlgoliaClientSearchResults', e]);
                return false;
            }
        }

        function favorites() {
            try {
                var userInfo = AuthService.getCustomerInfo();
                if (userInfo && userInfo.features) {
                    return userInfo.features.favorites === true;
                }
                return false;
            } catch (e) {
                LogService.error(['FeatureService.favorites', e]);
                return false;
            }
        }

        function subscription() {
            try {
                var userInfo = AuthService.getCustomerInfo();
                if (userInfo && userInfo.features) {
                    return userInfo.features.subscription_management === true;
                }
                return false;
            } catch (e) {
                LogService.error(['FeatureService.subscription_management', e]);
                return false;
            }
        }

        function mealKits() {
            try {
                var userInfo = AuthService.getCustomerInfo();
                if (userInfo && userInfo.features) {
                    return userInfo.features.meal_kits === true;
                }
                return false;
            } catch (e) {
                LogService.error(['FeatureService.mealKits', e]);
                return false;
            }
        }

        function showOrderLineReconciliation() {
            try {
                var userInfo = AuthService.getCustomerInfo();
                if (userInfo && userInfo.features) {
                    return userInfo.features.customer_order_line_feedback;
                }
            } catch (exception) {
                return false;
            }
        }

        function showTipping() {
            try {
                var userInfo = AuthService.getCustomerInfo();
                if (userInfo && userInfo.features) {
                    return userInfo.features.tipping;
                }
            } catch (exception) {
                return false;
            }
        }

        function addDefaultHeaders() {
            DefaultHeaders.shopper();
        }

        function showTaxExemptReminder() {
            try {
                var userInfo = AuthService.getCustomerInfo();
                if (userInfo && userInfo.features) {
                    if (userInfo.features.show_tax_exempt_reminder != undefined) {
                        return userInfo.features.show_tax_exempt_reminder === true;
                    } else {
                        return true;
                    }
                }
                return false;
            } catch (e) {
                LogService.error(['FeatureService.show_tax_exempt_reminder', e]);
                return true;
            }
        }

        function multipleStores() {
            try {
                var userInfo = AuthService.getCustomerInfo();
                if (userInfo && userInfo.features) {
                    return userInfo.features.multiple_stores === true;
                }
                return false;
            } catch (e) {
                LogService.error(['FeatureService.choose_store_in_app', e]);
                return false;
            }
        }

        function refreshFeatures() {
            var deferred = $q.defer();
            if (AuthService.getCustomerInfo()) {
                addDefaultHeaders();
                var req = {
                    method: 'GET',
                    url: ApiEndpoint.apiurl + 'api/v1/shopper/shopper/info.json'
                };

                $http(req).success(function (data) {
                    AuthService.saveAuthToken(data);
                }).error(function (error) {
                    $log.error('error', error);
                    LogService.error(error);
                    deferred.reject(error);
                });
            }
            return deferred.promise;
        }

        function getAllFeatures() {
            var defer = $q.defer();
            var userInfo = AuthService.getCustomerInfo();
            if (userInfo) {
                defer.resolve(userInfo.features);
            } else {
                defer.reject(null);
            }
            return defer.promise;
        }

        function showAvailableOrders() {
            var defer = $q.defer();
            return getAllFeatures().then(function (features) {
                return features.order_assignment ? false : true;
            }, function (error) {
                LogService.critical(['Error FeatureService showAvailableOrders', error]);
            });
            return defer.promise;
        }

        function showAmbassador() {
            try {
                var userInfo = AuthService.getCustomerInfo();
                if (userInfo && userInfo.features) {
                    return userInfo.features.ambassador;
                }
                return false;
            } catch (exception) {
                return false;
            }
        }
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('common').factory('Geolocator', ['$log', '$q', '$timeout', '$cordovaGeolocation', 'LogService', Geolocator]);

    function Geolocator($log, $q, $timeout, $cordovaGeolocation, LogService) {

        var service = {
            latitude: getlatitude,
            longitude: getlongitude,
            startWatch: startWatching,
            stopWatch: stopWatching,
            getCurrentPosition: getCurrentPosition
        };

        var geoWatch = null;
        var lat = null;
        var long = null;

        return service;

        function getCurrentPosition(forceHighAccuracy) {
            try {
                var defer = $q.defer();
                var posOptions = {
                    timeout: 10000,
                    maximumAge: 30000,
                    enableHighAccuracy: false
                };
                if (forceHighAccuracy) {
                    posOptions = {
                        timeout: 10000,
                        maximumAge: 0,
                        enableHighAccuracy: true
                    };
                }
                $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
                    // $log.info('Geo callback position:',position.coords);
                    lat = position.coords.latitude;
                    long = position.coords.longitude;
                    defer.resolve(position.coords);
                }, function (err) {
                    LogService.error(err);
                    defer.reject(err);
                });
                return defer.promise;
            } catch (e) {
                LogService.error(e);
            }
        }

        function startWatching() {
            try {
                var watchOptions = {
                    timeout: 3000,
                    maximumAge: 30000,
                    enableHighAccuracy: false // may cause errors if true
                };
                if (geoWatch == null) {
                    geoWatch = $cordovaGeolocation.watchPosition(watchOptions);
                    geoWatch.then(null, function (err) {
                        LogService.error(err);
                    }, function (position) {
                        // $log.info('Geo callback position:',position.coords);
                        lat = position.coords.latitude;
                        long = position.coords.longitude;
                    });
                }
            } catch (e) {
                LogService.error(e);
            }
        }

        function stopWatching() {
            try {
                geoWatch.clearWatch();
                geoWatch = null;
            } catch (e) {
                LogService.error(e);
            }
        }

        function getlatitude() {
            return lat;
        }

        function getlongitude() {
            return long;
        }
    }
})();
'use strict';

(function () {
    'use strict';

    var serviceId = 'HelpService';

    var needsCustomerInfoRefresh = false;

    angular.module('common').factory(serviceId, ['$http', '$q', 'LogService', '$log', 'AuthService', 'ApiEndpoint', '$rootScope', '$timeout', 'DefaultHeaders', HelpService]);

    function HelpService($http, $q, LogService, $log, AuthService, ApiEndpoint, $rootScope, $timeout, DefaultHeaders) {

        var service = {
            //customer
            getFaqs: getFaqCategories,
            getFaqCategories: getFaqCategories,
            getFaqsForCategory: getFaqsForCategory,
            getFaq: getFaq,

            //shopper
            getShopperFaqs: getShopperFaqs,
            getShopperFaqsForCategory: getShopperFaqsForCategory,
            getShopperFaq: getShopperFaq
        };

        return service;

        //Customer Api's

        function getFaqCategories() {
            var deferred = $q.defer();
            DefaultHeaders.customer();
            var rootUrl = ApiEndpoint.apiurl;
            var serviceUrl = rootUrl + '/api/v1/faqs.json';
            $http({
                url: serviceUrl,
                method: "get"
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function getFaqsForCategory(catId) {
            var deferred = $q.defer();
            DefaultHeaders.customer();
            var rootUrl = ApiEndpoint.apiurl;
            var serviceUrl = rootUrl + '/api/v1/faqs/category_questions.json?id=' + catId;
            $http({
                url: serviceUrl,
                method: "get"
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function getFaq(qId) {
            var deferred = $q.defer();
            DefaultHeaders.customer();
            var rootUrl = ApiEndpoint.apiurl;
            var serviceUrl = rootUrl + '/api/v1/faqs/question.json?id=' + qId;
            $http({
                url: serviceUrl,
                method: "get"
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        //Shopper apis
        function getShopperFaqs() {
            var deferred = $q.defer();
            DefaultHeaders.shopper();
            var rootUrl = ApiEndpoint.apiurl;
            var serviceUrl = rootUrl + '/api/v1/shopper/faqs.json';
            $http({
                url: serviceUrl,
                method: "get"
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function getShopperFaqsForCategory(catId) {
            var deferred = $q.defer();
            DefaultHeaders.shopper();
            var rootUrl = ApiEndpoint.apiurl;
            var serviceUrl = rootUrl + '/api/v1/shopper/faqs/category_questions.json?id=' + catId;
            $http({
                url: serviceUrl,
                method: "get"
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function getShopperFaq(qId) {
            var deferred = $q.defer();
            DefaultHeaders.shopper();
            var rootUrl = ApiEndpoint.apiurl;
            var serviceUrl = rootUrl + '/api/v1/shopper/faqs/question.json?id=' + qId;
            $http({
                url: serviceUrl,
                method: "get"
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('common').service('KahunaService', KahunaService);

    KahunaService.$inject = ['$log', '$q', '$filter', 'LogService', 'UIUtil', 'AuthService', 'inAppMessage', 'IN_APP_MESSAGE', 'AppIdentity', 'CommonConfig'];

    function KahunaService($log, $q, $filter, LogService, UIUtil, AuthService, inAppMessage, IN_APP_MESSAGE, AppIdentity, CommonConfig) {

        this.productSearch = function (searchTerm) {
            try {
                var searchEventBuilder = new KahunaEventBuilder("search");
                searchEventBuilder.addProperty("term", searchTerm);
                Kahuna.track(searchEventBuilder.build());
            } catch (e) {
                $log.error(e);
            }
        };

        this.addAddress = function (address) {
            try {
                var add_address = new KahunaEventBuilder("add_address");
                add_address.addProperty("city", address.city);
                add_address.addProperty("state", address.state);
                add_address.addProperty("zip", address.zip_code);
                Kahuna.track(add_address.build());
                var attributes = {};
                attributes["city"] = address.city;
                attributes["state"] = address.state;
                attributes["zip"] = address.zip_code;
                Kahuna.setUserAttributes(attributes);
                setUserAttributes();
            } catch (e) {
                $log.error(e);
            }
        };

        this.viewCategory = function (category_name) {
            try {
                var view_category = new KahunaEventBuilder("view_category");
                view_category.addProperty("category_viewed", category_name);
                Kahuna.track(view_category.build());
                var attributes = {};
                attributes["last_category_viewed"] = category_name;
                Kahuna.setUserAttributes(attributes);
                setUserAttributes();
            } catch (e) {
                $log.error(e);
            }
        };

        this.viewProduct = function (product, category_name) {
            try {
                var product_name = "";
                if (product.brand_name) {
                    product_name += product.brand_name + " " + product.name;
                } else {
                    product_name += product.name;
                }
                var view_product = new KahunaEventBuilder("view_product");
                view_product.addProperty("product_viewed_name", product_name);
                view_product.addProperty("product_viewed_category", category_name);
                Kahuna.track(view_product.build());

                var attributes = {};
                attributes["last_product_viewed_name"] = product_name;
                attributes["last_product_viewed_category"] = category_name;
                Kahuna.setUserAttributes(attributes);
                setUserAttributes();
            } catch (e) {
                $log.error(e);
            }
        };

        this.addProductToCart = function (product, category_name) {
            try {
                var product_name = "";
                if (product.brand_name) {
                    product_name += product.brand_name + " " + product.name;
                } else {
                    product_name += product.name;
                }
                var add_product_to_cart = new KahunaEventBuilder("add_product_to_cart");
                add_product_to_cart.addProperty("product_added_name", product_name);
                add_product_to_cart.addProperty("product_added_category", category_name);
                Kahuna.track(add_product_to_cart.build());

                var attributes = {};
                attributes["last_product_added_name"] = product_name;
                attributes["last_product_added_category"] = category_name;
                Kahuna.setUserAttributes(attributes);
                setUserAttributes();
            } catch (e) {
                $log.error(e);
            }
        };

        this.addSpecialRequest = function (name) {
            try {
                Kahuna.trackEvent("add_special_request");
            } catch (e) {
                $log.error(e);
            }
        };

        this.beginCheckout = function () {
            try {
                Kahuna.trackEvent("checkout_begin");
            } catch (e) {
                $log.error(e);
            }
        };

        this.addCard = function () {
            try {
                Kahuna.trackEvent("add_card");
            } catch (e) {
                $log.error(e);
            }
        };

        this.inviteFriend = function () {
            try {
                Kahuna.trackEvent("invite_friend");
            } catch (e) {
                $log.error(e);
            }
        };

        this.tipShopper = function () {
            try {
                Kahuna.trackEvent("tip_shoppers");
            } catch (e) {
                $log.error(e);
            }
        };

        this.rateShopper = function () {
            try {
                Kahuna.trackEvent("rate_shoppers");
            } catch (e) {
                $log.error(e);
            }
        };

        this.checkoutComplete = function (order, order_lines) {
            try {
                var checkout_complete = new KahunaEventBuilder("checkout_complete");
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = order_lines[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var order_line = _step.value;

                        try {
                            if (order_line.product) {
                                var product = order_line.product;
                                var product_name = "";
                                if (product.brand_name) {
                                    product_name += product.brand_name + " " + product.name;
                                } else if (product.name) {
                                    product_name += product.name;
                                }
                                checkout_complete.addProperty("product_purchased_name", product_name);
                            }
                        } catch (e) {
                            $log.error(e);
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                checkout_complete.setPurchaseData(order.order_lines.length, order.charge_total * 100);
                Kahuna.track(checkout_complete.build());
                var attributes = {};
                attributes["last_purchase_date"] = moment(order.created_at).format();
                Kahuna.setUserAttributes(attributes);
                setUserAttributes();
            } catch (e) {
                $log.error(e);
            }
        };

        this.updateUser = function () {
            try {
                setUserAttributes();
                setUserCredentials();
            } catch (e) {
                $log.error(e);
            }
        };

        this.membershipPurchase = function (data) {
            try {
                var membership_purchase = new KahunaEventBuilder("membership_purchase");
                membership_purchase.addProperty("plan", data.plan.id);
                membership_purchase.setPurchaseData(1, data.plan.amount);
                Kahuna.track(membership_purchase.build());
                var attributes = {};
                attributes["membership_start_date"] = moment().format();
                attributes["membership_type"] = data.plan.id;
                Kahuna.setUserAttributes(attributes);
                setUserAttributes();
            } catch (e) {
                $log.error(e);
            }
        };

        this.bindDeviceEvents = function () {
            try {
                if (AppIdentity.isGroceryApp() && !AppIdentity.isWebApp()) {
                    document.addEventListener('deviceready', this.onDeviceReady, false);
                    document.addEventListener('pause', this.onPaused, false);
                    document.addEventListener('resume', this.onResume, false);
                } else if (AppIdentity.isWebApp()) {
                    initKahunaServices();
                }
            } catch (e) {
                $log.error(e);
            }
        };

        this.signup = function () {
            try {
                setUserAttributes();
                Kahuna.trackEvent("sign_up");
                setUserCredentials();
            } catch (e) {
                $log.error(e);
            }
        };

        this.login = function () {
            try {
                setUserAttributes();
                setUserCredentials();
            } catch (e) {
                $log.error(e);
            }
        };

        this.logout = function () {
            try {
                Kahuna.logout();
            } catch (e) {
                $log.error(e);
            }
        };

        this.onDeviceReady = function () {
            try {
                initKahunaServices();
            } catch (e) {
                $log.error(e);
            }
        };

        function initKahunaServices() {
            if (AppIdentity.isWebApp()) {
                initForWeb();
            } else {
                initForApp();
            }
        }

        function initForApp() {
            try {
                Kahuna.launchWithKey(CommonConfig.kahunaKey);
                Kahuna.enablePush();
                Kahuna.setKahunaCallback(displayInAppMessage);
            } catch (e) {
                $log.error(e);
            }
        }

        function initForWeb() {
            try {
                var kahunaEnvironmentIdentifier = null;
                if (AppIdentity.isProduction()) {
                    kahunaEnvironmentIdentifier = 'p';
                } else {
                    kahunaEnvironmentIdentifier = 's';
                }
                Kahuna.setEnvironment(kahunaEnvironmentIdentifier);
                Kahuna.init(CommonConfig.kahunaKey, 'Shipt', 'web');
                if (AuthService.isAuthenticated()) {
                    setUserAttributes();
                    setUserCredentials();
                }
                Kahuna.setInAppMessageCallBack(displayInAppMessage);
            } catch (e) {
                $log.error(e);
            }
        };

        function displayInAppMessage(payload) {
            var type = payload['type']; // For in-app messages in mobile app this value will be 'inAppMessage'
            var message = payload['message']; // The In-App message.
            payload.parameters = inAppMessageParameters(payload); // Deep link parameters associated with the in-app.
            if (shouldDisplayInAppMessage(type)) {
                inAppMessage.show(payload, function () {
                    if (AppIdentity.isWebApp()) {
                        Kahuna.dismissInAppMessage();
                    }
                });
            }
        };

        function inAppMessageParameters(payload) {
            var extras = payload['extras'];
            var additionalParameters = payload['additionalParameters'];
            if (extras) {
                return extras;
            } else if (additionalParameters) {
                return additionalParameters;
            }
        }

        function shouldDisplayInAppMessage(type) {
            if (type) {
                if (type === 'inAppMessage') {
                    return true;
                } else {
                    return false;
                }
            } else if (AppIdentity.isWebApp()) {
                return true;
            }
        }

        this.onPaused = function () {
            try {
                $log.info('kahunaService.onPaused');
                Kahuna.onStop();
            } catch (e) {
                $log.error(e);
            }
        };

        this.onResume = function () {
            try {
                $log.info('kahunaService.onResume');
                Kahuna.onStart();
            } catch (e) {
                $log.error(e);
            }
        };

        this.bindDeviceEvents();

        function firstName(name) {
            try {
                var nameString = name;
                if (name.split(' ').length > 0) {
                    nameString = name.split(' ')[0];
                }
                return nameString;
            } catch (e) {
                return name;
            }
        }

        function lastName(name) {
            try {
                var nameString = name;
                if (name.split(' ').length > 1) {
                    nameString = name.split(' ')[1];
                }
                return nameString;
            } catch (e) {
                return name;
            }
        }

        function setUserCredentials() {
            try {
                var user = AuthService.getUserInfo();
                //the api is different for the javascript web sdk and the cordova native sdk
                if (AppIdentity.isWebApp()) {
                    var kahunaUserCredentials = Kahuna.createUserCredentials();
                    kahunaUserCredentials.add(kahunaUserCredentials.USERNAME_KEY, user.email);
                    kahunaUserCredentials.add(kahunaUserCredentials.EMAIL_KEY, user.email);
                    Kahuna.login(kahunaUserCredentials);
                } else {
                    var credentials = KahunaUserCredentials();
                    credentials.addUserCredential(KahunaUserCredentials().USERNAME_KEY, user.email);
                    credentials.addUserCredential(KahunaUserCredentials().EMAIL_KEY, user.email);
                    Kahuna.login(credentials);
                }
            } catch (e) {
                $log.info(e);
            }
        }

        function setUserAttributes() {
            try {
                var user = AuthService.getUserInfo();
                var attributes = {};
                attributes["first_name"] = firstName(user.name);
                attributes["last_name"] = lastName(user.name);
                attributes["guest_account"] = user.guest_account;
                attributes["metro_id"] = user.metro_id;
                attributes["metro"] = user.metro.name;
                Kahuna.setUserAttributes(attributes);
            } catch (e) {
                // $log.info(e);
            }
        }
    }
})();
'use strict';

/**
 * Created by Shipt
 */

(function () {
    'use strict';

    angular.module('common').factory('LogService', ['$log', LogService]);

    function LogService($log) {

        var service = {
            info: logInfo,
            debug: logDebug,
            critical: logCritical,
            error: logError,
            errorLog: logError,
            warning: logWarning,
            configUserLogInfo: configureRollbarLog
        };

        return service;

        function logInfo(object) {
            try {
                $log.info(object);
                if (Rollbar && document.location.hostname != "localhost") {
                    Rollbar.info(object);
                }
            } catch (exception) {}
        }

        function logDebug(object) {
            try {
                $log.debug(object);
                if (Rollbar && document.location.hostname != "localhost") {
                    Rollbar.debug(object);
                }
            } catch (exception) {}
        }

        function logCritical(object) {
            try {
                $log.error(object);
                if (Rollbar && document.location.hostname != "localhost") {
                    Rollbar.critical(object);
                }
            } catch (exception) {}
        }

        function logError(object) {
            try {
                $log.error(object);
                if (Rollbar && document.location.hostname != "localhost") {
                    Rollbar.error(object);
                }
            } catch (exception) {}
        }

        function logWarning(object) {
            try {
                $log.warn(object);
                if (Rollbar && document.location.hostname != "localhost") {
                    Rollbar.warning(object);
                }
            } catch (exception) {}
        }

        function configureRollbarLog(userInfo) {
            try {
                if (userInfo && document.location.hostname != "localhost") {
                    Rollbar.configure({
                        payload: {
                            person: {
                                id: userInfo.id,
                                username: userInfo.name,
                                email: userInfo.email
                            }
                        }
                    });
                }
            } catch (exception) {}
        }
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('common').factory('NetworkConnectionService', ['LogService', '$cordovaNetwork', '$log', NetworkConnectionService]);

    function NetworkConnectionService(LogService, $cordovaNetwork, $log) {

        //This service will encapsulate all the complicated api calls that are needed to check online or offline status
        var service = {
            isOnline: networkIsOnline,
            isOffline: networkIsOffline
        };

        return service;

        function networkIsOnline() {
            try {
                if (navigator.connection) {
                    return $cordovaNetwork.isOnline();
                } else {
                    return navigator.onLine;
                }
            } catch (exception) {
                $log.error(['networkIsOnline', exception]);
                return true;
            }
        }

        function networkIsOffline() {
            try {
                if (navigator.connection) {
                    return $cordovaNetwork.isOffline();
                } else {
                    return !navigator.onLine;
                }
            } catch (exception) {
                $log.error(['networkIsOffline', exception]);
                return false;
            }
        }
    }

    angular.module('common').directive('offlineMessage', function () {
        return {
            restrict: 'EA',
            require: ['offlineMessage'],
            scope: {
                readonly: '=?',
                onHover: '&',
                onLeave: '&'
            },
            controller: 'OfflineMessageController',
            template: '<div ng-if="isOffline()" class="offline-alert"><h2><i class="icon ion-alert-circled"></i><br/>Offline</h2></div>',
            replace: true,
            link: function link(scope, element, attrs, ctrls) {
                var ngModelCtrl, ratingCtrl;
                ratingCtrl = ctrls[0];
                ngModelCtrl = ctrls[1];
                if (ngModelCtrl) {
                    return ratingCtrl.init(ngModelCtrl);
                }
            }
        };
    });

    angular.module('common').controller('OfflineMessageController', ['$scope', '$attrs', 'NetworkConnectionService', function ($scope, $attrs, NetworkConnectionService) {
        $scope.isOffline = function () {
            return NetworkConnectionService.isOffline();
        };
    }]);
})();
'use strict';

angular.module('common').factory('OpenUrlService', ['$log', '$location', '$rootScope', '$ionicHistory', function ($log, $location, $rootScope, $ionicHistory) {

    var openUrl = function openUrl(url) {
        //   window.alert('Opening URL ' + url);
        if (url) {
            url = decodeURIComponent(url);
            url = url.substr(url.indexOf("#") - 1, url.length - 1);
            /*
            between # --> # is the url.
            then there is the action after that.
            */

            setTimeout(function () {
                var hashToSendTo = url.substr(url.indexOf("#"), url.lastIndexOf("#"));
                var action = url.substr(url.lastIndexOf("#") + 1);
                // $rootScope.$broadcast('handleopenurl', url);
                $rootScope.$emit('handleOpenUrl.action.' + action);
                window.location.hash = hashToSendTo;
            }, 500);

            window.cordova.removeDocumentEventHandler('handleopenurl');
            window.cordova.addStickyDocumentEventHandler('handleopenurl');
            document.removeEventListener('handleopenurl', handleOpenUrl);
        }
    };

    var handleOpenUrl = function handleOpenUrl(e) {
        // Check for the CustomEvent detail field for testing.
        // Difficult to trigger cordova events under test
        var url = e.url || e.detail.url;
        openUrl(url);
    };

    var onResume = function onResume() {
        //window.alert('On resume handle url');
        document.addEventListener('handleopenurl', handleOpenUrl, false);
    };

    return {
        handleOpenUrl: handleOpenUrl,
        onResume: onResume,
        openUrl: openUrl
    };
}]);
'use strict';

/**
 * Created by Shipt
 */

(function () {
    'use strict';

    angular.module('common').factory('PhotoService', ['$http', '$q', '$log', 'ApiEndpoint', 'UIUtil', '$cordovaFileTransfer', 'LogService', 'AuthService', 'DefaultHeaders', PhotoService]);

    function PhotoService($http, $q, $log, ApiEndpoint, UIUtil, $cordovaFileTransfer, LogService, AuthService, DefaultHeaders) {

        var service = {
            savePhoto: savePhoto
        };

        return service;

        function savePhoto(imageURI) {
            var defer = $q.defer();
            var url = ApiEndpoint.photoUploadUrl;
            DefaultHeaders.shopper();
            try {
                var options = {
                    fileKey: "photo[data]",
                    fileName: "abc123" + ".png",
                    chunkedMode: false,
                    mimeType: "image/png"
                };

                $log.debug('uploadFile url', url);
                $log.debug('uploadFile options', options);

                $cordovaFileTransfer.upload(url, imageURI, options, true).then(function (result) {
                    var response = JSON.parse(result.response);
                    $log.debug('upload file resp', response);
                    defer.resolve(response.id);
                }, function (error) {
                    $log.error(error);
                    defer.reject(error);
                });
            } catch (exception) {
                defer.reject(exception);
            }

            return defer.promise;
        }
    }
})();
'use strict';

/**
 * Created by SHIPT
 */

(function () {
    'use strict';

    angular.module('common').factory('PlacesAutocomplete', ['$http', '$q', '$log', 'ApiEndpoint', 'AuthService', 'Geolocator', 'LogService', PlacesAutocomplete]);

    function PlacesAutocomplete($http, $q, $log, ApiEndpoint, AuthService, Geolocator, LogService) {

        var service = {
            searchText: search,
            reverseGeolocationSearch: reverseGeolocationSearch,
            getReverseGeoAddress: getReverseGeoAddress,
            getPlaceDetails: getPlaceDetails,
            parseResult: getResult
        };

        return service;

        function reverseGeolocationSearch(lat, long) {
            var url = "";
            if (document.location.hostname != "localhost" || webVersion == true) {
                url = "https://maps.googleapis.com";
            } else {
                url = "http://localhost:8100/googleapis";
            }
            url += "/maps/api/geocode/json";
            var latLong = lat + "," + long;
            var request = {
                method: 'GET',
                url: url,
                params: {
                    latlng: latLong,
                    key: GOOGLE_PLACES_API_KEY
                }
            };
            var defer = $q.defer();
            LogService.info('calling google reverseGeolocationSearch lat long: ' + latLong);
            if (!webVersion) {
                $http(request).success(function (data) {
                    //success
                    LogService.info('google reverseGeolocationSearch', data);
                    defer.resolve(data);
                }).error(function (error) {
                    LogService.error('google reverseGeolocationSearch', error);
                    //error
                    defer.reject(error);
                });
            } else {
                var googleGeocoder = new google.maps.Geocoder();
                var latlng = { lat: parseFloat(lat), lng: parseFloat(long) };
                googleGeocoder.geocode({ location: latlng }, function (data) {
                    data = {
                        results: data
                    };
                    $log.info(data);
                    defer.resolve(data);
                });
            }
            return defer.promise;
        }

        function getPlaceDetails(place) {
            var url = "";
            if (document.location.hostname != "localhost" || webVersion == true) {
                url = "https://maps.googleapis.com";
            } else {
                url = "http://localhost:8100/googleapis";
            }
            url += "/maps/api/place/details/json";
            var request = {
                method: 'GET',
                url: url,
                params: {
                    reference: place.reference,
                    key: GOOGLE_PLACES_API_KEY
                }
            };
            var defer = $q.defer();
            LogService.info('calling google places api ' + request.url);
            if (!webVersion) {
                $http(request).success(function (data) {
                    //success
                    LogService.info('google places api success', data);
                    defer.resolve(data);
                }).error(function (error) {
                    LogService.error('google places apierror', error);
                    //error
                    defer.reject(error);
                });
            } else {
                var request = {
                    placeId: place.place_id
                };
                var placeService = new google.maps.places.PlacesService(document.createElement('div'));
                placeService.getDetails(request, function (data) {
                    $log.info(data);
                    defer.resolve(data);
                });
            }
            return defer.promise;
        }

        function search(text) {
            $log.info('searchquery: ' + text);
            var url = "";
            if (document.location.hostname != "localhost" || webVersion == true) {
                url = "https://maps.googleapis.com";
            } else {
                url = "http://localhost:8100/googleapis";
            }
            url += "/maps/api/place/autocomplete/json";
            var request = {
                method: 'GET',
                url: url,
                params: {
                    input: text,
                    key: GOOGLE_PLACES_API_KEY
                }
            };
            var defer = $q.defer();
            LogService.info('calling google places api ' + request.url);
            if (!webVersion) {
                $http(request).success(function (data) {
                    //success
                    LogService.info('google places api success', data);
                    defer.resolve(data);
                }).error(function (error) {
                    LogService.error('google places apierror', error);
                    //error
                    defer.reject(error);
                });
            } else {
                var autocomplete = new google.maps.places.AutocompleteService();
                autocomplete.getQueryPredictions({
                    input: text
                }, function (data) {
                    data = {
                        predictions: data
                    };
                    $log.info(data);
                    defer.resolve(data);
                });
            }
            return defer.promise;
        }

        function getReverseGeoAddress(lat, long) {
            var defer = $q.defer();
            reverseGeolocationSearch(lat, long).then(function (data) {
                $log.info('results', data);
                $log.info('first result', data.results[0]);
                var address = getResult(data.results[0]);
                defer.resolve(address);
            }, function () {});
            return defer.promise;
        };

        function getResult(result) {
            try {
                if (result.other) {
                    return null;
                } else {
                    var place = result;
                    if (place.address_components) {
                        var placeDetails = { result: place };
                        var address = parsePlace(placeDetails);
                        return address;
                    } else {
                        getPlaceDetails(place).then(function (placeDetails) {
                            var address = parsePlace(placeDetails);
                            return address;
                        }, function (error) {
                            return null;
                        });
                    }
                }
            } catch (e) {
                $log.error(e);
            }
        }

        function parsePlace(place) {
            try {
                var address = {};
                var ourAddress = {};
                var addressForm = {
                    street_number: 'short_name',
                    route: 'long_name',
                    locality: 'long_name',
                    administrative_area_level_1: 'long_name',
                    postal_code: 'short_name'
                };
                var thePlace = place;
                if (!thePlace.result) {
                    thePlace = {
                        result: place
                    };
                }
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = thePlace.result.address_components[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var i = _step.value;

                        var addressType = i.types[0];
                        if (addressForm[addressType]) {
                            var val = i[addressForm[addressType]];
                            address[addressType] = val;
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                if (!address.street_number && !address.route) {
                    return null;
                }
                ourAddress.street1 = (address.street_number ? address.street_number : '') + ' ' + (address.route ? address.route : '');
                ourAddress.city = address.locality;
                ourAddress.state = address.administrative_area_level_1;
                ourAddress.zip_code = address.postal_code;
                return ourAddress;
            } catch (e) {
                $log.error(e);
                errorSoHandleAsManualEntry();
                return null;
            }
        }
    }
})();
'use strict';

/**
 * Created by SHIPT
 */

(function () {
    'use strict';

    angular.module('common').factory('ProductService', ['$http', '$q', '$log', 'ApiEndpoint', 'AuthService', 'DefaultHeaders', 'AlgoliaFinder', 'FeatureService', 'COMMON_FEATURE_TOGGLES', ProductService]);

    function ProductService($http, $q, $log, ApiEndpoint, AuthService, DefaultHeaders, AlgoliaFinder, FeatureService, COMMON_FEATURE_TOGGLES) {

        var service = {
            searchForShopperProducts: searchForShopperProducts,
            searchForGroceryProducts: searchForGroceryProducts,
            searchForFilterSortGroceryProducts: searchForFilterSortGroceryProducts,
            fuzzyMatchProductWithTermFilter: fuzzyMatchProductWithTermFilter
        };

        return service;

        function fuzzyMatchProductWithTermFilter(item, term) {
            try {
                if (item.addButton) {
                    return true;
                }
                if (!term) {
                    return true;
                }
                if (item.name.toLowerCase().indexOf(term.toLowerCase()) > -1 || item.brand_name.toLowerCase().indexOf(term.toLowerCase()) > -1) {
                    return true;
                }
                if ((item.name.toLowerCase() + ' ' + item.brand_name.toLowerCase()).indexOf(term.toLowerCase()) > -1) {
                    return true;
                }
                if ((item.brand_name.toLowerCase() + ' ' + item.name.toLowerCase()).indexOf(term.toLowerCase()) > -1) {
                    return true;
                }
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = item.categories[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var category = _step.value;

                        var lowerCatName = category.name.toLowerCase();
                        if (lowerCatName.indexOf(term.toLowerCase()) > -1) {
                            return true;
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                return false;
            } catch (e) {
                return true;
                $log.info('error in filter', e);
            }
        }

        function searchForShopperProducts(text, page) {
            DefaultHeaders.shopper();
            var url = ApiEndpoint.apiurl + "/api/v1/shopper/products/search.json";
            if (page) {
                var request = {
                    method: 'GET',
                    url: url,
                    params: {
                        q: text,
                        page: page
                    }
                };
            } else {
                var request = {
                    method: 'GET',
                    url: url,
                    params: {
                        q: text
                    }
                };
            }
            return shiptApiSearchForProducts(request);
        }

        /**
         * @ngdoc function
         * @name searchForGroceryProducts
         * @description search for products for customer app. uses feature toggle to determine wether to use shipt api search or algolia search
         *
         * @returns {Promise} a promise that resolves with search results
         */
        function searchForGroceryProducts(text, page) {
            if (FeatureService.getFeatureToggle(COMMON_FEATURE_TOGGLES.ALGOLIA_SEARCH_ENABLED)) {
                return AlgoliaFinder.searchTerm(text, page);
            } else {
                return getShiptApiGroceryAppSearchResults(text, page);
            }
        }

        /**
         * @ngdoc function
         * @name searchForFilteredGroceryProducts
         * @description Searches for filtered products in the member app.
         *
         * @param text The text to search.
         * @param page The page to look in.
         * @param facetFilters The facetFilters to apply.
         * @param indexName The algolia index that will be targeted in this search.
         * @returns {*} A promise.
         */
        function searchForFilterSortGroceryProducts(text) {
            var page = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
            var facetFilters = arguments[2];
            var indexName = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

            return AlgoliaFinder.searchTerm(text, page, facetFilters, indexName);
        }

        /**
         * @ngdoc function
         * @name getShiptApiGroceryAppSearchResults
         * @description Gets the search results from the shipt api.
         *
         * @param text to search
         * @param page the current page
         */
        function getShiptApiGroceryAppSearchResults(text, page) {
            DefaultHeaders.customer();
            var query = encodeURIComponent(text);
            if (page) {
                page += 1;
            } else {
                page = 1;
            }
            var url = ApiEndpoint.apiurl + "/api/v1/products/search/" + query + ".json";
            var request = {
                method: 'GET',
                url: url,
                params: {
                    page: page
                }
            };
            return shiptApiSearchForProducts(request);
        }

        function shiptApiSearchForProducts(request) {
            var defer = $q.defer();
            $http(request).success(function (data) {
                //success
                defer.resolve(data);
            }).error(function (error) {
                $log.error('error', error);
                defer.reject(error);
            });
            return defer.promise;
        }
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('common').factory('ReferralService', ['$http', '$q', '$log', 'LogService', 'AuthService', 'ApiEndpoint', '$rootScope', '$cordovaFileTransfer', '$ionicActionSheet', '$cordovaEmailComposer', 'UIUtil', '$cordovaSms', 'DefaultHeaders', ReferralService]);

    function ReferralService($http, $q, $log, LogService, AuthService, ApiEndpoint, $rootScope, $cordovaFileTransfer, $ionicActionSheet, $cordovaEmailComposer, UIUtil, $cordovaSms, DefaultHeaders) {

        DefaultHeaders.shopper();

        var service = {
            getCustomerCodes: getCustomerCodes,

            getShopperCodes: getShopperCodes,
            saveNewShopperCode: saveNewShopperCode
        };

        return service;

        function getShopperCodes() {
            var defer = $q.defer();
            var request = {
                method: 'GET',
                url: ApiEndpoint.apiurl + '/api/v1/shopper/referral_codes.json'
            };
            $http(request).success(function (data) {
                defer.resolve(data);
            }).error(function (error) {
                defer.reject(data);
            });
            return defer.promise;
        }

        function getCustomerCodes() {
            var defer = $q.defer();
            DefaultHeaders.customer();
            var request = {
                method: 'GET',
                url: ApiEndpoint.apiurl + '/api/v1/referral_codes.json'
            };
            $http(request).success(function (data) {
                defer.resolve(data);
            }).error(function (error) {
                defer.reject(data);
            });
            return defer.promise;
        }

        function saveNewShopperCode(code) {
            var defer = $q.defer();
            var request = {
                method: 'POST',
                url: ApiEndpoint.apiurl + '/api/v1/shopper/referral_codes.json',
                data: { code: code }
            };
            $http(request).success(function (data) {
                defer.resolve(data);
            }).error(function (error) {
                defer.reject(error);
            });
            return defer.promise;
        }
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('common').factory('Settings', ['$log', '$timeout', 'LogService', Settings]);

    function Settings($log, $timeout, LogService) {

        var service = {
            pushesWhileShopping: pushesWhileShopping,
            savePushesWhileShopping: savePushesWhileShopping
        };

        return service;

        function savePushesWhileShopping(pushesWhileShopping) {
            try {
                if (pushesWhileShopping != undefined) {
                    $log.info('savePushesWhileShopping pushesWhileShopping', pushesWhileShopping);
                    localStorage.setItem('setting.pushesWhileShopping', pushesWhileShopping);
                }
            } catch (e) {
                return true;
            }
        }

        function pushesWhileShopping() {
            try {
                var p = localStorage.getItem('setting.pushesWhileShopping');
                $log.info('get pushesWhileShopping', p);
                if (!p) {
                    return true;
                } else {
                    p = JSON.parse(p);
                    return p;
                }
            } catch (e) {
                return true;
            }
        }
    }
})();
'use strict';

/**
 * Created by Shipt
 */

(function () {
    'use strict';

    angular.module('common').factory('SharingService', ['$cordovaSocialSharing', '$q', 'UIUtil', '$http', SharingService]);

    function SharingService($cordovaSocialSharing, $q, UIUtil, $http) {

        var service = {
            shareNativeShareSheet: shareNativeShareSheet,
            shareTwitter: shareTwitter,
            shareFacebook: shareFacebook,
            shareViaEmail: shareViaEmail,
            shareSMS: shareSMS
        };

        return service;

        function shareNativeShareSheet(message, subject, file, link) {
            if ('cordova' in window) {
                $cordovaSocialSharing.share(message, subject, file, link) // Share via native share sheet
                .then(function (result) {
                    // Success!
                }, function (err) {
                    // An error occured. Show a message to the user
                });
            } else {
                var send = ""; //link ? link : message;
                // if(message) {
                //     send += message;
                // }
                if (link) {
                    send += link;
                }
                UIUtil.showSocailShareUrl(send);
            }
        }

        function shareTwitter(message, image, link) {
            if ('cordova' in window) {
                $cordovaSocialSharing.shareViaTwitter(message, image, link).then(function (result) {
                    // Success!
                }, function (err) {
                    // An error occurred. Show a message to the user
                });
            }
        }

        function shareFacebook(message, image, link) {
            if ('cordova' in window) {
                $cordovaSocialSharing.shareViaFacebook(message, image, link).then(function (result) {
                    // Success!
                }, function (err) {
                    // An error occurred. Show a message to the user
                });
            }
        }

        function shareSMS(message, number) {
            $cordovaSocialSharing.shareViaSMS(message, number).then(function (result) {
                // Success!
            }, function (err) {
                // An error occurred. Show a message to the user
            });
        }

        function shareViaEmail(message, subject, toArr, ccArr, bccArr, file) {
            $cordovaSocialSharing.shareViaEmail(message, subject, toArr, ccArr, bccArr, file).then(function (result) {
                // Success!
            }, function (err) {
                // An error occurred. Show a message to the user
            });
        }
    }
})();
'use strict';

(function () {
    'use strict';

    var serviceId = 'ShiptLogItemsService';

    angular.module('common').factory(serviceId, ['$http', '$q', '$log', 'ApiEndpoint', 'UIUtil', 'LogService', 'AuthService', 'DefaultHeaders', ShiptLogItemsService]);

    function ShiptLogItemsService($http, $q, $log, ApiEndpoint, UIUtil, LogService, AuthService, DefaultHeaders) {

        var service = {
            incrementLogItem: incrementLogItem,
            logInfo: logInfo
        };

        return service;

        function addDefaultHeaders() {
            DefaultHeaders.customer();
        }

        function incrementLogItem(type, event, key) {
            var deferred = $q.defer();
            addDefaultHeaders();
            var req = {
                method: 'POST',
                url: ApiEndpoint.apiurl + '/api/v1/log_items/increment_count.json',
                data: {
                    type: type,
                    event: event,
                    key: key
                }
            };

            $http(req).success(function (data) {
                LogService.info(['Success log_items/increment_count', data]);
                deferred.resolve(data);
            }).error(function (error) {
                LogService.error(['Error log_items/increment_count', error]);
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function logInfo(type, event, data) {
            var deferred = $q.defer();
            addDefaultHeaders();
            var req = {
                method: 'POST',
                url: ApiEndpoint.apiurl + '/api/v1/log_items/log_info.json',
                data: {
                    type: type,
                    event: event,
                    info: data
                }
            };

            $http(req);
            deferred.resolve();
            return deferred.promise;
        }
    }
})();
'use strict';

/**
 * Created by Shipt
 */

(function () {
    'use strict';

    angular.module('common').factory('UIUtil', ['$ionicLoading', '$cordovaDialogs', '$ionicPopup', '$q', '$timeout', UIUtil]);

    function UIUtil($ionicLoading, $cordovaDialogs, $ionicPopup, $q, $timeout) {

        var service = {
            showLoading: showLoading,
            hideLoading: hideLoading,
            showAlert: showAlert,
            showConfirm: showConfirm,
            showYesNoConfirm: showYesNoConfirm,
            showErrorAlert: showErrorAlert,
            showMultiErrorAlert: showMultiErrorAlert,
            promptForInput: promptForInput,
            promptForNumber: promptForNumber,
            showWarningAlertMessage: showWarningAlertMessage,
            showInfoAlertMessage: showInfoAlertMessage,
            showSocailShareUrl: showSocailShareUrl,
            promptForProductWeightInput: promptForProductWeightInput,
            showPromptAfterLowRatingShopper: showPromptAfterLowRatingShopper
        };

        return service;

        function showLoading(loadingMessage) {
            var message = loadingMessage ? loadingMessage : 'Loading...';
            $ionicLoading.show({
                template: "<ion-spinner></ion-spinner><br/>" + message
            });
        }

        function showPromptAfterLowRatingShopper() {
            showAlert('Thank you for rating your Shipt Shopper', 'Since you did not have a great experience with this shopper we will not offer any orders that you place in the future to them. ' + '<br/>' + '<br/>' + 'This is in an effort to provide a great and consistent experience on every Shipt order you place!', 'Close', 'button-positive button-clear strong');
        }

        function hideLoading() {
            $ionicLoading.hide();
        }

        function showAlert(title, message, buttonText, buttonClass) {
            buttonText = buttonText ? buttonText : 'OK';
            buttonClass = buttonClass ? buttonClass : 'button-positive';
            if (window.cordova) {
                return $cordovaDialogs.alert(message, title, 'OK');
            } else {
                return $ionicPopup.alert({
                    title: title,
                    template: message,
                    okText: buttonText,
                    okType: buttonClass
                });
            }
        }

        function showYesNoConfirm(title, message, yesText, noText) {
            var deferred = $q.defer();
            yesText = yesText || "Yes";
            noText = noText || "No";
            if (window.cordova) {
                $cordovaDialogs.confirm(message, title, [yesText, noText]).then(function (buttonIndex) {
                    // 'OK' = 1, 'Cancel' = 2
                    var result = buttonIndex == 1;
                    deferred.resolve(result);
                });
            } else {
                var myPopup = $ionicPopup.show({
                    template: message,
                    title: title,
                    buttons: [{ text: noText,
                        onTap: function onTap(e) {
                            deferred.resolve(false);
                        }

                    }, {
                        text: '<b>' + yesText + '</b>',
                        type: 'button-positive',
                        onTap: function onTap(e) {
                            deferred.resolve(true);
                        }
                    }]
                });
            }
            return deferred.promise;
        }

        function showConfirm(title, message) {
            var deferred = $q.defer();
            if (window.cordova) {
                $cordovaDialogs.confirm(message, title, ['OK', 'Cancel']).then(function (buttonIndex) {
                    // 'OK' = 1, 'Cancel' = 2
                    var result = buttonIndex == 1;
                    deferred.resolve(result);
                });
            } else {
                var confirmPopup = $ionicPopup.confirm({
                    title: title,
                    template: message
                });
                confirmPopup.then(function (res) {
                    deferred.resolve(res);
                });
            }
            return deferred.promise;
        }

        function showErrorAlert(message) {
            if (window.cordova) {
                return $cordovaDialogs.alert(message, 'Error', 'OK');
            } else {
                return $ionicPopup.alert({
                    title: "<i  class='icon ion-alert-circled tax-pop-icon'></i>",
                    template: message
                });
            }
        }

        /**
         * @ngdoc function
         * @name showMultiErrorAlert
         * @description Allows for the display of multiple error messages in a single modal.
         *
         * @param errorMessages {Array} The array of error messages to build into a single error message template.
         */
        function showMultiErrorAlert(errorMessages) {
            var multiErrorMessage = '';
            if (_.isArray(errorMessages)) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = errorMessages[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var message = _step.value;

                        multiErrorMessage += message + '<br><br>';
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                showErrorAlert(multiErrorMessage);
            } else {
                showErrorAlert(errorMessages);
            }
        }

        function showWarningAlertMessage(message) {
            var alertPopup = $ionicPopup.alert({
                title: "<i  class='icon ion-alert-circled warning-pop-icon'></i>",
                template: "<div class='text-center'>" + message + "</div>"
            });
            return alertPopup;
        }

        function showInfoAlertMessage(message) {
            var alertPopup = $ionicPopup.alert({
                title: "<i  class='icon ion-ios-information-outline warning-pop-icon'></i>",
                template: "<div class='text-center'>" + message + "</div>"
            });
            return alertPopup;
        }

        function promptForProductWeightInput($scope) {
            $scope = $scope;
            var deferred = $q.defer();
            $scope.data.popupWeightInput = null;
            var template = "<label class='item item-input'>" + '<input size="font-size: 100%;" type="tel" ui-number-mask="2" placeholder="0.00"  ng-model="data.popupWeightInput">' + "</label>";
            var myPopup = $ionicPopup.show({
                template: template,
                title: 'Product Weight',
                subTitle: 'What is the weight of this product?',
                scope: $scope,
                buttons: [{ text: 'Cancel' }, {
                    text: '<b>' + 'Save Weight' + '</b>',
                    type: 'button-positive',
                    onTap: function onTap(e) {
                        if (!$scope.data.popupWeightInput) {
                            e.preventDefault();
                        } else {
                            deferred.resolve(angular.copy($scope.data.popupWeightInput));
                        }
                    }
                }]
            });

            return deferred.promise;
        }

        function promptForNumber(title, message, buttonText, placeholder) {

            var deferred = $q.defer();
            if (!placeholder) {
                placeholder = '';
            }
            $ionicPopup.prompt({
                title: title,
                template: message,
                inputType: 'number',
                inputPlaceholder: placeholder
            }).then(function (res) {
                console.log('Your input is', res);
                if (!res) {
                    deferred.reject(res);
                } else {
                    deferred.resolve(res);
                }
            });

            return deferred.promise;
        }

        function promptForInput(title, message, buttonText) {
            var deferred = $q.defer();

            if (window.cordova) {
                $cordovaDialogs.prompt(message, title, ['Cancel', buttonText]).then(function (response) {
                    if (response.buttonIndex == 2) {
                        deferred.resolve(response.input1);
                    } else {
                        defer.reject();
                    }
                });
            } else {
                var response = prompt(title + '\n\n' + message);
                deferred.resolve(response);
            }
            return deferred.promise;
        }

        function showSocailShareUrl(link) {
            var alertPopup = $ionicPopup.alert({
                title: "Share This Link!",
                cssClass: "share-popup",
                template: "<p>The URL to share is below. Copy it to easily share with friends.</p><label class='item item-input'>" + "<input id='shareUrlTextInput' type='text'  value='" + link + "'>" + "</label>"
            });
            $timeout(function () {
                var element1 = angular.element("#shareUrlTextInput");
                element1.select();
            }, 100);
        }
    }
})();
'use strict';

/**
 * Created by Shipt
 */

(function () {
    'use strict';

    angular.module('common').factory('VersionProvider', ['$http', 'AuthService', '$cordovaAppVersion', '$q', 'LogService', '$log', '$ionicModal', 'ApiEndpoint', VersionProvider]);

    function VersionProvider($http, AuthService, $cordovaAppVersion, $q, LogService, $log, $ionicModal, ApiEndpoint) {

        var service = {
            getPlatformName: getPlatformName,
            checkShopperAppVersionForUpdates: checkShopperAppVersionForUpdates,
            getVersionObject: getVersionObject,
            version: version,
            getVersionString: getVersion,
            addVersionToHeaders: addVersionToDefaultHeaders
        };

        addVersionToDefaultHeaders();

        return service;

        function addVersionToDefaultHeaders() {
            getVersion().then(function (versionString) {
                $http.defaults.headers.common['X-Shipt-App-Version'] = versionString;
            });
        }

        function checkShopperAppVersionForUpdates() {
            var q = $q.defer();
            service.getVersionObject().then(function (version) {
                var url = ApiEndpoint.apiurl + "/api/v1/shopper/shopper/check_shopper_app_version.json";
                var request = {
                    method: 'POST',
                    url: url,
                    data: version
                };
                $http(request).success(function (data) {
                    q.resolve(data.is_valid);
                }).error(function (error) {
                    q.resolve(true);
                });
            });
            return q.promise;
        }

        function getVersionNumber() {
            var q = $q.defer();
            if ('cordova' in window) {
                try {
                    document.addEventListener("deviceready", function () {
                        cordova.getAppVersion.getVersionNumber(function (version) {
                            q.resolve(version);
                        });
                    }, false);
                } catch (exception) {
                    LogService.critical(['getVersionNumber', exception]);
                }
            } else {
                q.resolve('0');
            }
            return q.promise;
        }

        function getBuildNumber() {
            var q = $q.defer();
            if ('cordova' in window) {
                try {
                    document.addEventListener("deviceready", function () {
                        cordova.getAppVersion.getVersionCode(function (code) {
                            q.resolve(code);
                        });
                    }, false);
                } catch (exception) {
                    LogService.critical(['getBuildNumber', exception]);
                }
            } else {
                q.resolve('0');
            }
            return q.promise;
        }

        function getVersion() {
            var q = $q.defer();
            try {
                var versionGet = getVersionNumber();
                var buildGet = getBuildNumber();
                $q.all([versionGet, buildGet]).then(function (result) {
                    var version = result[0];
                    var build = result[1];
                    $log.info(version + '(' + build + ')');
                    q.resolve(version + '(' + build + ')');
                }, function () {
                    q.reject();
                });
                return q.promise;
            } catch (e) {
                q.reject();
                return q.promise;
            }
        }

        function version() {
            this.platform = null;
            this.platformVersion = null;
            this.version = null;
            this.build = null;
            this.app = null;
        }

        function getVersionObject() {
            var q = $q.defer();
            var versionGet = getVersionNumber();
            var buildGet = getBuildNumber();
            $q.all([versionGet, buildGet]).then(function (result) {
                var version = new service.version();
                version.version = result[0];
                version.build = result[1];
                version.platform = ionic.Platform.platform();
                version.platformVersion = ionic.Platform.version();
                $log.info(['Version Info', version]);
                q.resolve(version);
            });
            return q.promise;
        }

        function getPlatformName() {
            try {
                var deviceInformation = ionic.Platform.device();
                $log.info(deviceInformation);

                var isIPad = ionic.Platform.isIPad();
                var isIOS = ionic.Platform.isIOS();
                var isAndroid = ionic.Platform.isAndroid();

                if (webVersion) {
                    // <-- variable that is set in the view on the web version of the app
                    return 'web';
                }
                if (isIPad) {
                    return 'ipad';
                }
                if (isIOS) {
                    return 'ios';
                }
                if (isAndroid) {
                    return 'android';
                }
            } catch (e) {
                $log.error(['error :: getPlatform', e]);
                return '';
            }
        }
    }
})();
'use strict';

(function () {
  'use strict';

  /**
   * @ngdoc module
   * @name common.inAppMessage
   * @description Defines the module and dependencies for in app messaging to be displayed
   *   in both shopper and grocery apps.
   */

  angular.module('common.inAppMessaging', []);
})();
'use strict';

(function () {
    'use strict';

    angular.module('common.inAppMessaging')

    /**
     * @ngdoc function
     * @name InAppMessageController
     * @description Handles the logic and functionality for an in app message.
     */
    .controller('InAppMessageController', ['$rootScope', '$scope', 'IN_APP_MESSAGE', InAppMessageController]);

    function InAppMessageController($rootScope, $scope, IN_APP_MESSAGE) {

        /**
         * Defines various events to be broadcast from the call to action.
         */
        $scope.events = {
            openChooseStoreModal: IN_APP_MESSAGE.EVENTS.OPEN_CHOOSE_STORE_MODAL
        };

        /**
         * Defines the message types so the UI can display the proper call to action.
         */
        $scope.inAppMessageTypes = {
            newStoreAnnouncement: IN_APP_MESSAGE.TYPES.NEW_STORE_ANNOUNCEMENT,
            acknowledgement: IN_APP_MESSAGE.TYPES.ACKNOWLEDGEMENT
        };

        /**
         * Close the modal
         */
        $scope.closeModal = function () {
            $scope.modal.hide();
            $scope.inAppMessage.callback();
        };

        /**
         * Clean up the modal when we're done with it.
         */
        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });

        /**
         * @ngdoc function
         * @name callToAction
         * @description Runs when the primary call to action is enacted from within the in app message.
         *
         * @param messageType The type of in app message. Useful for knowing which functionality to invoke.
         */
        $scope.callToAction = function (messageType) {
            $scope.closeModal();

            // Based on the type of in app message in scope, perform the correct call to action
            switch (messageType) {
                case IN_APP_MESSAGE.TYPES.NEW_STORE_ANNOUNCEMENT:
                    $rootScope.$broadcast(IN_APP_MESSAGE.EVENTS.OPEN_CHOOSE_STORE_MODAL);
                    break;
                case IN_APP_MESSAGE.TYPES.ACKNOWLEDGEMENT:
                    // Nothing needed here, just closing the modal
                    break;
                default:
                    break;
            }
        };
    }
})();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
    'use strict';

    angular.module('common.inAppMessaging')

    /**
     * @ngdoc service
     * @name inAppMessage
     * @description Handles the display and functionality for an in app message.
     *
     * @author Connor Eggleston
     */
    .factory('inAppMessage', ['$rootScope', '$ionicModal', '$log', function ($rootScope, $ionicModal, $log) {
        var InAppMessage = function () {

            /**
             * @ngdoc function
             * @name constructor
             * @description Constructs the model for an in app message provided from 3rd party service.
             *
             * @param messageData The message data returned from the 3rd party service.
             */
            function InAppMessage(messageData) {
                _classCallCheck(this, InAppMessage);

                this.imageUrl = messageData.parameters.image_url;
                this.title = messageData.message;
                this.content = messageData.parameters.message_body;
                this.messageType = messageData.parameters.type;
                this.template = this.getTemplate(messageData.parameters.type) || null;
            }

            /**
             * @ngdoc function
             * @name getTemplate
             * @description Returns the correct template for the desired in app message.
             *
             * @param type The type of in app message that will be displayed.
             * @returns {String} The path of the modal to display.
             */


            _createClass(InAppMessage, [{
                key: 'getTemplate',
                value: function getTemplate(type) {
                    return {
                        newStoreAnnouncement: 'templates/inAppMessageModal.html',
                        acknowledgement: 'templates/inAppMessageModal.html'
                    }[type] || 'templates/inAppMessageModal.html';
                }
            }]);

            return InAppMessage;
        }();

        return {

            /**
             * @ngdoc function
             * @name show
             * @description Shows an in app message modal.
             *
             * @param callback The 3rd party function to run when the in app message has been acknowledged.
             * @param messageData The in app message data to display.
             */
            show: function show(messageData, callback) {
                var scope = $rootScope.$new();
                scope.inAppMessage = new InAppMessage(messageData);
                scope.inAppMessage.callback = callback;
                if (scope.inAppMessage.template) {
                    // Make sure we have a template to display
                    $ionicModal.fromTemplateUrl(scope.inAppMessage.template, {
                        scope: scope,
                        animation: 'slide-in-up',
                        backdropClickToClose: false,
                        hardwareBackButtonClose: false
                    }).then(function (modal) {
                        scope.modal = modal;
                        scope.modal.show();
                    });
                } else {
                    $log.error('Unable to display in app message template');
                }
            }

        };
    }]);
})();
'use strict';

(function () {
    'use strict';

    angular.module('common').controller('metroSelectModalController', ['$scope', '$rootScope', metroSelectModalController]);

    function metroSelectModalController($scope, $rootScope) {
        var viewModel = this;

        viewModel.cancel = function () {
            $scope.cancelModal();
        };

        viewModel.save = function (metro) {
            $scope.saveModal(metro);
        };

        viewModel.currentMetroId = $scope.currentMetroId;
        viewModel.metros = $scope.metros;
        viewModel.selectedMetro = null;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = viewModel.metros[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var metro = _step.value;

                if (metro.id == viewModel.currentMetroId) {
                    viewModel.selectedMetro = metro;
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('common').factory('metroSelectModalProvider', ['$rootScope', '$ionicModal', '$q', metroSelectModalProvider]);

    function metroSelectModalProvider($rootScope, $ionicModal, $q) {

        var metroModal = null;

        function getModal($scope) {
            var defer = $q.defer();
            var tpl = 'templates/metroSelectModal.html';
            $ionicModal.fromTemplateUrl(tpl, {
                scope: $scope,
                focusFirstInput: true
            }).then(function (modal) {
                metroModal = modal;
                defer.resolve(metroModal);
            });
            return defer.promise;
        }

        var init = function init($scope, currentMetroId, metros) {
            var defer = $q.defer();
            $scope = $scope || $rootScope.$new();
            $scope.currentMetroId = currentMetroId;
            $scope.metros = metros;
            getModal($scope).then(function (modal) {
                modal.show();
            });

            $scope.saveModal = function (metro) {
                defer.resolve(metro);
                metroModal.hide();
                metroModal.remove();
                metroModal = null;
            };
            $scope.cancelModal = function () {
                defer.reject();
                metroModal.hide();
                metroModal.remove();
                metroModal = null;
            };
            $scope.$on('$destroy', function () {
                if (metroModal) metroModal.remove();
            });

            return defer.promise;
        };

        return {
            showModal: init
        };
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('common').controller('TextNotesModalController', ['$scope', '$rootScope', TextNotesModalController]);

    function TextNotesModalController($scope, $rootScope) {
        var viewModel = this;

        viewModel.placeholder = "Instructions from you to the shopper about this product.";
        viewModel.text = "";

        viewModel.cancelNotes = function () {
            $scope.cancelModal();
        };

        viewModel.saveNotes = function () {
            $scope.saveModal(viewModel.text);
        };

        viewModel.title = $scope.title;
        viewModel.text = $scope.text;
        viewModel.placeholder = $scope.placeholder;
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('common').factory('TextNotesModalProvider', ['$rootScope', '$ionicModal', '$q', TextNotesModalProvider]);

    function TextNotesModalProvider($rootScope, $ionicModal, $q) {

        var textModal = null;

        function getModal($scope) {
            var defer = $q.defer();

            var tpl = 'templates/textNotesModal.html';
            $ionicModal.fromTemplateUrl(tpl, {
                scope: $scope,
                focusFirstInput: true
            }).then(function (modal) {
                textModal = modal;
                defer.resolve(textModal);
            });
            return defer.promise;
        }

        var init = function init($scope, title, placeholder, text) {
            var defer = $q.defer();
            $scope = $scope || $rootScope.$new();
            $scope.text = null;
            $scope.text = text;
            $scope.title = title;
            $scope.placeholder = placeholder;
            getModal($scope).then(function (modal) {
                modal.show();
            });

            $scope.saveModal = function (text) {
                defer.resolve(text);
                textModal.hide();
                textModal.remove();
                textModal = null;
            };
            $scope.cancelModal = function () {
                defer.reject();
                textModal.hide();
                textModal.remove();
                textModal = null;
            };
            $scope.$on('$destroy', function () {
                if (textModal) textModal.remove();
            });

            return defer.promise;
        };

        return {
            showModal: init
        };
    }
})();
'use strict';

angular.module('common').directive('ionSearchBar', ['$rootScope', '$timeout', '$q', '$log', '$cordovaKeyboard', 'UIUtil', 'AppAnalytics', 'FeatureService', 'COMMON_FEATURE_TOGGLES', 'FILTER_SORT', ionSearchBar]);

function ionSearchBar($rootScope, $timeout, $q, $log, $cordovaKeyboard, UIUtil, AppAnalytics, FeatureService, COMMON_FEATURE_TOGGLES, FILTER_SORT) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            searchValue: '=searchValue',
            showCancelButton: '=showCancelButton',
            startTouchIntoSearchBar: '&',
            search: '=?filter',
            ngModel: '=ngModel',
            searchFunction: '&',
            instantSearch: '=instantSearch',
            filterSortOptions: '=filterSortOptions',
            hideScanButton: '=hideScanButton'
        },
        link: function link(scope, element, attrs) {

            if (scope.hideScanButton === true) {
                scope.showScanButton = false;
            } else {
                scope.showScanButton = FeatureService.getFeatureToggle(COMMON_FEATURE_TOGGLES.BARCODE_SCAN_SEARCH);
            }

            scope.isAlgoliaFilterSortFeatureEnabled = FeatureService.getFeatureToggle(COMMON_FEATURE_TOGGLES.ALGOLIA_FILTER_SORT_ENABLED);
            scope.isInstantSearchEnabled = FeatureService.getFeatureToggle(COMMON_FEATURE_TOGGLES.ALGOLIA_INSTANT_SEARCH_ENABLED);

            if (scope.instantSearch && scope.isInstantSearchEnabled) {
                enableInstantSearch();
            }

            scope.placeholder = attrs.placeholder || '';
            scope.search = { value: '', focus: false };
            if (attrs.class) {
                element.addClass(attrs.class);
            }

            // We need the actual input field to detect focus and blur
            var inputElement = element.find('input')[0];
            var scannerOpen = false;

            scope.scanClick = function () {
                try {
                    AppAnalytics.track('search-barcode-scan-click');
                    var defer = $q.defer();
                    if (scannerOpen) {
                        defer.reject();
                        return defer.promise;
                    }
                    scannerOpen = true;
                    cordova.plugins.barcodeScanner.scan(function (result) {
                        scannerOpen = false;
                        if (!result.cancelled) {
                            AppAnalytics.track('search-barcode-scan-scanned', { upc: result.text });
                            scope.searchValue = result.text;
                            // We need to call `$apply()` because we manually changed the model
                            scope.$apply();
                            setTimeout(function () {
                                scope.formSubmit();
                            }, 500);
                            defer.resolve(result.text);
                        } else {
                            AppAnalytics.track('search-barcode-scan-cancelled');
                            defer.reject();
                        }
                    }, function (error) {
                        UIUtil.showAlert('Error', error);
                        scannerOpen = false;
                        defer.reject();
                    });
                    return defer.promise;
                } catch (e) {
                    scannerOpen = false;
                    UIUtil.showAlert('Barcode Scanner Not Available', '');
                    $log.error(e);
                }
            };

            scope.clearTextButtonClick = function () {
                $timeout(function () {
                    scope.searchValue = '';
                    AppAnalytics.track('clearTextButtonClick');
                    $rootScope.$broadcast(FILTER_SORT.EVENTS.CLEAR_FILTER);
                }, 100);
            };

            scope.shouldShowClearText = function () {
                if (scope.searchValue && scope.searchValue != "") {
                    return true;
                } else {
                    return false;
                }
            };

            scope.formSubmit = function (value) {
                if (scope.isAlgoliaFilterSortFeatureEnabled && scope.filterSortOptions && scope.filterSortOptions.isFilterSortActive()) {
                    $rootScope.$broadcast(FILTER_SORT.EVENTS.CLEAR_FILTER, { // Reset filter for new searches
                        refreshSearch: true,
                        searchTerm: value
                    });
                    // Ensure the facet filters and sorting are updated for the next instant search
                    if (value && value !== '') {
                        scope.filterSortOptions.extras.AlgoliaFinder.searchTermText = value;
                    }
                    scope.filterSortOptions.updateFilterSortSearchResults();
                } else {
                    if (scope.searchFunction) {
                        scope.searchFunction();
                    } else {
                        scope.$parent.searchSubmit();
                    }
                }
            };

            scope.startTouchSearchBar = function () {
                AppAnalytics.track('startTouchIntoSearchBar');
                scope.startTouchIntoSearchBar();
            };

            function enableInstantSearch() {
                $log.info('algolia instant search enabled');
                scope.$watch('searchValue', function (searchValue) {
                    if (searchValue) {
                        scope.formSubmit(searchValue);
                    } else {
                        // Make sure the filter is cleared when the search query is eliminated
                        $rootScope.$broadcast(FILTER_SORT.EVENTS.CLEAR_FILTER);
                    }
                });
            }

            // When the user focuses the search bar
            angular.element(inputElement).bind('focus', function () {
                // We store the focus status in the model to show/hide the Cancel button
                scope.search.focus = 1;
                // Add a class to indicate focus to the search bar and the content area
                element.addClass('search-bar-focused');
                angular.element(document.querySelector('.has-search-bar')).addClass('search-bar-focused');
                // We need to call `$digest()` because we manually changed the model
                scope.$digest();
            });

            // When the user leaves the search bar
            angular.element(inputElement).bind('blur', function (e) {
                try {
                    scope.search.focus = 0;
                    element.removeClass('search-bar-focused');
                    angular.element(document.querySelector('.has-search-bar')).removeClass('search-bar-focused');
                    $cordovaKeyboard.close();
                } catch (e) {}
            });
        },
        templateUrl: "templates/ionSearchBar.html"
    };
}
'use strict';

(function () {
    'use strict';

    angular.module('common').controller('ArticleController', ['$scope', '$stateParams', '$state', 'UIUtil', '$log', 'AccountService', 'HelpService', ArticleController]);

    function ArticleController($scope, $stateParams, $state, UIUtil, $log, AccountService, HelpService) {

        var viewModel = this;
        viewModel.question = undefined;
        viewModel.q = angular.fromJson($stateParams.q);

        function loadAnswer() {
            HelpService.getFaq(viewModel.q.id).then(function (data) {
                viewModel.question = data;
            });
        }

        loadAnswer();
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('common').controller('FaqController', ['$state', '$filter', 'HelpService', '$stateParams', FaqController]);

    function FaqController($state, $filter, HelpService, $stateParams) {

        var viewModel = this;
        viewModel.searchArticles = [];
        viewModel.searchQuery = "";
        viewModel.showSearch = false;

        viewModel.category = angular.fromJson($stateParams.category);

        function loadFaq() {
            viewModel.loadingSpinner = true;
            HelpService.getFaqsForCategory(viewModel.category.id).then(function (data) {
                viewModel.articles = data;
                viewModel.loadingSpinner = false;
            }, function (error) {
                viewModel.errorHappened = true;
                viewModel.loadingSpinner = false;
            });
        }

        viewModel.clearSearch = function () {
            viewModel.searchQuery = '';
        };

        viewModel.showList = function () {
            if (!viewModel.articles) return false;
            if (viewModel.articles.length < 1) return false;
            if ($filter('filter')(viewModel.articles, viewModel.searchQuery).length < 1) return false;
            return true;
        };

        viewModel.articleClick = function (article) {
            $state.go('app.faqArticle', { q: angular.toJson(article) });
        };

        loadFaq();
    }
})();