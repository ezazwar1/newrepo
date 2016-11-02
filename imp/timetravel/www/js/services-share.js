angular.module('starter.services-share', [])
// file creation, deleting and cordova

.factory('Share', function($cordovaSocialSharing, $q) {
    var self = this;
    
    var inviteSubject = "I just time traveled";
    var inviteLink = ""; //"bit.ly/timetravelerapp";
    
    //
    // More
    //
    // HTML-enabled: FALSE 
    //
    self.inviteGeneral = function(imageData, inviteMessage) {
        //var inviteMessage = inviteMessageGeneral;            console.log("shareGeneral", inviteMessage)
        var qShare = $q.defer(); 
        $cordovaSocialSharing
            .share(inviteMessage, inviteSubject, imageData, inviteLink)
            .then(function(result) {
              qShare.resolve(true);
            }, function(err) {
              qShare.reject(err);
        });
        return qShare.promise;
    };
    
    //
    // Facebook
    //
    // HTML-enabled: TRUE 
    //
    self.inviteFacebook = function(imageData, inviteMessage) {
        //var inviteMessage = inviteMessageFacebook;    console.log("shareFacebook", inviteMessage)
        var qFacebook = $q.defer();
        $cordovaSocialSharing
        .shareViaFacebook(inviteMessage, imageData, "bit.ly/timetravelerapp")
        .then(function(result) {
          qFacebook.resolve(true);
        }, function(err) {
          qFacebook.reject(true);
        });
        return qFacebook.promise;
    };
    
    //
    // Twitter
    //
    // HTML-enabled: FALSE 
    //
    self.inviteTwitter = function(imageData, inviteMessage) {
        //var inviteMessage = inviteMessageTwitter;     console.log("shareTwitter", inviteMessage)
        var qFacebook = $q.defer();
        $cordovaSocialSharing
        .shareViaTwitter(inviteMessage, imageData, inviteLink)
        .then(function(result) {
          qFacebook.resolve(true);
        }, function(err) {
          qFacebook.reject(true);
        });
        return qFacebook.promise;
    };
    
    //
    // Whatsapp
    //
    // HTML-enabled: TRUE 
    //
    self.inviteWhatsapp = function(imageData, inviteMessage) {
        //var inviteMessage = inviteMessageWhatsapp;    console.log("shareWhatsapp", inviteMessage)
        var qWhatsapp = $q.defer();
        $cordovaSocialSharing
        .shareViaWhatsApp(inviteMessage, imageData, inviteLink)
        .then(function(result) {
          // Success!
          qWhatsapp.resolve(true);
        }, function(err) {
          qWhatsapp.reject(true);
        });
        return qWhatsapp.promise;
    };
    
    //
    // SMS
    //
    // HTML-enabled: FALSE 
    //
    self.inviteSMS = function(imageData, inviteMessage) {
        //var inviteMessage = inviteMessageSMS;     console.log("share SMS", inviteMessage)
        var number = null;
        var qWhatsapp = $q.defer();
        $cordovaSocialSharing
        .shareViaSMS(inviteMessage, number)
        .then(function(result) {
          qWhatsapp.resolve(true);
        }, function(err) {
          qWhatsapp.reject(true);
        });
        return qWhatsapp.promise;
    };
    
    //
    // Email
    //
    // HTML-enabled: TRUE 
    //
    self.inviteEmail = function(imageData, inviteMessage) {
        //var inviteMessage = inviteMessageEmail;       console.log("share Email", inviteMessage)
        var toArr = [];
        var ccArr = [];
        var bccArr = [];
        var qWhatsapp = $q.defer();
        $cordovaSocialSharing
        .shareViaEmail(inviteMessage, inviteSubject, toArr, ccArr, bccArr, imageData)
        .then(function(result) {
          qWhatsapp.resolve(true);
        }, function(err) {
          qWhatsapp.reject(true);
        });
        return qWhatsapp.promise;
    };
    

    //
    return self;
})

