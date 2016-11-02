/*global protractor, describe, beforeEach, it, element, expect, by, require, browser */
var testhandler = require('../../../util/testHandler');

describe('FilterSettings', function () {

    //var ptor = protractor.getInstance();

    testhandler.init(protractor, it);

    it('goes from menu to filter settings', function () {
        element(by.xpath('//div[@id="usermenu"]')).click().then(function () {
            element(by.css('.button.icon-settings')).click().then(function () {
                expect(browser.getCurrentUrl()).toMatch('#/settings');
                element.all(by.css('.settings-container .settings-list .item')).first().click().then(function () {
                    expect(browser.getCurrentUrl()).toMatch('#/filterSettings');
                });
            });
        });
    });

    it('changes and saves filter settings', function () {
        element.all(by.css('.button-block-wrapper .button.button-block')).get(1).click();
        element(by.css('.bar.bar-footer .button.button-assertive')).click().then(function () {
            expect(browser.getCurrentUrl()).toMatch('#/settings');
            element.all(by.css('.settings-container .settings-list .item')).first().click().then(function () {
                expect(browser.getCurrentUrl()).toMatch('#/filterSettings');
                expect(element(by.css('.button-block-wrapper .button-assertive')).isDisplayed()).toBe(true);
            });
        });
    });

    testhandler.finish(protractor, it);
});
