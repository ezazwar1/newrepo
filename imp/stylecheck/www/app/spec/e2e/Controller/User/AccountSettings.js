/*global protractor, describe, beforeEach, it, element, expect, by, require, browser */
var testhandler = require('../../../util/testHandler');

describe('AccountSettings', function () {

    testhandler.init(protractor, it);

    var email = 'test@test.test',
        newEmail = 'testitest@test.test',
        password = '123456',
        newPassword = '654321';

    it('changes language and email and saves', function () {
        element(by.xpath('//div[@id="usermenu"]')).click().then(function () {
            element(by.xpath('//button[@ng-click="onPopoverClick(\'settings\', \'settings\');"]')).click().then(function () {
                expect(browser.getCurrentUrl()).toMatch('#/settings');
                element.all(by.css('.settings-container .settings-list .item')).get(1).click().then(function () {
                    expect(browser.getCurrentUrl()).toMatch('#/accountSettings');
                    expect(element(by.css('.bar.bar-footer .button.button-send')).isEnabled()).toBe(false);
                    var selectbox = element(by.model('form.language'));
                    selectbox.click().then(function () {
                        selectbox.all(by.css('option')).get(1).click().then(function () {
                            element.all(by.tagName('option')).get(1).click().then(function () {
                                element(by.model('form.email')).clear();
                                element(by.model('form.email')).sendKeys(newEmail);
                                element(by.model('form.password')).sendKeys(password);
                                expect(element(by.css('.bar.bar-footer .button.button-send')).isEnabled()).toBe(true);
                                element(by.css('.bar.bar-footer .button.button-send')).click().then(function () {
                                    expect(element(by.model('form.email')).getAttribute('value')).toBe(newEmail);
                                    expect(element(by.model('form.password')).getAttribute('value')).toBe('');
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
                    });
                });
            });
        });
    });

    it('logs in with new email and undo changes', function () {
        browser.get('#/unauthorized/login');
        browser.getCurrentUrl().then(function (url) {
            element(by.model('auth.login')).sendKeys(newEmail);
            element(by.model('auth.password')).sendKeys(password);
            element(by.css('ion-footer-bar .row .col .button.button-assertive')).click().then(function () {
                expect(browser.getCurrentUrl()).toMatch('#/dashboard');
            });
        });
        element(by.xpath('//div[@id="usermenu"]')).click().then(function () {
            element(by.xpath('//button[@ng-click="onPopoverClick(\'settings\', \'settings\');"]')).click().then(function () {
                element.all(by.css('.settings-container .settings-list .item')).get(1).click().then(function () {
                    expect(browser.getCurrentUrl()).toMatch('#/accountSettings');
                    expect(element(by.model('form.language')).getAttribute('value')).toBe('en');
                    element.all(by.tagName('option')).first().click().then(function () {
                        element(by.model('form.email')).clear();
                        element(by.model('form.email')).sendKeys(email);
                        element(by.model('form.password')).sendKeys(password);
                        expect(element(by.css('.bar.bar-footer .button.button-send')).isEnabled()).toBe(true);
                        element(by.css('.bar.bar-footer .button.button-send')).click();
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
        });
    });

    testhandler.init(protractor, it);

    it('changes password', function () {
        element(by.xpath('//div[@id="usermenu"]')).click().then(function () {
            element(by.xpath('//button[@ng-click="onPopoverClick(\'settings\', \'settings\');"]')).click().then(function () {
                expect(browser.getCurrentUrl()).toMatch('#/settings');
                element.all(by.css('.settings-container .settings-list .item')).get(1).click().then(function () {
                    expect(browser.getCurrentUrl()).toMatch('#/accountSettings');
                    expect(element(by.css('.bar.bar-footer .button.button-send')).isEnabled()).toBe(false);
                    element(by.xpath('//button[@ng-click="changePassword()"]')).click().then(function () {
                        expect(element(by.css('.popup')).isDisplayed()).toBe(true);
                        element(by.model('password.old')).sendKeys(password);
                        element(by.model('password.new')).sendKeys(newPassword);
                        element(by.model('password.confirm')).sendKeys(newPassword);
                        element(by.css('.popup-buttons .button-assertive')).click().then(function () {
                            expect(element(by.css('.popup')).isPresent()).toBe(false);
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
            });
        });
    });

    it('logs in with new password and undo changes', function () {
        browser.get('#/unauthorized/login');
        browser.getCurrentUrl().then(function (url) {
            element(by.model('auth.login')).sendKeys(email);
            element(by.model('auth.password')).sendKeys(newPassword);
            element(by.css('ion-footer-bar .row .col .button.button-assertive')).click().then(function () {
                expect(browser.getCurrentUrl()).toMatch('#/dashboard');
            });
        });
        element(by.xpath('//div[@id="usermenu"]')).click().then(function () {
            element(by.xpath('//button[@ng-click="onPopoverClick(\'settings\', \'settings\');"]')).click().then(function () {
                element.all(by.css('.settings-container .settings-list .item')).get(1).click().then(function () {
                    expect(browser.getCurrentUrl()).toMatch('#/accountSettings');
                    element(by.xpath('//button[@ng-click="changePassword()"]')).click().then(function () {
                        expect(element(by.css('.popup')).isDisplayed()).toBe(true);
                        element(by.model('password.old')).sendKeys(newPassword);
                        element(by.model('password.new')).sendKeys(password);
                        element(by.model('password.confirm')).sendKeys(password);
                        element(by.css('.popup-buttons .button-assertive')).click().then(function () {
                            expect(element(by.css('.popup')).isPresent()).toBe(false);
                        });
                    });
                });
            });
        });
    });

    testhandler.finish(protractor, it);
});
