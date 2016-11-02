'use strict';

(function (angular) {
    angular.module('znk.sat').directive('markupDrv', ['MobileSrv',

        function (MobileSrv) {
            var _isMobile = MobileSrv.isMobile();
            var MAX_IMAGE_WIDTH = 275;
            return {
                replace: true,
                link: function (scope, element, attrs) {

                    var toDomElement = function domElement(markup) {
                        var element;
                        try{
                            element = angular.element(markup);
                        }
                        catch(err){
                            markup = '<p>' + markup + '</p>';
                            element = angular.element(markup);
                        }
                        return element;
                    };

                    var toHtml = function toHtml(domElement){
                        var html = '';
                        for(var i=0; i< domElement.length; i++){
                            if(domElement[i].outerHTML){
                                html += domElement[i].outerHTML;
                            }
                        }
                        return html;
                    };

                    var imageStyle = function imageStyle(image){
                        var _style = {
                            width: '',
                            height: ''
                        };

                        if(image.style.width){
                            var _height = image.style.height;
                            var _width = image.style.width;

                            _height = _height.replace('px','');
                            _width = _width.replace('px','');

                            if(!isNaN(_width)){
                                _width = parseInt(_width);

                                while(_width > MAX_IMAGE_WIDTH){
                                    _width = _width * 0.90;
                                    _height = _height * 0.90;
                                }
                                _style.width = _width + 'px';
                                _style.height = _height + 'px';
                            }
                        }
                        return _style;
                    };

                    var resizeImages = function resizeImages(domElement){

                        for(var i=0; i<domElement.length; i++ ){

                            if(domElement[i].tagName && domElement[i].tagName.toLowerCase() === 'img')
                            {
                                if(domElement[i].style.width){
                                    var style = imageStyle(domElement[i]);
                                    domElement[i].style.width = style.width;
                                    domElement[i].style.height = style.height;
                                }
                            }
                            else{
                                var _images = angular.element(domElement[i]).find('img');
                                if(_images.length){
                                    for(var x=0; x<_images.length; x++){
                                        if(_images[x].style.width){
                                            var style = imageStyle(_images[x]);
                                            _images[x].style.width = style.width;
                                            _images[x].style.height = style.height;
                                        }
                                    }
                                }
                            }
                        }

                        return domElement;
                    };

                    var removeLeftMargin = function removeLeftMargin(domElement){

                        for(var i=0; i<domElement.length; i++){

                            if(domElement[i].tagName && domElement[i].tagName.toLowerCase() === 'p')
                            {
                                if(!domElement[i].style) {
                                    break;
                                }

                                var marginLeft = domElement[i].style.marginLeft;
                                marginLeft = marginLeft ?  marginLeft.replace('px','') : marginLeft;

                                if(marginLeft && !isNaN(marginLeft))
                                {
                                    domElement[i].style.marginLeft = 0;
                                }
                            }
                        }

                        return domElement;
                    };

                    var watchDestroyer = scope.$watch(attrs.markup,function(newVal){
                        if(!!newVal){

                            if(_isMobile){
                                MAX_IMAGE_WIDTH = attrs.type === 'lg' ? 300 : 260;
                                var _domElements = toDomElement(newVal);
                                if(_domElements) {
                                    var _newDomElements = resizeImages(_domElements);

                                    //remove left margin from <p> tag
                                    _newDomElements = removeLeftMargin(_newDomElements);

                                    newVal = toHtml(_newDomElements);
                                }
                            }

                            angular.element(element).html(newVal);

                            watchDestroyer();
                        }
                    });
                }
            };
        }
    ]);
})(angular);

