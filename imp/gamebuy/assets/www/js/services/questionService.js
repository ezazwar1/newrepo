//------------------------------------------------------------
// Question Service
//------------------------------------------------------------
angular.module('question.services', [])

    .service('QuestionServ', function($http, $q, gbgConfig, AccountServ){

        this.question_sets_all = function(){
            var deferred = $q.defer();
            $http
                .post(gbgConfig.api_url + 'question_sets_all')
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
                    console.log('ERROR: while loading question sets, API returned error ' + data.error_code);
                });
            return deferred.promise;
        };

        //Service call to load questions for each question set
        this.question_by_set_id = function(question_set_id, list_order){
            var deferred = $q.defer();
            $http
                .post(gbgConfig.api_url + 'question_by_set_id', {question_set_id:question_set_id, list_order:list_order})
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
                    console.log('ERROR: while loading questions for question set, API returned error ' + data.error_code);
                });
            return deferred.promise;
        };

        //Add question to the question pool
        this.question_add = function(question_body, choice, answer){
            var deferred = $q.defer();
            $http
                .post(gbgConfig.api_url + 'question_add', {question_body:question_body, choice:choice, answer:answer})
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

        //Submit an answer to the question
        this.question_answer_submit = function(question_set_id, question_id, answer){
            var deferred = $q.defer();
            $http
                .post(gbgConfig.api_url + 'question_answer_submit', {question_set_id:question_set_id, question_id:question_id, answer:answer})
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

        //Submit an answer to the question
        this.question_setscore_by_id = function(question_set_id){
            var deferred = $q.defer();
            $http
                .post(gbgConfig.api_url + 'question_setscore_by_id', {question_set_id:question_set_id})
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