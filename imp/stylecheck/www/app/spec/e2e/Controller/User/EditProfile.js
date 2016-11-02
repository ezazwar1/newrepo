/*global protractor, describe, beforeEach, it, element, expect, by, require, browser */
var testhandler = require('../../../util/testHandler');

describe('EditProfile', function () {

    //var ptor = protractor.getInstance();

    testhandler.init(protractor, it);

    it('change and save user profile settings', function () {
        element(by.xpath('//div[@id="usermenu"]')).click().then(function () {
            //element.all(by.xpath('//ion-popover-view/ion-content/ul/li[1]')).click().then(function () {
            element(by.xpath('//button[@ng-click="onPopoverClick(\'profile.overview\', \'user\');"]')).click().then(function () {
                expect(browser.getCurrentUrl()).toMatch('#/profile');
                element(by.css('.button.button-clear.icon-edit')).click().then(function () {
                    expect(browser.getCurrentUrl()).toMatch('#/editProfile');
                    expect(element(by.model('userData.username')).isPresent()).toBe(false);
                    expect(element(by.model('userData.info')).isDisplayed()).toBe(true);
                    expect(element(by.model('userData.firstName')).isDisplayed()).toBe(true);
                    element(by.model('userData.info')).clear();
                    element(by.model('userData.firstName')).clear();
                    element(by.model('userData.location')).clear();
                    element(by.model('userData.info')).sendKeys('Ich bin ein Testnutzer');
                    element(by.model('userData.firstName')).sendKeys('Horst');
                    element(by.model('userData.location')).sendKeys('Hinterm Mond gleich links');
                    element(by.css('.bar-footer .button-assertive')).click().then(function () {
                        expect(browser.getCurrentUrl()).toMatch('#/profile');
                        element(by.css('.button.button-clear.icon-edit')).click().then(function () {
                            expect(browser.getCurrentUrl()).toMatch('#/editProfile');
                            expect(element(by.model('userData.info')).getAttribute('value')).toEqual('Ich bin ein Testnutzer');
                            expect(element(by.model('userData.firstName')).getAttribute('value')).toEqual('Horst');
                            expect(element(by.model('userData.location')).getAttribute('value')).toEqual('Hinterm Mond gleich links');
                        });
                    });
                });
            });
        });
    });

    testhandler.finish(protractor, it);
});
