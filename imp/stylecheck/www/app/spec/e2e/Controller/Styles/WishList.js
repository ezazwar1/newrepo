/*global protractor, describe, beforeEach, it, element, expect, by, require, browser */
var testhandler = require('../../../util/testHandler');

describe('WishList', function () {

    testhandler.init(protractor, it);

    var styleNumber;

    describe('overview and detail', function () {
        it('adds style to wishlist', function () {
            element(by.xpath('//div[@id="usermenu"]')).click().then(function () {
                element(by.css('.button.icon-community')).click().then(function () {
                    element.all(by.css('.collection-repeat-container ion-item')).get(1).click().then(function () {
                        var scrollView = element(by.xpath('//ion-scroll[@delegate-handle="styleScroller"]'));
                        scrollView.all(by.css('.collection-repeat-container ion-item')).first().click().then(function () {
                            var tutorialModal = element(by.xpath('//button[@ng-click="closeModal(\'howTo\')"]'));
                            tutorialModal.isDisplayed().then(function (isVisible) {
                                if (tutorialModal.isDisplayed()) {
                                    tutorialModal.click();
                                }
                            });
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

        it('goes to wishlist', function () {
            element(by.xpath('//div[@id="usermenu"]')).click().then(function () {
                element(by.xpath('//button[@ng-click="onPopoverClick(\'wishList.overview\', \'favorite\');"]')).click().then(function () {
                    expect(browser.getCurrentUrl()).toMatch('#/wishList');
                    element.all(by.css('.collection-repeat-container ion-item .image')).then(function (items) {
                        styleNumber = items.length;
                    });
                });
            });
        });

        it('goes from wishlist to style detail', function () {
            element.all(by.css('.collection-repeat-container ion-item')).first().click().then(function () {
                expect(browser.getCurrentUrl()).toMatch('#/wishList');
                expect(browser.getCurrentUrl()).toMatch(/[a-z0-9]{24}/);
                expect(element(by.css('.button.icon-favorite.button-dark')).isPresent()).toBe(false);
                expect(element.all(by.css('.button.icon-favorite.button-assertive')).last().isDisplayed()).toBe(true);
            });
        });

        it('removes style on detail view, goes back and style is also removed from list view', function () {
            element.all(by.css('.button.icon-favorite.button-assertive')).get(1).click().then(function () {
                expect(element(by.css('.popup')).isPresent()).toBe(true);
                element.all(by.css('.popup-buttons .button')).first().click().then(function () {
                    expect(element(by.css('.popup')).isPresent()).toBe(false);
                    element.all(by.css('.button.icon-favorite.button-assertive')).get(1).click().then(function () {
                        expect(element(by.css('.popup')).isDisplayed()).toBe(true);
                        element(by.css('.popup-buttons .button.button-assertive')).click().then(function () {
                            expect(element(by.css('.button.icon-favorite.button-dark')).isDisplayed()).toBe(true);
                            element.all(by.css('button.button.back-button')).first().click();
                        });
                    });
                });
            });
        });

        testhandler.finish(protractor, it);
    });
});
