angular.module('song.controller', ['ngCordova'])
.controller('SongListCtrl', function($scope,$cordovaSocialSharing,$ionicPlatform, $cordovaOauth, $ionicActionSheet,$state,$cordovaInAppBrowser,$ionicModal,$cordovaGoogleAnalytics,$cordovaDialogs) {

console.log('song');

$ionicPlatform.ready(function() {
    if (window.StatusBar) {
      $cordovaGoogleAnalytics.trackView('Song List Screen');
    }
  });


  // $scope.songlist = [
  //   { name: 'The Scientist', artist: 'Coldplay',by: 'Max Richter', id: 1 },
  //   { name: 'The One', artist: 'Metallica',by: 'Don Johnson', id: 2 },
  //   { name: 'gsdgfdsg', artist: 'dsfgdfgdg',by: 'John Shapirow', id: 3 },
  //   { name: 'The girl from Ipanema', artist: 'Frank Sinatra',by: 'adi margalit', id: 4 },
  //   { name: 'Hey', artist: 'Pixies',by: 'BeN NoVaK', id: 5 },
  // ];
  $scope.counter = 0;
  $scope.fun = function () {
    $.each($scope.songlist, function( index, song ) {
      console.log(  song.artist );
    });
  }

$scope.doRefresher = function() {
    console.log('Refreshing song list data');
    // Add GET NEW DATA
    $scope.getData();
    //Fetch song info from iTunes
    //$scope.songFetch();
    
  };

  $scope.songFetch = function () {
    //run through each row
    console.log('Fetching data');
    console.log($scope.songlist);
    $scope.counter = 0;

    $.each($scope.songlist, function( index, song ) {
      /* https://itunes.apple.com/search?term=jack+johnson+I+Got+You&entity=song */     
      $.ajax({
        type: 'GET',
        url: 'https://itunes.apple.com/search',
        data: { term: song.artist+' '+song.name, entity: 'song' },
        dataType: 'jsonp',
        cache: true,
        success: function( resp ) {
            console.log('Response for '+song.id);
            //console.log(resp);
            if (resp.resultCount == 0) {
              /* CHANGE ROW TO SONG NOT FOUND */
              //$('#img'+song.id).attr('src', 'img/disk.png');
              song.photo = "img/disk.png";
            }
            if (resp.results[0]) {
              songDetails = resp.results[0];
              
              songArt = songDetails.artworkUrl100;
              songPreview = songDetails.previewUrl;
              songUrl = songDetails.trackViewUrl;

              song.photo = songArt;
              song.preview = songPreview;
              song.url = songUrl;
              
              /* Change the row with the itunes data */
              
              /* Album Artwork Column */
              //$('#img'+song.id).attr('src', songArt);
              setTimeout(function() {
                $('#img'+song.id).addClass('playable');
              }, 500);
              

              // Add URL to item
              //$('#url'+song.id).html(songUrl);

              // Add preview URL to item
              //$('#preview'+song.id).html(songPreview);


            } 
        },
      });
      $scope.counter++;
      if ($scope.counter == $scope.songlist.length) {
        console.log('finished');
        //$scope.$apply();
        $scope.$broadcast('scroll.refreshComplete');
        //console.log($scope.songlist);
      }

    });
};


$scope.showinfo = function(songName, songArtist, songId) {
    var songUrl = $('#url'+songId).html();
    var previewUrl = $('#preview'+songId).html();
    var sid = $('#sid'+songId).html();

    if (previewUrl == "") {
         // Show the action sheet
         var hideSheet = $ionicActionSheet.show({
           buttons: [
             { text: 'Search on YouTube' }
           ],
           destructiveText: 'Delete',
           titleText: songArtist+' - '+songName,
           cancelText: 'Cancel',
           cancel: function() {
                // add cancel code..
              },
           destructiveButtonClicked: function() {
              $scope.delSong(sid);
              return true;
           }, 
           buttonClicked: function(index) {
              if (index == 0) {
                // YouTube
                $scope.goToSong(null,'YouTube', songName,songArtist);
              }
             return true;
           }
       });      
      
    } else {
   // Show the action sheet
   var hideSheet = $ionicActionSheet.show({
     buttons: [
       { text: 'Play Preview' },
       { text: 'Listen on iTunes' },
       { text: 'Search on YouTube' }
     ],
     destructiveText: 'Delete',
     titleText: songArtist+' - '+songName,
     cancelText: 'Cancel',
     cancel: function() {
          // add cancel code..
        },
     destructiveButtonClicked: function() {
        $scope.delSong(sid);
        return true;
     },
     buttonClicked: function(index) {
        if (index == 0) {
          // Preview
          $scope.goToSong(previewUrl,'Preview',songName,songArtist);
        }
        if (index == 1) {
          // iTunes
          $scope.goToSong(songUrl,'iTunes',songName,songArtist);
        }
        if (index == 2) {
          // YouTube
          $scope.goToSong(null,'YouTube', songName,songArtist);
        }
       return true;
     }
 });
 }; //else
};


$scope.addSong = function() {

  var artist = $('#addSongArtist').val();
  var name = $('#addSongName').val();

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
    data: { uid: uid, hash: hash, set: 'addsong', artist: artist , name: name,  },
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
        alert('Oops! This song already exists');
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
          console.log('Song added in server');
            $scope.getData();
            // $scope.hide();
            $scope.closeModal();
        } 
        if (element == 'error') {
          alert('Error adding song, please make sure you typed both song name and artist or use our desktop version if error does not resolve.');
          $scope.hide();
          return;
        }       
      });
    },
  });

};


$scope.delSong = function(sid) {
  // if (confirm('Really delete this song?') == false) {
  //   return;
  // }
  
     $cordovaDialogs.confirm('Really delete this song?', 'Wedivite', ['Yes','No!'])
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
    alert('This is not available on your version of the invitation. Please use the web app.');
  }
  
  $.ajax({
    type: 'POST',
    url: apiUrl,
    data: { uid: uid, hash: hash, set: 'delsong', sid: sid  },
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
        alert('Oops! We have a server error. Try from our web app please.');
        $scope.hide();
        return;
      }
    },
    error: function(){
          alert('We can\'t get in touch with our mother ship. Are you connected to the internet?');
          $scope.hide();
      return false;         
    },
    success: function( resp ) {
      console.log(resp);
      $.each(resp, function(index, element) {
        if (element == 'OK') {
          console.log('Song deleted in server');
            $scope.getData();
            
        } 
        if (element == 'error') {
          alert('Error deleting song, please try again later or use our desktop version if error does not resolve.');
          $scope.hide();
          return;
        }       
      });
    },
  });
 

      }
    });
  
};


$scope.goToSong = function (songUrl,linkType,songName,songArtist) {
  
if (linkType == "YouTube") {
  songUrl = "https://www.youtube.com/results?search_query="+songArtist+"+"+songName;
}

  $cordovaInAppBrowser.init('location=no,clearcache=yes');
            $cordovaInAppBrowser
              .open(songUrl, '_blank')
              .then(function(event) {
                // success
                console.log('Went to '+linkType);
              })
              .catch(function(event) {
                // error
                console.log('Couldnt open '+linkType);
              });
};

$ionicModal.fromTemplateUrl('add-song-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
          }).then(function(modal) {
            $scope.modal = modal;
          });
          $scope.openModal = function() {
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




})


.controller('SongCtrl', function($scope, $stateParams) {
  console.log($stateParams);
  $scope.id = $stateParams.songId;
  $scope.name = $stateParams.songName;
  $scope.artist = $stateParams.songArtist;
});
