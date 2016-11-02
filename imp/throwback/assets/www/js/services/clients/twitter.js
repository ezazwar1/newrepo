'use strict';

app.factory('twitterFactory', function($rootScope, $timeout, authenticationFactory) {
  var twitterFactory = {};

  twitterFactory.getTwitterClient = function() {
    var twitterClient = OAuth.create('twitter');
    return twitterClient;
  }

  twitterFactory.initTwitterClient = function() {
    console.log($rootScope.sessionUser);
    $rootScope.$watch(function(){
      return authenticationFactory.isAuthenticated();
    }, function(authenticated) {
        if (authenticated) {
          var unregister = $rootScope.$watch(function() {
            return $rootScope.sessionUser.get('authData')['twitter'];
          }, function(twitterAuthData) {
            if (twitterAuthData) {
              var twitterClient = OAuth.create('twitter', {oauth_token:twitterAuthData['auth_token'],
                                                            oauth_token_secret:twitterAuthData['auth_token_secret']}, twitterDesc);
              $rootScope.$broadcast('twitterInitialized', twitterClient);
              unregister();
            }
          });
        }
    });
  }

  var twitterDesc = {    
    "name": "Twitter",
    "desc": "The Twitter micro-blogging service includes two RESTful APIs. The Twitter REST API methods allow developers to access core Twitter data. This includes update timelines, status data, and user information. The Search API methods give developers methods to interact with Twitter Search and trends data. The API presently supports the following data formats: XML, JSON, and the RSS and Atom syndication formats, with some methods only accepting a subset of these formats.",
    "url": "https:\/\/api.twitter.com\/oauth",
    "oauth1": {
      "request_token": {
        "url": "https:\/\/api.twitter.com\/oauth\/request_token",
        "query": {
          "oauth_callback": "{{callback}}?state={{state}}"
        }
      },
      "authorize": {
        "url": "https:\/\/api.twitter.com\/oauth\/authenticate"
      },
      "access_token": {
        "url": "https:\/\/api.twitter.com\/oauth\/access_token",
        "query": {
          
        }
      },
      "request": {
        "url": "https:\/\/api.twitter.com"
      },
      "refresh": {
        
      },
      "revoke": {
        
      }
    },
    "href": {
      "keys": "https:\/\/dev.twitter.com\/apps\/new",
      "docs": "https:\/\/dev.twitter.com\/docs",
      "apps": "https:\/\/dev.twitter.com\/apps",
      "provider": "https:\/\/www.twitter.com\/"
    },
    "provider": "twitter",
    "parameters": {
      "client_id": {
        "type": "string"
      },
      "client_secret": {
        "type": "string"
      }
    }
  };

  return twitterFactory;
});
