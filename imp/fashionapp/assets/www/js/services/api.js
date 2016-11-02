var urlApi = 'http://betosee.com/api/mobile/secure';

angular.module('APIServices', ['ngResource']).config(function($httpProvider){
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
})

.factory('Api', function ($http) {
  return {
      init: function (token) {
          $http.defaults.headers.common['X-Token'] = token;
          $http.defaults.headers.common['API-Version'] = 'r3';
      }
  };
})

.factory('User', function($q, $resource){

    var userByIdResource = $resource(urlApi+'/user/:user_id', {}, {
        get: {
            method: 'GET'
        }
    });

    var brandByUserId = $resource(urlApi+'/user/:user_id/brand', {}, {
        get: {
            method: 'GET',
            isArray: true
        }
    });

    var storeByUserId = $resource(urlApi+'/user/:user_id/store', {}, {
        get: {
            method: 'GET'
        }
    });

    var collectionsByUserId = $resource(urlApi+'/user/:user_id/collections', {}, {
        get: {
            method: 'GET',
            isArray: true
        }
    });

    var likesByUserId = $resource(urlApi+'/user/:user_id/like', {}, {
        get: {
            method: 'GET',
            isArray: true
        }
    });

    var likesCountByUserId = $resource(urlApi+'/user/:id/like/count', {}, {
        get: {
            method: 'GET',
            isArray: true
        }
    });

    var addUserToBoardResource = $resource(urlApi+'/like/selection/:board_id/add/profile/:user_id', {}, {
        get: {
            method: 'GET'
        }
    });

    var removeUserFromBoardResource = $resource(urlApi+'/like/selection/:board_id/remove/profile/:user_id', {}, {
        get: {
            method: 'GET'
        }
    });

    var getUserBoardsResource = $resource(urlApi+'/user/:user_id/selection', {}, {
        get: {
            method: 'GET',
            isArray: true
        }
    });

    return {
        getById: function(id) {
          var q = $q.defer();

            userByIdResource.get({
                user_id: id
            }, function(resp) {
                q.resolve(resp);
            }, function(httpResponse) {
                q.reject(httpResponse);
            });

            return q.promise;
        },
        getLikesCount: function(id) {
          var q = $q.defer();

            likesCountByUserId.get({
                id: id
            }, function(resp) {
                q.resolve(resp);
            }, function(httpResponse) {
                q.reject(httpResponse);
            });

            return q.promise;
        },
        getBrand: function(id) {
          var q = $q.defer();

            brandByUserId.get({
                user_id: id
            }, function(resp) {
                q.resolve(resp);
            }, function(httpResponse) {
                q.reject(httpResponse);
            });

            return q.promise;
        },
        getStore: function(id) {
          var q = $q.defer();

            storeByUserId.get({
                user_id: id
            }, function(resp) {
                q.resolve(resp);
            }, function(httpResponse) {
                q.reject(httpResponse);
            });

            return q.promise;
        },
        getCollections: function(id) {
          var q = $q.defer();

            collectionsByUserId.get({
                user_id: id
            }, function(resp) {
                q.resolve(resp);
            }, function(httpResponse) {
                q.reject(httpResponse);
            });

            return q.promise;
        },
        getLikes: function(id) {
          var q = $q.defer();

            likesByUserId.get({
                user_id: id
            }, function(resp) {
                q.resolve(resp);
            }, function(httpResponse) {
                q.reject(httpResponse);
            });

            return q.promise;
        },
        addUserToBoard: function(board_id, user_id) {
          var q = $q.defer();

            addUserToBoardResource.get({
                board_id: board_id,
                user_id: user_id
            }, function(resp) {
                q.resolve(resp);
            }, function(httpResponse) {
                q.reject(httpResponse);
            });

            return q.promise;
        },
        removeUserFromBoard: function(board_id, user_id) {
          var q = $q.defer();

            removeUserFromBoardResource.get({
                board_id: board_id,
                user_id: user_id
            }, function(resp) {
                q.resolve(resp);
            }, function(httpResponse) {
                q.reject(httpResponse);
            });

            return q.promise;
        },
        getUserBoards: function(id) {
          var q = $q.defer();

            getUserBoardsResource.get({
                user_id: id
            }, function(resp) {
                q.resolve(resp);
            }, function(httpResponse) {
                q.reject(httpResponse);
            });

            return q.promise;
        }
    };
})

