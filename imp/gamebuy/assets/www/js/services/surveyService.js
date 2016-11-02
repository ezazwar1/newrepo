//------------------------------------------------------------
// Survey Service
//------------------------------------------------------------
angular.module('survey.services', [])

    .service('SurveyServ', function($http, $q, gbgConfig, AccountServ){

        this.ape_available_platforms = function(){
            var deferred = $q.defer();
            $http
                .post(gbgConfig.api_url + 'ape_available_platforms')
                .success(function(data, status, headers, config){
                    if(data.result === 'okay'){
                        deferred.resolve(data);
                    }
                    else{
                        if (data.error_code === 101 || data.error_code === 102){
                            // api key error, should go to login page
                            AccountServ.logout();
                        }
                        else{
                            deferred.reject(data);
                        }
                    }
                })
                .error(function(data, status, headers, config){
                    console.log('ERROR: while loading survey for wish games, API returned error ' + data.error_code);
                });
            return deferred.promise;
        };

        //Service call to load survey for wish games
        this.ape_platform_to_wish = function(platforms){
            var deferred = $q.defer();
            $http
                .post(gbgConfig.api_url + 'ape_platform_to_wish', {platforms:platforms})
                .success(function(data, status, headers, config){
                    if(data.result === 'okay'){
                        deferred.resolve(data);
                    }
                    else{
                        if (data.error_code === 101 || data.error_code === 102){
                            // api key error, should go to login page
                            AccountServ.logout();
                        }
                        else{
                            deferred.reject(data);
                        }
                    }
                })
                .error(function(data, status, headers, config){
                    console.log('ERROR: while loading survey for wish games, API returned error ' + data.error_code);
                });
            return deferred.promise;
        };

        //Service call to load survey for sell games
        this.ape_wish_to_sell = function(wished_games){
            var deferred = $q.defer();
            $http
                .post(gbgConfig.api_url + 'ape_wish_to_sell', {wished_games:wished_games})
                .success(function(data, status, headers, config){
                    if(data.result === 'okay'){
                        deferred.resolve(data);
                    }
                    else{
                        if(data.error_code === 101 || data.error_code === 102){
                            // api key error, should go to login page
                            AccountServ.logout();
                        }
                        else{
                            deferred.reject(data);
                        }
                    }
                })
                .error(function(data, status, headers, config){
                    console.log('ERROR: while loading survey for sell games, API returned error ' + data.error_code);
                });
            return deferred.promise;
        };

        //Service call to add for sell games
        this.ape_add_to_sell = function(sell_games, price_unit){
            var deferred = $q.defer();
            $http
                .post(gbgConfig.api_url + 'ape_add_to_sell', {sell_games:sell_games, price_unit:price_unit})
                .success(function(data, status, headers, config){
                    if (data.result === 'okay'){
                        deferred.resolve(data);
                    }
                    else if (data.error_code === 101 || data.error_code === 102){
                        // api key error, should go to login page
                        AccountServ.logout();
                    }
                    else {
                        deferred.reject(data);
                    }
                })
                .error(function(data, status, headers, config){
                    console.log('ERROR: while adding sell games, API returned error ' + data.error_code);
                });
            return deferred.promise;
        };

    });
//EOF