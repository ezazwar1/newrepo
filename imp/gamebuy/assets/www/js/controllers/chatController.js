angular.module('chat.controllers', [])

    .controller('ThreadListCtrl', function ($scope, ChatServ, $state, $localstorage, UtilServ, $ionicScrollDelegate) {
        $scope.data         = {};

        $scope.data.notifications                      = [];
        $scope.data.notifications_placeholderpic_flag  = false;
        $scope.data.notifications_active               = false;

        $scope.data.threads = (($localstorage.getObject('threads', '[]') === '[]') ? [] : $localstorage.getObject('threads', '[]'));
        $scope.data.chats_placeholderpic_flag    = false;
        $scope.data.threads_active               = true;

        $scope.init_threads = function () {
            // always return to the top, since the latest thread is on the top
            $ionicScrollDelegate.scrollTop(false);

            var promise = ChatServ.thread_by_gamer();
            promise.then(
                function (data) {
                    $scope.data.error_code = data.error_code;
                    if ($scope.data.error_code === "NoErrors"){
                        $scope.data.chats_placeholderpic_flag = false;
                        $scope.data.threads = data.threads;
                        $localstorage.setObject('threads', data.threads);
                    }
                    else {
                        $scope.data.chats_placeholderpic_flag = true;
                        $scope.data.ThreadListCtrl_message = UtilServ.get_error_message($scope.data.error_code);
                        $scope.data.threads = [];
                        $localstorage.setObject('threads', '[]');
                    }
                }
                ,
                function (data) {
                    console.log('ERROR: while loading thread list ' + data.error_code);
                }
            );
        };

        $scope.goto_chat_thread_delete = function (thread_id) {
            // delete from ui side first
            for (var i = 0; i < $scope.data.threads.length; i++) {
                if ($scope.data.threads[i].thread_id === thread_id) {
                    $scope.data.threads.splice(i, 1);
                    $localstorage.setObject('threads', $scope.data.threads);
                    $localstorage.clear('thread_' + thread_id);
                    break;
                }
            }

            // delete remotely
            var promise = ChatServ.thread_delete(thread_id);
            promise.then(
                function (data) {
                    $scope.init_threads();
                }
                ,
                function (data) {
                    console.log('ERROR: while deleting thread ' + data.error_code);
                }
            );
        };

        //$scope.goto_notification_list = function(){
        //    routing_url = "tab.chats_notification";
        //    $state.go(routing_url);
        //};

        $scope.$on('pushChatReceived', function (event, notification) {
            $scope.init_threads();
        });

        $scope.init_notifications = function () {
            // return to the top after tab switch, since not in-house cache is used
            if ($scope.data.tab_switch_tonotification === true || $scope.data.tab_switch_tonotification === undefined){
                $ionicScrollDelegate.scrollTop(false);
            }

            var promise = ChatServ.notification_by_gamer();
            promise.then(
                function (data) {
                    $scope.data.error_code = data.error_code;
                    if ($scope.data.error_code === "NoErrors"){
                        $scope.data.notification_placeholderpic_flag = false;
                        $scope.data.notifications = data.notifications;
                    }
                    else {
                        $scope.data.notification_placeholderpic_flag = true;
                        $scope.data.NotificationListCtrl_message = UtilServ.get_error_message($scope.data.error_code);
                        $scope.data.notifications = [];
                    }
                }
                ,
                function (data) {
                    console.log('ERROR: while loading thread list ' + data.error_code);
                }
            );
        };

        $scope.notification_delete = function (notification_id) {
            // delete remotely
            var promise = ChatServ.notification_delete(notification_id);
            promise.then(
                function (data) {
                    $scope.init_notifications();
                }
                ,
                function (data) {
                    console.log('ERROR: while deleting notification ' + data.error_code);
                }
            );
        };

        $scope.goto_router = function(notification_id){
            for (var i = 0; i<$scope.data.notifications.length; i++){
                if (notification_id === $scope.data.notifications[i].notification_id){
                    console.log($scope.data.notifications[i].type);
                    if ($scope.data.notifications[i].type === 'match'){
                        $scope.goto_matches();
                    }
                    else if($scope.data.notifications[i].type === 'watch'){
                        $scope.goto_collection_profile($scope.data.notifications[i].collection_id);
                    }
                    else if($scope.data.notifications[i].type === 'deal'){
                        console.log($scope.data.notifications[i].deal_id);
                        $scope.goto_deal_profile($scope.data.notifications[i].deal_id);
                    }
                    else if($scope.data.notifications[i].type === 'reminder'){
                        console.log($scope.data.notifications[i].deal_id);
                        $scope.goto_deal_profile($scope.data.notifications[i].deal_id);
                    }
                    else {
                        console.log("Unexpected notification type");
                    }
                }

            }
        };

        $scope.goto_deal_profile = function(deal_id){
            var routing_url = "tab.chats_deal_profile";
            $state.go(routing_url, {deal_id: deal_id, tab_name: 'chats'});
        };

        $scope.goto_collection_profile = function(collection_id){
            var routing_url = "tab.chats_collection_profile";
            $state.go(routing_url, {collection_id: collection_id, tab_name: 'chats'});
        };

        $scope.goto_matches = function() {
            $state.go("tab.nearme");
        };

        $scope.decide_shown_list = function(list_name){
            if (list_name === 1 && $scope.data.threads_active === false){
                $scope.data.notifications         = [];
                $scope.data.threads_active        = true;
                $scope.data.notifications_active  = false;

                // for tab switch check condition
                $scope.data.tab_switch_tonotification   = false;
                $scope.data.tab_switch_tothread         = true;

                $scope.init_threads();
            }
            else if (list_name === 2 && $scope.data.notifications_active === false){
                $scope.data.threads               = [];
                $scope.data.threads_active        = false;
                $scope.data.notifications_active  = true;

                // for tab switch check condition
                $scope.data.tab_switch_tothread         = false;
                $scope.data.tab_switch_tonotification   = true;

                $scope.init_notifications();
            }
            else {
                console.log("tab did not change");
            }
        };

        $scope.init_threads();
    })

    .controller('ChatCtrl', function ($scope, $state, $stateParams, $ionicScrollDelegate, ChatServ, $localstorage, $ionicHistory) {
        $scope.data                 = {};
        $scope.data.chats           = [];
        $scope.data.thread_id       = 0;
        $scope.data.newest_chat_id  = 0;
        $scope.data.oldest_chat_id  = 9007199254740992;
        $scope.data.speaker_name    = $localstorage.get('username', 'me');
        $scope.data.current_chat    = $stateParams.currentchat_placeholder;

        var valid_tab_names = ["chats"];

        $scope.init = function () {
            $ionicHistory.clearCache();
            console.log("run clear cache");
            $scope.data.thread_id   = $stateParams.thread_id;
            $scope.data.chats       = $localstorage.getObject('thread_' + $scope.data.thread_id, '[]');

            // finding the newest and oldest none-local chat ids
            if ($scope.data.chats.length > 0) {
                for (var i=0; i<$scope.data.chats.length; i++){
                    if (!$scope.data.chats[i].local){
                        if ($scope.data.oldest_chat_id > $scope.data.chats[i].chat_id)
                            $scope.data.oldest_chat_id = $scope.data.chats[i].chat_id;
                        if ($scope.data.newest_chat_id < $scope.data.chats[i].chat_id)
                            $scope.data.newest_chat_id = $scope.data.chats[i].chat_id;
                    }
                }
            }

            // load more chat from remote server
            if ($scope.data.newest_chat_id == 0)
            {
                var promise = ChatServ.chat_by_thread_older($scope.data.thread_id, 0);
            } else {
                var promise = ChatServ.chat_by_thread_newer($scope.data.thread_id, $scope.data.newest_chat_id);
            }
            promise.then(
                function (data) {
                    // delete local ones
                    var cleared_chats = [];
                    for (var i=0; i<$scope.data.chats.length; i++){
                        if (!$scope.data.chats[i].local) {
                            cleared_chats.push($scope.data.chats[i]);
                        }
                    }
                    $scope.data.chats = cleared_chats;

                    // append chats from server
                    $scope.data.chats = $scope.data.chats.concat(data.chats.reverse());

                    // update newest and oldest chat_id
                    if ($scope.data.chats.length > 0) {
                        $scope.data.newest_chat_id = $scope.data.chats[$scope.data.chats.length - 1].chat_id;
                        $scope.data.oldest_chat_id = $scope.data.chats[0].chat_id;
                    }

                    $ionicScrollDelegate.scrollBottom(true);

                    // cache to make chat page load faster, cache 50 chats
                    var chat_length = $scope.data.chats.length;
                    var fifty_ahead = chat_length >= 50 ? chat_length - 50 : 0;
                    $localstorage.setObject('thread_' + $scope.data.thread_id, $scope.data.chats.slice(fifty_ahead, chat_length));
                }
                ,
                function (data) {
                    console.log('ERROR: while loading chats ' + data.error_code);
                }
            );
        };

        $scope.$on( "$ionicView.enter", function( scopes, states ) {
            $ionicScrollDelegate.scrollBottom(false);
        });

        $scope.$on('pushChatReceived', function (event, notification) {
            var promise = ChatServ.chat_by_thread_newer($scope.data.thread_id, $scope.data.newest_chat_id);
            promise.then(
                function (data) {
                    var new_chats = data.chats.reverse();
                    if (new_chats.length > 0) {
                        // delete local ones
                        var cleared_chats = [];
                        for (var i=0; i<$scope.data.chats.length; i++){
                            if (!$scope.data.chats[i].local) {
                                cleared_chats.push($scope.data.chats[i]);
                            }
                        }
                        $scope.data.chats = cleared_chats;

                        // append new chats
                        $scope.data.chats = $scope.data.chats.concat(new_chats);

                        // update newest chat_id
                        $scope.data.newest_chat_id = $scope.data.chats[$scope.data.chats.length - 1].chat_id;

                        $ionicScrollDelegate.scrollBottom(false);

                        // cache to make chat page load faster
                        var chat_length = $scope.data.chats.length;
                        var fifty_ahead = chat_length >= 50 ? chat_length - 50 : 0;
                        $localstorage.setObject('thread_' + $scope.data.thread_id, $scope.data.chats.slice(fifty_ahead, chat_length));
                    }
                }
                ,
                function (data) {
                    console.log('ERROR: while receving chat ' + data.error_code);
                }
            );
        });

        $scope.add_chat = function () {
            if ($scope.data.current_chat.length <= 0)
                return;

            // create local chat //<TODO replace me with real name>
            $scope.data.chats.push({'speaker_name': $scope.data.speaker_name, 'content': $scope.data.current_chat, 'created_on': new Date(), 'local': 'true'});
            $ionicScrollDelegate.scrollBottom(true);

            // clear chat input
            var new_chat = $scope.data.current_chat;
            $scope.data.current_chat = "";

            var promise = ChatServ.chat_add($scope.data.thread_id, new_chat);
            promise.then(
                function (data) {
                    console.log('returned new chat id from server: '+ data.chat.chat_id);
                }
                ,
                function (data) {
                    console.log('ERROR: while adding chat ' + data.error_code);
                }
            );
        };

        $scope.load_older_chats = function () {
            var promise = ChatServ.chat_by_thread_older($scope.data.thread_id, $scope.data.oldest_chat_id);
            promise.then(
                function (data) {
                    var old_chats = data.chats.reverse();
                    if (old_chats.length > 0) {
                        // append new chats
                        $scope.data.chats = old_chats.concat($scope.data.chats);

                        // update oldest chat_id
                        $scope.data.oldest_chat_id = $scope.data.chats[0].chat_id;

                        // cache to make chat page load faster, cache 50 chats
                        var chat_length = $scope.data.chats.length;
                        var fifty_ahead = chat_length >= 50 ? chat_length - 50 : 0;
                        $localstorage.setObject('thread_' + $scope.data.thread_id, $scope.data.chats.slice(fifty_ahead, chat_length));
                    }
                    $scope.$broadcast('scroll.refreshComplete');
                }
                ,
                function (data) {
                    console.log('ERROR: while loading older chats ' + data.error_code);
                }
            );
        };

        $scope.goto_gamer_profile_by_tab = function (tab_name) {
            $scope.gamer_id  = $stateParams.partner_id;
            $scope.thread_id = $stateParams.thread_id;
            $ionicHistory.nextViewOptions({
                disableBack: true
            });

            if (valid_tab_names.indexOf(tab_name) >= 0) {
                var routing_url = "tab." + tab_name + "_gamer_profile";
                $state.go(routing_url, {gamer_id: $scope.gamer_id, tab_name: tab_name, thread_id: $scope.thread_id});
            }
            else {
                console.log("Current tab is not valid for routing from chat which is " + tab_name);
            }
        };

        $scope.init();

    });
