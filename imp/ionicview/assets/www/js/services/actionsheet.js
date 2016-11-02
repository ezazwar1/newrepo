angular.module('ionic.viewApp.services')

.factory('$viewActionSheet', [
  '$rootScope',
  '$compile',
  '$animate',
  '$timeout',
  '$ionicTemplateLoader',
  '$ionicPlatform',
  '$ionicBody',
  'IONIC_BACK_PRIORITY',
function($rootScope, $compile, $animate, $timeout, $ionicTemplateLoader, $ionicPlatform, $ionicBody, IONIC_BACK_PRIORITY) {

  var savedScope, firstTime = true;

  return {
    show: actionSheet
  };

  function actionSheet(opts) {
    if (savedScope) {
      savedScope.showSheet();
      return savedScope.cancel;
    }

    var scope = savedScope = $rootScope.$new(true);

    angular.extend(scope, {
      cancel: angular.noop,
      destructiveButtonClicked: angular.noop,
      buttonClicked: angular.noop,
      $deregisterBackButton: angular.noop,
      buttons: [],
      cancelOnStateChange: true
    }, opts || {});

    function textForIcon(text) {
      if (text && /icon/.test(text)) {
        scope.$actionSheetHasIcon = true;
      }
    }

    for (var x = 0; x < scope.buttons.length; x++) {
      textForIcon(scope.buttons[x].text);
    }
    textForIcon(scope.cancelText);
    textForIcon(scope.destructiveText);

    // Compile the template
    var element = scope.element = $compile('<view-action-sheet ng-class="cssClass" buttons="buttons"></view-action-sheet>')(scope);

    // Grab the sheet element for animation
    var sheetEl = angular.element(element[0].querySelector('.action-sheet-wrapper'));
    var backdropEl = angular.element(element[0].querySelector('.action-sheet-backdrop'));

    // removes the actionSheet from the screen
    scope.removeSheet = function(done) {
      //if (scope.removed) return;

      //scope.removed = true;
      sheetEl.removeClass('action-sheet-up');
     // $timeout(function() {
     //   // wait to remove this due to a 300ms delay native
     //   // click which would trigging whatever was underneath this
     //   $ionicBody.removeClass('action-sheet-open');
     // }, 600);
      scope.$deregisterBackButton();
      scope.stateChangeListenDone();

      backdropEl.removeClass('active');
      //$animate.removeClass(backdropEl, 'active').then(function() {
      $timeout(function() {
        element.addClass('hidden');
      }, 500);

        //scope.$destroy();
        //element.remove();
        // scope.cancel.$scope is defined near the bottom
        //scope.cancel.$scope = sheetEl = null;
        //(done || noop)(opts.buttons);
      //});
    };

    scope.showSheet = function(done) {
      if (scope.removed) return;
      // registerBackButtonAction returns a callback to deregister the action
      scope.$deregisterBackButton = $ionicPlatform.registerBackButtonAction(
        function() {
          $timeout(scope.cancel);
        },
        IONIC_BACK_PRIORITY.actionSheet
      );

      scope.stateChangeListenDone = scope.cancelOnStateChange ?
        $rootScope.$on('$stateChangeSuccess', function() { scope.cancel(); }) :
        angular.noop;

      firstTime && $ionicBody.append(element)
      //          .addClass('action-sheet-open')

      element.removeClass('hidden');

    //  $animate.addClass(backdropEl, 'active').then(function() {
    //    if (scope.removed) return;
    //    (done || noop)();
    //  });
      backdropEl.addClass('active')
      if (firstTime) {
        $timeout(function() {
          //if (scope.removed) return;
          sheetEl.addClass('action-sheet-up');
        }, 20, false);
        firstTime = false;
      } else {
        sheetEl.addClass('action-sheet-up');
      }
    };

    // called when the user presses the cancel button
    scope.cancel = function() {
      // after the animation is out, call the cancel callback
      scope.removeSheet(opts.cancel);
    };

    scope.buttonClicked = function(index) {
      // Check if the button click event returned true, which means
      // we can close the action sheet
      if (opts.buttonClicked(index, opts.buttons[index]) === true) {
        scope.removeSheet();
      }
    };

    scope.destructiveButtonClicked = function() {
      // Check if the destructive button click event returned true, which means
      // we can close the action sheet
      if (opts.destructiveButtonClicked() === true) {
        scope.removeSheet();
      }
    };


    $timeout(scope.showSheet, 64)

    // Expose the scope on $ionicActionSheet's return value for the sake
    // of testing it.
    scope.cancel.$scope = scope;

    return scope.cancel;
  }
}]);
