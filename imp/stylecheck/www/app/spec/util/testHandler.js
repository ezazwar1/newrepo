/*global protractor, describe, beforeEach, it, element, expect, by, browser, require*/
'use strict';

module.exports = {

    init: function (protractor, it) {

        it('prepare site for testing', function() {
            browser.get('#/unauthorized/overview').then(function () {
                browser.executeScript('window.localStorage.clear();');
                browser.executeScript('window.sessionStorage.clear();');
            });
        });

        it('login', function () {
            browser.get('#/unauthorized/overview').then(function () {
                browser.waitForAngular().then(function () {
                    element(by.xpath('//div[@ng-click="goTo(\'login\')"]')).click().then(function () {
                        element(by.model('auth.login')).sendKeys('meisterKlecks');
                        element(by.model('auth.password')).sendKeys('123456');
                        element(by.xpath('//button[@form="login.form"]')).click().then(function () {
                            browser.waitForAngular();
                            browser.driver.getCurrentUrl().then(function (url) {
                                expect(url).toMatch('#/dashboard');
                            });
                        });
                    });
                });
            });
        });
    },

    finish: function () {
        it('logout', function () {
            browser.get('#/dashboard').then(function() {
                browser.waitForAngular().then(function () {
                    element(by.xpath('//div[@id="usermenu"]')).click().then(function () {
                        element(by.xpath('//button[@ng-click="onPopoverClick(\'settings\', \'settings\');"]')).click().then(function () {
                            expect(browser.getCurrentUrl()).toMatch('#/settings');
                            element.all(by.css('.logout')).last().click().then(function () {
                                element(by.css('.popup-buttons .button-assertive')).click().then(function () {
                                    expect(browser.getCurrentUrl()).toMatch('#/unauthorized/overview');
                                });
                            });
                        });
                    });
                });
            });
        });
    },

    scrollElemFinderIntoView: function (elemFinder) {
        var promise = browser.executeScript(function (elem) {
            elem.scrollIntoView(true);
        }, elemFinder.getWebElement());
        return promise;
    }

};
