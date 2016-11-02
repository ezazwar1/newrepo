/*global protractor, describe, beforeEach, it, element, expect, by, require, browser */
var testhandler = require('../../../util/testHandler');

describe('Search', function () {

    //var ptor = protractor.getInstance();
    var userNumber;

    testhandler.init(protractor, it);

    it('goes to community and show users', function () {
        element(by.xpath('//div[@id="usermenu"]')).click().then(function () {
            element(by.css('.button.icon-community')).click().then(function () {
                expect(browser.getCurrentUrl()).toMatch('#/search');
                expect(element.all(by.css('.collection-repeat-container ion-item')).first().isDisplayed()).toBe(true);
                element.all(by.css('.collection-repeat-container ion-item')).then(function (items) {
                    userNumber = items.length;
                });
            });
        });
    });

    it('searches for user', function () {
        element(by.model('users.pager.filter.username')).sendKeys('lampe').then(function () {
            element.all(by.repeater('user in users.entries')).then(function (items) {
                expect(items.length).toBe(1);
            });
        });
    });

    it('removes search filter and shows all users again', function () {
        element(by.css('.icon.icon-close.placeholder-icon')).click().then(function () {
            element.all(by.repeater('user in users.entries')).then(function (items) {
                expect(items.length).toBe(userNumber);
            });
        });
    });

    it('goes to user detail page by clicking user', function () {
        element.all(by.repeater('user in users.entries')).get(1).click().then(function () {
            expect(browser.getCurrentUrl()).toMatch('/profile');
            element.all(by.css('.button.button-clear.button-dark.icon.icon-back')).get(1).click().then(function () {
                expect(browser.getCurrentUrl()).toMatch('/search');
            });
        });
    });

    it('sets user as favorite and reverts', function () {
        element.all(by.repeater('user in users.entries')).get(1).then(function (user) {
            expect(user.element(by.css('.button.icon-follow-me')).isDisplayed()).toBe(true);
            expect(user.element(by.css('.button.icon-follow')).isPresent()).toBe(false);
            user.element(by.css('.button.icon-follow-me')).click().then(function () {
                expect(user.element(by.css('.button.icon-follow-me')).isPresent()).toBe(false);
                expect(user.element(by.css('.button.icon-follow')).isDisplayed()).toBe(true);
                user.element(by.css('.button.icon-follow')).click().then(function () {
                    expect(user.element(by.css('.button.icon-follow-me')).isDisplayed()).toBe(true);
                    expect(user.element(by.css('.button.icon-follow')).isPresent()).toBe(false);
                });
            });
        });
    });

    testhandler.finish(protractor, it);
});
