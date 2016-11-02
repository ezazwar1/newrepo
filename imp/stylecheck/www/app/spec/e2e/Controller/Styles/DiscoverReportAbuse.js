/*global protractor, describe, beforeEach, it, element, expect, by, require, browser */
var testhandler = require('../../../util/testHandler');

describe('Discover Report Abuse', function () {
    'use strict';
    testhandler.init(protractor, it);

    var reportButton = {};

    it('report abuse button present', function () {
        browser.get('#/styles/discover/').then(function () {
            var tutorialModal = element(by.xpath('//button[@ng-click="closeModal(\'howTo\')"]'));
            tutorialModal.isDisplayed().then(function (isVisible) {
                if (tutorialModal.isDisplayed()) {
                    tutorialModal.click();
                }
            });
            element(by.xpath('//div[@ng-click="onInfoButtonClick()"]')).click().then(function () {
                reportButton = element(by.xpath('//button[@ng-click="openReportStyle()"]'));
                expect(reportButton.isDisplayed()).toBeTruthy();
            });
        });
    });

    it('report abuse option 1', function () {
        reportButton.click().then(function () {
            element.all(by.model('reportStyle.reason')).get(0).click().then(function () {
                element(by.css('div.modal-backdrop button.button-assertive')).click().then(function () {
                    expect(element(by.css('.modal-backdrop.active')).isPresent()).toBe(false);
                });
            });
        });
    });

    it('report abuse option 2', function () {
        reportButton.click().then(function () {
            element.all(by.model('reportStyle.reason')).get(1).click().then(function () {
                element(by.css('div.modal-backdrop button.button-assertive')).click().then(function () {
                    expect(element(by.css('.modal-backdrop.active')).isPresent()).toBe(false);
                });
            });
        });
    });

    it('report abuse option 3', function () {
        reportButton.click().then(function () {
            element.all(by.model('reportStyle.reason')).get(2).click().then(function () {
                element(by.css('div.modal-backdrop button.button-assertive')).click().then(function () {
                    expect(element(by.css('.modal-backdrop.active')).isPresent()).toBe(false);
                });
            });
        });
    });

    it('report abuse custom option', function () {
        reportButton.click().then(function () {
            element(by.model('reportStyle.otherReason')).sendKeys('UnVeRsChÄmT!').then(function () {
                element(by.css('div.modal-backdrop button.button-assertive')).click().then(function () {
                    expect(element(by.css('.modal-backdrop.active')).isPresent()).toBe(false);
                });
            });
        });
    });

    it('report abuse no option', function () {
        reportButton.click().then(function () {
            expect(element(by.css('div.modal-backdrop button.button-assertive')).getAttribute('disabled')).toBe('true');
            expect(element(by.css('.modal-backdrop.active')).isPresent()).toBe(true);
        });
    });

    it('cancel report abuse', function () {
        element(by.xpath('//button[@ng-click="closeModal(\'report\')"]')).click().then(function () {
            expect(element(by.css('.modal-backdrop.active')).isPresent()).toBe(false);
        });
    });

    testhandler.finish(protractor, it);
});
