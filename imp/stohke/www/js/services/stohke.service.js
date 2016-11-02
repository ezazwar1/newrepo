angular.module('stohke')
.factory('flagService', ['$http', '$q', 'Utils', 'ngNotify', 'analyticsService', function ($http, $q, Utils, ngNotify, analyticsService) {
    var serverBaseUrl = Utils.getServerBaseUrl();

    return {
        flag: function (mediaId, mediaOwnerId, reason) {
            if (!reason) {
                return false;
            }
            var params = '?mediaId=' + mediaId 
                + '&ownerId=' + mediaOwnerId
                +'&reason=' + encodeURIComponent(reason);
            analyticsService.trackEvent('Media', 'Flag:' + reason, ownerId + ' | ' + mediaId);
            return $http.post(serverBaseUrl + '/api/ReportContent/' + params,
                {
                    responseType: 'json'
                })
                .success (
                    function (result) {
                        // console.log(result);
                        ngNotify.set('Media flagged. Thank you', {
                            type:'info',
                            duration: 2000,
                            position: 'bottom'
                        });
                        return;
                    }
                )
                .error (
                    function (reason) {
                        // console.log(reason);
                        ngNotify.set('Couldn\'t flag media. Try again later', {
                            type: 'warn',
                            duration: 2000,
                            position: 'bottom'
                        });
                    }
                );
        }
    };
}])
.factory('stohkeService', ['$http', '$q', '$location', 'Utils', 'analyticsService', function stohking($http, $q, $location, Utils, analyticsService) {
        var serverBaseUrl = Utils.getServerBaseUrl();

        return {
            stohke: function (itemId, itemType) {

                return $http({
                    method: 'POST',
                    url: serverBaseUrl + '/api/stohked/stohke/',
                    params: {
                        Id: itemId,
                        Type: itemType
                    },
                    responseType: 'json',
                }).then(function(result){
                    analyticsService.trackEvent('Media', 'Stohke', itemType + ' | ' + itemId);
                    return result.data;
                }, function(reason){
                    return reason.statusText;
                });
            },

            unstohke: function (itemId, itemType) {
                return $http({
                    method: 'POST',
                    url: serverBaseUrl + '/api/stohked/unstohke/',
                    params: {
                        Id: itemId,
                        Type: itemType
                    },
                    responseType: 'json',
                }).then(function(result){
                    analyticsService.trackEvent('Media', 'UnStohke', itemType + ' | ' + itemId);
                    return result.data;
                }, function(reason){
                    return reason.statusText;
                });
            },

            stohkedCount: function (itemId, itemType) {
                return $http.get(serverBaseUrl + '/api/stohked/stohkedcount/', {
                    params: {
                        Id: itemId,
                        Type: itemType
                    },
                    responseType: 'json',
                    transformResponse: function (data) {
                        return data;
                    }
                }).then(function(result){
                    return result.data;
                });
            },

            totalStohkesCount: function (itemId, itemType) {
                return $http.get(serverBaseUrl + '/api/stohked/totalstohkescount/', {
                    params: {
                        Id: itemId,
                        Type: itemType
                    },
                    responseType: 'json',
                    headers: {
                       'Access-Control-Allow-Origin' : '*'
                    }
                }).then(function(result){
                    return result.data;
                }, function(reason){
                    console.error(reason);
                    return 0;
                });
            },

            isStohkedBy: function (itemId, itemType) {
            
                return $http.get(serverBaseUrl + '/api/stohked/isstohkedby/', {
                    params: {
                        Id: itemId,
                        Type: itemType
                    },
                    responseType: 'json',
                }).then(function(result){
                    return result.data;
                }, function(reason){
                    console.error(reason);
                });
            }
        };
    }])

.service('homeService', ['$q', 'userService', '$timeout', function ($q, userService, $timeout) {
    // service to store data used in the homepage to prevent subsequent data calls...
    var featured = {
            athletes: [],
            collections: [],
            videos: []
        };

    return {
        // do all the data fetching for the homepage
        init: function () {
            var me = this;

            me.getFeaturedUsers()
                .then(function () {
                    return me.getFeaturedCollections();
                });
            
            
        },
        getFeaturedUsers: function () {
            // featured data promise
            var dataRes = $q.defer(),
                dataPromise;

            if (!featured.athletes.length && !dataPromise) {

                dataPromise = userService.getFeaturedUsers(30)
                    .success(function (data) {
                        featured.athletes = data;
                        return featured.athletes;
                    }
                );
            }

            $q.when(dataPromise).then(function (something) {
                dataRes.resolve(featured.athletes);
            });

            return dataRes.promise;
        },
        getFeaturedVideos: function () {
            // featured data promise
            var dataRes = $q.defer(),
                dataPromise;

            if (!featured.videos.length && !dataPromise) {

                userService.getFeaturedUsers(30)
                    .success(function (data) {
                        featured.videos = data;
                        return featured.videos;
                    }
                );

                dataPromise = userService.getUserMedia('c07476e4-b6a8-4ee2-9470-9e3e519205ca', 6, 0, 2)
                    .success( function (data) {
                        featured.videos = data;
                        return featured.videos;
                    });
            }

            $q.when(dataPromise).then(function (something) {
                dataRes.resolve(featured.videos);
            });

            return dataRes.promise;
        },
        getFeaturedCollections: function () {
            // featured data promise
            var dataRes = $q.defer(),
                dataPromise;

            if (!featured.collections.length && !dataPromise) {

                dataPromise = userService.getUsers(null, 6, 0, 'Collections', null, null)
                    .then(function (data) {
                        // console.log(data);
                        featured.collections = data;
                        var mediaPromises = [];
                        // for each collection get two media
                        featured.collections.forEach(function (collection) {

                            var itemPromise = userService.getUserMedia(collection.Id, 1, 0, 0 )
                            .success(function (img) {
                                collection.Media = img;
                            });
                            mediaPromises.push(itemPromise);
                        });
                        $q.when(mediaPromises).then(function () {
                            return featured.collections;
                        });
                    }
                );
            }

            $q.when(dataPromise).then(function (something) {
                dataRes.resolve(featured.collections);
            });

            return dataRes.promise;
        },

    };
}]);


