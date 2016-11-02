//------------------------------------------------------------
// Deal Service
//------------------------------------------------------------
angular.module('deal.services', [])

.service('DealServ', function($http, $q, gbgConfig, AccountServ){

    //Service call to load single deal profile in deal_profile.html
    this.deal_by_id = function(deal_id){
        var deferred = $q.defer();
        $http
            .post(gbgConfig.api_url + 'deal_by_id', {deal_id:deal_id})
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
                console.log('ERROR: while loading deal profile, API returned error ' + data.error_code);
            });
        return deferred.promise;
     };

    //Service call to load all the ongoing deals of the account owner in tab_deals.html
	this.deal_by_gamer = function(){ 
        var deferred = $q.defer();
        $http
            .post(gbgConfig.api_url + 'deal_by_gamer')
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
                console.log("------------ deal by gamer, service called");
            })
            .error(function(data, status, headers, config){
                console.log('ERROR: while loading deal items for gamer, API returned error ' + data.error_code);
            });
        return deferred.promise;
    };

    //Buyer Action, service call to request to buy a game, in collection_profile.html
	this.deal_request = function(collection_id, use_credit){
        var deferred = $q.defer();
        $http
            .post(gbgConfig.api_url + 'deal_request', {collection_id:collection_id, use_credit:use_credit})
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
                console.log('ERROR: while offering to buy, API returned error ' + data.error_code);
            });
        return deferred.promise;
    };  

    //Seller Action, service call to accept a buy request, in deal_profile.html
	this.deal_accept = function(deal_id){ 
        var deferred = $q.defer();
        $http
            .post(gbgConfig.api_url + 'deal_accept', {deal_id:deal_id})
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
            .error(function(data, status, headers, config) {
                console.log('ERROR: while accepting the offer, API returned error ' + data.error_code);
            });
        return deferred.promise;
    };  

    //Buyer Action, service call to withdraw a buy request, in deal_profile.html
	this.deal_buyer_withdraw = function(deal_id){ 
        var deferred = $q.defer();
        $http
            .post(gbgConfig.api_url + 'deal_buyer_withdraw', {deal_id:deal_id})
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
            .error(function(data, status, headers, config) {
                console.log('ERROR: while withdrawing the offer, API returned error ' + data.error_code);
            });
        return deferred.promise;
    };  

    //Seller Action, service call to reject a buy request, in deal_profile.html
	this.deal_seller_reject = function(deal_id){ 
        var deferred = $q.defer();
        $http
            .post(gbgConfig.api_url + 'deal_seller_reject', {deal_id:deal_id})
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
                console.log('ERROR: while reject the offer request, API returned error ' + data.error_code);
            });
        return deferred.promise;
    };  

    //Buyer Action, service call to receive an accepted deal, in deal_profile.html
    this.deal_receive = function(deal_id){ 
        var deferred = $q.defer();
        $http
            .post(gbgConfig.api_url+'deal_receive', {deal_id:deal_id})
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
                console.log('ERROR: while receving the item, API returned error ' + data.error_code);
            });
        return deferred.promise;
    };

    //Buyer Action, service call to cancel a deal, in deal_profile.html
    this.deal_buyer_cancel = function(deal_id){ 
        var deferred = $q.defer();
        $http
            .post(gbgConfig.api_url + 'deal_buyer_cancel', {deal_id:deal_id})
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
                console.log('ERROR: while buyer cancels the offer, API returned error ' + data.error_code);
            });
        return deferred.promise;
    };

    //Seller Action, service call to cancel a deal, in deal_profile.html
    this.deal_seller_cancel = function(deal_id){ 
        var deferred = $q.defer();
        $http
            .post(gbgConfig.api_url + 'deal_seller_cancel', {deal_id:deal_id})
            .success(function(data, status, headers, config){
                if (data.result === 'okay'){
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
            .error(function(data, status, headers, config) {
                console.log('ERROR: while seller cancels the offer, API returned error ' + data.error_code);
            });
        return deferred.promise;
    }; 

    //Buyer Action, service call to delete a deal, in deal_profile.html
    this.deal_buyer_delete = function(deal_id){ 
        var deferred = $q.defer();
        $http
            .post(gbgConfig.api_url + 'deal_buyer_delete', {deal_id:deal_id})
            .success(function(data, status, headers, config){
                if(data.result === 'okay'){
                    deferred.resolve(data);
                }
                else {
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
                console.log('ERROR: while buyer deletes the deal item, API returned error ' + data.error_code);
            });
        return deferred.promise;
    }; 

    //Buyer Action, service call to call a deal, in deal_profile.html
    this.deal_seller_delete = function(deal_id){ 
        var deferred = $q.defer();
        $http
            .post(gbgConfig.api_url + 'deal_seller_delete', {deal_id:deal_id})
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
            .error(function(data, status, headers, config) {
                console.log('ERROR: while seller deletes the deal item, API returned error ' + data.error_code);
            });
        return deferred.promise;
    };

    this.watch_add = function(collection_id, price){
        var deferred = $q.defer();
        $http
            .post(gbgConfig.api_url + 'watch_add', {collection_id:collection_id, price:price})
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
            .error(function(data, status, headers, config) {
                console.log('ERROR: watch_add(), API returned error ' + data.error_code);
            });
        return deferred.promise;
    };

    this.watch_delete = function(collection_id){
        var deferred = $q.defer();
        $http
            .post(gbgConfig.api_url + 'watch_delete', {collection_id:collection_id})
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
            .error(function(data, status, headers, config) {
                console.log('ERROR: watch_delete(), API returned error ' + data.error_code);
            });
        return deferred.promise;
    };

    this.watch_by_collection = function(collection_id){
        var deferred = $q.defer();
        $http
            .post(gbgConfig.api_url + 'watch_by_collection', {collection_id:collection_id})
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
            .error(function(data, status, headers, config) {
                console.log('ERROR: watch_by_collection(), API returned error ' + data.error_code);
            });
        return deferred.promise;
    };

    this.watch_by_gamer = function(){
        var deferred = $q.defer();
        $http
            .post(gbgConfig.api_url + 'watch_by_gamer', {})
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
                console.log("------------ watch by gamer, service called");
            })
            .error(function(data, status, headers, config) {
                console.log('ERROR: watch_by_gamer(), API returned error ' + data.error_code);
            });
        return deferred.promise;
    };

});
//EOF