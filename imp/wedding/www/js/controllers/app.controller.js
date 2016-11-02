angular.module('starter.controllers', ['ngCordova','ui.router'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $state,$cordovaInAppBrowser,$ionicPlatform,$q,$ionicLoading,$cordovaDialogs,$cordovaLocalNotification,$cordovaGoogleAnalytics,$window,$cordovaAppRate) {

  $scope.coupleName = "";
  $scope.daysLeft = 0;
  $scope.guestCount = 0;
  $scope.rsvpCount = 0;
  $scope.songCount = 0;
  $scope.greetCount = 0;
  $scope.photoCount = 0;

  $scope.show = function() {
    $ionicLoading.show({
      template: '<i class="icon ion-heart animated flip" style="font-size: 38px; color: #F16656; display:block; text-align:center;"></i>'
    });
  };
  $scope.showInvite = function() {
    $ionicLoading.show({
        template: '<i class="icon ion-heart animated flip" style="font-size: 38px; color: #F16656;  display:block;text-align:center;"></i>'
      });
  }
  $scope.hide = function(){
    $ionicLoading.hide();

  };



  // Form data for the login modal
  $scope.loginData = {};


  //Create rate us modal
  $ionicModal.fromTemplateUrl('templates/rateus.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.rateus = modal;
  });
  

  $scope.closeRate = function(chose) {
    $scope.rateus.hide();
    if (chose === 1) {
      alert('Thank you for your feedback!');
    }
    if (chose === 2) {
      //Open rate link
      //var ref = window.open('itms-apps://itunes.apple.com/app/id770088894', '_blank', 'location=no');
        alert('Awesome!! :) Please repeat that rating in the app store review section!');

        setTimeout(function() {
          AppRate.preferences.storeAppURL.ios = '770088894';
          AppRate.preferences.storeAppURL.android = 'market://details?id=com.wedivite.app';
          AppRate.preferences.openStoreInApp = false;
          AppRate.promptForRating(true);
        }, 4500);
        $cordovaGoogleAnalytics.trackEvent('Rating', '5 Stars');
      
    }
  };

  $scope.rateUs = function() {
    $scope.rateus.show();
  };


  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    //console.log('Doing login', $scope.loginData);
    
    if (!$scope.loginData.username  || !$scope.loginData.password) {
      alert("Oopsy daisy! Please enter email and password");
      return false;
    }
    //lower case the email
    $scope.loginData.username = $scope.loginData.username.toLowerCase();

    $scope.loginAnimate();

    
  
  
  $.ajax({  
        type: 'POST',
        url: 'http://app.wedivite.com/api/login',
        data: { email: $scope.loginData.username , password: $scope.loginData.password },
        dataType: 'json',
        timeout: 20000,
        statusCode: {
          400: function() {
            alert('Argh!! Can\'t connect to Wedivite Servers. Maybe check internet connection?');
            $scope.loginAnimate();
            return;   
          }, 
          401: function() {
            window.alert('Argh!! Can\'t connect to Wedivite Servers. Maybe check internet connection?');
            $scope.loginAnimate();
            return;
          },
          404: function() {
            window.alert('Argh!! Can\'t connect to Wedivite Servers. Please try again later.');
            $scope.loginAnimate();
            return;
          }
        },
        error: function(){
          alert('We can\'t get in touch with our mother ship. Are you connected to the internet?');
          $scope.hide();
          $scope.loginAnimate();
          return;         
        },
        success: function( resp ) {
          if (resp.success == false) {
            window.alert('Darn! Username or Password are incorrect');
            $scope.loginAnimate();
          } else {
            var uid = resp.user_id;
            var hash = resp.hash;
            
            window.localStorage['user_id'] = uid;
            window.localStorage['hash'] = hash;

            //localStorage.uid = uid;
            //localStorage.hash = hash;
            
            // $scope.getData();
            console.log('User ID: '+uid+' Logged in');
            // $state.transitionTo("app.home");
            $state.go("app.home");
            
            //$state.go($state.current, {}, {reload: true});
            if (window.localStorage['just_logged_out']) {
                       localStorage.removeItem('just_logged_out');
                        $window.location.reload(true);
                       //$scope.getData();
                       //$scope.$apply();
            }
               setTimeout(function(){
                    $scope.loginAnimate();
                    $scope.closeLogin();
                    //$state.transitionTo("app.home");
                    //$scope.$apply();
                }, 2500);
          }
            
        } 
      });


  };

  $scope.goToURL = function(url,name){
      $cordovaInAppBrowser.init('location=yes,clearcache=yes');
                  $cordovaInAppBrowser
                    .open(url, '_blank')
                    .then(function(event) {
                      // success
                      console.log('Went to '+name);
                    })
                    .catch(function(event) {
                      // error
                      console.log('Couldnt open '+name);
                    });
  };

  
 

  $scope.loginAnimate = function() {
    $('.go-away').toggle();
    $('.come-here').toggle();
    var loginlogo = $('#login-logo');
    if (loginlogo.hasClass('rotating')) {
      loginlogo.removeClass('rotating');
    } else {
      loginlogo.addClass('rotating');
    }
    
  };

  $scope.logout = function() {
    localStorage.removeItem('user_id');
    localStorage.removeItem('hash');
    $scope.coupleName = "";
    $scope.daysLeft = 0;
    $scope.guestCount = 0;
    $scope.rsvpCount = 0;
    $scope.songCount = 0;
    $scope.greetCount = 0;
    $scope.photoCount = 0;
    $scope.views = 0;
    $scope.finishedTasks = 0;
    //$state.transitionTo("onboarding");
    $state.go('onboarding');
    window.localStorage['just_logged_out'] = true;
  };

  $scope.allDone = 0;
  $scope.finishedTasks = 0;
  // $scope.waitForFinish = function(){
  //   if($scope.finishedTasks == 3){
  //       //variable exists, do what you want
  //       // console.log('Finished all tasks, notify angular');
  //       // $scope.apply();
  //       // $scope.$broadcast('scroll.refreshComplete');
        
  //   }
  //   else{
  //       setTimeout(function(){
  //           $scope.waitForFinish();
  //       },250);
  //   }
  // }
  // 
  
  $scope.openInvite = function() {
    window.open($scope.invitationUrl,'_system');
  }
  

  $scope.getData = function() { 
    $scope.show(); //show loader
  
    //failsafe
    setTimeout(function() {
      $scope.hide();
    }, 50000);

  $scope.coupleName = "";
  $scope.daysLeft = 0;
  $scope.guestCount = 0;
  $scope.rsvpCount = 0;
  $scope.songCount = 0;
  $scope.greetCount = 0;
  $scope.photoCount = 0;
  $scope.views = 0;
    $scope.finishedTasks = 0;
    var defer = $q.defer();
    //When the job is finished, set my data var with the value
    defer.promise
      .then(function(val) {
        console.log('Finished all tasks, notify angular');
        //$scope.apply();
        $scope.hide(); //Hide loader
        $scope.$broadcast('scroll.refreshComplete');

      }) 
    function waitForFinish() {
    if($scope.finishedTasks == 3){
        defer.resolve("New data, baby!");        
    }
    else{
        setTimeout(function(){
            waitForFinish();
        },250);
    }
  }
  waitForFinish();

  // $scope.coupleName = "Adi & Ben";
  // $scope.daysLeft = 128;
  // $scope.guestCount = 22;
  // $scope.rsvpCount = 56;
  // $scope.songCount = 19;
  // $scope.greetCount = 87;
  // $scope.photoCount = 9;

     // $scope.waitForFinish();


  var inviteUrlPrefix = 'http://invite.wedivite.com/';
  var inviteUrlPrefixOld = 'http://www.wedivite.com/';
  var inviteurl = 'http://www.wedivite.com/johnjane62';
  var invitetemp = 'Hey! You\'re invited to my wedding. View my wedding invitation here: ';

  var hash = localStorage.hash;
  var uid = localStorage.user_id;
  /* Test if new version or old */
  if (uid > 30000) {
    var apiUrl = 'http://app.wedivite.com/api/info';
  } else {
    var apiUrl = 'http://www.wedivite.com/apiv2/info.php';
  }
  $.ajax({
        type: 'POST',
        url: apiUrl,
        data: { hash: hash, uid: uid },
        dataType: 'json',
        timeout: 20000,
        statusCode: {
          400: function() {
            alert('We can\'t get in touch with our mothership. Are you connected to the internet?');
            $scope.hide(); //Hide loader
            $scope.$broadcast('scroll.refreshComplete');
            return;   
          }, 
          401: function() {
            alert('We can\'t get in touch with our mothership. Are you connected to the internet?');
            $scope.hide(); //Hide loader
            $scope.$broadcast('scroll.refreshComplete');
            return;
          },
          105: function() {
            alert('We can\'t get in touch with our mothership. Are you connected to the internet?');
            $scope.hide(); //Hide loader
            $scope.$broadcast('scroll.refreshComplete');
            return;
          },
          500: function() {
            alert('We can\'t get in touch with our mothership. Are you connected to the internet?');
            $scope.hide(); //Hide loader
            $scope.$broadcast('scroll.refreshComplete');
            return;
          },
          503: function() {
            alert('We can\'t get in touch with our mothership. Are you connected to the internet?');
            $scope.hide(); //Hide loader
            $scope.$broadcast('scroll.refreshComplete');
            return;
          }
        },
        error: function (request, textStatus, errorThrown) {
             console.log(request.responseText);
             console.log(textStatus);
             console.log(errorThrown);
            alert('We can\'t get in touch with our mothership. Are you connected to the internet?');
            $scope.hide(); //Hide loader
            $scope.$broadcast('scroll.refreshComplete');
         },
        success: function( resp ) {
          console.log(resp.info);
          console.log($scope.kFormatter(resp.info[0].views));
          respi = resp;
          $scope.views = $scope.kFormatter(resp.info[0].views);
          $scope.greetCount = $scope.kFormatter(resp.info[0].greets);
          $scope.songCount = $scope.kFormatter(resp.info[0].songs);
          $scope.rsvpCount = $scope.kFormatter(resp.info[0].rsvps);
          $scope.daysLeft = $scope.kFormatter(resp.info[0].days);

          if ($scope.daysLeft > 1) {
            $scope.alotOfDays = true;
          } else {
            $scope.alotOfDays = false;
          }
          if ($scope.daysLeft == 1) {
            $scope.tommorow = true;
          }
          if ($scope.daysLeft == 0) {
            $scope.today = true;
          }
          //console.log($scope.daysLeft);

          if (uid > 30000) {
            inviteurl = inviteUrlPrefix+resp.info[0].url;
          } else {
            inviteurl = inviteUrlPrefixOld+resp.info[0].url;
          }

          $scope.invitationUrl = inviteurl;
          invitemsg = invitetemp+inviteurl;
          $scope.couplePhoto = 'http://app.wedivite.com'+resp.info[0].picture;
          
          var bride = resp.info[0].names.bfirst;
          var groom = resp.info[0].names.gfirst;
          var couple = bride + ' & '+ groom;
          $scope.coupleName = couple;
          
          /* Add song list */
          var songlist = resp.info[0].songlist;
          //$scope.songlist = [
          //  { name: 'The Scientist', artist: 'Coldplay',by: 'Max Richter', id: 1 },
          
          /* Clean song list */
          $scope.songlist = [];

          var countsongs = 0;
          $.each(songlist, function(index, element) {

            var name = element.name;
            var artist = element.artist;
            var song = element.song;
            var sid = element.sid;
            var photo = "img/disk.png";
            var preview = "";
            var url = "";
            $.ajax({
                    type: 'GET',
                    url: 'https://itunes.apple.com/search',
                    data: { term: artist+' '+song, entity: 'song' },
                    dataType: 'jsonp',
                    cache: true,
                    statusCode: {
                              400: function() {
                                alert('We can\'t get in touch with our mothership. Are you connected to the internet?');
                                $scope.hide(); //Hide loader
                                $scope.$broadcast('scroll.refreshComplete');
                                return;   
                              }, 
                              401: function() {
                                alert('We can\'t get in touch with our mothership. Are you connected to the internet?');
                                $scope.hide(); //Hide loader
                                $scope.$broadcast('scroll.refreshComplete');
                                return;
                              },
                              105: function() {
                                alert('We can\'t get in touch with our mothership. Are you connected to the internet?');
                                $scope.hide(); //Hide loader
                                $scope.$broadcast('scroll.refreshComplete');
                                return;
                              },
                              500: function() {
                                alert('We can\'t get in touch with our mothership. Are you connected to the internet?');
                                $scope.hide(); //Hide loader
                                $scope.$broadcast('scroll.refreshComplete');
                                return;
                              },
                              503: function() {
                                alert('We can\'t get in touch with our mothership. Are you connected to the internet?');
                                $scope.hide(); //Hide loader
                                $scope.$broadcast('scroll.refreshComplete');
                                return;
                              },
                              502: function() {
                                alert('We can\'t get in touch with our mothership. Are you connected to the internet?');
                                $scope.hide(); //Hide loader
                                $scope.$broadcast('scroll.refreshComplete');
                                return;
                              },
                            },
                            error: function (request, textStatus, errorThrown) {
                                 console.log(request.responseText);
                                 console.log(textStatus);
                                 console.log(errorThrown);
                                alert('We can\'t get in touch with our mothership. Are you connected to the internet?');
                                $scope.hide(); //Hide loader
                                $scope.$broadcast('scroll.refreshComplete');
                             },

                    success: function( resp ) {
                        console.log('Loaded API data for '+song);
                        
                        if (resp.resultCount == 0) {
                          /* CHANGE ROW TO SONG NOT FOUND */
                          song.photo = "img/disk.png";
                        }
                        if (resp.results[0]) {
                          songDetails = resp.results[0];
                          photo = songDetails.artworkUrl100;
                          preview = songDetails.previewUrl;
                          url = songDetails.trackViewUrl;
                          //console.log(photo);

                          setTimeout(function() {
                            $('#img'+song.id).addClass('playable');
                          }, 100);


                        } 
                        $scope.songlist.push( { name: song, artist: artist,by: name, id: countsongs, photo: photo, url: url, preview: preview, sid: sid } );
                        //console.log($scope.songlist);
                        countsongs++;
                        
                        if (countsongs == songlist.length) {
                          console.log('Loaded all songs, lets sync the view');
                          $scope.finishedTasks++;
                          console.log('Finished: '+$scope.finishedTasks+' tasks');
                        }
                    },
                  });

          });
          if (songlist.length === 0) {
                    console.log('Loaded all songs, lets sync the view');
                    $scope.finishedTasks++;
                    console.log('Finished: '+$scope.finishedTasks+' tasks');
          };


          /* Add guest list */
          var guestlist = resp.info[0].guestlist;
          var comingguests = 0;
          var totalguests = 0;
          $scope.guests = [];
          //$scope.$apply();
          setTimeout(function() {
              $.each(guestlist, function(index, element) {
              /* guest_id":"5863","fname":"Joe","lname":"Smith","inviter_id":"5862","rsvp":"yes" */
                var gid = element.guest_id;
                var fname = element.fname;
                var lname = element.lname;
                var inviter = element.inviter_id;
                var rsvp = element.rsvp;
                totalguests++;
                if (rsvp == "yes") {
                  comingguests++;
                }
                if (inviter == 0) {
                  inviter = ''; 
                }
                //    { first: 'Beb',last: 'Novaka', id: 2, rsvp: 1 },
                $scope.guests.push( { first: fname, last: lname, id: gid, rsvp: rsvp, inviter: inviter } );

                //Refresh view when done
                if (guestlist.length == totalguests) {
                        console.log('Loaded all users, lets sync the view');
                        $scope.guestCount = comingguests;
                        $scope.finishedTasks++;
                        console.log('Finished: '+$scope.finishedTasks+' tasks');
                 }

              });
          if (guestlist.length == 0) {
                  console.log('Loaded all users, lets sync the view');
                  $scope.guestCount = comingguests;
                  $scope.finishedTasks++;
                  console.log('Finished: '+$scope.finishedTasks+' tasks');
                  $scope.noguests = true;
          } else {
            $scope.noguests = false;
          }
          

          }, 500);

          




          
          /* Add Guest Book */
          var guestbook = resp.info[0].guestbook;
          

          $scope.greetings = []; /* Clean greetings list */
          $scope.$apply();
          $.each(guestbook, function(index, element) {
            var text = element.text;
            var bid = element.book_id;
            var name = element.name;

            $scope.greetings.push( { text: text, by: name, id: bid } );

          });

          // Show no greets yet
          if ($scope.greetCount == 0) {
            $scope.nogreets = true;
          } else {
            $scope.nogreets = false;
          }          
          

          
          
          /* Add Photo Album */
          var photoscounter = 0;
          
          var weddingalbum = resp.info[0].weddingalbum;
          $scope.photos = [];
          $scope.categories = [];


          $.each(weddingalbum, function(index, element) {

/*            "id":"154","image":"","thumb":"","rotation":"0","category":"Ceremony" */
            var pid = element.id;
            var image = element.image;
            var thumb = element.thumb;
            var rotate = element.rotation;
            var category = element.category;
            photoscounter++;
            
            if(jQuery.inArray(category, $scope.categories) === -1) {
              //process data if category is not in array
              $scope.categories.push(category);
            }
            
              
            
            //   { big: 'img/photo300.png',thumb: 'img/photo150.png', id: 1, category: 'Ceremony' },
            $scope.photos.push( { big: image, thumb: thumb, id: pid, category: category } );
            //console.log($scope.photos);

            if ($scope.photos.length == weddingalbum.length) {
                    console.log('Loaded all photos, lets sync the view');
                    $scope.photoCount = $scope.photos.length;
                    $scope.finishedTasks++;
                    console.log('Finished: '+$scope.finishedTasks+' tasks');                    
             };
          });
          if (weddingalbum.length === 0) {
                    console.log('Loaded all photos, lets sync the view');
                    $scope.photoCount = $scope.photos.length;
                    $scope.finishedTasks++;
                    console.log('Finished: '+$scope.finishedTasks+' tasks');                    
          };       


          // Show no photos yet
          if ($scope.photoCount == 0) {
            $scope.nophotos = true;
          } else {
            $scope.nophotos = false;
          }   


        }
      });
}

      $scope.kFormatter = function(num) {
          return num > 999 ? (num/1000).toFixed(1) + 'k' : num
      };






})



.controller('PlaylistsCtrl', function($scope,$cordovaSocialSharing,$ionicPlatform, $cordovaOauth) {


$ionicPlatform.ready(function() {



     $scope.googleLogin = function() {
        $cordovaOauth.google("CLIENT_ID_HERE", ["https://www.googleapis.com/auth/urlshortener", "https://www.googleapis.com/auth/userinfo.email"]).then(function(result) {
            console.log(JSON.stringify(result));
        }, function(error) {
            console.log(error);
        });
      }

      $scope.googleLoginn = function() {

          $cordovaSocialSharing
            .shareViaEmail('message', 'subject', ['novakben@gmail.com'], null, null)
            .then(function(result) {
              // Success!
              console.log(JSON.stringify(result)); 
            }, function(err) {
              // An error occurred. Show a message to the user
              console.log(error);
            });
      }


  });


  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})








