'use strict';

/**
* @ngdoc directive
* @name shop.module.directive:itemRating
* @description
* Widget to render product reviews list and add new review sections. 
* @param {object} item Product object
* @example
<pre>
    <item-rating item="item"></item-rating>
</pre>
*/
angular.module('shop.module')
   .directive('itemRating', function ($ionicLoading) {
       return {
           scope: {
               item: "=item"
           },
           link: function (scope, element, attrs) {
               if (scope.item && scope.item.review_status)
                   scope.loadReviews(1);
               
               scope.ratingsSettings = {
                   iconOn: 'ion-ios-star',
                   iconOff: 'ion-ios-star-outline',
                   iconOnColor: '#387ef5',
                   iconOffColor: '#387ef5',
                   rating: scope.item.rating,
                   callback: function (rating) {
                       scope.ratingsCallback(rating);
                   }
               };
           },
           controller: ['$scope', 'ShopService', function ($scope, ShopService) {
               $scope.reviews = [];
               $scope.page = 1;
               $scope.rating = 0;
               $scope.review = {};
               $scope.review_added = false;
               $scope.success_message = "";

               $scope.loadReviews = function (page, append) {
                   $ionicLoading.show();
                   ShopService.GetProductReviews($scope.item.product_id, page).then(function (data) {
                       $scope.page = page;
                       
                       if (append) {
                           $scope.reviews = $scope.reviews.concat(data.reviews);
                       } else {
                           $scope.reviews = data.reviews;
                       }
                       $scope.text_no_reviews = data.text_no_reviews;
                       $ionicLoading.hide();
                   }, function () {
                       $ionicLoading.hide();
                   });
               }

               $scope.postReview = function () {
                   $ionicLoading.show();
                   
                   ShopService.AddProductReview($scope.item.product_id, $scope.review.name, $scope.rating, $scope.review.text).then(function (data) {
                       if (data.error) {
                           alert(data.error);
                       } else {
                           alert(data.success);
                           $scope.success_message = data.success;
                           $scope.review_added = true;
                       }
                       
                       $ionicLoading.hide();
                   }, function () {
                       $ionicLoading.hide();
                   });
               }

               $scope.loadNextPage = function () {
                   var p = $scope.page + 1;
                   $scope.loadReviews(p, true);
               }

               $scope.ratingsCallback = function (rating) {
                   $scope.rating = rating;
               };
              
           }],
           templateUrl: 'app/shop/widgets/item-rating/reviews-template.html'
       };
   });