Frizisto Dashboard
==================

Writing and starting test cases
============

Unit Tests

Für die Unit Test wird als Test-Runner-Tool Karma verwendet. Die Testfälle selbst sind in Jasmine geschrieben. Nach dem Installieren aller notwendigen Node Module über npm install sollten zuerst die Dateien test-main.js sowie karma.conf.js erstellt werden. Innerhalb der test-main.js werden alle Dateien angegeben, die für die Tests geladen werden müssen. In der karma.conf.js wird anschließend die Konfiguration für Karma vorgenommen. Die wichtigsten Parameter sind dabei die zu nutzenden Frameworks (in unserem Fall Jasmine und RequireJS), die Dateien die im Browser geladen werden sollen, auszuschließende Dateien, und der Browser mit dem die Tests ausgeführt werden sollen (am sinnvollsten ist es hier PhantomJS zu nehmen). Wird die Struktur innerhalb unserer Angular Apps grundsätzlich beibehalte muss hier allerdings nicht wirklich etwas geändert werden. Im Anschluss können die Testfälle in folgender Struktur (beispielhaftes Testfile für einen Login-Controller) geschrieben werden.

define(['../../../../../lib/angularjs/angular.min', 'app', 'angular_mocks', 'controllers/Auth/Login'], function (angular, app, mocks, LoginCtrl) {
    'use strict';

    describe('LoginCtrl', function () {
        var scope, rootScope;

        beforeEach(module('app'));

        beforeEach(inject(function($rootScope, $controller) {
            rootScope = $rootScope;
            scope = $rootScope.$new();

            $controller('LoginCtrl', {
                '$scope': scope
            });
        }));

        describe('Functions should be defined', function () {
            // check if default values are set
            it('scope.login should be defined', function () {
                expect(scope.login).toBeDefined();
            });
        });

        describe('Variables should be defined', function () {
            it('scope.auth should be defined', function () {
                expect(scope.auth).toBeDefined();
            });

            it('scope.auth.username|scope.auth.username should be empty strings', function () {
                expect(scope.auth.username).toBe('');
                expect(scope.auth.password).toBe('');
            });
        });
    });
});
Abgelegt werden die Testfiles innerhalb des app-Ordners in einem eigenen Verzeichnis /spec. In diesem befinden sich wiederum zwei Verzeichnisse für die beiden verschiedenen Testarten (unit & e2e). Innerhalb Dieser wird dann die allgemeine Struktur des Projektes beibehalten, also bspw. für die Login-Controller Testfälle /controller/Authentication/Login.js Das Ausführen der Tests läuft dann über die Linux bash mit Hilfe des Befehls

karma start karma.conf.js
Wahlweise kann auch der entsprechende Grunt-Task ausgeführt werden

grunt karma
 

E2E-Tests

Für die Oberflächentests wird das Framework Protractor verwendet. Alle notwendigen Node Module wurden beim npm install bereits mitinstalliert. Das Einzige was noch fehlt, ist der Standalone-Selenium-Server. Dieser wird über den Befehl

./node_modules/protractor/bin/webdriver-manager update
auf der Linux bash in das entsprechende Verzeichnis geladen. Im Anschluss muss wiederum je nach Betriebssystem auf welchem man testen möchte, die protractor.conf.js für Linux bzw. protractor.winconf.js für Windows bearbeitet werden. Hier werden jeweils der Pfad zur Datei des Selenium-Servers, die entsprechenden Dateien mit den Testfällen, sowie die zu verwendenden Browser angegeben. Auch hier muss bei gleichbleibender Projektstruktur wieder nichts geändert werden. Nachfolgend kann wieder mit dem Schreiben der Testfälle begonnen werden.

describe('Login', function () {

    beforeEach (function() {
        browser.get('http://192.168.56.101/dev/23_angularjs/23_angularjs__lostfind__app/index.html#/start');
    });

    it('click "Gefunden", fill in login info and click login', function () {
        element(by.id('button-add')).click();
        element(by.model('auth.username')).sendKeys('testuser@test.com');
        element(by.model('auth.password')).sendKeys('flyuser');
        element(by.id('login')).click();
    });
});
Das Ausführen der Tests unter Linux über PhantomJS wird dann über den Befehl

grunt shell:e2e
auf der Linux-Konsole gestartet. Unter Windows können die Tests über den Befehl

grunt shell:e2eWin
über den Chrome Browser ausgeführt werden.