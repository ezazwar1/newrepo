//------------------------------------------------------------
// Game Service
//------------------------------------------------------------
angular.module('game.services', [])

// WHAT ARE BEING CACHED?
// game_by_collect_as // 3 game ranks under tab_search
// collection_by_location // near me page
// collection_by_wishlist_location // near me page
// gamerlist_by_soldcount // near me page, not being used anymore
// favourite_by_gamer //clear when fav add or remove
// rate_by_gamer //clear when rates add or remove

.service('GameServ', function($http, $q, gbgConfig, AccountServ, $cordovaFile, $localstorage) {
    //------------------------------------------------------------
    // game related
    //------------------------------------------------------------  

    // Service call to load gamer_profile.html and ME tab
    this.game_by_id = function(game_id) {
        var deferred = $q.defer();
        $http
            .post(gbgConfig.api_url + 'game_by_id',{game_id:game_id})
            .success(function(data, status, headers, config){
                if (data.result === 'okay'){
                    deferred.resolve(data);
                }
                else {
                    if (data.error_code === 101 || data.error_code === 102){
                        // api key error, should go to login page
                        AccountServ.logout();
                    }
                    else{
                        deferred.reject(data);
                    }
                }
            })
            .error(function(data, status, headers, config) {
                console.log('ERROR: while loading game profile, API returned error ' + data.error_code);

            });
        return deferred.promise;
    };

    // Service call to load games by the search word
    this.game_by_word = function(keywords, platform, items, page) {
        var deferred = $q.defer();
        $http
            .post(gbgConfig.api_url + 'game_by_word',{keywords:keywords, platform:platform, items:items, page:page})
            .success(function(data, status, headers, config) {
                if (data.result === 'okay'){
                    deferred.resolve(data);
                }
                else {
                    if (data.error_code === 101 || data.error_code === 102){
                        // api key error, should go to login page
                        AccountServ.logout();
                    }
                    else{
                        deferred.reject(data);
                    }
                }
            })
            .error(function(data, status, headers, config) {
                console.log('ERROR: while searching game by name, API returned error ' + data.error_code);

            });
        return deferred.promise;
    };
  
    // Service call to load game by the scanned barcode
    this.game_by_code = function(code, format_type) {
        var deferred = $q.defer();
        $http
            .post(gbgConfig.api_url + 'game_by_code',{code:code, format_type:format_type})
            .success(function(data, status, headers, config){
                if (data.error_code === 'NoErrors' || data.error_code === 'NoCodeFound'){
                    deferred.resolve(data);
                }
                else {
                    if (data.error_code === 101 || data.error_code === 102){
                        // api key error, should go to login page
                        AccountServ.logout();
                    }
                    else{
                        deferred.reject(data);
                    }
                }
            })
            .error(function(data, status, headers, config) {
                console.log('ERROR: while searching game by scan code, API returned error ' + data.error_code);

            });
        return deferred.promise;
    };

    // Service call to add the scanned barcode to the DB
    this.game_code_add = function(code, format_type, hint){
        var deferred = $q.defer();
        $http
            .post(gbgConfig.api_url + 'game_code_add',{code:code, format_type:format_type, hint:hint})
            .success(function(data, status, headers, config){
                if (data.result === 'okay'){
                    deferred.resolve(data);
                }
                else {
                    if (data.error_code === 101 || data.error_code === 102){
                        // api key error, should go to login page
                        AccountServ.logout();
                    }
                    else {
                        deferred.reject(data);
                    }
                }
            })
            .error(function(data, status, headers, config) {
                console.log('ERROR: while adding the info for code missing game, API returned error ' + data.error_code);
            });
        return deferred.promise;
    };

    // Service call to add the searched game name to the DB
    this.game_missing_add = function(hint){
        var deferred = $q.defer();
        $http
            .post(gbgConfig.api_url + 'game_missing_add',{hint:hint})
            .success(function(data, status, headers, config){
                if (data.result === 'okay'){
                    deferred.resolve(data);
                }
                else {
                    if (data.error_code === 101 || data.error_code === 102){
                        // api key error, should go to login page
                        AccountServ.logout();
                    }
                    else {
                        deferred.reject(data);
                    }
                }
            })
            .error(function(data, status, headers, config) {
                console.log('ERROR: while adding the info for name missing game, API returned error ' + data.error_code);
            });
        return deferred.promise;
    };

    this.game_by_collect_as = function(collect_as){ //cache enabled
        var deferred = $q.defer();

        // try to load from cache
        var current_time = new Date().getTime() / 1000;
        var cache_time = $localstorage.get('game_by_collect_as_'+collect_as+'_time');
        if (cache_time && (current_time < parseInt(cache_time) + gbgConfig.cache_expire_seconds)) {
            deferred.resolve($localstorage.getObject('game_by_collect_as_'+collect_as));
            return deferred.promise;
        }

        $http
            .post(gbgConfig.api_url + 'game_by_collect_as',{collect_as:collect_as})
            .success(function(data, status, headers, config){
                if (data.result === 'okay'){
                    deferred.resolve(data);
                    // save to cache
                    $localstorage.set('game_by_collect_as_'+collect_as+'_time', current_time);
                    $localstorage.setObject('game_by_collect_as_'+collect_as, data);
                }
                else {
                    if (data.error_code === 101 || data.error_code === 102){
                        // api key error, should go to login page
                        AccountServ.logout();
                    }
                    else {
                        deferred.reject(data);
                    }
                }
            })
            .error(function(data, status, headers, config) {
                console.log('ERROR: while loading games ranking, API returned error ' + data.error_code);
            });
        return deferred.promise;
    };


    //------------------------------------------------------------
    // collection related
    //------------------------------------------------------------  

    // Service call to load the collection profile html
    this.collection_by_id = function(collection_id) {
        var deferred = $q.defer();
        $http
            .post(gbgConfig.api_url + 'collection_by_id',{collection_id:collection_id})
            .success(function(data, status, headers, config){
                if (data.result === 'okay'){
                    deferred.resolve(data);
                }
                else {
                    if (data.error_code === 101 || data.error_code === 102){
                        // api key error, should go to login page
                        AccountServ.logout();
                    }
                    else {
                        deferred.reject(data);
                    }
                }        
            })
            .error(function(data, status, headers, config) {
                console.log('ERROR: while loading the collection profile, API returned error ' + data.error_code);

            });
        return deferred.promise;
    };

    // Service call to load the collection based on location distance in NearMe tab
    this.collection_by_location = function(keywords, platform_filter, items, page){ //cache enabled
        var deferred = $q.defer();

        // try to load from cache
        if (keywords === ''){
            var current_time = new Date().getTime() / 1000;
            var cache_time = $localstorage.get('collection_by_location_' + platform_filter + '_' + items + '_' + page + '_time');
            if (cache_time && (current_time < parseInt(cache_time) + gbgConfig.cache_expire_seconds)) {
                console.log("------------ collection by location, in cache");
                deferred.resolve($localstorage.getObject('collection_by_location_' + platform_filter + '_' + items + '_' + page));
                return deferred.promise;
            }
        }

        $http
            .post(gbgConfig.api_url + 'collection_by_location', {keywords: keywords, platform: platform_filter, items:items, page:page})
            .success(function(data, status, headers, config){
                if (data.result === 'okay'){
                    deferred.resolve(data);

                    // save to cache, ONLY WHEN IT IS NOT EMPTY IN CASE WE ARE WAITING FOR GPS TO WAKE UP
                    if (data.collections != undefined && data.collections.length > 0) {
                        if (keywords === '') {
                            $localstorage.set('collection_by_location_' + platform_filter + '_' + items + '_' + page + '_time', current_time);
                            $localstorage.setObject('collection_by_location_' + platform_filter + '_' + items + '_' + page, data);
                        }
                    }
                }
                else {
                    if (data.error_code === 101 || data.error_code === 102){
                        // api key error, should go to login page
                        AccountServ.logout();
                    }
                    else {
                        deferred.reject(data);
                    }
                }
                console.log("------------ collection by location, service called");
            })
            .error(function(data, status, headers, config) {
                console.log('ERROR: while loading selling collections based on location, API returned error ' + data.error_code);
            });

        return deferred.promise;
    };

    // Service call to load the collection based on location distance in NearMe tab
    this.collection_by_wishlist_location = function(items){ //cache enabled
        var deferred = $q.defer();

        // try to load from cache
        var current_time = new Date().getTime() / 1000;
        var cache_time = $localstorage.get('collection_by_wishlist_location_'+items+'_time');
        if (cache_time && (current_time < parseInt(cache_time) + gbgConfig.cache_expire_seconds)) {
            console.log("------------ collection by location wishlist, in cache");
            deferred.resolve($localstorage.getObject('collection_by_wishlist_location_'+items));
            return deferred.promise;
        }

        $http
            .post(gbgConfig.api_url + 'collection_by_wishlist_location', {items:items})
            .success(function(data, status, headers, config){
                if (data.result === 'okay'){
                    deferred.resolve(data);

                    // save to cache
                    $localstorage.set('collection_by_wishlist_location_'+items+'_time', current_time);
                    $localstorage.setObject('collection_by_wishlist_location_'+items, data);
                }
                else {
                    if (data.error_code === 101 || data.error_code === 102){
                        // api key error, should go to login page
                        AccountServ.logout();
                    }
                    else {
                        deferred.reject(data);
                    }
                }
                console.log("------------ collection by location wishlist, service called");
            })
            .error(function(data, status, headers, config) {
                console.log('ERROR: while loading the collecton items for auto-matching, API returned error ' + data.error_code);
            });

        return deferred.promise;
    };


    // Service call to load all the collection of each gamer
    this.collection_by_gamer = function(gamer_id, collect_as, items, page) {
        var deferred = $q.defer();
        $http
            .post(gbgConfig.api_url + 'collection_by_gamer',{gamer_id:gamer_id, collect_as:collect_as, items:items, page:page})
            .success(function(data, status, headers, config){
                if (data.result === 'okay'){
                    deferred.resolve(data);
                }
                else {
                    if (data.error_code === 101 || data.error_code === 102){
                        // api key error, should go to login page
                        AccountServ.logout();
                    }
                    else {
                        deferred.reject(data);
                    }
                }        
            })
            .error(function(data, status, headers, config) {
                console.log('ERROR: while loading collection items for gamer, API returned error ' + data.error_code);
            });
        return deferred.promise;
    };

    // service call to add the game to the collection list
    this.collection_add = function(game_id, collect_as, price_unit, price, collection_description, collect_format){
        var deferred = $q.defer();
        $http
            .post(gbgConfig.api_url + 'collection_add',{game_id:game_id, collect_as:collect_as, price_unit:price_unit, price:price, collection_description:collection_description, collect_format:collect_format})
            .success(function(data, status, headers, config){
                if (data.result === 'okay'){
                    deferred.resolve(data);
                }
                else {
                    if (data.error_code === 101 || data.error_code === 102){
                        // api key error, should go to login page
                        AccountServ.logout();
                    }
                    else {
                        deferred.reject(data);
                    }
                }   
            })
            .error(function(data, status, headers, config) {
                console.log('ERROR: while adding a game to collection, API returned error ' + data.error_code);
            });
        return deferred.promise;
    };

    // Service call to delete the game to the collection list
    this.collection_delete = function(collection_id){
        var deferred = $q.defer();
        $http
            .post(gbgConfig.api_url + 'collection_delete',{collection_id:collection_id})
            .success(function(data, status, headers, config){
                if (data.result === 'okay'){
                    deferred.resolve(data);
                }
                else {
                    if (data.error_code === 101 || data.error_code === 102){
                        // api key error, should go to login page
                        AccountServ.logout();
                    }
                    else {
                        deferred.reject(data);
                    }
                }   
            })
            .error(function(data, status, headers, config) {
                console.log('ERROR: while deleting a game to collection, API returned error ' + data.error_code);
            });
        return deferred.promise;
    };

    // Service call to update the existing collection item
    this.collection_update = function(collection_id, collect_as, price_unit, price, collection_description, collect_format){
        var deferred = $q.defer();
        $http
            .post(gbgConfig.api_url + 'collection_update',{collection_id:collection_id, collect_as:collect_as, price_unit:price_unit, price:price, collection_description:collection_description, collect_format:collect_format})
            .success(function(data, status, headers, config){
                if (data.result === 'okay'){
                    deferred.resolve(data);
                }
                else {
                    if (data.error_code === 101 || data.error_code === 102){
                        // api key error, should go to login page
                        AccountServ.logout();
                    }
                    else {
                        deferred.reject(data);
                    }
                }   
            })
            .error(function(data, status, headers, config) {
                console.log('ERROR: while updating a game to collection, API returned error ' + data.error_code);
            });
        return deferred.promise;
    };


    //------------------------------------------------------------
    // gamer related
    //------------------------------------------------------------  

    //Service call to load the gamer lists who have, sell, buy the game, gamer_list.html
    this.collection_by_game = function(game_id, collect_as, items, page){
        var deferred = $q.defer();
        $http
            .post(gbgConfig.api_url + 'collection_by_game',{game_id:game_id, collect_as:collect_as, items:items, page:page})
            .success(function(data, status, headers, config){
                if (data.result === 'okay'){
                    deferred.resolve(data);
                }
                else {
                    if (data.error_code === 101 || data.error_code === 102){
                        // api key error, should go to login page
                        AccountServ.logout();
                    }
                    else {
                        deferred.reject(data);
                    }
                }        
            })
            .error(function(data, status, headers, config) {
                console.log('ERROR: while loading who has/buys/sells list, API returned error ' + data.error_code);
            });
        return deferred.promise;
    };

    // Service call to load gamer profile
    this.gamer_by_id = function(gamer_id){
        var deferred = $q.defer();
        $http
            .post(gbgConfig.api_url + 'gamer_by_id',{gamer_id:gamer_id})
            .success(function(data, status, headers, config){
                if (data.result === 'okay'){
                    deferred.resolve(data);
                }
                else {
                    if (data.error_code === 101 || data.error_code === 102){
                        // api key error, should go to login page
                        AccountServ.logout();
                    }
                    else {
                        deferred.reject(data);
                    }
                }        
            })
            .error(function(data, status, headers, config) {
                console.log('ERROR: while loading gamer profile, API returned error ' + data.error_code);
            });
        return deferred.promise;
    };

    // Service call to load gamer_list by sold count, the topseller list in nearme_tab
    //this.gamerlist_by_soldcount = function(items, page){ //cache enabled
    //    var deferred = $q.defer();
    //
    //    // try to load from cache
    //    var current_time = new Date().getTime() / 1000;
    //    var cache_time = $localstorage.get('gamerlist_by_soldcount_'+items+'_'+page+'_time');
    //    if (cache_time && (current_time < parseInt(cache_time) + gbgConfig.cache_expire_seconds)) {
    //        deferred.resolve($localstorage.getObject('gamerlist_by_soldcount_'+items+'_'+page));
    //        return deferred.promise;
    //    }
    //
    //    $http
    //        .post(gbgConfig.api_url + 'gamerlist_by_soldcount',{items:items, page:page})
    //        .success(function(data, status, headers, config){
    //            if (data.result === 'okay'){
    //                deferred.resolve(data);
    //
    //                // save to cache
    //                $localstorage.set('gamerlist_by_soldcount_'+items+'_'+page+'_time', current_time);
    //                $localstorage.setObject('gamerlist_by_soldcount_'+items+'_'+page, data);
    //            }
    //            else {
    //                if (data.error_code === 101 || data.error_code === 102){
    //                    // api key error, should go to login page
    //                    AccountServ.logout();
    //                }
    //                else {
    //                    deferred.reject(data);
    //                }
    //            }
    //        })
    //        .error(function(data, status, headers, config) {
    //            console.log('ERROR: while loading top sellers, API returned error ' + data.error_code);
    //        });
    //    return deferred.promise;
    //};

    // Service call to like a gamer
    this.gamer_favourite_add = function(gamer_id){
        // clear cache on all likes
        $localstorage.clearGroup('favourite_by_gamer');

        var deferred = $q.defer();
        $http
            .post(gbgConfig.api_url + 'gamer_favourite_add',{gamer_id:gamer_id})
            .success(function(data, status, headers, config){
                if (data.result === 'okay'){
                    deferred.resolve(data);
                }
                else {
                    if (data.error_code === 101 || data.error_code === 102){
                        // api key error, should go to login page
                        AccountServ.logout();
                    }
                    else {
                        deferred.reject(data);
                    }
                }        
            })
            .error(function(data, status, headers, config) {
                console.log('ERROR: while like a gamer, API returned error ' + data.error_code);
            });
        return deferred.promise;
    };

    // Service call to unlike a gamer
    this.gamer_favourite_remove = function(gamer_id){
        // clear cache on all likes
        $localstorage.clearGroup('favourite_by_gamer');

        var deferred = $q.defer();
        $http
            .post(gbgConfig.api_url + 'gamer_favourite_remove',{gamer_id:gamer_id})
            .success(function(data, status, headers, config){
                if (data.result === 'okay'){
                    deferred.resolve(data);
                }
                else {
                    if (data.error_code === 101 || data.error_code === 102){
                        // api key error, should go to login page
                        AccountServ.logout();
                    }
                    else {
                        deferred.reject(data);
                    }
                }        
            })
            .error(function(data, status, headers, config) {
                console.log('ERROR: while unlike a gamer, API returned error ' + data.error_code);
            });
        return deferred.promise;
    };

    // Service call to provide comment to a gamer
    this.gamer_rate = function(gamer_id, rate_type, deal_id, rate_score, rate_comment){
        // clear cache on all likes
        $localstorage.clearGroup('rate_by_gamer');

        var deferred = $q.defer();
        $http
            .post(gbgConfig.api_url + 'gamer_rate',{gamer_id:gamer_id, rate_type:rate_type, deal_id:deal_id, rate_score:rate_score, rate_comment:rate_comment})
            .success(function(data, status, headers, config){
                if (data.result === 'okay'){
                    deferred.resolve(data);
                }
                else {
                    if (data.error_code === 101 || data.error_code === 102){
                        // api key error, should go to login page
                        AccountServ.logout();
                    }
                    else {
                        deferred.reject(data);
                    }
                }        
            })
            .error(function(data, status, headers, config) {
                console.log('ERROR: while giving a review to gamer, API returned error ' + data.error_code);
            });
        return deferred.promise;
    };

    // Service call to edit the ME profile under tab ME
    this.gamer_editprofile = function(nickname, email, city, description){
        var deferred = $q.defer();
        $http
            .post(gbgConfig.api_url + 'gamer_editprofile',{nickname:nickname, email:email, city:city, description: description})
            .success(function(data, status, headers, config){
                if (data.result === 'okay'){
                    $localstorage.set('me_country', data.country);
                    deferred.resolve(data);
                }
                else {
                    if (data.error_code === 101 || data.error_code === 102){
                        // api key error, should go to login page
                        AccountServ.logout();
                    }
                    else {
                        deferred.reject(data);
                    }
                }        
            })
            .error(function(data, status, headers, config) {
                console.log('ERROR: while editing gamer profile, API returned error ' + data.error_code);
            });
        return deferred.promise;
    };

    // uploading gamer profile picture
    this.gamer_uploadpic = function(image){
        var api_key = $localstorage.get('api_key');
        var deferred = $q.defer();

        var options         = new FileUploadOptions();
        options.fileKey     = "file";
        options.fileName    = image.substr(image.lastIndexOf('/') + 1);
        options.mimeType    = "image/jpeg";

        var headers         = {'gbgapikey':api_key};
        options.headers     = headers;

        $cordovaFile.uploadFile(gbgConfig.api_url + 'gamer_uploadpic', image, options).then(function(data) {
            var response = JSON.parse(data.response);
            if (response.result === "okay"){
                deferred.resolve(response);
            }
            else {
                deferred.reject(response)
            }
        }, function(err) {
            console.log("ERROR: while uploading the gamer profile picture " + JSON.stringify(err));
        });

        return deferred.promise;
    };

    // Service call to load all the favs for each gamer
    this.favourite_by_gamer = function(gamer_id, items, page){ //cache enabled
        var deferred = $q.defer();

        // try to load from cache
        var current_time = new Date().getTime() / 1000;
        var cache_time = $localstorage.get('favourite_by_gamer_'+gamer_id+'_'+items+'_'+page+'_time');
        if (cache_time && (current_time < parseInt(cache_time) + gbgConfig.cache_expire_seconds)) {
            deferred.resolve($localstorage.getObject('favourite_by_gamer_'+gamer_id+'_'+items+'_'+page));
            return deferred.promise;
        }

        $http
            .post(gbgConfig.api_url + 'favourite_by_gamer',{gamer_id:gamer_id, items:items, page:page})
            .success(function(data, status, headers, config){
                if (data.result === 'okay'){
                    deferred.resolve(data);

                    // save to cache
                    $localstorage.set('favourite_by_gamer_'+gamer_id+'_'+items+'_'+page+'_time', current_time);
                    $localstorage.setObject('favourite_by_gamer_'+gamer_id+'_'+items+'_'+page, data);
                }
                else {
                    if (data.error_code === 101 || data.error_code === 102){
                        // api key error, should go to login page
                        AccountServ.logout();
                    }
                    else {
                        deferred.reject(data);
                    }
                }        
            })
            .error(function(data, status, headers, config) {
                console.log('ERROR: while loading favourite for gamer, API returned error ' + data.error_code);
            });
        return deferred.promise;
    };

    // Service call to load all the rates and reviews for each gamer
    this.rate_by_gamer = function(gamer_id, items, page){ //cache enabled
        var deferred = $q.defer();

        // try to load from cache
        var current_time = new Date().getTime() / 1000;
        var cache_time = $localstorage.get('rate_by_gamer_'+gamer_id+'_'+items+'_'+page+'_time');
        if (cache_time && (current_time < parseInt(cache_time) + gbgConfig.cache_expire_seconds)) {
            deferred.resolve($localstorage.getObject('rate_by_gamer_'+gamer_id+'_'+items+'_'+page));
            return deferred.promise;
        }

        $http
            .post(gbgConfig.api_url + 'rate_by_gamer',{gamer_id:gamer_id, items:items, page:page})
            .success(function(data, status, headers, config){
                if (data.result === 'okay'){
                    deferred.resolve(data);

                    // save to cache
                    $localstorage.set('rate_by_gamer_'+gamer_id+'_'+items+'_'+page+'_time', current_time);
                    $localstorage.setObject('rate_by_gamer_'+gamer_id+'_'+items+'_'+page, data);
                }
                else {
                    if (data.error_code === 101 || data.error_code === 102){
                        // api key error, should go to login page
                        AccountServ.logout();
                    }
                    else {
                        deferred.reject(data);
                    }
                }
            })
            .error(function(data, status, headers, config) {
                console.log('ERROR: while loading rates and reivews for gamer, API returned error ' + data.error_code);
            });
        return deferred.promise;
    };

    // Service call to load the different metrics for each gamer, used in sold, bought game list
    this.gamer_deal_record = function(gamer_id, deal_type, items, page){
        var deferred = $q.defer();
        $http
            .post(gbgConfig.api_url + 'gamer_deal_record',{gamer_id:gamer_id, deal_type:parseInt(deal_type), items:items, page:page})
            .success(function(data, status, headers, config){
                if (data.result === 'okay'){
                    deferred.resolve(data);
                }
                else {
                    if (data.error_code === 101 || data.error_code === 102){
                        // api key error, should go to login page
                        AccountServ.logout();
                    }
                    else {
                        deferred.reject(data);
                    }
                } 
            })
            .error(function(data, status, headers, config){
                console.log('ERROR: while loading sold/bought games for gamer, API returned error ' + data.error_code)
            });
        return deferred.promise;
    };

    this.post_to_kijiji = function(collection_id){
        var deferred = $q.defer();
        $http
            .post(gbgConfig.api_url + 'post_to_kijiji',{collection_id:collection_id})
            .success(function(data, status, headers, config){
                if (data.result === 'okay'){
                    deferred.resolve(data);
                }
                else {
                    if (data.error_code === 101 || data.error_code === 102){
                        // api key error, should go to login page
                        AccountServ.logout();
                    }
                    else {
                        deferred.reject(data);
                    }
                }
            })
            .error(function(data, status, headers, config){
                console.log('ERROR: while loading sold/bought games for gamer, API returned error ' + data.error_code)
            });
        return deferred.promise;
    };

    this.post_to_kijiji_confirm = function(collection_id, ad_title, price, ad_type, city, province, email, post_code, description, classifieds_name){
        var deferred = $q.defer();
        $http
            .post(gbgConfig.api_url + 'post_to_kijiji_confirm',{collection_id:collection_id, ad_title:ad_title,
                price:price, ad_type:ad_type, city:city, province:province, email:email, post_code:post_code,
                description:description, classifieds_name:classifieds_name})
            .success(function(data, status, headers, config){
                if (data.result === 'okay'){
                    deferred.resolve(data);
                }
                else {
                    if (data.error_code === 101 || data.error_code === 102){
                        // api key error, should go to login page
                        AccountServ.logout();
                    }
                    else {
                        deferred.reject(data);
                    }
                }
            })
            .error(function(data, status, headers, config){
                console.log('ERROR: while loading sold/bought games for gamer, API returned error ' + data.error_code)
            });
        return deferred.promise;
    };
});
//EOF