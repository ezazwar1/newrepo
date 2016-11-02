/**
 * attrs:
 */

(function (angular) {
    'use strict';

    angular.module('znk.sat').directive('articleDrv', [
        function () {
            return {
                templateUrl: 'znk/exercise/templates/articleDrv.html',
                scope: {
                    contentGetter: '&content'
                },
                link: function (scope, element, attrs) {

                    var stringEndsWith = function(str, searchString){
                        var position = searchString.length;
                        var startIndex = str.length - position;
                        var lastIndex = str.indexOf(searchString, startIndex);
                        return lastIndex !== -1 && lastIndex === position;
                    };

                    var injectLineNumbersToHtml = function _injectLineNumbersToHtml(htmlString) {
                        var start = false;
                        var htmlParagraphs = htmlString.split(/<\s*p\s*>|<\s*p\s*\/\s*>/gi);
                        var j, i, ln = 0;
                        var res = '';
                        for (j = 0; j < htmlParagraphs.length; ++j) {
                            var htmlLines = htmlParagraphs[j].split(/<\s*br\s*>|<\s*br\s*\/\s*>/gi);
                            for (i = 0; i < htmlLines.length; ++i) {
                                if (htmlLines[i].match('_')) {
                                    htmlLines[i] = '<br><span class=\"indented-line\">' + htmlLines[i].replace('_', '') + '</span>';
                                    start = true;
                                }
                                if (!start) { continue; }
                                ln += 1;
                                if ((ln === 1 || ln % 5 === 0)  ) {
                                    //if(htmlLines[i].endsWith('</p>')) {
                                    if(stringEndsWith(htmlLines[i], '</p>')) {
                                        //if line ends with '<p>', the line number span will displayed in the next line
                                        //so we insert him to the paragraph
                                        var lastTagIndex = htmlLines[i].lastIndexOf('<');
                                        var lastTag = htmlLines[i].substr(lastTagIndex);
                                        var markupStart = htmlLines[i].substr(0, lastTagIndex);
                                        htmlLines[i] = markupStart + '<span class=\"num-article\">' + String(ln) + '</span>' + lastTag;
                                    }
                                    else
                                    {
                                        htmlLines[i] = htmlLines[i] + '<span class=\"num-article\">' + String(ln) + '</span>';
                                    }

                                }
                                htmlLines[i] = htmlLines[i] + '<br>';
                            }
                            res = res + '<p>' + htmlLines.join('') + '</p>';
                        }
                        return '<div class=\"wrap-num-article\">' + res + '</div>';
                    };

                    var content = scope.contentGetter();
                    angular.element(element[0].querySelector('.article-content')).html(injectLineNumbersToHtml(content));
                }
            };
        }
    ]);
})(angular);

