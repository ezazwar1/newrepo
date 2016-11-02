'use strict';

(function () {
    angular.module('znk.sat').factory('PopUpSrv',[
        '$injector', '$q', '$rootScope', '$animate','$location','$analytics','KeyboardSrv', 'GoBackHardwareSrv',
        function ($injector, $q, $rootScope, $animate, $location,$analytics,KeyboardSrv, GoBackHardwareSrv) {
            var PopUpSrv = {};

            var $body = angular.element(document.querySelector('body'));
            $body.append('<div class="znk-popup"></div>');
            var $znkPopupPlaceHolder = angular.element(document.querySelector('.znk-popup'));

            var popupInstance,
                popupDefer;

            PopUpSrv.closePopup = function(reject,reason){
                if(!reason){
                    reason = 'terminated';
                }
                $znkPopupPlaceHolder.empty();
                if (popupInstance.scope) {
                    popupInstance.scope.$destroy();
                }
                popupDefer[(reject ? 'reject' : 'resolve')](reason);
            };

            function popup(wrapperCls,header,body,buttonsArr){
                //kill current popup if exists
                if(popupInstance){
                    PopUpSrv.closePopup();
                }
                var childScope = $rootScope.$new(true);
                childScope.d = {};

                popupDefer = $q.defer();
                popupInstance = {};
                popupInstance.promise = popupDefer.promise;

                $analytics.pageTrack($location.url() + '/popup');

                var template =
                    '<div class="%wrapperCls%">' +
                        '<div class="znk-popup-wrapper">' +
                            '<div class="znk-popup-header">%header%</div>' +
                            '<div class="znk-popup-body">%body%</div>' +
                            '<div class="znk-popup-buttons">' +
                            '<div ng-repeat="button in d.buttons" class="button-wrapper">' +
                                 '<button class="btn" ' +
                                          'ng-click="d.btnClick(button)" ' +
                                          'ng-class="button.type" ' +
                                          'analytics-on="click" ' +
                                          'analytics-event="click-popup-{{button.text}}" ' +
                                          'analytics-category="popup">' +
                                '{{button.text}}' +
                                '</button>' +
                            '</div>' +
                        '</div>' +
                    '</div>';

                wrapperCls = wrapperCls ? ' ' + wrapperCls : '';
                template = template.replace('%wrapperCls%',wrapperCls);

                header = header || '';
                template = template.replace('%header%',header);

                body = body || '';
                template = template.replace('%body%',body);

                if(angular.isDefined(buttonsArr) && !angular.isArray(buttonsArr)){
                    buttonsArr = [buttonsArr];
                }
                childScope.d.buttons = buttonsArr;
                childScope.d.btnClick = function(button){
                    if(button.hasOwnProperty('rejectVal')){
                        childScope.d.close(button.rejectVal,true);
                    }else{
                        childScope.d.close(button.resolveVal);
                    }
                };

                childScope.d.close = function(reason,reject){
                    var animationLeaveProm = $animate.leave($template);
                    animationLeaveProm.then(function(){
                        if(childScope){
                            childScope.$destroy();
                            childScope = null;
                        }
                        popupInstance = null;

                        if(popupDefer){
                            popupDefer[reject ? 'reject' : 'resolve'](reason || 'close');
                            popupDefer = null;
                        }
                    });
                };

                var $template = angular.element(template);
                $animate.enter($template,$znkPopupPlaceHolder);
                //was added because injecting $compile dependency causing circular dependency
                var $compile = $injector.get('$compile');
                $compile($znkPopupPlaceHolder.contents())(childScope);

                return popupInstance;
            }
            PopUpSrv.popup = popup;

            function basePopup(wrapperCls,headerIcon,title,content,btnArr){
                wrapperCls = wrapperCls ? wrapperCls + ' base-popup show-hide-animation' : 'base-popup show-hide-animation';

                headerIcon = headerIcon || '';
                var header = '<div class="icon-wrapper"><i class="%headerIcon%"></i></div>';
                header = header.replace('%headerIcon%',headerIcon);

                var body = '<div class="title responsive-title">%title%</div><div class="content">%content%</div>';
                title = title || '';
                body = body.replace('%title%',title);
                content = content || '';
                body = body.replace('%content%',content);

                return popup(wrapperCls,header,body,btnArr);
            }
            PopUpSrv.basePopup  = basePopup;

            function BaseButton(text,type,resolveVal,rejectVal){
                var btn = {
                    text: text || '',
                    type: type || ''
                };

                if(rejectVal){
                    btn.rejectVal = rejectVal;
                }else{
                    btn.resolveVal = resolveVal;
                }

                return btn;
            }
            PopUpSrv.BaseButton = BaseButton;

            function error(title,content){
                KeyboardSrv.hideKeyboard();
                var btn = new BaseButton('OK',null,'ok');
                return basePopup('error-popup','ion-close-round',title || 'OOOPS...',content,[btn]);
            }
            PopUpSrv.error = error;

            function success(title,content){
                KeyboardSrv.hideKeyboard();
                var btn = new BaseButton('OK',null,'ok');
                return basePopup('success-popup','correct-answer-white',title || '',content,[btn]);
            }
            PopUpSrv.success = success;

            function warning(title,content,acceptBtnTitle,cancelBtnTitle){
                var buttons = [
                    new BaseButton(acceptBtnTitle,null,acceptBtnTitle),
                    new BaseButton(cancelBtnTitle,'btn-outline',undefined,cancelBtnTitle)
                ];
                return basePopup('warning-popup','warning-icon',title,content,buttons);
            }
            PopUpSrv.warning = warning;

            function exercisePopup(wrapperCls,headerIcon,title,content,buttons){
                wrapperCls = wrapperCls ? ' ' + wrapperCls: '';
                return basePopup('exercise-popup' + wrapperCls,headerIcon,title,content,buttons).promise;
            }
            PopUpSrv.exercisePopup = exercisePopup;

            function gameErrorPopup(title,content,btnTitle){
                var buttons = [
                    new BaseButton(btnTitle,null,btnTitle),
                    new BaseButton('HOME','btn-outline','home')
                ];
                var promise = exercisePopup('error-popup','ion-close-round',title,content,buttons);
                var handlerDestroyer = _registerGoBackHardwareClosePopUpHandler(false,'Review your work');
                promise.then(function(res){
                    if(res === 'home'){
                        var $state = $injector.get('$state');
                        $state.go('app.home');
                    }
                    if(handlerDestroyer){
                        handlerDestroyer();
                    }
                });
                return promise;
            }
            PopUpSrv.gameErrorPopup = gameErrorPopup;

            function perfectionGameOver(btnTitle){
                return gameErrorPopup('Game Over','Sorry, you couldn\'t make mistakes in this kind of game. <br>Better luck next time!',btnTitle);
            }
            PopUpSrv.perfectionGameOver = perfectionGameOver;

            function checkPointGameOver(btnTitle){
                return gameErrorPopup('You\'re out of time','Want more practice? Check out our drills! <br>Better luck next time!',btnTitle);
            }
            PopUpSrv.checkPointGameOver = checkPointGameOver;

            function speedRunGameOver(btnTitle){
                return gameErrorPopup('You\'re out of time','Want more practice? Check out our drills! <br>Better luck next time!',btnTitle);
            }
            PopUpSrv.speedRunGameOver = speedRunGameOver;

            function pushItGameOver(btnTitle){
                return gameErrorPopup('You\'re out of time','Want more practice? Check out our drills! <br>Better luck next time!',btnTitle);
            }
            PopUpSrv.pushItGameOver = pushItGameOver;

            function genericSuccessPopupHandler(options){
                var buttons = [];
                if(options.showCancelButton){
                    buttons.push(new BaseButton(options.cancelButtonText,null,options.cancelButtonText));
                }
                buttons.push(new BaseButton(options.confirmButtonText,'btn-outline',options.confirmButtonText));
                return exercisePopup('success-popup','correct-answer-white',options.title,options.content,buttons);
            }
            PopUpSrv.genericSuccessPopupHandler = genericSuccessPopupHandler;

            function genericWarningPopupHandler(options){
                var buttons = [];
                if(options.showCancelButton){
                    buttons.push(new BaseButton(options.cancelButtonText,null,undefined,options.cancelButtonText));
                }
                buttons.push(new BaseButton(options.confirmButtonText,'btn-outline',options.confirmButtonText));
                return exercisePopup('warning-popup','warning-icon',options.title,options.content,buttons);
            }

            var genericTypeMap = {
                'success': genericSuccessPopupHandler,
                'warning': genericWarningPopupHandler
            };

            function _registerGoBackHardwareClosePopUpHandler(reject,reason){
                function handler(){
                    PopUpSrv.closePopup(reject,reason);
                }
                return GoBackHardwareSrv.registerHandler(handler,300);
            }

            function genericPopup(options){
                var handlerDestroyer = _registerGoBackHardwareClosePopUpHandler(true);
                var popupPromise = genericTypeMap[options.type](options);
                popupPromise.finally(function(){
                    if(handlerDestroyer){
                        handlerDestroyer();
                    }
                });
                return popupPromise;
            }
            PopUpSrv.genericPopup = genericPopup;

            PopUpSrv.isPopupOpen = function(){
                return !!popupInstance;
            };

            return PopUpSrv;
        }
    ]);
})();
