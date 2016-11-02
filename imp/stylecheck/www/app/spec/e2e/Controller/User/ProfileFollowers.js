/*global protractor, describe, beforeEach, it, element, expect, by, require, browser */

var testhandler = require('../../../util/testHandler');

describe('Profile Favorites List', function () {

    'use strict';
    testhandler.init(protractor, it);

    var userMenu = element(by.xpath('//div[@id="usermenu"]')),
        userProfile = {},
        userSearch = {},
        followerButton = {},
        followerCountElement = {},
        followerCount = 0,
        followerListItems;

    it('checks if follower counter is number', function () {
        userMenu.click().then(function () {
            userProfile = element(by.xpath('//button[@ng-click="onPopoverClick(\'profile.overview\', \'user\');"]'));
            userProfile.click().then(function () {
                element.all(by.css('.profile-buttons div')).then(function (profileButtons) {
                    followerButton = profileButtons[2];
                    followerCountElement = followerButton.all(by.css('span')).get(0);
                    followerCountElement.getText().then(function (text) {
                        expect(text).toMatch(/^0$|^[1-9][0-9]*$/);
                        followerCount = parseInt(text);
                    });
                });
            });
        });
    });

    it('compares follower counter with follower list entries', function () {
        followerButton.click().then(function () {
            followerListItems = element.all(by.xpath('//ion-scroll[@delegate-handle="followerScroller"]//ion-item'));
            followerListItems.filter(function (elem, index) {
                return elem.getWebElement().getCssValue('height').then(function (value) {
                    value = value.slice(0, - 2);
                    return value > 0;
                });
            }).then(function (filteredElements) {
                expect(followerCount).toEqual(filteredElements.length);
            });
        });
    });

    testhandler.finish(protractor, it);

    it('logs in as different user and unfollows', function () {
        browser.get('#/unauthorized/login');
        browser.getCurrentUrl().then(function (url) {
            element(by.model('auth.login')).sendKeys('test2@test.test');
            element(by.model('auth.password')).sendKeys('123456');
            element(by.css('ion-footer-bar .row .col .button.button-assertive')).click().then(function () {
                expect(browser.getCurrentUrl()).toMatch('#/dashboard');
                userMenu.click().then(function () {
                    userProfile.click().then(function () {
                        element.all(by.css('.profile-buttons div')).then(function (profileButtons) {
                            profileButtons[1].click().then(function () {
                                element.all(by.css('.collection-repeat-container button.button-assertive')).get(0).click();
                            });
                        });
                    });
                });
            });
        });
    });

    testhandler.finish(protractor, it);

    testhandler.init(protractor, it);

    it('checks if follower number is changed', function () {
        userMenu.click().then(function () {
            userProfile.click().then(function () {
                element.all(by.css('.profile-buttons div')).then(function (profileButtons) {
                    followerButton = profileButtons[2];
                    followerCountElement = followerButton.all(by.css('span')).get(0);
                    followerCountElement.getText().then(function (text) {
                        expect(parseInt(text)).toBe(followerCount - 1);
                    });
                });
            });
        });
    });

    testhandler.finish(protractor, it);

    it('undoes last changes', function () {
        browser.get('#/unauthorized/login');
        browser.getCurrentUrl().then(function (url) {
            element(by.model('auth.login')).sendKeys('test2@test.test');
            element(by.model('auth.password')).sendKeys('123456');
            element(by.css('ion-footer-bar .row .col .button.button-assertive')).click().then(function () {
                expect(browser.getCurrentUrl()).toMatch('#/dashboard');
                userMenu.click().then(function () {
                    userProfile.click().then(function () {
                        element.all(by.css('.profile-buttons div')).then(function (profileButtons) {
                            profileButtons[2].click().then(function () {
                                element.all(by.css('.collection-repeat-container button.icon-follow-me')).get(0).click();
                            });
                        });
                    });
                });
            });
        });
    });

    testhandler.finish(protractor, it);
});
