'use strict';

(function (angular) {


    var DiagnosticConst = {
        examId: 13,
        time: 84000,
        subjects: [
            {
                subjectId: 0,
                name: 'Math',
                shortName: 'math',
                intro: {
                   text: '<p>The following questions cover all 3 subjects and will allow us to calculate your initial score estimate and your training roadmap.</p>',
                   label: 'Let\'s start with <p> <span>5</span> Math questions. </p>',
                   short: 'M'
                }
            },
            {
                subjectId: 1,
                name: 'Reading',
                shortName: 'read',
                intro: {
                   text: '<p>Awesome! You\'re only 2 subjects away from getting your initial score estimate.</p>',
                   label: 'Let\'s continue with the Reading questions. ',
                   short: 'R'
                }
            },
            {
                subjectId: 2,
                name: 'Writing',
                shortName: 'write',
                intro: {
                    text: '<p>Almost done! You\'re only 1 subject away from getting your initial score estimate.</p>',
                    label: 'Let\'s finish with the Writing questions.',
                    short: 'W'
                }
            }
        ]
     };

    angular.module('znk.diagnostic').constant('DiagnosticConst', DiagnosticConst);


})(angular);
