'use strict';

app.factory('Job', [
  '$resource',
  '$q',
  '$rootScope',
  '$timeout',
  'ResourceCache',
  'CONFIG',
function($resource, $q, $rootScope, $timeout, ResourceCache, CONFIG) {

  var cache = ResourceCache('Job');

  var Job = $resource(CONFIG.url + '/jobs/:jobId', { jobId: '@id' }, {
    create: {
      method: 'POST',
      url: CONFIG.url + '/jobs'
    },
    offered: {
      method: 'GET',
      url: CONFIG.url + '/jobs/offered'
    },
    accept: {
      method: 'PUT',
      url: CONFIG.url + '/jobs/:jobId/accept'
    },
    reject: {
      method: 'PUT',
      url: CONFIG.url + '/jobs/:jobId/reject'
    },
    start: {
      method: 'POST',
      url: CONFIG.url + '/jobs/:jobId/start'
    },
    stop: {
      method: 'POST',
      url: CONFIG.url + '/jobs/:jobId/stop'
    },
    cancel: {
      method: 'POST',
      url: CONFIG.url + '/jobs/:jobId/cancel'
    },
    feedback: {
      method: 'POST',
      url: CONFIG.url + '/jobs/:jobId/feedback'
    }
  });

  angular.extend(Job, {
    //queryIfNeeded: function() {
    //  var cached = cache.getArray();
    //  if (cached !== undefined && cached.length > 0) {
    //    var deferred = $q.defer();
    //    deferred.resolve(cached);
    //    cached.$promise = deferred.promise;
    //    cached.$resolved = true;
    //    return cached;
    //  }
    //  else {
    //    var resource = Job.query.apply(Job, arguments);
    //    resource.$promise.then(function(jobs) {
    //      cache.putArray(jobs);
    //    });
    //    return resource;
    //  }
    //},

    //getAndCache: function() {
    //  var resource = Job.get.apply(Job, arguments);
    //  resource.$promise.then(function(job) {
    //    cache.put(job);
    //  });
    //  return resource;
    //},

    //removeFromCache: function(jobId) {
    //  cache.remove(jobId);
    //},

    STATUS_OFFERED: 'offered',
    STATUS_HIRED: 'hired',
    STATUS_IN_PROGRESS: 'progress',
    STATUS_COMPLETED: 'completed',
    STATUS_CLOSED: 'closed',
    STATUS_EXPIRED: 'expired',
    STATUS_CANCELLED: 'cancelled',

    newJob: function(customer, role_id) {
      return new Job({
        id: 'new',
        company_id: customer.id,
        workplace_id: customer.workplace.id,
        role_id: role_id
      });
    }
  });

  angular.extend(Job.prototype, {
    workplaceAddress: function() {
      var address =  _.compact([this.workplace.address_1, this.workplace.address_2, this.workplace.suburb]).join(', ');
      //console.log(this);
      return address;
      // if (this.workplace.state)
      //   return address + ' ' + this.state;
      // else
      //   return address;
    },

    isOnStandBy: function() {
      return this.status !== Job.STATUS_HIRED &&
             this.status !== Job.STATUS_IN_PROGRESS &&
             this.status !== Job.STATUS_COMPLETED;
    },
    isEnRoute: function() {
      return this.status === Job.STATUS_HIRED;
    },
    isOnShift: function() {
      return this.status === Job.STATUS_IN_PROGRESS;
    },
    isFeedbackPending: function() {
      return this.status === Job.STATUS_COMPLETED;
    }
  });

  // clear cache on logout
  $rootScope.$on('event:auth-logoutComplete', function() {
    cache.reset();
  });

  return Job;

}]);
