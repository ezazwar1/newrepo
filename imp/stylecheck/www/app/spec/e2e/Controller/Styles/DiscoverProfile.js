/*global protractor, describe, beforeEach, it, element, expect, by, require, browser */

var testhandler = require('../../../util/testHandler');

describe('Discover: Profile Details', function () {

    'use strict';
    testhandler.init(protractor, it);

    var userMenu,
        homeLink,
        exploreButton,
        userProfile = {},
        ownUserName = '',
        ownInfo = '';

    it('init data', function () {
        userMenu = element(by.xpath('//div[@id="usermenu"]'));
        homeLink = element(by.xpath('//div[@nav-bar="active"]//span[@ng-click="goToAndReset(\'dashboard\')"]'));
        exploreButton = element(by.xpath('//button[@ng-click="goToAndReset(\'styleDiscover.detail\')"]'));
    });

    it('get own user data', function () {
        userMenu.click().then(function () {
            userProfile = element(by.xpath('//button[@ng-click="onPopoverClick(\'profile.overview\', \'user\');"]'));
            userProfile.click().then(function () {
                element(by.css('div.username')).getText().then(function (text) {
                    ownUserName = text;
                    console.log('Username: ', ownUserName);
                });
                element(by.css('div.info-text div p')).getText().then(function (text) {
                    ownInfo = text;
                    console.log('InfoText:', ownInfo);
                });
            });
        });
    });

    it('check for initital explore', function () {
        //DISABLE POPUP
        homeLink = element.all(by.xpath('//span[@ng-click="goToAndReset(\'dashboard\')"]')).first();
        browser.executeScript('window.localStorage.setItem(\'ls.auth.stylecheck.app.discoverVisited\',\'true\')');
        homeLink.click().then(function () {
            exploreButton.click().then(function () {
                element(by.css('div.popup')).isPresent().then(function (present) {
                    if (present) {
                        console.log('Initial Exploration, explore Settings have to be set');
                        element(by.css('div.popup button')).click().then(function () {
                            expect(browser.getCurrentUrl()).toMatch('#/filterSettings/discover');
                            element(by.xpath('//button[@ng-click="save()"]')).click().then(function () {
                                console.log('filter saved');
                            });
                        });
                    } else {
                        console.log('explore Settings already set, no popup');
                        expect(browser.getCurrentUrl()).toMatch('#/styles/discover');
                    }
                });
            });
        });
    });

    it('close howTo it if open', function () {
        var tutorialModal = element(by.xpath('//button[@ng-click="closeModal(\'howTo\')"]'));
        tutorialModal.isDisplayed().then(function (isVisible) {
            if (tutorialModal.isDisplayed()) {
                tutorialModal.click();
            }
        });
    });

    it('compare own username with style username at Discover', function () {
        homeLink.click().then(function () {
            exploreButton.click().then(function () {
                expect(element(by.css('div.username')).getText()).not.toEqual(ownUserName);
            });
        });
    });

    it('compare own userinfo with style userinfo at Discover Profile-Details', function () {
        userProfile = element(by.xpath('//div[@ng-click="openUserProfile(style.user._id)"]'));
        userProfile.click().then(function () {
            element(by.css('div.info-text')).isPresent().then(function (present) {
                if (present) {
                    var userInfo = element(by.css('div.info-text div.col p'));
                    expect(userInfo.getText()).not.toEqual(ownInfo);
                }
            });
        });
    });

    testhandler.finish(protractor, it);
});
