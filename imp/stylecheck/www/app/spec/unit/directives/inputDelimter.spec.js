/**
 * Created by tpi on 07.04.2015.
 */
define([
    'app',
    'dicts/de',
    'angularMocks',
    'directives/inputDelimiter',
    'templates/styles/create/tagOverview.html'
], function (app, dict_de, mocks, inputDelimterDirective) {
    'use strict';

    var scope,
        compile,
        compiled,
        $rootScope,
        element,
        myBrand = 'Abercrombie',
        myBrandLength = myBrand.length,
        myLimit = 60,
        myHint = true,
        myModel = 'test.model',
        html = '<div><label input-delimiter hint="' + myHint + '" limit="' + myLimit + '" model="' + myModel + '"><input type="text" placeholder="dict.brandName" ng-model="' + myModel + '"></label></div>';

    console.log('*testing Input Delimiter Directive*');
    describe('Input Delimiter', function () {
        beforeEach(function () {
            //mocks.module('/assets/templates/styles/create/tagOverview.html');
            mocks.module(function ($compileProvider) {
               $compileProvider.directive('inputDelimiter', inputDelimterDirective);
            });
        });
        beforeEach(mocks.inject(function ($injector, $compile, $rootScope) {
            scope = $rootScope.$new();
            $rootScope.dict = dict_de;
            $rootScope.test = {};
            compile = $compile;
            element = angular.element(html);
            compiled = compile(element);
            compiled(scope);
            //element = compile(element)(scope);
        }));
        it('hint, limit, model can be set', function () {
            //element.scope()['test'].model = 'Abercrombie';
            scope.test.model = myBrand;
            element.scope().$digest();
            var myIsolateScope = element.children().isolateScope();
            console.log('Hint: ', myIsolateScope.hint);
            console.log('Limit: ', myIsolateScope.limit);
            console.log('Model: ', myIsolateScope.model);
            //var myModelName = element.find('input').attr('ng-model');
            expect(myIsolateScope.hint).toEqual(myHint);
            expect(myIsolateScope.limit).toEqual(myLimit);
            expect(myIsolateScope.model).toEqual(myBrand);
        });
        it('hint is shown', function() {
            var myHintElement = element.find('span');
            console.log('Hint Element length: ', myHintElement.length);
            expect(myHintElement.length).toBe(1);
        });
        it('remaining chars are calcualted', function () {
            var myRemainingChars = myLimit - myBrandLength;
            scope.test.model = myBrand;
            element.scope().$digest();
            var myIsolateScope = element.children().isolateScope();
            expect(myIsolateScope.inputLength).toEqual(myRemainingChars);
            console.log('calculated remaining chars: ', myRemainingChars);
        });
        it('input value is cut down to limit', function() {
            var longString = 'Wenn der Hund mit der Wurst übern Spucknapf springt und der Storch in der Luft den Frosch verschlingt';
            console.log('longString length: ', longString.length);
            scope.test.model = longString;
            element.scope().$digest();
            var myIsolateScope = element.children().isolateScope();
            console.log(myIsolateScope.model);
            var inputValue = element.find('input').val();
            console.log('Input Value', inputValue);
            expect(inputValue.length).toEqual(myLimit);
            expect(myIsolateScope.inputLength).toBe(0);
            expect(myIsolateScope.limit < longString.length).toBeTruthy();
        });
        it('clear brand input', function() {
            //scope.test.model = '';
            delete(scope.test.model);
            console.log('testmodel: ', scope.test.model);
            element.scope().$digest();

            var myIsolateScope = element.children().isolateScope();
            if(myIsolateScope.model){
                console.log('Empty Brand: ', myIsolateScope.model);
            }
            console.log('Input Length:', myIsolateScope.inputLength);
            //console.log(element);
            expect(myIsolateScope.inputLength).toEqual(myLimit);
        });
        it('hint can be hidden', function() {
            myHint = false;
            html = '<div><label input-delimiter hint="' + myHint + '" limit="' + myLimit + '" model="' + myModel + '"><input type="text" placeholder="dict.brandName" ng-model="' + myModel + '"></label></div>';
            element = html;
            element = angular.element(html);
            compiled = compile(element);
            compiled(scope);
            element.scope().$digest();
            var myHintElement = element.find('span');
            console.log('Hint Element length: ', myHintElement.length);
            expect(myHintElement.length).toBe(0);
            //console.log(element);
        });
    });
});