.factory('Feed', function($q, $resource){
    var feedResource = $resource(urlApi + '/feed?:params', {}, {
        query: {
            method: 'GET',
            isArray: true
        }
    });

    var feedByIdResource = $resource(urlApi + '/feed/:id', {}, {
        query: {
            method: 'GET',
            isArray: false
        }
    });

    return {
        get: function(offset, page_size) {
          var q = $q.defer();

            offset = typeof offset !== 'undefined' ? offset : 0;
            page_size = typeof page_size !== 'undefined' ? page_size : 20;

            feedResource.query({
                params: 'offset=' + offset + '&page_size=' + page_size
            },
            function(resp) {
                q.resolve(resp);
            }, function(httpResponse) {
                q.reject(httpResponse);
            });

            return q.promise;
        },
        getById : function(id){
             var q = $q.defer();

            id = typeof id !== 'undefined' ? id : 0;

            feedByIdResource.query({
                id: id
            },
            function(resp) {
                q.resolve(resp);
            }, function(httpResponse) {
                q.reject(httpResponse);
            });

            return q.promise;
        }
    };
})

.factory('Profile', function($q, $resource){

    var loginResource = $resource(urlApi + '/../login?:data', {}, {
        get: {
          method: 'GET'
        }
    });

    var retreivePasswordResource = $resource(urlApi + '/../retreive-password?:data', {}, {
        get: {
          method: 'GET'
        }
    });

    var profileResource = $resource(urlApi+'/profile', {}, {
        query: {
            method: 'GET'
        }
    });

    var profileEditResource = $resource(urlApi+'/profile/update', {}, {
        query: {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }
    });

    var profileTypeResource = $resource(urlApi+'/../profiletype', {}, {
        query: {
            method: 'GET',
            isArray: true
        }
    });

    var countryResource = $resource(urlApi+'/../country', {}, {
        query: {
            method: 'GET',
            isArray: true
        }
    });

    var registerResource = $resource(urlApi+'/../register?:data', {}, {
        query: {
            method: 'GET'
        }
    });

    var registerFbResource = $resource(urlApi+'/../login/facebook?:data', {}, {
        query: {
            method: 'GET'
        }
    });

    var likesResource = $resource(urlApi+'/profile/like?offset=:offset', {}, {
        query: {
            method: 'GET',
            isArray: true
        }
    });

    var activityResource = $resource(urlApi+'/profile/activity', {}, {
        query: {
            method: 'GET',
            isArray: true
        }
    });

    var createBoardResource = $resource(urlApi + '/profile/selection/create', {}, {
        query: {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }
    });

    var updateBoardResource = $resource(urlApi + '/profile/selection/update', {}, {
        query: {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }
    });

    var getBoardsResource = $resource(urlApi + '/profile/selection', {}, {
        get: {
            method: 'GET',
            isArray: true
        }
    });

    var getLikeProfileResource = $resource(urlApi + '/profile/like/profile', {}, {
        get: {
            method: 'GET',
            isArray: true
        }
    });

    var getLikeNonProfileResource = $resource(urlApi + '/profile/like/nonprofile', {}, {
        get: {
            method: 'GET',
            isArray: true
        }
    });

    return {
        login: function(user, pass) {
          var q = $q.defer();

            loginResource.get({
                data: 'user=' + user + '&pass=' + pass
            }, function(resp) {
                q.resolve(resp);
            }, function(httpResponse) {
                q.reject(httpResponse);
            });

            return q.promise;
        },
        retreivePassword: function(email) {
          var q = $q.defer();

            retreivePasswordResource.get({
                data: 'email=' + email
            }, function(resp) {
                q.resolve(resp);
            }, function(httpResponse) {
                q.reject(httpResponse);
            });

            return q.promise;
        },
        register: function(user) {
            var q = $q.defer();

            var dataRegister = 'email=' + user.email + '&password='
                    + user.password + '&civility_id=3&firstname='
                    + user.firstname + '&lastname=' + user.lastname + '&city=Paris&country_id=1&title=' + user.page;

            if (user.profile !== ''){
                dataRegister += '&profile_type_id=' + user.profile;
            }

            registerResource.get({
                data: dataRegister
            }, function(resp) {
                q.resolve(resp);
            }, function(httpResponse) {
                q.reject(httpResponse);
            });

            return q.promise;
        },
        registerFb: function(user) {
            var q = $q.defer();

            var dataRegister = 'email=' + user.email + '&password='
                    + user.password + '&civility_id=3&firstname='
                    + user.firstname + '&lastname=' + user.lastname + '&city=Paris&country_id=1'
                    + '&fb_token=' + user.fbToken + '&fb_avatar_url=' + user.fbAvatarUrl;

            if (user.profile !== ''){
                dataRegister += '&profile_type_id=11';
            }

            registerFbResource.get({
                data: dataRegister
            }, function(resp) {
                q.resolve(resp);
            }, function(httpResponse) {
                q.reject(httpResponse);
            });

            return q.promise;
        },
        update: function(user) {
            var q = $q.defer();

            profileEditResource.query(
                'profile_type_id=' + user.profession.id +
                '&email=' + user.email +
                '&about=' + user.about +
                '&civility_id=' + user.civ_id +
                '&firstname=' + user.first_name +
                '&lastname=' + user.last_name +
                '&country_id=' + user.country.id +
                '&city=' + user.city +
                '&avatar_base64=' + encodeURIComponent(user.avatar_base64),
                function(resp) {
                q.resolve(resp);
            }, function(httpResponse) {
                q.reject(httpResponse);
            });

            return q.promise;
        },
        get: function() {
          var q = $q.defer();

            profileResource.query({},
            function(resp) {
                q.resolve(resp);
            }, function(httpResponse) {
                q.reject(httpResponse);
            });

            return q.promise;
        },
        getTypes: function() {
          var q = $q.defer();

            profileTypeResource.query({},
            function(resp) {
                q.resolve(resp);
            }, function(httpResponse) {
                q.reject(httpResponse);
            });

            return q.promise;
        },
        getCountries: function() {
          var q = $q.defer();

            countryResource.query({},
            function(resp) {
                q.resolve(resp);
            }, function(httpResponse) {
                q.reject(httpResponse);
            });

            return q.promise;
        },
        getLikes: function(offset) {
            var q = $q.defer();

            likesResource.query({
                offset : offset
            },
            function(resp) {
                q.resolve(resp);
            }, function(httpResponse) {
                q.reject(httpResponse);
            });

            return q.promise;
        },
        getActivity: function() {
            var q = $q.defer();

            activityResource.query({},
            function(resp) {
                q.resolve(resp);
            }, function(httpResponse) {
                q.reject(httpResponse);
            });

            return q.promise;
        },
        getBoards: function() {
          var q = $q.defer();

            getBoardsResource.get({
            }, function(resp) {
                q.resolve(resp);
            }, function(httpResponse) {
                q.reject(httpResponse);
            });

            return q.promise;
        },
        getLikesProfile: function() {
          var q = $q.defer();

            getLikeProfileResource.get({
            }, function(resp) {
                q.resolve(resp);
            }, function(httpResponse) {
                q.reject(httpResponse);
            });

            return q.promise;
        },
        getLikesNonProfile: function() {
          var q = $q.defer();

            getLikeNonProfileResource.get({
            }, function(resp) {
                q.resolve(resp);
            }, function(httpResponse) {
                q.reject(httpResponse);
            });

            return q.promise;
        },
        createBoard: function(title, content, image_base64) {
          var q = $q.defer();

            createBoardResource.query(
                'title=' + title +
                '&content=' + content +
                '&image_base64=' + encodeURIComponent(image_base64),
                function(resp) {
                q.resolve(resp);
            }, function(httpResponse) {
                q.reject(httpResponse);
            });

            return q.promise;
        },
        updateBoard: function(title, content, image_base64) {
          var q = $q.defer();

            updateBoardResource.query(
                'title=' + title +
                '&content=' + content +
                '&image_base64=' + encodeURIComponent(image_base64),
                function(resp) {
                q.resolve(resp);
            }, function(httpResponse) {
                q.reject(httpResponse);
            });

            return q.promise;
        }
    };
})

