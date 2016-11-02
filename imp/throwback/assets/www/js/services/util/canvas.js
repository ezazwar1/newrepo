'use strict';

app.factory('canvasService', function($q) {

  var canvasService = {};

  canvasService.status = null;
  canvasService.activity = null;
  canvasService.years = null;
  canvasService.time = null;
  canvasService.canvas = null;
  canvasService.mediaURL = null;
  canvasService.caption = null;

  canvasService.profilePicture = null;
  canvasService.forUserName = null;

  canvasService.init = function (status, years, time, profilePicture, forUserName) {
    canvasService.status = status;
    canvasService.years = years;
    canvasService.time = time + ' via throwbacknow.com';
    canvasService.profilePicture = profilePicture;
    canvasService.forUserName = forUserName;
  }

  canvasService.initWithMediaAndCaption = function (years, time, mediaURL, caption, profilePicture, forUserName)  {
    canvasService.years = years;
    canvasService.time = time + ' via throwbacknow.com';
    canvasService.mediaURL = mediaURL;
    canvasService.caption = caption;
    canvasService.profilePicture = profilePicture;
    canvasService.forUserName = forUserName;
  }

  canvasService.exec = function () {
    var execPromise = $q.defer();

    var canvas = document.getElementById('myCanvas');
    canvasService.canvas = canvas;
    var context = canvas.getContext('2d');

    var maxWidth = 500;
    var lineHeight = 25;
    var x = 300;
    var y = 250;

    var text = canvasService.status;

    var imageObj = new Image();
    imageObj.src = './img/share.png';

    imageObj.onload = function() {
      context.drawImage(imageObj, 0, 0);

      // Years Ago BG Box
      var rectX = 450;
      var rectY = 32;
      var rectWidth = 300;
      var rectHeight = 25;
      var cornerRadius = 20;
      context.fillStyle = "#719ECC";

      // Set faux rounded corners
      context.lineJoin = "round";
      context.lineWidth = cornerRadius;

      // Change origin and dimensions to match true size (a stroke makes the shape a bit larger)
      context.strokeStyle = "#719ECC";
      context.strokeRect(rectX+(cornerRadius/2), rectY+(cornerRadius/2), rectWidth-cornerRadius, rectHeight-cornerRadius);

      // Years Ago
      context.font = "bold 14px Helvetica";
      context.fillStyle = "#FFFFFF";
      context.fillText(canvasService.years, 500, 50);

      // Post information
      context.font = "12px Helvetica";
      context.fillStyle = "rgba(158,158,158,0.9)";
      context.fillText(canvasService.time, 100, 510);

      // var thumbImg = new Image();

      // thumbImg.onload = function() {
      //     context.save();
      //     context.beginPath();
      //     context.arc(22, 41, 15, 0, Math.PI * 2, true);
      //     context.lineWidth = 3;
      //     context.strokeStyle = '#4A4A4A';
      //     context.stroke();
      //     context.closePath();
      //     context.clip();
      //     context.drawImage(thumbImg, 5, 25, 35, 35);
      //     context.restore();


      //     // User information
      //     context.font = "14px Helvetica";
      //     context.fillStyle = "rgba(158,158,158,0.9)";
      //     context.fillText(canvasService.forUserName, 47, 45);


      // };

      // thumbImg.crossOrigin = "anonymous";
      // if (canvasService.profilePicture.indexOf('pbs.twimg') > -1) {
      //   // quick fix for twitter images
      //   thumbImg.src = 'http://www.corsproxy.com/' + canvasService.profilePicture.replace('http://','');
      // } else {
      //   thumbImg.src = canvasService.profilePicture;
      // }

      // Status
      context.font = "bold 20px Helvetica";
      context.fillStyle = "#000";
      context.textAlign="center"; 
      wrapText(context, text, x, y, maxWidth, lineHeight);

      execPromise.resolve(canvasService.canvas.toDataURL());

    };

    return execPromise.promise;
  }

  canvasService.execWithImage = function (useProxy) {
    var execWithImagePromise = $q.defer();

    var canvas = document.getElementById('myCanvas');
    canvasService.canvas = canvas;
    var context = canvas.getContext('2d');

    var maxWidth = 500;
    var lineHeight = 17;
    var x = 100;
    var y = 450;

    var imageObj = new Image();
    imageObj.src = './img/share.png';

    imageObj.onload = function() {
      context.drawImage(imageObj, 0, 0);

      // Years Ago BG Box
      var rectX = 450;
      var rectY = 32;
      var rectWidth = 300;
      var rectHeight = 25;
      var cornerRadius = 20;
      context.fillStyle = "#719ECC";

      // Set faux rounded corners
      context.lineJoin = "round";
      context.lineWidth = cornerRadius;

      // Change origin and dimensions to match true size (a stroke makes the shape a bit larger)
      context.strokeStyle = "#719ECC";
      context.strokeRect(rectX+(cornerRadius/2), rectY+(cornerRadius/2), rectWidth-cornerRadius, rectHeight-cornerRadius);

      // Years Ago
      context.font = "bold 14px Helvetica";
      context.fillStyle = "#FFFFFF";
      context.fillText(canvasService.years, 500, 50);

      // Caption
      context.font = "14px Helvetica";
      context.fillStyle = "#000";
      wrapText(context, canvasService.caption, x, y, maxWidth, lineHeight);

      // Post information
      context.font = "12px Helvetica";
      context.fillStyle = "rgba(158,158,158,0.9)";
      context.fillText(canvasService.time, 100, 510);

      // var thumbImg = new Image();

      // thumbImg.onload = function() {
      //     context.save();
      //     context.beginPath();
      //     context.arc(22, 41, 15, 0, Math.PI * 2, true);
      //     context.lineWidth = 3;
      //     context.strokeStyle = '#4A4A4A';
      //     context.stroke();
      //     context.closePath();
      //     context.clip();
      //     context.drawImage(thumbImg, 5, 25, 35, 35);
      //     context.restore();
      //     // User information
      //     context.font = "14px Helvetica";
      //     context.fillStyle = "rgba(158,158,158,0.9)";
      //     context.fillText(canvasService.forUserName, 47, 45);
      // };      
      //   thumbImg.crossOrigin = "anonymous";
      //   if (canvasService.profilePicture.indexOf('pbs.twimg') > -1) {
      //     // quick fix for twitter images
      //     thumbImg.src = 'http://www.corsproxy.com/' + canvasService.profilePicture.replace('http://','');
      //   } else {
      //     thumbImg.src = canvasService.profilePicture;
      //   }
      // };

      var mediaImage = new Image();

      mediaImage.onload = function () {

        if (mediaImage.height >= mediaImage.width) {
          console.log(mediaImage.height);
          var thumbHeight = 300;
          var newHeight = Math.floor(mediaImage.height * (0.35));

          if (newHeight < thumbHeight) {
              console.log(newHeight);
              newHeight = thumbHeight;
          }

          var newWidth = Math.floor(mediaImage.width / mediaImage.height * newHeight);

          if (newHeight >= thumbHeight) {
              cvs.width = newWidth;
              cvs.height = newHeight;

              ctx.drawImage(mediaImage, 300 - (newWidth / 2), 280 - (newHeight / 2), newWidth, newHeight);

              mediaImage.src = cvs.toDataURL();
              mediaImage.height = newHeight;
          }
        } else {

          var thumbHeight = 350;
          var newHeight = Math.floor(mediaImage.height * (0.5));

          if (newHeight < thumbHeight) {
              newHeight = thumbHeight;
          }

          var newWidth = Math.floor(mediaImage.width / mediaImage.height * newHeight);

          if (newHeight >= thumbHeight) {
              cvs.width = newWidth;
              cvs.height = newHeight;

              ctx.drawImage(mediaImage, 300 - (newWidth / 2), 280 - (newHeight / 2), newWidth, newHeight);

              mediaImage.src = cvs.toDataURL();
              mediaImage.height = newHeight;
          }
        }

        execWithImagePromise.resolve(canvasService.canvas.toDataURL());
      }

      mediaImage.crossOrigin = "anonymous";
      if (useProxy) {
        mediaImage.src =  'http://www.corsproxy.com/' + canvasService.mediaURL.replace('http://','').replace('https://', '');
      } else {
        mediaImage.src = canvasService.mediaURL;
      }

      var cvs = document.createElement('canvas');
      var ctx = canvas.getContext("2d");
    }

    return execWithImagePromise.promise;
  }

  canvasService.getDataURL = function() {
    if (canvasService.canvas) {
      console.log('canvas exists');
      return canvasService.canvas.toDataURL();
    }
  }

  function wrapText(context, text, x, y, maxWidth, lineHeight) {
    if (text) {
      var words = text.split(' ');
      var line = '';

      for(var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';
        var metrics = context.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          context.fillText(line, x, y);
          line = words[n] + ' ';
          y += lineHeight;
        }
        else {
          line = testLine;
        }
      }
      context.fillText(line, x, y);
    }
  }

  return canvasService;

})