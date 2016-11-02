angular.module('swMobileApp').filter('rawHtml', function ($sce) {
    return function (val) {
        return $sce.trustAsHtml(val);
    };
})