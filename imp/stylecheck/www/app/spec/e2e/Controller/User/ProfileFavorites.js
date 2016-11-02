/*global protractor, describe, beforeEach, it, element, expect, by, require, browser */

var testhandler = require('../../../util/testHandler');

describe('Profile Favorites List', function () {

    'use strict';
    testhandler.init(protractor, it);

    var userMenu = element(by.xpath('//div[@id="usermenu"]')),
        userProfile = {},
        userSearch = {},
        favoriteButton = {},
        favoriteCountElement = {},
        favoriteCount = 0;

    it('check if favorite counter is number', function () {
        userMenu.click().then(function () {
            userProfile = element(by.xpath('//button[@ng-click="onPopoverClick(\'profile.overview\', \'user\');"]'));
            userProfile.click().then(function () {
                element.all(by.css('.profile-buttons div div')).then(function (profileButtons) {
                    favoriteButton = profileButtons[1];
                    profileButtons[1].getText().then(function (html) {
                        console.log(html);
                    });
                    favoriteCountElement = favoriteButton.all(by.css('span')).get(0);
                    favoriteCountElement.getText().then(function (text) {
                        expect(text).toMatch(/^0$|^[1-9][0-9]*$/);
                        favoriteCount = parseInt(text);
                    });
                });
            });
        });
    });

    it('compare favorite counter with favorite list entries', function () {
        favoriteButton.click().then(function () {
            var favoriteListItems = element.all(by.xpath('//ion-scroll[@delegate-handle="favoriteScroller"]//ion-item'));
            favoriteListItems.filter(function (elem, index) {
                return elem.getWebElement().getCssValue('height').then(function (value) {
                    value = value.slice(0, - 2);
                    return value > 0;
                });
            }).then(function (filteredElements) {
                expect(favoriteCount).toEqual(filteredElements.length);
            });
        });
    });

    xit('favorize and defavorize', function () {
        userMenu.click().then(function () {
            userSearch = element(by.xpath('//button[@ng-click="onPopoverClick(\'search\', \'community\');"]'));
            userSearch.click().then(function () {
                //var notFavorizedUser = element(by.xpath('//ion-scroll[@delegate-handle="favoriteScroller"]')).all(by.xpath('//button[not(contains(@class, "button-assertive"))]')).get(0);
                var favoritesList = element(by.xpath('//ion-scroll[@delegate-handle="favoriteScroller"]'));
                favoritesList.getInnerHtml().then(function (html) {
                    //console.log(html);
                });
                var favoriteButton = favoritesList.all(by.xpath('//button[not(contains(@class, "button-assertive"))]')).get(0);
                favoriteButton.getOuterHtml().then(function (html) {
                    console.log(html);
                });
                var notFavorizedUser = element.all(by.xpath('//ion-scroll[@delegate-handle="favoriteScroller"]//button[not(contains(@class, "button-assertive"))]')).get(0);
                //console.log(notFavorizedUser.getInnerHtml);
                //browser.debug();
                notFavorizedUser.click().then(function () {
                    userMenu.click().then(function () {
                        userProfile.click().then(function () {
                            element.all(by.css('.profile-buttons div div')).then(function (profileButtons) {
                                favoriteButton = profileButtons[1];
                                favoriteCountElement = favoriteButton.all(by.css('span')).get(0);
                                favoriteCountElement.getText().then(function (text) {
                                    var newFavoriteCount = parseInt(text);
                                    expect(newFavoriteCount).toEqual(favoriteCount + 1);
                                    //tidy up
                                    userMenu.click().then(function () {
                                        userSearch.click().then(function () {
                                            var favorizedUser = element.all(by.css('.collection-repeat-container button.button-assertive')).get(0);
                                            favorizedUser.click().then(function () {
                                               console.log('some user defavorized');
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    testhandler.finish(protractor, it);

});
