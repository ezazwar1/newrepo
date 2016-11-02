angular.module('search.controllers', [])

    .controller('SearchCtrl', function ($scope, GameServ, QuestionServ, $state, $cordovaBarcodeScanner, $localstorage, $ionicPopup, $ionicBackdrop, $ionicHistory, $state) {

        $scope.input                = {};
        $scope.data                 = {};
        $scope.data.current_page    = 0;
        $scope.data.items           = 10;
        $scope.data.games           = [];
        $scope.search_disabled      = true;
        $scope.newValue_flag        = false;
        $scope.data.question_sets   = [];

        $scope.input.keyword        = $localstorage.get('search_previous_keyword') === undefined ? "" : $localstorage.get('search_previous_keyword');
        $scope.data.platform_filter = $localstorage.get('search_previous_platform_filter') === undefined ? "all" : $localstorage.get('search_previous_platform_filter');

        //if ($ionicHistory.forwardView() != null){
        //    $scope.input.keyword        = $localstorage.get('search_previous_keyword') === undefined ? "" : $localstorage.get('search_previous_keyword');
        //    $scope.data.platform_filter = $localstorage.get('search_previous_platform_filter') === undefined ? "all" : $localstorage.get('search_previous_platform_filter');
        //}
        //else {
        //    $scope.input.keyword        = "";
        //    $scope.data.platform_filter = "all";
        //    if ($localstorage.get('search_previous_keyword') != undefined){
        //        $localstorage.clear('search_previous_keyword');
        //    }
        //    if ($localstorage.get('search_previous_platform_filter') != undefined){
        //        $localstorage.clear('search_previous_platform_filter');
        //    }
        //}

        $scope.load_games_by_keyword = function () {
            var promise = GameServ.game_by_word($scope.input.keyword, $scope.data.platform_filter, $scope.data.items, $scope.data.current_page);
            promise.then(
                function (data) {
                    if ($scope.input.keyword.length > 0) {
                        $scope.data.games = data.games;
                    }
                }
                ,
                function (data) {
                    console.log('ERROR: find games by game name ' + data.error_code);
                }
            );
        };

        $scope.$watch("input.keyword", function (newValue, oldValue) {
            if (newValue != oldValue && newValue.length > 0) {
                $scope.newValue_flag = true;
                $scope.search_disabled = false;
                $scope.load_games_by_keyword();
            }
            else if (newValue === oldValue && newValue.length > 0){
                $scope.newValue_flag = false;
                $scope.search_disabled = false;
                $scope.data.games = [];
            }
            else {
                $scope.newValue_flag = false
                $scope.search_disabled = true;
                $scope.data.games = [];
            }
        });

        $scope.search = function () {
            $state.go('tab.search_result', {keyword: $scope.input.keyword, platform_filter: $scope.data.platform_filter}, {});
        };

        $scope.$on( "$ionicView.leave", function( scopes, states ) {
            $localstorage.set('search_previous_keyword', $scope.input.keyword);
            $localstorage.set('search_previous_platform_filter', $scope.data.platform_filter);

            $scope.input.keyword = "";
            $scope.data.platform_filter = "all";
            $scope.data.games = [];
        });

        $scope.scan = function () {
            $cordovaBarcodeScanner
                .scan()
                .then(function (result) {
                    console.log("We got a barcode\n" + "Result: " + result.text + "\n" +
                    "Format: " + result.format + "\n" + "Cancelled: " + result.cancelled);

                    if (result.cancelled)
                        return;

                    var promise = GameServ.game_by_code(result.text, result.format);
                    promise.then(
                        function (data) {
                            if (data.error_code === 'NoErrors') {
                                $state.go('tab.search_game_profile', {game_id: data.game.game_id});
                            }
                            else if (data.error_code === 'NoCodeFound') {
                                $scope.show_game_code_add_popup(result.text, result.format);
                            }
                        }
                        ,
                        function (data) {
                            concole.log('ERROR: find game by scanning ' + data.error_code);
                        }
                    );
                }, function (error) {
                    alert("Scanning failed: " + error);
                });
        };

        $scope.show_game_code_add_popup = function (code, format_type) {
            var action_popup = $ionicPopup.show({
                templateUrl: 'templates/popup_gamecode_add.html',
                scope: $scope
            });

            $scope.submit_code_thank = function () {
                action_popup.close();
                $ionicBackdrop.retain();
                var alertPopup = $ionicPopup.alert({
                    title: 'Thank You!! Please find and add your game by searching the game name',
                    template: ''
                });
                alertPopup.then(function(res) {
                    console.log('submitted');
                });
                var promise = GameServ.game_code_add(code, format_type, $scope.data.platform + ':' + $scope.data.title);
                promise.then(
                    function (data) {
                        $scope.data.title       = undefined;
                        $scope.data.platform    = undefined;
                    }
                    ,
                    function (data) {
                        console.log('Failed: ' + data.error_code);
                        $scope.data.title       = undefined;
                        $scope.data.platform    = undefined;
                    }
                );
            };

            $scope.cancel_button = function(){
                action_popup.close();
            };
        };

        //question related
        $scope.load_question_sets_all = function () {
            var promise = QuestionServ.question_sets_all();
            promise.then(
                function (data) {
                    if (data.error_code === "NoErrors") {
                        $scope.data.question_sets = data.question_sets_details;
                    }
                }
                ,
                function (data) {
                    console.log('ERROR: loading question sets ' + data.error_code);
                }
            );
        };

        $scope.pop_init = function() { //initialize the values in the pop up
            $scope.data.question_body = '';
            $scope.data.question_choice_A = '';
            $scope.data.question_choice_B = '';
            $scope.data.question_choice_C = '';
            $scope.data.question_choice_D = '';
            $scope.data.question_awswer = '';
            $scope.data.question_add_button = false;
        };

        $scope.show_action_popup = function(){
            $scope.data.action_template = 'templates/popup_question_add.html';

            var action_popup = $ionicPopup.show({
                templateUrl: $scope.data.action_template,
                scope: $scope
            });

            action_popup.then(function(res) {
                console.log('Tapped!', res);
            });

            $scope.close_action_popup = function() {
                action_popup.close();
                $scope.question_add_thank();
            };

            $scope.cancel_button = function(){
                action_popup.close();
            };
        };

        $scope.$watch('[data.question_body, data.question_awswer]', function (newValue) { //need at least the question and answer
            if (newValue[0] === undefined || newValue[0] === '' || newValue[1] === undefined || newValue[1] === ''){
                $scope.data.question_add_button = false;
            }
            else{
                $scope.data.question_add_button = true;
            }
        });

        $scope.question_add = function() {
            $scope.data.question_choice = $scope.data.question_choice_A + "+" + $scope.data.question_choice_B + "+" + $scope.data.question_choice_C + "+" + $scope.data.question_choice_D;
            var promise = QuestionServ.question_add($scope.data.question_body, $scope.data.question_choice, $scope.data.question_awswer);
            promise.then(
                function (data) {
                    if (data.error_code === "NoErrors") {
                        $scope.close_action_popup();
                    }
                }
                ,
                function (data) {
                    console.log('ERROR: loading question sets ' + data.error_code);
                }
            );
        };

        $scope.question_add_thank= function() {
            $ionicBackdrop.retain();
            var alertPopup = $ionicPopup.alert({
                title: 'Thank You! Your Question will be added to a question set after verification',
                template: ''
            });
            alertPopup.then(function(res) {
                $state.go('tab.search');
            });
        };

        $scope.goto_question_set = function(question_set_id, question_set_name, tab_name){
            //list_order = 0, 1st question of the question set
            var routing_url = "tab.search_question_page";
            $state.go(routing_url, {question_set_id:question_set_id, question_set_name:question_set_name, list_order: 0, tab_name: tab_name});
        };

        $scope.load_question_sets_all();

    })

    .controller('SearchResultCtrl', function ($scope, GameServ, $state, $stateParams, $ionicPopup, $ionicBackdrop, UtilServ) {
        $scope.data                                     = {};
        $scope.data.current_page                        = 0;
        $scope.data.items                               = 10;
        $scope.data.there_is_more                       = false;
        $scope.data.games                               = [];
        $scope.data.searchresults_placeholderpic_flag   = false;

        if ($stateParams.keyword != undefined)
            $scope.keyword = $stateParams.keyword;

        console.log($stateParams.platform_filter);
        if ($stateParams.platform_filter != undefined)
            $scope.platform_filter = $stateParams.platform_filter;

        $scope.init = function () {
            $scope.data.current_page = 0;
            $scope.load_games_by_keyword();
        };

        $scope.load_more = function () {
            $scope.data.current_page++;
            $scope.load_games_by_keyword();
        };

        $scope.load_games_by_keyword = function () {
            var promise = GameServ.game_by_word($scope.keyword, $scope.platform_filter, $scope.data.items, $scope.data.current_page);
            promise.then(
                function (data) {
                    $scope.data.error_code = data.error_code;
                    if ($scope.data.error_code === "NoErrors") {
                        $scope.data.searchresults_placeholderpic_flag = false;
                        // if is end
                        if (data.games.length < $scope.data.items) {
                            $scope.data.there_is_more = false;
                        }
                        else {
                            $scope.data.there_is_more = true;
                        }

                        // append to existing list
                        $scope.data.games = $scope.data.games.concat(data.games);
                        // must notify
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    }
                    else {
                        $scope.data.searchresults_placeholderpic_flag = true;
                        $scope.data.SearchResultCtrl_message = UtilServ.get_error_message($scope.data.error_code);
                    }
                }
                ,
                function (data) {
                    console.log('ERROR: load search list by game name ' + data.error_code);
                }
            );
        };

        $scope.show_game_missing_add_popup = function () {
            var action_popup = $ionicPopup.show({
                templateUrl: 'templates/popup_gamemissing_add.html',
                scope: $scope
            });

            $scope.submit_game_missing_thank = function () {
                action_popup.close();
                $ionicBackdrop.retain();
                var alertPopup = $ionicPopup.alert({
                    title: 'Thank You',
                    template: ''
                });
                alertPopup.then(function(res) {
                    $state.go('tab.search');
                });
                var promise = GameServ.game_missing_add($scope.data.platform + ':' + $scope.data.title);
                promise.then(
                    function (data) {
                        $scope.data.title       = undefined;
                        $scope.data.platform    = undefined;
                    }
                    ,
                    function (data) {
                        console.log('Failed: ' + data.error_code);
                        $scope.data.title       = undefined;
                        $scope.data.platform    = undefined;
                    }
                );
            };

            $scope.cancel_button = function(){
                action_popup.close();
            };
        };

        $scope.init();
    })


    .controller('QuestionPageCtrl', function ($scope, QuestionServ, $state, $stateParams, $localstorage, $ionicHistory, gbgConfig, $cordovaSocialSharing) {
        $scope.data                     = {};
        $scope.data.question_set_id     = $stateParams.question_set_id;
        $scope.data.question_set_name   = $stateParams.question_set_name;
        $scope.data.tab_name            = $stateParams.tab_name;
        $scope.data.list_order          = $stateParams.list_order;
        $scope.data.question            = '';
        $scope.data.selected_choice     = '';
        $scope.data.choices             = [];
        $scope.data.empty_question      = false;

        var share_link      = gbgConfig.url;
        var share_file      = null;
        var share_subject   = $localstorage.get('me_name') + ' invite you to try this awesome video game trivia';
        var share_message   = "Try it, and see how much of a gamer you are!!";

        $scope.init = function () {
            var promise = QuestionServ.question_by_set_id($scope.data.question_set_id, $scope.data.list_order);
            promise.then(
                function (data) {
                    if (data.error_code === "NoErrors") {
                        $scope.data.question   = data.questions_detail;
                        $scope.data.choices    = $scope.data.question.choice.split('+');
                        $scope.data.list_order = $scope.data.question.list_order;
                        $scope.data.empty_question = false;
                        share_file = $scope.data.question.question_pic;
                        share_link = gbgConfig.url + "question/" + $scope.data.question.question_set_share_code;
                        console.log(share_file);
                        console.log(share_link);
                    }
                    else {
                        $scope.data.questionset_message = UtilServ.get_error_message($scope.data.error_code);
                        $scope.data.empty_question = true;
                    }
                }
                ,
                function (data) {
                    console.log('ERROR: find games by game name ' + data.error_code);
                }
            );
        };

        $scope.select_choice = function(choice) {
            console.log("select_choice: choice is " + choice);
            $scope.data.selected_choice = choice;
        };

        $scope.question_answer_submit = function() {
            var promise = QuestionServ.question_answer_submit($scope.data.question_set_id, $scope.data.question.question_id, $scope.data.selected_choice);
            promise.then(
                function (data) {
                    if (data.error_code === "NoErrors"){
                        if ($scope.data.list_order < ($scope.data.question.list_count - 1)){
                            $scope.data.list_order += 1;
                            var routing_url = "tab.search_question_page";
                            $state.go(routing_url, {question_set_id:$stateParams.question_set_id, question_set_name:$stateParams.question_set_name, list_order: $scope.data.list_order, tab_name: $stateParams.tab_name});
                        }
                        else{
                            var routing_url = "tab.search_question_score_page";
                            $state.go(routing_url, {question_set_id:$scope.data.question_set_id, tab_name: $scope.data.tab_name});
                        }
                    }
                }
                ,
                function (data) {
                    console.log('ERROR: find games by game name ' + data.error_code);
                }
            );
        };

        $scope.share_question= function(){ //share_subject is only used for email sharing, if file != null, FB Messegner does not work
            $cordovaSocialSharing.share(share_message, share_subject, share_file, share_link).then();
        };

        $scope.init();
    })

    .controller('QuestionSetScoreCtrl', function ($scope, QuestionServ, $state, $stateParams, UtilServ, $localstorage, $ionicHistory, gbgConfig, $cordovaSocialSharing, $ionicViewService) {
        $scope.data                 = {};
        $scope.data.question_set_id = $stateParams.question_set_id;
        $scope.data.tab_name        = $stateParams.tab_name;

        var share_link = gbgConfig.url;
        var share_file = null;
        var share_subject = '';
        var share_message = share_subject + "Give it a try, and see how much of a gamer you are!";

        $scope.init = function(){
            var promise = QuestionServ.question_setscore_by_id($scope.data.question_set_id);
            promise.then(
                function (data) {
                    if (data.error_code === "NoErrors") {
                        $scope.data.results = data.results;
                        share_subject = 'I got ' + $scope.data.results.question_set_score + ' points on this video game trivia!';
                        share_file = $scope.data.results.question_set_score_pic;
                        share_link = gbgConfig.url + "score/" + $scope.data.results.question_set_score_share_code;
                        console.log(share_file);
                        console.log(share_link);
                    }
                }
                ,
                function (data) {
                    console.log('ERROR: find games by game name ' + data.error_code);
                }
            );
        };

        $scope.back_to_postad = function(){
            $ionicViewService.nextViewOptions({
                disableBack: true
            });
            $state.go('tab.search');
        };

        $scope.play_again = function(){
            var routing_url = "tab.search_question_page";
            $state.go(routing_url, {question_set_id: $scope.data.question_set_id, question_set_name: $scope.data.question_set_name, list_order: 0, tab_name: $scope.data.tab_name});
        };

        $scope.share_score = function(){
            $cordovaSocialSharing.share(share_message, share_subject, share_file, share_link).then();
        };

        $scope.init();

    });


