/**
 * Created by tpi on 02.04.2015.
 */
define([
    'app',
    'angularMocks',
    'services/gender'
], function (app, mocks, genderService) {
    'use strict';

    console.log('*testing Gender Service*');
    describe('Gender', function () {

        var myGender,
            genderLists = {
                brands: {
                    'Abercrombie & Fitch': true,
                    'Acne Studios': 'female',
                    'Asics': true,
                    'Adidas': true,
                    'American Apparel': true,
                    'American Vintage': true,
                    'Armani': true,
                    'Ash': 'female',
                    'Bally': true,
                    'Balenciaga': 'female',
                    'Barbour': true,
                    'Ben Sherman': 'male'
                }
            };

        beforeEach(function () {
            mocks.inject(function ($injector) {
                myGender = $injector.instantiate(genderService, {});
            });
        });

        it('male user gets male and unisex brands', function () {
            var genderedList  = myGender.filterList(genderLists.brands, 'male'),
                unisex = genderedList.indexOf('Abercrombie & Fitch'),
                female = genderedList.indexOf('Acne Studios'),
                male = genderedList.indexOf('Ben Sherman');

            expect(unisex).toBeGreaterThan(-1);
            expect(female).toBe(-1);
            expect(male).toBeGreaterThan(-1);
            console.log(genderedList);
            console.log(unisex);
            console.log(female);
            console.log(male);
        });

        it('female user gets female and unisex brands', function () {
            var genderedList  = myGender.filterList(genderLists.brands, 'female'),
                unisex = genderedList.indexOf('Abercrombie & Fitch'),
                female = genderedList.indexOf('Acne Studios'),
                male = genderedList.indexOf('Ben Sherman');

            expect(unisex).toBeGreaterThan(-1);
            expect(female).toBeGreaterThan(-1);
            expect(male).toBe(-1);
            console.log(genderedList);
            console.log(unisex);
            console.log(female);
            console.log(male);
        });

    });
});