.factory('Brand', function($q, $resource){
    var brandResource = $resource(urlApi+'/profile/brand', {}, {
        query: {
            method: 'GET'
        }
    });

    var brandByIdResource = $resource(urlApi+'/brand/:id', {}, {
        query: {
            method: 'GET'
        }
    });

    var brandCollectionsResource = $resource(urlApi+'/brand/:id/collection', {}, {
        query: {
            method: 'GET',
            isArray: true
        }
    });

    return {
    get: function() {
      var q = $q.defer();

        brandResource.query({},
        function(resp) {
            q.resolve(resp);
        }, function(httpResponse) {
            q.reject(httpResponse);
        });

        return q.promise;
    },
    getCollections: function(id) {
        var q = $q.defer();

        brandCollectionsResource.query({
            id: id
        },
        function(resp) {
            q.resolve(resp);
        }, function(httpResponse) {
            q.reject(httpResponse);
        });

        return q.promise;
    },
    getById: function(id) {
        var q = $q.defer();

        brandByIdResource.query({
            id: id
        },
        function(resp) {
            q.resolve(resp);
        }, function(httpResponse) {
            q.reject(httpResponse);
        });

        return q.promise;
    }
    };
})

.factory('Store', function($q, $resource){
    var storeResource = $resource(urlApi+'/store', {}, {
        query: {
            method: 'GET',
            isArray: true
        }
    });

    var storeByIdResource = $resource(urlApi+'/store/:store_id', {}, {
        query: {
            method: 'GET'
        }
    });

    var storeBrands = $resource(urlApi+'/store/:store_id/brand', {}, {
        query: {
            method: 'GET',
            isArray: true
        }
    });

    return {
    get: function() {
      var q = $q.defer();

        storeResource.query({
        },
        function(resp) {
            q.resolve(resp);
        }, function(httpResponse) {
            q.reject(httpResponse);
        });

        return q.promise;
    },
    getById: function(store_id) {
      var q = $q.defer();

        storeByIdResource.query({
            store_id: store_id
        },
        function(resp) {
            q.resolve(resp);
        }, function(httpResponse) {
            q.reject(httpResponse);
        });

        return q.promise;
    },
    getBrands: function(store_id) {
      var q = $q.defer();

        storeBrands.query({
            store_id: store_id
        },
        function(resp) {
            q.resolve(resp);
        }, function(httpResponse) {
            q.reject(httpResponse);
        });

        return q.promise;
    }
    };
})

