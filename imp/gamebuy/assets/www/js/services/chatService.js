angular.module('chat.services', [])

    .service('ChatServ', function ($http, $q, gbgConfig, AccountServ) {

        this.thread_by_gamer = function () {
            //Loading all the chat thread in the chat tab
            var deferred = $q.defer();
            $http
                .post(gbgConfig.api_url + 'thread_by_gamer')
                .success(function (data, status, headers, config) {
                    if (data.result === 'okay') {
                        deferred.resolve(data);
                    }
                    else {
                        if (data.error_code === 101 || data.error_code === 102) {
                            // api key error, should go to login page
                            AccountServ.logout();
                        }
                        else {
                            deferred.reject(data);
                        }
                    }
                })
                .error(function (data, status, headers, config) {
                    console.log("loading chat threads: post error");
                });
            return deferred.promise;
        };

        this.thread_add = function (gamer_id) {
            var deferred = $q.defer();
            $http
                .post(gbgConfig.api_url + 'thread_add', {gamer_id: gamer_id})
                .success(function (data, status, headers, config) {
                    if (data.result === 'okay') {
                        deferred.resolve(data);
                    }
                    else {
                        if (data.error_code === 101 || data.error_code === 102) {
                            // api key error, should go to login page
                            AccountServ.logout();
                        }
                        else {
                            deferred.reject(data);
                        }
                    }
                })
                .error(function (data, status, headers, config) {
                    console.log("add chat thread: post error");
                });
            return deferred.promise;
        };

        this.thread_delete = function (thread_id) {
            var deferred = $q.defer();
            $http
                .post(gbgConfig.api_url + 'thread_delete', {thread_id: thread_id})
                .success(function (data, status, headers, config) {
                    if (data.result === 'okay') {
                        deferred.resolve(data);
                    }
                    else {
                        if (data.error_code === 101 || data.error_code === 102) {
                            // api key error, should go to login page
                            AccountServ.logout();
                        }
                        else {
                            deferred.reject(data);
                        }
                    }
                })
                .error(function (data, status, headers, config) {
                    console.log("delete chat thread: post error");
                });
            return deferred.promise;
        };

        this.chat_by_thread_older = function (thread_id, chat_id) {
            var deferred = $q.defer();
            $http
                .post(gbgConfig.api_url + 'chat_by_thread_older', {thread_id: thread_id, chat_id: chat_id})
                .success(function (data, status, headers, config) {
                    if (data.result === 'okay') {
                        deferred.resolve(data);
                    }
                    else {
                        if (data.error_code === 101 || data.error_code === 102) {
                            // api key error, should go to login page
                            AccountServ.logout();
                        }
                        else {
                            deferred.reject(data);
                        }
                    }
                })
                .error(function (data, status, headers, config) {
                    console.log("older chat: post error");
                });
            return deferred.promise;
        };

        this.chat_by_thread_newer = function (thread_id, chat_id) {
            var deferred = $q.defer();
            $http
                .post(gbgConfig.api_url + 'chat_by_thread_newer', {thread_id: thread_id, chat_id: chat_id})
                .success(function (data, status, headers, config) {
                    if (data.result === 'okay') {
                        deferred.resolve(data);
                    }
                    else {
                        if (data.error_code === 101 || data.error_code === 102) {
                            // api key error, should go to login page
                            AccountServ.logout();
                        }
                        else {
                            deferred.reject(data);
                        }
                    }
                })
                .error(function (data, status, headers, config) {
                    console.log("newer chat: post error");
                });
            return deferred.promise;
        };

        this.chat_add = function (thread_id, content) {
            var deferred = $q.defer();
            $http
                .post(gbgConfig.api_url + 'chat_add', {thread_id: thread_id, content: content})
                .success(function (data, status, headers, config) {
                    if (data.result === 'okay') {
                        deferred.resolve(data);
                    }
                    else {
                        if (data.error_code === 101 || data.error_code === 102) {
                            // api key error, should go to login page
                            AccountServ.logout();
                        }
                        else {
                            deferred.reject(data);
                        }
                    }
                })
                .error(function (data, status, headers, config) {
                    console.log("add chat: post error");
                });
            return deferred.promise;
        };

        this.notification_by_gamer = function () {
            //Loading all the notifications
            var deferred = $q.defer();
            $http
                .post(gbgConfig.api_url + 'notification_by_gamer')
                .success(function (data, status, headers, config) {
                    if (data.result === 'okay') {
                        deferred.resolve(data);
                    }
                    else {
                        if (data.error_code === 101 || data.error_code === 102) {
                            // api key error, should go to login page
                            AccountServ.logout();
                        }
                        else {
                            deferred.reject(data);
                        }
                    }
                })
                .error(function (data, status, headers, config) {
                    console.log("loading chat threads: post error");
                });
            return deferred.promise;
        };

        this.notification_delete = function (notification_id) {
            //Delete the notification
            var deferred = $q.defer();
            $http
                .post(gbgConfig.api_url + 'notification_delete', {notification_id: notification_id})
                .success(function (data, status, headers, config) {
                    if (data.result === 'okay') {
                        deferred.resolve(data);
                    }
                    else {
                        if (data.error_code === 101 || data.error_code === 102) {
                            // api key error, should go to login page
                            AccountServ.logout();
                        }
                        else {
                            deferred.reject(data);
                        }
                    }
                })
                .error(function (data, status, headers, config) {
                    console.log("loading chat threads: post error");
                });
            return deferred.promise;
        };
    });