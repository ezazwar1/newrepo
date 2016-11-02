'use strict';

app.factory('instagramFactory', function($rootScope, authenticationFactory) {
  var instagramFactory = {};

  instagramFactory.getInstagramClient = function() {
    var instagramClient = OAuth.create('instagram');
    return instagramClient;
  }

  instagramFactory.initInstagramClient = function() {
    $rootScope.$watch(function(){
      return authenticationFactory.isAuthenticated();
    }, function(authenticated) {
        if (authenticated) {
          var unregister = $rootScope.$watch(function() {
            return $rootScope.sessionUser.get('instagramAccessToken');
          }, function(instagramAccessToken) {
            if (instagramAccessToken) {
              var instagramClient = OAuth.create('instagram', {access_token:instagramAccessToken}, instagramDesc);
              $rootScope.$broadcast('instagramInitialized', instagramClient);
              unregister();
            }
          });
        }
    });
  }

  var instagramDesc = {
    "name": "Instagram",
    "desc": "Instagram is a photo sharing iPhone app and service. Users take photos and can share them with Instagram contacts, as well as friends on other social networks like Twitter and Facebook. The Instagram API provides access to user authentication, friend connections, photos and all the other elements of the iPhone app--including uploading new media.",
    "url": "https:\/\/api.instagram.com\/oauth",
    "oauth2": {
      "authorize": {
        "url": "https:\/\/api.instagram.com\/oauth\/authorize",
        "query": {
          "client_id": "{client_id}",
          "response_type": "code",
          "redirect_uri": "{{callback}}",
          "scope": "{scope}",
          "state": "{{state}}"
        }
      },
      "access_token": {
        "url": "https:\/\/api.instagram.com\/oauth\/access_token",
        "extra": [
          "user"
        ],
        "query": {
          "client_id": "{client_id}",
          "client_secret": "{client_secret}",
          "redirect_uri": "{{callback}}",
          "grant_type": "authorization_code",
          "code": "{{code}}"
        }
      },
      "request": {
        "query": {
          "access_token": "{{token}}"
        },
        "url": "https:\/\/api.instagram.com"
      },
      "parameters": {
        "client_secret": {
          "type": "string"
        },
        "client_id": {
          "type": "string"
        },
        "scope": {
          "values": {
            "relationships": "to follow and unfollow users on a user\u2019s behalf",
            "likes": "to like and unlike items on a user\u2019s behalf",
            "comments": "to create or delete comments on a user\u2019s behalf",
            "basic": "to read any and all data related to a user (e.g. following\/followed-by lists, photos, etc.) (granted by default)"
          },
          "type": "string",
          "cardinality": "*",
          "separator": " "
        }
      },
      "refresh": {
        
      },
      "revoke": {
        
      }
    },
    "href": {
      "keys": "http:\/\/instagram.com\/developer\/clients\/register\/",
      "docs": "http:\/\/instagram.com\/developer\/",
      "apps": "http:\/\/instagram.com\/developer\/clients\/manage\/",
      "provider": "http:\/\/instagram.com"
    },
    "provider": "instagram"
  };

  return instagramFactory;
});