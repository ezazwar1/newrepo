'use strict';

(function (angular) {
    angular.module('znk.sat').controller('performanceCtrl',
        ['$scope', 'MobileSrv', 'EnumSrv', '$stateParams', 'CategorySrv', '$state', 'performanceData','estimatedScoreTimeLineData', '$ionicScrollDelegate', 'TimelineSrv', '$timeout', 'PersonalizationStatsSrv', 'generalCategoriesMockSrv', '$filter',
        function ($scope, MobileSrv, EnumSrv, $stateParams, CategorySrv, $state, performanceData, estimatedScoreTimeLineData, $ionicScrollDelegate, TimelineSrv, $timeout, PersonalizationStatsSrv, generalCategoriesMockSrv, $filter) {
            var isMobile = MobileSrv.isMobile();

            $scope.d = {};

            $scope.d.subjectEnum = EnumSrv.subject;

            $scope.d.currentSubject = + $stateParams.subjectId;

            $scope.d.arrowPos = {};
            $scope.d.arrowPos[$scope.d.subjectEnum.math.enum] = isMobile ? 47 : 35;
            $scope.d.arrowPos[$scope.d.subjectEnum.reading.enum] = isMobile ? 148 : 196;
            $scope.d.arrowPos[$scope.d.subjectEnum.writing.enum] = isMobile ? 247 : 358;

            $scope.d.subjectNames = {};
            $scope.d.subjectNames[$scope.d.subjectEnum.math.enum] = 'MATHEMATICS';
            $scope.d.subjectNames[$scope.d.subjectEnum.reading.enum] = 'READING';
            $scope.d.subjectNames[$scope.d.subjectEnum.writing.enum] = 'WRITING';

            $scope.d.estimatedScoreObj = performanceData;

            for(var subject in $scope.d.estimatedScoreObj){
                generalCategoriesMockSrv.addMisingCategories($scope.d.estimatedScoreObj[subject], subject);
            }

            $scope.d.categorysIconsAndNames = CategorySrv.getGeneralCategoriesMapping();

            for(var subject in  $scope.d.estimatedScoreObj){
                for(var category in $scope.d.estimatedScoreObj[subject].category){
                    var categoryArr = $scope.d.estimatedScoreObj[subject].category;
                    PersonalizationStatsSrv.setCategoryLevel(categoryArr[category]);
                }
            }

            $scope.d.returnToHomepage = function(){
                $state.go('app.home');
            };

            $scope.d.animation = true;

            $scope.d.timeLineData = { data: estimatedScoreTimeLineData[$scope.d.currentSubject], id: $scope.d.currentSubject };

            $scope.gaugeClickHandler = function (subjectId) {
                $scope.d.currentSubject = subjectId;
                $scope.d.animation = true;
                $scope.d.timeLineData = { data: estimatedScoreTimeLineData[subjectId], id: subjectId };
            };

            $scope.onEstimatedScore = function(estimatedScore) {
                $scope.estimatedScore = estimatedScore;
            };

            $scope.onTotalScore = function(totalScore) {
                $scope.d.totalScore = totalScore;
            };

            var optionsPerDevice = {
                height: 150,
                distance: 90,
                upOrDown: 75,
                yUp: 50,
                yDown: 35
            };

            if(!isMobile) {
                optionsPerDevice = {
                    height: 200,
                    distance: 115,
                    upOrDown: 100,
                    yUp: 60,
                    yDown: 45
                };
            }

            $scope.d.options = {
                colors: ['#75cbe8', '#f9d41b', '#ff5895'],
                colorId: $scope.d.currentSubject,
                isMobile: isMobile,
                height: optionsPerDevice.height,
                type: 'multi',
                isMax: true,
                max: 800,
                min: 200,
                subPoint: 35,
                distance: optionsPerDevice.distance,
                lineWidth: 2,
                images: TimelineSrv.getImages(),
                numbers: {
                    font: '200 12px Lato',
                    fillStyle: '#4a4a4a'
                },
                onFinish: function(obj) {

                    var lastLine = obj.data.lastLine[obj.data.lastLine.length - 1];
                    var beforeLast = obj.data.lastLine[obj.data.lastLine.length - 2];
                    var x = lastLine.lineTo.x - 50;
                    var y = (lastLine.lineTo.y < optionsPerDevice.upOrDown) ? lastLine.lineTo.y + optionsPerDevice.yDown : lastLine.lineTo.y - optionsPerDevice.yUp;
                    var angleDeg = Math.atan2(lastLine.lineTo.y - beforeLast.lineTo.y, lastLine.lineTo.x - beforeLast.lineTo.x) * 180 / Math.PI;

                    if(angleDeg < -40 || angleDeg > 40) {
                        x += 20;
                    }

                    $ionicScrollDelegate.$getByHandle('znk-timeline').scrollTo(lastLine.lineTo.x - 200, 0, true);

                    $scope.d.timelineMinMaxStyle = { 'top' : y+'px', 'left' : x+'px'};
                    $scope.d.timelineMinMaxText = $filter('number')($scope.estimatedScore[$scope.d.currentSubject].min, 0)+' - '+$filter('number')($scope.estimatedScore[$scope.d.currentSubject].max, 0);

                    $timeout(function() {
                        $scope.d.animation = false;
                    },150);
                }
            };
        }]);
})(angular);
