'use strict';

/**
* @ngdoc directive
* @name starter.directive:languageSwitch
* @description
* Widget to render language switch. 
* @param {object} item Product object
* @example
<pre>
    <language-switch></language-switch>
</pre>
*/
angular.module('starter')
   .directive('languageSwitch', function () {
       return {
           scope: {},
           link: function (scope, element, attrs) {
               
           },
           controller: ['$scope', 'i18nService', '$localStorage', 'LANGUAGES', function ($scope, i18nService, $localStorage, LANGUAGES) {
               $scope.languages = LANGUAGES;
               $scope.language = $localStorage.lang ? $localStorage.lang : 'en-US'

               $scope.$watch('language', function (language) {
                   i18nService.SetLanguage(language);
               });
                             
           }],
           templateUrl: 'app/common/widgets/language-switch/language-switch-template.html'
       };
   });