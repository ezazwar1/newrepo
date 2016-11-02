angular.module('starter.services', [])
//data for stories
.factory('Chats', function($http, dykUrl) {

  var chats = [];

  return {
    // all: function() {
    //   return chats;
    // },
    // remove: function(chat) {
    //   chats.splice(chats.indexOf(chat), 1);
    // },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        // if (chats[i].id === parseInt(chatId)) {
        //   return chats[i];
        // }
        if (chats[i]._id === chatId) {
          return chats[i];
        }
      }
      return null;
    },
    setChatId: function(value) {
      chatId = value;
    },
    getChatId: function () {
      return chatId;
    },
    getChats: function() {
			return $http.get(dykUrl)
      .then(function(response){
				chats = response.data;
				return chats;
			});
		}

  };
})

//data for profiles
.factory('ProfileDetails', function($http, profileUrl) {

  var prof = [];
  var profileId = null;

  return {
    allProfiles: function() {
      return prof;
    },
    allInterviews: function() {
      return interviews;
    },
    //using this to set varable between controllers
    setProfileId: function(value) {
      profileId = value;
    },
    //using this to get varable between controllers
    getProfileId: function () {
      return profileId;
    },
    getProfiles: function() {
			return $http.get(profileUrl)
      .then(function(response){
				prof = response.data;
				return prof;
			});
		},
    getInterviewsById: function(id) {
      return prof.filter(function (item) {
        return item._id == id;
      })
      .map(function (x) {
        return x.interview.interviews;
      });
		}

  };

});
