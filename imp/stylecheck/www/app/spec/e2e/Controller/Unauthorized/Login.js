/*global protractor, describe, beforeEach, it, element, expect, by, browser, require*/

var testhandler = require('../../../util/testHandler.js');

describe('Login', function () {

    it('prepare site for testing', function() {
        browser.get('#/unauthorized/overview').then(function () {
            browser.executeScript('window.localStorage.clear();');
            browser.executeScript('window.sessionStorage.clear();');
            console.log('#/unauthorized/overview called');
        });
    });

    it('button for app testing clickable', function () {
        browser.get('#/unauthorized/overview').then(function () {
            browser.waitForAngular().then(function () {
                browser.driver.getCurrentUrl().then(function (url) {
                    console.log('URL: ',url);
                });
                browser.executeScript("window.localStorage.getItem('ls.auth.stylecheck.app.logged_in');").then(function (localStorage) {
                    console.log('Local Storage:', localStorage);
                });
                var possibleButton = element(by.xpath("//div[3]/div[2]"));
                possibleButton.getOuterHtml().then(function (html) {
                    console.log('Possible Button: ', html);
                });
                //var htmlOutput = element(by.css("body")).getInnerHtml().then(function (html){
                //    console.log('HTML', html);
                //});
                element(by.xpath("//div[3]/div[2][@ng-click]")).isPresent().then(function (present) {
                    console.log(present);
                    expect(present).toBeTruthy();
                });
            });
        });
    });

    it('tries to log in as unregistered user', function () {
        element(by.xpath('//div[@ng-click="goTo(\'login\')"]')).click().then(function () {
            browser.waitForAngular().then(function () {
                expect(browser.driver.getCurrentUrl()).toMatch('#/unauthorized/login');
                var myButton = element(by.xpath('//button[@form="login.form"]'));
                expect(myButton.isEnabled()).toBe(false);
                element(by.model('auth.login')).sendKeys('test@test.comm');
                element(by.model('auth.password')).sendKeys('123456');
                myButton.click().then(function () {
                    expect(element(by.css('.popup')).isDisplayed()).toBe(true);
                    element(by.css('.popup-buttons .button')).click().then(function () {
                        expect(element(by.css('.popup')).isPresent()).toBe(false);
                    });
                });
            });
        });
    });

    it('logs in registered user', function () {
        element(by.model('auth.login')).clear();
        element(by.model('auth.password')).clear();
        element(by.model('auth.login')).sendKeys('test@test.test');
        element(by.model('auth.password')).sendKeys('123456');
        var myButton = element(by.xpath('//button[@form="login.form"]'));
        myButton.click().then(function () {
            browser.waitForAngular().then(function () {
                expect(browser.driver.getCurrentUrl()).toMatch('#/dashboard');
            });
        });
    });

    testhandler.finish(protractor, it, by);

    describe('ResetPassword', function () {

        it('resets user password', function () {
            element.all(by.css('.row.padding .col p')).first().click().then(function () {
                element(by.xpath('//*[@id="login.form"]/div/button')).click().then(function () {
                    expect(element(by.css('.popup')).isDisplayed()).toBe(true);
                    expect(element(by.model('forgot.mail')).isDisplayed()).toBe(true);
                    element(by.model('forgot.mail')).sendKeys('test2@test.test').then(function () {
                        element(by.css('.popup button.button-assertive')).click().then(function () {
                            expect(element(by.model('forgot.mail')).isPresent()).toBe(false);
                            expect(element(by.css('.popup')).isDisplayed()).toBe(true);
                            expect(element(by.xpath("//h3/b[text()[contains(.,'Ein Fehler ist aufgetreten')]]")).isPresent()).toBe(false);
                            //browser.pause();
                            //element(by.model('forgot.mail')).sendKeys('test@test.test');
                            //console.log('test this later when smtp server is present');
                            //expect(element(by.css("b:contains('Ein Fehler ist aufgetreten')")).isPresent()).toBe(true);
                            //element(by.css('.popup-buttons .button.button-assertive')).click();
                            //if sending of email fails we close the error message maybe it applies for the success modal as well
                            element(by.css('.popup button.button')).click();
                            console.log('PLEASE REINSTALL TESTUSERS AFTER THIS TEST');
                            //browser.pause();
                        });
                    });
                });
            });
        });

        describe('ResetPasswordLoginWithOldPassword', function () {
            it('tries to login user with old password after reset password', function () {
                element(by.model('auth.login')).clear();
                element(by.model('auth.password')).clear();
                element(by.model('auth.login')).sendKeys('test2@test.test');
                element(by.model('auth.password')).sendKeys('123456');
                element(by.css('ion-footer-bar .row .col .button.button-assertive')).click().then(function () {
                    //we have to be more specific here, it has to fail when reset user password fails
                    //expect(true).toBe(false);
                    expect(element(by.css('.popup')).isDisplayed()).toBe(true);
                    //element(by.css('.popup-buttons .button.button-assertive')).click();
                    element(by.css('.popup button.button')).click();
                    //browser.pause();
                    //element(by.css('.bar-header .button.button-clear.icon-back')).click();
                });
            });
        });

    });
});