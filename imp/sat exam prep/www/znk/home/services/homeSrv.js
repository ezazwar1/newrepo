(function (angular) {
    'use strict';

    angular.module('znk.sat').factory('HomeSrv', ['ZnkModalSrv', 'ExerciseProgressSrv', '$q', 'DailyResultSrv', '$rootScope', 'ExerciseResultSrv', 'TutorialSrv',
        'GameSrv', 'StorageSrv', 'EnumSrv', 'BonusSkillSrv', 'DrillSrv', 'GoBackHardwareSrv', 'DailySrv', 'HomeItemStatusEnum', 'ExamSrv', 'SharedModalsSrv',
        function (ZnkModalSrv, ExerciseProgressSrv, $q, DailyResultSrv, $rootScope, ExerciseResultSrv, TutorialSrv, GameSrv, StorageSrv, EnumSrv, BonusSkillSrv, DrillSrv,
                  GoBackHardwareSrv, DailySrv, HomeItemStatusEnum, ExamSrv, SharedModalsSrv) {
            var HomeSrv = {};

            HomeSrv.showDailyDetailsModal = function (dailyItem, pos) {
                var modalScope = $rootScope.$new();
                modalScope.daily = dailyItem;
                modalScope.pos = pos;

                var options = {
                    templateUrl: 'znk/home/templates/dailyDetailsModal.html',
                    wrapperClass: 'home-daily-details show-animation',
                    dontCentralize: true,
                    scope: modalScope,
                    ctrl: 'HomeDailyDetailsModalCtrl'
                };
                var modalInstance = ZnkModalSrv.modal(options);
                GoBackHardwareSrv.registerBaseModalHandler(modalInstance);
                return modalInstance;
            };

            HomeSrv.showFreeDailiesEndedModal = function () {
                var modalScope = $rootScope.$new();
                modalScope.openIapModal = SharedModalsSrv.showIapModal.bind(SharedModalsSrv);
                var options = {
                    templateUrl: 'znk/home/templates/freeDailiesEndedModal.html',
                    wrapperClass: 'free-dailies-ended',
                    scope: modalScope,
                    hideBackdrop: true,
                    dontCentralize: true
                };
                var modalInstance = ZnkModalSrv.modal(options);
                GoBackHardwareSrv.registerBaseModalHandler(modalInstance);
                return modalInstance;
            };

            HomeSrv.getAllItems = function () {

                var getDiagnosticTestProm = ExamSrv.getExam(13);
                return $q.all([DailySrv.getAllDailies(), DailySrv.getDailiesNum(), getDiagnosticTestProm]).then(function (res) {
                    var allDailies = angular.copy(res[0]);
                    var dailiesNum = res[1];
                    var diagnosticExam = angular.copy(res[2]);

                    for (var i = allDailies.length; i < dailiesNum; i++) {
                        allDailies.push({
                            dailyOrder: i + 1,
                            status: HomeItemStatusEnum.NEW.enum
                        })
                    }

                    if(diagnosticExam.status !== HomeItemStatusEnum.COMPLETED.enum){
                        allDailies[0].status = HomeItemStatusEnum.NEW.enum;
                        diagnosticExam.status = HomeItemStatusEnum.ACTIVE.enum;
                    }

                    return angular.copy([diagnosticExam].concat(allDailies));
                });
            };

            HomeSrv.showBonusSkillsDetailsModal = function (pos, bonusSkillId) {
                var getBonusSkillDrillProm = BonusSkillSrv.getBonusSkillDrill(bonusSkillId);
                var getDrillProm = getBonusSkillDrillProm.then(function (bonusSkillDrill) {
                    var getDrillProm = DrillSrv.get(bonusSkillDrill.id);
                    var isDrillCompletedProm = DrillSrv.isDrillComplete(bonusSkillDrill.id);
                    var allProm = $q.all([getDrillProm, isDrillCompletedProm]);
                    return allProm.then(function (resArr) {
                        var drillCopy = angular.copy(resArr[0]);
                        drillCopy.isCompleted = resArr[1];
                        return drillCopy;
                    });
                });
                var options = {
                    templateUrl: 'znk/home/templates/homeBonusSkillsDetailsModal.html',
                    wrapperClass: 'home-bonus-skills-details show-animation',
                    dontCentralize: true,
                    ctrl: 'HomeBonusSkillsDetailsModalCtrl',
                    resolve: {
                        position: pos,
                        bonusSkillId: bonusSkillId,
                        drill: getDrillProm
                    }
                };
                var modalInstance = ZnkModalSrv.modal(options);
                GoBackHardwareSrv.registerBaseModalHandler(modalInstance);
                return modalInstance;
            };
            return HomeSrv;
        }
    ]);
})(angular);
