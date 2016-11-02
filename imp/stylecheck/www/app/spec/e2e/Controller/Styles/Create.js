/*global protractor, describe, beforeEach, it, element, expect, by, require, browser */
var testhandler = require('../../../util/testHandler');

describe('Create', function () {

    testhandler.init(protractor, it);

    var styleNumber,
        tagNumber;

    describe('create style', function () {
        it('goes to creation state and creates new style with tags', function () {
            element(by.css('.dashboard .row.first .button.button-light.center')).click().then(function () {
                expect(element(by.css('.action-sheet')).isDisplayed()).toBe(true);
                element.all(by.css('.action-sheet .button.action-sheet-option')).first().click().then(function () {
                    expect(browser.getCurrentUrl()).toMatch('#/create/chooseCategory');
                    element.all(by.repeater('category in categories')).first().click().then(function () {
                        expect(browser.getCurrentUrl()).toMatch('#/create/tags/addTags');
                        var tutorialModal = element(by.xpath('//button[@ng-click="closeModal(\'howTo\')"]'));
                        tutorialModal.isDisplayed().then(function (isVisible) {
                            if (tutorialModal.isDisplayed()) {
                                tutorialModal.click();
                            }
                        });
                        element(by.css('.bar.bar-footer .button.button-block.button-assertive')).click().then(function () {
                            element(by.css('.image-container .image')).click().then(function () {
                                expect(browser.getCurrentUrl()).toMatch('#/create/tags/tagOverview');
                                element.all(by.css('.tag-attribute')).first().click().then(function () {
                                    expect(browser.getCurrentUrl()).toMatch('#/create/tags/chooseClothes');
                                    element.all(by.repeater('(key, value) in clothes')).get(1).click().then(function () {
                                        element.all(by.repeater('(key, value) in subcategories')).get(1).click().then(function () {
                                            expect(browser.getCurrentUrl()).toMatch('#/create/tags/tagOverview');
                                            element.all(by.css('.tag-attribute')).get(1).click().then(function () {
                                                expect(browser.getCurrentUrl()).toMatch('#/create/tags/chooseColor');
                                                element.all(by.repeater('(key, value) in colors')).get(7).click().then(function () {
                                                    expect(browser.getCurrentUrl()).toMatch('#/create/tags/tagOverview');
                                                    element(by.css('.bar.bar-footer .button.button-assertive')).click().then(function () {
                                                        expect(browser.getCurrentUrl()).toMatch('#/create/tags/addTags');
                                                        expect(element(by.css('.bar.bar-footer .button.icon-edit')).isDisplayed()).toBe(true);
                                                        element(by.css('.bar.bar-footer .button.button-block.button-dark')).click().then(function () {
                                                            expect(element(by.css('.bar.bar-footer .button.icon-edit')).isPresent()).toBe(false);
                                                            element(by.css('.bar.bar-footer .button.button-block.button-dark')).click().then(function () {
                                                                expect(browser.getCurrentUrl()).toMatch('#/profile/');
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });

        it('edits created style and deletes tag', function () {
            element(by.xpath('//div[@id="usermenu"]')).click().then(function () {
                element(by.xpath('//button[@ng-click="onPopoverClick(\'profile.overview\', \'user\');"]')).click().then(function () {
                    expect(browser.getCurrentUrl()).toMatch('#/profile');
                    element.all(by.css('.collection-repeat-container ion-item')).first().click().then(function () {
                        expect(browser.getCurrentUrl()).toMatch('#/profile/styleDetail');
                        var tutorialModal = element.all(by.xpath('//button[@ng-click="closeModal(\'howTo\')"]')).get(1);
                        tutorialModal.isDisplayed().then(function (isVisible) {
                            if (tutorialModal.isDisplayed()) {
                                tutorialModal.click();
                            }
                        });
                        expect(element(by.css('.button-container .button.button-dark.icon-edit')).isPresent()).toBe(false);
                        expect(element(by.css('.button-container .button.button-dark.icon-trash')).isPresent()).toBe(false);
                        element(by.css('.info-button.circle')).click().then(function () {
                            expect(element(by.css('.button-container .button.button-dark.icon-edit')).isDisplayed()).toBe(true);
                            expect(element(by.css('.button-container .button.button-dark.icon-trash')).isDisplayed()).toBe(true);
                            element(by.css('.button-container .button.button-dark.icon-edit')).click().then(function () {
                                var activeView = element.all(by.xpath('//ion-view[@nav-view="active"]')).get(1);
                                expect(browser.getCurrentUrl()).toMatch('#/edit');
                                activeView.all(by.css('.image-container .tag')).then(function (items) {
                                    tagNumber = items.length;
                                    activeView.all(by.css('.image-container .tag')).get(tagNumber - 1).click().then(function () {
                                        expect(activeView.element(by.css('.info-container .button.button-dark.icon-edit')).isDisplayed()).toBe(true);
                                        expect(activeView.element(by.css('.info-container .button.button-dark.icon-trash')).isDisplayed()).toBe(true);
                                        activeView.element(by.xpath('//button[@ng-click="editTag()"]')).click().then(function () {
                                            expect(browser.getCurrentUrl()).toMatch('/tags/tagOverview');
                                            activeView.all(by.css('.tag-attribute')).get(1).click().then(function () {
                                                expect(browser.getCurrentUrl()).toMatch('/tags/chooseColor');
                                                activeView.all(by.repeater('(key, value) in colors')).get(2).click().then(function () {
                                                    expect(browser.getCurrentUrl()).toMatch('/tags/tagOverview');
                                                    activeView.element(by.css('.bar.bar-footer .button.button-assertive')).click().then(function () {
                                                        expect(browser.getCurrentUrl()).toMatch('/tags/addTags');
                                                        activeView.element(by.css('.bar.bar-footer .button.button-block.button-dark')).click().then(function () {
                                                            activeView.all(by.css('.image-container .tag')).get(tagNumber - 1).click().then(function () {
                                                                activeView.element(by.css('.info-container .button.button-dark.icon-trash')).click().then(function () {
                                                                    expect(element(by.css('.popup')).isDisplayed()).toBe(true);
                                                                    element(by.css('.popup-buttons .button.button-assertive')).click().then(function () {
                                                                        expect(activeView.element(by.css('.info-container .button.button-dark.icon-edit')).isPresent()).toBe(false);
                                                                        expect(activeView.element(by.css('.info-container .button.button-dark.icon-trash')).isPresent()).toBe(false);
                                                                        activeView.all(by.css('.image-container .tag')).then(function (items) {
                                                                            expect(items.length).toBe(tagNumber - 1);
                                                                        });
                                                                    });
                                                                });
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });

        it('deletes created style', function () {
            element(by.xpath('//div[@id="usermenu"]')).click().then(function () {
                element(by.xpath('//button[@ng-click="onPopoverClick(\'dashboard\', \'\');"]')).click().then(function () {
                    element(by.xpath('//div[@id="usermenu"]')).click().then(function () {
                        element(by.xpath('//button[@ng-click="onPopoverClick(\'profile.overview\', \'user\');"]')).click().then(function () {
                            element(by.css('.col.active .bold')).getText().then(function (text) {
                                styleNumber = parseInt(text, 10);
                                var styleScroller = element(by.xpath('//ion-scroll[@delegate-handle="styleScroller"]'));
                                styleScroller.all(by.css('.collection-repeat-container ion-item')).first().click().then(function () {
                                    expect(browser.getCurrentUrl()).toMatch('#/profile/styleDetail');
                                    element(by.css('.info-button.circle .icon-stylecheck')).click().then(function () {
                                        expect(element(by.css('.button.button-dark.icon.icon-trash')).isDisplayed()).toBe(true);
                                        element(by.css('.button.button-dark.icon.icon-trash')).click().then(function () {
                                            expect(element(by.css('.popup')).isDisplayed()).toBe(true);
                                            element.all(by.css('.popup-buttons .button')).first().click().then(function () {
                                                expect(element(by.css('.popup')).isPresent()).toBe(false);
                                                element(by.css('.button.button-dark.icon.icon-trash')).click().then(function () {
                                                    expect(element(by.css('.popup')).isDisplayed()).toBe(true);
                                                    element(by.css('.popup-buttons .button.button-assertive')).click().then(function () {
                                                        expect(browser.getCurrentUrl()).toMatch('#/profile');
                                                        element(by.css('.col.active .bold')).getText().then(function (text) {
                                                            expect(parseInt(text, 10)).toBe(styleNumber - 1);
                                                        });
                                                    });
                                                });
                                            });
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
});
