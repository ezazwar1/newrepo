/*global protractor, describe, beforeEach, it, element, expect, by, require*/
var testhandler = require('../../../util/testHandler');

describe('OwnStyles', function () {

    testhandler.init(protractor, it);

    it('click first style and open detail page', function () {
        element(by.xpath('//div[@id="usermenu"]')).click().then(function () {
            //element.all(by.css('.popover-backdrop.active .list li')).first().click().then(function () {
            element(by.xpath('//button[@ng-click="onPopoverClick(\'profile.overview\', \'user\');"]')).click().then(function () {
                expect(browser.getCurrentUrl()).toMatch('#/profile');
                //browser.pause();
                /*
                element(by.css('.row.profile-buttons .col .bold')).first().then(function (countElement) {
                    expect(countElement.getInnerHtml()).toBe('2');
                });
                */
                element.all(by.tagName('ion-item')).then(function (ownStyles) {
                    //expect(ownStyles.length).toBe(2);
                    ownStyles[0].click().then(function () {
                        expect(browser.getCurrentUrl()).toMatch('#/profile/styleDetail/');
                    });
                });
            });
        });
    });

    testhandler.finish(protractor, it);
});
