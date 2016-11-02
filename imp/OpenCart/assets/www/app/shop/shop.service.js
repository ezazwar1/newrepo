'use strict';

/**
* @ngdoc service
* @name shop.module.ShopService
* @requires ng.$q
* @requires dateService
* @description 
* Service contains methods to communicate with the API. All methods returns a `promise` object containing 
* the requested data. On a success response it returns the data from the server, and on an error the promise 
* rejects with the HTTP server response.
*/
angular
    .module('shop.module')
    .service('ShopService', function ($q, dataService) {

        /**
         * @ngdoc function
         * @name shop.module.ShopService#GetBannerById
         * @methodOf shop.module.ShopService
         * @kind function
         * 
         * @description
         * Gets banner images by banner id
         * 
         * @example
         <pre>
         ShopService.GetBannerById(1).then(function (data) {
                $scope.data.slides = data.banners;
         });
         </pre>
         Resolved Object
         <pre>
         {
            "banners": [{
                "title": "iPhone 6",
                "link": "#/app/menu/shop/item/24",
                "image": "full_image_path.jpg"
            }]
         }
         </pre>
         * 
         * @param {number} banner_id Banner id
         * @param {number} width Banner width. 1140px is default if left blank
         * @param {number} height Banner height. 380px is default if left blank
         * @returns {promise} Returns a promise of the API call.
         */
        this.GetBannerById = function (banner_id, width, height) {
            return dataService.apiSecuredPost('/design/banners', { id: banner_id, banenr_width: width, banner_height: height }).then(function (data) {
                if (data.banners) {
                    return data;
                } else {
                    return $q.reject(data);
                }
            });
        }

        /**
         * @ngdoc function
         * @name shop.module.ShopService#GetBanners
         * @methodOf shop.module.ShopService
         * @kind function
         * 
         * @description
         * Gets main banners configured in the system. Additional configuration is needed from
         * OpenCart i2CSMobile module end.
         * 
         * @example
         <pre>
         ShopService.GetBanners().then(function (data) {
                $scope.data.slides = data.main_banners;
                $scope.data.offers = data.offer_banner;
         });
         </pre>
         Resolved Object
         <pre>
         {
            "main_banners": [
                {
                    "title": "MacBookAir",
                    "link": "",
                    "image": "full_image_path.jpg"
                }
            ],
            "offer_banner": [
                {
                    "title": "HP Banner",
                    "link": "#/app/product/7",
                    "image": "full_image_path.jpg"
                }
            ]
         }
         </pre>
         * 
         * @returns {promise} Returns a promise of the API call.
         */
        this.GetBanners = function () {
            return dataService.apiSecuredPost('/design/banners').then(function (data) {
                if (data.main_banners || data.offer_banner) {
                    return data;
                } else {
                    return $q.reject(data);
                }
            });
        }

        /**
         * @ngdoc function
         * @name shop.module.ShopService#GetCategories
         * @methodOf shop.module.ShopService
         * @kind function
         * 
         * @description
         * Gets categories configured in the system. if none is configured, returns all parent categories
         * 
         * @example
         <pre>
         ShopService.GetCategories().then(function (data) {
                $scope.data.categories = data.categories;
         });
         </pre>
         Resolved Object
         <pre>
         {
            "category_id": 0,
            "child_id": 0,
            "categories": [
                {
                    "category_id": "20",
                    "name": "Desktops",
                    "image": "full_image_path.jpg"
                },
                {
                    "category_id": "18",
                    "name": "Laptops",
                    "image": "full_image_path.jpg"
                }
            ]
         }
         </pre>
		 *
		 * @param {number} id Category id
         * @returns {promise} Returns a promise of the API call.
         */
        this.GetCategories = function (id) {
            return dataService.apiSecuredPost('/category/all', {path :id});
        }

        /**
         * @ngdoc function
         * @name shop.module.ShopService#GetCategoryProducts
         * @methodOf shop.module.ShopService
         * @kind function
         * 
         * @description
         * Gets product list of a category
         * 
         * @example
         <pre>
         ShopService.GetCategoryProducts(1, 1).then(function (data) {
            $scope.items = data.products;
         });
         </pre>
         Resolved Object
         <pre>
         {
          "heading_title": "Desktops",
          "text_empty": "There are no products to list in this category.",
          "thumb": "full_image_path.jpg",
          "description": "description",
          "categories": [
            {
              "name": "PC",
              "id": "26"
            }
          ],
          "products": [
            {
              "product_id": "42",
              "thumb": "full_image_path.jpg",
              "name": "Apple Cinema 30",
              "description": "Cinema HD Display delivers..",
              "price": "$122.00",
              "price_clear": "100.0000",
              "special": "$110.00",
              "special_clear": "90.0000",
              "off":"10",
              "mobile_special": false,
              "mobile_special_clear": null,
              "tax": "$90.00",
              "minimum": "2",
              "rating": 0,
              "images": [
                "full_image_path.jpg",
                "full_image_path.jpg",
                "full_image_path.jpg"
              ]
            }
          ],
          "sort": "p.sort_order",
          "order": "ASC",
          "limit": 10
         }
         </pre>
         * 
         * 
         * @param {number} id Category id
         * @param {number} page Page number
         * @returns {promise} Returns a promise of the API call.
         */
        this.GetCategoryProducts = function (id, page) {

            var limit = 10;

            return dataService.apiSecuredPost('/category', { path: id, page: page, limit: limit }).then(function (data) {
                for (var i in data.products) {
                    if (data.products[i].special_clear) {
                        var s = parseInt(data.products[i].special_clear);
                        var p = parseInt(data.products[i].price_clear);
                        data.products[i].off = Math.ceil((p - s) / p * 100);
                    }
                }

                return data;
            });
        }

        /**
         * @ngdoc function
         * @name shop.module.ShopService#GetProduct
         * @methodOf shop.module.ShopService
         * @kind function
         * 
         * @description
         * Gets details of a product
         * 
         * @example
         <pre>
         ShopService.GetProduct($stateParams.id).then(function (data) {
            $scope.item = data;
         });
         </pre>
         Resolved Object
         <pre>
         {
          "heading_title": "Apple Cinema 30",
          "product_id": 42,
          "manufacturer": "Apple",
          "manufacturers": "8",
          "model": "Product 15",
          "reward": "100",
          "points": "400",
          "description": "description",
          "stock": "In Stock",
          "popup": "full_image_path500x500.jpg",
          "thumb": "full_image_path228x228.jpg",
          "images": [
            {
              "popup": "full_image_path500x500.jpg",
              "thumb": "full_image_path74x74.jpg",
              "preview": "full_image_path228x228.jpg"
            }
          ],
          "price": "$122.00",
          "special": "$110.00",
          "off": "10",
          "mobile_special": false,
          "tax": "$90.00",
          "discounts": [
            {
              "quantity": "10",
              "price": "$107.60"
            }
          ],
          "options": [
            {
              "product_option_id": "218",
              "product_option_value": [
                {
                  "product_option_value_id": "5",
                  "option_value_id": "32",
                  "name": "Small",
                  "image": null,
                  "price": "$12.00",
                  "price_prefix": "+"
                }
              ],
              "option_id": "1",
              "name": "Radio",
              "type": "radio",
              "value": "",
              "required": "1"
            }
          ],
          "minimum": "2",
          "review_status": "1",
          "review_guest": true,
          "customer_name": "",
          "reviews": "0 reviews",
          "rating": 0,
          "captcha": "",
          "attribute_groups": [
            {
              "attribute_group_id": "6",
              "name": "Processor",
              "attribute": [
                {
                  "attribute_id": "3",
                  "name": "Clockspeed",
                  "text": "100mhz"
                }
              ]
            }
          ],
          "products": [
            {
              "product_id": "40",
              "thumb": "full_image_path80x80.jpg",
              "name": "iPhone",
              "description": "iPhone is a revolutionary new mobile ph..",
              "price": "$123.20",
              "price_clear": "101.0000",
              "special": false,
              "special_clear": null,
              "mobile_special": false,
              "mobile_special_clear": null,
              "off": "10",
              "tax": "$101.00",
              "minimum": "1",
              "rating": 0,
              "href": "http://localhost/opencart-2.1.0.1/upload/index.php?route=product/product&amp;product_id=40"
            }
          ],
          "tags": [],
          "recurrings": []
         }
         </pre>
         * 
         * @param {number} id Product id
         * @returns {promise} Returns a promise of the API call.
         */
        this.GetProduct = function (id) {

            return dataService.apiSecuredPost('/product', { product_id: id }).then(function (data) {
                if (data.special_clear) {
                    var s = parseInt(data.special_clear);
                    var p = parseInt(data.price_clear);
                    data.off = Math.ceil((p - s) / p * 100);
                }

                for (var i in data.products) {
                    if (data.products[i].special_clear) {
                        var s = parseInt(data.products[i].special_clear);
                        var p = parseInt(data.products[i].price_clear);
                        data.products[i].off = Math.ceil((p - s) / p * 100);
                    }
                }

                data.review_status = data.review_status == "1";

                return data;
            });
        }

        /**
        * @ngdoc function
        * @name shop.module.ShopService#GetProductReviews
        * @methodOf shop.module.ShopService
        * @kind function
        * 
        * @description
        * Get product reviews of a product
        * 
        * @example
        <pre>
        ShopService.GetProductReviews($scope.item.product_id, $scope.page).then(function (data) {
           $scope.reviews = data.reviews;
        });
        </pre>
        Resolved Object
        <pre>
        {
          "reviews": [
            {
              "author": "Adam",
              "text": "this is a very nice product. i like this",
              "rating": 4,
              "date_added": "30/07/2016"
            }
          ],
          "text_no_reviews": "There are no reviews for this product.",
          "pagination": "",
          "results": "Showing 1 to 1 of 1 (1 Pages)"
        }
        </pre>
        * 
        * @param {number} id Product id
        * @param {number} page Page number
        * @returns {promise} Returns a promise of the API call.
        */
        this.GetProductReviews = function (id, page) {
            return dataService.apiSecuredPost('/product/getreviews', { product_id: id, page: page || 1 });
        }

        /**
        * @ngdoc function
        * @name shop.module.ShopService#AddProductReview
        * @methodOf shop.module.ShopService
        * @kind function
        * 
        * @description
        * Get product reviews of a product
        * 
        * @example
        <pre>
        ShopService.AddProductReview(id, name, rating, text).then(function (data) {
           $scope.success_message = data.success;
        });
        </pre>
        * 
        * @param {number} product_id Product id
        * @param {string} name Reviewer name
        * @param {number} rating Rating
        * @param {string} text User review text
        * 
        * @returns {promise} Returns a promise of the API call.
        */
        this.AddProductReview = function (id, name, rating, text) {
            return dataService.apiSecuredPost('/product/addreview', { product_id: id, name: name, rating: rating, text: text });
        }

        /**
         * @ngdoc function
         * @name shop.module.ShopService#GetRingSizeImage
         * @methodOf shop.module.ShopService
         * @kind function
         * 
         * @description
         * Gets ring size guid image. This is a sample service call to retrieve a banner by `id`
         * 
         * @returns {promise} Returns a promise of the API call.
         */
        this.GetRingSizeImage = function () {

            return dataService.apiSecuredPost('/design/banner', { banner_id: 19, banner_width: 500, banner_height: 500 }).then(function (data) {
                if (data.banners) {
                    return data;
                } else {
                    return $q.reject(data);
                }
            });
        }

        /**
         * @ngdoc function
         * @name shop.module.ShopService#GetFeaturedProducts
         * @methodOf shop.module.ShopService
         * @kind function
         * 
         * @description
         * Gets featured products list. Needs configuration settings in the OpenCart module.
         * 
         * @example
         <pre>
         ShopService.GetFeaturedProducts().then(function (data) {
                $scope.data.featuredItems = data.products;
         });
         </pre>
         Resolved Object
         <pre>
            {
              "heading_title": "Featured",
              "products": [
                {
                  "product_id": "42",
                  "thumb": "full_image_path50x50.jpg",
                  "name": "Apple Cinema 30",
                  "description": "description",
                  "price": "$122.00",
                  "price_clear": "100.0000",
                  "special": "$110.00",
                  "special_clear": "90.0000",
                  "mobile_special": false,
                  "mobile_special_clear": null,
                  "off": "10",
                  "tax": "$90.00",
                  "rating": 0,
                  "images": [
                    "full_image_path100x100.jpg",
                    "full_image_path100x100.jpg",
                    "full_image_path100x100.jpg"
                  ]
                }
              ]
            }
         </pre>
         * 
         * @returns {promise} Returns a promise of the API call.
         */
        this.GetFeaturedProducts = function () {

            return dataService.apiSecuredPost('/featured').then(function (data) {
                for (var i in data.products) {
                    if (data.products[i].special_clear) {
                        var s = parseInt(data.products[i].special_clear);
                        var p = parseInt(data.products[i].price_clear);
                        data.products[i].off = Math.ceil((p - s) / p * 100);
                    }
                }

                return data;
            });
        }

        /**
         * @ngdoc function
         * @name shop.module.ShopService#GetLatestProducts
         * @methodOf shop.module.ShopService
         * @kind function
         * 
         * @description
         * Gets latest products list
         * 
         * @example
         <pre>
         ShopService.GetLatestProducts($scope.data.latestPage).then(function (data) {
            $scope.data.latestItems = data.products;
         });
         </pre>
         Resolved Object
         <pre>
            {
              "heading_title": "Latest",
              "products": [
                {
                  "product_id": "47",
                  "thumb": "full_image_path50x50.jpg",
                  "name": "HP LP3065",
                  "description": "description",
                  "price": "$122.00",
                  "price_clear": "100.0000",
                  "special": false,
                  "special_clear": null,
                  "mobile_special": "$26.00",
                  "mobile_special_clear": "20.0000",
                  "off": "10",
                  "tax": "$100.00",
                  "rating": 0,
                  "images": [
                    "full_image_path100x100.jpg"
                  ]
                }
              ]
            }
         </pre>
         * 
         * @param {number} page Page number
         * @returns {promise} Returns a promise of the API call.
         */
        this.GetLatestProducts = function (page) {

            var start = (page - 1) * 10;
            var limit = 10;

            return dataService.apiSecuredPost('/latest', { start: start, limit: limit }).then(function (data) {
                for (var i in data.products) {
                    if (data.products[i].special_clear) {
                        var s = parseInt(data.products[i].special_clear);
                        var p = parseInt(data.products[i].price_clear);
                        data.products[i].off = Math.ceil((p - s) / p * 100);
                    }
                }

                return data;
            });
        }

        /**
         * @ngdoc function
         * @name shop.module.ShopService#SearchProducts
         * @methodOf shop.module.ShopService
         * @kind function
         * 
         * @description
         * Search for products by a given search term
         * 
         * @example
         <pre>
         ShopService.SearchProducts(vm.search.value, $scope.page).then(function (data) {
            $scope.items = data.products;
         });
         </pre>
         Resolved Object
         <pre>
            {
              "text_empty": "There is no product that matches the search criteria.",
              "products": [
                {
                  "product_id": "42",
                  "thumb": "full_image_path228x228.jpg",
                  "name": "Apple Cinema 30",
                  "description": "The 30-inch Apple Cinema HD Display del..",
                  "price": "$122.00",
                  "price_clear": "100.0000",
                  "special": "$110.00",
                  "special_clear": "90.0000",
                  "off": "10",
                  "mobile_special": false,
                  "mobile_special_clear": null,
                  "tax": "$90.00",
                  "minimum": "2",
                  "rating": 0,
                  "images": [
                    "full_image_path100x100.jpg",
                    "full_image_path100x100.jpg",
                    "full_image_path100x100.jpg"
                  ]
                }
              ],
              "search": "apple",
              "description": "apple",
              "category_id": "0",
              "sub_category": "0",
              "sort": "p.sort_order",
              "order": "ASC",
              "limit": 10
            }
         </pre>
         * 
         * @param {string} search Search term
         * @param {number} page Page number
         * @returns {promise} Returns a promise of the API call.
         */
        this.SearchProducts = function (search, page) {

            var limit = 10;

            return dataService.apiSecuredPost('/product/search', { search: search, page: page, limit: limit }).then(function (data) {
                for (var i in data.products) {
                    if (data.products[i].special) {
                        var s = parseInt(data.products[i].special_clear);
                        var p = parseInt(data.products[i].price_clear);
                        data.products[i].off = Math.ceil((p - s) / p * 100);
                    }
                }

                return data;
            });
        }

        /**
         * @ngdoc function
         * @name shop.module.ShopService#AddToWishlist
         * @methodOf shop.module.ShopService
         * @kind function
         * 
         * @description
         * Adds a product to the wishlist
         * 
         * @example
         <pre>
         ShopService.AddToWishlist(46).then(function (data) {
                //success
         });
         </pre>
         * 
         * @param {number} id Product id
         * @returns {promise} Returns a promise of the API call.
         */
        this.AddToWishlist = function (id) {
            return dataService.apiSecuredPost('/wishlist/add', { product_id: id }).then(function (data) {
                if (data.success) {
                    return data;
                } else {
                    return $q.reject(data);
                }
            });
        }
    })