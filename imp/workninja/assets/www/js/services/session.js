'use strict';

app.factory('Session', [
  'CONFIG',
  '$window',
function(CONFIG, $window) {

  var prefix = 'workninja-app';

  var storage = {
    get: function(name) {
      var itemName = prefix + '/' + name;
      var str = $window.localStorage.getItem(itemName);
      try {
        return str ? JSON.parse(str) : undefined;
      }
      catch (e) {
        console.log('Error reading "' + itemName + '": ' + e);
        return undefined;
      }
    },

    set: function(name, value) {
      var itemName = prefix + '/' + name;
      $window.localStorage.setItem(itemName, JSON.stringify(value));
    },

    remove: function(name) {
      var itemName = prefix + '/' + name;
      $window.localStorage.removeItem(itemName);
    }
  };

  var Session = {};

  Object.defineProperties(Session, {
    currentUser: {
      get: function() {
        var currentUser = storage.get('currentUser');
        if (currentUser !== undefined) {
          Object.defineProperties(currentUser, {
            fullName: {
              get: function() {
                return _.strip(this.first_name + ' ' + this.last_name);
              }
            },
            isAdmin: {
              get: function() {
                return this.owner_type === 'admin';
              }
            },
            isCustomer: {
              get: function() {
                return this.owner_type === 'manager';
              }
            },
            isStaff: {
              get: function() {
                return this.owner_type === 'staff';
              }
            },
            pictureUrl: {
              get: function() {
                if (this.picture_thumb_url) {
                  return this.picture_thumb_url;
                }
                else {
                  return null;
                }
              }
            }
          })
        }
        return currentUser;
      },
      set: function(value) {
        angular.isObject(value) ? storage.set('currentUser', value) : storage.remove('currentUser');
      }
    },

    isAuthenticated: {
      get: function() {
        return this.currentUser !== undefined;
      }
    },

    batterySavingMode: {
      get: function() {
        var res = storage.get('batterySavingMode');
        return res === undefined ? true : res;
      },
      set: function(value) {
        storage.set('batterySavingMode', value);
      }
    }

  });

  return Session;

}]);
