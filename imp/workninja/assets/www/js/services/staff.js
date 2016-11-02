'use strict';

app.factory('Staff', [
  '$resource',
  'CONFIG',
  'HOURS_OF_DAY',
function($resource, CONFIG, HOURS_OF_DAY) {

  var Staff = $resource(CONFIG.url + '/staff/:staffId', { staffId: '@id' }, {
    update: {
      method: 'PUT'
    },
    nearby: {
      url: CONFIG.url + '/staff/nearby',
      method: 'GET',
      isArray: true
    }
  });

  angular.extend(Staff, {
    // Modes of transport
    TRANSPORT_WALKING: 'walking',
    TRANSPORT_DRIVING: 'driving'
  });

  angular.extend(Staff.prototype, {
    isSetupComplete: function() {
      if(this.profile.about === null) {
        return false;
      } else {
        return true;
      };

      
    },

    hasAvailability: function() {
      return _.any(this.availability, function(item) {
        return item.available && item.from !== null && item.to !== null && item.to > item.from;
      });
    },

    isAvailabilityValid: function() {
      return _.chain(this.availability)
        .select(function(item) { return item.available; })
        .all(function(item) { return item.from !== null && item.to !== null && item.to > item.from; })
        .value();
    },

    isAvailableNow: function() {
      var now = new Date(),
        dow = now.getDay(),
        availability = this.availability[(dow > 0 ? dow : 7).toString()],
        nowHours = now.getHours();

      var zone_val = HOURS_OF_DAY[nowHours]['zone'];

      return availability &&
        availability.available &&
        availability[zone_val];
    },

    canBeHiredNow: function(min_shift_hours) {
      var now = new Date(),
        dow = now.getDay(),
        availability = this.availability[(dow > 0 ? dow : 7).toString()],
        nowHours = now.getHours();

      var latestShiftStart = new Date();
      latestShiftStart.setHours(availability.to - min_shift_hours);
      latestShiftStart.setMinutes(0);
      latestShiftStart.setSeconds(0);

      return availability &&
        availability.available &&
        nowHours >= availability.from &&
        now.getTime() < latestShiftStart;
    },

    isTransportWalking: function() {
      return this.profile.mode_of_transport === Staff.TRANSPORT_WALKING;
    },

    isTransportDriving: function() {
      return this.profile.mode_of_transport === Staff.TRANSPORT_DRIVING;
    },

    isOnStandy: function() {
      
    },

    modeOfTransportClass: function() {
      if (this.profile) {
        switch (this.profile.mode_of_transport) {
          case Staff.TRANSPORT_WALKING:
            return 'fa fa-male';
          case Staff.TRANSPORT_DRIVING:
            return 'fa fa-car';
        }
      }
    },

    modeOfTransportGmaps: function() {
      if (this.profile) {
        switch (this.profile.mode_of_transport) {
          case Staff.TRANSPORT_WALKING:
            return google.maps.TravelMode.WALKING;
          case Staff.TRANSPORT_DRIVING:
            return google.maps.TravelMode.DRIVING;
        }
      }
      else
        return google.maps.TravelMode.DRIVING;
    }
  });

  return Staff;

}]);
