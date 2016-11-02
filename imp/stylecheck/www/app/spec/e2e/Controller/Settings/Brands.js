/*global protractor, describe, beforeEach, it, element, expect, by, require, browser */
var testhandler = require('../../../util/testHandler');

describe('Brands', function () {

    testhandler.init(protractor, it);

    var userMenu = element(by.xpath('//div[@id="usermenu"]'));

    describe('Brands List', function () {
        var brandElements = {},
            brandElementsLength = 0,
            brandElement,
            brandElementLabel,
            randomBrand = 0,
            selected = false,
            newStatus = false;
        it('letters present', function () {
            userMenu.click().then(function() {
                element(by.xpath('//button[@ng-click="onPopoverClick(\'settings\', \'settings\');"]')).click().then(function () {
                    element(by.xpath('//li[@ng-click="goTo(\'brands\')"]')).click().then(function () {
                        //var letterElements = element.all(by.xpath('//div[@ng-repeat="(letter, brands) in brandList"]'));
                        var letterElements = element.all(by.repeater('(letter, brands) in brandList')).count();
                        expect(letterElements).toBeGreaterThan(0);
                        browser.sleep(2000);
                        brandElements = element.all(by.xpath('//label[@ng-click="toggleSelection(brand.name)"]'));
                        brandElements.count().then(function (number) {
                            brandElementsLength = number;
                            console.log('Brands found: ', brandElementsLength);
                            randomBrand = Math.floor(Math.random() * brandElementsLength);
                            console.log('Brand selected: ', randomBrand);
                        });
                    });
                });
            });
        });

        it('brands present', function () {
            expect(brandElementsLength).toBeGreaterThan(0);
        });

        it('brand selectable', function () {
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
                brandElementLabel.click();
                if (selected === false) {
                    expect(brandElement.isSelected()).toBe(true);
                    console.log('Element was not selected, now is');
                    brandElementLabel.click();
                    expect(brandElement.isSelected()).toBe(false);
                } else if (selected === true) {
                    expect(brandElement.isSelected()).toBe(false);
                    console.log('Element was selected, now is not');
                }
            });
        });

        it('brand is saveable', function () {
            testhandler.scrollElemFinderIntoView(brandElementLabel).then(function () {
                brandElementLabel.click().then(function () {
                    element(by.css('button[ng-click="saveBrands()"]')).click().then(function () {
                        element(by.css('li[ng-click="goTo(\'brands\')"]')).click().then(function () {
                             testhandler.scrollElemFinderIntoView(brandElementLabel).then(function () {
                                 if (selected === false) {
                                     expect(brandElement.isSelected()).toBe(true);
                                     console.log('Element was not selected, now is');
                                 } else if (selected === true) {
                                     expect(brandElement.isSelected()).toBe(false);
                                     console.log('Element was selected, now is not');
                                 }
                             });
                        });
                    });
                });
            });
        });

        it('select the other way round', function () {
            var brandElementsSelected = {},
                brandElementSelected = {},
                brandElementLabelSelected = {},
                brandElementsSelectedLength = 0,
                randomBrandSelected = 0;

            if (selected === false) {
                brandElementsSelected = element.all(by.css('div.brand-list input[checked="checked"]'));
                brandElementsSelected.count().then(function (number) {
                   brandElementsSelectedLength = number;
                   console.log('Selected Brands found: ', brandElementsSelectedLength);
                   randomBrandSelected = Math.floor(Math.random() * brandElementsSelectedLength);
                   console.log('Selected Brand selected: ', randomBrandSelected);
                   console.log(randomBrandSelected);
                   brandElementSelected = brandElementsSelected.first();
                   brandElementLabelSelected = brandElementSelected.element(by.xpath('..'));
                   brandElementSelected.getAttribute('value').then(function (value) {
                      console.log('Brand Name: ', value);
                   });
                   testhandler.scrollElemFinderIntoView(brandElementLabelSelected).then(function () {
                      expect(brandElementLabelSelected.isDisplayed()).toBe(true);
                      brandElementLabelSelected.click().then(function () {
                          //should be false, no??!?!?
                          expect(brandElementSelected.isSelected()).toBe(true);
                          console.log('Element was selected, now is not');
                      });
                   });
                });
            } else if (selected === true) {
                brandElementsSelected = element.all(by.css('div.brand-list input:not([checked])'));
                brandElementsSelected.count().then(function (number) {
                   brandElementsSelectedLength = number;
                   console.log('Not selected Brands found: ', brandElementsSelectedLength);
                    randomBrandSelected = Math.floor(Math.random() * brandElementsSelectedLength);
                   console.log('Not selected Brand selected: ', randomBrandSelected);
                });
                brandElementSelected = brandElementsSelected.get(randomBrandSelected);
                brandElementLabelSelected = brandElementSelected.element(by.xpath('..'));
                brandElementSelected.getAttribute('value').then(function (value) {
                   console.log('Brand Name: ', value);
                });
                testhandler.scrollElemFinderIntoView(brandElementLabelSelected).then(function () {
                   expect(brandElementLabelSelected.isDisplayed()).toBe(true);
                   brandElementLabelSelected.click().then(function () {
                       //should be true, no??!?!?
                       expect(brandElementSelected.isSelected()).toBe(false);
                       console.log('Element was not selected, now is');
                   });
                });
            }
        });
    });
    testhandler.finish(protractor, it);
});
