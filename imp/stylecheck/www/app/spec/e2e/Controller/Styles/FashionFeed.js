/*global protractor, describe, beforeEach, it, element, expect, by, require, browser */
var testhandler = require('../../../util/testHandler');

describe('FashionFeed', function () {
    'use strict';

    testhandler.init(protractor, it);

    describe('open fashion feed', function () {
        it('opens fashion feed without filter settings the next time', function () {
            element(by.xpath('//div[@id="usermenu"]')).click().then(function () {
                element(by.css('.button.icon-feed')).click().then(function () {
                    expect(browser.getCurrentUrl()).toMatch('#/fashionFeed');
                });
            });
        });
        testhandler.finish(protractor, it);
    });
});
