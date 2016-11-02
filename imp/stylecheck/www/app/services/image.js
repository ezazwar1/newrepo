/*global define*/
define([
    'app',
    'settings'
], function (app, settings) {

    'use strict';

    app.service('imageService', [
        function () {
            // Gets image path for desired image size
            this.getPath = function (image, size, noTimestamp) {
                var i = 0,
                    path,
                    nextSize,
                    host = settings.host;
                if (!image.path) {
                    return;
                }
                for (i; i < image.variants.length; i = i + 1) {
                    if (image.variants[i].width > size) {
                        if (!nextSize) {
                            nextSize = image.variants[i].width;
                            path = host + '/' + image.variants[i].path;
                            if (!noTimestamp) {
                                path = path  + '?' + image.date;
                            }
                        } else if (nextSize > image.variants[i].width) {
                            nextSize = image.variants[i].width;
                            path = host + '/' + image.variants[i].path;
                            if (!noTimestamp) {
                                path = path  + '?' + image.date;
                            }
                        }
                    } else if (image.variants[i].width === size) {
                        path = host + '/' + image.variants[i].path;
                        if (!noTimestamp) {
                            path = path  + '?' + image.date;
                        }
                        break;
                    }
                }
                if (!path) {
                    path = host + '/' + image.path + '?' + image.date;
                }
                return path;
            };
        }
    ]);
});
