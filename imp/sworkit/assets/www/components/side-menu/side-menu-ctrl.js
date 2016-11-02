angular.module('swMobileApp').controller('SideMenuCtrl', function ($scope, $location, $log) {

    $scope.clickHome = function () {
        var tempURL = $location.$$url.substring(0, 9);
        if (tempURL == '#/app/cust') {
            $location.path('/app/custom');
        } else if (tempURL !== '/app/home') {
            $location.path('/app/home');
        }
    };

    $scope.isItemActive = function (shortUrl) {
        var tempURL = '/app/' + shortUrl;
        return (tempURL == $location.$$path.substring(0, 9));
    };

});