.factory('GoFromDiscover', function($q, $resource){
    var GoFromDiscoverResource = $resource(urlApi+'/:controller?:params', {}, {
        get: {
            method: 'GET',
            isArray: true
        }
    });

    return {
    get: function(controller, params) {
      var q = $q.defer();

        params = typeof params !== 'undefined' ? params : null;

        GoFromDiscoverResource.get({
            controller: controller,
            params: params
        },
        function(resp) {
            q.resolve(resp);
        }, function(httpResponse) {
            q.reject(httpResponse);
        });

        return q.promise;
    } };
})

.factory('Collections', function($q, $resource){
    var collectionsResource = $resource(urlApi+'/profile/collections', {}, {
        get: {
            method: 'GET'
        }
    });

    var collectionsByIdResource = $resource(urlApi+'/collection/:id', {}, {
        get: {
            method: 'GET'
        }
    });

    var productsByCollectionIdResource = $resource(urlApi+'/collection/:id/product?page_size=100', {}, {
        get: {
            method: 'GET',
            isArray: true
        }
    });

    return {
    get: function() {
      var q = $q.defer();

        collectionsResource.get({},
        function(resp) {
            q.resolve(resp);
        }, function(httpResponse) {
            q.reject(httpResponse);
        });

        return q.promise;
    },
    getById: function(id) {
      var q = $q.defer();

        collectionsByIdResource.get({
            id: id
        },
        function(resp) {
            q.resolve(resp);
        }, function(httpResponse) {
            q.reject(httpResponse);
        });

        return q.promise;
    },
    getProducts: function(id) {
      var q = $q.defer();

        productsByCollectionIdResource.get({
            id: id
        },
        function(resp) {
            q.resolve(resp);
        }, function(httpResponse) {
            q.reject(httpResponse);
        });

        return q.promise;
    } };
})

.factory('Product', function($q, $resource){
    var productResource = $resource(urlApi+'/product/:id', {}, {
        get: {
            method: 'GET',
            isArray: false
        }
    });

    var productTypeResource = $resource(urlApi+'/../producttype', {}, {
        get: {
            method: 'GET',
            isArray: true
        }
    });

    return {
        get: function(id) {
          var q = $q.defer();

            productResource.get({
                id: id
            },
            function(resp) {
                q.resolve(resp);
            }, function(httpResponse) {
                q.reject(httpResponse);
            });

            return q.promise;
        },
        getTypes: function(id) {
          var q = $q.defer();

            productTypeResource.get({
            },
            function(resp) {
                q.resolve(resp);
            }, function(httpResponse) {
                q.reject(httpResponse);
            });

            return q.promise;
        }
    };
})

