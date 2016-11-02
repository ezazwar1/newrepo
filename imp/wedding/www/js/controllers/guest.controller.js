angular.module('guest.controller', ['ngCordova'])
.controller('GuestCtrl', function($scope,$ionicModal,$ionicPlatform,$cordovaGoogleAnalytics,$cordovaDialogs) {

$ionicPlatform.ready(function() {
    if (window.StatusBar) {
      $cordovaGoogleAnalytics.trackView('Guest List Screen');
    }
  });

  


  $scope.plusones = 1;
  $scope.addGuest = function () {
      $scope.plusones++;
      $('.plus-ones').append(' <label class="item item-input">\
              <span class="input-label">Guest #'+$scope.plusones+'</span>\
              <input type="text" placeholder="First Name">\
           </label>\
          <label class="item item-input">\
              <span class="input-label"></span>\
              <input type="text" placeholder="Last Name">\
           </label>');
  };


$scope.addRsvp = function() {
  var rsvp = $('#addRsvpRsvp').val();
  var firstName = $('#addRsvpFirstName').val();
  var lastName = $('#addRsvpLastName').val();


  if (rsvp == "true") {
    rsvp = 1;
    var comments = $('#addRsvpComments').val();
  } else {
    rsvp = 0;
    var comments = $('#addRsvpReasons').val();
  }

  $scope.show();
  var uid = localStorage.user_id;
  var hash = localStorage.hash;
  
  /* Test if new version or old */
  if (uid > 30000) {
    var apiUrl = 'http://app.wedivite.com/api/set';
  } else {
    alert('This is not available on your version of the invitation. Please use the web app.');
  }
  
  $.ajax({
    type: 'POST',
    url: apiUrl,
    data: { uid: uid, hash: hash, set: 'addrsvp', firstName: firstName , lastName: lastName , rsvp: rsvp, comments: comments },
    dataType: 'json',
    timeout: 20000,
    statusCode: {
      400: function() {
        alert('Error 400');
        $scope.hide();
        return;   
      }, 
      401: function() {
        alert('Error 401');
        $scope.hide();
        return;
      },
      500: function() {
        alert('Oops! This RSVP already exists');
        $scope.hide();
        return;
      }
    },
    error: function(){
          alert('We can\'t get in touch with our mother ship. Are you connected to the internet?');
          $scope.hide();
      return;         
    },
    success: function( resp ) {
      console.log(resp);
      $.each(resp, function(index, element) {
        if (element == 'OK') {
          console.log('Guest RSVP added in server');
            $scope.getData();
            // $scope.hide();
            $scope.closeModal();
        } 
        if (element == 'error') {
          alert('Error adding guests, please make sure you typed both first and last name or use our desktop version if error does not resolve.');
          $scope.hide();
          return;
        }       
      });
    },
  });

};



$scope.setRSVP = function(gid,rsvp) {
  if (rsvp == true) {
    var newRSVP = 'Yes';
    rsvp = 'yes';
  } else {
    var newRSVP = 'No';
    rsvp = 'no';
  }
  // if (!confirm('Change RSVP to "'+newRSVP+'"?')) {
  //   console.log('RSVP change aborted by user');
  //   return false;
  // }

    $cordovaDialogs.confirm('Change RSVP to "'+newRSVP+'"?', 'Wedivite', ['Yes','No!'])
    .then(function(buttonIndex) {
      // no button = 0, 'OK' = 1, 'Cancel' = 2
      if (buttonIndex == 1) {
        

        $scope.show();
  var uid = localStorage.user_id;
  var hash = localStorage.hash;
  
  /* Test if new version or old */
  if (uid > 30000) {
    var apiUrl = 'http://app.wedivite.com/api/set';
  } else {
    var apiUrl = 'http://www.wedivite.com/apiv2/set.php';
  }
  
  $.ajax({
    type: 'POST',
    url: apiUrl,
    data: { uid: uid, hash: hash, set: 'rsvp', gid: gid , rsvp: rsvp },
    dataType: 'json',
    timeout: 20000,
    statusCode: {
      400: function() {
        alert('Error 400');
        $scope.hide();
        return;   
      }, 
      401: function() {
        alert('Error 401');
        $scope.hide();
        return;
      },
      500: function() {
        alert('Oops! This RSVP is already set for this guest');
        $scope.hide();
        return;
      }
    },
    error: function(){
          alert('We can\'t get in touch with our mother ship. Are you connected to the internet?');
          $scope.hide();
      return;         
    },
    success: function( resp ) {
      console.log(resp);
      $.each(resp, function(index, element) {
        if (element == 'OK') {
          console.log('RSVP set in server');
            $scope.getData();
            
        } 
        if (element == 'error') {
          alert('Error setting RSVP, please try again later or use our desktop version.');
          $scope.hide();
          return;
        }       
      });

      
    },
  });

      }
    });

  

};




$scope.removeRSVP = function(gid) {
    $cordovaDialogs.confirm('Really delete guest?', 'Wedivite', ['Yes','No!'])
    .then(function(buttonIndex) {
      // no button = 0, 'OK' = 1, 'Cancel' = 2
      if (buttonIndex == 1) {
        

          $scope.show();
          console.log('Remove guest id '+gid);
          var uid = localStorage.user_id;
          var hash = localStorage.hash;
      
          /* Test if new version or old */
          if (uid > 30000) {
            var apiUrl = 'http://app.wedivite.com/api/set';
          } else {
            var apiUrl = 'http://www.wedivite.com/apiv2/set.php';
          }
      
        $.ajax({
        type: 'POST',
        url: apiUrl,
        data: { uid: uid, hash: hash, set: 'delrsvp', gid: gid },
        dataType: 'json',
        timeout: 20000,
        statusCode: {
          400: function() {
            alert('Error 400');
            $scope.hide();
            return;   
          }, 
          401: function() {
            alert('Error 401');
            $scope.hide();
            return;
          },
          500: function() {
            alert('Oops! This guest is not on the list');
            $scope.hide();
            return;
          }
        },
        error: function(){
              alert('We can\'t get in touch with our mother ship. Are you connected to the internet?');
              $scope.hide();
          return;         
        },
        success: function( resp ) {
          console.log(resp);
          $.each(resp, function(index, element) {
            if (element == 'OK') {
              console.log('Guest deleted in server');
              /*  Check if api returned true */
              $scope.getData();
            } 
            if (element == 'error') {
              alert('Error deleting guest, please try again later or use our desktop version.');
              $scope.hide();
              return;
            }       
          });

          
        },
      });



      }
    });
          

      // if (!confirm('Really delete guest?')) {
      //   console.log('Delete aborted by user');
      //   return false;
      // }

    
  
};




   // $scope.guests = [
   //    { first: 'Beb',last: 'Novaka', id: 2, rsvp: 1 },
   //    { first: 'Begb',last: 'Novsaka', id: 1, rsvp: 0 },
   //    { first: 'Bseb',last: 'Novakfa', id: 3, rsvp: 1 },
   //    { first: 'Bedb',last: 'Noavaka', id: 5, rsvp: 1 }
   //  ];

$scope.doRefresher = function() {
    console.log('Refreshing guest list data');
    $scope.getData();
  };

  $scope.coming = false;

    $ionicModal.fromTemplateUrl('add-rsvp-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
          }).then(function(modal) {
            $scope.modal = modal;
          });


          $scope.openModal = function() {
            $scope.coming = true;
            $scope.modal.show();
          };
          $scope.closeModal = function() {
            
            $('.plus-ones').html(' <label class="item item-input">\
              <span class="input-label">Guest #1</span>\
              <input type="text" placeholder="First Name">\
           </label>\
          <label class="item item-input">\
              <span class="input-label"></span>\
              <input type="text" placeholder="Last Name">\
           </label>');
            $scope.coming = false;
            $('input').val('');
            $scope.modal.hide();
          };
          //Cleanup the modal when we're done with it!
          $scope.$on('$destroy', function() {
            $scope.modal.remove();
          });
          // Execute action on hide modal
          $scope.$on('modal.hidden', function() {
            // Execute action
          });
          // Execute action on remove modal
          $scope.$on('modal.removed', function() {
            // Execute action
          });


   $scope.swipeHelper= function(isFirst){
     if (isFirst == true && !window.localStorage['seen_guest_swipe']) {
       setTimeout(function() { window.localStorage['seen_guest_swipe'] = true }, 40000);
        return "swiperhelper2";
     } else {
         return "";
     }
  };


});