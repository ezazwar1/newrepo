angular.module('instacafe.services', [])

.factory('LocalStorage', function ($window) {
    return {
        set: function (key, value) {
            $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        delete: function (key) {
            $window.localStorage.removeItem(key);
        },
        setObject: function (key, value) {
            $window.localStorage[key] = angular.toJson(value);
        },
        getObject: function (key) {
            return angular.fromJson($window.localStorage[key] || '{}');
        },
        getList: function (key) {
            return angular.fromJson($window.localStorage[key] || '[]');
        }
    };
});
