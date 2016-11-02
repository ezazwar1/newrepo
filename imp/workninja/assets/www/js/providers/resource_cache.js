'use strict';

app.provider('ResourceCache', function() {
  this.$get = function() {
    var caches = {};

    function cacheFactory(cacheId) {
      if (cacheId in caches) {
        throw "cacheId '" + cacheId + "' is already taken";
      }

      var cache = {};
      var ids = [];

      return caches[cacheId] = {
        cacheKey: function(resource) {
          return cacheId + '-' + resource.id.toString();
        },

        putArray: function(resources) {
          if (resources === null || angular.isUndefined(resources) || !angular.isArray(resources)) {
            throw 'invalid resources';
          }

          this.reset();
          var that = this;

          _.each(resources, function(resource) {
            var key = that.cacheKey(resource);
            ids.push(key);
            cache[key] = resource;
          });
        },

        getArray: function() {
          if (ids.length > 0) {
            var array = [];
            for (var i = 0; i < ids.length; i++) {
              array.push(cache[ids[i]]);
            }
            return array;
          }
          // else {
          //   return undefined;
          // }
        },

        put: function(resource) {
          if (resource === null || angular.isUndefined(resource)) {
            throw 'invalid resource';
          }

          var key = this.cacheKey(resource);
          var idx = ids.indexOf(key);

          if (idx < 0) {
            ids.push(key);
          }
          cache[key] = resource;
        },

        get: function(id) {
          if (id === undefined || id === null) {
            throw 'invalid resource id';
          }

          var key = this.cacheKey({id: id});
          return cache[key];
        },

        remove: function(id) {
          if (id === undefined || id === null) {
            throw 'invalid resource id';
          }

          var key = this.cacheKey({id: id});
          var idx = ids.indexOf(key);

          if (idx >= 0) {
            ids.splice(idx, 1);
            delete cache[key];
          }
        },

        reset: function() {
          cache = {};
          ids = [];
        },

        destroy: function() {
          cache = null;
          ids = null;
          delete caches[cacheId];
        }
      };
    }

    cacheFactory.get = function(cacheId) {
      return caches[cacheId];
    };

    return cacheFactory;
  };
});
