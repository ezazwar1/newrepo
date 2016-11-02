'use strict';

app.factory('actionFactory', function($rootScope, $q, localStorageService) {
	var actionFactory = {};


  actionFactory.handleAction = function(visitor, actionName) {

    var handleActionPromise = $q.defer();

    var Action = Parse.Object.extend('Action');
    var action = new Action();

    action.set('byVisitor', visitor);
    action.set('action', actionName);

    // (TODO:) Add toggle for this
    action.set('onMobile', true);
    action.set('onWeb', false);

    action.save().then(function(action) {
      handleActionPromise.resolve(action);
    });

    return handleActionPromise.promise;
  }


  return actionFactory;
});