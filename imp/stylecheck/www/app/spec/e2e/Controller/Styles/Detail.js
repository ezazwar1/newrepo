/*global protractor, describe, beforeEach, it, element, expect, by, require, browser */
var testhandler = require('../../../util/testHandler');

describe('Style Detail', function () {
    'use strict';

    testhandler.init(protractor, it);

    describe('goes to detail page', function () {
        it('goes to page', function () {
            element(by.xpath('//div[@id="usermenu"]')).click().then(function () {
                element(by.xpath('//button[@ng-click="onPopoverClick(\'profile.overview\', \'user\');"]')).click().then(function () {
                    var scrollView = element(by.xpath('//ion-scroll[delegate-handle="styleScroller"]'));
                    scrollView.all(by.css('.collection-repeat-container ion-item')).first().click().then(function () {
                        expect(browser.getCurrentUrl()).toMatch('#/profile/styleDetail');
                    });
                });
            });
        });
    });

    describe('check if howTo modal is open', function () {
        it('close it if open', function () {
            var tutorialModal = element(by.xpath('//button[@ng-click="closeModal(\'howTo\')"]'));
            if (tutorialModal) {
                tutorialModal.isDisplayed().then(function (isVisible) {
                    if (tutorialModal.isDisplayed()) {
                        tutorialModal.click();
                    }
                });
            }
        });
    });

    describe('sharing', function () {
        it('opens share dialog', function () {
            element(by.css('.button.icon-share')).click().then(function () {
                expect(element(by.css('.popup')).isDisplayed()).toBe(true);
                expect(element(by.css('.button.icon-facebook')).isDisplayed()).toBe(true);
                expect(element(by.css('.button.icon-twitter')).isDisplayed()).toBe(true);
                expect(element(by.css('.button.icon-instagram')).isDisplayed()).toBe(true);
                element(by.css('.popup-buttons .button-dark')).click().then(function () {
                    expect(element(by.css('.popup')).isPresent()).toBe(false);
                    expect(element(by.css('.button.icon-facebook')).isPresent()).toBe(false);
                    expect(element(by.css('.button.icon-twitter')).isPresent()).toBe(false);
                    expect(element(by.css('.button.icon-instagram')).isPresent()).toBe(false);
                });
            });
        });
    });

    describe('adding/removing styles to wishlist', function () {
        it('adds style to shoplist', function () {
            element(by.xpath('//div[@id="usermenu"]')).click().then(function () {
                element(by.css('.button.icon-community')).click().then(function () {
                    element.all(by.css('.collection-repeat-container ion-item')).get(1).click().then(function () {
                        var scrollView = element(by.xpath('//ion-scroll[@delegate-handle="styleScroller"]'));
                        scrollView.all(by.css('.collection-repeat-container ion-item')).first().click().then(function () {
                            expect(element(by.css('.button.icon-favorite.button-dark')).isDisplayed()).toBe(true);
                            expect(element(by.css('.button.icon-favorite.button-assertive')).isPresent()).toBe(false);
                            element(by.css('.button.icon-favorite.button-dark')).click().then(function () {
                                expect(element(by.css('.button.icon-favorite.button-dark')).isPresent()).toBe(false);
                                expect(element(by.css('.button.icon-favorite.button-assertive')).isDisplayed()).toBe(true);
                            });
                        });
                    });
                });
            });
        });

        it('check if favorizing was saved', function () {
            element(by.xpath('//div[@id="usermenu"]')).click().then(function () {
                element(by.css('.button.ion-android-home')).click().then(function () {
                    element(by.xpath('//div[@id="usermenu"]')).click().then(function () {
                        element(by.css('.button.icon-community')).click().then(function () {
                            element.all(by.css('.collection-repeat-container ion-item')).get(1).click().then(function () {
                                var scrollView = element(by.xpath('//ion-scroll[@delegate-handle="styleScroller"]'));
                                scrollView.all(by.css('.collection-repeat-container ion-item')).first().click().then(function () {
                                    expect(element(by.css('.button.icon-favorite.button-dark')).isPresent()).toBe(false);
                                    expect(element(by.css('.button.icon-favorite.button-assertive')).isDisplayed()).toBe(true);
                                });
                            });
                        });
                    });
                });
            });
        });

        it('defavorizes and checks if changes were saved', function () {
            element(by.css('.button.icon-favorite.button-assertive')).click().then(function () {
                var popup = element(by.css('.popup'));
                expect(popup.isDisplayed()).toBe(true);
                popup.element(by.css('.button.button-assertive')).click();
                expect(element(by.css('.button.icon-favorite.button-dark')).isDisplayed()).toBe(true);
                expect(element(by.css('.button.icon-favorite.button-assertive')).isPresent()).toBe(false);
                element(by.xpath('//div[@id="usermenu"]')).click().then(function () {
                    element(by.css('.button.ion-android-home')).click().then(function () {
                        element(by.xpath('//div[@id="usermenu"]')).click().then(function () {
                            element(by.css('.button.icon-community')).click().then(function () {
                                element.all(by.css('.collection-repeat-container ion-item')).get(1).click().then(function () {
                                    var scrollView = element(by.xpath('//ion-scroll[@delegate-handle="styleScroller"]'));
                                    scrollView.all(by.css('.collection-repeat-container ion-item')).first().click().then(function () {
                                        expect(element(by.css('.button.icon-favorite.button-dark')).isDisplayed()).toBe(true);
                                        expect(element(by.css('.button.icon-favorite.button-assertive')).isPresent()).toBe(false);
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