.factory('Discover', function($q, $resource){
    var productResource = $resource(urlApi+'/discover', {}, {
        get: {
            method: 'GET',
            isArray: true
        }
    });

    return {
    get: function() {
      var q = $q.defer();

        productResource.get({
        },
        function(resp) {
            q.resolve(resp);
        }, function(httpResponse) {
            q.reject(httpResponse);
        });

        return q.promise;
    } };
})

.factory('Search', function($q, $resource){
    var searchResource = $resource(urlApi+'/search?s=:keywords', {}, {
        query: {
            method: 'GET'
        }
    });

    var searchByTypeResource = $resource(urlApi+'/:type/search?s=:keywords', {}, {
        query: {
            method: 'GET',
            isArray: true
        }
    });

    return {
    get: function(keywords) {
      var q = $q.defer();

        searchResource.query({
            keywords: keywords
        },
        function(resp) {
            q.resolve(resp);
        }, function(httpResponse) {
            q.reject(httpResponse);
        });

        return q.promise;
    },
    getByType: function(type, keywords) {
      var q = $q.defer();

        searchByTypeResource.query({
            keywords: keywords,
            type: type
        },
        function(resp) {
            q.resolve(resp);
        }, function(httpResponse) {
            q.reject(httpResponse);
        });

        return q.promise;
    } };
})

.factory('Likes', function($q, $resource){
    var likesResource = $resource(urlApi+'/like/toggle/:type/:id', {}, {
        query: {
            method: 'GET'
        }
    });

    var excludedLikesResource = $resource(urlApi+'/profile/like', {}, {
        query: {
            method: 'GET',
            isArray: true
        }
    });

    var excludedLikesByUserIdResource = $resource(urlApi+'/user/:id/like', {}, {
        query: {
            method: 'GET',
            isArray: true
        }
    });

    var countExcludedLikesByUserIdResource = $resource(urlApi+'/user/:id/like/count', {}, {
        query: {
            method: 'GET',
            transformResponse: function (data, headers) {
                var count ='';
                [].forEach.call(eval(data), function (d) {
                    count = count + d;
                });
                return {count : count};
            }
        }
    });

    return {
        toggle: function(type, id) {
          var q = $q.defer();

            likesResource.query({
                type: type,
                id: id
            },
            function(resp) {
                q.resolve(resp);
            }, function(httpResponse) {
                q.reject(httpResponse);
            });

            return q.promise;
        },
        getLikesByExcluding: function(filter1, filtervalue1, filter2, filtervalue2, filter3, filtervalue3, filter4, filtervalue4, filter5, filtervalue5) {
          var q = $q.defer();

            excludedLikesResource.query({
                'filter-1': filter1,
                'filtervalue-1': filtervalue1,
                'filter-2': filter2,
                'filtervalue-2': filtervalue2,
                'filter-3': filter3,
                'filtervalue-3': filtervalue3,
                'filter-4': filter4,
                'filtervalue-4': filtervalue4,
                'filter-5': filter5,
                'filtervalue-5': filtervalue5
            },
            function(resp) {
                q.resolve(resp);
            }, function(httpResponse) {
                q.reject(httpResponse);
            });

            return q.promise;
        },
        getLikesByExcludingAndUserId: function(userId, filter1, filtervalue1, filter2, filtervalue2, filter3, filtervalue3, filter4, filtervalue4, filter5, filtervalue5) {
          var q = $q.defer();

            excludedLikesByUserIdResource.query({
                id: userId,
                'filter-1': filter1,
                'filtervalue-1': filtervalue1,
                'filter-2': filter2,
                'filtervalue-2': filtervalue2,
                'filter-3': filter3,
                'filtervalue-3': filtervalue3,
                'filter-4': filter4,
                'filtervalue-4': filtervalue4,
                'filter-5': filter5,
                'filtervalue-5': filtervalue5
            },
            function(resp) {
                q.resolve(resp);
            }, function(httpResponse) {
                q.reject(httpResponse);
            });

            return q.promise;
        },
        getLikesCountByExcludingAndUserId: function(userId, filter1, filtervalue1, filter2, filtervalue2, filter3, filtervalue3, filter4, filtervalue4, filter5, filtervalue5) {
          var q = $q.defer();

            countExcludedLikesByUserIdResource.query({
                id: userId,
                'filter-1': filter1,
                'filtervalue-1': filtervalue1,
                'filter-2': filter2,
                'filtervalue-2': filtervalue2,
                'filter-3': filter3,
                'filtervalue-3': filtervalue3,
                'filter-4': filter4,
                'filtervalue-4': filtervalue4,
                'filter-5': filter5,
                'filtervalue-5': filtervalue5
            },
            function(resp) {
                q.resolve(resp);
            }, function(httpResponse) {
                q.reject(httpResponse);
            });

            return q.promise;
        }
    };
})

