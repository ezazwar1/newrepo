/*global protractor, describe, beforeEach, it, element, expect, by, require, browser */
var testhandler = require('../../../util/testHandler');

describe('Dashboard', function () {

    testhandler.init(protractor, it);

    //var userMenu = element(by.xpath('//div[@nav-bar="active" or @nav-bar="entering"]//div[@id="usermenu"]')),
    var userMenu = element(by.xpath('//div[@id="usermenu"]')),
        buttonExplore = element(by.xpath('//button[@ng-click="goToAndReset(\'styleDiscover.detail\')"]')),
        buttonCreateStyle = element(by.xpath('//button[@ng-click="showActionSheet()"]')),
        buttonStyleboard = element(by.xpath('//div[@ng-click="goTo(\'ranking\')"]')),
        buttonMessages = element(by.xpath('//div[@ng-click="goTo(\'messages\')"]'));

    describe('Links present', function () {
        it('user menu', function () {
            browser.isElementPresent(userMenu).then(function(isPresent){
                expect(isPresent).toBe(true);
            });
            expect(userMenu.isPresent()).toBe(true);
        });
        it('explore (entdecken)', function () {
            expect(buttonExplore.isPresent()).toBe(true);
        });
        it('create style (aufnehmen)', function () {
            expect(buttonCreateStyle.isPresent()).toBe(true);
        });
        it('ranking (styleboard)', function () {
            expect(buttonStyleboard.isPresent()).toBe(true);
        });
        it('Notifications', function () {
            expect(buttonMessages.isPresent()).toBe(true);
        });
    });

    describe('Links accessible', function () {
        beforeEach(function(){
            browser.get('#/dashboard');
        });
        it('user menu', function () {
            userMenu.click().then(function () {
                element.all(by.xpath('//ion-popover-view//li/button')).isEnabled().then(function (buttons) {
                    expect(buttons.length).toEqual(6);
                });
            });
        });
        it('explore (entdecken)', function () {
            buttonExplore.click().then(function () {
                expect(element(by.css('.popup')).isDisplayed()).toBe(true);
                element(by.css('.popup-buttons .button')).click().then(function () {
                    element(by.css('.bar.bar-footer .button.button-assertive')).click().then(function () {
                        expect(browser.getCurrentUrl()).toMatch('#/styles/discover');
                    });
                });
            });
        });
        it('create style (aufnehmen)', function () {
            buttonCreateStyle.click().then(function () {
                element.all(by.css('.action-sheet .action-sheet-options button')).isEnabled().then(function(buttons) {
                    expect(buttons.length).toEqual(2);
                });
            });
        });
        it('ranking (styleboard)', function () {
            buttonStyleboard.click().then(function () {
                expect(browser.getCurrentUrl()).toMatch('#/ranking');
            });
        });
        it('Notifications', function () {
            buttonMessages.click().then(function () {
                expect(browser.getCurrentUrl()).toMatch('#/messages');
            });
        });
    });
   testhandler.finish(protractor, it);
});
