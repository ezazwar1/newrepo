(function (angular) {
    'use strict';

    angular.module('znk.sat').factory('ZnkModalSrv', [
        '$document', '$rootScope', '$compile', '$q', '$timeout', '$injector', '$animate','$location', '$analytics', '$controller',
        function ($document, $rootScope, $compile, $q, $timeout, $injector, $animate, $location, $analytics, $controller) {
            var $body = angular.element($document[0].querySelector('body'));
            var $znkModal = angular.element('<div class="znk-modal"></div>');
            $body.append($znkModal);
            var openModalArr = [];

            var ZnkModalSrv = {};

            function closeAll() {
                openModalArr.forEach(function (modal) {
                    modal.close();
                });
                openModalArr = [];
            }
            ZnkModalSrv.closeAll = closeAll;

            /**
             *
             *  options object:
             *      wrapperClass
             *      templateUrl
             *      ctrl
             *      ctrlAs
             *      hideBackdrop
             *      dontCentralize
             *      blurMainContent
             *      dontBounce
             *      closeOtherModals
             *      dontCloseOnBackdropTouch
             *      showCloseBtn
             *      resolve
             *
             *
             *  return ModalCtrl:
             *      scope
             *      close
             *      hide
             *      show
             *      promise
             */
            function modal(options) {


                options = options || {};

                var url = options.ctrl ? options.ctrl : '//';

                $analytics.pageTrack(url);

                var template =
                    '<div class="znk-modal-wrapper %wrapperClass%" ng-hide="hide" %closeOnBackdropClick%>' +
                        '<div class="znk-modal-content"%view%></div>' +
                        '%closeBtn%' +
                    '</div>';

                var closeOnBackdropClick = options.dontCloseOnBackdropTouch ? '' : 'ng-click="_modalTouch($event)"';

                var wrapperClass = options.hideBackdrop ? '' : 'show-backdrop ';

                wrapperClass += options.dontCentralize ? '' : 'centralize ';

                wrapperClass += options.wrapperClass || '';

                /*var closeBtn = options.showCloseBtn ? '<div class="close-btn-wrapper" ng-click="close()"><i class="close-x-white-icon"></i></div>' : '';*/
                var closeBtn = options.showCloseBtn ? '<div class="close-btn-wrapper" ng-click="close()"><i class="ion-ios-close-empty"></i></div>' : '';

                var templateUrl = options.templateUrl ? ' const-template-drv="' + options.templateUrl + '"' : '';

                template = template.replace('%closeOnBackdropClick%', closeOnBackdropClick);
                template = template.replace('%wrapperClass%', wrapperClass);
                template = template.replace('%view%', templateUrl);
                template = template.replace('%closeBtn%', closeBtn);

                function addDefaultClassesToBody() {
                    var classesToAdd = 'znk-modal-open';

                    if (options.blurMainContent) {
                        //classesToAdd += ' blur-main-content';
                    }

                    $body.addClass(classesToAdd);
                }

                function removeDefaultClassesFromBody() {
                    var classesToRemove = 'znk-modal-open blur-main-content';

                    $body.removeClass(classesToRemove);
                }

                //prevent window from bouncing while the modal is open
                function touchmoveCB() {
                    event.preventDefault();
                }
                if (options.dontBounce) {
                    angular.element($document).on('touchmove', touchmoveCB);
                }

                var modalInstance = {};

                openModalArr.push(modalInstance);

                modalInstance.hide = function () {
                    if (options.dontBounce) {
                        angular.element($document).off('touchmove', touchmoveCB);
                    }
                    removeDefaultClassesFromBody();
                    childScope.hide = true;
                };

                modalInstance.show = function () {
                    if (options.dontBounce) {
                        angular.element($document).on('touchmove', touchmoveCB);
                    }
                    addDefaultClassesToBody();
                    childScope.hide = false;
                };

                modalInstance.close = function closeModal(resolveReason) {

                    modalInstance.closed = true;

                    $analytics.eventTrack('Modal closed', { category: 'modal'});

                    openModalArr = openModalArr.filter(function(modalInstanceItem){
                        return modalInstanceItem !== modalInstance;
                    });

                    var animationLeaveProm = $animate.leave($template);
                    return animationLeaveProm.then(function (){
                        angular.element($document).off('touchmove', touchmoveCB);
                        removeDefaultClassesFromBody();
                        var _resolveReason = resolveReason || 'closed';
                        defer.resolve(_resolveReason);
                        childScope.$destroy();
                        return _resolveReason;
                    });
                };

                var defer = $q.defer();
                modalInstance.promise = defer.promise;

                var childScope = options.scope || $rootScope.$new(true);

                childScope.close = modalInstance.close;

                modalInstance.scope = childScope;

                if (!options.dontCloseOnBackdropTouch) {
                    //timeout was added to prevent the modal closing following onTouch event
                    $timeout(function () {
                        childScope._modalTouch = function ($event) {//@todo(igor) should be in separate scope
                            if ($event.target === $template[0] || $event.target === $template.children()[0]) {
                                modalInstance.close();
                            }
                        };
                    }, 200);
                }
                //open modal
                var $template = angular.element(template);

                var ctrlInjections = {
                    $scope: childScope
                };

                var injectionPromArr = [];

                function addInjection(resolveName,prom){
                    injectionPromArr.push(
                        prom.then(function(resolve){
                            ctrlInjections[resolveName] = resolve;
                        })
                    );
                }

                if(options.resolve){
                    for(var resolveName in options.resolve){
                        var promGetter = options.resolve[resolveName];
                        var prom = $q.when(angular.isFunction(promGetter) ? promGetter() : promGetter);
                        addInjection(resolveName,prom);
                    }
                }

                var injectionAllProm = $q.all(injectionPromArr);
                injectionAllProm.then(function(){
                    if(options.ctrl){
                        //modal controller with injections creation
                        var ctrl = $controller(options.ctrl,ctrlInjections);
                        if(options.ctrlAs){
                            childScope[options.ctrlAs] = ctrl;
                        }
                    }
                    $animate.enter($template, $znkModal);
                    $compile($template)(childScope);
                    addDefaultClassesToBody();
                });

                childScope.$on('$destroy', function () {
                    angular.element($document).off('touchmove', touchmoveCB);
                    if(!modalInstance.closed){
                        modalInstance.close();
                    }
                });
                return modalInstance;
            }
            ZnkModalSrv.modal = modal;

            ZnkModalSrv.singletonModalFn = function singletonModal(options){
                function createModalFn(){
                    if(createModalFn.modalInstance && !createModalFn.modalInstance.closed){
                        return createModalFn.modalInstance;
                    }

                    createModalFn.modalInstance = ZnkModalSrv.modal(options);
                    return createModalFn.modalInstance;
                }
                return createModalFn;
            };

            ZnkModalSrv.isAnyModalOpen = function(){
                return openModalArr && openModalArr.length;
            };

            return ZnkModalSrv;
        }
    ]);
})(angular);