.factory('Boards', function($q, $resource){

    var getOneByIdResource = $resource(urlApi+'/like/selection/:id', {}, {
        query: {
            method: 'GET'
        }
    });

    var addToBoardResource = $resource(urlApi+'/like/selection/:board_id/add/:type/:type_id', {}, {
        query: {
            method: 'GET'
        }
    });

    var removeFromBoardResource = $resource(urlApi+'/like/selection/:board_id/remove/:type/:type_id', {}, {
        query: {
            method: 'GET'
        }
    });

    return {
        addToBoard: function(board_id, type, id) {
          var q = $q.defer();

            addToBoardResource.query({
                board_id: board_id,
                type: type,
                type_id: id
            },
            function(resp) {
                q.resolve(resp);
            }, function(httpResponse) {
                q.reject(httpResponse);
            });

            return q.promise;
        },
        removeFromBoard: function(board_id, type, id) {
          var q = $q.defer();

            removeFromBoardResource.query({
                board_id: board_id,
                type: type,
                type_id: id
            },
            function(resp) {
                q.resolve(resp);
            }, function(httpResponse) {
                q.reject(httpResponse);
            });

            return q.promise;
        },
        getOneById: function(id) {
          var q = $q.defer();

            getOneByIdResource.query({
                id: id,
            },
            function(resp) {
                q.resolve(resp);
            }, function(httpResponse) {
                q.reject(httpResponse);
            });

            return q.promise;
        }
    };
})

.factory('Autocomplete', function($q, $resource){
    var autocompleteResource = $resource(urlApi+'/search/tag?s=:keywords', {}, {
        query: {
            method: 'GET',
            isArray: true,
            transformResponse: function (data, headers) {
                var tags = [];
                [].forEach.call(eval(data), function (item) {
                    var t ='';
                    [].forEach.call(item, function (d) {
                        t = t + d;
                    });
                    tags.push({ tag : t});
                });

                return tags;
            }
        }
    });

    return {
    get: function(keywords) {
      var q = $q.defer();

        autocompleteResource.query({
            keywords: keywords
        },
        function(resp) {
            q.resolve(resp);
        }, function(httpResponse) {
            q.reject(httpResponse);
        });

        return q.promise;
    } };
})

.factory('ImageTool', function($q, $resource){
    var imageResource = $resource(urlApi +
        '/tools/resized-image-url/:width/:height/:quality/:precrop/:ratio/:format/:background_color/:module/:prefix/:filename', {}, {
        getUrl: {
            method: 'GET',
            isArray: false,
            transformResponse: function (data, headers) {
                var url ='';
                [].forEach.call(eval(data), function (d) {
                    url = url + d;
                });


                return {url : url};
            }
    }});

    return {
        getUrl: function(options) {
            var q = $q.defer();

            options.width = '400';
            options.height = '300';
            options.quality = '80';
            options.ratio = '1';
            options.precrop = 'null';
            options.format = 'null';
            options.prefix = 'null';
            options.background_color = 'null';

            imageResource.getUrl({
                width: options.width,
                height: options.height,
                quality: options.quality,
                precrop: options.precrop,
                ratio: options.ratio,
                format: options.format,
                background_color: options.background_color,
                module: options.module,
                prefix: options.prefix,
                filename: options.filename
            },
            function(resp) {
                q.resolve(resp);
            }, function(httpResponse) {
                q.reject(httpResponse);
            });

            return q.promise;
        }
    };
});
