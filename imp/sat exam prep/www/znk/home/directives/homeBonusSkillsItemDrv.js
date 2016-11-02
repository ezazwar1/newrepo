/**
 * attrs:
 */

(function (angular) {
    'use strict';

    angular.module('znk.sat').directive('homeBonusSkillsItem', [
        'HomeSrv', '$ionicScrollDelegate', 'BonusSkillSrv',
        function (HomeSrv, $ionicScrollDelegate, BonusSkillSrv) {
            return {
                templateUrl: 'znk/home/templates/homeBonusSkillsItemDrv.html',
                restrict: 'E',
                scope: {
                    positionGetter: '&position',
                    itemIdGetter: '&itemId'
                },
                link: function (scope, element, attrs) {
                    var position = scope.positionGetter();
                    var itemId = scope.itemIdGetter();

                    element[0].style['-webkit-transform'] = 'translate3d(' + position.left + 'px, ' + position.top + 'px,0)';

                    var homePageScrollDelegate = $ionicScrollDelegate.$getByHandle('homePage');
                    function getScrollYOffset(){
                        var scrollPosition = homePageScrollDelegate.getScrollPosition();
                        return scrollPosition ? scrollPosition.top : 0;
                    }

                    function clickHandler(){
                        scope.$apply(function(){
                            if(attrs.disabled){
                                return;
                            }
                            var positionCopy = angular.copy(position);
                            positionCopy.top -= getScrollYOffset();
                            var bonusSkillsDetailsModalInstance = HomeSrv.showBonusSkillsDetailsModal(positionCopy,itemId);
                            bonusSkillsDetailsModalInstance.promise.then(function(res){
                                if(res){
                                    if(res && res.promise && !element.hasClass('complete')){
                                        res.promise.then(function(){
                                            isBonusSkillCompleted();
                                        });
                                    }
                                }
                            });
                        });
                    }
                    element.on('click',clickHandler);

                    function isBonusSkillCompleted(){
                        var isBonusSkillComplete = BonusSkillSrv.isBonusSkillComplete(itemId);
                        isBonusSkillComplete.then(function(isBonusSkillComplete){
                            if(isBonusSkillComplete){
                                element.addClass('complete');
                            }
                        });
                    }
                    isBonusSkillCompleted();

                    scope.$on('$destroy',function(){
                        element.off('click',clickHandler);
                    });
                }
            };
        }
    ]);
})(angular);

