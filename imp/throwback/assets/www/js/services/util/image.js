'use strict';

app.factory('imageFactory', function($q) {

  var imageFactory = {};

  var MINIMUM_IMAGE_WIDTH = 300;
  var MINIMUM_IMAGE_HEIGHT = 300;
  
  imageFactory.isValidImage = function(src) {
      
    var isValidImagePromise = $q.defer();

    var image = new Image();

    image.onerror = function() {
        console.log('Image could not be loaded. src: ' + src);
        isValidImagePromise.resolve(false);
    };

    image.onload = function() {
        var width = this.width;
        var height = this.height;
        console.log('Width: ' + width + ' Height: ' + height + ' src: ' + src);

        if (width < MINIMUM_IMAGE_WIDTH || height < MINIMUM_IMAGE_HEIGHT) {
          isValidImagePromise.resolve(false);
        } else {
          isValidImagePromise.resolve(true);
        }
    };

    image.src = src;

    return isValidImagePromise.promise;
  };

  return imageFactory;
});