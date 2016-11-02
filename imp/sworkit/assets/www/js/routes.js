angular.module('swMobileApp').config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

        .state('app', {
            url: "/app",
            abstract: true,
            templateUrl: "components/side-menu/side-menu.html",
            controller: 'SideMenuCtrl'
        })

        .state('app.home', {
            url: "/home",
            views: {
                'menuContent': {
                    templateUrl: "components/home/home.html",
                    controller: 'HomeCtrl'
                }
            }
        })

        .state('app.workout-category', {
            url: "/home/:categoryId",
            views: {
                'menuContent': {
                    templateUrl: "components/select-workout/category-workouts.html",
                    controller: 'WorkoutCategoryCtrl'
                }
            }
        })

        .state('app.workout-custom', {
            url: "/custom",
            views: {
                'menuContent': {
                    templateUrl: "components/custom-workouts/custom-workouts.html",
                    controller: 'WorkoutCustomCtrl'
                }
            }
        })

        .state('app.workout-custom2', {
            url: "/custom/featured",
            views: {
                'menuContent': {
                    templateUrl: "components/custom-workouts/custom-workouts-discover.html",
                    controller: 'WorkoutCustomDiscoverCtrl'
                }
            }
        })

        .state('app.workout-length', {
            url: "/home/:categoryId/:typeId",
            views: {
                'menuContent': {
                    templateUrl: "components/select-time/select-time.html",
                    controller: 'WorkoutTimeCtrl'
                }
            }
        })

        .state('app.workout', {
            url: "/home/:categoryId/:typeId/:timeId/workout",
            views: {
                'menuContent': {
                    cache: false,
                    templateUrl: "components/workout/workout.html",
                    controller: 'WorkoutCtrl'
                }
            }
        })

        .state('app.progress', {
            url: "/progress",
            views: {
                'menuContent': {
                    templateUrl: "components/accounts/profile/progress.html",
                    controller: 'ProgressCtrl'
                }
            }
        })

        .state('app.log', {
            url: "/auth/log",
            views: {
                'menuContent': {
                    templateUrl: "components/accounts/profile/logs.html",
                    controller: 'LogCtrl'
                }
            }
        })

        .state('app.settings', {
            url: "/settings",
            views: {
                'menuContent': {
                    templateUrl: "components/settings/settings.html",
                    controller: "SettingsCtrl"
                }
            }
        })

        .state('app.settings-audio', {
            url: "/settings/audio",
            views: {
                'menuContent': {
                    templateUrl: "components/settings/settings-audio.html",
                    controller: "SettingsAudioCtrl"
                }
            }
        })

        .state('app.rewards', {
            url: "/rewards",
            views: {
                'menuContent': {
                    templateUrl: "components/rewards/rewards.html",
                    controller: "RewardsCtrl"
                }
            }
        })

        .state('app.reminders', {
            url: "/reminders",
            views: {
                'menuContent': {
                    templateUrl: "components/reminders/reminders.html",
                    controller: "RemindersCtrl"
                }
            }
        })

        .state('app.exercises', {
            url: "/exercises",
            views: {
                'menuContent': {
                    templateUrl: "components/exercise-list/exercise-list.html",
                    controller: "ExerciseListCtrl"
                }
            }
        })

        .state('app.help', {
            url: "/help",
            views: {
                'menuContent': {
                    templateUrl: "components/help/help.html",
                    controller: "HelpCtrl"
                }
            }
        })

        .state('app.auth', {
            url: "/auth",
            views: {
                'menuContent': {
                    templateUrl: "components/accounts/login/auth.html"
                }
            }
        })

        .state('app.welcome', {
            url: '/auth/welcome',
            views: {
                'menuContent': {
                    templateUrl: "components/accounts/login/welcome.html",
                    controller: 'WelcomeCtrl'
                }
            }
        })

        .state('app.login', {
            url: '/auth/login',
            views: {
                'menuContent': {
                    templateUrl: "components/accounts/login/login.html",
                    controller: 'LoginCtrl'
                }
            }
        })

        .state('app.signup', {
            url: '/auth/signup',
            views: {
                'menuContent': {
                    templateUrl: "components/accounts/login/signup.html",
                    controller: 'SignUpCtrl'
                }
            }
        })

        .state('app.user-tier', {
            url: '/user-tier',
            views: {
                'menuContent': {
                    templateUrl: "components/accounts/user-tier.html",
                    controller: 'UserTierCtrl'
                }
            }
        })

        .state('app.extra-info', {
            url: '/auth/extra-info/:isSignup',
            views: {
                'menuContent': {
                    templateUrl: "components/accounts/login/extra-info.html",
                    controller: 'ExtraInfoCtrl'
                }
            }
        })

        .state('app.extra-info-goals', {
            url: '/auth/extra-info-goals/:isSignup',
            views: {
                'menuContent': {
                    templateUrl: "components/accounts/login/extra-info-goals.html",
                    controller: 'ExtraInfoGoalsCtrl'
                }
            }
        })

        .state('app.forgot-password', {
            url: '/auth/forgot-password',
            views: {
                'menuContent': {
                    templateUrl: "components/accounts/login/forgot-password.html",
                    controller: 'ForgotPasswordCtrl'
                }
            }
        })

        .state('app.profile', {
            url: '/auth/profile',
            views: {
                'menuContent': {
                    templateUrl: "components/accounts/profile/profile.html",
                    controller: 'ProfileCtrl'
                }
            }
        });

    $urlRouterProvider.otherwise('/app/home');
});
