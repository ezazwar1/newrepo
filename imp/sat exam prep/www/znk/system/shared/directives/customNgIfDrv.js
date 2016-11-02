/**
 * custom ng if directive , added in order to support bind once functionality
 *
 * attrs-
 *  custom-ng-if-drv: expression , if true the content will be attached to the dom.
 *  bind-once: angular expression which evaluated by the scope , if it true then the watcher will be killed after the first time the clone is added to the dom
 */

'use strict';

(function (angular) {
    angular.module('znk.sat').directive('customNgIfDrv', ['$animate', function ($animate) {
        return {
            transclude: 'element',
            priority: 600,
            terminal: true,
            restrict: 'A',
            $$tlb: true,
            link: function ($scope, $element, $attr, ctrl, $transclude) {
                var block, childScope, previousElements;
                var watchDestroyer = $scope.$watch($attr.customNgIfDrv, function ngIfWatchAction(value) {

                    if (!!value) {
                        if($scope.$eval($attr.bindOnce)){
                            watchDestroyer();
                        }
                        if (!childScope) {
                            childScope = $scope.$new();
                            $transclude(childScope, function (clone) {
                                clone[clone.length++] = document.createComment(' end ngIf: ' + $attr.ngIf + ' ');
                                // Note: We only need the first/last node of the cloned nodes.
                                // However, we need to keep the reference to the jqlite wrapper as it might be changed later
                                // by a directive with templateUrl when its template arrives.
                                block = {
                                    clone: clone
                                };
                                $animate.enter(clone, $element.parent(), $element);
                            });
                        }
                    } else {
                        if(previousElements) {
                            previousElements.remove();
                            previousElements = null;
                        }
                        if(childScope) {
                            childScope.$destroy();
                            childScope = null;
                        }
                        if(block) {
                            previousElements = getBlockElements(block.clone);
                            var animationLeaveProm = $animate.leave(previousElements);
                            animationLeaveProm.then(function() {
                                previousElements = null;
                            });
                            block = null;
                        }
                    }
                });
            }
        };
    }]);
})(angular);
