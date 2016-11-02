angular.module('ionic.viewApp.services')

.factory('$viewPopup', [
  '$ionicTemplateLoader',
  '$ionicBackdrop',
  '$q',
  '$timeout',
  '$rootScope',
  '$ionicBody',
  '$compile',
  '$ionicPlatform',
  '$ionicModal',
  'IONIC_BACK_PRIORITY',
function($ionicTemplateLoader, $ionicBackdrop, $q, $timeout, $rootScope, $ionicBody, $compile, $ionicPlatform, $ionicModal, IONIC_BACK_PRIORITY) {
  //TODO allow this to be configured
  var config = {
    stackPushDelay: 75
  };
  var popupStack = [];

  var $ionicPopup = {
    /**
     * @ngdoc method
     * @description
     * Show a complex popup. This is the master show function for all popups.
     *
     * A complex popup has a `buttons` array, with each button having a `text` and `type`
     * field, in addition to an `onTap` function.  The `onTap` function, called when
     * the corresponding button on the popup is tapped, will by default close the popup
     * and resolve the popup promise with its return value.  If you wish to prevent the
     * default and keep the popup open on button tap, call `event.preventDefault()` on the
     * passed in tap event.  Details below.
     *
     * @name $ionicPopup#show
     * @param {object} options The options for the new popup, of the form:
     *
     * ```
     * {
     *   title: '', // String. The title of the popup.
     *   cssClass: '', // String, The custom CSS class name
     *   subTitle: '', // String (optional). The sub-title of the popup.
     *   template: '', // String (optional). The html template to place in the popup body.
     *   templateUrl: '', // String (optional). The URL of an html template to place in the popup   body.
     *   scope: null, // Scope (optional). A scope to link to the popup content.
     *   buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
     *     text: 'Cancel',
     *     type: 'button-default',
     *     onTap: function(e) {
     *       // e.preventDefault() will stop the popup from closing when tapped.
     *       e.preventDefault();
     *     }
     *   }, {
     *     text: 'OK',
     *     type: 'button-positive',
     *     onTap: function(e) {
     *       // Returning a value will cause the promise to resolve with the given value.
     *       return scope.data.response;
     *     }
     *   }]
     * }
     * ```
     *
     * @returns {object} A promise which is resolved when the popup is closed. Has an additional
     * `close` function, which can be used to programmatically close the popup.
     */
    show: showPopup,

    /**
     * @ngdoc method
     * @name $ionicPopup#alert
     * @description Show a simple alert popup with a message and one button that the user can
     * tap to close the popup.
     *
     * @param {object} options The options for showing the alert, of the form:
     *
     * ```
     * {
     *   title: '', // String. The title of the popup.
     *   cssClass: '', // String, The custom CSS class name
     *   subTitle: '', // String (optional). The sub-title of the popup.
     *   template: '', // String (optional). The html template to place in the popup body.
     *   templateUrl: '', // String (optional). The URL of an html template to place in the popup   body.
     *   okText: '', // String (default: 'OK'). The text of the OK button.
     *   okType: '', // String (default: 'button-positive'). The type of the OK button.
     * }
     * ```
     *
     * @returns {object} A promise which is resolved when the popup is closed. Has one additional
     * function `close`, which can be called with any value to programmatically close the popup
     * with the given value.
     */
    alert: showAlert,

    /**
     * @ngdoc method
     * @name $ionicPopup#confirm
     * @description
     * Show a simple confirm popup with a Cancel and OK button.
     *
     * Resolves the promise with true if the user presses the OK button, and false if the
     * user presses the Cancel button.
     *
     * @param {object} options The options for showing the confirm popup, of the form:
     *
     * ```
     * {
     *   title: '', // String. The title of the popup.
     *   cssClass: '', // String, The custom CSS class name
     *   subTitle: '', // String (optional). The sub-title of the popup.
     *   template: '', // String (optional). The html template to place in the popup body.
     *   templateUrl: '', // String (optional). The URL of an html template to place in the popup   body.
     *   cancelText: '', // String (default: 'Cancel'). The text of the Cancel button.
     *   cancelType: '', // String (default: 'button-default'). The type of the Cancel button.
     *   okText: '', // String (default: 'OK'). The text of the OK button.
     *   okType: '', // String (default: 'button-positive'). The type of the OK button.
     * }
     * ```
     *
     * @returns {object} A promise which is resolved when the popup is closed. Has one additional
     * function `close`, which can be called with any value to programmatically close the popup
     * with the given value.
     */
    confirm: showConfirm,

    /**
     * @ngdoc method
     * @name $ionicPopup#prompt
     * @description Show a simple prompt popup, which has an input, OK button, and Cancel button.
     * Resolves the promise with the value of the input if the user presses OK, and with undefined
     * if the user presses Cancel.
     *
     * ```javascript
     *  $ionicPopup.prompt({
     *    title: 'Password Check',
     *    template: 'Enter your secret password',
     *    inputType: 'password',
     *    inputPlaceholder: 'Your password'
     *  }).then(function(res) {
     *    console.log('Your password is', res);
     *  });
     * ```
     * @param {object} options The options for showing the prompt popup, of the form:
     *
     * ```
     * {
     *   title: '', // String. The title of the popup.
     *   cssClass: '', // String, The custom CSS class name
     *   subTitle: '', // String (optional). The sub-title of the popup.
     *   template: '', // String (optional). The html template to place in the popup body.
     *   templateUrl: '', // String (optional). The URL of an html template to place in the popup body.
     *   inputType: // String (default: 'text'). The type of input to use
     *   defaultText: // String (default: ''). The initial value placed into the input.
     *   maxLength: // Integer (default: null). Specify a maxlength attribute for the input.
     *   inputPlaceholder: // String (default: ''). A placeholder to use for the input.
     *   cancelText: // String (default: 'Cancel'. The text of the Cancel button.
     *   cancelType: // String (default: 'button-default'). The type of the Cancel button.
     *   okText: // String (default: 'OK'). The text of the OK button.
     *   okType: // String (default: 'button-positive'). The type of the OK button.
     * }
     * ```
     *
     * @returns {object} A promise which is resolved when the popup is closed. Has one additional
     * function `close`, which can be called with any value to programmatically close the popup
     * with the given value.
     */
    prompt: showPrompt,
    /**
     * @private for testing
     */
    _createPopup: createPopup,
    _popupStack: popupStack
  };

  return $ionicPopup;

  function createPopup(options) {
    options = angular.extend({
      scope: null,
      title: '',
      buttons: []
    }, options || {});

    var self = {};
    self.scope = (options.scope || $rootScope).$new();
    self.element = angular.element(POPUP_TPL);
    self.responseDeferred = $q.defer();

    $ionicBody.get().appendChild(self.element[0]);
    $compile(self.element)(self.scope);

    angular.extend(self.scope, {
      title: options.title,
      buttons: options.buttons,
      subTitle: options.subTitle,
      cssClass: options.cssClass,
      $buttonTapped: function(button, event) {
        var result = (button.onTap || angular.noop).apply(self, [event]);
        event = event.originalEvent || event; //jquery events

        if (!event.defaultPrevented) {
          self.responseDeferred.resolve(result);
        }
      }
    });

    $q.when(
      options.templateUrl ?
      $ionicTemplateLoader.load(options.templateUrl) :
        (options.template || options.content || '')
    ).then(function(template) {
      var popupBody = angular.element(self.element[0].querySelector('.popup-body'));
      if (template) {
        popupBody.html(template);
        $compile(popupBody.contents())(self.scope);
      } else {
        popupBody.remove();
      }
    });

    self.show = function() {
      if (self.isShown || self.removed) return;

      $ionicModal.stack.add(self);
      self.isShown = true;
      ionic.requestAnimationFrame(function() {
        //if hidden while waiting for raf, don't show
        if (!self.isShown) return;

        self.element.removeClass('popup-hidden');
        self.element.addClass('popup-showing active');
        focusInput(self.element);
      });
    };

    self.hide = function(callback) {
      callback = callback || angular.noop;
      if (!self.isShown) return callback();

      $ionicModal.stack.remove(self);
      self.isShown = false;
      self.element.addClass('popup-hidden');
      self.element.removeClass('popup-showing active');
      $timeout(callback, 250, false);
    };

    self.remove = function() {
      if (self.removed) return;

      self.hide(function() {
        self.element.remove();
        self.scope.$destroy();
      });

      self.removed = true;
    };

    return self;
  }

  function onHardwareBackButton() {
    var last = popupStack[popupStack.length - 1];
    last && last.responseDeferred.resolve();
  }

  function showPopup(options) {
    var popup = $ionicPopup._createPopup(options);
    var showDelay = 0;

    if (popupStack.length > 0) {
      showDelay = config.stackPushDelay;
      $timeout(popupStack[popupStack.length - 1].hide, showDelay, false);
    } else {
      //Add popup-open & backdrop if this is first popup
      //$ionicBody.addClass('popup-open');
      $ionicBackdrop.retain();
      //only show the backdrop on the first popup
      $ionicPopup._backButtonActionDone = $ionicPlatform.registerBackButtonAction(
        onHardwareBackButton,
        IONIC_BACK_PRIORITY.popup
      );
    }

    // Expose a 'close' method on the returned promise
    popup.responseDeferred.promise.close = function popupClose(result) {
      if (!popup.removed) popup.responseDeferred.resolve(result);
    };
    //DEPRECATED: notify the promise with an object with a close method
    popup.responseDeferred.notify({ close: popup.responseDeferred.close });

    doShow();

    return popup.responseDeferred.promise;

    function doShow() {
      popupStack.push(popup);
      $timeout(popup.show, showDelay, false);

      popup.responseDeferred.promise.then(function(result) {
        var index = popupStack.indexOf(popup);
        if (index !== -1) {
          popupStack.splice(index, 1);
        }

        popup.remove();

        if (popupStack.length > 0) {
          popupStack[popupStack.length - 1].show();
        } else {
          $ionicBackdrop.release();
          //Remove popup-open & backdrop if this is last popup
        //  $timeout(function() {
        //    // wait to remove this due to a 300ms delay native
        //    // click which would trigging whatever was underneath this
        //    if (!popupStack.length) {
        //      $ionicBody.removeClass('popup-open');
        //    }
        //  }, 400, false);
          ($ionicPopup._backButtonActionDone || angular.noop)();
        }


        return result;
      });

    }

  }

  function focusInput(element) {
    var focusOn = element[0].querySelector('[autofocus]');
    if (focusOn) {
      focusOn.focus();
    }
  }

  function showAlert(opts) {
    return showPopup(angular.extend({
      buttons: [{
        text: opts.okText || 'OK',
        type: opts.okType || 'button-positive',
        onTap: function() {
          return true;
        }
      }]
    }, opts || {}));
  }

  function showConfirm(opts) {
    return showPopup(angular.extend({
      buttons: [{
        text: opts.cancelText || 'Cancel',
        type: opts.cancelType || 'button-default',
        onTap: function() { return false; }
      }, {
        text: opts.okText || 'OK',
        type: opts.okType || 'button-positive',
        onTap: function() { return true; }
      }]
    }, opts || {}));
  }

  function showPrompt(opts) {
    var scope = $rootScope.$new(true);
    scope.data = {};
    scope.data.fieldtype = opts.inputType ? opts.inputType : 'text';
    scope.data.response = opts.defaultText ? opts.defaultText : '';
    scope.data.placeholder = opts.inputPlaceholder ? opts.inputPlaceholder : '';
    scope.data.maxlength = opts.maxLength ? parseInt(opts.maxLength) : '';
    var text = '';
    if (opts.template && /<[a-z][\s\S]*>/i.test(opts.template) === false) {
      text = '<span>' + opts.template + '</span>';
      delete opts.template;
    }
    return showPopup(angular.extend({
      template: text + '<input ng-model="data.response" '
        + 'type="{{ data.fieldtype }}"'
        + 'maxlength="{{ data.maxlength }}"'
        + 'placeholder="{{ data.placeholder }}"'
        + '>',
      scope: scope,
      buttons: [{
        text: opts.cancelText || 'Cancel',
        type: opts.cancelType || 'button-default',
        onTap: function() {}
      }, {
        text: opts.okText || 'OK',
        type: opts.okType || 'button-positive',
        onTap: function() {
          return scope.data.response || '';
        }
      }]
    }, opts || {}));
  }
}]);

var POPUP_TPL =
  '<div class="popup-container" ng-class="cssClass">' +
    '<div class="popup">' +
      '<div class="popup-head">' +
        '<h3 class="popup-title" ng-bind-html="title"></h3>' +
        '<h5 class="popup-sub-title" ng-bind-html="subTitle" ng-if="subTitle"></h5>' +
      '</div>' +
      '<div class="popup-body">' +
      '</div>' +
      '<div class="popup-buttons" ng-show="buttons.length">' +
        '<button ng-repeat="button in buttons" ng-click="$buttonTapped(button, $event)" class="button" ng-class="button.type || \'button-default\'" ng-bind-html="button.text"></button>' +
      '</div>' +
    '</div>' +
  '</div>';
