// TODO: Migrate existing calls to use these constants
var GA_EVENT_CATEGORY_KPI = 'kpi';
var GA_EVENT_ACTION_ACQUISITION = 'acquisition';
var GA_EVENT_LABEL_FIRST_LAUNCH = 'first-launch';
var GA_EVENT_ACTION_ACTIVATION = 'activation';
var GA_EVENT_LABEL_FIRST_MEDIA = 'first-workout';
var GA_EVENT_ACTION_RETENTION = 'retention';
var GA_EVENT_ACTION_REFERRAL = 'referral';
var GA_EVENT_ACTION_REVENUE = 'revenue';

// TODO: Add constants used by other calls and migrate them also

var GA_EVENT_CATEGORY_WATCH_APPLE = 'watch-apple';
var GA_EVENT_ACTION_WATCH_COMMAND = 'command';

// TODO: Migrate 'first' event tracking to use these constants via trackEventOnce()

var LS_KEY_FIRST_LAUNCH = 'analytics_isFirstLaunchComplete';
var LS_KEY_FIRST_WORKOUT = 'analytics_isFirstWorkoutComplete';

angular.module('swMobileApp').factory('swAnalytics', function ($window, $rootScope, $timeout, $state, $log) {
    $log.info("swAnalytics");

    function _init(isFirstLaunch) {
        $log.info("_init()");
        $log.debug("isFirstLaunch", isFirstLaunch);
        _initGoogleAnalytics(isFirstLaunch);
        _initFiksu();
    }

    function _initGoogleAnalytics(isFirstLaunch) {
        $log.info("_initGoogleAnalytics()");
        if ($window.analytics) {
            $log.debug("Initialize Google Analytics");
            $window.analytics.startTrackerWithId('UA-38468920-2');
            var dimensionValue = null;
            if (ionic.Platform.isIOS()) {
                dimensionValue = 'APPLE';
            } else if (ionic.Platform.isAndroid()) {
                dimensionValue = isAmazon() ? 'AMAZON' : 'GOOGLE';
            }
            $window.analytics.addCustomDimension('1', dimensionValue);

            if (isFirstLaunch)
                _trackEvent('kpi', 'acquisition', 'first-launch');

            _trackView($state.current.name);
            $rootScope.$on('$stateChangeSuccess', function (event, toState) {
                _trackView(toState.name);
            });
        } else {
            $log.warn("Unable to initialize Google Analytics, due to missing $window.analytics");
        }
    }

    function _initFiksu() {
        $log.info("_initFiksu()");
        if ($window.FiksuTrackingManager) {
            $log.debug("Initialize Fiksu");
            $window.FiksuTrackingManager.initialize({
                iTunesApplicationID: "527219710"
            });
        } else {
            $log.warn("Unable to initialize Fiksu, due to missing $window.FiksuTrackingManager");
        }
    }

    function _trackEvent(gaCategory, gaAction, gaLabel, gaValue) {
        $log.info("_trackEvent()");
        if ($window.analytics) {
            $window.analytics.trackEvent(gaCategory, gaAction, gaLabel, gaValue);
        }
        $log.debug("GA event", gaCategory, gaAction, gaLabel, gaValue);
    }

    function _trackView(viewName) {
        $log.info("_trackView()");
        if ($window.analytics) {
            $window.analytics.trackView(viewName);
        }
        $log.debug("GA view", viewName);
    }

    function _trackEventOnce(trackingKey, gaCategory, gaAction, gaLabel, gaValue) {
        var isTrue = $window.localStorage.getItem(trackingKey);
        $log.debug("isTrue", isTrue);
        if (!isTrue) {
            _trackEvent(gaCategory, gaAction, gaLabel, gaValue);
            $window.localStorage.setItem(trackingKey, true);
            $log.debug("isTrue", $window.localStorage.getItem(trackingKey))
        }
    }

    return {
        init: _init,
        trackEvent: _trackEvent,
        trackView: _trackView,
        trackEventOnce: _trackEventOnce
    }
});
