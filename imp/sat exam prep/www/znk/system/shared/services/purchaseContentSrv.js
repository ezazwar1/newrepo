(function (angular) {
    'use strict';

    angular.module('znk.sat').factory('PurchaseContentSrv', [
        'StorageSrv', '$q', '$parse', 'ENV', 'StoreRateSrv', 'AppRateStatusEnum', '$rootScope',
        function (StorageSrv, $q, $parse, ENV, StoreRateSrv, AppRateStatusEnum, $rootScope) {
            var PurchaseContentSrv = {
                FREE_CONTENT_CHANGED: 'PurchaseContentSrv: free content changed'
            };

            function getFreeContentData() {
                if (!getFreeContentData.iapProm) {
                    getFreeContentData.iapProm = $q.all([StoreRateSrv.getAppRateStatus(), StorageSrv.get('iap')]).then(function (all) {
                        var appRateStatus = all[0];
                        var iap = all[1];
                        var freeContentData = iap.freeContent[ENV.firebaseAppScopeName];
                        var defValues = {
                            daily: {},
                            examSections: {},
                            tutorial: {}
                        };
                        for (var prop in defValues) {
                            if (!freeContentData.hasOwnProperty(prop)) {
                                freeContentData[prop] = defValues[prop];
                            }
                        }

                        if (appRateStatus === AppRateStatusEnum.rate.enum) {
                            addFreeContentFollowingAppRate(freeContentData);
                        }
                        return freeContentData;
                    });
                }
                return getFreeContentData.iapProm;
            }

            function addFreeContentFollowingAppRate(freeContentData) {
                var keys = Object.keys(freeContentData);
                keys.forEach(function (key) {
                    deepExtend(freeContentData[key], freeContentData[key].appRate || {});
                });
            }

            function deepExtend(dest, src) {//@todo(igor) should be moved to dedicated utility service.
                var keys = Object.keys(src);
                keys.forEach(function(key){
                    if(!dest.hasOwnProperty(key) || !angular.isObject(src[key]) || !angular.isObject(dest)){
                        dest[key] = src[key];
                    }else{
                        deepExtend(dest[key],src[key]);
                    }
                });
                return dest;
            }

            function _getKeyProp(id) {
                return 'id_' + id;
            }

            PurchaseContentSrv.isFreeApp = function () {
                return getFreeContentData().then(function (freeContentData) {
                    return freeContentData.isFree || false;
                });
            };

            PurchaseContentSrv.getFreeDailiesIds = function () {
                return getFreeContentData().then(function (freeContentData) {
                    return freeContentData.daily;
                });
            };

            PurchaseContentSrv.getFreeDrillsIds = function () {
                return getFreeContentData().then(function (freeContentData) {
                    return freeContentData.drill;
                });
            };

            PurchaseContentSrv.getFreeTutorialsIds = function () {
                return getFreeContentData().then(function (freeContentData) {
                    return freeContentData.tutorial;
                });
            };

            function baseIsFreeContent(entityPath, entityId) {
                if (!angular.isNumber(entityId)) {
                    entityId = +entityId;
                }

                if (isNaN(entityId)) {
                    return $q.when(false);
                }

                return getFreeContentData().then(function (freeContentData) {
                    return !!$parse(entityPath)(freeContentData)[entityId];
                });
            }

            PurchaseContentSrv.isFreeDaily = baseIsFreeContent.bind(baseIsFreeContent, 'daily');

            PurchaseContentSrv.isFreeExam = function (examId) {
                if (!angular.isNumber(examId)) {
                    examId = +examId;
                }

                if (isNaN(examId)) {
                    return $q.when(false);
                }

                var examProp = _getKeyProp(examId);

                return getFreeContentData().then(function (freeContentData) {
                    return !!freeContentData.examSections[examProp];
                });
            };

            PurchaseContentSrv.isFreeSection = function (examId, sectionId) {
                if (!angular.isNumber(examId)) {
                    examId = +examId;
                }

                if (!angular.isNumber(sectionId)) {
                    sectionId = +sectionId;
                }

                if (isNaN(examId) || isNaN(examId)) {
                    return $q.when(false);
                }

                var examProp = _getKeyProp(examId);
                var sectionProp = _getKeyProp(sectionId);

                return getFreeContentData().then(function (freeContentData) {
                    return !!(freeContentData.examSections[examProp] && freeContentData.examSections[examProp].freeSections && freeContentData.examSections[examProp].freeSections[sectionProp]);
                });
            };

            var childScope = $rootScope.$new(true);
            childScope.$on(StoreRateSrv.APP_RATE_EVENT,function(evt,newStatus){
                if(newStatus === AppRateStatusEnum.rate.enum){
                    getFreeContentData().then(function(freeContentData){
                        addFreeContentFollowingAppRate(freeContentData);
                        $rootScope.$broadcast(PurchaseContentSrv.FREE_CONTENT_CHANGED,angular.copy(freeContentData));
                    });
                }
            });

            return PurchaseContentSrv;
        }
    ]);
})(angular);
