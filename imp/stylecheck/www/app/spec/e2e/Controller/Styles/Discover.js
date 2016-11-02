/*global protractor, describe, beforeEach, it, element, expect, by, require, browser */
var testhandler = require('../../../util/testHandler');

describe('Discover', function () {

    testhandler.init(protractor, it);

    var buttonExplore = element(by.xpath('//button[@ng-click="goToAndReset(\'styleDiscover.detail\')"]')),
        commentsNumber;

    describe('create and delete comment for style', function () {
        it('opens filter settings when discover is visited first time', function () {
            buttonExplore.click().then(function () {
                expect(browser.getCurrentUrl()).toMatch('#/filterSettings/discover');
                element(by.css('.popup')).isDisplayed().then(function (isVisible) {
                    if (isVisible) {
                        element(by.css('.popup-buttons .button')).click().then(function () {
                            expect(element(by.css('.stable.uppercase.small.margin-top')).isDisplayed()).toBe(true);
                            element(by.css('.bar.bar-footer .button.button-assertive')).click().then(function () {
                                expect(browser.getCurrentUrl()).toMatch('#/styles/discover');
                            });
                        });
                    } else {
                        element(by.css('.bar.bar-footer .button.button-assertive')).click().then(function () {
                            expect(browser.getCurrentUrl()).toMatch('#/styles/discover');
                        });
                    }
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

        it('shows comment modal', function () {
            element(by.css('.icon-comment')).click().then(function () {
                expect(element(by.css('.modal-backdrop.active')).isDisplayed()).toBe(true);
                expect(element(by.model('newComment.text')).isDisplayed()).toBe(true);
            });
        });

        it('gets number of existing comments', function () {
            element.all(by.css('.list.comment-list .item')).then(function (items) {
                commentsNumber = items.length;
            });
        });

        it('comments a style when comment length is 1 or higher', function () {
            element(by.model('newComment.text')).sendKeys('').then(function () {
                expect(element(by.css('.button.button-assertive.button-send')).isEnabled()).toBe(false);
                element(by.model('newComment.text')).clear();
                element(by.model('newComment.text')).sendKeys('Ein wirklich ganz ganz toller Style.........NICHT!!!').then(function () {
                    expect(element(by.css('.button.button-assertive.button-send')).isEnabled()).toBe(true);
                    element(by.css('.button.button-assertive.button-send')).click().then(function () {
                        element.all(by.css('.list.comment-list .item')).then(function (items) {
                            expect(items.length).toBe(commentsNumber + 1);
                        });
                    });
                });
            });
        });

        it('closes comment modal and shows correct comment number', function () {
            element(by.css('.modal-backdrop.active .bar.bar-header .icon-close')).click().then(function () {
                expect(element(by.css('.modal-backdrop.active')).isPresent()).toBe(false);
                expect(element(by.model('newComment.text')).isDisplayed()).toBe(false);
                expect(element(by.css('.button.icon-comment .value')).getText()).toBe((commentsNumber + 1).toString());
            });
        });

        it('goes to profile via comment', function () {
            element(by.css('.icon-comment')).click().then(function () {
                expect(element(by.css('.modal-backdrop.active')).isDisplayed()).toBe(true);
                expect(element(by.model('newComment.text')).isDisplayed()).toBe(true);
                element(by.css('.list.comment-list .item .circle')).click().then(function () {
                    expect(browser.getCurrentUrl()).toMatch('#/profile');
                    element.all(by.css('.bar.bar-header .button.button-dark.back-button')).first().click().then(function () {
                        expect(browser.getCurrentUrl()).toMatch('#/styles/discover');
                    });
                });
            });
        });

        it('deletes created comment', function () {
            element(by.css('.icon-comment')).click().then(function () {
                element.all(by.css('.button.icon-remove-comment')).last().click().then(function () {
                    console.log('remove');
                    expect(element(by.css('.popup')).isDisplayed()).toBe(true);
                    element(by.css('.popup-buttons .button-assertive')).click().then(function () {
                        element.all(by.css('.list.comment-list .item')).then(function (items) {
                            element(by.css('.modal-backdrop.active .bar.bar-header .icon-close')).click().then(function () {
                                expect(element(by.css('.button.icon-comment .value')).getText()).toBe(commentsNumber.toString());
                            });
                        });
                    });
                });
            });
        });
        testhandler.finish(protractor, it);
    });
});
