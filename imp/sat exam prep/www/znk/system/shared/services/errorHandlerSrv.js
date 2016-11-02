'use strict';

(function () {

    angular.module('znk.sat').factory('ErrorHandlerSrv', [
        '$window', 'PopUpSrv', 'GoBackHardwareSrv', ErrorHandlerSrv]);

    function ErrorHandlerSrv($window, PopUpSrv, GoBackHardwareSrv) {

        var messages = {
            defaultErrorMessage: 'An error has occurred, please try again later',
            noInternetConnection: 'You are not connected to the internet',
            emptyUserName: 'Invalid username'
        };

        var newErrorMessage = function newErrorMessage() {
            return {
                status: 0,
                message: messages.defaultErrorMessage
            };
        };

        var handleServerError = function handleServerError(err) {

            var _newError = newErrorMessage();

            //no error object from server, return general error
            if (!err) {
                return _newError;
            }

            if (err.data) {

                if ($window.atatus) {
                    $window.atatus.notify('server error: ' + err.data);
                }

                if (err.data.error) {
                    // /tokrn error, return the same err object
                    if (err.data.error === 'invalid_grant' || err.data.error === 'invalid_clientId') {
                        err.message = err.data.error_description;
                        return err;
                    }
                }

                if (err.data.error_description) {
                    _newError.message = err.data.error_description;
                    return _newError;
                }

                if (err.data.modelState) {
                    var validationErrors = [];
                    for (var key in err.data.modelState) {
                        for (var i = 0; i < err.data.modelState[key].length; i++) {
                            validationErrors.push(err.data.modelState[key][i]);
                        }
                    }

                    if (validationErrors.length) {
                        _newError.message = '';
                        //TODO: should return all errors, split by ',' or just return the 1st error messege??
                        for (var j = 0; j < validationErrors.length; j++) {
                            if (validationErrors[j]) {
                                _newError.message += (validationErrors[j] + ' ');
                            }
                        }
                    }

                    return _newError;
                }
                else if (err.data.message) {

                    if (err.data.message.length) {
                        _newError.message = err.data.message;
                    }

                    return _newError;
                }
                else {
                    return _newError;
                }
            }
            else if (err.status === 0) {
                _newError.message = messages.noInternetConnection;
                return _newError;
            }
            else {
                //no data within server error object, return general error
                return _newError;
            }
        };

        var handleError = function handleError(err) {

            var _newError = newErrorMessage();

            if (!err) {
                return _newError;
            }

            if (err.error) {

                if ($window.atatus) {
                    $window.atatus.notify('Handle Error: ' + err.error);
                }

                if (err.error === 'invalid_grant' || err.error === 'invalid_clientId') {
                    err.message = err.error_description;
                    return err;
                }
            }

            if (!err.message) {
                if (err.status) {
                    if (err.status === 0) {
                        return _newError;
                    }

                }
                else {
                    return _newError;
                }
            }
            else {
                return err;
            }

        };

        var displayErrorMsg = function displayErrorMsg(message, animated, title) {
            var goBackDestroyer = GoBackHardwareSrv.registerClosePopupHandler(undefined,true);
            PopUpSrv.error(title,message).promise.then(function(){
                if (goBackDestroyer){
+                   goBackDestroyer();
                }
            });
        };

        var displaySuccessMsg = function displaySuccessMsg(message, animated, title) {
            return PopUpSrv.success(message).promise;
        };

        return {
            handleServerError:handleServerError,
            handleError: handleError,
            messages: messages,
            displayErrorMsg: displayErrorMsg,
            displaySuccessMsg: displaySuccessMsg
        };
    }

})();
