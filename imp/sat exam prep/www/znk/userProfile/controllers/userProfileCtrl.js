'use strict';

(function (angular) {

    angular.module('znk.sat').controller('UserProfileCtrl', ['$scope', 'UserProfileSrv', '$timeout', 'NetworkSrv', 'ErrorHandlerSrv', 'PopUpSrv', 'MobileSrv', UserProfileCtrl]);

    function UserProfileCtrl($scope, UserProfileSrv, $timeout, NetworkSrv, ErrorHandlerSrv, PopUpSrv, MobileSrv) {
        var startLoader = function startLoader() {
            $scope.startLoader = true;
        };

        var endLoader = function endLoader(hideLoader) {
            $scope.startLoader = false;
            $scope.fillLoader = !hideLoader;
        };

        var cleanUndefinedValues = function cleanUndefinedValues() {
            angular.forEach($scope.d.formData, function(value, key) {
                if(angular.isUndefined(value)) {
                    $scope.d.formData[key] = null;
                }
            });
        };

        $scope.d = { };
        $scope.d.isOffline =  NetworkSrv.isDeviceOffline();
        $scope.d.isMobile =  MobileSrv.isMobile();
        $scope.d.satDates = [
            {id:0 , name:'May 2015'},
            {id:1 , name:'Jun 2015'},
            {id:2, name:'Oct 2015'},
            {id:3, name:'Nov 2015'},
            {id:4, name:'Dec 2015'},
            {id:5, name:'Jan 2016'},
            {id:6, name:'Mar 2016'},
            {id:7, name:'May 2016'},
            {id:8, name:'Jun 2016'}];


        UserProfileSrv.get().then(function (res) {
            $scope.d.formData = res;

            $scope.d.birthday = angular.isDefined($scope.d.formData.birthday) && $scope.d.birthday !== null ? new Date($scope.d.formData.birthday) : void(0);

            if($scope.d.formData.hasOwnProperty('targetExamDate')){
                $scope.d.targetExamDate = new Date($scope.d.formData.targetExamDate);
            }
        });

        $scope.d.save = function save() {

            if (NetworkSrv.isDeviceOffline()) {
                PopUpSrv.error(null,ErrorHandlerSrv.messages.noInternetConnection);
                return;
            }

            if($scope.d.formData.nickname === "") {
                PopUpSrv.error(null,ErrorHandlerSrv.messages.emptyUserName);
                return;
            }

            startLoader();

            $scope.d.formData.birthday = angular.isDefined($scope.d.birthday) && $scope.d.birthday !== null ? $scope.d.birthday.getTime() : null;

            if($scope.d.hasOwnProperty('targetExamDate')){
                $scope.d.formData.targetExamDate = $scope.d.targetExamDate.getTime();
            }

            cleanUndefinedValues();

            UserProfileSrv.save($scope.d.formData).then(function () {

                endLoader();

                PopUpSrv.success('All changes successfully saved.');

            }).catch(function () {
                PopUpSrv.error(null,'Well that\'s weird, try to save again please .');
            }).finally(function () {

                $timeout(function () {
                    endLoader();
                });
            });
        };

    }

})(angular);
