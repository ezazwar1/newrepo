'use strict';

MyApp.factory('PubNubService', ['$rootScope', 'ConfigService', 'PubNub', '_', function($rootScope, ConfigService, PubNub, _) {
  /**
   * @param channel - name of current channel
   * @constructor
   */
  function PubNubConstructor(channel, uuid) {

      var UUID = PubNub.db.get('session') || (function(){
          var uuid = PubNub.uuid();
          PubNub.db.set('session', uuid);
          return uuid;
      })();

      _.extend(this, {
        _channel: channel,
        message_ids: {},
        deleted_ids: {},
        message_list: {},
        timeout: null
      });

      var config = {
        subscribe_key: ConfigService.pubnubSubscribeKey,
        publish_key: ConfigService.pubnubPublishKey,
        uuid: UUID
      };

      if (!_.isUndefined(uuid)) {
        config.uuid = uuid;
        this.uuid = uuid;
      }

      PubNub.init(config);

      PubNub.ngSubscribe({ channel: this._channel });
    }

  /**
   *
   * @param message - single message object
   * @param channel - name og the channel
   * @private
   */
  PubNubConstructor.prototype._displayMessages = function(message, channel) {
    channel = channel || this._channel;

    typeof this.message_list[channel] === 'undefined' ? this.message_list[channel] = {}: void 0;
    typeof this.message_ids[channel] === 'undefined' ? this.message_ids[channel] = []: void 0;
    typeof this.deleted_ids[channel] === 'undefined' ? this.deleted_ids[channel] = []: void 0;

    // if new message, add to list
    if (this.message_ids[channel].indexOf(message.message_id) < 0) {
      this.message_ids[channel].push(message.message_id);
      this.message_list[channel][message.message_id] = message;
    } else {
      if (message.deleted) {
        this.deleted_ids[channel].push(message.message_id);
        delete this.message_list[channel][message.message_id];
      } else {
        this.message_list[channel][message.message_id] = message;
      }
    }
  }

  /**
   * Return current channel messages or specific channel messages
   * @param channel
   * @returns Array
   * @private
   */
  PubNubConstructor.prototype._getMessages = function(channel) {
    var messages = [],
      channelName,
      data,
      i;

    channelName = channel || this._channel;
    data = this.message_list[channelName];

    for (i in data) {
      messages.push( data[i] );
    }

    return messages;
  }

  /**
   * @param channel
   * @param uid
   * @private
   */

  function _init (channel, uuid) {
    return new PubNubConstructor(channel, uuid);
  }

  PubNubConstructor.prototype.destroy = function () {
    PubNub.ngUnsubscribe({ channel: this._channel });
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
   * Retrieve chat history
   * @param count
   * @returns {*}
   * @public
   */
  PubNubConstructor.prototype.getHistory = function(count) {
    var historyCount;

    historyCount = _.isNumber(count) ? count : ConfigService.chatHistoryCounter;

    PubNub.ngHistory({
      channel: this._channel,
      count: historyCount
    });
  }

  /**
   * Retrieve users
   * @private
   */
  PubNubConstructor.prototype._hereNow = function() {
    return PubNub.ngHereNow({
      channel: this._channel
    });
  }

  PubNubConstructor.prototype._whereNow = function(cb) {
    return PubNub.ngWhereNow({
      uuid: this.uuid,
      callback: cb
    });
  }

  /**
   * @returns {*|_channel}
   * @private
   */

  PubNubConstructor.prototype._getChannel = function() {
    return this._channel;
  }

  /**
   * Trigger when new message added to channel
   * @param cb
   * @public
   */
  PubNubConstructor.prototype.subscribe = function(cb) {
    var self = this;
    $rootScope.$on(PubNub.ngMsgEv(self._channel),
      function(ngEvent, payload) {

        if (self.timeout) {
          clearTimeout(self.timeout);
        }

        self.timeout = setTimeout(function() {
          cb(payload.message);
        }, ConfigService.chatTimeout);
      });
  }

  /**
   * Trigger when new user connect to channel
   * @param cb
   * @public
   */
  PubNubConstructor.prototype.subscribeUsers = function(cb) {
    var self = this;
    $rootScope.$on(PubNub.ngPrsEv(self._channel), function() {
      var users = PubNub.ngListPresence(self._channel);
      cb.apply(null, users);
    });
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
  }

  /**
   * Update post method
   * @param message object with all data
   */
  PubNubConstructor.prototype.update = function(message) {
    message = _.extend(message, {
      is_update: true
    });

    PubNub.ngPublish({
      channel: this._channel,
      message: message
    });
  }


  return {
    init: _init
  }

}]);
