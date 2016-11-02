
(function () {
    'use strict';

    angular.module('shiptApp').factory('MealKits', [
        '$http',
        '$log',
        '$q',
        '$timeout',
        'LogService',
        'AuthService',
        'ApiEndpoint',
        'DefaultHeaders',
        'ShoppingCartService',
        MealKits]);

        function MealKits($http,
                          $log,
                          $q ,
                          $timeout,
                          LogService,
                          AuthService,
                          ApiEndpoint,
                          DefaultHeaders,
                          ShoppingCartService) {

        var service = {
            getMealKits: getMealKits,
            addMealKitToCart: addMealKitToCart
        };

        function addMealKitToCart(mealKit) {
            ShoppingCartService.addProductToCart(mealKit);
        }

        function getMealKits() {
            try {
                var defer = $q.defer();
                $timeout(function(){
                    var mealKits = [
                        {
                            title: 'One Pot Vegetarian',
                            sub_title: 'One pot is all you need to create these satisfying and comforting meatless meals, all packed with hearty ingredients.',
                            title_image: 'http://cms.matchmakefood.com/media/1529/ingredient-landscape.jpg?preset=L',
                            serves_text: '14 Ingredients • 3 recipes for 2 to 10 people',
                            servings: [
                                {
                                    id: 3,
                                    description:  "3 Meals for 2 People",
                                    per_meal:  "$20 per meal",
                                    price: 37.19
                                },
                                {
                                    id: 534,
                                    description:  "5 Meals for 2 People",
                                    per_meal:  "$20 per meal",
                                    price: 57.19
                                },
                                {
                                    id: 333,
                                    description:  "9 Meals for 2 People",
                                    per_meal:  "$20 per meal",
                                    price: 97.19
                                }
                            ]
                        },
                        {
                            title: 'Miso and Soy',
                            sub_title: 'Who says you need to go out for Japanese food? Take a culinary tour of Japan from your kitchen with these popular dishes.',
                            title_image: 'http://cms.matchmakefood.com/media/1475/ingredients-landscape.jpg?preset=L',
                            serves_text: '20 Ingredients • 3 recipes for 2 to 10 people',
                            servings: [
                                {
                                    id: 666,
                                    description:  "3 Meals for 2 People",
                                    per_meal:  "$20 per meal",
                                    price: 657.19
                                },
                                {
                                    id: 55,
                                    description:  "5 Meals for 2 People",
                                    per_meal:  "$20 per meal",
                                    price: 1657.19
                                }
                            ]
                        },
                        {
                            title: 'Elegant Weeknight',
                            sub_title: 'Make 3 elegant, restaurant-worthy dinners at home - with ingredients like cod, steak, and polenta.',
                            title_image: 'http://cms.matchmakefood.com/media/1486/ingredients-landscape.jpg?preset=L',
                            serves_text: '14 Ingredients • 3 recipes for 2 to 10 people',
                            servings: [
                                {
                                    id: 88,
                                    description:  "3 Meals for 2 People",
                                    per_meal:  "$20 per meal",
                                    price: 257.19
                                },
                                {
                                    id: 9,
                                    description:  "5 Meals for 2 People",
                                    per_meal:  "$20 per meal",
                                    price: 1257.19
                                }
                            ]
                        }
                    ];
                    defer.resolve(mealKits)
                },1)
                return defer.promise;
            } catch (e) {

            }
        }

        return service;

    }
})();
