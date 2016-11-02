'use strict';

/**
* @ngdoc directive
* @name starter.directive:contactForm
* @description
* Widget to render contact us form.
* @example
<pre>
    <contact-form></contact-form>
</pre>
*/
angular.module('starter')
   .directive('contactForm', function () {
       return {
           scope: {},
           link: function (scope, element, attrs) {

           },
           controller: ['$scope', '$rootScope', 'InfoService', function ($scope, $rootScope, InfoService) {
               $scope.contact = {};
               $scope.contact.name = $rootScope.userObject() ? $rootScope.userObject().firstname : "";
               $scope.contact.email = $rootScope.userObject() ? $rootScope.userObject().email : "";

               $scope.email = $rootScope.email;
               $scope.phone = $rootScope.phone;

               $scope.postContactData = function () {
                   InfoService.PostContactForm($scope.contact.name, $scope.contact.email, $scope.contact.enquiry).then(function (data) {
                       $scope.contact = {};
                       $scope.sent = true;
                   })
               }
           }],
           templateUrl: 'app/common/widgets/contact-form/contact-form-template.html'
       };
   });