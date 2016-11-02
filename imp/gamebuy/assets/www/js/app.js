angular.module('starter', ['ionic', 'ngCordova', 'ngIOS9UIWebViewPatch', 'account.controllers', 'account.services',
    'game.controllers', 'game.services', 'push.services', 'search.controllers', "chat.services", "chat.controllers",
    "deal.services", "deal.controllers", "survey.services", "survey.controllers", "question.services", "util.services", 'dir.googleplace', 'dir.citytap', 'dir.elastictext'])

    .constant("gbgConfig", {
        "api_url": "https://gamebuygame.com/api/1.0/",
        "url": "https://gamebuygame.com/",
        //"api_url": "http://gamencore.com/api/1.0/",
        //"url": "http://gamencore.com/",
        //"api_url": "http://127.0.0.1:8000/api/1.0/",
        //"url": "http://127.0.0.1:8000/",
        "cache_expire_seconds": 120
    })

    .run(function ($ionicPlatform, $state, $http, $localstorage, PushServ, AccountServ) {

        $ionicPlatform.ready(function() {
            setTimeout(function() {
                navigator.splashscreen.hide();
            }, 500);
        });

        if ($localstorage.get('api_key', '').length > 0) {
            console.log('api_key ' + $localstorage.get('api_key', '') + ' found at app.js');
            $http.defaults.headers.common.gbgapikey = $localstorage.get('api_key', '');
        } else {
            console.log('api_key not found at app.js');
            $ionicPlatform.ready(function () {
                $state.go('login');
            });
        }

        $ionicPlatform.ready(function () {
            // track location right after app start
            if ($localstorage.get('api_key', '').length > 0){
                AccountServ.start_location_tracking();
            }

            // push notification
            if ($localstorage.get('api_key', '').length > 0) {
                // register push notification
                PushServ.register();
            }
        });

        // app comes to foreground
        $ionicPlatform.on("resume", function(){
            console.log('app resumed to foreground');
            if ($state.current.name === "tab.chats" || $state.current.name === "chat") {
                $state.go($state.current, {}, {reload: true});
            }
        });
    })

    .config(function($ionicConfigProvider) {
        $ionicConfigProvider.tabs.position("bottom");
        $ionicConfigProvider.tabs.style("standard");
        $ionicConfigProvider.navBar.alignTitle("center");

        // disable the swiple back gesture
        $ionicConfigProvider.views.swipeBackEnabled(false);
    })

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('tab', {
                url: "/tab",
                abstract: true,
                templateUrl: "templates/tabs.html"
            })

            .state('tab.nearme', {
                url: '/nearme',
                views: {
                    'tab_nearme': {
                        templateUrl: 'templates/tab_nearme.html',
                        controller: 'NearMeCtrl'
                    }
                },
                cache: true
            })

            .state('tab.nearme_collection_profile', {
                url: '/nearme_collection_profile/:collection_id/:tab_name',
                views: {
                    'tab_nearme': {
                        templateUrl: 'templates/collection_profile.html',
                        controller: 'CollectionProfileCtrl'
                    }
                },
                cache: false
            })

            .state('tab.nearme_gamer_profile', {
                url: '/nearme_gamer_profile/:gamer_id/:tab_name',
                views: {
                    'tab_nearme': {
                        templateUrl: 'templates/gamer_profile.html',
                        controller: 'GamerProfileCtrl'
                    }
                },
                cache: false
            })

            .state('tab.nearme_gamer_gamemetrics', {
                url: '/nearme_gamer_gamemetrics/:gamer_id/:gamer_name/:metric/:tab_name',
                views: {
                    'tab_nearme': {
                        templateUrl: 'templates/gamer_gamemetrics.html',
                        controller: 'GamerMetricsListCtrl'
                    }
                },
                cache: false
            })

            .state('tab.nearme_gamer_favourite', {
                url: '/nearme_gamer_favourite/:gamer_id/:tab_name',
                views: {
                    'tab_nearme': {
                        templateUrl: 'templates/gamer_favourite.html',
                        controller: 'GamerMetricsFavouriteCtrl'
                    }
                },
                cache: false
            })

            .state('tab.nearme_game_profile', {
                url: '/nearme_game_profile/:game_id/:tab_name',
                views: {
                    'tab_nearme': {
                        templateUrl: 'templates/game_profile.html',
                        controller: 'GameProfileCtrl'
                    }
                },
                cache: false
            })

            .state('tab.nearme_game_post_classified', {
                url: '/nearme_game_post_classified/:collection_id/:tab_name',
                views: {
                    'tab_me': {
                        templateUrl: 'templates/game_post_classified.html',
                        controller: 'GameAdPostCtrl'
                    }
                },
                cache: false
            })

            .state('tab.nearme_gamers_list', {
                url: '/nearme_gamers_list/:game_id/:collect_as/:tab_name',
                views: {
                    'tab_nearme': {
                        templateUrl: 'templates/gamers_list.html',
                        controller: 'CollectionGamersListCtrl'
                    }
                },
                cache: false
            })

            .state('tab.nearme_gamer_rate', {
                url: '/nearme_gamer_rate/:gamer_id/:tab_name',
                views: {
                    'tab_nearme': {
                        templateUrl: 'templates/gamer_rate.html',
                        controller: 'GamerMetricsRateCtrl'
                    }
                },
                cache: false
            })

            .state('tab.deals', {
                url: '/deals',
                views: {
                    'tab_deals': {
                        templateUrl: 'templates/tab_deals.html',
                        controller: 'DealListCtrl'
                    }
                },
                cache: true
            })

            .state('tab.deals_deal_profile', {
                url: '/deals_deal_profile/:deal_id/:tab_name',
                views: {
                    'tab_deals': {
                        templateUrl: 'templates/deal_profile.html',
                        controller: 'DealProfileCtrl'
                    }
                },
                cache: false
            })

            .state('tab.deals_gamer_profile', {
                url: '/deals_gamer_profile/:gamer_id/:tab_name',
                views: {
                    'tab_deals': {
                        templateUrl: 'templates/gamer_profile.html',
                        controller: 'GamerProfileCtrl'
                    }
                },
                cache: false
            })

            .state('tab.deals_gamer_gamemetrics', {
                url: '/deals_gamer_gamemetrics/:gamer_id/:gamer_name/:metric/:tab_name',
                views: {
                    'tab_deals': {
                        templateUrl: 'templates/gamer_gamemetrics.html',
                        controller: 'GamerMetricsListCtrl'
                    }
                },
                cache: false
            })

            .state('tab.deals_gamer_favourite', {
                url: '/deals_gamer_favourite/:gamer_id/:tab_name',
                views: {
                    'tab_deals': {
                        templateUrl: 'templates/gamer_favourite.html',
                        controller: 'GamerMetricsFavouriteCtrl'
                    }
                },
                cache: false
            })

            .state('tab.deals_collection_profile', {
                url: '/deals_collection_profile/:collection_id/:tab_name',
                views: {
                    'tab_deals': {
                        templateUrl: 'templates/collection_profile.html',
                        controller: 'CollectionProfileCtrl'
                    }
                },
                cache: false
            })

            .state('tab.deals_game_profile', {
                url: '/deals_game_profile/:game_id/:tab_name',
                views: {
                    'tab_deals': {
                        templateUrl: 'templates/game_profile.html',
                        controller: 'GameProfileCtrl'
                    }
                },
                cache: false
            })

            .state('tab.deals_game_post_classified', {
                url: '/deals_game_post_classified/:collection_id/:tab_name',
                views: {
                    'tab_me': {
                        templateUrl: 'templates/game_post_classified.html',
                        controller: 'GameAdPostCtrl'
                    }
                },
                cache: false
            })

            .state('tab.deals_gamers_list', {
                url: '/deals_gamers_list/:game_id/:collect_as/:tab_name',
                views: {
                    'tab_deals': {
                        templateUrl: 'templates/gamers_list.html',
                        controller: 'CollectionGamersListCtrl'
                    }
                },
                cache: false
            })

            .state('tab.deals_gamer_rate', {
                url: '/deals_gamer_rate/:gamer_id/:tab_name',
                views: {
                    'tab_deals': {
                        templateUrl: 'templates/gamer_rate.html',
                        controller: 'GamerMetricsRateCtrl'
                    }
                },
                cache: false
            })

            .state('tab.search', {
                url: '/search',
                views: {
                    'tab_search': {
                        templateUrl: 'templates/tab_search.html',
                        controller: 'SearchCtrl'
                    }
                },
                cache: false
            })

            .state('tab.search_result', {
                url: '/search_result/:keyword/:platform_filter',
                views: {
                    'tab_search': {
                        templateUrl: 'templates/search_result.html',
                        controller: 'SearchResultCtrl'
                    }
                },
                cache: false
            })

            .state('tab.search_game_rank_list', {
                url: '/search_game_rank_list/:collect_as',
                views: {
                    'tab_search': {
                        templateUrl: 'templates/game_rank_list.html',
                        controller: 'GameRankCtrl'
                    }
                },
                cache: false
            })

            .state('tab.search_game_profile', {
                url: '/search_game_profile/:game_id/:tab_name',
                views: {
                    'tab_search': {
                        templateUrl: 'templates/game_profile.html',
                        controller: 'GameProfileCtrl'
                    }
                },
                cache: false
            })

            .state('tab.search_game_post_classified', {
                url: '/search_game_post_classified/:collection_id/:tab_name',
                views: {
                    'tab_search': {
                        templateUrl: 'templates/game_post_classified.html',
                        controller: 'GameAdPostCtrl'
                    }
                },
                cache: false
            })

            .state('tab.search_gamers_list', {
                url: '/search_gamers_list/:game_id/:collect_as/:tab_name',
                views: {
                    'tab_search': {
                        templateUrl: 'templates/gamers_list.html',
                        controller: 'CollectionGamersListCtrl'
                    }
                },
                cache: false
            })

            .state('tab.search_gamer_profile', {
                url: '/search_gamer_profile/:gamer_id/:tab_name',
                views: {
                    'tab_search': {
                        templateUrl: 'templates/gamer_profile.html',
                        controller: 'GamerProfileCtrl'
                    }
                },
                cache: false
            })

            .state('tab.search_gamer_gamemetrics', {
                url: '/search_gamer_gamemetrics/:gamer_id/:gamer_name/:metric/:tab_name',
                views: {
                    'tab_search': {
                        templateUrl: 'templates/gamer_gamemetrics.html',
                        controller: 'GamerMetricsListCtrl'
                    }
                },
                cache: false
            })

            .state('tab.search_gamer_favourite', {
                url: '/search_gamer_favourite/:gamer_id/:tab_name',
                views: {
                    'tab_search': {
                        templateUrl: 'templates/gamer_favourite.html',
                        controller: 'GamerMetricsFavouriteCtrl'
                    }
                },
                cache: false
            })

            .state('tab.search_gamer_rate', {
                url: '/search_gamer_rate/:gamer_id/:tab_name',
                views: {
                    'tab_search': {
                        templateUrl: 'templates/gamer_rate.html',
                        controller: 'GamerMetricsRateCtrl'
                    }
                },
                cache: false
            })

            .state('tab.search_collection_profile', {
                url: '/search_collection_profile/:collection_id/:tab_name',
                views: {
                    'tab_search': {
                        templateUrl: 'templates/collection_profile.html',
                        controller: 'CollectionProfileCtrl'
                    }
                },
                cache: false
            })

            .state('tab.search_question_page', {
                url: '/search_question_page/:question_set_id/:question_set_name/:list_order/:tab_name',
                views: {
                    'tab_search': {
                        templateUrl: 'templates/question_page.html',
                        controller: 'QuestionPageCtrl'
                    }
                },
                cache: false
            })

            .state('tab.search_question_score_page', {
                url: '/search_question_score_page/:question_set_id/:tab_name',
                views: {
                    'tab_search': {
                        templateUrl: 'templates/question_score_page.html',
                        controller: 'QuestionSetScoreCtrl'
                    }
                },
                cache: false
            })

            .state('tab.chats', {
                url: '/chats',
                views: {
                    'tab_chats': {
                        templateUrl: 'templates/tab_chats.html',
                        controller: 'ThreadListCtrl'
                    }
                },
                cache: false
            })

            .state('tab.chats_notification', {
                url: '/chats_notification',
                views: {
                    'tab_chats': {
                        templateUrl: 'templates/notifications_list.html',
                        controller: 'NotificationListCtrl'
                    }
                },
                cache: false
            })

            .state('chat', {
                url: '/chat/:thread_id/:partner_id/:unread_count/:currentchat_placeholder',
                templateUrl: 'templates/chat.html',
                controller: 'ChatCtrl',
                cache: false
            })

            .state('tab.chats_gamer_profile', {
                url: '/chats_gamer_profile/:gamer_id/:tab_name/:thread_id',
                views: {
                    'tab_chats': {
                        templateUrl: 'templates/gamer_profile.html',
                        controller: 'GamerProfileCtrl'
                    }
                },
                cache: false
            })

            .state('tab.chats_gamer_gamemetrics', {
                url: '/chats_gamer_gamemetrics/:gamer_id/:gamer_name/:metric/:tab_name',
                views: {
                    'tab_chats': {
                        templateUrl: 'templates/gamer_gamemetrics.html',
                        controller: 'GamerMetricsListCtrl'
                    }
                },
                cache: false
            })

            .state('tab.chats_gamer_favourite', {
                url: '/chats_gamer_favourite/:gamer_id/:tab_name',
                views: {
                    'tab_chats': {
                        templateUrl: 'templates/gamer_favourite.html',
                        controller: 'GamerMetricsFavouriteCtrl'
                    }
                },
                cache: false
            })

            .state('tab.chats_gamer_rate', {
                url: '/chats_gamer_rate/:gamer_id/:tab_name',
                views: {
                    'tab_chats': {
                        templateUrl: 'templates/gamer_rate.html',
                        controller: 'GamerMetricsRateCtrl'
                    }
                },
                cache: false
            })

            .state('tab.chats_collection_profile', {
                url: '/chats_collection_profile/:collection_id/:tab_name',
                views: {
                    'tab_chats': {
                        templateUrl: 'templates/collection_profile.html',
                        controller: 'CollectionProfileCtrl'
                    }
                },
                cache: false
            })

            .state('tab.chats_deal_profile', {
                url: '/chats_deal_profile/:deal_id/:tab_name',
                views: {
                    'tab_chats': {
                        templateUrl: 'templates/deal_profile.html',
                        controller: 'DealProfileCtrl'
                    }
                },
                cache: false
            })

            .state('tab.me', {
                url: '/me',
                views: {
                    'tab_me': {
                        templateUrl: 'templates/tab_me.html',
                        controller: 'GamerProfileCtrl'
                    }
                },
                cache: false
            })

            .state('tab.me_setttings', {
                url: '/me_setttings',
                views: {
                    'tab_me': {
                        templateUrl: 'templates/settings.html',
                        controller: 'AccountSettingCtrl'
                    }
                }
            })

            .state('tab.me_notification_control', {
                url: '/me_notification_control',
                views: {
                    'tab_me': {
                        templateUrl: 'templates/notification_control.html',
                        controller: 'NotificationControlCtrl'
                    }
                }
            })

            .state('tab.me_editprofile', {
                url: '/me_editprofile',
                views: {
                    'tab_me': {
                        templateUrl: 'templates/me_editprofile.html',
                        controller: 'GamerProfileCtrl'
                    }
                },
                cache: false
            })

            .state('tab.me_wallet', {
                url: '/me_wallet',
                views: {
                    'tab_me': {
                        templateUrl: 'templates/wallet.html',
                        controller: 'AccountPaymentCtrl'
                    }
                },
                cache: false
            })

            .state('tab.me_wallet_sell', {
                url: '/me_wallet_sell',
                views: {
                    'tab_me': {
                        templateUrl: 'templates/wallet_sell.html',
                        controller: 'AccountPaymentCtrl'
                    }
                },
                cache: false
            })

            .state('tab.me_game_profile', {
                url: '/me_game_profile/:game_id/:tab_name',
                views: {
                    'tab_me': {
                        templateUrl: 'templates/game_profile.html',
                        controller: 'GameProfileCtrl'
                    }
                },
                cache: false
            })

            .state('tab.me_game_post_classified', {
                url: '/me_game_post_classified/:collection_id/:tab_name',
                views: {
                    'tab_me': {
                        templateUrl: 'templates/game_post_classified.html',
                        controller: 'GameAdPostCtrl'
                    }
                },
                cache: false
            })

            .state('tab.me_gamers_list', {
                url: '/me_gamers_list/:game_id/:collect_as/:tab_name',
                views: {
                    'tab_me': {
                        templateUrl: 'templates/gamers_list.html',
                        controller: 'CollectionGamersListCtrl'
                    }
                },
                cache: false
            })

            .state('tab.me_gamer_profile', {
                url: '/me_gamer_profile/:gamer_id/:tab_name',
                views: {
                    'tab_me': {
                        templateUrl: 'templates/gamer_profile.html',
                        controller: 'GamerProfileCtrl'
                    }
                },
                cache: false
            })

            .state('tab.me_collection_profile', {
                url: '/me_collection_profile/:collection_id/:tab_name',
                views: {
                    'tab_me': {
                        templateUrl: 'templates/collection_profile.html',
                        controller: 'CollectionProfileCtrl'
                    }
                },
                cache: false
            })

            .state('tab.me_gamer_gamemetrics', {
                url: '/me_gamer_gamemetrics/:gamer_id/:gamer_name/:metric/:tab_name',
                views: {
                    'tab_me': {
                        templateUrl: 'templates/gamer_gamemetrics.html',
                        controller: 'GamerMetricsListCtrl'
                    }
                },
                cache: false
            })

            .state('tab.me_gamer_favourite', {
                url: '/me_gamer_favourite/:gamer_id/:tab_name',
                views: {
                    'tab_me': {
                        templateUrl: 'templates/gamer_favourite.html',
                        controller: 'GamerMetricsFavouriteCtrl'
                    }
                },
                cache: false
            })

            .state('tab.me_gamer_rate', {
                url: '/me_gamer_rate/:gamer_id/:tab_name',
                views: {
                    'tab_me': {
                        templateUrl: 'templates/gamer_rate.html',
                        controller: 'GamerMetricsRateCtrl'
                    }
                },
                cache: false
            })

            .state('tab.me_aboutUS', {
                url: '/me_aboutUS',
                views: {
                    'tab_me': {
                        templateUrl: 'templates/aboutUS.html',
                        controller: 'GamerProfileCtrl'
                    }
                }
            })

            .state('tab.me_termofuse', {
                url: '/me_termofuse',
                views: {
                    'tab_me': {
                        templateUrl: 'templates/termofuse.html',
                        controller: 'GamerProfileCtrl'
                    }
                }
            })

            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'AccountCtrl'
            })

            .state('register', {
                url: '/register',
                templateUrl: 'templates/login_register.html',
                controller: 'AccountCtrl'
            })

            .state('forgot', {
                url: '/forgot',
                templateUrl: 'templates/login_forgot.html',
                controller: 'AccountCtrl'
            })

            .state('survey_platform', {
                url: '/survey_platform',
                templateUrl: 'templates/survey_platform.html',
                controller: 'SurveyPlatformCtrl',
                cache: true
            })

            .state('survey_wish', {
                url: '/survey_wish/:platforms',
                templateUrl: 'templates/survey_wish.html',
                controller: 'SurveyWishCtrl',
                cache: true
            })

            .state('survey_sell', {
                url: '/survey_sell/:wishgames',
                templateUrl: 'templates/survey_sell.html',
                controller: 'SurveySellCtrl',
                cache: true
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/tab/nearme');

    });
