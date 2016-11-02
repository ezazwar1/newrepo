'use strict';
MyApp.factory('PubNubServiceNew', ['$rootScope', 'ConfigService', 'PubNub', '_', function($rootScope, ConfigService, PubNub, _) {
  var pubNubInstance;
  var pubNubInstances = {};

  /**
   * @param channel - name of current channel
   * @constructor
   */
  function PubNubConstructor(uuid) {

    _.extend(this, {
      message_ids: {},
      deleted_ids: {},
      message_list: {},
      timeout: null
    });

    var config = {
      subscribe_key: ConfigService.pubnubSubscribeKey,
      publish_key: ConfigService.pubnubPublishKey
    };

    if (!_.isUndefined(uuid)) {
      config.uuid = uuid;
      this.uuid = uuid;
    }

    PubNub.init(config);
  }

  function _init (uuid, instanceName) {
    if(instanceName) {
      if(pubNubInstances[instanceName]) {
        return pubNubInstances[instanceName];
      }

      pubNubInstances[instanceName] = new PubNubConstructor(uuid);

      return pubNubInstances[instanceName];
    } else {
      if(pubNubInstance) {
        return pubNubInstance;
      }

      pubNubInstance = new PubNubConstructor(uuid);

      return pubNubInstance;
    }
  }

  PubNubConstructor.prototype.unSubscribe = function (channel) {
    PubNub.ngUnsubscribe({ channel: channel });
  };

  PubNubConstructor.prototype.subscribeToChannel = function (channel, cb) {
    PubNub.ngSubscribe({ channel: channel, callback: cb, backfill: false, noheresync: true, restore: false, state: false, presence: false });
  };

  PubNubConstructor.prototype.destroy = function () {
    PubNub.destroy();
  };

  /**
   * Generate uniq id for message
   * @returns {string}
   * @private
   */
  function _guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }


  /**
   * Add post method
   * @param message object with all data
   * @public
   */
  PubNubConstructor.prototype.publish = function(message) {
    message = _.extend(message, {
      message_id: _guid(),
      channel: this._channel,
      deleted: false
    });

    PubNub.ngPublish({
      channel: this._channel,
      message: message
    });

    return message;
  };

  /**
   * Update post method
   * @param message object with all data
   */
  PubNubConstructor.prototype.update = function(channel, message) {
    message = _.extend(message, {
      is_update: true
    });

    PubNub.ngPublish({
      channel: channel,
      message: message
    });
  };


  return {
    init: _init
  }

}]);
