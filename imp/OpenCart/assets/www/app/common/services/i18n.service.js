'use strict';

/**
* @ngdoc service
* @name starter.i18nService
* @requires dataService
* @requires locale
* @requires RTL_LANGUAGES
* @description
* Contains methods related to translations and multiple language switching. 
*/
angular.module('starter')
    .service('i18nService', function ($rootScope, dataService, locale, $localStorage, $ionicHistory, RTL_LANGUAGES) {

        /**
        * @ngdoc function
        * @name starter.appService#SetLanguage
        * @methodOf starter.appService
        * @kind function
        * 
        * @param {string} lang Language code Ex. `en-US`
        * 
        * @description
        * Sets language of the OpenCart system to given locale. code parameter is expected in ISO standard language code, ex `en-US`
        * @returns {promise} Returns a promise
        */
        this.SetLanguage = function (lang) {
            if (!angular.isString(lang) || lang.length < 5) {
                lang = "en-US";
            }

            $localStorage.lang = lang;

            locale.setLocale(lang);

            lang = lang.trim();
            var i = lang.split("-");
            if (i.length > 1 && angular.isString(i[0]) && i[0].length) {
                if (i.length > 1 && angular.isString(i[0]) && i[0].length) {
                    if (RTL_LANGUAGES.indexOf(i[0]) !== -1) {
                        $rootScope.lang_dir = "rtl";
                        $rootScope.lang_animation = "slide-right-left";
                    } else {
                        $rootScope.lang_dir = "ltr";
                        $rootScope.lang_animation = "slide-left-right";
                    }
                }

                $ionicHistory.clearCache();

                // send a request to API
                return dataService.apiSecuredPost('/language/set', { code: i[0].toLowerCase() });
            }


            return $q.reject({ error: "invalid language code : " + lang });
        }
    });