(function(angular) {
    angular.module('znk.sat').controller('AboutUsCtrl', [
        '$scope','ENV',
        function AboutUsCtrl($scope,ENV){
            this.appVer = ENV.appVersion;
        }]);
})(angular);
