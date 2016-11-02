angular.module('album.controller', ['ngCordova'])
.controller('WeddingAlbumCtrl', function($scope,$ionicModal,$ionicSlideBoxDelegate,$state,$ionicPlatform,$cordovaGoogleAnalytics,$cordovaDialogs) {



  $ionicPlatform.ready(function() {
    if (window.StatusBar) {
      $cordovaGoogleAnalytics.trackView('Weeding Album Screen');
    }
  });


    $scope.doRefresher = function() {
      console.log('Refreshing wedding album data');
      $scope.getData();
     };
    // $scope.photos = [
    //   { big: 'img/photo300.png',thumb: 'img/photo150.png', id: 1, category: 'Ceremony' },
    //   { big: 'img/photo300.png',thumb: 'img/photo150.png', id: 2, category: 'Dancing' },
    //   { big: 'img/photo300.png',thumb: 'img/photo150.png', id: 2, category: 'Dancing' },
    //   { big: 'img/photo300.png',thumb: 'img/photo150.png', id: 2, category: 'Dancing' },
    //   { big: 'img/photo300.png',thumb: 'img/photo150.png', id: 2, category: 'Dancing' },
    //   { big: 'img/photo300.png',thumb: 'img/photo150.png', id: 2, category: 'Dancing' },
    //   { big: 'img/photo300.png',thumb: 'img/photo150.png', id: 2, category: 'Dancing' }
    // ];

    //$( '.swipebox' ).swipebox();




    



})
.controller('PhotoCtrl', function($scope, $stateParams,$ionicPlatform,$ionicSlideBoxDelegate,$state,$cordovaGoogleAnalytics,$cordovaDialogs) {
  $ionicPlatform.ready(function() {
    if (window.StatusBar) {
      $cordovaGoogleAnalytics.trackView('Single Photo Screen');
    }
  });


  $scope.photoId = $stateParams.id;

  $scope.rotatePhoto = function() {

   var photo = $('.photo'+$scope.currentPhotoIndex);
   var angle = $scope.getRotationDegrees(photo);

    var w= photo.width();
    var h= photo.height();
    // console.log(w);
    // console.log(h);
   // $('#userImg').css('transform', 'rotate(90deg)');
   
   // console.log(angle);
   var degrees = angle + 90;
   photo.css('-webkit-transform','rotate('+degrees+'deg)');
    windowHeight = $(window).height();
    windowWidth = $(window).height();

    if (w > h) {
      if (angle == 90 || angle == 270) {
        photo.css('max-width','100%'); 
        photo.removeClass('turned');
      } else {
        photo.css('max-width',windowHeight-100);
        photo.addClass('turned');
      }
    } else {
      if (angle == 90 || angle == 270) {
        photo.css('max-height','100%'); 
        
      } else {
        photo.css('max-height',$(window).width());
        
        
      }

    }
    
    //photo.css('max-height',windowWidth);

  }
  $scope.currentPhoto = function(index) {
    $scope.currentPhotoIndex = index;
    $scope.photoCategory = $scope.photos[index].category; //Set the new photo title

    //$scope.currentPhotoId = $scope.photos[index].id;
    //
    $scope.currentPhotoId = $scope.photos[index].big;
  }
  $.each($scope.photos, function(index, element) {
    if (element.id == $scope.photoId) {
      //This is the current photo, load the image to the models
      $scope.photoBig = element.big;
      $scope.photoCategory = element.category;
      $scope.currentPhotoId = element.big;

      $scope.myActiveSlide = index;
      $scope.currentPhotoIndex = index;
    }
  });

    $scope.getRotationDegrees = function(obj) {
      var matrix = obj.css("-webkit-transform") ||
      obj.css("-moz-transform")    ||
      obj.css("-ms-transform")     ||
      obj.css("-o-transform")      ||
      obj.css("transform");
      if(matrix !== 'none') {
          var values = matrix.split('(')[1].split(')')[0].split(',');
          var a = values[0];
          var b = values[1];
          var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
      } else { var angle = 0; }
      return (angle < 0) ? angle +=360 : angle;
    }

    // pid sample = useralbums/59/59_530ba951ad3de.jpg
    $scope.deletePhoto = function(pid) {
          // if (!confirm('Really delete this photo?')) {
          //   console.log('Delete aborted by user');
          //   return false;
          // }
          
          $cordovaDialogs.confirm('Really delete photo?', 'Wedivite', ['Yes','No!'])
          .then(function(buttonIndex) {
            // no button = 0, 'OK' = 1, 'Cancel' = 2
            if (buttonIndex == 1) {
              

          $scope.show();
          var deluid = localStorage.user_id;
          var delhash = localStorage.hash;
          var uid = localStorage.user_id;
          console.log(pid);
          /* Test if new version or old */
          if (uid > 30000) {
            var apiUrl = 'http://app.wedivite.com/api/set';
        /*    var apiUrl = 'http://localhost:8000/api/set'; */
          } else {
            var apiUrl = 'http://www.wedivite.com/apiv2/set.php';
          }
              
          $.ajax({
            type: 'POST',
            url: apiUrl,
            data: { uid: deluid, hash: delhash, set: 'delphoto', pid: pid },
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
                  console.log('Photo deleted successfully');
                  $state.transitionTo("app.weddingAlbum");
                  $scope.getData();
                  $scope.hide();
                  return;
                } 
                if (element == 'error') {
                  alert('Error deleting photo, please try again later or use our desktop version. '+element.msg);
                  $scope.hide();
                  return;
                }       
              });

              
            },
          });


            }
          }); 
          
    }


  
  //$scope.id = $stateParams.songId;
  //$scope.name = $stateParams.songName;
  //$scope.artist = $stateParams.songArtist;
});