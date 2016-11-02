/*global protractor, describe, beforeEach, it, element, expect, by, require*/
var testhandler = require('../../../util/testHandler');

describe('Registration', function () {

    describe('TAS and Privacy', function () {

        it('tas link present', function () {
            browser.get('#/unauthorized/register').then( function() {
                expect(element(by.xpath('//a[@ng-click="showModal(\'tas\')"]')).isPresent()).toBe(true);
            });
        });

        it('tas accessible', function () {
            element(by.xpath('//a[@ng-click="showModal(\'tas\')"]')).click().then(function () {
                expect(element(by.xpath('//h2[@id="tas"]')).isPresent()).toBe(true);
                element(by.css('.modal-backdrop.active .bar-header .button.button-clear.icon-close')).click().then(function () {
                    expect(element(by.css('.modal-backdrop.active')).isPresent()).toBe(false);
                });
            });
        });

        it('privacy link present', function () {
            expect(element(by.xpath('//a[@ng-click="showModal(\'privacy\')"]')).isPresent()).toBe(true);
        });

        it('privacy accessible', function () {
            element(by.xpath('//a[@ng-click="showModal(\'privacy\')"]')).click().then(function () {
                expect(element(by.xpath('//h2[@id="privacy"]')).isPresent()).toBe(true);
                element(by.css('.modal-backdrop.active .bar-header .button.button-clear.icon-close')).click().then(function () {
                    expect(element(by.css('.modal-backdrop.active')).isPresent()).toBe(false);
                });
            });
        });
    });

    describe('Register', function () {
        beforeEach(function () {
            element(by.model('auth.email')).clear();
            element(by.model('auth.password')).clear();
            element(by.model('auth.repeatPassword')).clear();
        });

        it('tries to register already registered user', function () {
            element(by.model('auth.email')).sendKeys('test@test.test');
            element(by.model('auth.password')).sendKeys('123456');
            element(by.model('auth.repeatPassword')).sendKeys('123456');
            var myCheckbox = element(by.model('termsAccepted'));
            myCheckbox.click();
            myCheckbox.isSelected().then(function (selected) {
                expect(selected).toBe(true);
                element(by.xpath('//button[@form="register.form"]')).click().then(function () {
                    expect(element(by.css('.popup #email_exists')).isPresent()).toBe(true);
                    //confirm popup
                    element(by.css('.popup-buttons .button')).click().then(function () {
                        expect(element(by.css('.popup')).isPresent()).toBe(false);
                    });
                });
            });
            //tidy up
            myCheckbox.click();
        });

        it('register without accepting tas and privacy', function () {
            element(by.model('auth.email')).sendKeys('test@test.test');
            element(by.model('auth.password')).sendKeys('123456');
            element(by.model('auth.repeatPassword')).sendKeys('123456');
            var myCheckbox = element(by.model('termsAccepted'));
            myCheckbox.isSelected().then(function (selected) {
                expect(selected).toBe(false);
                var myButton = element(by.xpath('//button[@form="register.form"]'));
                expect(myButton.isEnabled()).toBe(false);
            });
        });

        it('form invalid if two different password are typed in', function () {
            var password = '123456',
                repeatPassword = '654321',
                passwordInput = element(by.model('auth.password')),
                repeatPasswordInput =  element(by.model('auth.repeatPassword')),
                passwordInputValue = '',
                repeatPasswordInputValue = '';
            element(by.model('auth.email')).sendKeys('test@test.test');
            passwordInput.sendKeys(password);
            repeatPasswordInput.sendKeys(repeatPassword);
            passwordInput.getAttribute('value').then(function (value) {
                passwordInputValue = value;
                console.log('Password1: ',passwordInputValue);
            });
            repeatPasswordInput.getAttribute('value').then(function (value) {
                repeatPasswordInputValue = value;
                console.log('Password2: ',repeatPasswordInputValue);
            });
            //expect(passwordInputValue).not.toEqual(repeatPasswordInputValue);
            var myCheckbox = element(by.model('termsAccepted'));
            myCheckbox.click();
            var myButton = element(by.xpath('//button[@form="register.form"]'));
            expect(myButton.isEnabled()).toBe(false);
            //tidy up
            myCheckbox.click();
        });

        it('form invalid if password has less than 6 character', function () {
            element(by.model('auth.email')).sendKeys('test@test.test');
            element(by.model('auth.password')).sendKeys('12345');
            element(by.model('auth.repeatPassword')).sendKeys('12345');
            var myCheckbox = element(by.model('termsAccepted'));
            myCheckbox.click();
            myCheckbox.isSelected().then(function (selected) {
                expect(selected).toBe(true);
                var myButton = element(by.xpath('//button[@form="register.form"]'));
                expect(myButton.isEnabled()).toBe(false);
            });
            //tidy up
            myCheckbox.click();
        });

        it('registers new user', function () {
            var timestamp = Math.round(+new Date() / 1000),
                gender = ['male', 'female'],
                myCheckbox = {},
                myButton = {},
                slideBar = {},
                brandElements = {},
                brandElementsLength = 0,
                randomBrand = 0,
                brandElementLabel = {},
                brandElement,
                gender = gender[Math.floor(Math.random() * gender.length)];
            element(by.model('auth.email')).sendKeys('testCaseUser.' + timestamp + '@test.test');
            element(by.model('auth.password')).sendKeys('123456');
            element(by.model('auth.repeatPassword')).sendKeys('123456');
            myCheckbox = element(by.model('termsAccepted'));
            myCheckbox.click();
            myCheckbox.isSelected().then(function (selected) {
                expect(selected).toBe(true);
            });
            myButton = element(by.xpath('//button[@form="register.form"]'));
            myButton.click().then(function () {
                expect(browser.getCurrentUrl()).toMatch('#/editProfile');
                expect(browser.getCurrentUrl()).toMatch('/first');
                expect(element(by.css('.bar-footer .button-assertive')).isEnabled()).toBe(false);
                element(by.xpath('//button[@ng-click="userData.gender = \'' + gender + '\'"]')).click().then(function () {
                    myButton = element(by.xpath('//button[@form="form.userData"]'));
                    sliderBar = element(by.name('age'));
                    browser.actions().dragAndDrop(sliderBar, {x: 400, y: 20}).perform();
                    element(by.model('temp.username')).sendKeys('Tes');
                    expect(myButton.isEnabled()).toBe(false);
                    element(by.model('temp.username')).clear();
                    element(by.model('temp.username')).sendKeys('Testmann' + timestamp);
                    expect(myButton.isEnabled()).toBe(true);
                    myButton.click().then(function () {
                        brandElements = element.all(by.xpath('//label[@ng-click="toggleSelection(brand.name)"]'));
                        brandElements.count().then(function (number) {
                            brandElementsLength = number;
                            console.log('Brands found: ', brandElementsLength);
                            randomBrand = Math.floor(Math.random() * brandElementsLength);
                            console.log('Brand selected: ', randomBrand);
                        });
                        brandElementLabel = brandElements.get(randomBrand);
                        brandElement = brandElementLabel.element(by.css('input'));
                        brandElement.isSelected().then(function (status) {
                            selected = status;
                            console.log('Selected: ', status);
                        });
                        brandElement.getAttribute('value').then(function (value) {
                            console.log('Brand Name: ', value);
                        });
                        testhandler.scrollElemFinderIntoView(brandElementLabel).then(function () {
                            expect(brandElementLabel.isDisplayed()).toBe(true);
                            brandElementLabel.click().then(function () {
                                expect(brandElement.isSelected()).toBe(true);
                                console.log('Element was not selected, now is');
                                element(by.css('button[ng-click="saveBrands()"]')).click().then(function () {
                                    expect(browser.getCurrentUrl()).toMatch('#/dashboard');
                                });
                            });
                        });
                    });
                });
            });
        });
    });
    testhandler.finish(protractor, it, by);
});
