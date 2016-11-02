angular.module('htmlTemplates', ['znk/auth/templates/changePassword.html', 'znk/auth/templates/facebookBtnDrv.html', 'znk/auth/templates/forgotPassword.html', 'znk/auth/templates/login.html', 'znk/auth/templates/signup.html', 'znk/auth/templates/welcome.html', 'znk/diagnostic/templates/exercise.html', 'znk/diagnostic/templates/intro.html', 'znk/diagnostic/templates/summary.html', 'znk/diagnostic/templates/summaryIntro.html', 'znk/exam/templates/examPage.html', 'znk/exercise/templates/articleDrv.html', 'znk/exercise/templates/blackboardDrv.html', 'znk/exercise/templates/calculator.html', 'znk/exercise/templates/calculatorModal.html', 'znk/exercise/templates/drillExercise.html', 'znk/exercise/templates/examExercise.html', 'znk/exercise/templates/freeTextAnswerDrv.html', 'znk/exercise/templates/freeTextAnswerGridDrv.html', 'znk/exercise/templates/gameExercise.html', 'znk/exercise/templates/gameIntro.html', 'znk/exercise/templates/loadingTemplate.html', 'znk/exercise/templates/practiceExercise.html', 'znk/exercise/templates/practiceInstructions.html', 'znk/exercise/templates/practiceIntro.html', 'znk/exercise/templates/questionDrv.html', 'znk/exercise/templates/selectAnswerDrv.html', 'znk/exercise/templates/summary.html', 'znk/exercise/templates/timeProgressBarDrv.html', 'znk/exercise/templates/tutorialExercise.html', 'znk/exercise/templates/tutorialIntro.html', 'znk/exercise/templates/tutorialIntroModal.html', 'znk/exercise/templates/znkExerciseDrv.html', 'znk/exercise/templates/znkExercisePagerDrv.html', 'znk/exercise/templates/znkExerciseToolBoxModal.html', 'znk/flashcard/templates/flashcardItemDrv.html', 'znk/flashcard/templates/flashcardsModal.html', 'znk/gamification/templates/gamification.html', 'znk/gamification/templates/gamificationXpLineDrv.html', 'znk/home/templates/dailyDetailsModal.html', 'znk/home/templates/freeDailiesEndedModal.html', 'znk/home/templates/home.html', 'znk/home/templates/homeBonusSkillsDetailsModal.html', 'znk/home/templates/homeBonusSkillsItemDrv.html', 'znk/home/templates/homeDailyItemDrv.html', 'znk/home/templates/homeExamItemDrv.html', 'znk/home/templates/homePathDrv.html', 'znk/home/templates/homePathItemTemplate.html', 'znk/home/templates/svgPathMobile.html', 'znk/home/templates/svgPathTablet.html', 'znk/performance/templates/performance.html', 'znk/settings/templates/aboutUs.html', 'znk/settings/templates/faq.html', 'znk/settings/templates/privacyPolicy.html', 'znk/settings/templates/settings.html', 'znk/settings/templates/support.html', 'znk/settings/templates/termsOfUse.html', 'znk/system/shared/templates/baseVideoTourHintModal.html', 'znk/system/shared/templates/estimatedScoreDrv.html', 'znk/system/shared/templates/facebookShareBtn.html', 'znk/system/shared/templates/gamificationProgressDrv.html', 'znk/system/shared/templates/iapModal.html', 'znk/system/shared/templates/materLevelModal.html', 'znk/system/shared/templates/selectDrv.html', 'znk/system/shared/templates/spinnerModal.html', 'znk/system/shared/templates/testSlideDrv.html', 'znk/system/shared/templates/transparentCircleDrv.html', 'znk/system/shared/templates/transparentCircleHintModal.html', 'znk/system/shared/templates/transparentCircleModal.html', 'znk/system/shared/templates/upgradeMessageModal.html', 'znk/system/shared/templates/videoActivationButton.html', 'znk/system/shared/templates/writtenSlnHintModal.html', 'znk/system/shared/templates/writtenSolutionModal.html', 'znk/system/shared/templates/znkProgressDrv.html', 'znk/userProfile/templates/profile.html']);

angular.module("znk/auth/templates/changePassword.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/auth/templates/changePassword.html",
    "<ion-view class=\"change-password\" keyboard-drv>\n" +
    "    <ion-header-bar class=\"znk-header level1\"\n" +
    "                    no-tap-scroll=\"true\">\n" +
    "        <div class=\"buttons\">\n" +
    "            <znk-back-button></znk-back-button>\n" +
    "        </div>\n" +
    "        <div class=\"title\">\n" +
    "            <span class=\"znk-title\">Change Password</span>\n" +
    "        </div>\n" +
    "        <div class=\"buttons\">\n" +
    "            <div class=\"save-btn-wrapper\">\n" +
    "                <span class=\"save-btn only-mobile\" ng-click=\"d.onClickDone()\">Save</span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </ion-header-bar>\n" +
    "    <ion-content class=\"has-header change-password\">\n" +
    "        <div class=\"change-password-lg only-tablet\">\n" +
    "            <form name=\"d.changePasswordForm\" novalidate ng-submit=\"d.onClickDone()\">\n" +
    "                <div class=\"main-box\">\n" +
    "                    <div class=\"key-image\"></div>\n" +
    "                    <p>Change Password</p>\n" +
    "                    <div class=\"input-wrapper\">\n" +
    "                        <div class=\"row\">\n" +
    "                            <div class=\"col col-33\">\n" +
    "                                <span class=\"title\">CURRENT PASSWORD</span>\n" +
    "                            </div>\n" +
    "                            <div class=\"col col-67\">\n" +
    "                                <input type=\"password\"  type=\"text\" placeholder=\"Enter your current password\" id=\"currentPassword\" ng-model=\"d.currentPassword\" ng-pattern=\"d.passwordPattern\" required autocomplete=\"off\">\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"row\">\n" +
    "                            <div class=\"col col-33\">\n" +
    "                                <span class=\"title\">NEW PASSWORD</span>\n" +
    "                            </div>\n" +
    "                            <div class=\"col col-67\">\n" +
    "                                <input type=\"password\" placeholder=\"Enter your new password\" id=\"newPassword\" ng-model=\"d.newPassword\" ng-pattern=\"d.passwordPattern\" required autocomplete=\"off\">\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"row\">\n" +
    "                            <div class=\"col col-33\">\n" +
    "                                <span class=\"title\">CONFIRM NEW PASSWORD</span>\n" +
    "                            </div>\n" +
    "                            <div class=\"col col-67\">\n" +
    "                                <input type=\"password\" placeholder=\"Confirm new password\" name=\"newPasswordConfirm\" ng-model=\"d.newPasswordConfirm\" ng-pattern=\"d.passwordPattern\" required autocomplete=\"off\">\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"row\">\n" +
    "                        <div class=\"col save-wrapper\">\n" +
    "                            <button fill-loader=\"d.fillLoader\" show-loader=\"d.startLoader\" in-elem-loader bg-loader=\"'#dcd8d3'\" precentage=\"50\" font-color=\"'#FFFFFF'\" bg=\"'#0a9bad'\" class=\"done-button button-round\" type=\"submit\" analytics-on=\"click\" analytics-event=\"click-done\" analytics-category=\"change-password\">\n" +
    "                                <span class=\"text\">DONE</span>\n" +
    "                            </button>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "            </form>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"change-password-md only-mobile\">\n" +
    "            <div class=\"key-image\"></div>\n" +
    "            <p>Change Password</p>\n" +
    "            <form name=\"d.changePasswordForm\" novalidate>\n" +
    "                <div class=\"password-wrapper\">\n" +
    "                    <div class=\"password-label current-password\">\n" +
    "                        CURRENT PASSWORD\n" +
    "                         <input placeholder=\"Enter your current password\" type=\"password\" class=\"password-input\" id=\"currentPassword\" ng-model=\"d.currentPassword\" ng-pattern=\"d.passwordPattern\" required autocomplete=\"off\">\n" +
    "                    </div>\n" +
    "                    <div class=\"password-label\">\n" +
    "                        NEW PASSWORD\n" +
    "                        <input placeholder=\"Enter your new password\" type=\"password\" class=\"password-input\" id=\"newPassword\" ng-model=\"d.newPassword\" ng-pattern=\"d.passwordPattern\" required autocomplete=\"off\">\n" +
    "                    </div>\n" +
    "                    <div class=\"password-label\">\n" +
    "                        CONFIRM NEW PASSWORD\n" +
    "                        <input placeholder=\"Confirm new password\" type=\"password\" class=\"password-input\" name=\"newPasswordConfirm\" ng-model=\"d.newPasswordConfirm\" ng-pattern=\"d.passwordPattern\" required autocomplete=\"off\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n" +
    "\n" +
    "");
}]);

angular.module("znk/auth/templates/facebookBtnDrv.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/auth/templates/facebookBtnDrv.html",
    "<div facebook-login-drv>\n" +
    "    <div class=\"input-row submit-row\">\n" +
    "        <div class=\"btn btn-submit btn-facebook\" ng-click=\"authenticatePlugin()\" fill-loader=\"fillLoader\" show-loader=\"startLoader\" in-elem-loader=\"\" bg-loader=\"'#1e4d7c'\"\n" +
    "             precentage=\"50\" font-color=\"'#FFFFFF'\" bg=\"'#336699'\" analytics-on=\"click\" analytics-event=\"click-sign-in-with-facebook\" analytics-category=\"login\">\n" +
    "            <i class=\"ion-social-facebook\"></i>\n" +
    "            Connect with Facebook\n" +
    "        </div>\n" +
    "        <div class=\"facebook-divider\">\n" +
    "            <div class=\"divider-text\">\n" +
    "                 or\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("znk/auth/templates/forgotPassword.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/auth/templates/forgotPassword.html",
    "<ion-view class=\"welcome-form\" keyboard-drv>\n" +
    "    <ion-content class=\" welcome-image-blur\" scroll=\"false\">\n" +
    "        <section class=\"form-container\">\n" +
    "            <div class=\"ion-ios-close-empty close-x\" ui-sref=\"welcome\" analytics-on=\"click\" analytics-event=\"click-close\" analytics-category=\"forgot-password\"></div>\n" +
    "\n" +
    "            <form class=\"action-form\" ng-submit=\"onClickDone()\" novalidate>\n" +
    "                <div class=\"title\">Reset Password</div>\n" +
    "                <div class=\"input-row\">\n" +
    "                    <input type=\"email\" class=\"welcome-form-item\" placeholder=\"{{email}}\" ng-model=\"forgotPasswordData.email\" ng-init=\"email='Email'\" ng-focus=\"email=''\" ng-blur=\"email='Email'\">\n" +
    "                </div>\n" +
    "                <div class=\"input-row submit-row\">\n" +
    "                    <button type=\"submit\" class=\"btn btn-submit\" fill-loader=\"fillLoader\" show-loader=\"startLoader\" in-elem-loader bg-loader=\"'#088190'\" precentage=\"50\" font-color=\"'#FFFFFF'\" bg=\"'#0a9bad'\" analytics-on=\"click\" analytics-event=\"click-send\" analytics-category=\"forgot-password\">Send</button>\n" +
    "                </div>\n" +
    "                <div class=\"submit-row-label\">\n" +
    "                    <button class=\"submit-label\" ui-sref=\"login\"><span class=\"ion-chevron-left\" analytics-on=\"click\" analytics-event=\"click-back-login\" analytics-category=\"forgot-password\"></span>Back to Login</button>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </section>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n" +
    "\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("znk/auth/templates/login.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/auth/templates/login.html",
    "<ion-view class=\"welcome-form\" keyboard-drv>\n" +
    "    <ion-content class=\" welcome-image-blur\" scroll=\"false\">\n" +
    "        <section class=\"form-container\">\n" +
    "            <div class=\"ion-ios-close-empty close-x\" ui-sref=\"welcome\" analytics-on=\"click\" analytics-event=\"click-close\" analytics-category=\"login\"></div>\n" +
    "\n" +
    "            <form class=\"action-form\" ng-submit=\"blurPwdInput();blurEmailInput()();onClickDone();\" novalidate>\n" +
    "                <div class=\"title\">Login</div>\n" +
    "                <facebook-btn-drv></facebook-btn-drv>\n" +
    "                  <div class=\"input-row\">\n" +
    "                    <input type=\"email\"\n" +
    "                           placeholder=\"{{email}}\"\n" +
    "                           ng-model=\"loginData.userNameOrEmail\"\n" +
    "                           ng-init=\"email='Email'\"\n" +
    "                           ng-focus=\"email=''\"\n" +
    "                           ng-blur=\"email='Email'\"\n" +
    "                           class=\"welcome-form-item\"\n" +
    "                           trigger-blur-drv=\"blurEmailInput\">\n" +
    "                </div>\n" +
    "                <div class=\"input-row\">\n" +
    "                    <input type=\"password\"\n" +
    "                           placeholder=\"{{pass}}\"\n" +
    "                           ng-model=\"loginData.password\"\n" +
    "                           ng-init=\"pass='Password'\"\n" +
    "                           ng-focus=\"pass=''\"\n" +
    "                           ng-blur=\"pass='Password'\"\n" +
    "                           class=\"welcome-form-item\"\n" +
    "                           trigger-blur-drv=\"blurPwdInput\">\n" +
    "                </div>\n" +
    "                <div class=\"input-row submit-row\">\n" +
    "                    <button type=\"submit\" ng-disabled=\"lockLoginBtn\" class=\"btn btn-submit\" fill-loader=\"fillLoader\" show-loader=\"startLoader\" in-elem-loader bg-loader=\"'#088190'\" precentage=\"50\" font-color=\"'#FFFFFF'\" bg=\"'#0a9bad'\" analytics-on=\"click\" analytics-event=\"click-sign-in\" analytics-category=\"login\">Sign in</button>\n" +
    "                </div>\n" +
    "                <div class=\"submit-row-label\">\n" +
    "                    <button class=\"submit-label\" ui-sref=\"forgotPassword\" analytics-on=\"click\" analytics-event=\"click-forgot-password\" analytics-category=\"login\">Forgot password?</button>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "            <div class=\"bottom-row\" ui-sref=\"signup\" analytics-on=\"click\" analytics-event=\"click-already-have-account\" analytics-category=\"login\">\n" +
    "                <label class=\"bottom-row-title-line\">Don't have an account?</label>\n" +
    "                <button class=\"bottom-login\">Sign Up</button>\n" +
    "            </div>\n" +
    "        </section>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n" +
    "\n" +
    "");
}]);

angular.module("znk/auth/templates/signup.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/auth/templates/signup.html",
    "<ion-view class=\"welcome-form\" keyboard-drv>\n" +
    "    <ion-content class=\"welcome-image-blur\" scroll=\"false\">\n" +
    "        <section class=\"form-container\">\n" +
    "            <div class=\"ion-ios-close-empty close-x\" ui-sref=\"welcome\" analytics-on=\"click\" analytics-event=\"click-close\" analytics-category=\"signup\"></div>\n" +
    "\n" +
    "            <form class=\"action-form\" ng-submit=\"blurNameInput();blurEmailInput();blurPwdInput();onClickDone()\" novalidate>\n" +
    "                <div class=\"title\">Sign Up</div>\n" +
    "                <facebook-btn-drv></facebook-btn-drv>\n" +
    "                <div class=\"input-row\">\n" +
    "                    <input type=\"text\"\n" +
    "                           placeholder=\"{{name}}\"\n" +
    "                           ng-model=\"registration.nickname\"\n" +
    "                           ng-init=\"name='Name'\"\n" +
    "                           ng-focus=\"name=''\"\n" +
    "                           ng-blur=\"name='Name'\"\n" +
    "                           class=\"welcome-form-item\"\n" +
    "                           trigger-blur-drv=\"blurNameInput\">\n" +
    "                </div>\n" +
    "                <div class=\"input-row\">\n" +
    "                    <input type=\"email\"\n" +
    "                           placeholder=\"{{email}}\"\n" +
    "                           ng-model=\"registration.email\"\n" +
    "                           ng-init=\"email='Email'\"\n" +
    "                           ng-focus=\"email=''\"\n" +
    "                           ng-blur=\"email='Email'\"\n" +
    "                           class=\"welcome-form-item\"\n" +
    "                           trigger-blur-drv=\"blurEmailInput\">\n" +
    "                </div>\n" +
    "                <div class=\"input-row\">\n" +
    "                    <input type=\"password\"\n" +
    "                           placeholder=\"{{pass}}\"\n" +
    "                           ng-model=\"registration.password\"\n" +
    "                           ng-init=\"pass='Password'\"\n" +
    "                           ng-focus=\"pass=''\"\n" +
    "                           ng-blur=\"pass='Password'\"\n" +
    "                           class=\"welcome-form-item\"\n" +
    "                           trigger-blur-drv=\"blurPwdInput\">\n" +
    "                </div>\n" +
    "                <div class=\"input-row submit-row\">\n" +
    "                    <button type=\"submit\" ng-disabled=\"lockSignUpBtn\" class=\"btn btn-submit\" fill-loader=\"fillLoader\" show-loader=\"startLoader\" in-elem-loader bg-loader=\"'#088190'\" precentage=\"50\" font-color=\"'#FFFFFF'\" bg=\"'#0a9bad'\" analytics-on=\"click\" analytics-event=\"click-register\" analytics-category=\"signup\">Register</button>\n" +
    "                </div>\n" +
    "                <div class=\"legal-text\">By signing up, you agree the\n" +
    "                    <a ui-sref=\"termsOfUse\">terms of use </a>and<a ui-sref=\"privacyPolicy\"> privacy policy</a>.\n" +
    "                </div>\n" +
    "            </form>\n" +
    "            <div class=\"bottom-row\" ui-sref=\"login\" analytics-on=\"click\" analytics-event=\"click-already-have-account\" analytics-category=\"signup\">\n" +
    "                <label class=\"bottom-row-title-line\">Already have a Zinkerz account?</label>\n" +
    "                <button class=\"bottom-login\">Login</button>\n" +
    "            </div>\n" +
    "        </section>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n" +
    "\n" +
    "");
}]);

angular.module("znk/auth/templates/welcome.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/auth/templates/welcome.html",
    "<ion-view class=\"welcome-Page\">\n" +
    "    <ion-content class=\"welcome-image\" scroll=\"false\">\n" +
    "        <div class=\"video-wrapper\">\n" +
    "            <video webkit-playsinline\n" +
    "                   loop\n" +
    "                   custom-autoplay\n" +
    "                   video-ctrl-drv\n" +
    "                   actions=\"d.videoActions\"\n" +
    "                   custom-poster=\"assets/videos/poster.png\"\n" +
    "                   video-height=\"fit\"\n" +
    "                   height-to-width-ratio=\"1.3333333\">\n" +
    "                <source src=\"assets/videos/welcome.mp4\" type=\"video/mp4\">\n" +
    "            </video>\n" +
    "        </div>\n" +
    "        <section class=\"welcome-container\" >\n" +
    "            <div class=\"zinkerz-logo\"></div>\n" +
    "            <div class=\"row welcome-title-row\">\n" +
    "                <div class=\"col\">\n" +
    "                    <h1 class=\"main-title\">Hey, welcome!</h1>\n" +
    "                    <h2 class=\"sub-title\">Get ready for your SAT with Zinkerz.</h2>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"row buttons-row\">\n" +
    "                <div class=\"col\">\n" +
    "                    <button class=\"btn\" ng-click=\"navigate('login')\" analytics-on=\"click\" analytics-event=\"click-login\" analytics-category=\"welcome\">Log In</button>\n" +
    "                    <button class=\"btn btn-outline\" ng-click=\"navigate('signup')\" analytics-on=\"click\" analytics-event=\"click-sign-up\" analytics-category=\"welcome\">Sign Up</button>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </section>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n" +
    "");
}]);

angular.module("znk/diagnostic/templates/exercise.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/diagnostic/templates/exercise.html",
    "<ion-view class=\"diagnostic-exercise\">\n" +
    "    <ion-header-bar class=\"znk-header\"\n" +
    "                    no-tap-scroll=\"true\"\n" +
    "                    subject-id-to-class-drv=\"::exercise.d.currentConst.subjectId\">\n" +
    "        <div class=\"buttons\">\n" +
    "            <div class=\"ion-ios-close-empty\" ng-click=\"exercise.goBack()\" analytics-on=\"click\" analytics-event=\"click-go-back\" analytics-category=\"diagnostic-exercise\"></div>\n" +
    "        </div>\n" +
    "        <div class=\"title\">\n" +
    "            <span class=\"znk-title\">\n" +
    "                {{::exercise.d.examName}}\n" +
    "            </span>\n" +
    "        </div>\n" +
    "    </ion-header-bar>\n" +
    "\n" +
    "    <ion-content scroll=\"false\">\n" +
    "        <div class=\"show-animation\"\n" +
    "             znk-exercise-drv\n" +
    "             ng-if=\"!exercise.d.hideExercise\"\n" +
    "             questions=\"exercise.d.questions\"\n" +
    "             ng-model=\"exercise.d.results\"\n" +
    "             settings=\"exercise.d.exerciseSettings\"\n" +
    "             actions=\"exercise.d.exerciseActions\"\n" +
    "             articles=\"exercise.d.groupData\",\n" +
    "             subject-id=\"exercise.d.subjectId\"\n" +
    "             es-exercise-time-drv>\n" +
    "        </div>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n" +
    "");
}]);

angular.module("znk/diagnostic/templates/intro.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/diagnostic/templates/intro.html",
    "<ion-view class=\"diagnostic-intro\">\n" +
    "    <ion-header-bar class=\"znk-header\"\n" +
    "                    no-tap-scroll=\"true\"\n" +
    "                    subject-id-to-class-drv=\"::intro.d.exam.sections[intro.d.subjectId].subjectId\">\n" +
    "        <div class=\"buttons\">\n" +
    "            <div class=\"ion-ios-close-empty\" ui-sref=\"app.home\" analytics-on=\"click\" analytics-event=\"click-go-back\" analytics-category=\"diagnostic-intro\"></div>\n" +
    "        </div>\n" +
    "        <div class=\"title\">\n" +
    "            <span class=\"znk-title\">\n" +
    "                {{::intro.d.exam.name}}\n" +
    "            </span>\n" +
    "        </div>\n" +
    "    </ion-header-bar>\n" +
    "    <ion-content>\n" +
    "         <div class=\"intro-container\">\n" +
    "              <div class=\"intro-text\" ng-bind-html=\"::intro.d.currentSubject.intro.text\"></div>\n" +
    "              <div class=\"intro-round-subject-box\">\n" +
    "                  <div class=\"intro-round-subject-item\" ng-repeat=\"item in ::intro.d.subjects\"\n" +
    "                       ng-class=\"[item.name, active = (item.subjectId === intro.d.currentSubject.subjectId) ? 'active' : '',\n" +
    "                       (intro.d.currentSubject.subjectId > 0 && intro.d.currentSubject.subjectId > item.subjectId && !active) ? 'done ion-ios-checkmark-empty' : '']\" >\n" +
    "                      {{::item.intro.short}}\n" +
    "                  </div>\n" +
    "              </div>\n" +
    "              <div class=\"intro-label\" ng-bind-html=\"::intro.d.currentSubject.intro.label | uppercase\"></div>\n" +
    "\n" +
    "             <button class=\"btn intro-start-btn\" ui-sref=\"app.diagnostic.exercise({ subjectId: intro.d.currentSubject.subjectId, questionId: 1})\" analytics-on=\"click\" analytics-event=\"click-start-intro\" analytics-category=\"diagnostic-intro\">START</button>\n" +
    "         </div>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n" +
    "");
}]);

angular.module("znk/diagnostic/templates/summary.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/diagnostic/templates/summary.html",
    "<div class=\"diagnostic-summary\">\n" +
    "    <ion-content scroll=\"d.isMobile\" scrollbar-y=\"false\">\n" +
    "        <div class=\"container\">\n" +
    "            <div class=\"title-row\">\n" +
    "                <div>Your initial score estimate</div>\n" +
    "            </div>\n" +
    "            <div class=\"xp-score-row\" ng-if=\"d.xpPoints\">\n" +
    "                <div class=\"xp-score\">\n" +
    "                    <div class=\"score\">+{{::d.xpPoints}} xp</div>\n" +
    "                    <div class=\"title\">test completion</div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"subject-score-row\">\n" +
    "                <div class=\"subject-score-box\">\n" +
    "                    <div class=\"title\">MATHEMATHICS</div>\n" +
    "                    <div class=\"gauge-wrap\">\n" +
    "                        <div class=\"subject-score\">{{::d.estimatedScore.math.min | number : 0}}-{{::d.estimatedScore.math.max | number : 0}}</div>\n" +
    "                        <div round-progress\n" +
    "                             max=800\n" +
    "                             current=d.estimatedScore.math.score\n" +
    "                             color=\"#75cbe8\"\n" +
    "                             bgcolor=\"#eaeaea\"\n" +
    "                             radius={{d.gauge.radius}}\n" +
    "                             stroke={{d.gauge.stroke}}\n" +
    "                             semi=\"false\"\n" +
    "                             rounded=\"false\"\n" +
    "                             iterations=\"1\">\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"subject-score-box\">\n" +
    "                    <div class=\"title\">READING</div>\n" +
    "                    <div class=\"gauge-wrap\">\n" +
    "                        <div class=\"subject-score\">{{::d.estimatedScore.read.min | number : 0}}-{{::d.estimatedScore.read.max | number : 0}}</div>\n" +
    "                        <div round-progress\n" +
    "                             max=800\n" +
    "                             current=d.estimatedScore.read.score\n" +
    "                             color=\"#f9d41b\"\n" +
    "                             bgcolor=\"#eaeaea\"\n" +
    "                             radius={{d.gauge.radius}}\n" +
    "                             stroke={{d.gauge.stroke}}\n" +
    "                             semi=\"false\"\n" +
    "                             rounded=\"false\"\n" +
    "                             iterations=\"1\"></div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"subject-score-box\">\n" +
    "                    <div class=\"title\">WRITING</div>\n" +
    "                    <div class=\"gauge-wrap\">\n" +
    "                        <div class=\"subject-score\">{{::d.estimatedScore.write.min | number : 0}}-{{::d.estimatedScore.write.max | number : 0}}</div>\n" +
    "                        <div round-progress\n" +
    "                             max=800\n" +
    "                             current=d.estimatedScore.write.score\n" +
    "                             color=\"#ff5895\"\n" +
    "                             bgcolor=\"#eaeaea\"\n" +
    "                             radius={{d.gauge.radius}}\n" +
    "                             stroke={{d.gauge.stroke}}\n" +
    "                             semi=\"false\"\n" +
    "                             rounded=\"false\"\n" +
    "                             iterations=\"1\"></div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"total-score-row\">\n" +
    "                <div class=\"total-score\">\n" +
    "                    Total: <div class=\"score\">{{::d.estimatedScore.total.min | number: 0}} - {{::d.estimatedScore.total.max | number: 0}}</div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"summary-bottom-text\">\n" +
    "                <div ng-if=\"d.estimatedScore.total.avg <= 1450\">\n" +
    "                    <div>Good effort!</div>\n" +
    "                    <div>Your total score is a little below average.</div>\n" +
    "                </div>\n" +
    "                <div ng-if=\"d.estimatedScore.total.avg > 1450 && d.estimatedScore.total.avg < 1550\">\n" +
    "                    <div>Nice!</div>\n" +
    "                    <div>Your total score is about average.</div>\n" +
    "                </div>\n" +
    "                <div ng-if=\"d.estimatedScore.total.avg >= 1550\">\n" +
    "                    <div>Well done!</div>\n" +
    "                    <div>Your total score is above average.</div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </ion-content>\n" +
    "    <div class=\"row summary-bottom-row\">\n" +
    "        <div class=\"col\">\n" +
    "            <button class=\"btn\" ui-sref=\"app.home\" analytics-on=\"click\" analytics-event=\"click-go-back\" analytics-category=\"diagnostic-summary\">DONE</button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("znk/diagnostic/templates/summaryIntro.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/diagnostic/templates/summaryIntro.html",
    "<div class=\"loading-diagnostic-summary\">\n" +
    "    <div class=\"intro-sub-title\">\n" +
    "        <div>Ready to get your</div>\n" +
    "        <div>initial score estimate?</div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"video-wrapper video-white-bg\">\n" +
    "    <video autoplay\n" +
    "           loop\n" +
    "           webkit-playsinline\n" +
    "           preload=\"auto\"\n" +
    "           video-ctrl-drv\n" +
    "           video-height=\"fit\"\n" +
    "           poster=\"assets/img/bg/diagnostic-summary-intro.png\"\n" +
    "           height-to-width-ratio=\"d.isMobile ? 1.7777778 : 1.333333333\">\n" +
    "        <source src=\"assets/videos/diagnostic-summary-intro.mp4\" type=\"video/mp4\">\n" +
    "    </video>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("znk/exam/templates/examPage.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/exam/templates/examPage.html",
    "<ion-view class=\"exam-Page-test\">\n" +
    "\n" +
    "    <ion-header-bar class=\"znk-header\" no-tap-scroll=\"true\">\n" +
    "\n" +
    "        <div class=\"buttons\">\n" +
    "            <div class=\"ion-ios-close-empty\" ng-click=\"goBack()\" ng-hide=\"d.isSummaryVisible()\" analytics-on=\"click\" analytics-event=\"click-go-back\" analytics-category=\"tutorial-exercise\"></div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div test-slide-drv exam-id=\"d.examInfo.examId\" diagnostic=\"d.examInfo.diagnosticObj\" on-change-triangle-pos=\"onChangeTrianglePos(left)\"\n" +
    "             on-popup-exam-disable=\"onPopupExamDisable(type)\" on-change-exam=\"onChangeExam(exam)\">\n" +
    "            <div class=\"exam-triangle\" ng-style=\"{ 'transform' : triangle.left, '-webkit-transform':triangle.left,  'display': triangle.display}\"></div>\n" +
    "        </div>\n" +
    "    </ion-header-bar>\n" +
    "\n" +
    "\n" +
    "    <ion-view class=\"exam-Page\">\n" +
    "        <ion-content scroll=\"d.isMobile\" ng-class=\"{ 'exam-isPopup' : d.openPopup }\" class=\"exam-container ng-hide show-animation\" scrollbar-y=\"false\" ng-show=\"d.examReady\" ng-switch on=\"::d.isMobile\">\n" +
    "            <div class=\"exam-popup\" ng-show=\"d.openPopup\">\n" +
    "                <span>{{::d.openPopup}}</span>\n" +
    "            </div>\n" +
    "            <div ng-show=\"d.facebookShare\">\n" +
    "                <facebook-share-btn options=\"{link: d.facebookShare.link, description: d.facebookShare.description, picture: d.facebookShare.picture}\" >\n" +
    "                    <i ng-class=\"d.facebookShare.className\"></i>\n" +
    "                </facebook-share-btn>\n" +
    "            </div>\n" +
    "            <section class=\"exam-container-lg\" ng-switch-when=\"false\">\n" +
    "                <div class=\"exam-score\">Total Score: {{d.generalScores.score ?  d.generalScores.score : \"-\"}}</div>\n" +
    "                <div class=\"row main-row\">\n" +
    "                    <div class=\"row-col\"\n" +
    "                         ng-repeat=\"subject in subjects\"\n" +
    "                         ng-class=\"{\n" +
    "                        'math' : subject.id===0,\n" +
    "                        'read' : subject.id===1,\n" +
    "                        'write' : subject.id===2}\">\n" +
    "                        <div class=\"subject-name\">\n" +
    "                            {{::subject.name}}\n" +
    "                            <div class=\"subject-score\" ng-class=\"{ 'animate-score' : d.animateScore}\" ng-if=\"d.generalScores.subjectScores[subject.id]\">\n" +
    "                                Score: {{d.generalScores.subjectScores[subject.id]}}\n" +
    "                                <span>Avg time: {{d.avgTimeToDate(subject.id)}}</span>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div ng-repeat=\"sectionData in d.sectionsData | filter: {subjectId : subject.id}\"\n" +
    "                             class=\"subject-box\"\n" +
    "                             ui-sref=\"app.exam({id: examId, sectionId: sectionData.id, showCountdown: !sectionData.isComplete})\"\n" +
    "                             subscription-lock-drv\n" +
    "                             ng-class=\"{'completed-bg' : sectionData.isComplete, 'progress-bg' : !sectionData.isComplete && sectionData.isStarted, 'is-mocking' : sectionData.isMocking }\"\n" +
    "                             ng-disabled=\"!d.hasSubscription && !sectionData.isFree\">\n" +
    "                            <div ng-class=\"{'complete' : sectionData.isComplete,\n" +
    "                                        'section-title': d.hasSubscription || sectionData.isFree,\n" +
    "                                        'lock-card' : !d.hasSubscription && !sectionData.isFree }\">\n" +
    "                                <i class=\"ion-ios-locked\"></i>\n" +
    "                            </div>\n" +
    "                            <div class=\"section-body\">\n" +
    "                                <div class=\"row question-count\">\n" +
    "                                    <span>Questions:</span>\n" +
    "                                    <span class=\"count\">{{::sectionData.questionsCount}}</span>\n" +
    "                                </div>\n" +
    "                                <div class=\"row\" ng-show=\"!sectionData.isComplete && sectionData.isStarted\">\n" +
    "                                    <div class=\"progress-wrap\">\n" +
    "                                        <div class=\"progress\" ng-style=\"{width: ((sectionData.answeredCount * 100 )/sectionData.questionsCount) + '%'}\"></div>\n" +
    "                                        <div class=\"answer-count\">{{sectionData.answeredCount}}</div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <div class=\"row score-correct\" ng-show=\"sectionData.isComplete\">\n" +
    "                                    <div class=\"section-correct\">\n" +
    "                                        <div class=\"answer-count\">{{::sectionData.correctAnswersCount}}</div>\n" +
    "                                        correct\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <div class=\"row score-row\" ng-show=\"sectionData.isComplete\">\n" +
    "                                    <div class=\"section-score\">\n" +
    "                                        Score: <span>{{sectionData.score}}</span>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <div class=\"section-time\" ng-show=\"!sectionData.isComplete || !sectionData.isComplete && sectionData.isStarted\">\n" +
    "                                    <div class=\"clock start\">\n" +
    "                                        <i class=\"ion-ios-clock-outline\"></i>\n" +
    "                                        <div class=\"practice-time\">{{ sectionData.isStarted ?  sectionData.timeLeft : sectionData.time / 1000 / 60}} min</div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </section>\n" +
    "            <section class=\"exam-container-md\"  ng-switch-when=\"true\">\n" +
    "\n" +
    "                <div class=\"exam-score\">Total Score: {{d.generalScores.score ?  d.generalScores.score : \"-\"}}</div>\n" +
    "                <v-accordion class=\"vAccordion--default\" control=\"d.accordion\" multiple >\n" +
    "                    <div ng-repeat=\"subject in subjects\">\n" +
    "                        <v-pane>\n" +
    "                            <v-pane-header>\n" +
    "                                <div class=\"subject-color\" ng-class=\"{'math-pattern-bg': subject.id===0,'reading-pattern-bg':subject.id===1,'writing-pattern-bg':subject.id===2, 'subject-color-active': !subjects[subject.id].score}\"></div>\n" +
    "                                <div class=\"row-div subject-name\" ng-class=\"{'subject-name-done': subjects[subject.id].score}\">\n" +
    "                                    {{::subject.name}}\n" +
    "                                    <div class=\"subject-score\" ng-class=\"{ 'animate-score' : d.animateScore}\" ng-if=\"d.generalScores.subjectScores[subject.id]\">\n" +
    "                                        Score: {{::d.generalScores.subjectScores[subject.id]}}\n" +
    "                                        <span>Avg time: {{d.avgTimeToDate(subject.id)}}</span>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </v-pane-header>\n" +
    "                            <v-pane-content>\n" +
    "                                <div class=\"section\" ng-repeat=\"sectionData in d.sectionsData | filter: {subjectId : subject.id}\"\n" +
    "                                     ng-class=\"{'completed' : sectionData.isComplete, 'started' : sectionData.isStarted}\"\n" +
    "                                     ui-sref=\"app.exam({id: examId, sectionId: sectionData.id, showCountdown: !sectionData.isComplete})\"\n" +
    "                                     subscription-lock-drv\n" +
    "                                     ng-disabled=\"!d.hasSubscription && !sectionData.isFree\">\n" +
    "                                    <div class=\"subject-color\" ng-class=\"{'math-pattern-bg': sectionData.subjectId===0,'reading-pattern-bg':sectionData.subjectId===1, 'writing-pattern-bg':sectionData.subjectId===2}\"></div>\n" +
    "                                <div class=\"ion-ios-locked\"></div>\n" +
    "                                    <div class=\"section-body\">\n" +
    "                                        <div class=\"question-count\">\n" +
    "                                            Questions: <span>{{sectionData.questionsCount}}</span>\n" +
    "                                        </div>\n" +
    "                                        <div class=\"score-correct\" ng-show=\"sectionData.isComplete\">\n" +
    "                                            <div class=\"section-correct\">\n" +
    "                                                <div class=\"answer-count\">{{::sectionData.correctAnswersCount}}</div>\n" +
    "                                                correct\n" +
    "                                            </div>\n" +
    "                                        </div>\n" +
    "                                        <div class=\"score\" ng-if=\"sectionData.isComplete\">Score : <span>{{sectionData.score}}</span></div>\n" +
    "                                        <div class=\"section-time-wrap\" ng-if=\"!sectionData.isComplete\">\n" +
    "                                            <i class=\"grey-cloack-icon\"></i>\n" +
    "                                            <span class=\"time\">{{ sectionData.isStarted ?  sectionData.timeLeft : sectionData.time / 1000 / 60}} min</span>\n" +
    "                                        </div>\n" +
    "                                        <div class=\"progress-row\">\n" +
    "                                            <div class=\"progress-wrap\" ng-if=\"!sectionData.isComplete && sectionData.isStarted\">\n" +
    "                                                <div class=\"progress\" ng-style=\"{width: ((sectionData.answeredCount * 100 )/sectionData.questionsCount) + '%'}\"></div>\n" +
    "                                                <div class=\"answer-count\">{{sectionData.answeredCount}}</div>\n" +
    "                                            </div>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </v-pane-content>\n" +
    "                        </v-pane>\n" +
    "                    </div>\n" +
    "                </v-accordion>\n" +
    "            </section>\n" +
    "        </ion-content>\n" +
    "    </ion-view>\n" +
    "\n" +
    "\n" +
    "</ion-view>\n" +
    "");
}]);

angular.module("znk/exercise/templates/articleDrv.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/exercise/templates/articleDrv.html",
    "<ion-scroll scrollbar-y=\"false\">\n" +
    "    <div class=\"article-line-numbers\"></div>\n" +
    "    <div class=\"article-content\"></div>\n" +
    "</ion-scroll>\n" +
    "");
}]);

angular.module("znk/exercise/templates/blackboardDrv.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/exercise/templates/blackboardDrv.html",
    "<div class=\"blackboard-drv\">\n" +
    "    <canvas id=\"canvas\"></canvas>\n" +
    "    <div class=\"btn btn-icon btn-close ion-ios-close-outline\" ng-click=\"close()\"></div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("znk/exercise/templates/calculator.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/exercise/templates/calculator.html",
    "<div class=\"calculator\" ng-class=\"{'top': calcTop, 'right': calcRight}\">\n" +
    "    <div class=\"row top-bar\">\n" +
    "        <div class=\"col arrows\">\n" +
    "            <div class=\"touch-area\" ng-click=\"calcTop = !calcTop\">\n" +
    "            <div class=\"up-down-button\">\n" +
    "                <div class=\"ion-arrow-up-b\"></div>\n" +
    "                <div class=\"ion-arrow-down-b\"></div>\n" +
    "            </div>\n" +
    "            </div>\n" +
    "            <div class=\"left-right-button\" ng-click=\"calcRight = !calcRight\">\n" +
    "                <div class=\"ion-arrow-right-b\"></div>\n" +
    "                <div class=\"ion-arrow-left-b\"></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col\">\n" +
    "            <div class=\"close-x\" ng-click=\"close()\" analytics-on=\"click\" analytics-event=\"click-calculator-close\" analytics-category=\"calculator\"></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"screen\">\n" +
    "        <div class=\"result\">{{result | expressionStyle }}</div>\n" +
    "        <div class=\"expression\">{{expression | expressionStyle}}</div>\n" +
    "        <div class=\"mem\">{{hasMemory() ? 'M' : ''}}</div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"button-grid\">\n" +
    "        <div class=\"row button-row-20\">\n" +
    "\n" +
    "            <div class=\"col calc-btn\">\n" +
    "                <div class=\"func-btn\" ng-click=\"onClickUndo()\">\n" +
    "                    <div class=\"ion-ios-arrow-thin-left\"></div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"col calc-btn\">\n" +
    "                <div class=\"func-btn\" ng-click=\"onClickClear()\">C</div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"col calc-btn\">\n" +
    "                <div class=\"func-btn\" ng-click=\"onClickOpenParen()\">(</div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"col calc-btn\">\n" +
    "                <div class=\"func-btn\" ng-click=\"onClickCloseParen()\">)</div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"col calc-btn\">\n" +
    "                <div class=\"func-btn\" ng-click=\"onClickSqrt()\">\n" +
    "                    <div class=\"ico-square-root\"></div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"row button-row-20\">\n" +
    "\n" +
    "            <div class=\"col calc-btn\">\n" +
    "                <div class=\"num-btn\" ng-click=\"onClickNum(7)\">7</div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"col calc-btn\">\n" +
    "                <div class=\"num-btn\" ng-click=\"onClickNum(8)\">8</div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"col calc-btn\">\n" +
    "                <div class=\"num-btn\" ng-click=\"onClickNum(9)\">9</div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"col calc-btn\">\n" +
    "                <div class=\"func-btn\" ng-click=\"onClickDivide()\">\n" +
    "                    <div class=\"ico-divide\"></div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"col calc-btn\">\n" +
    "                <div class=\"func-btn\" ng-click=\"onClickSqr()\">\n" +
    "                    <div class=\"ico-square\"></div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"row button-row-20\">\n" +
    "            <div class=\"col calc-btn\">\n" +
    "                <div class=\"num-btn\" ng-click=\"onClickNum(4)\">4</div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"col calc-btn\">\n" +
    "                <div class=\"num-btn\" ng-click=\"onClickNum(5)\">5</div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"col calc-btn\">\n" +
    "                <div class=\"num-btn\" ng-click=\"onClickNum(6)\">6</div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"col calc-btn\">\n" +
    "                <div class=\"func-btn\" ng-click=\"onClickMultiply()\">\n" +
    "                    <div class=\"ico-multiply\"></div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"col calc-btn\">\n" +
    "                <div class=\"func-btn\" ng-click=\"onClickInv()\">\n" +
    "                    <div class=\"ico-1devX\"></div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"row button-row-40\">\n" +
    "            <div class=\"col col-80\">\n" +
    "                <div class=\"row inside-row\">\n" +
    "                    <div class=\"col calc-btn\">\n" +
    "                        <div class=\"num-btn\" ng-click=\"onClickNum(1)\">1</div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"col calc-btn\">\n" +
    "                        <div class=\"num-btn\" ng-click=\"onClickNum(2)\">2</div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"col calc-btn\">\n" +
    "                        <div class=\"num-btn\" ng-click=\"onClickNum(3)\">3</div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"col calc-btn\">\n" +
    "                        <div class=\"func-btn minus\" ng-click=\"onClickSubtract()\">\n" +
    "                            <div class=\"ico-subtract\"></div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"row inside-row\">\n" +
    "                    <div class=\"col col-50 calc-btn\">\n" +
    "                        <div class=\"num-btn zero\" ng-click=\"onClickNum(0)\">0</div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"col col-25 calc-btn\">\n" +
    "                        <div class=\"num-btn dot\" ng-click=\"onClickDot()\">.</div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"col col-25 calc-btn\">\n" +
    "                        <div class=\"func-btn\" ng-click=\"onClickAdd()\">\n" +
    "                            <div class=\"ico-plus\"></div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"col col-20 calc-btn\">\n" +
    "                <div class=\"func-btn double-height-btn\" ng-click=\"onClickEqual()\" analytics-on=\"click\" analytics-event=\"click-calculator-equal\" analytics-category=\"calculator\">=</div>\n" +
    "            </div>\n" +
    "            ​\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("znk/exercise/templates/calculatorModal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/exercise/templates/calculatorModal.html",
    "<calculator close=\"close()\"></calculator>\n" +
    "\n" +
    "");
}]);

angular.module("znk/exercise/templates/drillExercise.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/exercise/templates/drillExercise.html",
    "<ion-view class=\"drill-exercise\" hide-nav-bar=\"true\">\n" +
    "    <ion-header-bar class=\"znk-header\"\n" +
    "                    no-tap-scroll=\"true\"\n" +
    "                    subject-id-to-class-drv=\"d.drill.subjectId\">\n" +
    "        <div class=\"buttons\">\n" +
    "            <div class=\"ion-ios-close-empty\" ng-click=\"goBack()\" ng-hide=\"d.isSummaryVisible()\" analytics-on=\"click\" analytics-event=\"click-go-back\" analytics-category=\"tutorial-exercise\"></div>\n" +
    "        </div>\n" +
    "        <div class=\"title\">\n" +
    "            <span class=\"znk-title\">\n" +
    "                <span class=\"only-tablet\">{{::d.drill.name}}</span>\n" +
    "                <span ng-hide=\"d.isSummaryVisible()\" class=\"only-mobile\">{{d.exerciseActions.currentSlide() + 1}} of {{::d.questions.length}}</span>\n" +
    "                <span ng-show=\"d.isSummaryVisible()\" class=\"only-mobile\">Workout {{::d.dailyOrder}}: {{::d.drill.name}}</span>\n" +
    "            </span>\n" +
    "        </div>\n" +
    "    </ion-header-bar>\n" +
    "    <ion-content scroll=\"false\">\n" +
    "        <div custom-ng-if-drv=\"d.questions && d.results\"\n" +
    "             bind-once=\"true\"\n" +
    "             znk-exercise-drv\n" +
    "             questions=\"d.questions\"\n" +
    "             ng-model=\"d.results\"\n" +
    "             settings=\"d.exerciseSettings\"\n" +
    "             actions=\"d.exerciseActions\"\n" +
    "             articles=\"d.groupData\"\n" +
    "             subject-id=\"d.drill.subjectId\"\n" +
    "             es-exercise-time-drv>\n" +
    "        </div>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n" +
    "");
}]);

angular.module("znk/exercise/templates/examExercise.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/exercise/templates/examExercise.html",
    "<ion-view>\n" +
    "    <ion-header-bar class=\"znk-header\"\n" +
    "                    no-tap-scroll=\"true\"\n" +
    "                    subject-id-to-class-drv=\"d.examSection.subjectId\">\n" +
    "        <div class=\"buttons\">\n" +
    "            <div class=\"ion-ios-close-empty\" ng-click=\"goBack()\" ng-hide=\"d.isSummaryVisible()\" analytics-on=\"click\" analytics-event=\"click-go-back\" analytics-category=\"tutorial-exercise\"></div>\n" +
    "        </div>\n" +
    "        <div class=\"title\">\n" +
    "            <span class=\"znk-title\">\n" +
    "                <span class=\"only-tablet\">{{::d.exam && d.examSection.order ? (d.exam.name + ': Section ' + d.examSection.order) : undefined}}</span>\n" +
    "                <span class=\"only-mobile\" ng-hide=\"d.isSummaryVisible()\">{{d.exerciseActions.currentSlide() + 1}} of {{::d.questions.length}}</span>\n" +
    "                <span class=\"only-mobile\" ng-show=\"d.isSummaryVisible()\">{{::d.exam.name}}</span>\n" +
    "            </span>\n" +
    "        </div>\n" +
    "        <div class=\"buttons\">\n" +
    "            <div class=\"timer-wrapper\" ng-hide=\"d.stopTimer\">\n" +
    "                <timer ng-model=\"d.sectionResult.duration\" is-count-down=\"true\" time-limit=\"d.examSection.time\"\n" +
    "                       play=\"!d.stopTimer\">\n" +
    "                </timer>\n" +
    "            </div>\n" +
    "            <button class=\"instruction-btn button-clear\" ng-click=\"showInstructions()\" analytics-on=\"click\" analytics-event=\"click-show-instructions\" analytics-category=\"exam-exercise\">\n" +
    "                <i class=\"questions-tutorial\"></i>\n" +
    "            </button>\n" +
    "        </div>\n" +
    "    </ion-header-bar>\n" +
    "\n" +
    "    <ion-content scroll=\"false\" ng-class=\"{'blur-question-area' : ui.showLearn}\">\n" +
    "        <div custom-ng-if-drv=\"d.questions && d.results\" bind-once=\"true\" znk-exercise-drv questions=\"d.questions\" ng-model=\"d.results\" settings=\"d.exerciseSettings\" actions=\"d.exerciseActions\" articles=\"d.groupData\" subject-id=\"d.examSection.subjectId\"></div>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("znk/exercise/templates/freeTextAnswerDrv.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/exercise/templates/freeTextAnswerDrv.html",
    "<div class=\"current-answer-wrapper show-hide-animation\" ng-if=\"::d.currentAnswer\">\n" +
    "    <label>Your Answer:</label>\n" +
    "    <span class=\"current-answer\">{{d.currentAnswer}}</span>\n" +
    "</div>\n" +
    "<div class=\"answer-wrapper\">\n" +
    "    <div class=\"answer-solution-icon-wrapper circle-with-icon\" ng-click=\"d.showSolution()\">\n" +
    "        <i class=\"answer-solution-icon only-tablet\"></i>\n" +
    "        <i class=\"answer-solution-white-icon only-mobile\"></i>\n" +
    "    </div>\n" +
    "    <free-text-answer-grid\n" +
    "        on-submit-btn=\"d.save()\"\n" +
    "        ng-model=\"d.answer\"\n" +
    "        ng-disabled=\"d.disableEdit\">\n" +
    "    </free-text-answer-grid>\n" +
    "    <i class=\"correct-answer-icon\"></i>\n" +
    "    <i class=\"ion-ios-close-empty\"></i>\n" +
    "</div>\n" +
    "<div class=\"question-correct-answer-wrapper\">\n" +
    "    <label>Correct Answer:</label>\n" +
    "    <span class=\"question-correct-answer\"></span>\n" +
    "</div>\n" +
    "");
}]);

angular.module("znk/exercise/templates/freeTextAnswerGridDrv.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/exercise/templates/freeTextAnswerGridDrv.html",
    "<div class=\"input-wrapper\">\n" +
    "    <div class=\"input-cell-wrapper\">\n" +
    "        <div class=\"input-cell\">{{d.numArr[0]}}</div>\n" +
    "    </div>\n" +
    "    <div class=\"input-cell-wrapper\">\n" +
    "        <div class=\"input-cell\">{{d.numArr[1]}}</div>\n" +
    "    </div>\n" +
    "    <div class=\"input-cell-wrapper\">\n" +
    "        <div class=\"input-cell\">{{d.numArr[2]}}</div>\n" +
    "    </div>\n" +
    "    <div class=\"input-cell-wrapper\">\n" +
    "        <div class=\"input-cell\">{{d.numArr[3]}}</div>\n" +
    "    </div>\n" +
    "    <div class=\"erase-wrapper\" ng-click=\"onClickErase()\">\n" +
    "        <i class=\"ion-backspace-outline\"></i>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"btn-wrapper\">\n" +
    "    <button class=\"btn\" ng-click=\"onClickChar(0)\">0</button>\n" +
    "    <button class=\"btn\" ng-click=\"onClickChar(1)\">1</button>\n" +
    "    <button class=\"btn\" ng-click=\"onClickChar(2)\">2</button>\n" +
    "    <button class=\"btn\" ng-click=\"onClickChar(3)\">3</button>\n" +
    "    <button class=\"btn edge-btn\" ng-click=\"onClickChar(4)\">4</button>\n" +
    "    <button class=\"btn\" ng-click=\"onClickChar(5)\">5</button>\n" +
    "    <button class=\"btn\" ng-click=\"onClickChar(6)\">6</button>\n" +
    "    <button class=\"btn\" ng-click=\"onClickChar(7)\">7</button>\n" +
    "    <button class=\"btn\" ng-click=\"onClickChar(8)\">8</button>\n" +
    "    <button class=\"btn edge-btn\" ng-click=\"onClickChar(9)\">9</button>\n" +
    "    <button class=\"btn\" ng-click=\"onClickChar('.')\">.</button>\n" +
    "    <button class=\"btn\" ng-click=\"onClickChar('/')\">/</button>\n" +
    "    <button class=\"save-btn btn edge-btn\" ng-click=\"submitClick()\">submit</button>\n" +
    "</div>\n" +
    "");
}]);

angular.module("znk/exercise/templates/gameExercise.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/exercise/templates/gameExercise.html",
    "<ion-view class=\"game-exercise\">\n" +
    "    <ion-header-bar class=\"znk-header\"\n" +
    "                    no-tap-scroll=\"true\"\n" +
    "                    subject-id-to-class-drv=\"d.game.subjectId\">\n" +
    "        <div class=\"buttons\">\n" +
    "            <div class=\"ion-ios-close-empty\" ng-click=\"goBack()\" ng-hide=\"d.isSummaryVisible()\" analytics-on=\"click\" analytics-event=\"click-go-back\" analytics-category=\"tutorial-exercise\"></div>\n" +
    "        </div>\n" +
    "        <div class=\"title\">\n" +
    "            <span class=\"znk-title\">\n" +
    "                <span class=\"only-mobile\" ng-show=\"!d.isSummaryVisible() && !intro.show\">\n" +
    "                    {{d.exerciseActions.currentSlide() + 1}} of {{::d.questions.length}}\n" +
    "                </span>\n" +
    "                <span class=\"only-mobile\" ng-show=\"d.isSummaryVisible()\">\n" +
    "                    Workout {{::d.dailyOrder}}: {{::d.game.name}}\n" +
    "                </span>\n" +
    "                <span ng-if=\"::d.dailyOrder && d.game.name\">Workout {{::d.dailyOrder}}: {{::d.game.name}}</span>\n" +
    "            </span>\n" +
    "        </div>\n" +
    "    </ion-header-bar>\n" +
    "    <ion-content scroll=\"false\">\n" +
    "        <div time-progress-bar-drv\n" +
    "             ng-model=\"d.gameResult.gameDuration\"\n" +
    "             play=\"intro.visited && d.gameRules.hasTimeLimit\"\n" +
    "             length=\"d.gameRules.timeLimit\"\n" +
    "             ng-if=\"!d.gameResult.isComplete && d.gameRules.hasTimeLimit\"\n" +
    "             ng-show=\"!intro.show\">\n" +
    "        </div>\n" +
    "        <div custom-ng-if-drv=\"d.questions && d.results && d.groupData\"\n" +
    "             bind-once=\"true\"\n" +
    "             znk-exercise-drv\n" +
    "             questions=\"d.questions\"\n" +
    "             ng-model=\"d.results\"\n" +
    "             settings=\"d.exerciseSettings\"\n" +
    "             actions=\"d.exerciseActions\"\n" +
    "             articles=\"d.groupData\"\n" +
    "             subject-id=\"d.game.subjectId\"\n" +
    "             es-exercise-time-drv>\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-if=\"intro.show\">\n" +
    "            <game-intro type-id=\"intro.typeId\" category-id=\"d.categoryId\" questions-count=\"intro.questionsCount\" time-limit=\"intro.timeLimit\" time-to-add-on-correct=\"intro.timeToAddOnCorrect\" visited=\"d.gameResult.visitedIntro\" handle-close=\"intro.onClose()\" button-title=\"intro.buttonTitle\"></game-intro>\n" +
    "        </div>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n" +
    "");
}]);

angular.module("znk/exercise/templates/gameIntro.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/exercise/templates/gameIntro.html",
    "<ion-pane class=\"intro-Page\">\n" +
    "    <ion-content delegate-handle=\"game-intro\">\n" +
    "        <section class=\"intro-container game-intro\">\n" +
    "            <section class=\"speedRun\">\n" +
    "                <div class=\"header\">Based on your mastery level on {{::subjectName}}, we created this exercise to make you an expert in</div>\n" +
    "                <div class=\"category-name\">{{::categoryName}}</div>\n" +
    "                <div class=\"row svgIcon\">\n" +
    "                    <div ng-if=\"svgIcon\" ng-include=\"'assets/img/svg/icons/' + svgIcon \"></div>\n" +
    "                </div>\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"circle-wrap\">\n" +
    "\n" +
    "                        <div class=\"question-circle-wrapper\">\n" +
    "                            <div class=\"circle\">\n" +
    "                                <div class=\"circle-lable\">{{::questionsCount}}</div>\n" +
    "                            </div>\n" +
    "                        <div class=\"question-title\">Questions</div>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div class=\"total-time--circle-wrapper\">\n" +
    "                            <div class=\"circle\">\n" +
    "                                <div class=\"circle-lable\">{{::timeLimit | date:'m'}}</div>\n" +
    "                            </div>\n" +
    "                            <div class=\"total-time-title\">Minutes</div>\n" +
    "                        </div>\n" +
    "\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"intro-text\">\n" +
    "                        Let's see how well you manage your time.\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </section>\n" +
    "        </section>\n" +
    "    </ion-content>\n" +
    "    <div class=\"row game-intro-bottom\">\n" +
    "        <div class=\"col\">\n" +
    "            <button class=\"btn\" ng-click=\"handleClose()\" analytics-on=\"click\" analytics-event=\"click-start-game\"\n" +
    "                    analytics-category=\"game-intro\">START THE CHALLENGE\n" +
    "            </button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</ion-pane>\n" +
    "\n" +
    "");
}]);

angular.module("znk/exercise/templates/loadingTemplate.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/exercise/templates/loadingTemplate.html",
    "<ion-pane class=\"znk-loading\">\n" +
    "    <div class=\"top-half\">\n" +
    "        <div class=\"image-wrapper\">\n" +
    "            <div class=\"new-loading-raccoon\"></div>\n" +
    "            <div class=\"circle\">\n" +
    "                <div ng-show=\"d.countdown\" class=\"countdown\">{{d.countdown}}</div>\n" +
    "                <div ng-hide=\"d.countdown\" class=\"sand-clock\"></div>\n" +
    "            </div>\n" +
    "            <div class=\"row\">\n" +
    "                <h1>{{d.countdown ? 'Get Ready' : d.loadingText}}</h1>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "</ion-pane>\n" +
    "");
}]);

angular.module("znk/exercise/templates/practiceExercise.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/exercise/templates/practiceExercise.html",
    "<ion-view>\n" +
    "    <ion-header-bar class=\"znk-header\"\n" +
    "                    no-tap-scroll=\"true\"\n" +
    "                    subject-id-to-class-drv=\"d.practice.subjectId\">\n" +
    "        <div class=\"buttons\">\n" +
    "            <div class=\"ion-ios-close-empty\" ng-click=\"goBack()\" ng-hide=\"d.isSummaryVisible()\" analytics-on=\"click\" analytics-event=\"click-go-back\" analytics-category=\"tutorial-exercise\"></div>\n" +
    "        </div>\n" +
    "        <div class=\"title\">\n" +
    "            <span class=\"znk-title\">\n" +
    "                <span class=\"only-mobile\" ng-show=\"!d.isSummaryVisible() && !intro.show\">\n" +
    "                    {{d.exerciseActions.currentSlide() + 1}} of {{::d.questions.length}}\n" +
    "                </span>\n" +
    "                <span class=\"only-mobile\" ng-show=\"!d.isSummaryVisible() && intro.show\">\n" +
    "                    Workout {{::d.dailyOrder}}: {{::d.practice.name}}\n" +
    "                </span>\n" +
    "                <span class=\"only-tablet\" ng-if=\"::d.dailyOrder && d.practice.name\">Workout {{::d.dailyOrder}}: {{::d.practice.name}}</span>\n" +
    "            </span>\n" +
    "        </div>\n" +
    "    </ion-header-bar>\n" +
    "    <ion-content scroll=\"false\">\n" +
    "        <div custom-ng-if-drv=\"d.questions && d.results && d.groupData\" bind-once=\"true\" znk-exercise-drv questions=\"d.questions\" ng-model=\"d.results\" settings=\"d.exerciseSettings\" actions=\"d.exerciseActions\" articles=\"d.groupData\" subject-id=\"d.practice.subjectId\"></div>\n" +
    "\n" +
    "        <div ng-if=\"intro.show\">\n" +
    "            <practice-intro subject-id=\"intro.subjectId\" question-count=\"intro.questionCount\" visited=\"d.practiceResult.visitedIntro\" handle-close=\"intro.onClose()\" button-title=\"intro.buttonTitle\"></practice-intro>\n" +
    "        </div>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n" +
    "");
}]);

angular.module("znk/exercise/templates/practiceInstructions.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/exercise/templates/practiceInstructions.html",
    "<div class=\"instructions-popup\">\n" +
    "    <div class=\"instructions-header\"></div>\n" +
    "    <div compile=\"content\" bind-once=\"true\" class=\"instructions-markup\"></div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("znk/exercise/templates/practiceIntro.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/exercise/templates/practiceIntro.html",
    "<ion-pane class=\"intro-Page\">\n" +
    "    <div class=\"practice-intro\">\n" +
    "        <ion-content has-bouncing=\"false\" class=\"intro-container\" scrollbar-y=\"false\" style=\"text-align: center\">\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col\">\n" +
    "                    <h1>Exercise Your<br/><span compile=\"subjectName\" bind-once=\"true\"></span> Skills!</h1>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col\">\n" +
    "                    <h4>\n" +
    "                        This exercise contains <span compile=\"questionCount\" bind-once=\"true\"></span>\n" +
    "                        different types of <span compile=\"subjectName\"\n" +
    "                                                 bind-once=\"true\"></span><span> questions,</span><br/>\n" +
    "                        each designed to test your SAT readiness and determine<br> where you should focus your practice\n" +
    "                        time.\n" +
    "                    </h4>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col\">\n" +
    "                    <h4></h4>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col col-offset-15\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </ion-content>\n" +
    "\n" +
    "        <div class=\"row bottom-footer\">\n" +
    "            <div class=\"col\">\n" +
    "                <button class=\"btn\" ng-click=\"handleClose()\" analytics-on=\"click\" analytics-event=\"click-start-practice\"\n" +
    "                        analytics-category=\"practice-intro\">{{buttonTitle}}\n" +
    "                </button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</ion-pane>\n" +
    "");
}]);

angular.module("znk/exercise/templates/questionDrv.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/exercise/templates/questionDrv.html",
    "<div class=\"article-wrapper\"></div>\n" +
    "<div class=\"question-answers-wrapper\" question-height-control-drv>\n" +
    "    <ion-scroll direction=\"y\" scrollbar-y=\"false\" has-bouncing=\"false\" delegate-handle=\"question-scroll-{{::questionGetter().__index}}\">\n" +
    "        <div class=\"question-container\">\n" +
    "            <div compile=\"d.question.__index + 1\" bind-once=\"true\" class=\"num only-tablet\"></div>\n" +
    "            <div markup-drv markup=\"d.question.content\" type=\"lg\" class=\"question\"></div>\n" +
    "        </div>\n" +
    "        <div class=\"answers-container\">\n" +
    "            <div class=\"answers-wrapper\" answers-builder-drv></div>\n" +
    "        </div>\n" +
    "    </ion-scroll>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("znk/exercise/templates/selectAnswerDrv.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/exercise/templates/selectAnswerDrv.html",
    "<div ng-repeat=\"answer in d.answers track by answer.id\" class=\"answer\" ng-click=\"d.tap(answer)\">\n" +
    "    <div class=\"answer-solution-icon-wrapper\" ng-click=\"d.showSolution()\">\n" +
    "        <i class=\"answer-solution-icon only-tablet\"></i>\n" +
    "        <div class=\"circle-with-icon only-mobile\">\n" +
    "            <i class=\"answer-solution-white-icon\"></i>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"content-wrapper\">\n" +
    "        <div class=\"answer-index-wrapper\">\n" +
    "            <div class=\"answer-index\" compile=\"d.getCharIndex(answer)\" bind-once=\"true\"></div>\n" +
    "        </div>\n" +
    "        <div markup-drv markup=\"answer.content\" type=\"md\" class=\"content\"></div>\n" +
    "    </div>\n" +
    "    <div class=\"correct-answer-icon\"></div>\n" +
    "    <i class=\"ion-ios-close-empty\"></i>\n" +
    "</div>\n" +
    "");
}]);

angular.module("znk/exercise/templates/summary.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/exercise/templates/summary.html",
    "<div class=\"summary-Page\">\n" +
    "    <ion-content delegate-handle=\"mainScroll\" scroll=\"d.isMobile\" scrollbar-y=\"false\">\n" +
    "        <div class=\"container\">\n" +
    "            <div class=\"title-row\">\n" +
    "                My Results\n" +
    "            </div>\n" +
    "            <div class=\"xp-score-row\">\n" +
    "                <div class=\"xp-score ng-hide\" ng-show=\"injections.exerciseArgs.xpPoints\">\n" +
    "                    <div class=\"score\">+{{::injections.exerciseArgs.xpPoints}} xp</div>\n" +
    "                    <div class=\"title\">correct answers</div>\n" +
    "                </div>\n" +
    "                <div class=\"xp-score ng-hide\" ng-show=\"injections.exerciseArgs.isPerfect\">\n" +
    "                    <div class=\"score\">+{{::injections.exerciseArgs.perfectScore}} xp</div>\n" +
    "                    <div class=\"title\">perfection bonus</div>\n" +
    "                </div>\n" +
    "                <div class=\"xp-score ng-hide\" ng-show=\"injections.exerciseArgs.completeExp\">\n" +
    "                    <div class=\"score\">+{{::injections.exerciseArgs.completeExp.score}} xp</div>\n" +
    "                    <div class=\"title\">{{::injections.exerciseArgs.completeExp.text}}</div>\n" +
    "                </div>\n" +
    "                <div class=\"xp-score ng-hide\" ng-show=\"injections.exerciseArgs.isDailyCompleted\">\n" +
    "                    <div class=\"score\">+{{::injections.exerciseArgs.dailyCompleteScore}} xp</div>\n" +
    "                    <div class=\"title\">workout completion</div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"gauge-row\">\n" +
    "                <div class=\"gauge-wrap\">\n" +
    "                    <div class=\"gauge\">\n" +
    "                        <div class=\"gauge-inner-text\">\n" +
    "                            <div class=\"gauge-inner-text-wrap\">\n" +
    "                                <div class=\"gauge-val\">{{::d.summary.correct}}</div>\n" +
    "                                <div class=\"val-type\">Correct</div>\n" +
    "                                <div class=\"score ng-hide\" ng-show=\"injections.exerciseArgs.score\">Score: {{injections.exerciseArgs.score}}</div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <canvas id=\"doughnut\" class=\"chart chart-doughnut\" data=\"d.performenceChart.data\" labels=\"d.performenceChart.labels\" legend=\"false\"></canvas>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"statistics\">\n" +
    "                    <div class=\"stat-row\">\n" +
    "                        <div class=\"title\">Correct</div>\n" +
    "                        <div class=\"stat-val correct\">{{::d.summary.correct}}</div>\n" +
    "                        <div class=\"avg-score\">\n" +
    "                            <i class=\"ion-android-stopwatch\"></i>\n" +
    "                            <span class=\"time only-tablet\">Avg: </span><span>{{::(d.summary.avgCorrect / 1000) | number : 0}} sec</span>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"stat-row\">\n" +
    "                        <div class=\"title\">Wrong</div>\n" +
    "                        <div class=\"stat-val wrong\">{{::d.summary.wrong}}</div>\n" +
    "                        <div class=\"avg-score\">\n" +
    "                            <i class=\"ion-android-stopwatch\"></i>\n" +
    "                            <span class=\"time only-tablet\">Avg: </span><span>{{::(d.summary.avgWrong / 1000) | number : 0}} sec</span>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"stat-row\">\n" +
    "                        <div class=\"title\">Skipped</div>\n" +
    "                        <div class=\"stat-val skipped\">{{::d.summary.notAnswered}}</div>\n" +
    "                        <div class=\"avg-score\">\n" +
    "                            <i class=\"ion-android-stopwatch\"></i>\n" +
    "                            <span class=\"time only-tablet\">Avg: </span><span>{{::(d.summary.avgUnanswered / 1000) | number : 0}} sec</span>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"performance-timeline\"  ng-if=\"d.timeLineData.data.length > 0\">\n" +
    "                    <div class=\"title\">{{::d.timelineSubjectTitle}} Estimate Score Overtime</div>\n" +
    "                    <ion-scroll horizontal-scroll-fix=\"mainScroll\" delegate-handle=\"znk-timeline\" zooming=\"false\" scrollbar-x=\"false\" direction=\"x\" style=\"width: 100%\" class=\"performance-timeline-scroll\">\n" +
    "                        <canvas znk-timeline timeline-data=\"d.timeLineData\" timeline-settings=\"d.options\" ></canvas>\n" +
    "                        <div class=\"timeline-min-max\" ng-style=\"::d.timelineMinMaxStyle\">\n" +
    "                            {{ ::d.timelineMinMaxText }}\n" +
    "                            <div class=\"timeline-line\">{{ ::d.timelineLineText }}</div>\n" +
    "                            <div class=\"timeline-plus\" ng-if=\"d.timelineLinePlus\" ng-class=\"{ 'red-point': d.isRed, 'green-point': !d.isRed }\">{{ ::d.timelineLinePlus }}</div>\n" +
    "                        </div>\n" +
    "                    </ion-scroll>\n" +
    "                </div>\n" +
    "            <div class=\"proficiency-level-row\">\n" +
    "                <div class=\"proficiency-title-row\">\n" +
    "                    Proficiency Level\n" +
    "                </div>\n" +
    "                <div class=\"row data-row\" ng-class=\"{'single-category-row' : d.performanceData.singleSubjectCategory}\">\n" +
    "                    <div class=\"subject-level\">\n" +
    "                        <div class=\"subject-name\">{{d.subjectEnum[injections.subjectId].val}}</div>\n" +
    "                        <div class=\"subject-progress\">\n" +
    "                            <div class=\"progress\">\n" +
    "                                <div znk-progress-drv progress-width=\"{{d.performanceData[injections.subjectId].overall.value}}\" progress-value=\"\" show-progress-value=\"false\"></div>\n" +
    "                                <span class=\"title\">mastery</span>\n" +
    "                            </div>\n" +
    "                            <div class=\"progress-val\">\n" +
    "                                {{d.performanceData[injections.subjectId].overall.value}}%\n" +
    "                                <div class=\"progress-perfect\" ng-class=\"{'bad-score': d.subjectsDelta<0}\" ng-if=\"d.subjectsDelta != 0\">\n" +
    "                                    <span ng-if=\"d.subjectsDelta > 0\">+</span>\n" +
    "                                    {{d.subjectsDelta | number : 0}}\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"category-level-wrap\">\n" +
    "                        <div class=\"category-level\" ng-repeat=\"category in d.performanceData[injections.subjectId].category\">\n" +
    "                            <div class=\"icon-wrap\">\n" +
    "                                <div ng-if=\"d.categories[category.id].svgIcon\" ng-include=\"'assets/img/svg/icons/' + d.categories[category.id].svgIcon\" class=\"svg-icon\"></div>\n" +
    "                            </div>\n" +
    "                            <div class=\"category-data\">\n" +
    "                                <div>{{d.categories[category.id].categoryName | subString : d.categoryNameLen : false}} </div>\n" +
    "                                <div znk-progress-drv progress-width=\"{{category.levelProgress}}\" progress-value=\"\" show-progress-value=\"false\"></div>\n" +
    "                                <div class=\"level\">{{category.levelName}}</div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </ion-content>\n" +
    "    <div class=\"row summary-bottom-row\">\n" +
    "        <div class=\"col\">\n" +
    "            <button class=\"btn float-left\" ng-click=\"goToQuestion(0)\" analytics-on=\"click\" analytics-event=\"click-continue\" analytics-category=\"summary\">REVIEW</button>\n" +
    "        </div>\n" +
    "        <div class=\"col\">\n" +
    "            <button class=\"btn float-right\" ng-click=\"d.goBack();\"  analytics-on=\"click\" analytics-event=\"click-review\" analytics-category=\"summary\">DONE</button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("znk/exercise/templates/timeProgressBarDrv.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/exercise/templates/timeProgressBarDrv.html",
    "<div class=\"passed-time-bar\"></div>\n" +
    "<div class=\"mask\" ng-style=\"{left: d.left+'%', transition: d.animationDuration+'s'+' linear'+ ' left', '-webkit-transition': d.animationDuration+'s'+' linear'+ ' left'}\"></div>\n" +
    "");
}]);

angular.module("znk/exercise/templates/tutorialExercise.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/exercise/templates/tutorialExercise.html",
    "<ion-view>\n" +
    "    <ion-header-bar class=\"znk-header\"\n" +
    "                    no-tap-scroll=\"true\"\n" +
    "                    subject-id-to-class-drv=\"d.tutorial.subjectId\">\n" +
    "        <div class=\"buttons\">\n" +
    "            <div class=\"ion-ios-close-empty\" ng-click=\"goBack()\" ng-hide=\"d.isSummaryVisible()\" analytics-on=\"click\" analytics-event=\"click-go-back\" analytics-category=\"tutorial-exercise\"></div>\n" +
    "        </div>\n" +
    "        <div class=\"title\">\n" +
    "            <span class=\"znk-title\">\n" +
    "                <span class=\"only-mobile\" ng-show=\"!d.isSummaryVisible() && !intro.show\">{{d.exerciseActions.currentSlide() + 1}} of {{::d.questions.length}}</span>\n" +
    "                <span class=\"only-mobile\" ng-show=\"intro.show || d.isSummaryVisible()\">{{::d.headerBarTitle}}</span>\n" +
    "                <span class=\"only-tablet\">{{::d.headerBarTitle}}</span>\n" +
    "            </span>\n" +
    "        </div>\n" +
    "        <div class=\"buttons\">\n" +
    "            <button class=\"instruction-btn button-clear ng-hide\"\n" +
    "                    ng-hide=\"d.exerciseActions.hideInstructionsButton\"\n" +
    "                    ng-click=\"showIntro(true)\"\n" +
    "                    analytics-on=\"click\"\n" +
    "                    analytics-event=\"click-show-intro-tutorial\"\n" +
    "                    analytics-category=\"tutorial-exercise\">\n" +
    "                <i class=\"questions-tutorial\"></i>\n" +
    "            </button>\n" +
    "        </div>\n" +
    "    </ion-header-bar>\n" +
    "    <ion-content scroll=\"false\">\n" +
    "        <div custom-ng-if-drv=\"d.questions && d.results && d.groupData\"\n" +
    "             bind-once=\"true\"\n" +
    "             znk-exercise-drv\n" +
    "             questions=\"d.questions\"\n" +
    "             ng-model=\"d.results\"\n" +
    "             settings=\"d.exerciseSettings\"\n" +
    "             actions=\"d.exerciseActions\"\n" +
    "             articles=\"d.groupData\"\n" +
    "             subject-id=\"d.tutorial.subjectId\"\n" +
    "             es-exercise-time-drv>\n" +
    "        </div>\n" +
    "        <div ng-if=\"intro.show\">\n" +
    "            <tutorial-intro name=\"intro.name\" content-array=\"intro.content\" question-count=\"intro.questionCount\" visited=\"d.tutorialResult.visitedIntro\" handle-close=\"intro.onClose()\" button-title=\"intro.buttonTitle\" video-type=\"d.exerciseTypeId\" content-id=\"d.tutorial.id\"></tutorial-intro>\n" +
    "        </div>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n" +
    "");
}]);

angular.module("znk/exercise/templates/tutorialIntro.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/exercise/templates/tutorialIntro.html",
    "<ion-pane class=\"intro-Page\">\n" +
    "    <ion-content has-bouncing=\"false\" class=\"intro-container\" scrollbar-y=\"false\">\n" +
    "        <div class=\"video-container\">\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col\">\n" +
    "                    <video-activation-button-drv data-video-type=\"videoType\" data-content-id=\"contentId\" />\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div ng-repeat=\"slide in contentArray track by $index\">\n" +
    "            <div class=\"slide\">\n" +
    "                <div class=\"slide-header-icon\" ng-show=\"slide.example\"></div>\n" +
    "                <div compile=\"slide.title\"></div>\n" +
    "                <div markup=\"slide.body\" markup-drv></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </ion-content>\n" +
    "    <div class=\"row intro-bottom-row\">\n" +
    "        <div class=\"col\">\n" +
    "            <button class=\"btn\" ng-click=\"handleClose()\" analytics-on=\"click\" analytics-event=\"click-start-tutorial\" analytics-category=\"tutorial-intro\">{{::buttonTitle}}</button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</ion-pane>\n" +
    "");
}]);

angular.module("znk/exercise/templates/tutorialIntroModal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/exercise/templates/tutorialIntroModal.html",
    "<ion-pane class=\"intro-Page\">\n" +
    "    <div class=\"instructions-close-icon in-popup-close\" ng-click=\"data.close()\" analytics-on=\"click\" analytics-event=\"click-close\" analytics-category=\"tutorial-intro\"></div>\n" +
    "    <ion-content has-bouncing=\"false\" class=\"intro-container tutorial-intro\" scrollbar-y=\"false\">\n" +
    "        <div class=\"intro-name\">{{::data.name}}</div>\n" +
    "        <div class=\"video-container\">\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col\">\n" +
    "                    <video-activation-button-drv label=\"Video Tutorial\" data-video-type=\"data.videoType\" data-content-id=\"data.id\" />\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div ng-repeat=\"slide in data.content track by $index\">\n" +
    "            <div class=\"slide\">\n" +
    "                <div class=\"slide-header-icon\" ng-show=\"slide.example\"></div>\n" +
    "                <div compile=\"slide.title\"></div>\n" +
    "                <div markup=\"slide.body\" markup-drv></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </ion-content>\n" +
    "</ion-pane>\n" +
    "");
}]);

angular.module("znk/exercise/templates/znkExerciseDrv.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/exercise/templates/znkExerciseDrv.html",
    "<div questions-height-control-drv\n" +
    "     questions=\"d.questionsWithAnswers\">\n" +
    "    <div article-mask-control-drv\n" +
    "         questions=\"d.questionsWithAnswers\"\n" +
    "         active-slide=\"d.currentSlide\">\n" +
    "    </div>\n" +
    "    <ion-slide-box class=\"znk-carousel\"\n" +
    "                   show-pager=\"false\"\n" +
    "                   active-slide=\"d.currentSlide\">\n" +
    "        <div slide-repeat-drv=\"question in d.questionsWithAnswers\"\n" +
    "             active-slide=\"d.currentSlide\"\n" +
    "             question-drv\n" +
    "             question=\"question\"\n" +
    "             ng-model=\"question.__questionStatus.userAnswer\"\n" +
    "             ng-change=\"d.questionAnswered(question)\">\n" +
    "        </div>\n" +
    "    </ion-slide-box>\n" +
    "</div>\n" +
    "<div class=\"btn-section\">\n" +
    "    <div class=\"bookmark-icon-container only-tablet\" ng-class=\"d.questionsWithAnswers[d.currentSlide].__questionStatus.bookmark ? 'bookmark-active-icon' : 'bookmark-icon'\" ng-click=\"d.bookmarkCurrentQuestion()\" ng-hide=\"settings.viewMode === d.reviewModeId\" analytics-on=\"click\" analytics-event=\"click-bookmark-question\" analytics-category=\"exercise\"></div>\n" +
    "    <button class=\"btn\"\n" +
    "            ng-click=\"d.next()\"\n" +
    "            ng-hide=\"settings.viewMode === d.reviewModeId\"\n" +
    "            ng-disabled=\"d.isDisable\"\n" +
    "            ng-switch=\"d.currentSlide !== d.questionsWithAnswers.length - 1 && d.answeredCount !== d.questionsWithAnswers.length\"\n" +
    "            ng-class=\"[d.currentSlide !== d.questionsWithAnswers.length - 1 && d.answeredCount !== d.questionsWithAnswers.length ? 'next' : 'finish', d.isDisable ? 'disabled' : '']\">\n" +
    "            <div ng-switch-when=\"true\"\n" +
    "                 class=\"only-tablet\"\n" +
    "                 analytics-on=\"click\"\n" +
    "                 analytics-event=\"click-next\"\n" +
    "                 analytics-category=\"exercise\">\n" +
    "                <span>NEXT</span>\n" +
    "                <i class=\"question-arrow-right-icon\"></i>\n" +
    "            </div>\n" +
    "            <div ng-switch-when=\"false\"\n" +
    "                 analytics-on=\"click\"\n" +
    "                 analytics-event=\"click-finish\"\n" +
    "                 analytics-category=\"exercise\">DONE\n" +
    "            </div>\n" +
    "    </button>\n" +
    "    <button class=\"btn sum ng-hide\" ng-click=\"settings.onSummary()\" ng-show=\"settings.viewMode === d.reviewModeId\" analytics-on=\"click\" analytics-event=\"click-summary\" analytics-category=\"exercise\">SUMMARY</button>\n" +
    "</div>\n" +
    "<znk-exercise-pager\n" +
    "     ng-if=\"d.removePager\"\n" +
    "     ng-hide=\"d.hidePager\"\n" +
    "     questions=\"d.questionsWithAnswers\"\n" +
    "     ng-model=\"d.currentSlide\">\n" +
    "</znk-exercise-pager>\n" +
    "");
}]);

angular.module("znk/exercise/templates/znkExercisePagerDrv.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/exercise/templates/znkExercisePagerDrv.html",
    "<ion-scroll direction=\"x\" scrollbar-x=\"false\" delegate-handle=\"znk-pager\">\n" +
    "    <div class=\"pager-item question-status-indicator-wrapper\"\n" +
    "         ng-repeat=\"question in ::questions track by question.id\"\n" +
    "         question-status=\"question.__questionStatus\"\n" +
    "         question=\"question\"\n" +
    "         ng-click=\"d.tap($index)\"\n" +
    "         analytics-on=\"click\"\n" +
    "         analytics-event=\"click-pager-question\"\n" +
    "         analytics-category=\"exercise-page\"\n" +
    "         analytics-label=\"{{::question.id}}\">\n" +
    "            <div class=\"question-bookmark-icon\"></div>\n" +
    "            <div class=\"question-status-indicator\">\n" +
    "                <div class=\"index\">{{::$index + 1}}</div>\n" +
    "            </div>\n" +
    "    </div>\n" +
    "</ion-scroll>\n" +
    "");
}]);

angular.module("znk/exercise/templates/znkExerciseToolBoxModal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/exercise/templates/znkExerciseToolBoxModal.html",
    "<div blackboard-drv drawing-data=\"injections.blackboardData\" actions=\"d.blackboardActions\" close=\"d.closeBlackboard()\" ng-if=\"d[d.tools.PENCIL]\"></div>\n" +
    "<div class=\"tools-control-btn-wrapper\" ng-class=\"{'pencil-tool-open': d[d.tools.PENCIL], 'calculator-tool-open': d[d.tools.CALCULATOR], 'pager-open': d.showPager, 'eraser-tool-open':  d[d.tools.ERASER]}\">\n" +
    "    <div class=\"icon-wrapper close-pager-wrapper only-mobile hide-when-pencil-tool-open\" ng-click=\"d.showPager = false\">\n" +
    "        <i class=\"ion-ios-close-empty\"></i>\n" +
    "    </div>\n" +
    "    <div class=\"icon-wrapper only-mobile hide-when-pencil-tool-open\" ng-click=\"d.showPager = true\" analytics-on=\"click\" analytics-event=\"click-view-pager\" analytics-category=\"exercise-toolbox\">\n" +
    "        <i class=\"ion-more\"></i>\n" +
    "    </div>\n" +
    "    <div class=\"icon-wrapper only-mobile hide-when-pencil-tool-open\" ng-click=\"injections.bookmarkCurrentQuestion()\" analytics-on=\"click\" analytics-event=\"click-bookmark\" analytics-category=\"exercise-toolbox\">\n" +
    "        <i ng-class=\"injections.questionsWithAnswers[injections.currQuestionIndex || 0].__questionStatus.bookmark ?  'bookmark-active2-icon' : 'bookmark-blue-icon'\"></i>\n" +
    "    </div>\n" +
    "    <div class=\"icon-wrapper\" ng-click=\"d.openTool(d.tools.CALCULATOR)\" ng-if=\"::(injections.subjectId === d.subjects.math.enum)\" analytics-on=\"click\" analytics-event=\"click-tool-calculator\" analytics-category=\"exercise-toolbox\">\n" +
    "        <div class=\"only-tablet\">\n" +
    "            <i class=\"calculator-icon\"></i>\n" +
    "            <i class=\"calculator-white-icon\"></i>\n" +
    "            <i class=\"calculator-active-icon\"></i>\n" +
    "        </div>\n" +
    "        <div class=\"only-mobile\">\n" +
    "            <i class=\"calculator-blue-icon hide-when-pencil-tool-open\"></i>\n" +
    "            <i class=\"only-pencil-tool\" ng-class=\"d[d.tools.CALCULATOR] ? 'calculator-blue-icon' : 'calculator-white2-icon'\"></i>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"icon-wrapper\" ng-click=\"d.openTool(d.tools.PENCIL)\" analytics-on=\"click\" analytics-event=\"click-tool-pencil\" analytics-category=\"exercise-toolbox\">\n" +
    "        <div class=\"only-tablet\">\n" +
    "            <i class=\"pencil-icon\"></i>\n" +
    "            <i class=\"pencil-active-icon\"></i>\n" +
    "            <i class=\"pencil-white-icon\"></i>\n" +
    "        </div>\n" +
    "        <div class=\"only-mobile\">\n" +
    "            <i class=\"pencil-active-icon-iphone\"></i>\n" +
    "            <i class=\"pencil-white-iphone\"></i>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"icon-wrapper only-pencil-tool\" ng-click=\"d.openTool(d.tools.ERASER)\" ng-show=\"d[d.tools.PENCIL]\" analytics-on=\"click\" analytics-event=\"click-blackboard-eraser\" analytics-category=\"exercise-toolbox\">\n" +
    "        <div class=\"only-tablet\">\n" +
    "            <i class=\"eraser-white-tablet-icon\"></i>\n" +
    "            <i class=\"eraser-tablet-active-icon\"></i>\n" +
    "        </div>\n" +
    "        <div class=\"only-mobile \">\n" +
    "            <i class=\"eraser-white-icon\"></i>\n" +
    "            <i class=\"eraser-active-icon\"></i>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"icon-wrapper\" ng-click=\"d.openTool(d.tools.MARKER)\" ng-hide=\"true\" ng-if=\"::(injections.subjectId !== d.subjects.math.enum)\" analytics-on=\"click\" analytics-event=\"click-tool-marker\" analytics-category=\"exercise-toolbox\">\n" +
    "        <div class=\"only-tablet\">\n" +
    "            <i class=\"marker-icon\"></i>\n" +
    "            <i class=\"marker-white-icon\"></i>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"icon-wrapper only-pencil-tool\" ng-click=\"d.blackboardActions.clear()\" ng-show=\"d[d.tools.PENCIL]\" analytics-on=\"click\" analytics-event=\"click-tool-trash\" analytics-category=\"exercise-toolbox\">\n" +
    "        <i class=\"blackboard-trash ion-ios-trash-outline\"></i>\n" +
    "    </div>\n" +
    "    <div class=\"icon-wrapper only-mobile hide-when-pencil-tool-open ion-help-wrapper\"\n" +
    "         ng-click=\"injections.showInstructions()\"\n" +
    "         ng-disabled=\"!injections.showInstructions\"\n" +
    "         analytics-on=\"click\"\n" +
    "         analytics-event=\"click-tool-show-intro\"\n" +
    "         analytics-category=\"exercise-toolbox\">\n" +
    "        <div class=\"only-mobile ng-hide\" ng-show=\"injections.exerciseTypeId !== d.exerciseType.game.enum && injections.exerciseTypeId !== d.exerciseType.drill.enum\">\n" +
    "            <i class=\"questions-tutorial-mobile\"></i>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div calculator ng-if=\"d[d.tools.CALCULATOR]\" class=\"calculator-wrap\" close=\"d[d.tools.CALCULATOR] = false\" calc-top=\"__calcTop\"></div>\n" +
    "\n" +
    "");
}]);

angular.module("znk/flashcard/templates/flashcardItemDrv.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/flashcard/templates/flashcardItemDrv.html",
    "<div class=\"flipper\">\n" +
    "    <div class=\"front-side\">\n" +
    "        <span class=\"title\">{{::d.flashcard.title}}</span>\n" +
    "    </div>\n" +
    "    <div class=\"back-side\">\n" +
    "        <div class=\"title-wrapper\">\n" +
    "            <span class=\"title\">{{::d.flashcard.title}}</span>\n" +
    "        </div>\n" +
    "        <ion-scroll direction=\"y\"\n" +
    "                    has-bouncing=\"false\"\n" +
    "                    ng-switch=\"::d.flashcard.subjectId\">\n" +
    "            <!-- reading, math -->\n" +
    "            <div ng-switch-default class=\"content-wrapper\">\n" +
    "                <div class=\"lexical\"\n" +
    "                     compile=\"d.flashcard.lexical\"\n" +
    "                     bind-once=\"true\">\n" +
    "                </div>\n" +
    "                <div class=\"definition\"\n" +
    "                     compile=\"d.flashcard.definition\"\n" +
    "                     bind-once=\"true\">\n" +
    "                </div>\n" +
    "                <div class=\"example\">\n" +
    "                    <div class=\"title\">Example</div>\n" +
    "                    <div compile=\"d.flashcard.example\"\n" +
    "                         bind-once=\"true\"\n" +
    "                         class=\"content\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"synonym\">\n" +
    "                    <div class=\"title\">Synonym</div>\n" +
    "                    <div class=\"content\"\n" +
    "                         compile=\"d.flashcard.synonym\"\n" +
    "                         bind-once=\"true\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </ion-scroll>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("znk/flashcard/templates/flashcardsModal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/flashcard/templates/flashcardsModal.html",
    "<div ng-switch=\"d.countSwipes === 0 && d.currIndex !== -1\" class=\"flashcard-modal-wrapper\" ng-class=\"d.cardsIds.length ? '' : 'no-flashcards-left'\">\n" +
    "    <h3>flashcards</h3>\n" +
    "    <div ng-switch-when=\"true\" class=\"xp-score\">\n" +
    "        <div ng-show=\"d.practiceScore > 0\" class=\"ng-hide\">\n" +
    "            <div class=\"practice-score\">+{{::d.practiceScore}} xp</div>\n" +
    "            <div class=\"practice-title\">practice score</div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-switch-when=\"false\" class=\"counter-section\">\n" +
    "        <div class=\"content\">\n" +
    "            <span>{{d.currIndex + 1}}</span>\n" +
    "            <span>of</span>\n" +
    "            <span>{{d.cardsIds.length}}</span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-switch-when=\"false\" class=\"flashcards-container\">\n" +
    "        <div class=\"dummy-flashcard-item-wrapper\">\n" +
    "            <flashcard-Item ng-non-bindable></flashcard-Item>\n" +
    "        </div>\n" +
    "        <div class=\"dummy-flashcard-item-wrapper\">\n" +
    "            <flashcard-Item ng-non-bindable>\n" +
    "                <div class=\"no-cards-left-container\">\n" +
    "                    <div class=\"title\">No saved Flashcards</div>\n" +
    "                    <i class=\"flashcards-empty-icon\"></i>\n" +
    "                    <div class=\"description\">You can find new flashcards to practice <br>in home page</div>\n" +
    "                </div>\n" +
    "            </flashcard-Item>\n" +
    "        </div>\n" +
    "        <div class=\"flashcard-items-wrapper\">\n" +
    "            <div ng-repeat=\"flashcard in d.renderedCards track by flashcard.id\"\n" +
    "                 class=\"flashcard-item-wrapper\"\n" +
    "                 flashcard-swipe-drv\n" +
    "                 on-flashcard-swipe-right-start=\"d.swipeStart()\"\n" +
    "                 on-flashcard-swipe-right-end=\"d.keepCard()\"\n" +
    "                 on-flashcard-swipe-left-start=\"d.swipeStart()\"\n" +
    "                 on-flashcard-swipe-left-end=\"d.removeCard()\">\n" +
    "                <flashcard-Item flashcard=\"flashcard\" analytics-on=\"click\" analytics-event=\"click-flashcard-flip\" analytics-category=\"flashcards\" analytics-label=\"{{flashcard.id}}\"></flashcard-Item>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-switch-when=\"false\" class=\"actions-container\"\n" +
    "         ng-class=\"{0: 'keep-status',1: 'remove-status'}[d.renderedCards[0].__status.status]\">\n" +
    "        <div class=\"actions-wrapper show-animation\"\n" +
    "             ng-if=\"!d.hideActions\">\n" +
    "            <div class=\"action-wrapper remove-it-wrapper\"\n" +
    "\n" +
    "\n" +
    "                 ng-disabled=\"d.currCardStatus === 1\"\n" +
    "                 disable-click-drv>\n" +
    "                <div class=\"circle-with-icon\" swipe-card-on-click-drv direction=\"left\">\n" +
    "                    <i class=\"flashcards-remove-icon\"></i>\n" +
    "                </div>\n" +
    "                <div class=\"title\">Remove Card</div>\n" +
    "                <div class=\"title active\">Removed</div>\n" +
    "            </div>\n" +
    "            <div class=\"action-wrapper keep-it-wrapper\"\n" +
    "\n" +
    "\n" +
    "                 ng-disabled=\"d.currCardStatus === 0\"\n" +
    "                 disable-click-drv>\n" +
    "                <div class=\"circle-with-icon\" swipe-card-on-click-drv  direction=\"right\">\n" +
    "                    <i class=\"ion-android-star\"></i>\n" +
    "                </div>\n" +
    "                <div class=\"title\">Keep It</div>\n" +
    "                <div class=\"title active\">Saved</div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-switch-when=\"true\" class=\"finished-flashcard-modal-wrapper \">\n" +
    "        <div ng-if=\"!d.hideActions\">\n" +
    "            <p >You've reviewed all cards in this set.<br>\n" +
    "                Cards you marked to keep will appear in future<br>\n" +
    "                flashcard sets to practice again.</p>\n" +
    "\n" +
    "            <div class=\"btn-wrapper\">\n" +
    "                <div on-tap=\"d.practiceAgain()\" class=\"practice-again-btn btn\">PRACTICE AGAIN</div>\n" +
    "                <div on-tap=\"close()\" class=\"done-btn btn\"> DONE</div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("znk/gamification/templates/gamification.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/gamification/templates/gamification.html",
    "<ion-view class=\"gamification-page\">\n" +
    "    <ion-header-bar class=\"znk-header\" no-tap-scroll=\"true\">\n" +
    "        <div class=\"buttons\" ui-sref=\"app.home\">\n" +
    "            <i class=\"ion-ios-close-empty\"></i>\n" +
    "        </div>\n" +
    "    </ion-header-bar>\n" +
    "    <ion-content scroll=\"false\">\n" +
    "        <div class=\"game-title\">SCOREBOARD</div>\n" +
    "        <div gamification-progress-drv show-progress-value=\"false\" on-gameifiction=\"onGameifictionHandler(gameObj)\"></div>\n" +
    "        <div gamification-xp-line-drv gamification=\"gamification.gameObj\" ></div>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("znk/gamification/templates/gamificationXpLineDrv.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/gamification/templates/gamificationXpLineDrv.html",
    "<ion-scroll direction=\"y\">\n" +
    "    <div class=\"gamificationXpLineContainer\">\n" +
    "        <div ng-repeat=\"item in ::gamificationArr track by $index\"\n" +
    "             ng-class=\"::{'game-item-done' : (current.exp.total >= item.points && current.exp.total > item.nextPoints),\n" +
    "            'game-item-active' : isActive = (current.exp.total >= item.points && current.exp.total < item.nextPoints) }\"\n" +
    "             class=\"gamificationXpLineItem\" last=\"{{$last}}\">\n" +
    "            <div class=\"game-item-image\" ng-class=\"item.className\"></div>\n" +
    "            <div class=\"game-item-label\">{{ ::item.name | uppercase }}</div>\n" +
    "            <div class=\"game-item-line\">\n" +
    "                <div class=\"game-item-line-cross\" ng-if=\"isActive\" ng-style=\"::{'height' : ((current.exp.total - item.points) / (item.nextPoints - item.points) * 100) - 5+'%' }\"></div>\n" +
    "                <div class=\"game-item-point\" ng-class=\"::{'game-item-point-active' : (isActive &&  current.exp.total > item.middle[0]) }\">{{ ::item.middle[0] }} XP</div>\n" +
    "                <div class=\"game-item-point\" ng-class=\"::{'game-item-point-active' : (isActive &&  current.exp.total > item.middle[1]) }\">{{ ::item.middle[1] }} XP</div>\n" +
    "                <div class=\"game-item-point\">{{ ::item.nextPoints }} XP</div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</ion-scroll>\n" +
    "");
}]);

angular.module("znk/home/templates/dailyDetailsModal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/home/templates/dailyDetailsModal.html",
    "<div class=\"text-wrapper ng-hide\" ng-show=\"d.showNewUserIntro\">\n" +
    "    <p>Every workout is personalized according\n" +
    "        to your needs, covers all 3 test subjects, and teaches\n" +
    "        you tricks that will greatly improve your score.\n" +
    "    </p>\n" +
    "</div>\n" +
    "<div class=\"content-wrapper\"\n" +
    "     ng-style=\"{\n" +
    "        top:  pos.top + 'px',\n" +
    "        left: pos.left + 'px'\n" +
    "     }\"\n" +
    "     ng-class=\"{\n" +
    "        'push-item-left' : (!d.isMobile && d.screenWidth - pos.left < 353) || (d.isMobile && d.screenWidth - pos.left < 194),\n" +
    "        'push-item-right': (!d.isMobile && pos.left < 6) || (d.isMobile && pos.left < 89),\n" +
    "        'push-item-up': (d.isMobile && d.screenHeight - pos.top < 264)\n" +
    "     }\">\n" +
    "    <div class=\"icon-container tutorial-container\"\n" +
    "         ng-click=\"exerciseClick('app.dailyTutorial')\"\n" +
    "         analytics-on=\"click\"\n" +
    "         analytics-event=\"click-daily-tutorial\"\n" +
    "         analytics-category=\"daily-details\">\n" +
    "        <div class=\"icon-wrapper\"\n" +
    "             ng-class=\"d.subjectEnumMap[daily.tutorial.subjectId] + (daily.tutorial.isCompleted ? ' complete' : '')\">\n" +
    "            <i class=\"home-tricks-tips-icon\"></i>\n" +
    "            <div class=\"correct-icon-wrapper\"\n" +
    "                 ng-switch=\"d.subjectEnumMap[daily.tutorial.subjectId]\">\n" +
    "                <i ng-switch-when=\"math-bg\" class=\"correct-answer-blue\"></i>\n" +
    "                <i ng-switch-when=\"reading-bg\" class=\"correct-answer-yellow\"></i>\n" +
    "                <i ng-switch-when=\"writing-bg\" class=\"correct-answer-red\"></i>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"title\">Tips & Tricks</div>\n" +
    "    </div>\n" +
    "    <div class=\"icon-container game-container\"\n" +
    "         ng-click=\"exerciseClick('app.dailyGame')\"\n" +
    "         analytics-on=\"click\"\n" +
    "         analytics-event=\"click-daily-game\"\n" +
    "         analytics-category=\"daily-details\">\n" +
    "        <div class=\"icon-wrapper\"\n" +
    "             ng-class=\"d.subjectEnumMap[daily.game.subjectId] + (daily.game.isCompleted ? ' complete' : '')\">\n" +
    "            <i class=\"game-icon\"></i>\n" +
    "            <div class=\"correct-icon-wrapper\" ng-switch=\"d.subjectEnumMap[daily.game.subjectId]\">\n" +
    "                <i ng-switch-when=\"math-bg\" class=\"correct-answer-blue\"></i>\n" +
    "                <i ng-switch-when=\"reading-bg\" class=\"correct-answer-yellow\"></i>\n" +
    "                <i ng-switch-when=\"writing-bg\" class=\"correct-answer-red\"></i>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"title\">Mini Challenge</div>\n" +
    "    </div>\n" +
    "    <div class=\"icon-container drill-container\"\n" +
    "         ng-click=\"exerciseClick('app.drill')\"\n" +
    "         analytics-on=\"click\"\n" +
    "         analytics-event=\"click-daily-drill\"\n" +
    "         analytics-category=\"daily-details\">\n" +
    "        <div class=\"icon-wrapper\"\n" +
    "             ng-class=\"d.subjectEnumMap[daily.drill.subjectId] + (daily.drill.isCompleted ? ' complete' : '')\">\n" +
    "            <i class=\"drill-with-shadow-icon\"></i>\n" +
    "            <div class=\"correct-icon-wrapper\" ng-switch=\"d.subjectEnumMap[daily.drill.subjectId]\">\n" +
    "                <i ng-switch-when=\"math-bg\" class=\"correct-answer-blue\"></i>\n" +
    "                <i ng-switch-when=\"reading-bg\" class=\"correct-answer-yellow\"></i>\n" +
    "                <i ng-switch-when=\"writing-bg\" class=\"correct-answer-red\"></i>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"title\">Drill</div>\n" +
    "    </div>\n" +
    "    <div class=\"icon-container flashcards-container\"\n" +
    "         ng-click=\"exerciseClick('flashcards')\"\n" +
    "         analytics-on=\"click\"\n" +
    "         analytics-event=\"click-daily-flashcards\"\n" +
    "         analytics-category=\"daily-details\">\n" +
    "        <div class=\"icon-wrapper\"\n" +
    "             ng-class=\"daily.flashcards.isCompleted ? ' complete' : ''\">\n" +
    "            <i class=\"flashcard-with-shadow-icon\"></i>\n" +
    "            <div class=\"correct-icon-wrapper \" >\n" +
    "              <i class=\"correct-answer-purple\"></i>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"title\">Flashcards</div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("znk/home/templates/freeDailiesEndedModal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/home/templates/freeDailiesEndedModal.html",
    "<div class=\"close-btn-wrapper\" ng-click=\"close()\">\n" +
    "    <i class=\"close-x-grey-icon\"></i>\n" +
    "</div>\n" +
    "<div class=\"content-wrapper\">\n" +
    "    <div class=\"raccoon-image-wrapper\">\n" +
    "        <div class=\"purchase-raccoon\"></div>\n" +
    "    </div>\n" +
    "    <div class=\"main-content\">\n" +
    "        <p>\n" +
    "            Wow! You've completed the first workout already? Just when we were getting to know each other...\n" +
    "        </p>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"purchase-btn-wrapper\">\n" +
    "    <button class=\"btn\" ng-click=\"openIapModal()\">Get Zinkerz Pro</button>\n" +
    "</div>\n" +
    "");
}]);

angular.module("znk/home/templates/home.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/home/templates/home.html",
    "<ion-view class=\"home\">\n" +
    "    <ion-header-bar class=\"znk-header\" no-tap-scroll=\"true\">\n" +
    "        <div class=\"buttons\">\n" +
    "            <button class=\"button-clear btn-with-text\" ng-disabled=\"!d.examIdDefault\" ui-sref=\"app.examPage({ id: d.examIdDefault, status: d.allItemsArr[0].status })\">\n" +
    "                <i class=\"exam-link-icon\"></i>\n" +
    "                <span class=\"test-link\">TESTS</span>\n" +
    "            </button>\n" +
    "        </div>\n" +
    "        <div class=\"title\">\n" +
    "            <div estimated-score-drv view-size=\"mini\" on-gauge-click=\"d.onClickGauge\" class=\"show-animation\"></div>\n" +
    "        </div>\n" +
    "        <div class=\"buttons\">\n" +
    "            <button class=\"button-clear only-tablet btn-with-text\" ui-sref=\"app.gamification\">\n" +
    "                <i class=\"grey-star-icon\"></i>\n" +
    "                <span class=\"points\">{{d.totalXpPoints}} XP</span>\n" +
    "            </button>\n" +
    "            <div class=\"separator only-tablet\"></div>\n" +
    "            <button class=\"button-clear setting-btn\" ui-sref=\"app.settings\">\n" +
    "                <i class=\"setting-link-icon\"></i>\n" +
    "            </button>\n" +
    "        </div>\n" +
    "    </ion-header-bar>\n" +
    "    <ion-content on-scroll=\"d.preventScrollingDown()\" scrollbar-y=\"false\" delegate-handle=\"homePage\">\n" +
    "        <div class=\"slider-wrap\" ng-if=\"d.spinnerStoped\">\n" +
    "            <ion-slide-box active-slide=\"1\">\n" +
    "                <ion-slide>\n" +
    "                  <div test-slide-drv\n" +
    "                       is-home\n" +
    "                       diagnostic=\"d.allItemsArr[0]\"\n" +
    "                       exam-id=\"d.examId\"\n" +
    "                       exam-id-default=\"onExamDefault(id)\"\n" +
    "                       analytics-on=\"click\"\n" +
    "                       analytics-event=\"click-test-banner\"\n" +
    "                       analytics-category=\"banner\"\n" +
    "                       analytics-label=\"homepage\"></div>\n" +
    "                </ion-slide>\n" +
    "                <ion-slide ng-switch on=\"d.allItemsArr[0].status\">\n" +
    "                    <div estimated-score-drv ng-switch-when=\"2\"\n" +
    "                         on-gauge-click=\"d.onClickGauge\"\n" +
    "                         view-size=\"full\"\n" +
    "                         location=\"home\"\n" +
    "                         analytics-on=\"click\"\n" +
    "                         analytics-event=\"click-estimate-banner\"\n" +
    "                         analytics-category=\"banner\"\n" +
    "                         analytics-label=\"homepage\"></div>\n" +
    "                    <div class=\"empty-estimate-wrap\" ng-class=\"{'empty-estimate-mobile' : d.isMobile, 'empty-estimate' : !d.isMobile}\" ng-switch-when=\"1\" >\n" +
    "                        <div class=\"user-name\">Welcome{{', ' + d.userProfile.nickname}}!</div>\n" +
    "                        <div class=\"empty-msg\">\n" +
    "                            Set your preliminary score by completing the diagnostic test.</div>\n" +
    "                    </div>\n" +
    "                </ion-slide>\n" +
    "                <ion-slide>\n" +
    "                    <div gamification-progress-drv\n" +
    "                         show-progress-value=\"false\"\n" +
    "                         ui-sref=\"app.gamification\"\n" +
    "                         analytics-on=\"click\"\n" +
    "                         analytics-event=\"click-gamification-banner\"\n" +
    "                         analytics-category=\"banner\"\n" +
    "                         analytics-label=\"homepage\"></div>\n" +
    "                </ion-slide>\n" +
    "            </ion-slide-box>\n" +
    "        </div>\n" +
    "        <home-path items=\"d.allItemsArr\"\n" +
    "                   item-template=\"{{d.homePath.itemTemplate}}\"\n" +
    "                   scroll-to-active-daily=\"scrollToActiveDaily\"\n" +
    "                   active-item=\"{{d.activeDailyOrder + 1}}\">\n" +
    "        </home-path>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n" +
    "");
}]);

angular.module("znk/home/templates/homeBonusSkillsDetailsModal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/home/templates/homeBonusSkillsDetailsModal.html",
    "<div class=\"content-wrapper\"\n" +
    "     ng-style=\"{\n" +
    "        top: d.style.top + 'px',\n" +
    "        left: d.style.left + 'px'\n" +
    "     }\"\n" +
    "     ng-class=\"{\n" +
    "        'push-left': d.screenWidth - d.style.left < (d.isMobile ? 141 : 208),\n" +
    "        'push-right': d.style.left < 0\n" +
    "     }\">\n" +
    "    <div class=\"home-page-details-modal-item drill-item\" ng-class=\"{completed: d.drill.isCompleted}\">\n" +
    "        <div class=\"icon-wrapper\"\n" +
    "             subject-id-to-class-drv=\"d.drill.subjectId\"\n" +
    "             ng-click=\"d.openDrill()\">\n" +
    "            <i class=\"drill-with-shadow-icon\"></i>\n" +
    "            <i class=\"ion-ios-checkmark-empty\"></i>\n" +
    "        </div>\n" +
    "        <div class=\"item-title\">Drills</div>\n" +
    "    </div>\n" +
    "    <div class=\"home-page-details-modal-item flashcard-item\"\n" +
    "         ng-class=\"{completed: d.isFlashcardsCompleted}\"\n" +
    "         subject-id-to-class-drv=\"1\"\n" +
    "         ng-click=\"d.openFlashcards()\">\n" +
    "        <div class=\"icon-wrapper\" subject-id-to-class-drv=\"1\">\n" +
    "            <i class=\"flashcard-with-shadow-icon\"></i>\n" +
    "            <i class=\"ion-ios-checkmark-empty\"></i>\n" +
    "        </div>\n" +
    "        <div class=\"item-title\">Flashcards</div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("znk/home/templates/homeBonusSkillsItemDrv.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/home/templates/homeBonusSkillsItemDrv.html",
    "<div class=\"circle-container\">\n" +
    "    <i class=\"correct-answer-icon\"></i>\n" +
    "    <span class=\"text\">BONUS<br>SKILLS</span>\n" +
    "</div>\n" +
    "");
}]);

angular.module("znk/home/templates/homeDailyItemDrv.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/home/templates/homeDailyItemDrv.html",
    "<div class=\"content-wrapper\"\n" +
    "     analytics-on=\"click\"\n" +
    "     analytics-event=\"click-home-daily-item\"\n" +
    "     analytics-category=\"home-daily\"\n" +
    "     analytics-label=\"{{d.row2}}\">\n" +
    "    <i class=\"ion-ios-locked\"></i>\n" +
    "    <div compile=\"d.row1\" class=\"row1\"></div>\n" +
    "    <div compile=\"d.row2\" class=\"row2\"></div>\n" +
    "\n" +
    "    <div class=\"progress-bubble-wrapper\"\n" +
    "         ng-class=\"::{'drill-completed':d.daily.drill.isCompleted,\n" +
    "                    'tutorial-completed':d.daily.tutorial.isCompleted,\n" +
    "                    'game-completed':d.daily.game.isCompleted,\n" +
    "                    'flashcards-completed':d.bubbleStatus['flashcards']}\">\n" +
    "\n" +
    "        <div class=\"progress-cell tutorial-cell\" ng-class=\"::d.subjectNames[d.daily.tutorial.subjectId]\"></div>\n" +
    "        <div class=\"progress-cell game-cell\" ng-class=\"::d.subjectNames[d.daily.game.subjectId]\"></div>\n" +
    "        <div class=\"progress-cell drill-cell\" ng-class=\"::d.subjectNames[d.daily.drill.subjectId]\"></div>\n" +
    "        <div class=\"progress-cell flashcard-cell\" ng-class=\"::d.subjectNames[d.daily.drill.subjectId]\"></div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("znk/home/templates/homeExamItemDrv.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/home/templates/homeExamItemDrv.html",
    "<div class=\"content-wrapper\"\n" +
    "     ng-click=\"d.touchAction()\"\n" +
    "     analytics-on=\"click\"\n" +
    "     analytics-event=\"click-home-exam-item\"\n" +
    "     analytics-category=\"home-exam\"\n" +
    "     analytics-label=\"{{d.row2}}\">\n" +
    "    <i class=\"ion-ios-locked\"></i>\n" +
    "    <div compile=\"d.row1\" class=\"row1\"></div>\n" +
    "    <div compile=\"d.row2\" class=\"row2\"></div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("znk/home/templates/homePathDrv.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/home/templates/homePathDrv.html",
    "<ng-include src=\"d.isMobile ? 'znk/home/templates/svgPathMobile.html' : 'znk/home/templates/svgPathTablet.html'\"></ng-include>\n" +
    "\n" +
    "<div class=\"item-container\" style=\"position: absolute;top:0;\">\n" +
    "    <!-- @todo(allen) move to dedicated sass file-->\n" +
    "    <div ng-repeat=\"item in d.items\"\n" +
    "         style=\"position: absolute;top:0;\"\n" +
    "         ng-style=\"d.getItemStyle($index)\"\n" +
    "         index=\"{{$index + 1}}\" >\n" +
    "        <ng-include src=\"d.itemTemplate\"></ng-include>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("znk/home/templates/homePathItemTemplate.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/home/templates/homePathItemTemplate.html",
    "<home-daily-item daily=\"item\"\n" +
    "                 ng-disabled=\"item.locked\"\n" +
    "                 trigger-gesture-drv=\"item\"\n" +
    "                 evt-type=\"tap\"\n" +
    "                 home-png-sequence-drv\n" +
    "                 show-foot-prints=\"d.showFootPrints\"\n" +
    "                 scroll-to-active-daily=\"scrollToActiveDaily()\">\n" +
    "</home-daily-item>\n" +
    "");
}]);

angular.module("znk/home/templates/svgPathMobile.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/home/templates/svgPathMobile.html",
    "<svg version=\"1.1\"\n" +
    "     id=\"Layer_1\"\n" +
    "     xmlns=\"http://www.w3.org/2000/svg\"\n" +
    "     xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n" +
    "     x=\"0px\"\n" +
    "     y=\"0px\"\n" +
    "	 viewBox=\"0 0 0 0\"\n" +
    "     ng-style=\"colorSvg()\"\n" +
    "     xml:space=\"preserve\">\n" +
    "    <!--<path id=\"XMLID_74_\" class=\"st0\" d=\"M1032.6,925.9\"/>-->\n" +
    "    <!--<path id=\"XMLID_73_\" class=\"st0\" d=\"M946.1,465.3\"/>-->\n" +
    "    <path id=\"XMLID_72_\" class=\"st0\" d=\"M379.7,162.7c-37-55.9-100.5-99-184.7-99h-63.8\"/>\n" +
    "    <path id=\"XMLID_71_\" class=\"st0\" d=\"M900.7,404.4c9.5-9.2,19.3-16.7,28.2-23c71.5-49.9,106.8-144,62-218.7\n" +
    "	c-44.7-74.8-155-109.2-227.7-61.2c-64.7,42.7-68.7,121.8-71,134.9c-15.5,89-58.3,124.8-129.7,130.3c-77.3,5.9-134.3-52.9-150.6-128\n" +
    "	c-5.7-26.1-16.6-52.1-32.3-75.9\"/>\n" +
    "    <path id=\"XMLID_70_\" class=\"st0\" d=\"M818.4,849.5c53.3,7.9,89.8,41.9,89.8,41.9c22.9,17.7,51.3,30.4,82.4,30.4\n" +
    "	c74.8,0,135.4-60.6,135.4-135.4S1065.2,655.9,990.6,651c-21.5-1.4-57.1-7.6-82.3-25.9c-36.4-26.4-57.5-67.6-55.8-109.4\n" +
    "	c2.2-53.7,24.2-88.1,48.1-111.4\"/>\n" +
    "    <path id=\"XMLID_69_\" class=\"st0\" d=\"M312.6,739.9c44.8,7.8,85.2,31.8,110,74.7c39.2,67.8,104.9,128.5,186.7,117.2\n" +
    "	c30.2-4.2,62.9-26.6,83.9-43.8c45.4-37.1,89.2-43.8,125.2-38.5\"/>\n" +
    "    <path id=\"XMLID_13_\" class=\"st0\" d=\"M477.3,1084.3c-37.2,5-70.1,24.5-95.5,34.5c-64,25.3-203,44.4-272.7-37.3\n" +
    "	C35,994.7,45.4,864.2,132.2,790.1l-1,1.3c50.2-42.8,120-62.3,181.4-51.6\"/>\n" +
    "\n" +
    "\n" +
    "    <g class=\"repeat-part\" ng-repeat=\"i in getNumber(numOfRepeats) track by $index\" ng-style=\"{ 'transform' : setPos($index), '-webkit-transform': setPos($index)}\">\n" +
    "        <path id=\"part2\" class=\"st02\" d=\"M537.1,460.5c67.1-32.3,109.7-104.8,100.7-183.4c-11.4-99-100.4-170.2-198.8-158.9\n" +
    "        c-15.5,1.8-30.3,5.5-44.2,10.9c-2.1,0.8-4.1,1.7-6.1,2.7c-19.8,9.5-155,68.9-234.7-26.7c-9.8-11.8-19.6-21.5-29.3-29.3v-0.1\n" +
    "        C91.3,48.6,58.8,43.3,29,47.2\">\n" +
    "        </path>\n" +
    "        <path id=\"part3\" class=\"st03\" d=\"M76,63.1c15.6,0.3,31.4,3.3,46.8,9.1c42.3,16.1,58.5,57.4,84.2,90.7\n" +
    "        c134.2,173.8,258.8-1.6,258.8-1.6c1.7-1.8,3.4-3.5,5.1-5.1C613.1,16.8,725.6,168,725.6,168c3.1,2.8,6.4,5.5,9.8,7.8\n" +
    "        c34.5,23.9,77.4,35.9,122.2,30.7c20.3-2.3,39.4-8,56.9-16.4\">\n" +
    "        </path>\n" +
    "        <path id=\"part4\" class=\"st04\" d=\"M552.1,414.2c-35.5,4.8-66.1,26.3-81.5,47.5c-18.5,25.5-61.6,72.4-128.4,35.1\n" +
    "        c-80.6-45,8.7-134.6-174.8-156c-76.6-8.9-108.3-108.1-80.9-180.1c21.6-56.7,76-91.2,133.4-90\">\n" +
    "        </path>\n" +
    "    </g>\n" +
    "\n" +
    "    <g id=\"XMLID_16_\">\n" +
    "        <g id=\"XMLID_8_\">\n" +
    "            <defs>\n" +
    "                <polygon id=\"XMLID_43_\" points=\"82.5,35.6 130.7,63.5 82.5,91.3\"/>\n" +
    "            </defs>\n" +
    "            <clipPath id=\"XMLID_61_\">\n" +
    "                <use xlink:href=\"#XMLID_43_\"  style=\"overflow:visible;\"/>\n" +
    "            </clipPath>\n" +
    "                    <g id=\"XMLID_18_\" class=\"st1\">\n" +
    "                    <rect id=\"XMLID_33_\" x=\"58.6\" y=\"-30.5\" transform=\"matrix(-0.4919 -0.8706 0.8706 -0.4919 64.9528 95.0045)\" class=\"st2\" width=\"3.1\" height=\"118.1\"/>\n" +
    "\n" +
    "                    <rect id=\"XMLID_32_\" x=\"61.8\" y=\"-25\" transform=\"matrix(-0.4923 -0.8704 0.8704 -0.4923 64.8983 105.8711)\" class=\"st2\" width=\"3.1\" height=\"118.1\"/>\n" +
    "\n" +
    "                    <rect id=\"XMLID_31_\" x=\"64.9\" y=\"-19.7\" transform=\"matrix(-0.4921 -0.8705 0.8705 -0.4921 64.8311 116.5219)\" class=\"st2\" width=\"3.1\" height=\"118.1\"/>\n" +
    "\n" +
    "                    <rect id=\"XMLID_30_\" x=\"68.2\" y=\"-13.7\" transform=\"matrix(-0.4923 -0.8704 0.8704 -0.4923 64.6382 128.4478)\" class=\"st2\" width=\"3.1\" height=\"118.1\"/>\n" +
    "\n" +
    "                    <rect id=\"XMLID_29_\" x=\"71.3\" y=\"-8.2\" transform=\"matrix(-0.4918 -0.8707 0.8707 -0.4918 64.3413 139.2556)\" class=\"st2\" width=\"3.1\" height=\"118.1\"/>\n" +
    "\n" +
    "                    <rect id=\"XMLID_28_\" x=\"74.4\" y=\"-2.8\" transform=\"matrix(-0.4922 -0.8705 0.8705 -0.4922 64.3152 150.1165)\" class=\"st2\" width=\"3.1\" height=\"118.1\"/>\n" +
    "\n" +
    "                    <rect id=\"XMLID_27_\" x=\"77.5\" y=\"2.6\" transform=\"matrix(-0.4927 -0.8702 0.8702 -0.4927 64.3028 160.7908)\" class=\"st2\" width=\"3.1\" height=\"118.1\"/>\n" +
    "\n" +
    "                    <rect id=\"XMLID_26_\" x=\"80.5\" y=\"8.1\" transform=\"matrix(-0.4922 -0.8705 0.8705 -0.4922 63.9771 171.6124)\" class=\"st2\" width=\"3.1\" height=\"118.1\"/>\n" +
    "\n" +
    "                    <rect id=\"XMLID_25_\" x=\"83.9\" y=\"14.1\" transform=\"matrix(-0.492 -0.8706 0.8706 -0.492 63.7743 183.5175)\" class=\"st2\" width=\"3.1\" height=\"118.1\"/>\n" +
    "\n" +
    "                    <rect id=\"XMLID_24_\" x=\"87\" y=\"19.6\" transform=\"matrix(-0.4919 -0.8707 0.8707 -0.4919 63.6788 194.3685)\" class=\"st2\" width=\"3.1\" height=\"118.1\"/>\n" +
    "\n" +
    "                    <rect id=\"XMLID_23_\" x=\"90\" y=\"25\" transform=\"matrix(-0.4921 -0.8706 0.8706 -0.4921 63.4536 205.2169)\" class=\"st2\" width=\"3.1\" height=\"118.1\"/>\n" +
    "\n" +
    "                    <rect id=\"XMLID_22_\" x=\"93.1\" y=\"30.4\" transform=\"matrix(-0.492 -0.8706 0.8706 -0.492 63.3788 215.8678)\" class=\"st2\" width=\"3.1\" height=\"118.1\"/>\n" +
    "\n" +
    "                    <rect id=\"XMLID_21_\" x=\"96.5\" y=\"36.4\" transform=\"matrix(-0.4921 -0.8705 0.8705 -0.4921 63.2273 227.776)\" class=\"st2\" width=\"3.1\" height=\"118.1\"/>\n" +
    "\n" +
    "                    <rect id=\"XMLID_20_\" x=\"99.6\" y=\"41.8\" transform=\"matrix(-0.4921 -0.8705 0.8705 -0.4921 63.1514 238.6179)\" class=\"st2\" width=\"3.1\" height=\"118.1\"/>\n" +
    "\n" +
    "                    <rect id=\"XMLID_19_\" x=\"102.7\" y=\"47.3\" transform=\"matrix(-0.492 -0.8706 0.8706 -0.492 62.8576 249.4462)\" class=\"st2\" width=\"3.1\" height=\"118.1\"/>\n" +
    "            </g>\n" +
    "        </g>\n" +
    "\n" +
    "        <g class=\"footPrints1 hide-animation\">\n" +
    "            <g class=\"one-foot-print1\" id=\"XMLID_10_\" transform=\"matrix( 2.12353515625, 0, 0, 2.12353515625, 105.25,37.95) \">\n" +
    "                <g id=\"XMLID_11_\" transform=\"matrix( 1, 0, 0, 1, 0,0) \">\n" +
    "                    <g id=\"XMLID_61_\">\n" +
    "                        <g id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_FILL_5_\">\n" +
    "                            <path id=\"XMLID_62_\" d=\"M260.9,19.1c-0.4,0-0.8,0-1.1,0.2c-0.3,0.2-0.5,0.5-0.6,0.8c0,0.3,0,0.6,0.2,0.8c0.5,0.7,1.1,1.1,1.9,1\n" +
    "                                c0.5,0,1-0.1,1.5-0.5c0.8-0.5,1.3-1.1,1.5-2c0.3-0.7,0.3-1.4,0-2c-0.2-0.4-0.5-0.7-0.8-0.8c-0.2,0-0.3,0-0.4,0\n" +
    "                                c-0.2,0.1-0.5,0.4-0.8,0.8c-0.3,0.5-0.6,0.8-0.8,1C261.6,19.1,261.3,19.1,260.9,19.1 M263.9,30.7c0.1-0.9-0.1-1.8-0.4-2.9\n" +
    "                                c-0.3-1.3-0.7-2.2-1-2.9c-0.5-1.1-1-1.7-1.5-1.6c-0.3,0-0.6,0.1-0.9,0.4s-0.6,0.6-0.8,1.1c-0.5,1.1-0.6,2.3-0.3,3.5\n" +
    "                                c0.5,1.9,1,3.1,1.7,3.7c0.5,0.4,1.1,0.6,1.9,0.5C263.4,32.4,263.8,31.8,263.9,30.7 M266.3,23c-1.1-0.8-1.9-1-2.5-0.7\n" +
    "                                c-0.5,0.3-0.6,1.1-0.2,2.6c0.3,1.3,0.8,2.5,1.5,3.5c0.6,1.1,1.4,1.9,2.1,2.4c0.8,0.7,1.5,0.8,2,0.5c1.6-1.1,1.5-3-0.3-5.7\n" +
    "                                C268.2,24.6,267.4,23.7,266.3,23 M273.3,24.7c0.1-0.4,0.2-0.8,0.1-1.2c-0.1-1.2-1-2.4-2.5-3.6c-0.7-0.6-1.6-0.9-2.6-0.9\n" +
    "                                c-0.5,0-0.9,0-1.2,0.1c-0.4,0.1-0.6,0.3-0.7,0.6c-0.1,0.1-0.1,0.4,0,0.7c0.1,0.3,0.3,0.7,0.6,1.1c0.5,0.8,1.3,1.5,2.1,2.2\n" +
    "                                c0.5,0.4,1,0.8,1.6,1.1c1.1,0.7,1.9,0.8,2.4,0.4C273,25.2,273.2,25,273.3,24.7z\"/>\n" +
    "                        </g>\n" +
    "                    </g>\n" +
    "                    <g id=\"XMLID_12_\">\n" +
    "                        <path id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_1_STROKES_5_\" class=\"st3\" d=\"M270.5,24.9c-0.6-0.4-1.1-0.8-1.6-1.1\n" +
    "                            c-0.8-0.8-1.5-1.5-2.1-2.2c-0.3-0.4-0.5-0.8-0.6-1.1c-0.1-0.3-0.1-0.5,0-0.7c0.1-0.2,0.4-0.4,0.7-0.6c0.3-0.1,0.7-0.2,1.2-0.1\n" +
    "                            c1,0.1,1.9,0.3,2.6,0.9c1.5,1.2,2.4,2.4,2.5,3.6c0,0.4,0,0.8-0.1,1.2c-0.1,0.3-0.2,0.5-0.4,0.6C272.4,25.7,271.6,25.5,270.5,24.9\n" +
    "                            z M268.9,25.6c-0.6-1-1.5-1.8-2.6-2.6c-1.1-0.8-1.9-1-2.5-0.7c-0.5,0.3-0.6,1.1-0.2,2.6c0.3,1.3,0.8,2.5,1.5,3.5\n" +
    "                            c0.6,1.1,1.4,1.9,2.1,2.4c0.8,0.7,1.5,0.8,2,0.5C270.7,30.3,270.7,28.4,268.9,25.6z M263.9,30.7c0.1-0.9-0.1-1.8-0.4-2.9\n" +
    "                            c-0.3-1.3-0.7-2.2-1-2.9c-0.5-1.1-1-1.7-1.5-1.6c-0.3,0-0.6,0.1-0.9,0.4s-0.6,0.6-0.8,1.1c-0.5,1.1-0.6,2.3-0.3,3.5\n" +
    "                            c0.5,1.9,1,3.1,1.7,3.7c0.5,0.4,1.1,0.6,1.9,0.5C263.4,32.4,263.8,31.8,263.9,30.7z M264.5,19.8c0.3-0.7,0.3-1.4,0-2\n" +
    "                            c-0.2-0.4-0.5-0.7-0.8-0.8c-0.2,0-0.3,0-0.4,0c-0.2,0.1-0.5,0.4-0.8,0.8c-0.3,0.5-0.6,0.8-0.8,1c-0.1,0.1-0.4,0.1-0.8,0.1\n" +
    "                            s-0.8,0-1.1,0.2c-0.3,0.2-0.5,0.5-0.6,0.8c0,0.3,0,0.6,0.2,0.8c0.5,0.7,1.1,1.1,1.9,1c0.5,0,1-0.1,1.5-0.5\n" +
    "                            C263.6,21.2,264.2,20.5,264.5,19.8z\"/>\n" +
    "                    </g>\n" +
    "                </g>\n" +
    "            </g>\n" +
    "            <g class=\"one-foot-print1\" id=\"XMLID_107_\" transform=\"matrix( 2.12353515625, 0, 0, 2.12353515625, 105.25,37.95) \">\n" +
    "                <g id=\"XMLID_108_\" transform=\"matrix( 1, 0, 0, 1, 0,0) \">\n" +
    "                    <g id=\"XMLID_114_\">\n" +
    "                        <g id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_FILL_9_\">\n" +
    "                            <path id=\"XMLID_115_\" d=\"M302.5,7.8c0,0.4,0,0.8,0.2,1.1c0.2,0.4,0.5,0.5,0.8,0.6c0.3,0.1,0.6,0,0.9-0.1\n" +
    "                                c0.7-0.4,1.2-1.1,1.3-1.8c0-0.6,0-1.1-0.2-1.6c-0.5-0.8-1-1.4-1.8-1.7c-0.7-0.3-1.3-0.4-2-0.3c-0.5,0.2-0.7,0.4-0.8,0.7\n" +
    "                                c0,0.1,0,0.3,0,0.4c0.1,0.2,0.3,0.5,0.8,0.9s0.7,0.7,0.9,0.9C302.6,7.2,302.6,7.4,302.5,7.8 M314.4,6.2c-0.8-0.2-1.8-0.1-2.9,0\n" +
    "                                c-1.3,0.2-2.3,0.4-3,0.7c-1.2,0.4-1.7,0.8-1.8,1.3c0,0.3,0.1,0.6,0.3,0.9c0.3,0.3,0.6,0.7,1,0.8c1.1,0.6,2.2,0.8,3.4,0.7\n" +
    "                                c1.9-0.2,3.2-0.7,3.9-1.3c0.4-0.4,0.7-1,0.7-1.9C316.1,6.8,315.5,6.4,314.4,6.2 M307,2.9c-0.9,1.1-1.3,1.8-1.1,2.4\n" +
    "                                c0.2,0.5,1,0.7,2.6,0.5c1.3-0.2,2.5-0.5,3.7-1.1c1.2-0.5,2-1.1,2.7-1.8c0.8-0.8,1-1.4,0.7-1.9c-0.9-1.7-2.8-1.8-5.7-0.4\n" +
    "                                C308.8,1.1,307.9,1.9,307,2.9 M309.4-3.9c-0.4-0.2-0.8-0.3-1.1-0.2c-1.2,0-2.4,0.7-3.9,2.1c-0.7,0.6-1.1,1.5-1.2,2.6\n" +
    "                                c-0.1,0.5,0,0.8,0,1.2c0.1,0.4,0.3,0.6,0.5,0.7c0.1,0.1,0.3,0.1,0.6,0.1c0.4-0.1,0.7-0.2,1.2-0.5c0.8-0.5,1.6-1,2.4-1.8\n" +
    "                                c0.4-0.4,0.9-0.9,1.4-1.5c0.8-1.1,1-1.9,0.6-2.3C309.9-3.5,309.7-3.7,309.4-3.9z\"/>\n" +
    "                        </g>\n" +
    "                    </g>\n" +
    "                    <g id=\"XMLID_109_\">\n" +
    "                        <path id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_1_STROKES_9_\" class=\"st3\" d=\"M309.4-1c-0.5,0.5-0.8,1-1.4,1.5\n" +
    "                            c-0.8,0.7-1.6,1.3-2.4,1.8c-0.4,0.3-0.8,0.5-1.2,0.5c-0.4,0.1-0.5,0-0.6-0.1c-0.3-0.2-0.4-0.4-0.5-0.7c-0.1-0.4-0.1-0.7,0-1.2\n" +
    "                            c0.1-1.1,0.6-1.9,1.2-2.6c1.3-1.3,2.7-2.1,3.9-2.1c0.4,0,0.8,0,1.1,0.2c0.3,0.2,0.5,0.2,0.5,0.5C310.4-2.9,310.1-2.1,309.4-1z\n" +
    "                             M309.9,0.6c-1,0.5-2.1,1.3-2.9,2.3c-0.9,1.1-1.3,1.8-1.1,2.4c0.2,0.5,1,0.7,2.6,0.5c1.3-0.2,2.5-0.5,3.7-1.1\n" +
    "                            c1.2-0.5,2-1.1,2.7-1.8c0.8-0.8,1-1.4,0.7-1.9C314.7-0.8,312.8-0.8,309.9,0.6z M314.4,6.2c-0.8-0.2-1.8-0.1-2.9,0\n" +
    "                            c-1.3,0.2-2.3,0.4-3,0.7c-1.2,0.4-1.7,0.8-1.8,1.3c0,0.3,0.1,0.6,0.3,0.9c0.3,0.3,0.6,0.7,1,0.8c1.1,0.6,2.2,0.8,3.4,0.7\n" +
    "                            c1.9-0.2,3.2-0.7,3.9-1.3c0.4-0.4,0.7-1,0.7-1.9C316.1,6.8,315.5,6.4,314.4,6.2z M303.6,4.3c-0.7-0.3-1.3-0.4-2-0.3\n" +
    "                            c-0.5,0.2-0.7,0.4-0.8,0.7c0,0.1,0,0.3,0,0.4c0.1,0.2,0.3,0.5,0.8,0.9c0.5,0.4,0.7,0.7,0.9,0.9c0.1,0.1,0.1,0.4,0,0.8\n" +
    "                            c0,0.4,0,0.8,0.2,1.1c0.2,0.4,0.5,0.5,0.8,0.6c0.3,0.1,0.6,0,0.9-0.1c0.7-0.4,1.2-1.1,1.3-1.8c0-0.6,0-1.1-0.2-1.6\n" +
    "                            C304.8,5.3,304.3,4.7,303.6,4.3z\"/>\n" +
    "                    </g>\n" +
    "                </g>\n" +
    "            </g>\n" +
    "            <g class=\"one-foot-print1\" id=\"XMLID_14_\" transform=\"matrix( 2.12353515625, 0, 0, 2.12353515625, 105.25,37.95) \">\n" +
    "                <g id=\"XMLID_15_\" transform=\"matrix( 1, 0, 0, 1, 0,0) \">\n" +
    "                    <g id=\"XMLID_34_\">\n" +
    "                        <g id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_FILL_15_\">\n" +
    "                            <path id=\"XMLID_35_\" d=\"M306.2,37.6c-0.3,0.3-0.5,0.6-0.6,0.9c-0.1,0.4,0,0.7,0.2,1c0.2,0.3,0.4,0.4,0.7,0.5\n" +
    "                                c0.8,0.2,1.6,0,2.2-0.5c0.4-0.4,0.7-0.8,0.9-1.3c0.2-0.9,0.2-1.7-0.2-2.5c-0.3-0.7-0.7-1.2-1.3-1.5c-0.5-0.2-0.8-0.2-1.1,0\n" +
    "                                c-0.1,0.1-0.2,0.2-0.3,0.3c-0.1,0.2-0.1,0.6,0,1.2c0.1,0.6,0.1,1,0.1,1.3C306.7,37.2,306.5,37.4,306.2,37.6 M316,44.4\n" +
    "                                c-0.5-0.7-1.3-1.3-2.2-1.9c-1.1-0.7-2-1.2-2.7-1.5c-1.1-0.5-1.8-0.5-2.2-0.2c-0.2,0.2-0.3,0.5-0.4,0.9c0,0.4,0,0.9,0.2,1.3\n" +
    "                                c0.4,1.2,1.1,2.1,2.1,2.8c1.6,1.1,2.8,1.6,3.8,1.6c0.6,0,1.2-0.3,1.8-0.9C316.9,46,316.7,45.3,316,44.4 M312.8,37\n" +
    "                                c-1.4,0.2-2.2,0.5-2.4,1.1c-0.2,0.5,0.3,1.2,1.6,2.1c1.1,0.7,2.2,1.3,3.5,1.7c1.2,0.4,2.2,0.5,3.2,0.5c1.1-0.1,1.7-0.4,1.8-1\n" +
    "                                c0.5-1.9-0.9-3.2-4-4.1C315.3,36.9,314.1,36.9,312.8,37 M319.1,33.6c-0.2-0.4-0.4-0.7-0.7-0.9c-0.9-0.8-2.3-1.1-4.3-1\n" +
    "                                c-0.9,0-1.8,0.4-2.6,1.1c-0.4,0.3-0.6,0.6-0.8,0.9c-0.2,0.3-0.2,0.6-0.1,0.9c0,0.2,0.2,0.3,0.4,0.5c0.3,0.2,0.7,0.3,1.2,0.4\n" +
    "                                c0.9,0.2,1.9,0.3,3,0.3c0.6,0,1.3-0.1,2-0.2c1.3-0.3,2-0.7,2-1.3C319.3,34.2,319.2,33.9,319.1,33.6z\"/>\n" +
    "                        </g>\n" +
    "                    </g>\n" +
    "                    <g id=\"XMLID_17_\">\n" +
    "                        <path id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_1_STROKES_15_\" class=\"st3\" d=\"M317.2,35.7c-0.7,0.1-1.3,0.2-2,0.2\n" +
    "                            c-1.1,0-2.1-0.1-3-0.3c-0.5-0.1-0.9-0.2-1.2-0.4c-0.3-0.2-0.4-0.3-0.4-0.5c-0.1-0.3,0-0.6,0.1-0.9c0.2-0.3,0.4-0.6,0.8-0.9\n" +
    "                            c0.8-0.7,1.7-1,2.6-1.1c1.9-0.1,3.4,0.2,4.3,1c0.3,0.3,0.6,0.6,0.7,0.9c0.1,0.3,0.2,0.5,0.1,0.7C319.2,35,318.5,35.4,317.2,35.7z\n" +
    "                             M316.5,37.2c-1.1-0.3-2.4-0.4-3.7-0.2c-1.4,0.2-2.2,0.5-2.4,1.1c-0.2,0.5,0.3,1.2,1.6,2.1c1.1,0.7,2.2,1.3,3.5,1.7\n" +
    "                            c1.2,0.4,2.2,0.5,3.2,0.5c1.1-0.1,1.7-0.4,1.8-1C321,39.5,319.6,38.1,316.5,37.2z M316,44.4c-0.5-0.7-1.3-1.3-2.2-1.9\n" +
    "                            c-1.1-0.7-2-1.2-2.7-1.5c-1.1-0.5-1.8-0.5-2.2-0.2c-0.2,0.2-0.3,0.5-0.4,0.9c0,0.4,0,0.9,0.2,1.3c0.4,1.2,1.1,2.1,2.1,2.8\n" +
    "                            c1.6,1.1,2.8,1.6,3.8,1.6c0.6,0,1.2-0.3,1.8-0.9C316.9,46,316.7,45.3,316,44.4z M309.3,35.8c-0.3-0.7-0.7-1.2-1.3-1.5\n" +
    "                            c-0.5-0.2-0.8-0.2-1.1,0c-0.1,0.1-0.2,0.2-0.3,0.3c-0.1,0.2-0.1,0.6,0,1.2s0.1,1,0.1,1.3c0,0.2-0.2,0.4-0.5,0.6\n" +
    "                            c-0.3,0.3-0.5,0.6-0.6,0.9c-0.1,0.4,0,0.7,0.2,1c0.2,0.3,0.4,0.4,0.7,0.5c0.8,0.2,1.6,0,2.2-0.5c0.4-0.4,0.7-0.8,0.9-1.3\n" +
    "                            C309.6,37.4,309.6,36.6,309.3,35.8z\"/>\n" +
    "                    </g>\n" +
    "                </g>\n" +
    "            </g>\n" +
    "            <g class=\"one-foot-print1\" id=\"XMLID_38_\" transform=\"matrix( 2.12353515625, 0, 0, 2.12353515625, 105.25,37.95) \">\n" +
    "                <g id=\"XMLID_39_\" transform=\"matrix( 1, 0, 0, 1, 0,0) \">\n" +
    "                    <g id=\"XMLID_43_\">\n" +
    "                        <g id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_FILL_16_\">\n" +
    "                            <path id=\"XMLID_44_\" d=\"M345.3-9.9c0.3,0.3,0.5,0.6,0.8,0.7c0.4,0.1,0.7,0.1,1-0.1s0.4-0.3,0.6-0.6c0.3-0.8,0.2-1.6-0.2-2.2\n" +
    "                                c-0.3-0.4-0.7-0.8-1.2-1.1c-0.9-0.3-1.7-0.4-2.5-0.1c-0.7,0.2-1.3,0.5-1.7,1.1c-0.3,0.5-0.3,0.8-0.1,1.1\n" +
    "                                c0.1,0.1,0.2,0.2,0.3,0.3c0.2,0.1,0.6,0.2,1.2,0.2s1,0,1.3,0.1C344.9-10.4,345.1-10.2,345.3-9.9 M353.2-18.8\n" +
    "                                c-0.8,0.4-1.5,1.1-2.2,1.9c-0.8,1-1.4,1.8-1.8,2.5c-0.6,1-0.7,1.7-0.5,2.2c0.2,0.2,0.5,0.4,0.8,0.5c0.4,0.1,0.9,0.1,1.3,0\n" +
    "                                c1.2-0.2,2.2-0.8,3-1.7c1.3-1.4,1.9-2.6,2.1-3.6c0.1-0.6-0.1-1.2-0.7-1.9C354.9-19.5,354.2-19.4,353.2-18.8 M345.4-16.5\n" +
    "                                c0,1.4,0.2,2.2,0.8,2.5c0.5,0.3,1.2-0.1,2.3-1.3c0.8-1,1.6-2,2.1-3.3c0.5-1.1,0.8-2.1,0.9-3.1c0-1.1-0.2-1.7-0.8-1.9\n" +
    "                                c-1.8-0.7-3.3,0.5-4.6,3.4C345.6-19,345.5-17.8,345.4-16.5 M342.8-23.2c-0.4,0.1-0.7,0.3-1,0.6c-0.9,0.8-1.4,2.1-1.5,4.1\n" +
    "                                c-0.1,0.9,0.2,1.8,0.8,2.7c0.2,0.4,0.5,0.7,0.8,0.9c0.3,0.2,0.6,0.3,0.9,0.2c0.2,0,0.3-0.2,0.5-0.3c0.2-0.3,0.4-0.7,0.5-1.1\n" +
    "                                c0.3-0.9,0.5-1.8,0.7-2.9c0.1-0.6,0.1-1.3,0.1-2c-0.1-1.3-0.4-2.1-1-2.1C343.5-23.3,343.2-23.2,342.8-23.2z\"/>\n" +
    "                        </g>\n" +
    "                    </g>\n" +
    "                    <g id=\"XMLID_42_\">\n" +
    "                        <path id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_1_STROKES_16_\" class=\"st3\" d=\"M344.7-21c0,0.7,0,1.3-0.1,2\n" +
    "                            c-0.1,1.1-0.4,2.1-0.7,2.9c-0.2,0.5-0.3,0.9-0.5,1.1c-0.2,0.3-0.3,0.4-0.5,0.3c-0.3,0.1-0.6-0.1-0.9-0.2\n" +
    "                            c-0.3-0.2-0.5-0.5-0.8-0.9c-0.6-0.9-0.8-1.8-0.8-2.7c0.1-1.9,0.6-3.3,1.5-4.1c0.3-0.3,0.7-0.5,1-0.6c0.3-0.1,0.5-0.1,0.7,0\n" +
    "                            C344.2-23.1,344.6-22.4,344.7-21z M346.1-20.1c-0.4,1.1-0.7,2.3-0.7,3.6c0,1.4,0.2,2.2,0.8,2.5c0.5,0.3,1.2-0.1,2.3-1.3\n" +
    "                            c0.8-1,1.6-2,2.1-3.3c0.5-1.1,0.8-2.1,0.9-3.1c0-1.1-0.2-1.7-0.8-1.9C348.8-24.3,347.4-23.1,346.1-20.1z M353.2-18.8\n" +
    "                            c-0.8,0.4-1.5,1.1-2.2,1.9c-0.8,1-1.4,1.8-1.8,2.5c-0.6,1-0.7,1.7-0.5,2.2c0.2,0.2,0.5,0.4,0.8,0.5c0.4,0.1,0.9,0.1,1.3,0\n" +
    "                            c1.2-0.2,2.2-0.8,3-1.7c1.3-1.4,1.9-2.6,2.1-3.6c0.1-0.6-0.1-1.2-0.7-1.9C354.9-19.5,354.2-19.4,353.2-18.8z M343.8-13.2\n" +
    "                            c-0.7,0.2-1.3,0.5-1.7,1.1c-0.3,0.5-0.3,0.8-0.1,1.1c0.1,0.1,0.2,0.2,0.3,0.3c0.2,0.1,0.6,0.2,1.2,0.2c0.6,0,1,0,1.3,0.1\n" +
    "                            c0.2,0,0.4,0.2,0.5,0.6c0.3,0.3,0.5,0.6,0.8,0.7c0.4,0.1,0.7,0.1,1-0.1s0.4-0.3,0.6-0.6c0.3-0.8,0.2-1.6-0.2-2.2\n" +
    "                            c-0.3-0.4-0.7-0.8-1.2-1.1C345.4-13.3,344.6-13.4,343.8-13.2z\"/>\n" +
    "                    </g>\n" +
    "                </g>\n" +
    "            </g>\n" +
    "            <g class=\"one-foot-print1\" id=\"XMLID_45_\" transform=\"matrix( 2.12353515625, 0, 0, 2.12353515625, 105.25,37.95) \">\n" +
    "                <g id=\"XMLID_46_\" transform=\"matrix( 1, 0, 0, 1, 0,0) \">\n" +
    "                    <g id=\"XMLID_48_\">\n" +
    "                        <g id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_FILL_17_\">\n" +
    "                            <path id=\"XMLID_49_\" d=\"M350.5,24.3c-0.1,0.4-0.2,0.8-0.1,1.1c0.1,0.4,0.3,0.6,0.6,0.8s0.5,0.2,0.9,0.1c0.8-0.2,1.4-0.7,1.7-1.5\n" +
    "                                c0.2-0.5,0.2-1,0.2-1.6c-0.2-0.9-0.6-1.6-1.3-2.1c-0.6-0.5-1.2-0.7-1.8-0.7c-0.5,0.1-0.8,0.2-1,0.5c0,0.1-0.1,0.3-0.1,0.4\n" +
    "                                c0,0.2,0.2,0.6,0.6,1.1c0.4,0.5,0.6,0.8,0.7,1.1C350.8,23.7,350.7,24,350.5,24.3 M362.4,25.6c-0.8-0.4-1.8-0.5-2.8-0.7\n" +
    "                                c-1.3-0.1-2.3-0.1-3.1-0.1c-1.2,0.1-1.8,0.4-2,0.8c-0.1,0.3,0,0.6,0.1,1c0.2,0.4,0.4,0.8,0.8,1.1c0.9,0.9,1.9,1.3,3.2,1.5\n" +
    "                                c1.9,0.2,3.2,0.1,4.1-0.3c0.5-0.3,0.9-0.8,1.2-1.6C363.9,26.6,363.4,26.1,362.4,25.6 M356,20.6c-1.1,0.8-1.7,1.5-1.6,2.1\n" +
    "                                c0.1,0.5,0.8,0.9,2.4,1.1c1.3,0.1,2.6,0.1,3.9-0.1c1.2-0.2,2.2-0.6,3.1-1c0.9-0.6,1.3-1.1,1.1-1.7c-0.4-1.9-2.3-2.4-5.4-1.8\n" +
    "                                C358.2,19.4,357.1,19.9,356,20.6 M360,14.7c-0.4-0.3-0.7-0.4-1-0.5c-1.2-0.3-2.5,0.1-4.3,1.1c-0.8,0.4-1.4,1.2-1.8,2.2\n" +
    "                                c-0.2,0.5-0.3,0.8-0.3,1.2s0.1,0.6,0.3,0.8c0.1,0.2,0.3,0.2,0.6,0.3c0.4,0,0.8-0.1,1.2-0.2c0.9-0.2,1.8-0.6,2.8-1.1\n" +
    "                                c0.5-0.3,1.1-0.7,1.7-1.1c1-0.9,1.4-1.5,1.2-2.1C360.5,15.1,360.2,14.9,360,14.7z\"/>\n" +
    "                        </g>\n" +
    "                    </g>\n" +
    "                    <g id=\"XMLID_47_\">\n" +
    "                        <path id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_1_STROKES_17_\" class=\"st3\" d=\"M359.3,17.4c-0.6,0.4-1.1,0.8-1.7,1.1\n" +
    "                            c-1,0.5-1.9,0.9-2.8,1.1c-0.5,0.1-0.9,0.2-1.2,0.2c-0.4,0-0.5-0.1-0.6-0.3c-0.2-0.2-0.3-0.5-0.3-0.8c0-0.4,0.1-0.7,0.3-1.2\n" +
    "                            c0.4-1,1-1.7,1.8-2.2c1.6-1,3.1-1.4,4.3-1.1c0.4,0.1,0.8,0.3,1,0.5c0.2,0.2,0.4,0.4,0.4,0.6C360.8,15.9,360.3,16.5,359.3,17.4z\n" +
    "                             M359.4,19.1c-1.1,0.2-2.3,0.8-3.4,1.5c-1.1,0.8-1.7,1.5-1.6,2.1c0.1,0.5,0.8,0.9,2.4,1.1c1.3,0.1,2.6,0.1,3.9-0.1\n" +
    "                            c1.2-0.2,2.2-0.6,3.1-1c0.9-0.6,1.3-1.1,1.1-1.7C364.4,18.9,362.5,18.4,359.4,19.1z M362.4,25.6c-0.8-0.4-1.8-0.5-2.8-0.7\n" +
    "                            c-1.3-0.1-2.3-0.1-3.1-0.1c-1.2,0.1-1.8,0.4-2,0.8c-0.1,0.3,0,0.6,0.1,1c0.2,0.4,0.4,0.8,0.8,1.1c0.9,0.9,1.9,1.3,3.2,1.5\n" +
    "                            c1.9,0.2,3.2,0.1,4.1-0.3c0.5-0.3,0.9-0.8,1.2-1.6C363.9,26.6,363.4,26.1,362.4,25.6z M352.4,21.2c-0.6-0.5-1.2-0.7-1.8-0.7\n" +
    "                            c-0.5,0.1-0.8,0.2-1,0.5c0,0.1-0.1,0.3-0.1,0.4c0,0.2,0.2,0.6,0.6,1.1c0.4,0.5,0.6,0.8,0.7,1.1c0.1,0.2,0,0.4-0.2,0.8\n" +
    "                            c-0.1,0.4-0.2,0.8-0.1,1.1c0.1,0.4,0.3,0.6,0.6,0.8c0.3,0.2,0.5,0.2,0.9,0.1c0.8-0.2,1.4-0.7,1.7-1.5c0.2-0.5,0.2-1,0.2-1.6\n" +
    "                            C353.4,22.5,353,21.7,352.4,21.2z\"/>\n" +
    "                    </g>\n" +
    "                </g>\n" +
    "            </g>\n" +
    "            <g class=\"one-foot-print1\" id=\"XMLID_50_\" transform=\"matrix( 2.12353515625, 0, 0, 2.12353515625, 105.25,37.95) \">\n" +
    "                <g id=\"XMLID_51_\" transform=\"matrix( 1, 0, 0, 1, 0,0) \">\n" +
    "                    <g id=\"XMLID_53_\">\n" +
    "                        <g id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_FILL_18_\">\n" +
    "                            <path id=\"XMLID_54_\" d=\"M359.2-53.6c0.4,0.2,0.7,0.3,1,0.3c0.4,0,0.7-0.2,0.9-0.5c0.2-0.3,0.3-0.5,0.3-0.8\n" +
    "                                c0-0.8-0.5-1.5-1.1-1.9c-0.5-0.3-1-0.4-1.5-0.5c-0.9,0.1-1.7,0.3-2.3,0.9c-0.6,0.5-0.9,1-1,1.7c0,0.5,0,0.8,0.3,1\n" +
    "                                c0.1,0.1,0.3,0.1,0.4,0.2c0.2,0,0.6-0.1,1.1-0.4s0.9-0.4,1.2-0.5C358.7-53.9,358.9-53.8,359.2-53.6 M362.6-65\n" +
    "                                c-0.5,0.7-0.9,1.6-1.2,2.7c-0.3,1.3-0.5,2.3-0.6,3c-0.1,1.2,0.1,1.9,0.5,2.2c0.3,0.1,0.6,0.1,1,0.1c0.4-0.1,0.9-0.3,1.2-0.6\n" +
    "                                c1-0.7,1.7-1.7,2-2.8c0.6-1.9,0.7-3.2,0.4-4.1c-0.2-0.6-0.6-1.1-1.4-1.4C363.9-66.4,363.3-66,362.6-65 M356.5-59.7\n" +
    "                                c0.6,1.3,1.1,1.9,1.8,2c0.5,0,1.1-0.6,1.5-2.2c0.3-1.3,0.6-2.5,0.6-3.8c0-1.3-0.2-2.2-0.5-3.2c-0.4-1-0.9-1.5-1.5-1.4\n" +
    "                                c-2,0.1-2.8,1.8-2.7,5C355.7-62,356.1-60.9,356.5-59.7 M351.4-64.7c-0.3,0.3-0.5,0.6-0.6,0.9c-0.5,1.1-0.4,2.5,0.3,4.4\n" +
    "                                c0.3,0.9,0.9,1.6,1.8,2.2c0.4,0.3,0.8,0.4,1.1,0.5s0.6,0,0.9-0.2c0.2-0.1,0.2-0.3,0.4-0.5c0.1-0.3,0.1-0.8,0-1.3\n" +
    "                                c-0.1-0.9-0.3-1.9-0.6-3c-0.2-0.6-0.5-1.2-0.8-1.8c-0.7-1.2-1.3-1.7-1.8-1.5C351.9-65,351.7-64.9,351.4-64.7z\"/>\n" +
    "                        </g>\n" +
    "                    </g>\n" +
    "                    <g id=\"XMLID_52_\">\n" +
    "                        <path id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_1_STROKES_18_\" class=\"st3\" d=\"M354-63.5c0.3,0.6,0.6,1.2,0.8,1.8\n" +
    "                            c0.3,1,0.5,2,0.6,3c0.1,0.5,0.1,0.9,0,1.3c-0.1,0.3-0.2,0.5-0.4,0.5c-0.3,0.2-0.6,0.2-0.9,0.2c-0.3-0.1-0.7-0.2-1.1-0.5\n" +
    "                            c-0.9-0.6-1.5-1.3-1.8-2.2c-0.7-1.8-0.8-3.3-0.3-4.4c0.2-0.4,0.4-0.8,0.6-0.9c0.3-0.2,0.4-0.3,0.6-0.3\n" +
    "                            C352.7-65.2,353.3-64.6,354-63.5z M355.6-63.3c0,1.1,0.3,2.4,0.9,3.6c0.6,1.3,1.1,1.9,1.8,2c0.5,0,1.1-0.6,1.5-2.2\n" +
    "                            c0.3-1.3,0.6-2.5,0.6-3.8c0-1.3-0.2-2.2-0.5-3.2c-0.4-1-0.9-1.5-1.5-1.4C356.4-68.2,355.6-66.5,355.6-63.3z M362.6-65\n" +
    "                            c-0.5,0.7-0.9,1.6-1.2,2.7c-0.3,1.3-0.5,2.3-0.6,3c-0.1,1.2,0.1,1.9,0.5,2.2c0.3,0.1,0.6,0.1,1,0.1c0.4-0.1,0.9-0.3,1.2-0.6\n" +
    "                            c1-0.7,1.7-1.7,2-2.8c0.6-1.9,0.7-3.2,0.4-4.1c-0.2-0.6-0.6-1.1-1.4-1.4C363.9-66.4,363.3-66,362.6-65z M356.5-56\n" +
    "                            c-0.6,0.5-0.9,1-1,1.7c0,0.5,0,0.8,0.3,1c0.1,0.1,0.3,0.1,0.4,0.2c0.2,0,0.6-0.1,1.1-0.4s0.9-0.4,1.2-0.5\n" +
    "                            c0.2-0.1,0.4,0.1,0.7,0.3c0.4,0.2,0.7,0.3,1,0.3c0.4,0,0.7-0.2,0.9-0.5c0.2-0.3,0.3-0.5,0.3-0.8c0-0.8-0.5-1.5-1.1-1.9\n" +
    "                            c-0.5-0.3-1-0.4-1.5-0.5C357.9-56.7,357.1-56.5,356.5-56z\"/>\n" +
    "                    </g>\n" +
    "                </g>\n" +
    "            </g>\n" +
    "            <g class=\"one-foot-print1\" id=\"XMLID_55_\" transform=\"matrix( 2.12353515625, 0, 0, 2.12353515625, 105.25,37.95) \">\n" +
    "                <g id=\"XMLID_56_\" transform=\"matrix( 1, 0, 0, 1, 0,0) \">\n" +
    "                    <g id=\"XMLID_58_\">\n" +
    "                        <g id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_FILL_19_\">\n" +
    "                            <path id=\"XMLID_59_\" d=\"M381-21c0.1,0.4,0.2,0.7,0.4,1c0.3,0.3,0.6,0.4,1,0.4c0.4,0,0.6-0.1,0.8-0.3c0.6-0.6,0.9-1.4,0.8-2.1\n" +
    "                                c-0.1-0.6-0.3-1-0.6-1.5c-0.7-0.7-1.3-1.1-2.2-1.2c-0.8-0.1-1.4-0.1-2,0.3c-0.4,0.3-0.6,0.6-0.6,0.9c0,0.1,0.1,0.3,0.1,0.4\n" +
    "                                c0.1,0.2,0.5,0.4,1,0.6c0.6,0.2,0.9,0.5,1.2,0.6C380.9-21.6,381-21.3,381-21 M392-25.7c-0.9,0-1.8,0.4-2.8,0.8\n" +
    "                                c-1.2,0.6-2.1,1-2.7,1.5c-1,0.7-1.4,1.3-1.3,1.7c0.1,0.3,0.3,0.5,0.5,0.8c0.3,0.2,0.8,0.5,1.2,0.5c1.2,0.3,2.4,0.2,3.5-0.3\n" +
    "                                c1.8-0.8,2.9-1.5,3.4-2.3c0.3-0.5,0.4-1.2,0.2-2C393.8-25.6,393.1-25.8,392-25.7 M383.9-26.9c-0.6,1.3-0.8,2.1-0.4,2.6\n" +
    "                                c0.3,0.4,1.2,0.4,2.6-0.2c1.2-0.6,2.3-1.2,3.3-2c1-0.8,1.6-1.6,2.1-2.4c0.5-1,0.6-1.6,0.1-2.1c-1.3-1.4-3.2-1-5.6,1.2\n" +
    "                                C385.2-29.1,384.6-28.1,383.9-26.9 M384.4-34.1c-0.4,0-0.8,0-1.1,0.1c-1.2,0.3-2.2,1.4-3.2,3.1c-0.5,0.8-0.6,1.7-0.5,2.8\n" +
    "                                c0,0.5,0.2,0.8,0.3,1.2c0.1,0.3,0.4,0.5,0.7,0.6c0.2,0.1,0.4,0,0.6-0.1c0.3-0.1,0.6-0.4,1-0.8c0.7-0.7,1.3-1.4,1.9-2.4\n" +
    "                                c0.3-0.5,0.6-1.2,0.9-1.8c0.4-1.3,0.5-2.1,0-2.4C385.1-33.9,384.8-34,384.4-34.1z\"/>\n" +
    "                        </g>\n" +
    "                    </g>\n" +
    "                    <g id=\"XMLID_57_\">\n" +
    "                        <path id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_1_STROKES_19_\" class=\"st3\" d=\"M385.2-31.3c-0.3,0.6-0.5,1.2-0.9,1.8\n" +
    "                            c-0.6,0.9-1.2,1.7-1.9,2.4c-0.4,0.4-0.7,0.7-1,0.8c-0.3,0.1-0.5,0.2-0.6,0.1c-0.3-0.1-0.5-0.3-0.7-0.6c-0.1-0.3-0.3-0.7-0.3-1.2\n" +
    "                            c-0.2-1.1,0.1-2,0.5-2.8c0.9-1.7,2-2.8,3.2-3.1c0.4-0.1,0.8-0.2,1.1-0.1c0.3,0.1,0.5,0.1,0.6,0.3\n" +
    "                            C385.7-33.4,385.6-32.6,385.2-31.3z M386.1-29.9c-0.8,0.8-1.6,1.8-2.2,3c-0.6,1.3-0.8,2.1-0.4,2.6c0.3,0.4,1.2,0.4,2.6-0.2\n" +
    "                            c1.2-0.6,2.3-1.2,3.3-2c1-0.8,1.6-1.6,2.1-2.4c0.5-1,0.6-1.6,0.1-2.1C390.4-32.5,388.5-32.1,386.1-29.9z M392-25.7\n" +
    "                            c-0.9,0-1.8,0.4-2.8,0.8c-1.2,0.6-2.1,1-2.7,1.5c-1,0.7-1.4,1.3-1.3,1.7c0.1,0.3,0.3,0.5,0.5,0.8c0.3,0.2,0.8,0.5,1.2,0.5\n" +
    "                            c1.2,0.3,2.4,0.2,3.5-0.3c1.8-0.8,2.9-1.5,3.4-2.3c0.3-0.5,0.4-1.2,0.2-2C393.8-25.6,393.1-25.8,392-25.7z M381-24.6\n" +
    "                            c-0.8-0.1-1.4-0.1-2,0.3c-0.4,0.3-0.6,0.6-0.6,0.9c0,0.1,0.1,0.3,0.1,0.4c0.1,0.2,0.5,0.4,1,0.6s0.9,0.5,1.2,0.6\n" +
    "                            c0.2,0.1,0.2,0.4,0.2,0.7c0.1,0.4,0.2,0.7,0.4,1c0.3,0.3,0.6,0.4,1,0.4s0.6-0.1,0.8-0.3c0.6-0.6,0.9-1.4,0.8-2.1\n" +
    "                            c-0.1-0.6-0.3-1-0.6-1.5C382.6-24,381.9-24.4,381-24.6z\"/>\n" +
    "                    </g>\n" +
    "                </g>\n" +
    "            </g>\n" +
    "            <g class=\"one-foot-print1\" id=\"XMLID_60_\" transform=\"matrix( 2.12353515625, 0, 0, 2.12353515625, 105.25,37.95) \">\n" +
    "                <g id=\"XMLID_63_\" transform=\"matrix( 1, 0, 0, 1, 0,0) \">\n" +
    "                    <g id=\"XMLID_65_\">\n" +
    "                        <g id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_FILL_20_\">\n" +
    "                            <path id=\"XMLID_66_\" d=\"M396.7-68.2c0,0.4,0.1,0.8,0.3,1c0.2,0.3,0.5,0.5,0.9,0.5c0.4,0,0.6,0,0.8-0.2c0.7-0.5,1-1.2,1.1-2\n" +
    "                                c0-0.6-0.1-1.1-0.4-1.5c-0.6-0.7-1.2-1.3-2-1.5c-0.7-0.2-1.4-0.3-2,0c-0.5,0.2-0.7,0.5-0.7,0.8c0,0.1,0,0.3,0,0.4\n" +
    "                                c0.1,0.2,0.4,0.5,0.9,0.8c0.5,0.3,0.8,0.6,1,0.8C396.8-68.8,396.8-68.6,396.7-68.2 M408.3-71.3c-0.9-0.1-1.8,0.1-2.9,0.4\n" +
    "                                c-1.2,0.4-2.2,0.7-2.9,1.1c-1.1,0.5-1.6,1-1.6,1.5c0,0.3,0.2,0.6,0.4,0.9c0.3,0.3,0.7,0.6,1.1,0.7c1.2,0.5,2.3,0.5,3.5,0.2\n" +
    "                                c1.9-0.5,3-1.1,3.7-1.8c0.4-0.5,0.6-1.1,0.5-2C410.1-71,409.4-71.3,408.3-71.3 M400.5-73.7c-0.8,1.2-1.1,2-0.7,2.5\n" +
    "                                c0.2,0.5,1.1,0.6,2.6,0.2c1.2-0.4,2.4-0.8,3.6-1.5c1.1-0.6,1.8-1.3,2.5-2.1c0.6-0.9,0.8-1.5,0.4-2c-1.1-1.6-3-1.4-5.7,0.4\n" +
    "                                C402.1-75.6,401.3-74.7,400.5-73.7 M402.1-80.7c-0.4-0.1-0.8-0.2-1.1-0.1c-1.2,0.2-2.3,1-3.6,2.6c-0.6,0.7-0.9,1.6-0.9,2.7\n" +
    "                                c0,0.5,0.1,0.8,0.2,1.2c0.1,0.3,0.3,0.5,0.6,0.7c0.2,0.1,0.4,0,0.6,0c0.3-0.1,0.7-0.3,1.1-0.6c0.7-0.6,1.5-1.2,2.2-2.1\n" +
    "                                c0.4-0.5,0.8-1,1.2-1.6c0.6-1.2,0.8-2,0.3-2.4C402.6-80.4,402.4-80.5,402.1-80.7z\"/>\n" +
    "                        </g>\n" +
    "                    </g>\n" +
    "                    <g id=\"XMLID_64_\">\n" +
    "                        <path id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_1_STROKES_20_\" class=\"st3\" d=\"M402.4-77.8c-0.4,0.6-0.7,1.1-1.2,1.6\n" +
    "                            c-0.7,0.8-1.4,1.5-2.2,2.1c-0.4,0.3-0.7,0.6-1.1,0.6c-0.3,0.1-0.5,0.1-0.6,0c-0.3-0.1-0.5-0.4-0.6-0.7c-0.1-0.3-0.2-0.7-0.2-1.2\n" +
    "                            c0-1.1,0.4-1.9,0.9-2.7c1.2-1.5,2.4-2.4,3.6-2.6c0.4,0,0.8-0.1,1.1,0.1c0.3,0.1,0.5,0.2,0.6,0.4C403.2-79.8,403-79,402.4-77.8z\n" +
    "                             M403.1-76.3c-0.9,0.6-1.9,1.6-2.6,2.7c-0.8,1.2-1.1,2-0.7,2.5c0.2,0.5,1.1,0.6,2.6,0.2c1.2-0.4,2.4-0.8,3.6-1.5\n" +
    "                            c1.1-0.6,1.8-1.3,2.5-2.1c0.6-0.9,0.8-1.5,0.4-2C407.7-78.3,405.8-78.1,403.1-76.3z M408.3-71.3c-0.9-0.1-1.8,0.1-2.9,0.4\n" +
    "                            c-1.2,0.4-2.2,0.7-2.9,1.1c-1.1,0.5-1.6,1-1.6,1.5c0,0.3,0.2,0.6,0.4,0.9c0.3,0.3,0.7,0.6,1.1,0.7c1.2,0.5,2.3,0.5,3.5,0.2\n" +
    "                            c1.9-0.5,3-1.1,3.7-1.8c0.4-0.5,0.6-1.1,0.5-2C410.1-71,409.4-71.3,408.3-71.3z M397.3-71.8c-0.7-0.2-1.4-0.3-2,0\n" +
    "                            c-0.5,0.2-0.7,0.5-0.7,0.8c0,0.1,0,0.3,0,0.4c0.1,0.2,0.4,0.5,0.9,0.8c0.5,0.3,0.8,0.6,1,0.8c0.2,0.1,0.2,0.4,0.1,0.8\n" +
    "                            c0,0.4,0.1,0.8,0.3,1c0.2,0.3,0.5,0.5,0.9,0.5c0.4,0,0.6,0,0.8-0.2c0.7-0.5,1-1.2,1.1-2c0-0.6-0.1-1.1-0.4-1.5\n" +
    "                            C398.7-71,398.1-71.5,397.3-71.8z\"/>\n" +
    "                    </g>\n" +
    "                </g>\n" +
    "            </g>\n" +
    "            <g class=\"one-foot-print1\" id=\"XMLID_76_\" transform=\"matrix( 2.12353515625, 0, 0, 2.12353515625, 105.25,37.95) \">\n" +
    "                <g id=\"XMLID_77_\" transform=\"matrix( 1, 0, 0, 1, 0,0) \">\n" +
    "                    <g id=\"XMLID_79_\">\n" +
    "                        <g id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_FILL_21_\">\n" +
    "                            <path id=\"XMLID_80_\" d=\"M380.6-100.6c0.3,0.3,0.7,0.4,1,0.5c0.4,0,0.7-0.1,1-0.3c0.3-0.2,0.3-0.5,0.4-0.8\n" +
    "                                c0.1-0.8-0.2-1.6-0.8-2.1c-0.5-0.3-0.9-0.6-1.4-0.7c-0.9-0.1-1.7,0-2.4,0.5c-0.7,0.4-1.1,0.9-1.3,1.5c-0.1,0.5-0.1,0.8,0.2,1.1\n" +
    "                                c0.1,0.1,0.2,0.2,0.3,0.3c0.2,0.1,0.6,0,1.2-0.2c0.6-0.2,1-0.2,1.3-0.3C380.2-101,380.4-100.9,380.6-100.6 M385.9-111.3\n" +
    "                                c-0.6,0.6-1.1,1.5-1.6,2.4c-0.5,1.2-0.9,2.1-1.1,2.9c-0.3,1.2-0.2,1.9,0.1,2.2c0.2,0.2,0.5,0.2,0.9,0.3c0.4-0.1,0.9-0.1,1.3-0.4\n" +
    "                                c1.1-0.6,1.9-1.4,2.5-2.5c0.9-1.7,1.2-3,1.1-4c-0.1-0.6-0.5-1.1-1.1-1.7C387.3-112.5,386.7-112.2,385.9-111.3 M379-107\n" +
    "                                c0.4,1.4,0.8,2.1,1.4,2.2c0.5,0.1,1.1-0.5,1.9-1.9c0.5-1.2,1-2.4,1.2-3.7c0.2-1.2,0.2-2.2,0-3.2c-0.3-1.1-0.6-1.6-1.2-1.6\n" +
    "                                c-2-0.2-3,1.3-3.5,4.5C378.6-109.5,378.7-108.3,379-107 M374.8-112.8c-0.4,0.3-0.6,0.5-0.8,0.8c-0.7,1-0.8,2.4-0.4,4.4\n" +
    "                                c0.1,0.9,0.6,1.7,1.5,2.4c0.4,0.4,0.7,0.5,1,0.7c0.3,0.2,0.6,0.1,0.9,0c0.2,0,0.3-0.2,0.4-0.5c0.2-0.3,0.2-0.7,0.2-1.2\n" +
    "                                c0.1-0.9,0-1.9-0.1-3c-0.1-0.6-0.3-1.3-0.5-2c-0.5-1.2-1-1.9-1.6-1.8C375.3-113.1,375.1-113,374.8-112.8z\"/>\n" +
    "                        </g>\n" +
    "                    </g>\n" +
    "                    <g id=\"XMLID_78_\">\n" +
    "                        <path id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_1_STROKES_21_\" class=\"st3\" d=\"M377.1-111.2c0.2,0.7,0.4,1.3,0.5,2\n" +
    "                            c0.2,1.1,0.2,2.1,0.1,3c0,0.5-0.1,0.9-0.2,1.2c-0.2,0.3-0.2,0.4-0.4,0.5c-0.3,0.1-0.6,0.1-0.9,0c-0.3-0.2-0.6-0.3-1-0.7\n" +
    "                            c-0.8-0.7-1.2-1.5-1.5-2.4c-0.4-1.9-0.3-3.4,0.4-4.4c0.3-0.3,0.5-0.7,0.8-0.8c0.3-0.1,0.5-0.3,0.7-0.2\n" +
    "                            C376.1-113.1,376.6-112.5,377.1-111.2z M378.7-110.7c-0.1,1.1-0.1,2.4,0.3,3.7c0.4,1.4,0.8,2.1,1.4,2.2c0.5,0.1,1.1-0.5,1.9-1.9\n" +
    "                            c0.5-1.2,1-2.4,1.2-3.7c0.2-1.2,0.2-2.2,0-3.2c-0.3-1.1-0.6-1.6-1.2-1.6C380.3-115.5,379.2-113.9,378.7-110.7z M385.9-111.3\n" +
    "                            c-0.6,0.6-1.1,1.5-1.6,2.4c-0.5,1.2-0.9,2.1-1.1,2.9c-0.3,1.2-0.2,1.9,0.1,2.2c0.2,0.2,0.5,0.2,0.9,0.3c0.4-0.1,0.9-0.1,1.3-0.4\n" +
    "                            c1.1-0.6,1.9-1.4,2.5-2.5c0.9-1.7,1.2-3,1.1-4c-0.1-0.6-0.5-1.1-1.1-1.7C387.3-112.5,386.7-112.2,385.9-111.3z M378.3-103.4\n" +
    "                            c-0.7,0.4-1.1,0.9-1.3,1.5c-0.1,0.5-0.1,0.8,0.2,1.1c0.1,0.1,0.2,0.2,0.3,0.3c0.2,0.1,0.6,0,1.2-0.2c0.6-0.2,1-0.2,1.3-0.3\n" +
    "                            c0.2,0,0.4,0.1,0.7,0.4c0.3,0.3,0.7,0.4,1,0.5c0.4,0,0.7-0.1,1-0.3c0.3-0.2,0.3-0.5,0.4-0.8c0.1-0.8-0.2-1.6-0.8-2.1\n" +
    "                            c-0.5-0.3-0.9-0.6-1.4-0.7C379.9-103.9,379.1-103.8,378.3-103.4z\"/>\n" +
    "                    </g>\n" +
    "                </g>\n" +
    "            </g>\n" +
    "            <g class=\"one-foot-print1\" id=\"XMLID_84_\" transform=\"matrix( 2.12353515625, 0, 0, 2.12353515625, 105.25,37.95) \">\n" +
    "                <g id=\"XMLID_85_\" transform=\"matrix( 1, 0, 0, 1, 0,0) \">\n" +
    "                    <g id=\"XMLID_87_\">\n" +
    "                        <g id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_FILL_22_\">\n" +
    "                            <path id=\"XMLID_90_\" d=\"M436.9-102.7c-0.3,0.3-0.6,0.6-0.7,0.8c-0.1,0.4-0.1,0.7,0.1,1c0.2,0.3,0.4,0.4,0.7,0.6\n" +
    "                                c0.8,0.3,1.6,0.1,2.2-0.3c0.4-0.4,0.8-0.7,1-1.2c0.3-0.9,0.4-1.7,0-2.5c-0.2-0.7-0.6-1.3-1.2-1.6c-0.5-0.2-0.8-0.3-1.1-0.1\n" +
    "                                c-0.1,0.1-0.2,0.2-0.3,0.3c-0.1,0.2-0.2,0.6-0.1,1.2c0,0.6,0,1,0,1.3C437.4-103.1,437.2-102.9,436.9-102.7 M446.1-95.1\n" +
    "                                c-0.4-0.7-1.2-1.4-2-2.1c-1-0.8-1.9-1.4-2.6-1.7c-1.1-0.6-1.7-0.7-2.2-0.4c-0.2,0.2-0.3,0.5-0.5,0.9c0,0.4-0.1,0.9,0.1,1.3\n" +
    "                                c0.3,1.2,0.9,2.2,1.8,3c1.5,1.2,2.6,1.8,3.6,1.9c0.6,0.1,1.2-0.2,1.9-0.7C446.9-93.5,446.7-94.2,446.1-95.1 M443.5-102.8\n" +
    "                                c-1.4,0.1-2.2,0.3-2.5,0.9c-0.2,0.5,0.2,1.2,1.4,2.2c1,0.8,2.1,1.5,3.3,2c1.2,0.5,2.1,0.7,3.1,0.8c1.1,0,1.7-0.2,1.9-0.8\n" +
    "                                c0.7-1.8-0.6-3.3-3.6-4.4C446-102.7,444.8-102.8,443.5-102.8 M450.1-105.6c-0.2-0.4-0.3-0.7-0.6-1c-0.8-0.9-2.2-1.3-4.2-1.4\n" +
    "                                c-0.9-0.1-1.8,0.2-2.7,0.9c-0.4,0.3-0.7,0.5-0.9,0.8c-0.2,0.3-0.3,0.6-0.2,0.9c0,0.2,0.2,0.3,0.4,0.5c0.3,0.2,0.7,0.4,1.2,0.5\n" +
    "                                c0.9,0.3,1.9,0.5,3,0.6c0.6,0.1,1.3,0,2,0c1.3-0.2,2.1-0.5,2.1-1.1C450.2-105,450.2-105.3,450.1-105.6z\"/>\n" +
    "                        </g>\n" +
    "                    </g>\n" +
    "                    <g id=\"XMLID_86_\">\n" +
    "                        <path id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_1_STROKES_22_\" class=\"st3\" d=\"M448-103.7c-0.7,0-1.3,0.1-2,0\n" +
    "                            c-1.1-0.1-2.1-0.3-3-0.6c-0.5-0.1-0.9-0.3-1.2-0.5c-0.3-0.2-0.4-0.3-0.4-0.5c-0.1-0.3,0.1-0.6,0.2-0.9c0.2-0.3,0.5-0.6,0.9-0.8\n" +
    "                            c0.9-0.6,1.8-0.8,2.7-0.9c1.9,0.1,3.4,0.5,4.2,1.4c0.3,0.3,0.5,0.7,0.6,1c0.1,0.3,0.2,0.5,0,0.7\n" +
    "                            C450.1-104.2,449.3-103.9,448-103.7z M447.2-102.3c-1.1-0.4-2.4-0.6-3.7-0.5c-1.4,0.1-2.2,0.3-2.5,0.9c-0.2,0.5,0.2,1.2,1.4,2.2\n" +
    "                            c1,0.8,2.1,1.5,3.3,2c1.2,0.5,2.1,0.7,3.1,0.8c1.1,0,1.7-0.2,1.9-0.8C451.4-99.7,450.2-101.1,447.2-102.3z M446.1-95.1\n" +
    "                            c-0.4-0.7-1.2-1.4-2-2.1c-1-0.8-1.9-1.4-2.6-1.7c-1.1-0.6-1.7-0.7-2.2-0.4c-0.2,0.2-0.3,0.5-0.5,0.9c0,0.4-0.1,0.9,0.1,1.3\n" +
    "                            c0.3,1.2,0.9,2.2,1.8,3c1.5,1.2,2.6,1.8,3.6,1.9c0.6,0.1,1.2-0.2,1.9-0.7C446.9-93.5,446.7-94.2,446.1-95.1z M440.1-104.3\n" +
    "                            c-0.2-0.7-0.6-1.3-1.2-1.6c-0.5-0.2-0.8-0.3-1.1-0.1c-0.1,0.1-0.2,0.2-0.3,0.3c-0.1,0.2-0.2,0.6-0.1,1.2c0,0.6,0,1,0,1.3\n" +
    "                            c0,0.2-0.2,0.4-0.6,0.6c-0.3,0.3-0.6,0.6-0.7,0.8c-0.1,0.4-0.1,0.7,0.1,1c0.2,0.3,0.4,0.4,0.7,0.6c0.8,0.3,1.6,0.1,2.2-0.3\n" +
    "                            c0.4-0.4,0.8-0.7,1-1.2C440.3-102.7,440.3-103.5,440.1-104.3z\"/>\n" +
    "                    </g>\n" +
    "                </g>\n" +
    "            </g>\n" +
    "            <g class=\"one-foot-print1\" id=\"XMLID_91_\" transform=\"matrix( 2.12353515625, 0, 0, 2.12353515625, 105.25,37.95) \">\n" +
    "                <g id=\"XMLID_92_\" transform=\"matrix( 1, 0, 0, 1, 0,0) \">\n" +
    "                    <g id=\"XMLID_97_\">\n" +
    "                        <g id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_FILL_23_\">\n" +
    "                            <path id=\"XMLID_98_\" d=\"M415.5-126.6c-0.1,0.4-0.1,0.8,0,1.1c0.1,0.4,0.4,0.6,0.7,0.7s0.6,0.1,0.9,0.1c0.8-0.2,1.4-0.8,1.6-1.6\n" +
    "                                c0.1-0.6,0.2-1,0.1-1.6c-0.3-0.9-0.7-1.6-1.5-2c-0.6-0.4-1.2-0.7-1.9-0.6c-0.5,0.1-0.8,0.2-0.9,0.6c0,0.1-0.1,0.3-0.1,0.4\n" +
    "                                c0,0.2,0.2,0.6,0.6,1c0.4,0.5,0.6,0.8,0.8,1.1C415.7-127.2,415.6-127,415.5-126.6 M427.4-126.1c-0.8-0.3-1.8-0.4-2.9-0.5\n" +
    "                                c-1.3,0-2.3,0-3.1,0.1c-1.2,0.2-1.8,0.5-2,1c-0.1,0.3,0,0.6,0.1,1c0.2,0.3,0.5,0.8,0.9,1c1,0.8,2,1.2,3.3,1.3\n" +
    "                                c1.9,0.1,3.2-0.1,4.1-0.6c0.5-0.3,0.9-0.9,1.1-1.7C429-125.2,428.5-125.7,427.4-126.1 M420.7-130.7c-1.1,0.9-1.6,1.6-1.5,2.2\n" +
    "                                c0.1,0.5,0.9,0.9,2.5,0.9c1.3,0,2.6,0,3.9-0.4c1.2-0.3,2.1-0.7,3-1.3c0.9-0.7,1.2-1.2,1-1.8c-0.6-1.9-2.4-2.3-5.6-1.4\n" +
    "                                C422.8-132.1,421.8-131.4,420.7-130.7 M424.3-136.9c-0.4-0.2-0.7-0.4-1.1-0.4c-1.2-0.2-2.5,0.3-4.2,1.4\n" +
    "                                c-0.8,0.5-1.3,1.3-1.6,2.3c-0.2,0.5-0.2,0.8-0.2,1.2c0,0.4,0.1,0.6,0.4,0.8c0.1,0.2,0.3,0.2,0.6,0.2c0.4,0,0.8-0.1,1.2-0.3\n" +
    "                                c0.9-0.3,1.8-0.7,2.7-1.3c0.5-0.3,1.1-0.8,1.6-1.2c0.9-0.9,1.3-1.6,1-2.2C424.8-136.5,424.6-136.7,424.3-136.9z\"/>\n" +
    "                        </g>\n" +
    "                    </g>\n" +
    "                    <g id=\"XMLID_93_\">\n" +
    "                        <path id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_1_STROKES_23_\" class=\"st3\" d=\"M423.8-134.1c-0.5,0.5-1,0.9-1.6,1.2\n" +
    "                            c-0.9,0.6-1.8,1-2.7,1.3c-0.5,0.2-0.9,0.3-1.2,0.3c-0.4,0-0.5,0-0.6-0.2c-0.2-0.2-0.3-0.5-0.4-0.8c0-0.4,0-0.7,0.2-1.2\n" +
    "                            c0.3-1,0.9-1.7,1.6-2.3c1.6-1.1,3-1.6,4.2-1.4c0.4,0.1,0.8,0.2,1.1,0.4c0.2,0.2,0.4,0.3,0.5,0.5\n" +
    "                            C425.1-135.7,424.7-135,423.8-134.1z M424-132.5c-1.1,0.3-2.3,0.9-3.3,1.8c-1.1,0.9-1.6,1.6-1.5,2.2c0.1,0.5,0.9,0.9,2.5,0.9\n" +
    "                            c1.3,0,2.6,0,3.9-0.4c1.2-0.3,2.1-0.7,3-1.3c0.9-0.7,1.2-1.2,1-1.8C429-132.9,427.1-133.3,424-132.5z M427.4-126.1\n" +
    "                            c-0.8-0.3-1.8-0.4-2.9-0.5c-1.3,0-2.3,0-3.1,0.1c-1.2,0.2-1.8,0.5-2,1c-0.1,0.3,0,0.6,0.1,1c0.2,0.3,0.5,0.8,0.9,1\n" +
    "                            c1,0.8,2,1.2,3.3,1.3c1.9,0.1,3.2-0.1,4.1-0.6c0.5-0.3,0.9-0.9,1.1-1.7C429-125.2,428.5-125.7,427.4-126.1z M417.1-129.9\n" +
    "                            c-0.6-0.4-1.2-0.7-1.9-0.6c-0.5,0.1-0.8,0.2-0.9,0.6c0,0.1-0.1,0.3-0.1,0.4c0,0.2,0.2,0.6,0.6,1c0.4,0.5,0.6,0.8,0.8,1.1\n" +
    "                            c0.1,0.2,0,0.4-0.1,0.8c-0.1,0.4-0.1,0.8,0,1.1c0.1,0.4,0.4,0.6,0.7,0.7s0.6,0.1,0.9,0.1c0.8-0.2,1.4-0.8,1.6-1.6\n" +
    "                            c0.1-0.6,0.2-1,0.1-1.6C418.2-128.7,417.8-129.3,417.1-129.9z\"/>\n" +
    "                    </g>\n" +
    "                </g>\n" +
    "            </g>\n" +
    "            <g class=\"one-foot-print1\" id=\"XMLID_99_\" transform=\"matrix( 2.12353515625, 0, 0, 2.12353515625, 105.25,37.95) \">\n" +
    "                <g id=\"XMLID_100_\" transform=\"matrix( 1, 0, 0, 1, 0,0) \">\n" +
    "                    <g id=\"XMLID_104_\">\n" +
    "                        <g id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_FILL_24_\">\n" +
    "                            <path id=\"XMLID_105_\" d=\"M475.7-123.9c-0.3,0.3-0.4,0.7-0.5,1c0,0.4,0.1,0.7,0.3,1s0.5,0.3,0.8,0.4c0.8,0.1,1.6-0.2,2.1-0.8\n" +
    "                                c0.3-0.5,0.6-0.9,0.7-1.4c0.1-0.9,0-1.7-0.6-2.4c-0.4-0.7-0.9-1.1-1.5-1.3c-0.5-0.1-0.8-0.1-1.1,0.2c-0.1,0.1-0.2,0.2-0.3,0.3\n" +
    "                                c-0.1,0.2,0,0.6,0.2,1.2s0.2,1,0.3,1.3C476.1-124.3,475.9-124.1,475.7-123.9 M486.4-118.6c-0.6-0.6-1.5-1.1-2.4-1.6\n" +
    "                                c-1.2-0.5-2.2-0.9-2.9-1.1c-1.2-0.3-1.9-0.2-2.2,0.1c-0.2,0.2-0.2,0.5-0.3,0.9c0.1,0.4,0.1,0.9,0.4,1.3c0.6,1.1,1.4,1.9,2.5,2.5\n" +
    "                                c1.7,0.9,3,1.2,4,1c0.6-0.1,1.1-0.5,1.7-1.1C487.6-117.2,487.3-117.8,486.4-118.6 M482.1-125.5c-1.4,0.4-2.1,0.8-2.2,1.4\n" +
    "                                c-0.1,0.5,0.5,1.1,1.9,1.9c1.2,0.5,2.4,1,3.7,1.2c1.2,0.2,2.2,0.2,3.2,0c1.1-0.3,1.6-0.6,1.6-1.2c0.2-2-1.3-3-4.5-3.5\n" +
    "                                C484.6-125.9,483.4-125.8,482.1-125.5 M487.9-129.7c-0.3-0.4-0.5-0.6-0.8-0.8c-1-0.7-2.4-0.8-4.4-0.4c-0.9,0.1-1.7,0.7-2.4,1.5\n" +
    "                                c-0.4,0.4-0.5,0.7-0.7,1c-0.2,0.3-0.1,0.6,0,0.9c0,0.2,0.2,0.3,0.5,0.4c0.3,0.2,0.7,0.2,1.2,0.2c0.9,0.1,1.9,0,3-0.1\n" +
    "                                c0.6-0.1,1.3-0.3,2-0.5c1.2-0.5,1.9-1,1.8-1.6C488.1-129.2,488-129.5,487.9-129.7z\"/>\n" +
    "                        </g>\n" +
    "                    </g>\n" +
    "                    <g id=\"XMLID_103_\">\n" +
    "                        <path id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_1_STROKES_24_\" class=\"st3\" d=\"M486.3-127.4c-0.7,0.2-1.3,0.4-2,0.5\n" +
    "                            c-1.1,0.2-2.1,0.2-3,0.1c-0.5,0-0.9-0.1-1.2-0.2c-0.3-0.2-0.4-0.2-0.5-0.4c-0.1-0.3-0.1-0.6,0-0.9c0.2-0.3,0.3-0.7,0.7-1\n" +
    "                            c0.7-0.8,1.5-1.2,2.4-1.5c1.9-0.4,3.4-0.3,4.4,0.4c0.3,0.3,0.7,0.5,0.8,0.8c0.1,0.3,0.3,0.5,0.2,0.7\n" +
    "                            C488.2-128.4,487.5-127.9,486.3-127.4z M485.8-125.8c-1.1-0.1-2.4-0.1-3.7,0.3c-1.4,0.4-2.1,0.8-2.2,1.4\n" +
    "                            c-0.1,0.5,0.5,1.1,1.9,1.9c1.2,0.5,2.4,1,3.7,1.2c1.2,0.2,2.2,0.2,3.2,0c1.1-0.3,1.6-0.6,1.6-1.2\n" +
    "                            C490.6-124.3,489-125.4,485.8-125.8z M486.4-118.6c-0.6-0.6-1.5-1.1-2.4-1.6c-1.2-0.5-2.2-0.9-2.9-1.1c-1.2-0.3-1.9-0.2-2.2,0.1\n" +
    "                            c-0.2,0.2-0.2,0.5-0.3,0.9c0.1,0.4,0.1,0.9,0.4,1.3c0.6,1.1,1.4,1.9,2.5,2.5c1.7,0.9,3,1.2,4,1c0.6-0.1,1.1-0.5,1.7-1.1\n" +
    "                            C487.6-117.2,487.3-117.8,486.4-118.6z M478.5-126.2c-0.4-0.7-0.9-1.1-1.5-1.3c-0.5-0.1-0.8-0.1-1.1,0.2\n" +
    "                            c-0.1,0.1-0.2,0.2-0.3,0.3c-0.1,0.2,0,0.6,0.2,1.2c0.2,0.6,0.2,1,0.3,1.3c0,0.2-0.1,0.4-0.4,0.7c-0.3,0.3-0.4,0.7-0.5,1\n" +
    "                            c0,0.4,0.1,0.7,0.3,1s0.5,0.3,0.8,0.4c0.8,0.1,1.6-0.2,2.1-0.8c0.3-0.5,0.6-0.9,0.7-1.4C479-124.6,478.9-125.4,478.5-126.2z\"/>\n" +
    "                    </g>\n" +
    "                </g>\n" +
    "            </g>\n" +
    "            <g class=\"one-foot-print1\" id=\"XMLID_106_\" transform=\"matrix( 2.12353515625, 0, 0, 2.12353515625, 105.25,37.95) \">\n" +
    "                <g id=\"XMLID_110_\" transform=\"matrix( 1, 0, 0, 1, 0,0) \">\n" +
    "                    <g id=\"XMLID_112_\">\n" +
    "                        <g id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_FILL_25_\">\n" +
    "                            <path id=\"XMLID_113_\" d=\"M483.9-81.9c-0.4-0.1-0.8-0.1-1.1,0c-0.4,0.1-0.6,0.4-0.7,0.7s-0.1,0.6,0,0.9c0.3,0.8,0.9,1.3,1.6,1.5\n" +
    "                                c0.6,0.1,1.1,0.1,1.6,0c0.9-0.3,1.5-0.8,2-1.6c0.4-0.6,0.6-1.3,0.5-1.9c-0.1-0.5-0.3-0.8-0.6-0.9c-0.1,0-0.3-0.1-0.4-0.1\n" +
    "                                c-0.2,0-0.6,0.3-1,0.7c-0.4,0.4-0.8,0.6-1,0.8C484.5-81.7,484.2-81.7,483.9-81.9 M483.8-69.9c0.3-0.8,0.4-1.8,0.3-2.9\n" +
    "                                c0-1.3-0.1-2.3-0.3-3.1c-0.2-1.2-0.6-1.8-1.1-1.9c-0.3-0.1-0.6,0-1,0.2c-0.3,0.2-0.7,0.5-1,0.9c-0.8,1-1.1,2.1-1.1,3.3\n" +
    "                                c0,1.9,0.2,3.2,0.8,4c0.3,0.5,0.9,0.8,1.8,1C483-68.3,483.5-68.8,483.8-69.9 M488.1-76.8c-0.9-1-1.6-1.5-2.3-1.4\n" +
    "                                c-0.5,0.1-0.8,0.9-0.8,2.5c0,1.3,0.2,2.6,0.5,3.9c0.3,1.2,0.8,2.1,1.4,2.9c0.7,0.9,1.3,1.2,1.8,0.9c1.9-0.6,2.1-2.5,1.2-5.6\n" +
    "                                C489.6-74.8,488.9-75.8,488.1-76.8 M494.5-73.5c0.2-0.4,0.4-0.7,0.4-1.1c0.2-1.2-0.4-2.5-1.6-4.1c-0.5-0.7-1.3-1.3-2.4-1.5\n" +
    "                                c-0.5-0.2-0.8-0.2-1.2-0.2c-0.4,0-0.6,0.2-0.8,0.4c-0.2,0.1-0.1,0.3-0.2,0.6c0,0.4,0.1,0.7,0.3,1.2c0.3,0.9,0.8,1.7,1.4,2.7\n" +
    "                                c0.3,0.5,0.8,1,1.3,1.5c1,0.9,1.7,1.3,2.2,0.9C494.1-73,494.3-73.2,494.5-73.5z\"/>\n" +
    "                        </g>\n" +
    "                    </g>\n" +
    "                    <g id=\"XMLID_111_\">\n" +
    "                        <path id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_1_STROKES_25_\" class=\"st3\" d=\"M491.7-73.9c-0.5-0.5-0.9-1-1.3-1.5\n" +
    "                            c-0.6-0.9-1.1-1.8-1.4-2.7c-0.2-0.5-0.3-0.9-0.3-1.2c0-0.4,0-0.5,0.2-0.6c0.2-0.3,0.5-0.3,0.8-0.4c0.4,0,0.7,0,1.2,0.2\n" +
    "                            c1,0.3,1.8,0.8,2.4,1.5c1.1,1.5,1.7,2.9,1.6,4.1c-0.1,0.4-0.2,0.8-0.4,1.1c-0.2,0.3-0.3,0.4-0.5,0.5\n" +
    "                            C493.4-72.6,492.7-73,491.7-73.9z M490-73.6c-0.4-1.1-1-2.2-1.9-3.2c-0.9-1-1.6-1.5-2.3-1.4c-0.5,0.1-0.8,0.9-0.8,2.5\n" +
    "                            c0,1.3,0.2,2.6,0.5,3.9c0.3,1.2,0.8,2.1,1.4,2.9c0.7,0.9,1.3,1.2,1.8,0.9C490.7-68.7,491-70.6,490-73.6z M483.8-69.9\n" +
    "                            c0.3-0.8,0.4-1.8,0.3-2.9c0-1.3-0.1-2.3-0.3-3.1c-0.2-1.2-0.6-1.8-1.1-1.9c-0.3-0.1-0.6,0-1,0.2c-0.3,0.2-0.7,0.5-1,0.9\n" +
    "                            c-0.8,1-1.1,2.1-1.1,3.3c0,1.9,0.2,3.2,0.8,4c0.3,0.5,0.9,0.8,1.8,1C483-68.3,483.5-68.8,483.8-69.9z M487.2-80.4\n" +
    "                            c0.4-0.6,0.6-1.3,0.5-1.9c-0.1-0.5-0.3-0.8-0.6-0.9c-0.1,0-0.3-0.1-0.4-0.1c-0.2,0-0.6,0.3-1,0.7s-0.8,0.6-1,0.8\n" +
    "                            c-0.2,0.1-0.4,0.1-0.8-0.1c-0.4-0.1-0.8-0.1-1.1,0c-0.4,0.1-0.6,0.4-0.7,0.7c-0.1,0.3-0.1,0.6,0,0.9c0.3,0.8,0.9,1.3,1.6,1.5\n" +
    "                            c0.6,0.1,1.1,0.1,1.6,0C486-79.2,486.7-79.7,487.2-80.4z\"/>\n" +
    "                    </g>\n" +
    "                </g>\n" +
    "            </g>\n" +
    "            <g class=\"one-foot-print1\" id=\"XMLID_116_\" transform=\"matrix( 2.12353515625, 0, 0, 2.12353515625, 105.25,37.95) \">\n" +
    "                <g id=\"XMLID_117_\" transform=\"matrix( 1, 0, 0, 1, 0,0) \">\n" +
    "                    <g id=\"XMLID_119_\">\n" +
    "                        <g id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_FILL_26_\">\n" +
    "                            <path id=\"XMLID_123_\" d=\"M515.5-101.6c-0.4,0.1-0.7,0.3-1,0.5c-0.3,0.3-0.3,0.6-0.3,1s0.1,0.5,0.4,0.8c0.6,0.6,1.4,0.8,2.2,0.7\n" +
    "                                c0.5-0.1,1-0.3,1.4-0.7c0.6-0.7,1-1.4,1.1-2.3c0.1-0.8,0-1.4-0.4-1.9c-0.3-0.4-0.6-0.6-1-0.5c-0.1,0-0.3,0.1-0.4,0.1\n" +
    "                                c-0.2,0.1-0.4,0.5-0.6,1c-0.2,0.6-0.4,0.9-0.6,1.2C516.1-101.7,515.9-101.7,515.5-101.6 M520.8-90.9c-0.1-0.9-0.5-1.8-1-2.7\n" +
    "                                c-0.6-1.2-1.1-2-1.6-2.6c-0.7-1-1.3-1.3-1.8-1.3c-0.3,0.1-0.5,0.3-0.8,0.6c-0.2,0.3-0.4,0.8-0.5,1.2c-0.2,1.2-0.1,2.4,0.4,3.5\n" +
    "                                c0.8,1.7,1.6,2.8,2.5,3.3c0.5,0.3,1.2,0.3,2,0.1C520.8-89.1,520.9-89.8,520.8-90.9 M521.6-99c-1.3-0.5-2.2-0.7-2.6-0.2\n" +
    "                                c-0.4,0.3-0.3,1.2,0.3,2.6c0.6,1.2,1.3,2.2,2.2,3.2c0.8,0.9,1.7,1.5,2.5,2c1,0.5,1.7,0.5,2.1,0c1.4-1.4,0.8-3.2-1.4-5.5\n" +
    "                                C523.8-97.8,522.8-98.4,521.6-99 M528.7-98.8c0-0.4,0-0.8-0.2-1.1c-0.4-1.1-1.5-2.1-3.2-3c-0.8-0.4-1.8-0.5-2.8-0.3\n" +
    "                                c-0.5,0.1-0.8,0.2-1.1,0.4c-0.3,0.2-0.5,0.4-0.5,0.7c-0.1,0.2,0,0.4,0.1,0.6c0.2,0.3,0.5,0.6,0.8,0.9c0.7,0.6,1.5,1.2,2.5,1.7\n" +
    "                                c0.5,0.3,1.2,0.6,1.8,0.8c1.3,0.4,2.1,0.4,2.4-0.1C528.6-98.2,528.7-98.5,528.7-98.8z\"/>\n" +
    "                        </g>\n" +
    "                    </g>\n" +
    "                    <g id=\"XMLID_118_\">\n" +
    "                        <path id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_1_STROKES_26_\" class=\"st3\" d=\"M526.1-97.9c-0.7-0.3-1.2-0.5-1.8-0.8\n" +
    "                            c-1-0.5-1.8-1.1-2.5-1.7c-0.4-0.3-0.7-0.6-0.8-0.9c-0.2-0.3-0.2-0.5-0.1-0.6c0.1-0.3,0.3-0.5,0.5-0.7c0.3-0.2,0.6-0.3,1.1-0.4\n" +
    "                            c1-0.2,2,0,2.8,0.3c1.7,0.9,2.9,1.9,3.2,3c0.1,0.4,0.2,0.8,0.2,1.1c-0.1,0.3-0.1,0.5-0.3,0.7C528.1-97.5,527.3-97.5,526.1-97.9z\n" +
    "                             M524.7-97c-0.8-0.8-1.9-1.5-3.1-2c-1.3-0.5-2.2-0.7-2.6-0.2c-0.4,0.3-0.3,1.2,0.3,2.6c0.6,1.2,1.3,2.2,2.2,3.2\n" +
    "                            c0.8,0.9,1.7,1.5,2.5,2c1,0.5,1.7,0.5,2.1,0C527.5-92.8,526.9-94.6,524.7-97z M520.8-90.9c-0.1-0.9-0.5-1.8-1-2.7\n" +
    "                            c-0.6-1.2-1.1-2-1.6-2.6c-0.7-1-1.3-1.3-1.8-1.3c-0.3,0.1-0.5,0.3-0.8,0.6c-0.2,0.3-0.4,0.8-0.5,1.2c-0.2,1.2-0.1,2.4,0.4,3.5\n" +
    "                            c0.8,1.7,1.6,2.8,2.5,3.3c0.5,0.3,1.2,0.3,2,0.1C520.8-89.1,520.9-89.8,520.8-90.9z M519.1-101.8c0.1-0.8,0-1.4-0.4-1.9\n" +
    "                            c-0.3-0.4-0.6-0.6-1-0.5c-0.1,0-0.3,0.1-0.4,0.1c-0.2,0.1-0.4,0.5-0.6,1c-0.2,0.6-0.4,0.9-0.6,1.2c-0.1,0.2-0.4,0.2-0.7,0.3\n" +
    "                            c-0.4,0.1-0.7,0.3-1,0.5c-0.3,0.3-0.3,0.6-0.3,1s0.1,0.5,0.4,0.8c0.6,0.6,1.4,0.8,2.2,0.7c0.5-0.1,1-0.3,1.4-0.7\n" +
    "                            C518.6-100.2,519-100.9,519.1-101.8z\"/>\n" +
    "                    </g>\n" +
    "                </g>\n" +
    "            </g>\n" +
    "            <g class=\"one-foot-print1\" id=\"XMLID_124_\" transform=\"matrix( 2.12353515625, 0, 0, 2.12353515625, 105.25,37.95) \">\n" +
    "                <g id=\"XMLID_125_\" transform=\"matrix( 1, 0, 0, 1, 0,0) \">\n" +
    "                    <g id=\"XMLID_129_\">\n" +
    "                        <g id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_FILL_27_\">\n" +
    "                            <path id=\"XMLID_130_\" d=\"M506.6-45.6c-0.3-0.3-0.7-0.4-1-0.5c-0.4-0.1-0.7,0.1-1,0.3c-0.3,0.2-0.4,0.4-0.4,0.8\n" +
    "                                c-0.1,0.8,0.2,1.6,0.7,2.1c0.4,0.4,0.9,0.6,1.4,0.7c0.9,0.1,1.7,0,2.5-0.5c0.7-0.4,1.1-0.8,1.3-1.5c0.1-0.5,0.1-0.8-0.1-1.1\n" +
    "                                c-0.1-0.1-0.2-0.2-0.3-0.3c-0.2-0.1-0.6,0-1.2,0.1c-0.6,0.2-1,0.2-1.3,0.2C507-45.1,506.8-45.3,506.6-45.6 M501.1-35\n" +
    "                                c0.6-0.6,1.1-1.4,1.6-2.4c0.6-1.2,1-2.1,1.2-2.9c0.4-1.1,0.3-1.8,0-2.2c-0.2-0.2-0.5-0.2-0.9-0.3c-0.4,0-0.9,0.1-1.3,0.3\n" +
    "                                c-1.1,0.5-2,1.3-2.5,2.4c-0.9,1.7-1.3,3-1.2,4c0.1,0.6,0.4,1.2,1.1,1.7C499.6-33.9,500.2-34.2,501.1-35 M508-39.1\n" +
    "                                c-0.4-1.4-0.7-2.1-1.4-2.3c-0.5-0.1-1.2,0.4-1.9,1.8c-0.6,1.2-1,2.3-1.3,3.7c-0.3,1.2-0.2,2.2-0.1,3.2c0.2,1.1,0.6,1.6,1.2,1.7\n" +
    "                                c1.9,0.3,3.1-1.3,3.6-4.4C508.4-36.6,508.3-37.8,508-39.1 M512.1-33.2c0.4-0.2,0.7-0.5,0.8-0.8c0.7-1,0.8-2.4,0.5-4.4\n" +
    "                                c-0.1-0.9-0.6-1.7-1.4-2.5c-0.3-0.4-0.7-0.5-1-0.7s-0.6-0.1-0.9,0c-0.2,0-0.3,0.2-0.5,0.5c-0.2,0.3-0.2,0.7-0.3,1.2\n" +
    "                                c-0.1,0.9-0.1,1.9,0,3c0.1,0.6,0.2,1.3,0.4,2c0.4,1.3,0.9,1.9,1.5,1.8C511.5-33,511.8-33.1,512.1-33.2z\"/>\n" +
    "                        </g>\n" +
    "                    </g>\n" +
    "                    <g id=\"XMLID_126_\">\n" +
    "                        <path id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_1_STROKES_27_\" class=\"st3\" d=\"M509.8-34.9c-0.2-0.7-0.3-1.3-0.4-2\n" +
    "                            c-0.1-1.1-0.1-2.1,0-3c0-0.5,0.1-0.9,0.3-1.2s0.3-0.4,0.5-0.5c0.3-0.1,0.6-0.1,0.9,0c0.3,0.2,0.6,0.3,1,0.7\n" +
    "                            c0.8,0.7,1.2,1.6,1.4,2.5c0.3,1.9,0.2,3.4-0.5,4.4c-0.3,0.3-0.5,0.7-0.8,0.8c-0.3,0.1-0.5,0.3-0.7,0.2\n" +
    "                            C510.7-33,510.3-33.6,509.8-34.9z M508.3-35.4c0.2-1.1,0.1-2.4-0.2-3.7c-0.4-1.4-0.7-2.1-1.4-2.3c-0.5-0.1-1.2,0.4-1.9,1.8\n" +
    "                            c-0.6,1.2-1,2.3-1.3,3.7c-0.3,1.2-0.2,2.2-0.1,3.2c0.2,1.1,0.6,1.6,1.2,1.7C506.6-30.7,507.7-32.2,508.3-35.4z M501.1-35\n" +
    "                            c0.6-0.6,1.1-1.4,1.6-2.4c0.6-1.2,1-2.1,1.2-2.9c0.4-1.1,0.3-1.8,0-2.2c-0.2-0.2-0.5-0.2-0.9-0.3c-0.4,0-0.9,0.1-1.3,0.3\n" +
    "                            c-1.1,0.5-2,1.3-2.5,2.4c-0.9,1.7-1.3,3-1.2,4c0.1,0.6,0.4,1.2,1.1,1.7C499.6-33.9,500.2-34.2,501.1-35z M508.8-42.7\n" +
    "                            c0.7-0.4,1.1-0.8,1.3-1.5c0.1-0.5,0.1-0.8-0.1-1.1c-0.1-0.1-0.2-0.2-0.3-0.3c-0.2-0.1-0.6,0-1.2,0.1c-0.6,0.2-1,0.2-1.3,0.2\n" +
    "                            c-0.2,0-0.4-0.2-0.7-0.4c-0.3-0.3-0.7-0.4-1-0.5c-0.4-0.1-0.7,0.1-1,0.3c-0.3,0.2-0.4,0.4-0.4,0.8c-0.1,0.8,0.2,1.6,0.7,2.1\n" +
    "                            c0.4,0.4,0.9,0.6,1.4,0.7C507.3-42.2,508.1-42.3,508.8-42.7z\"/>\n" +
    "                    </g>\n" +
    "                </g>\n" +
    "            </g>\n" +
    "            <g class=\"one-foot-print1\" id=\"XMLID_131_\" transform=\"matrix( 2.12353515625, 0, 0, 2.12353515625, 105.25,37.95) \">\n" +
    "                <g id=\"XMLID_132_\" transform=\"matrix( 1, 0, 0, 1, 0,0) \">\n" +
    "                    <g id=\"XMLID_137_\">\n" +
    "                        <g id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_FILL_28_\">\n" +
    "                            <path id=\"XMLID_138_\" d=\"M535.6-66.8c-0.4-0.2-0.7-0.3-1.1-0.2c-0.4,0.1-0.7,0.3-0.9,0.5c-0.2,0.3-0.2,0.5-0.2,0.8\n" +
    "                                c0.1,0.8,0.6,1.5,1.3,1.9c0.5,0.2,1,0.4,1.5,0.4c0.9-0.1,1.7-0.4,2.3-1.1c0.5-0.5,0.9-1.1,0.9-1.8c0-0.5-0.1-0.8-0.4-1\n" +
    "                                c-0.1-0.1-0.3-0.1-0.4-0.2c-0.2,0-0.6,0.1-1.1,0.4s-0.9,0.5-1.2,0.6C536.1-66.5,535.9-66.6,535.6-66.8 M532.9-55.1\n" +
    "                                c0.5-0.7,0.7-1.7,1-2.7c0.3-1.3,0.4-2.3,0.4-3.1c0.1-1.2-0.2-1.9-0.6-2.1c-0.3-0.1-0.6-0.1-1,0c-0.4,0.1-0.8,0.3-1.1,0.7\n" +
    "                                c-1,0.8-1.6,1.8-1.9,3c-0.4,1.9-0.5,3.2-0.1,4.1c0.2,0.6,0.7,1,1.5,1.4C531.7-53.7,532.3-54.1,532.9-55.1 M538.6-60.9\n" +
    "                                c-0.7-1.2-1.3-1.9-1.9-1.8c-0.5,0-1,0.7-1.4,2.2c-0.3,1.3-0.4,2.5-0.3,3.9c0.1,1.3,0.3,2.2,0.7,3.2c0.5,1,1,1.4,1.6,1.3\n" +
    "                                c2-0.2,2.7-2,2.4-5.2C539.6-58.6,539.2-59.7,538.6-60.9 M544.1-56.2c0.3-0.3,0.5-0.6,0.6-1c0.4-1.1,0.2-2.5-0.6-4.4\n" +
    "                                c-0.3-0.8-1-1.5-2-2c-0.4-0.3-0.8-0.3-1.1-0.4s-0.6,0-0.9,0.2c-0.2,0.1-0.2,0.3-0.3,0.6c-0.1,0.4,0,0.8,0.1,1.3\n" +
    "                                c0.1,0.9,0.4,1.9,0.8,2.9c0.2,0.6,0.6,1.2,0.9,1.8c0.7,1.1,1.4,1.6,1.9,1.4C543.6-55.8,543.8-56,544.1-56.2z\"/>\n" +
    "                        </g>\n" +
    "                    </g>\n" +
    "                    <g id=\"XMLID_136_\">\n" +
    "                        <path id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_1_STROKES_28_\" class=\"st3\" d=\"M541.4-57.2c-0.3-0.6-0.7-1.1-0.9-1.8\n" +
    "                            c-0.4-1-0.7-2-0.8-2.9c-0.1-0.5-0.1-0.9-0.1-1.3c0.1-0.4,0.1-0.5,0.3-0.6c0.2-0.2,0.6-0.2,0.9-0.2c0.4,0.1,0.7,0.2,1.1,0.4\n" +
    "                            c0.9,0.5,1.5,1.2,2,2c0.8,1.7,1,3.2,0.6,4.4c-0.2,0.4-0.3,0.8-0.6,1c-0.2,0.2-0.4,0.4-0.6,0.3C542.8-55.6,542.2-56.1,541.4-57.2z\n" +
    "                             M539.8-57.3c-0.1-1.1-0.5-2.4-1.1-3.5c-0.7-1.2-1.3-1.9-1.9-1.8c-0.5,0-1,0.7-1.4,2.2c-0.3,1.3-0.4,2.5-0.3,3.9\n" +
    "                            c0.1,1.3,0.3,2.2,0.7,3.2c0.5,1,1,1.4,1.6,1.3C539.3-52.4,540-54.1,539.8-57.3z M532.9-55.1c0.5-0.7,0.7-1.7,1-2.7\n" +
    "                            c0.3-1.3,0.4-2.3,0.4-3.1c0.1-1.2-0.2-1.9-0.6-2.1c-0.3-0.1-0.6-0.1-1,0c-0.4,0.1-0.8,0.3-1.1,0.7c-1,0.8-1.6,1.8-1.9,3\n" +
    "                            c-0.4,1.9-0.5,3.2-0.1,4.1c0.2,0.6,0.7,1,1.5,1.4C531.7-53.7,532.3-54.1,532.9-55.1z M538.5-64.6c0.5-0.5,0.9-1.1,0.9-1.8\n" +
    "                            c0-0.5-0.1-0.8-0.4-1c-0.1-0.1-0.3-0.1-0.4-0.2c-0.2,0-0.6,0.1-1.1,0.4s-0.9,0.5-1.2,0.6c-0.2,0.1-0.4,0-0.7-0.3\n" +
    "                            c-0.4-0.2-0.7-0.3-1.1-0.2c-0.4,0.1-0.7,0.3-0.9,0.5c-0.2,0.3-0.2,0.5-0.2,0.8c0.1,0.8,0.6,1.5,1.3,1.9c0.5,0.2,1,0.4,1.5,0.4\n" +
    "                            C537.1-63.7,537.8-64,538.5-64.6z\"/>\n" +
    "                    </g>\n" +
    "                </g>\n" +
    "            </g>\n" +
    "            <g class=\"one-foot-print1\" id=\"XMLID_139_\" transform=\"matrix( 2.12353515625, 0, 0, 2.12353515625, 105.25,37.95) \">\n" +
    "                <g id=\"XMLID_142_\" transform=\"matrix( 1, 0, 0, 1, 0,0) \">\n" +
    "                    <g id=\"XMLID_144_\">\n" +
    "                        <g id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_FILL_29_\">\n" +
    "                            <path id=\"XMLID_145_\" d=\"M534.2-14.4c-0.3-0.3-0.6-0.5-0.9-0.6c-0.4-0.1-0.7,0-1,0.2c-0.3,0.2-0.4,0.4-0.5,0.7\n" +
    "                                c-0.2,0.8,0.1,1.6,0.6,2.2c0.4,0.4,0.8,0.7,1.3,0.8c0.9,0.2,1.7,0.1,2.5-0.3c0.7-0.3,1.2-0.8,1.4-1.4c0.2-0.5,0.2-0.8,0-1.1\n" +
    "                                c-0.1-0.1-0.2-0.2-0.3-0.3c-0.2-0.1-0.6-0.1-1.2,0.1c-0.6,0.1-1,0.1-1.3,0.2C534.6-13.9,534.4-14.1,534.2-14.4 M528-4.2\n" +
    "                                c0.7-0.5,1.2-1.4,1.8-2.3c0.7-1.1,1.1-2.1,1.4-2.8c0.5-1.1,0.4-1.8,0.1-2.2c-0.2-0.2-0.5-0.3-0.9-0.4c-0.4,0-0.9,0-1.3,0.3\n" +
    "                                c-1.2,0.5-2,1.2-2.7,2.2c-1,1.6-1.5,2.9-1.4,3.9c0,0.6,0.4,1.2,1,1.8C526.4-3.2,527.1-3.5,528-4.2 M535.2-7.8\n" +
    "                                c-0.3-1.4-0.6-2.2-1.2-2.3c-0.5-0.2-1.2,0.4-2,1.7c-0.7,1.1-1.2,2.3-1.5,3.6c-0.3,1.2-0.4,2.2-0.4,3.2c0.1,1.1,0.5,1.7,1.1,1.8\n" +
    "                                c1.9,0.4,3.2-1,3.9-4.2C535.4-5.3,535.4-6.5,535.2-7.8 M538.9-1.7c0.4-0.2,0.7-0.4,0.9-0.7c0.8-0.9,1-2.3,0.8-4.3\n" +
    "                                c0-0.9-0.5-1.8-1.2-2.5c-0.3-0.4-0.6-0.6-0.9-0.8c-0.3-0.2-0.6-0.2-0.9-0.1c-0.2,0-0.3,0.2-0.5,0.4c-0.2,0.3-0.3,0.7-0.3,1.2\n" +
    "                                c-0.2,0.9-0.2,1.9-0.2,3c0,0.6,0.2,1.3,0.3,2c0.4,1.3,0.8,2,1.4,1.9C538.3-1.5,538.6-1.6,538.9-1.7z\"/>\n" +
    "                        </g>\n" +
    "                    </g>\n" +
    "                    <g id=\"XMLID_143_\">\n" +
    "                        <path id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_1_STROKES_29_\" class=\"st3\" d=\"M536.7-3.5c-0.1-0.7-0.3-1.3-0.3-2\n" +
    "                            c0-1.1,0-2.1,0.2-3c0.1-0.5,0.2-0.9,0.3-1.2c0.2-0.3,0.3-0.4,0.5-0.4c0.3-0.1,0.6,0,0.9,0.1c0.3,0.2,0.6,0.4,0.9,0.8\n" +
    "                            c0.7,0.8,1.1,1.7,1.2,2.5c0.2,1.9-0.1,3.4-0.8,4.3c-0.3,0.3-0.6,0.6-0.9,0.7c-0.3,0.1-0.5,0.2-0.7,0.1\n" +
    "                            C537.5-1.5,537.1-2.2,536.7-3.5z M535.2-4.1c0.3-1.1,0.3-2.4,0-3.7c-0.3-1.4-0.6-2.2-1.2-2.3c-0.5-0.2-1.2,0.4-2,1.7\n" +
    "                            c-0.7,1.1-1.2,2.3-1.5,3.6c-0.3,1.2-0.4,2.2-0.4,3.2c0.1,1.1,0.5,1.7,1.1,1.8C533.2,0.5,534.4-1,535.2-4.1z M528-4.2\n" +
    "                            c0.7-0.5,1.2-1.4,1.8-2.3c0.7-1.1,1.1-2.1,1.4-2.8c0.5-1.1,0.4-1.8,0.1-2.2c-0.2-0.2-0.5-0.3-0.9-0.4c-0.4,0-0.9,0-1.3,0.3\n" +
    "                            c-1.2,0.5-2,1.2-2.7,2.2c-1,1.6-1.5,2.9-1.4,3.9c0,0.6,0.4,1.2,1,1.8C526.4-3.2,527.1-3.5,528-4.2z M536.3-11.4\n" +
    "                            c0.7-0.3,1.2-0.8,1.4-1.4c0.2-0.5,0.2-0.8,0-1.1c-0.1-0.1-0.2-0.2-0.3-0.3c-0.2-0.1-0.6-0.1-1.2,0.1c-0.6,0.1-1,0.1-1.3,0.2\n" +
    "                            c-0.2,0-0.4-0.2-0.6-0.5c-0.3-0.3-0.6-0.5-0.9-0.6c-0.4-0.1-0.7,0-1,0.2s-0.4,0.4-0.5,0.7c-0.2,0.8,0.1,1.6,0.6,2.2\n" +
    "                            c0.4,0.4,0.8,0.7,1.3,0.8C534.7-11,535.5-11.1,536.3-11.4z\"/>\n" +
    "                    </g>\n" +
    "                </g>\n" +
    "            </g>\n" +
    "        </g>\n" +
    "    </g>\n" +
    "</svg>\n" +
    "");
}]);

angular.module("znk/home/templates/svgPathTablet.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/home/templates/svgPathTablet.html",
    "<svg version=\"1.1\"\n" +
    "     id=\"Layer_1\"\n" +
    "     xmlns=\"http://www.w3.org/2000/svg\"\n" +
    "     xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n" +
    "     x=\"0px\"\n" +
    "     y=\"0px\"\n" +
    "     viewBox=\"0 0 0 0\">\n" +
    "    <g class=\"unique\">\n" +
    "        <path id=\"XMLID_57_\" class=\"st0 p1 dash\" d=\"M888-466.6c-33.3-69-100.2-154.1-281.1-136.8\">\n" +
    "        </path>\n" +
    "        <path id=\"XMLID_57_\" class=\"st0\" d=\"M888-466.6c-33.3-69-100.2-154.1-281.1-136.8\">\n" +
    "        </path>\n" +
    "        <path id=\"XMLID_56_\" class=\"st0  p2 dash\" d=\"M1475.9-626.1c-24.4-20.9-51.8-32.1-82.1-31.8c-80.8,0.8-157,40.7-198.5,205.6\n" +
    "	c-13,51.7-40.7,150.3-150,150.3c-101.1,0-117.4-74.5-150.9-150.6c-2-4.6-4.2-9.3-6.5-14.1\"/>\n" +
    "        <path id=\"XMLID_56_\" class=\"st0\" d=\"M1475.9-626.1c-24.4-20.9-51.8-32.1-82.1-31.8c-80.8,0.8-157,40.7-198.5,205.6\n" +
    "	c-13,51.7-40.7,150.3-150,150.3c-101.1,0-117.4-74.5-150.9-150.6c-2-4.6-4.2-9.3-6.5-14.1\"/>\n" +
    "\n" +
    "        <path id=\"XMLID_55_\" class=\"st0 p3 dash\" d=\"M1814.8,54.2c57.7-32.6,96.7-94.7,96.7-166.1c0-105.1-87-164-188.6-187.6\n" +
    "	c-52-12.1-118.1-49-150.3-152.7c-24.6-79.3-56.7-139.7-96.7-173.9\"/>\n" +
    "        <path id=\"XMLID_55_\" class=\"st0\" d=\"M1814.8,54.2c57.7-32.6,96.7-94.7,96.7-166.1c0-105.1-87-164-188.6-187.6\n" +
    "	c-52-12.1-118.1-49-150.3-152.7c-24.6-79.3-56.7-139.7-96.7-173.9\"/>\n" +
    "\n" +
    "        <path id=\"XMLID_54_\" class=\"st0 dash\" d=\"M1283.8-137.2c22.6-75.9,64-109.2,127.1-109.2c58.3,0,96,28.9,122.9,132.2\n" +
    "	c26.5,101.6,84.6,192.5,188.9,192.5c33.5,0,64.9-8.8,92.1-24.2\"/>\n" +
    "        <path id=\"XMLID_54_\" class=\"st0\" d=\"M1283.8-137.2c22.6-75.9,64-109.2,127.1-109.2c58.3,0,96,28.9,122.9,132.2\n" +
    "	c26.5,101.6,84.6,192.5,188.9,192.5c33.5,0,64.9-8.8,92.1-24.2\"/>\n" +
    "\n" +
    "        <path id=\"XMLID_53_\" class=\"st0 dash\" d=\"M943.6,204.8c-16.4-1.4-34.6-1.5-55.1,0.1l0,0c-71.1,7.7-165.6-11.4-202.1-88.5\n" +
    "	c-38.8-82.2-1.9-179.5,82.6-217.3c84.4-37.8,176.6,3,223.2,81.3c8,13.4,25.4,33.2,35.7,42.5c25.4,23.2,52.6,31.3,89.6,31.3\n" +
    "	c87.8,0,141-74.6,158.3-159.4c2.3-11.4,5-22,7.9-31.9\"/>\n" +
    "        <path id=\"XMLID_53_\" class=\"st0\" d=\"M943.6,204.8c-16.4-1.4-34.6-1.5-55.1,0.1l0,0c-71.1,7.7-165.6-11.4-202.1-88.5\n" +
    "	c-38.8-82.2-1.9-179.5,82.6-217.3c84.4-37.8,176.6,3,223.2,81.3c8,13.4,25.4,33.2,35.7,42.5c25.4,23.2,52.6,31.3,89.6,31.3\n" +
    "	c87.8,0,141-74.6,158.3-159.4c2.3-11.4,5-22,7.9-31.9\"/>\n" +
    "\n" +
    "        <path id=\"XMLID_52_\" class=\"st0 dash\" d=\"M732.2,688.1c-8.3-44.9,2.9-93,34.9-131.1c36.9-43.9,92.9-51,146.6-58.8\n" +
    "	c54.5-7.9,159.9-65.8,159.9-147.9c0-71.1-24.9-136.4-129.9-145.5\"/>\n" +
    "        <path id=\"XMLID_52_\" class=\"st0\" d=\"M732.2,688.1c-8.3-44.9,2.9-93,34.9-131.1c36.9-43.9,92.9-51,146.6-58.8\n" +
    "	c54.5-7.9,159.9-65.8,159.9-147.9c0-71.1-24.9-136.4-129.9-145.5\"/>\n" +
    "\n" +
    "        <path id=\"XMLID_51_\" class=\"st0 dash\" d=\"M1518.1,561.8c0,51.2-42.6,92.7-95.2,92.7c-39.2,0-82-43.8-96.5-76.5l2,4.5\n" +
    "		c-20.5-49.9-70.6-85.2-129.1-85.2c-76.7,0-138.9,44.3-140,118.9c-0.6,37.4-3.4,108.9-34.3,145.8c-58.2,69.3-163,79.6-234.2,23\n" +
    "		c-32-25.5-51.8-60.2-58.6-96.9\"/>\n" +
    "        <path id=\"XMLID_51_\" class=\"st0\" d=\"M1518.1,561.8c0,51.2-42.6,92.7-95.2,92.7c-39.2,0-82-43.8-96.5-76.5l2,4.5\n" +
    "		c-20.5-49.9-70.6-85.2-129.1-85.2c-76.7,0-138.9,44.3-140,118.9c-0.6,37.4-3.4,108.9-34.3,145.8c-58.2,69.3-163,79.6-234.2,23\n" +
    "		c-32-25.5-51.8-60.2-58.6-96.9\"/>\n" +
    "\n" +
    "        <path id=\"XMLID_49_\" class=\"st0 dash\" d=\"M1747.9,449.9c-73,0-124.3-60.5-124.3-131.6v0.4c0-85.7-71.4-155.1-159.4-155.1\n" +
    "	s-159.4,69.5-159.4,155.1c0,72.5,72.4,136.1,119,149.9c50.3,14.9,94.3,42,94.3,93.2\"/>\n" +
    "        <path id=\"XMLID_49_\" class=\"st0\" d=\"M1747.9,449.9c-73,0-124.3-60.5-124.3-131.6v0.4c0-85.7-71.4-155.1-159.4-155.1\n" +
    "	s-159.4,69.5-159.4,155.1c0,72.5,72.4,136.1,119,149.9c50.3,14.9,94.3,42,94.3,93.2\"/>\n" +
    "\n" +
    "        <path class=\"st0 dash\" d=\"M1360.7,1135.3c0,0,14.3,1.2,22.8,3.4c62.8,16.2,81.1,32.4,106.9,128.1c27.4,101.6,87.6,192.5,195.5,192.5\n" +
    "	c107.9,0,195.5-85.2,195.5-190.2c0-105.1-59-184.6-164.2-208.2c-8.4-1.9-30.1-1.4-57.7-3v-0.1c-78.5-4.6-204.3-26-204.3-165.6\n" +
    "	c0-93.8,78.1-169.8,174.4-169.8c23.9,0,46.1,6.3,67.5,13.2c8.9,2.9,19.7,4.8,37.3,4.9c82.4,0.6,149.7-63.9,150.4-144.1\n" +
    "	s-65.6-145.7-148-146.4l11.1-0.2\"/>\n" +
    "        <path class=\"st0\" d=\"M1360.7,1135.3c0,0,14.3,1.2,22.8,3.4c62.8,16.2,81.1,32.4,106.9,128.1c27.4,101.6,87.6,192.5,195.5,192.5\n" +
    "	c107.9,0,195.5-85.2,195.5-190.2c0-105.1-59-184.6-164.2-208.2c-8.4-1.9-30.1-1.4-57.7-3v-0.1c-78.5-4.6-204.3-26-204.3-165.6\n" +
    "	c0-93.8,78.1-169.8,174.4-169.8c23.9,0,46.1,6.3,67.5,13.2c8.9,2.9,19.7,4.8,37.3,4.9c82.4,0.6,149.7-63.9,150.4-144.1\n" +
    "	s-65.6-145.7-148-146.4l11.1-0.2\"/>\n" +
    "    </g>\n" +
    "\n" +
    "    <g class=\"repeat-part\" ng-repeat=\"i in getNumber(numOfRepeats) track by $index\"  ng-style=\"{ 'transform' : setPos($index), '-webkit-transform': setPos($index)}\">\n" +
    "        <path class=\"st02\" d=\"M314.2,498c-16.4-1.4-34.6-1.5-55.1,0.1l0,0C188,505.8,93.5,486.7,57,409.6c-38.8-82.2-1.9-179.5,82.6-217.3\n" +
    "	c84.4-37.8,176.6,3,223.2,81.3c8,13.4,25.4,33.2,35.7,42.5c25.4,23.2,52.6,31.3,89.6,31.3c87.8,0,141-74.6,158.3-159.4\n" +
    "	c2.3-11.4,5-22,7.9-31.9l-0.1,0.3c23.6-74.2,66.3-106.7,130.8-106.7c4.4,0,8.6,0.2,12.8,0.5\">\n" +
    "        </path>\n" +
    "        <path id=\"XMLID_94_\" class=\"st03\" d=\"M811.2,376.5c0,51.2-42.6,92.7-95.2,92.7c-39.2,0-82-43.8-96.5-76.5l2,4.5\n" +
    "		C601,347.3,550.9,312,492.4,312c-76.7,0-138.9,44.3-140,118.9c-0.6,37.4-3.4,108.9-34.3,145.8c-58.2,69.3-163,79.6-234.2,23\n" +
    "		c-32-25.5-51.8-60.2-58.6-96.9h-0.1c-8.3-44.9,2.9-93,34.9-131.1c36.9-43.9,92.9-51,146.6-58.8c54.5-7.9,159.9-65.8,159.9-147.9\n" +
    "		c0-71.1-24.9-136.4-129.9-145.5\">\n" +
    "        </path>\n" +
    "        <path class=\"st04\" d=\"M472.5,315.6c-73,0-124.3-60.5-124.3-131.6v0.4c0-85.7-71.4-155.1-159.4-155.1S29.4,98.8,29.4,184.4\n" +
    "	c0,72.5,72.4,136.1,119,149.9c50.3,14.9,94.3,42,94.3,93.2\">\n" +
    "        </path>\n" +
    "        <path class=\"st05\" d=\"M283.4,639.6c-8.4-1.9-30.1-1.4-57.7-3v-0.1c-78.5-4.6-204.3-26-204.3-165.6c0-93.8,78.1-169.8,174.4-169.8\n" +
    "	c23.9,0,46.1,6.3,67.5,13.2c8.9,2.9,19.7,4.8,37.3,4.9c82.4,0.6,149.7-63.9,150.4-144.1c0.7-80.2-65.6-145.7-148-146.4l11.1-0.2\">\n" +
    "        </path>\n" +
    "        <path class=\"st06\" d=\"M-7,274.1C35.6,278,60.7,322,82,400.5C109.4,502.1,169.6,593,277.5,593S473,507.8,473,402.8\n" +
    "	c0-105.1-59-184.6-164.2-208.2\">\n" +
    "        </path>\n" +
    "    </g>\n" +
    "    <g class=\"triangle\">\n" +
    "        <g id=\"XMLID_11_\">\n" +
    "            <defs>\n" +
    "                <polygon id=\"XMLID_28_\" points=\"86.6,122.9 134.8,150.8 86.6,178.6 			\"/>\n" +
    "            </defs>\n" +
    "            <clipPath id=\"XMLID_59_\">\n" +
    "                <use xlink:href=\"#XMLID_28_\"  style=\"overflow:visible;\"/>\n" +
    "            </clipPath>\n" +
    "            <g id=\"XMLID_12_\" class=\"st1\">\n" +
    "\n" +
    "                <rect id=\"XMLID_27_\" x=\"62.3\" y=\"56.8\" transform=\"matrix(-0.4919 -0.8706 0.8706 -0.4919 -5.5066 228.4022)\" class=\"st2\" width=\"3.1\" height=\"118.1\"/>\n" +
    "\n" +
    "                <rect id=\"XMLID_26_\" x=\"65.5\" y=\"62.2\" transform=\"matrix(-0.4923 -0.8704 0.8704 -0.4923 -5.5426 239.2932)\" class=\"st2\" width=\"3.1\" height=\"118.1\"/>\n" +
    "\n" +
    "                <rect id=\"XMLID_25_\" x=\"68.6\" y=\"67.6\" transform=\"matrix(-0.4921 -0.8705 0.8705 -0.4921 -5.6227 250.1071)\" class=\"st2\" width=\"3.1\" height=\"118.1\"/>\n" +
    "\n" +
    "                <rect id=\"XMLID_24_\" x=\"72\" y=\"73.7\" transform=\"matrix(-0.4923 -0.8704 0.8704 -0.4923 -5.8049 262.0427)\" class=\"st2\" width=\"3.1\" height=\"118.1\"/>\n" +
    "\n" +
    "                <rect id=\"XMLID_23_\" x=\"75\" y=\"79.1\" transform=\"matrix(-0.4918 -0.8707 0.8707 -0.4918 -6.1233 272.6419)\" class=\"st2\" width=\"3.1\" height=\"118.1\"/>\n" +
    "\n" +
    "                <rect id=\"XMLID_22_\" x=\"78.1\" y=\"84.5\" transform=\"matrix(-0.4922 -0.8705 0.8705 -0.4922 -6.1305 283.5341)\" class=\"st2\" width=\"3.1\" height=\"118.1\"/>\n" +
    "\n" +
    "                <rect id=\"XMLID_21_\" x=\"81.2\" y=\"89.9\" transform=\"matrix(-0.4927 -0.8702 0.8702 -0.4927 -6.1188 294.4248)\" class=\"st2\" width=\"3.1\" height=\"118.1\"/>\n" +
    "\n" +
    "                <rect id=\"XMLID_20_\" x=\"84.2\" y=\"95.4\" transform=\"matrix(-0.4922 -0.8705 0.8705 -0.4922 -6.4688 305.2037)\" class=\"st2\" width=\"3.1\" height=\"118.1\"/>\n" +
    "\n" +
    "                <rect id=\"XMLID_19_\" x=\"87.6\" y=\"101.4\" transform=\"matrix(-0.492 -0.8706 0.8706 -0.492 -6.6808 316.9196)\" class=\"st2\" width=\"3.1\" height=\"118.1\"/>\n" +
    "\n" +
    "                <rect id=\"XMLID_18_\" x=\"90.7\" y=\"106.8\" transform=\"matrix(-0.4919 -0.8707 0.8707 -0.4919 -6.7828 327.7585)\" class=\"st2\" width=\"3.1\" height=\"118.1\"/>\n" +
    "\n" +
    "                <rect id=\"XMLID_17_\" x=\"93.7\" y=\"112.3\" transform=\"matrix(-0.4921 -0.8706 0.8706 -0.4921 -6.9975 338.623)\" class=\"st2\" width=\"3.1\" height=\"118.1\"/>\n" +
    "\n" +
    "                <rect id=\"XMLID_16_\" x=\"96.9\" y=\"117.7\" transform=\"matrix(-0.492 -0.8706 0.8706 -0.492 -7.0792 349.4423)\" class=\"st2\" width=\"3.1\" height=\"118.1\"/>\n" +
    "\n" +
    "                <rect id=\"XMLID_15_\" x=\"100.2\" y=\"123.7\" transform=\"matrix(-0.4921 -0.8705 0.8705 -0.4921 -7.2265 361.3614)\" class=\"st2\" width=\"3.1\" height=\"118.1\"/>\n" +
    "\n" +
    "                <rect id=\"XMLID_14_\" x=\"103.3\" y=\"129.1\" transform=\"matrix(-0.4921 -0.8705 0.8705 -0.4921 -7.3003 372.0304)\" class=\"st2\" width=\"3.1\" height=\"118.1\"/>\n" +
    "\n" +
    "                <rect id=\"XMLID_13_\" x=\"106.3\" y=\"134.6\" transform=\"matrix(-0.492 -0.8706 0.8706 -0.492 -7.5973 382.8484)\" class=\"st2\" width=\"3.1\" height=\"118.1\"/>\n" +
    "            </g>\n" +
    "        </g>\n" +
    "        <g class=\"footPrints1 hide-animation\">\n" +
    "            <g class=\"one-foot-print1\" id=\"XMLID_201_\" transform=\"matrix( 2.12353515625, 0, 0, 2.12353515625, 105.25,37.95) \">\n" +
    "                <g id=\"XMLID_202_\" transform=\"matrix( 1, 0, 0, 1, 0,0) \">\n" +
    "                    <g id=\"XMLID_208_\">\n" +
    "                        <g id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_FILL_14_\">\n" +
    "                            <path id=\"XMLID_209_\" d=\"M397.3-219.7c0.1,0.4,0.3,0.7,0.6,0.9c0.3,0.2,0.7,0.3,1,0.2c0.3-0.1,0.5-0.2,0.7-0.5\n" +
    "					c0.5-0.7,0.6-1.4,0.4-2.2c-0.2-0.5-0.5-0.9-0.9-1.3c-0.7-0.5-1.5-0.8-2.4-0.8c-0.8,0-1.4,0.2-1.8,0.7c-0.3,0.4-0.5,0.7-0.4,1\n" +
    "					c0,0.2,0.1,0.3,0.2,0.4c0.2,0.2,0.5,0.3,1.1,0.5c0.6,0.1,1,0.3,1.2,0.4C397.1-220.3,397.2-220.1,397.3-219.7 M407.3-226.4\n" +
    "					c-0.8,0.3-1.7,0.7-2.6,1.4c-1.1,0.8-1.8,1.4-2.4,1.9c-0.9,0.8-1.2,1.5-1,1.9c0.1,0.3,0.3,0.5,0.7,0.7c0.4,0.2,0.8,0.3,1.3,0.3\n" +
    "					c1.2,0.1,2.4-0.2,3.4-0.9c1.6-1,2.6-2,2.9-2.9c0.2-0.6,0.2-1.3-0.2-2C409.1-226.5,408.4-226.7,407.3-226.4 M399.2-226.1\n" +
    "					c-0.4,1.3-0.3,2.2,0.1,2.6c0.4,0.4,1.3,0.2,2.5-0.7c1.1-0.7,2-1.6,2.9-2.6c0.8-0.9,1.3-1.9,1.6-2.8c0.3-1,0.3-1.7-0.2-2.1\n" +
    "					c-1.5-1.2-3.3-0.4-5.3,2.2C400.1-228.5,399.5-227.4,399.2-226.1 M398.5-233.2c-0.4,0-0.8,0.1-1.1,0.3c-1.1,0.6-1.9,1.8-2.5,3.6\n" +
    "					c-0.3,0.9-0.3,1.8,0,2.8c0.1,0.4,0.3,0.8,0.6,1.1c0.2,0.3,0.5,0.4,0.8,0.5c0.2,0,0.4,0,0.6-0.2c0.3-0.2,0.6-0.5,0.8-0.9\n" +
    "					c0.5-0.8,1-1.7,1.5-2.7c0.2-0.6,0.4-1.2,0.6-1.9c0.3-1.3,0.1-2.1-0.4-2.4C399-233.2,398.8-233.2,398.5-233.2z\"/>\n" +
    "                        </g>\n" +
    "                    </g>\n" +
    "                    <g id=\"XMLID_203_\">\n" +
    "                        <path id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_1_STROKES_14_\" class=\"st4\" d=\"M399.6-230.7c-0.1,0.7-0.3,1.3-0.6,1.9\n" +
    "				c-0.5,1-0.9,1.9-1.5,2.7c-0.3,0.4-0.6,0.7-0.8,0.9c-0.2,0.2-0.5,0.3-0.6,0.2c-0.3,0-0.5-0.2-0.8-0.5c-0.2-0.3-0.4-0.6-0.6-1.1\n" +
    "				c-0.3-1-0.3-1.9,0-2.8c0.6-1.8,1.5-3.1,2.5-3.6c0.4-0.2,0.8-0.3,1.1-0.3c0.3,0,0.5,0,0.7,0.1C399.7-232.8,399.9-232,399.6-230.7z\n" +
    "				 M400.8-229.4c-0.7,0.9-1.3,2-1.6,3.3c-0.4,1.3-0.3,2.2,0.1,2.6c0.4,0.4,1.3,0.2,2.5-0.7c1.1-0.7,2-1.6,2.9-2.6\n" +
    "				c0.8-0.9,1.3-1.9,1.6-2.8c0.3-1,0.3-1.7-0.2-2.1C404.5-232.7,402.8-232,400.8-229.4z M407.3-226.4c-0.8,0.3-1.7,0.7-2.6,1.4\n" +
    "				c-1.1,0.8-1.8,1.4-2.4,1.9c-0.9,0.8-1.2,1.5-1,1.9c0.1,0.3,0.3,0.5,0.7,0.7c0.4,0.2,0.8,0.3,1.3,0.3c1.2,0.1,2.4-0.2,3.4-0.9\n" +
    "				c1.6-1,2.6-2,2.9-2.9c0.2-0.6,0.2-1.3-0.2-2C409.1-226.5,408.4-226.7,407.3-226.4z M396.7-223.3c-0.8,0-1.4,0.2-1.8,0.7\n" +
    "				c-0.3,0.4-0.5,0.7-0.4,1c0,0.2,0.1,0.3,0.2,0.4c0.2,0.2,0.5,0.3,1.1,0.5c0.6,0.1,1,0.3,1.2,0.4c0.1,0.1,0.3,0.3,0.4,0.7\n" +
    "				c0.1,0.4,0.3,0.7,0.6,0.9c0.3,0.2,0.7,0.3,1,0.2c0.3-0.1,0.5-0.2,0.7-0.5c0.5-0.7,0.6-1.4,0.4-2.2c-0.2-0.5-0.5-0.9-0.9-1.3\n" +
    "				C398.4-223,397.6-223.3,396.7-223.3z\"/>\n" +
    "                    </g>\n" +
    "                </g>\n" +
    "            </g>\n" +
    "            <g class=\"one-foot-print1\" id=\"XMLID_188_\" transform=\"matrix( 2.12353515625, 0, 0, 2.12353515625, 105.25,37.95) \">\n" +
    "                <g id=\"XMLID_189_\" transform=\"matrix( 1, 0, 0, 1, 0,0) \">\n" +
    "                    <g id=\"XMLID_195_\">\n" +
    "                        <g id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_FILL_13_\">\n" +
    "                            <path id=\"XMLID_196_\" d=\"M417.7-193.9c-0.4,0.2-0.6,0.5-0.7,0.8c-0.1,0.4-0.1,0.7,0.1,1c0.1,0.3,0.4,0.5,0.6,0.6\n" +
    "					c0.8,0.3,1.6,0.2,2.2-0.3c0.4-0.3,0.8-0.7,1-1.2c0.3-0.9,0.3-1.7,0.1-2.5c-0.2-0.8-0.6-1.3-1.2-1.6c-0.4-0.2-0.8-0.3-1.1-0.1\n" +
    "					c-0.1,0.1-0.2,0.2-0.3,0.3c-0.1,0.2-0.2,0.6-0.1,1.2c0.1,0.6,0,1,0,1.3C418.2-194.3,418-194.1,417.7-193.9 M426.9-186.3\n" +
    "					c-0.5-0.7-1.2-1.4-2-2.1c-1-0.8-1.9-1.4-2.5-1.7c-1-0.6-1.8-0.7-2.2-0.4c-0.2,0.2-0.4,0.5-0.5,0.9c-0.1,0.4-0.1,0.9,0,1.3\n" +
    "					c0.2,1.2,0.9,2.2,1.8,3c1.5,1.2,2.6,1.9,3.6,2c0.6,0.1,1.3-0.2,1.9-0.7C427.6-184.6,427.5-185.3,426.9-186.3 M424.4-194\n" +
    "					c-1.4,0-2.2,0.3-2.5,0.8c-0.2,0.5,0.2,1.3,1.4,2.2c1,0.8,2.1,1.5,3.3,2c1.1,0.5,2.2,0.7,3.1,0.8c1.1,0,1.7-0.2,1.9-0.8\n" +
    "					c0.7-1.8-0.5-3.3-3.6-4.4C426.9-193.8,425.7-194,424.4-194 M431-196.7c-0.1-0.4-0.3-0.7-0.6-1c-0.8-0.9-2.2-1.3-4.2-1.4\n" +
    "					c-0.9-0.1-1.8,0.2-2.7,0.8c-0.4,0.3-0.7,0.5-0.9,0.8c-0.2,0.3-0.3,0.6-0.2,0.9c0,0.2,0.1,0.3,0.4,0.5c0.3,0.2,0.7,0.4,1.1,0.5\n" +
    "					c0.9,0.3,1.9,0.5,3,0.6c0.6,0.1,1.3,0.1,2,0c1.3-0.1,2.1-0.5,2.2-1.1C431.1-196.2,431-196.4,431-196.7z\"/>\n" +
    "                        </g>\n" +
    "                    </g>\n" +
    "                    <g id=\"XMLID_190_\">\n" +
    "                        <path id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_1_STROKES_13_\" class=\"st4\" d=\"M428.9-194.9c-0.7,0.1-1.3,0.1-2,0\n" +
    "				c-1.1-0.1-2.1-0.4-3-0.6c-0.5-0.2-0.9-0.3-1.1-0.5c-0.2-0.2-0.4-0.4-0.4-0.5c-0.1-0.3,0-0.6,0.2-0.9c0.2-0.3,0.5-0.6,0.9-0.8\n" +
    "				c0.9-0.6,1.8-0.9,2.7-0.8c1.9,0.1,3.3,0.5,4.2,1.4c0.3,0.3,0.5,0.6,0.6,1c0.1,0.3,0.1,0.5,0.1,0.7\n" +
    "				C430.9-195.4,430.2-195,428.9-194.9z M428-193.4c-1.1-0.4-2.3-0.6-3.6-0.6c-1.4,0-2.2,0.3-2.5,0.8c-0.2,0.5,0.2,1.3,1.4,2.2\n" +
    "				c1,0.8,2.1,1.5,3.3,2c1.1,0.5,2.2,0.7,3.1,0.8c1.1,0,1.7-0.2,1.9-0.8C432.2-190.7,431-192.2,428-193.4z M426.9-186.3\n" +
    "				c-0.5-0.7-1.2-1.4-2-2.1c-1-0.8-1.9-1.4-2.5-1.7c-1-0.6-1.8-0.7-2.2-0.4c-0.2,0.2-0.4,0.5-0.5,0.9c-0.1,0.4-0.1,0.9,0,1.3\n" +
    "				c0.2,1.2,0.9,2.2,1.8,3c1.5,1.2,2.6,1.9,3.6,2c0.6,0.1,1.3-0.2,1.9-0.7C427.6-184.6,427.5-185.3,426.9-186.3z M421-195.5\n" +
    "				c-0.2-0.8-0.6-1.3-1.2-1.6c-0.4-0.2-0.8-0.3-1.1-0.1c-0.1,0.1-0.2,0.2-0.3,0.3c-0.1,0.2-0.2,0.6-0.1,1.2c0.1,0.6,0,1,0,1.3\n" +
    "				c0,0.2-0.2,0.3-0.6,0.6c-0.4,0.2-0.6,0.5-0.7,0.8c-0.1,0.4-0.1,0.7,0.1,1c0.1,0.3,0.4,0.5,0.6,0.6c0.8,0.3,1.6,0.2,2.2-0.3\n" +
    "				c0.4-0.3,0.8-0.7,1-1.2C421.2-193.9,421.2-194.7,421-195.5z\"/>\n" +
    "                    </g>\n" +
    "                </g>\n" +
    "            </g>\n" +
    "            <g class=\"one-foot-print1\" id=\"XMLID_160_\" transform=\"matrix( 2.12353515625, 0, 0, 2.12353515625, 105.25,37.95) \">\n" +
    "                <g id=\"XMLID_161_\" transform=\"matrix( 1, 0, 0, 1, 0,0) \">\n" +
    "                    <g id=\"XMLID_167_\">\n" +
    "                        <g id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_FILL_2_\">\n" +
    "                            <path id=\"XMLID_168_\" d=\"M438.3-244.9c0.3,0.2,0.7,0.3,1,0.3c0.4,0,0.7-0.2,0.9-0.5c0.2-0.2,0.3-0.5,0.3-0.8\n" +
    "					c-0.1-0.9-0.4-1.5-1.1-1.9c-0.4-0.3-1-0.4-1.5-0.4c-0.9,0.1-1.7,0.4-2.3,0.9c-0.6,0.5-1,1.1-1,1.7c0,0.5,0.1,0.8,0.3,1\n" +
    "					c0.1,0.1,0.3,0.2,0.4,0.2c0.2,0,0.6-0.1,1.1-0.3c0.5-0.3,0.9-0.4,1.2-0.5C437.7-245.2,438-245.1,438.3-244.9 M441.7-256.3\n" +
    "					c-0.5,0.7-0.8,1.6-1.1,2.7c-0.3,1.3-0.5,2.2-0.6,3c-0.1,1.2,0,1.9,0.4,2.2c0.2,0.1,0.6,0.2,1,0.1c0.4-0.1,0.8-0.3,1.2-0.6\n" +
    "					c1-0.7,1.7-1.6,2.1-2.9c0.6-1.8,0.7-3.2,0.4-4.1c-0.2-0.6-0.7-1.1-1.4-1.4C443-257.6,442.3-257.3,441.7-256.3 M435.6-251\n" +
    "					c0.6,1.3,1.1,1.9,1.7,1.9c0.6,0,1.1-0.7,1.5-2.1c0.4-1.3,0.6-2.5,0.6-3.8c0-1.2-0.2-2.3-0.5-3.2c-0.4-1-0.9-1.5-1.5-1.4\n" +
    "					c-1.9,0.1-2.8,1.8-2.7,5C434.8-253.4,435.1-252.2,435.6-251 M430.5-256c-0.3,0.3-0.5,0.6-0.7,1c-0.5,1.1-0.3,2.6,0.4,4.4\n" +
    "					c0.3,0.9,0.9,1.6,1.8,2.2c0.4,0.2,0.8,0.4,1.1,0.5c0.4,0.1,0.7,0,0.9-0.1c0.1-0.1,0.3-0.3,0.3-0.6c0.1-0.3,0.1-0.8,0.1-1.3\n" +
    "					c-0.1-0.9-0.3-1.9-0.6-3c-0.2-0.6-0.5-1.2-0.8-1.8c-0.6-1.2-1.2-1.7-1.8-1.6C431-256.3,430.8-256.2,430.5-256z\"/>\n" +
    "                        </g>\n" +
    "                    </g>\n" +
    "                    <g id=\"XMLID_162_\">\n" +
    "                        <path id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_1_STROKES_2_\" class=\"st4\" d=\"M433-254.8c0.3,0.6,0.6,1.2,0.8,1.8\n" +
    "				c0.3,1.1,0.5,2.1,0.6,3c0,0.5,0,0.9-0.1,1.3c-0.1,0.3-0.2,0.5-0.3,0.6c-0.2,0.2-0.5,0.2-0.9,0.1c-0.4-0.1-0.7-0.2-1.1-0.5\n" +
    "				c-0.9-0.6-1.5-1.3-1.8-2.2c-0.7-1.8-0.8-3.3-0.4-4.4c0.2-0.4,0.4-0.7,0.7-1c0.2-0.2,0.4-0.3,0.7-0.4\n" +
    "				C431.8-256.5,432.4-256,433-254.8z M434.8-254.6c0,1.2,0.3,2.4,0.9,3.6c0.6,1.3,1.1,1.9,1.7,1.9c0.6,0,1.1-0.7,1.5-2.1\n" +
    "				c0.4-1.3,0.6-2.5,0.6-3.8c0-1.2-0.2-2.3-0.5-3.2c-0.4-1-0.9-1.5-1.5-1.4C435.5-259.5,434.6-257.8,434.8-254.6z M441.7-256.3\n" +
    "				c-0.5,0.7-0.8,1.6-1.1,2.7c-0.3,1.3-0.5,2.2-0.6,3c-0.1,1.2,0,1.9,0.4,2.2c0.2,0.1,0.6,0.2,1,0.1c0.4-0.1,0.8-0.3,1.2-0.6\n" +
    "				c1-0.7,1.7-1.6,2.1-2.9c0.6-1.8,0.7-3.2,0.4-4.1c-0.2-0.6-0.7-1.1-1.4-1.4C443-257.6,442.3-257.3,441.7-256.3z M435.5-247.3\n" +
    "				c-0.6,0.5-1,1.1-1,1.7c0,0.5,0.1,0.8,0.3,1c0.1,0.1,0.3,0.2,0.4,0.2c0.2,0,0.6-0.1,1.1-0.3c0.5-0.3,0.9-0.4,1.2-0.5\n" +
    "				c0.2,0,0.4,0.1,0.7,0.3c0.3,0.2,0.7,0.3,1,0.3c0.4,0,0.7-0.2,0.9-0.5c0.2-0.2,0.3-0.5,0.3-0.8c-0.1-0.9-0.4-1.5-1.1-1.9\n" +
    "				c-0.4-0.3-1-0.4-1.5-0.4C437-248.1,436.2-247.8,435.5-247.3z\"/>\n" +
    "                    </g>\n" +
    "                </g>\n" +
    "            </g>\n" +
    "            <g class=\"one-foot-print1\" id=\"XMLID_174_\" transform=\"matrix( 2.12353515625, 0, 0, 2.12353515625, 105.25,37.95) \">\n" +
    "                <g id=\"XMLID_175_\" transform=\"matrix( 1, 0, 0, 1, 0,0) \">\n" +
    "                    <g id=\"XMLID_181_\">\n" +
    "                        <g id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_FILL_1_\">\n" +
    "                            <path id=\"XMLID_182_\" d=\"M453.8-207.7c-0.1,0.4-0.1,0.8,0,1.1c0.1,0.4,0.4,0.6,0.7,0.8c0.3,0.1,0.6,0.1,0.8,0\n" +
    "					c0.8-0.3,1.3-0.8,1.5-1.6c0.1-0.5,0.1-1,0-1.6c-0.3-0.8-0.8-1.5-1.5-2c-0.7-0.4-1.3-0.6-1.9-0.5c-0.5,0.1-0.8,0.3-0.9,0.6\n" +
    "					c-0.1,0.2-0.1,0.3,0,0.4c0,0.2,0.2,0.6,0.6,1c0.4,0.4,0.7,0.8,0.8,1C454-208.4,453.9-208.1,453.8-207.7 M465.8-207.7\n" +
    "					c-0.8-0.2-1.8-0.3-2.9-0.3c-1.3,0.1-2.3,0.1-3,0.3c-1.2,0.2-1.8,0.6-1.9,1c-0.1,0.3,0,0.6,0.2,0.9c0.2,0.4,0.5,0.7,0.9,1\n" +
    "					c1,0.8,2.1,1.1,3.3,1.2c1.9,0,3.2-0.2,4-0.8c0.5-0.4,0.9-1,1-1.8C467.4-206.9,466.9-207.4,465.8-207.7 M458.9-212\n" +
    "					c-1.1,0.9-1.5,1.6-1.3,2.2c0.2,0.6,1,0.8,2.5,0.8c1.3,0,2.6-0.2,3.8-0.6c1.2-0.4,2.1-0.8,2.9-1.4c0.8-0.6,1.2-1.3,1-1.8\n" +
    "					c-0.6-1.8-2.5-2.2-5.6-1.1C461-213.5,459.9-212.9,458.9-212 M462.2-218.3c-0.3-0.2-0.7-0.3-1.1-0.4c-1.2-0.1-2.6,0.4-4.1,1.6\n" +
    "					c-0.8,0.6-1.3,1.3-1.6,2.3c-0.1,0.4-0.2,0.8-0.1,1.2c0,0.4,0.2,0.7,0.4,0.8c0.1,0.1,0.3,0.2,0.6,0.2c0.4,0,0.8-0.1,1.2-0.3\n" +
    "					c0.9-0.4,1.8-0.8,2.7-1.4c0.5-0.4,1-0.8,1.5-1.3c0.9-0.9,1.3-1.7,1-2.2C462.7-218,462.5-218.2,462.2-218.3z\"/>\n" +
    "                        </g>\n" +
    "                    </g>\n" +
    "                    <g id=\"XMLID_176_\">\n" +
    "                        <path id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_1_STROKES_1_\" class=\"st4\" d=\"M461.8-215.6c-0.5,0.5-1,0.9-1.5,1.3\n" +
    "				c-0.9,0.6-1.8,1.1-2.7,1.4c-0.5,0.2-0.9,0.3-1.2,0.3c-0.3,0-0.5,0-0.6-0.2c-0.2-0.2-0.3-0.5-0.4-0.8c0-0.4,0-0.8,0.1-1.2\n" +
    "				c0.3-1,0.8-1.8,1.6-2.3c1.5-1.2,2.9-1.7,4.1-1.6c0.4,0,0.8,0.2,1.1,0.4c0.2,0.2,0.4,0.3,0.5,0.5\n" +
    "				C463.1-217.3,462.7-216.6,461.8-215.6z M462.1-213.9c-1.1,0.4-2.2,1-3.2,1.8c-1.1,0.9-1.5,1.6-1.3,2.2c0.2,0.6,1,0.8,2.5,0.8\n" +
    "				c1.3,0,2.6-0.2,3.8-0.6c1.2-0.4,2.1-0.8,2.9-1.4c0.8-0.6,1.2-1.3,1-1.8C467-214.6,465.2-215,462.1-213.9z M465.8-207.7\n" +
    "				c-0.8-0.2-1.8-0.3-2.9-0.3c-1.3,0.1-2.3,0.1-3,0.3c-1.2,0.2-1.8,0.6-1.9,1c-0.1,0.3,0,0.6,0.2,0.9c0.2,0.4,0.5,0.7,0.9,1\n" +
    "				c1,0.8,2.1,1.1,3.3,1.2c1.9,0,3.2-0.2,4-0.8c0.5-0.4,0.9-1,1-1.8C467.4-206.9,466.9-207.4,465.8-207.7z M455.3-211\n" +
    "				c-0.7-0.4-1.3-0.6-1.9-0.5c-0.5,0.1-0.8,0.3-0.9,0.6c-0.1,0.2-0.1,0.3,0,0.4c0,0.2,0.2,0.6,0.6,1c0.4,0.4,0.7,0.8,0.8,1\n" +
    "				c0.1,0.2,0,0.4-0.1,0.8c-0.1,0.4-0.1,0.8,0,1.1c0.1,0.4,0.4,0.6,0.7,0.8c0.3,0.1,0.6,0.1,0.8,0c0.8-0.3,1.3-0.8,1.5-1.6\n" +
    "				c0.1-0.5,0.1-1,0-1.6C456.5-209.9,456-210.6,455.3-211z\"/>\n" +
    "                    </g>\n" +
    "                </g>\n" +
    "            </g>\n" +
    "            <g class=\"one-foot-print1\" id=\"XMLID_40_\" transform=\"matrix( 2.12353515625, 0, 0, 2.12353515625, 105.25,37.95) \">\n" +
    "                <g id=\"XMLID_41_\" transform=\"matrix( 1, 0, 0, 1, 0,0) \">\n" +
    "                    <g id=\"XMLID_21_\">\n" +
    "                        <g id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_FILL_4_\">\n" +
    "                            <path id=\"XMLID_22_\" d=\"M458.4-285.7c0.3,0.2,0.7,0.3,1,0.3c0.4,0,0.7-0.2,0.9-0.5c0.2-0.2,0.3-0.5,0.3-0.8\n" +
    "					c-0.1-0.9-0.4-1.5-1.1-1.9c-0.4-0.3-1-0.4-1.5-0.4c-0.9,0.1-1.7,0.4-2.3,0.9c-0.6,0.5-1,1.1-1,1.7c0,0.5,0.1,0.8,0.3,1\n" +
    "					c0.1,0.1,0.3,0.2,0.4,0.2c0.2,0,0.6-0.1,1.1-0.3c0.5-0.3,0.9-0.4,1.2-0.5C457.8-286,458-285.9,458.4-285.7 M461.8-297.2\n" +
    "					c-0.5,0.7-0.8,1.6-1.1,2.7c-0.3,1.3-0.5,2.2-0.6,3c-0.1,1.2,0,1.9,0.4,2.2c0.2,0.1,0.6,0.2,1,0.1c0.4-0.1,0.8-0.3,1.2-0.6\n" +
    "					c1-0.7,1.7-1.6,2.1-2.9c0.6-1.8,0.7-3.2,0.4-4.1c-0.2-0.6-0.7-1.1-1.4-1.4C463.1-298.5,462.4-298.1,461.8-297.2 M455.7-291.8\n" +
    "					c0.6,1.3,1.1,1.9,1.7,1.9c0.6,0,1.1-0.7,1.5-2.1c0.4-1.3,0.6-2.5,0.6-3.8c0-1.2-0.2-2.3-0.5-3.2c-0.4-1-0.9-1.5-1.5-1.4\n" +
    "					c-1.9,0.1-2.8,1.8-2.7,5C454.9-294.2,455.2-293,455.7-291.8 M450.6-296.8c-0.3,0.3-0.5,0.6-0.7,1c-0.5,1.1-0.3,2.6,0.4,4.4\n" +
    "					c0.3,0.9,0.9,1.6,1.8,2.2c0.4,0.2,0.8,0.4,1.1,0.5c0.4,0.1,0.7,0,0.9-0.1c0.1-0.1,0.3-0.3,0.3-0.6c0.1-0.3,0.1-0.8,0.1-1.3\n" +
    "					c-0.1-0.9-0.3-1.9-0.6-3c-0.2-0.6-0.5-1.2-0.8-1.8c-0.6-1.2-1.2-1.7-1.8-1.6C451.1-297.1,450.8-297,450.6-296.8z\"/>\n" +
    "                        </g>\n" +
    "                    </g>\n" +
    "                    <g id=\"XMLID_16_\">\n" +
    "                        <path id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_1_STROKES_4_\" class=\"st4\" d=\"M453.1-295.6c0.3,0.6,0.6,1.2,0.8,1.8\n" +
    "				c0.3,1.1,0.5,2.1,0.6,3c0,0.5,0,0.9-0.1,1.3c-0.1,0.3-0.2,0.5-0.3,0.6c-0.2,0.2-0.5,0.2-0.9,0.1c-0.4-0.1-0.7-0.2-1.1-0.5\n" +
    "				c-0.9-0.6-1.5-1.3-1.8-2.2c-0.7-1.8-0.8-3.3-0.4-4.4c0.2-0.4,0.4-0.7,0.7-1c0.2-0.2,0.4-0.3,0.7-0.4\n" +
    "				C451.9-297.3,452.5-296.8,453.1-295.6z M454.8-295.4c0,1.2,0.3,2.4,0.9,3.6c0.6,1.3,1.1,1.9,1.7,1.9c0.6,0,1.1-0.7,1.5-2.1\n" +
    "				c0.4-1.3,0.6-2.5,0.6-3.8c0-1.2-0.2-2.3-0.5-3.2c-0.4-1-0.9-1.5-1.5-1.4C455.6-300.3,454.7-298.7,454.8-295.4z M461.8-297.2\n" +
    "				c-0.5,0.7-0.8,1.6-1.1,2.7c-0.3,1.3-0.5,2.2-0.6,3c-0.1,1.2,0,1.9,0.4,2.2c0.2,0.1,0.6,0.2,1,0.1c0.4-0.1,0.8-0.3,1.2-0.6\n" +
    "				c1-0.7,1.7-1.6,2.1-2.9c0.6-1.8,0.7-3.2,0.4-4.1c-0.2-0.6-0.7-1.1-1.4-1.4C463.1-298.5,462.4-298.1,461.8-297.2z M455.6-288.1\n" +
    "				c-0.6,0.5-1,1.1-1,1.7c0,0.5,0.1,0.8,0.3,1c0.1,0.1,0.3,0.2,0.4,0.2c0.2,0,0.6-0.1,1.1-0.3c0.5-0.3,0.9-0.4,1.2-0.5\n" +
    "				c0.2,0,0.4,0.1,0.7,0.3c0.3,0.2,0.7,0.3,1,0.3c0.4,0,0.7-0.2,0.9-0.5c0.2-0.2,0.3-0.5,0.3-0.8c-0.1-0.9-0.4-1.5-1.1-1.9\n" +
    "				c-0.4-0.3-1-0.4-1.5-0.4C457-288.9,456.3-288.6,455.6-288.1z\"/>\n" +
    "                    </g>\n" +
    "                </g>\n" +
    "            </g>\n" +
    "            <g class=\"one-foot-print1\" id=\"XMLID_27_\" transform=\"matrix( 2.12353515625, 0, 0, 2.12353515625, 105.25,37.95) \">\n" +
    "                <g id=\"XMLID_29_\" transform=\"matrix( 1, 0, 0, 1, 0,0) \">\n" +
    "                    <g id=\"XMLID_36_\">\n" +
    "                        <g id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_FILL_3_\">\n" +
    "                            <path id=\"XMLID_37_\" d=\"M476.5-246.6c-0.1,0.4,0,0.8,0.2,1.1c0.2,0.3,0.5,0.5,0.8,0.6c0.3,0.1,0.6,0,0.8-0.1\n" +
    "					c0.8-0.4,1.2-1.1,1.2-1.9c0-0.5-0.1-1-0.3-1.6c-0.5-0.8-1.1-1.3-1.8-1.7c-0.7-0.3-1.4-0.4-2-0.1c-0.5,0.2-0.7,0.4-0.8,0.7\n" +
    "					c0,0.2,0,0.3,0,0.4c0.1,0.2,0.3,0.5,0.8,0.9c0.5,0.3,0.8,0.6,1,0.9C476.5-247.2,476.5-247,476.5-246.6 M488.2-248.6\n" +
    "					c-0.9-0.1-1.8,0-2.9,0.2c-1.3,0.3-2.2,0.5-2.9,0.8c-1.1,0.4-1.7,0.9-1.7,1.4c0,0.3,0.1,0.6,0.4,0.9c0.3,0.3,0.6,0.6,1.1,0.8\n" +
    "					c1.1,0.6,2.2,0.8,3.5,0.6c1.9-0.3,3.2-0.8,3.8-1.4c0.5-0.5,0.7-1.1,0.7-1.9C490-248.1,489.4-248.5,488.2-248.6 M480.7-251.7\n" +
    "					c-0.9,1.1-1.2,1.9-0.9,2.4c0.2,0.5,1.1,0.7,2.6,0.4c1.3-0.2,2.5-0.6,3.7-1.2c1.1-0.6,2-1.2,2.6-1.9c0.7-0.8,0.9-1.4,0.6-2\n" +
    "					c-0.9-1.7-2.8-1.7-5.7-0.1C482.5-253.5,481.6-252.7,480.7-251.7 M483-258.5c-0.4-0.2-0.8-0.2-1.2-0.2c-1.2,0.1-2.4,0.8-3.8,2.3\n" +
    "					c-0.6,0.7-1,1.5-1.1,2.6c0,0.5,0,0.9,0.1,1.2c0.1,0.4,0.3,0.6,0.5,0.7c0.1,0.1,0.4,0.1,0.7,0c0.3-0.1,0.7-0.3,1.2-0.5\n" +
    "					c0.8-0.5,1.6-1.1,2.4-1.9c0.5-0.5,0.9-1,1.3-1.5c0.8-1.1,1-1.9,0.6-2.3C483.4-258.2,483.2-258.4,483-258.5z\"/>\n" +
    "                        </g>\n" +
    "                    </g>\n" +
    "                    <g id=\"XMLID_31_\">\n" +
    "                        <path id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_1_STROKES_3_\" class=\"st4\" d=\"M483-255.7c-0.4,0.5-0.8,1.1-1.3,1.5\n" +
    "				c-0.8,0.7-1.6,1.4-2.4,1.9c-0.4,0.3-0.8,0.4-1.2,0.5c-0.3,0.1-0.5,0.1-0.7,0c-0.2-0.1-0.4-0.4-0.5-0.7c-0.1-0.3-0.1-0.7-0.1-1.2\n" +
    "				c0.1-1,0.5-1.9,1.1-2.6c1.3-1.4,2.6-2.2,3.8-2.3c0.4,0,0.8,0,1.2,0.2c0.3,0.1,0.5,0.3,0.6,0.4C484-257.6,483.8-256.8,483-255.7z\n" +
    "				 M483.5-254.1c-1,0.6-2,1.4-2.8,2.4c-0.9,1.1-1.2,1.9-0.9,2.4c0.2,0.5,1.1,0.7,2.6,0.4c1.3-0.2,2.5-0.6,3.7-1.2\n" +
    "				c1.1-0.6,2-1.2,2.6-1.9c0.7-0.8,0.9-1.4,0.6-2C488.3-255.6,486.4-255.6,483.5-254.1z M488.2-248.6c-0.9-0.1-1.8,0-2.9,0.2\n" +
    "				c-1.3,0.3-2.2,0.5-2.9,0.8c-1.1,0.4-1.7,0.9-1.7,1.4c0,0.3,0.1,0.6,0.4,0.9c0.3,0.3,0.6,0.6,1.1,0.8c1.1,0.6,2.2,0.8,3.5,0.6\n" +
    "				c1.9-0.3,3.2-0.8,3.8-1.4c0.5-0.5,0.7-1.1,0.7-1.9C490-248.1,489.4-248.5,488.2-248.6z M477.4-250.1c-0.7-0.3-1.4-0.4-2-0.1\n" +
    "				c-0.5,0.2-0.7,0.4-0.8,0.7c0,0.2,0,0.3,0,0.4c0.1,0.2,0.3,0.5,0.8,0.9c0.5,0.3,0.8,0.6,1,0.9c0.1,0.1,0.1,0.4,0.1,0.8\n" +
    "				c-0.1,0.4,0,0.8,0.2,1.1c0.2,0.3,0.5,0.5,0.8,0.6c0.3,0.1,0.6,0,0.8-0.1c0.8-0.4,1.2-1.1,1.2-1.9c0-0.5-0.1-1-0.3-1.6\n" +
    "				C478.8-249.2,478.1-249.8,477.4-250.1z\"/>\n" +
    "                    </g>\n" +
    "                </g>\n" +
    "            </g>\n" +
    "            <g class=\"one-foot-print1\" id=\"XMLID_67_\" transform=\"matrix( 2.12353515625, 0, 0, 2.12353515625, 105.25,37.95) \">\n" +
    "                <g id=\"XMLID_68_\" transform=\"matrix( 1, 0, 0, 1, 0,0) \">\n" +
    "                    <g id=\"XMLID_74_\">\n" +
    "                        <g id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_FILL_6_\">\n" +
    "                            <path id=\"XMLID_75_\" d=\"M477.4-328.4c0.3,0.2,0.7,0.3,1,0.3c0.4,0,0.7-0.2,0.9-0.5c0.2-0.2,0.3-0.5,0.3-0.8\n" +
    "					c-0.1-0.9-0.4-1.5-1.1-1.9c-0.4-0.3-1-0.4-1.5-0.4c-0.9,0.1-1.7,0.4-2.3,0.9c-0.6,0.5-1,1.1-1,1.7c0,0.5,0.1,0.8,0.3,1\n" +
    "					c0.1,0.1,0.3,0.2,0.4,0.2c0.2,0,0.6-0.1,1.1-0.3c0.5-0.3,0.9-0.4,1.2-0.5C476.8-328.7,477.1-328.6,477.4-328.4 M480.8-339.9\n" +
    "					c-0.5,0.7-0.8,1.6-1.1,2.7c-0.3,1.3-0.5,2.2-0.6,3c-0.1,1.2,0,1.9,0.4,2.2c0.2,0.1,0.6,0.2,1,0.1c0.4-0.1,0.8-0.3,1.2-0.6\n" +
    "					c1-0.7,1.7-1.6,2.1-2.9c0.6-1.8,0.7-3.2,0.4-4.1c-0.2-0.6-0.7-1.1-1.4-1.4C482.1-341.2,481.4-340.8,480.8-339.9 M474.7-334.5\n" +
    "					c0.6,1.3,1.1,1.9,1.7,1.9c0.6,0,1.1-0.7,1.5-2.1c0.4-1.3,0.6-2.5,0.6-3.8c0-1.2-0.2-2.3-0.5-3.2c-0.4-1-0.9-1.5-1.5-1.4\n" +
    "					c-1.9,0.1-2.8,1.8-2.7,5C473.9-336.9,474.2-335.7,474.7-334.5 M469.6-339.5c-0.3,0.3-0.5,0.6-0.7,1c-0.5,1.1-0.3,2.6,0.4,4.4\n" +
    "					c0.3,0.9,0.9,1.6,1.8,2.2c0.4,0.2,0.8,0.4,1.1,0.5c0.4,0.1,0.7,0,0.9-0.1c0.1-0.1,0.3-0.3,0.3-0.6c0.1-0.3,0.1-0.8,0.1-1.3\n" +
    "					c-0.1-0.9-0.3-1.9-0.6-3c-0.2-0.6-0.5-1.2-0.8-1.8c-0.6-1.2-1.2-1.7-1.8-1.6C470.1-339.8,469.9-339.7,469.6-339.5z\"/>\n" +
    "                        </g>\n" +
    "                    </g>\n" +
    "                    <g id=\"XMLID_69_\">\n" +
    "                        <path id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_1_STROKES_6_\" class=\"st4\" d=\"M472.1-338.3c0.3,0.6,0.6,1.2,0.8,1.8\n" +
    "				c0.3,1.1,0.5,2.1,0.6,3c0.1,0.5,0,0.9-0.1,1.3c-0.1,0.3-0.2,0.5-0.3,0.6c-0.2,0.2-0.5,0.2-0.9,0.1c-0.4-0.1-0.7-0.2-1.1-0.5\n" +
    "				c-0.9-0.6-1.5-1.3-1.8-2.2c-0.7-1.8-0.8-3.3-0.4-4.4c0.2-0.4,0.4-0.7,0.7-1c0.2-0.2,0.4-0.3,0.7-0.4\n" +
    "				C470.9-340,471.5-339.5,472.1-338.3z M473.9-338.1c0,1.2,0.3,2.4,0.9,3.6c0.6,1.3,1.1,1.9,1.7,1.9c0.6,0,1.1-0.7,1.5-2.1\n" +
    "				c0.4-1.3,0.6-2.5,0.6-3.8c0-1.2-0.2-2.3-0.5-3.2c-0.4-1-0.9-1.5-1.5-1.4C474.6-343,473.7-341.4,473.9-338.1z M480.8-339.9\n" +
    "				c-0.5,0.7-0.8,1.6-1.1,2.7c-0.3,1.3-0.5,2.2-0.6,3c-0.1,1.2,0,1.9,0.4,2.2c0.2,0.1,0.6,0.2,1,0.1c0.4-0.1,0.8-0.3,1.2-0.6\n" +
    "				c1-0.7,1.7-1.6,2.1-2.9c0.6-1.8,0.7-3.2,0.4-4.1c-0.2-0.6-0.7-1.1-1.4-1.4C482.1-341.2,481.4-340.8,480.8-339.9z M474.6-330.8\n" +
    "				c-0.6,0.5-1,1.1-1,1.7c0,0.5,0.1,0.8,0.3,1c0.1,0.1,0.3,0.2,0.4,0.2c0.2,0,0.6-0.1,1.1-0.3c0.5-0.3,0.9-0.4,1.2-0.5\n" +
    "				c0.2,0,0.4,0.1,0.7,0.3c0.3,0.2,0.7,0.3,1,0.3c0.4,0,0.7-0.2,0.9-0.5c0.2-0.2,0.3-0.5,0.3-0.8c-0.1-0.9-0.4-1.5-1.1-1.9\n" +
    "				c-0.4-0.3-1-0.4-1.5-0.4C476.1-331.6,475.3-331.3,474.6-330.8z\"/>\n" +
    "                    </g>\n" +
    "                </g>\n" +
    "            </g>\n" +
    "            <g class=\"one-foot-print1\" id=\"XMLID_10_\" transform=\"matrix( 2.12353515625, 0, 0, 2.12353515625, 105.25,37.95) \">\n" +
    "                <g id=\"XMLID_11_\" transform=\"matrix( 1, 0, 0, 1, 0,0) \">\n" +
    "                    <g id=\"XMLID_61_\">\n" +
    "                        <g id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_FILL_5_\">\n" +
    "                            <path id=\"XMLID_62_\" d=\"M491.6-291.3c0,0.4,0,0.8,0.2,1.1c0.2,0.3,0.5,0.5,0.8,0.6c0.3,0,0.6,0,0.8-0.2c0.7-0.5,1.1-1.1,1.1-1.9\n" +
    "					c0-0.5-0.1-1-0.4-1.5c-0.5-0.8-1.1-1.3-1.9-1.6c-0.7-0.3-1.4-0.3-2-0.1c-0.4,0.2-0.7,0.5-0.8,0.8c0,0.2,0,0.3,0,0.4\n" +
    "					c0.1,0.2,0.4,0.5,0.8,0.8c0.5,0.3,0.8,0.6,1,0.8C491.6-292,491.6-291.7,491.6-291.3 M503.3-293.9c-0.9-0.1-1.8,0-2.9,0.3\n" +
    "					c-1.3,0.3-2.2,0.6-2.9,0.9c-1.1,0.5-1.7,0.9-1.7,1.4c0,0.3,0.1,0.6,0.4,0.9c0.3,0.3,0.6,0.6,1.1,0.8c1.1,0.5,2.3,0.7,3.5,0.4\n" +
    "					c1.9-0.4,3.1-0.9,3.8-1.6c0.4-0.5,0.6-1.1,0.6-1.9C505-293.4,504.4-293.8,503.3-293.9 M495.7-296.6c-0.8,1.1-1.1,1.9-0.8,2.5\n" +
    "					c0.3,0.5,1.1,0.6,2.6,0.3c1.3-0.3,2.5-0.7,3.6-1.4c1.1-0.6,1.9-1.3,2.5-2c0.7-0.8,0.9-1.5,0.6-2c-1-1.6-2.9-1.6-5.7,0.1\n" +
    "					C497.3-298.5,496.4-297.7,495.7-296.6 M497.6-303.5c-0.4-0.1-0.8-0.2-1.2-0.1c-1.2,0.1-2.4,0.9-3.7,2.4c-0.6,0.7-1,1.6-1,2.6\n" +
    "					c0,0.5,0,0.9,0.1,1.2c0.1,0.4,0.3,0.6,0.6,0.7c0.1,0.1,0.4,0.1,0.7,0c0.3-0.1,0.7-0.3,1.1-0.6c0.8-0.5,1.5-1.2,2.3-2\n" +
    "					c0.4-0.5,0.8-1,1.2-1.6c0.7-1.1,0.9-1.9,0.5-2.4C498.1-303.2,497.9-303.4,497.6-303.5z\"/>\n" +
    "                        </g>\n" +
    "                    </g>\n" +
    "                    <g id=\"XMLID_12_\">\n" +
    "                        <path id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_1_STROKES_5_\" class=\"st4\" d=\"M497.7-300.7c-0.4,0.6-0.8,1.1-1.2,1.6\n" +
    "				c-0.8,0.8-1.6,1.4-2.3,2c-0.4,0.3-0.8,0.5-1.1,0.6c-0.3,0.1-0.5,0.1-0.7,0c-0.2-0.1-0.4-0.4-0.6-0.7c-0.1-0.3-0.2-0.7-0.1-1.2\n" +
    "				c0.1-1,0.4-1.9,1-2.6c1.3-1.5,2.5-2.3,3.7-2.4c0.4,0,0.8,0,1.2,0.1c0.3,0.1,0.5,0.2,0.6,0.4C498.6-302.6,498.4-301.8,497.7-300.7\n" +
    "				z M498.4-299.1c-1,0.6-1.9,1.4-2.7,2.5c-0.8,1.1-1.1,1.9-0.8,2.5c0.3,0.5,1.1,0.6,2.6,0.3c1.3-0.3,2.5-0.7,3.6-1.4\n" +
    "				c1.1-0.6,1.9-1.3,2.5-2c0.7-0.8,0.9-1.5,0.6-2C503.1-300.8,501.2-300.8,498.4-299.1z M503.3-293.9c-0.9-0.1-1.8,0-2.9,0.3\n" +
    "				c-1.3,0.3-2.2,0.6-2.9,0.9c-1.1,0.5-1.7,0.9-1.7,1.4c0,0.3,0.1,0.6,0.4,0.9c0.3,0.3,0.6,0.6,1.1,0.8c1.1,0.5,2.3,0.7,3.5,0.4\n" +
    "				c1.9-0.4,3.1-0.9,3.8-1.6c0.4-0.5,0.6-1.1,0.6-1.9C505-293.4,504.4-293.8,503.3-293.9z M492.4-294.9c-0.7-0.3-1.4-0.3-2-0.1\n" +
    "				c-0.4,0.2-0.7,0.5-0.8,0.8c0,0.2,0,0.3,0,0.4c0.1,0.2,0.4,0.5,0.8,0.8c0.5,0.3,0.8,0.6,1,0.8c0.1,0.1,0.1,0.4,0.1,0.8\n" +
    "				c0,0.4,0,0.8,0.2,1.1c0.2,0.3,0.5,0.5,0.8,0.6c0.3,0,0.6,0,0.8-0.2c0.7-0.5,1.1-1.1,1.1-1.9c0-0.5-0.1-1-0.4-1.5\n" +
    "				C493.8-294,493.1-294.6,492.4-294.9z\"/>\n" +
    "                    </g>\n" +
    "                </g>\n" +
    "            </g>\n" +
    "            <g class=\"one-foot-print1\" id=\"XMLID_81_\" transform=\"matrix( 2.12353515625, 0, 0, 2.12353515625, 105.25,37.95) \">\n" +
    "                <g id=\"XMLID_82_\" transform=\"matrix( 1, 0, 0, 1, 0,0) \">\n" +
    "                    <g id=\"XMLID_88_\">\n" +
    "                        <g id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_FILL_7_\">\n" +
    "                            <path id=\"XMLID_89_\" d=\"M508.7-370.1c0.2,0.4,0.5,0.6,0.8,0.7c0.4,0.2,0.7,0.2,1,0c0.3-0.1,0.5-0.3,0.6-0.6\n" +
    "					c0.3-0.8,0.3-1.5-0.1-2.2c-0.3-0.4-0.7-0.8-1.2-1.1c-0.8-0.4-1.7-0.4-2.5-0.2c-0.8,0.2-1.3,0.5-1.6,1.1\n" +
    "					c-0.3,0.4-0.3,0.8-0.2,1.1c0.1,0.1,0.2,0.3,0.3,0.3c0.2,0.2,0.6,0.2,1.2,0.2c0.6,0,1,0,1.3,0.1\n" +
    "					C508.3-370.7,508.5-370.5,508.7-370.1 M516.9-378.8c-0.7,0.4-1.5,1.1-2.2,1.9c-0.9,1-1.5,1.8-1.9,2.4c-0.6,1-0.8,1.7-0.6,2.1\n" +
    "					c0.2,0.2,0.4,0.4,0.8,0.5c0.4,0.1,0.8,0.1,1.3,0c1.2-0.2,2.2-0.7,3.1-1.6c1.3-1.4,2.1-2.5,2.2-3.4c0.1-0.6-0.1-1.3-0.6-1.9\n" +
    "					C518.6-379.4,517.9-379.4,516.9-378.8 M509-376.8c-0.1,1.4,0.2,2.2,0.7,2.5c0.5,0.3,1.3-0.1,2.3-1.2c0.9-1,1.6-2,2.2-3.2\n" +
    "					c0.5-1.1,0.9-2.1,1-3.1c0.1-1.1-0.1-1.7-0.7-2c-1.7-0.8-3.3,0.3-4.7,3.3C509.4-379.3,509.1-378.1,509-376.8 M506.7-383.6\n" +
    "					c-0.4,0.1-0.7,0.3-1.1,0.6c-0.9,0.8-1.5,2.1-1.6,4.1c-0.1,0.9,0.1,1.8,0.6,2.7c0.2,0.4,0.5,0.7,0.8,0.9c0.3,0.2,0.6,0.3,0.9,0.3\n" +
    "					c0.2,0,0.4-0.1,0.6-0.4c0.2-0.3,0.4-0.6,0.6-1.1c0.3-0.9,0.6-1.8,0.8-2.9c0.1-0.6,0.1-1.3,0.1-2c0-1.3-0.3-2.1-0.9-2.2\n" +
    "					C507.3-383.6,507-383.6,506.7-383.6z\"/>\n" +
    "                        </g>\n" +
    "                    </g>\n" +
    "                    <g id=\"XMLID_83_\">\n" +
    "                        <path id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_1_STROKES_7_\" class=\"st4\" d=\"M508.4-381.4c0,0.7,0,1.3-0.1,2\n" +
    "				c-0.2,1.1-0.5,2.1-0.8,2.9c-0.2,0.5-0.4,0.8-0.6,1.1c-0.2,0.2-0.4,0.4-0.6,0.4c-0.3,0-0.6-0.1-0.9-0.3c-0.3-0.2-0.6-0.5-0.8-0.9\n" +
    "				c-0.5-0.9-0.7-1.8-0.6-2.7c0.2-1.9,0.7-3.3,1.6-4.1c0.3-0.3,0.7-0.5,1.1-0.6c0.3-0.1,0.5-0.1,0.8,0\n" +
    "				C508.1-383.4,508.4-382.7,508.4-381.4z M509.9-380.4c-0.5,1.1-0.8,2.3-0.8,3.6c-0.1,1.4,0.2,2.2,0.7,2.5c0.5,0.3,1.3-0.1,2.3-1.2\n" +
    "				c0.9-1,1.6-2,2.2-3.2c0.5-1.1,0.9-2.1,1-3.1c0.1-1.1-0.1-1.7-0.7-2C512.8-384.5,511.2-383.4,509.9-380.4z M516.9-378.8\n" +
    "				c-0.7,0.4-1.5,1.1-2.2,1.9c-0.9,1-1.5,1.8-1.9,2.4c-0.6,1-0.8,1.7-0.6,2.1c0.2,0.2,0.4,0.4,0.8,0.5c0.4,0.1,0.8,0.1,1.3,0\n" +
    "				c1.2-0.2,2.2-0.7,3.1-1.6c1.3-1.4,2.1-2.5,2.2-3.4c0.1-0.6-0.1-1.3-0.6-1.9C518.6-379.4,517.9-379.4,516.9-378.8z M507.3-373.5\n" +
    "				c-0.8,0.2-1.3,0.5-1.6,1.1c-0.3,0.4-0.3,0.8-0.2,1.1c0.1,0.1,0.2,0.3,0.3,0.3c0.2,0.2,0.6,0.2,1.2,0.2c0.6,0,1,0,1.3,0.1\n" +
    "				c0.2,0.1,0.3,0.3,0.5,0.6c0.2,0.4,0.5,0.6,0.8,0.7c0.4,0.2,0.7,0.2,1,0c0.3-0.1,0.5-0.3,0.6-0.6c0.3-0.8,0.3-1.5-0.1-2.2\n" +
    "				c-0.3-0.4-0.7-0.8-1.2-1.1C508.9-373.6,508.1-373.7,507.3-373.5z\"/>\n" +
    "                    </g>\n" +
    "                </g>\n" +
    "            </g>\n" +
    "            <g class=\"one-foot-print1\" id=\"XMLID_120_\" transform=\"matrix( 2.12353515625, 0, 0, 2.12353515625, 105.25,37.95) \">\n" +
    "                <g id=\"XMLID_121_\" transform=\"matrix( 1, 0, 0, 1, 0,0) \">\n" +
    "                    <g id=\"XMLID_127_\">\n" +
    "                        <g id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_FILL_10_\">\n" +
    "                            <path id=\"XMLID_128_\" d=\"M509.5-328.4c-0.2,0.4-0.3,0.7-0.2,1.1c0.1,0.4,0.3,0.7,0.6,0.9c0.3,0.2,0.5,0.2,0.8,0.2\n" +
    "					c0.9-0.1,1.5-0.6,1.8-1.3c0.2-0.5,0.3-1,0.3-1.6c-0.2-0.9-0.5-1.6-1.1-2.2c-0.6-0.6-1.2-0.8-1.8-0.8c-0.5,0-0.8,0.2-1,0.4\n" +
    "					c-0.1,0.1-0.1,0.3-0.1,0.4c0,0.2,0.1,0.6,0.5,1.1c0.3,0.5,0.5,0.9,0.6,1.1C509.8-329,509.7-328.8,509.5-328.4 M521.3-326.3\n" +
    "					c-0.8-0.4-1.7-0.7-2.8-0.8c-1.3-0.2-2.3-0.3-3-0.3c-1.2,0-1.9,0.2-2.1,0.7c-0.1,0.3-0.1,0.6,0,1c0.1,0.4,0.4,0.8,0.7,1.2\n" +
    "					c0.8,0.9,1.8,1.5,3.1,1.7c1.9,0.4,3.2,0.4,4.1,0c0.6-0.3,1-0.8,1.3-1.6C522.7-325.1,522.3-325.8,521.3-326.3 M515.3-331.8\n" +
    "					c-1.2,0.7-1.8,1.3-1.7,1.9c0,0.6,0.8,1,2.3,1.3c1.3,0.2,2.6,0.3,3.8,0.1c1.2-0.1,2.2-0.4,3.1-0.8c0.9-0.5,1.4-1,1.3-1.6\n" +
    "					c-0.3-1.9-2.1-2.6-5.3-2.1C517.6-332.8,516.5-332.4,515.3-331.8 M519.8-337.3c-0.3-0.3-0.6-0.5-1-0.6c-1.1-0.3-2.6-0.1-4.3,0.8\n" +
    "					c-0.8,0.4-1.5,1.1-2,2c-0.2,0.4-0.3,0.8-0.3,1.2c0,0.4,0,0.7,0.2,0.9c0.1,0.1,0.3,0.2,0.6,0.3c0.3,0,0.8,0,1.3-0.1\n" +
    "					c0.9-0.2,1.9-0.5,2.9-0.9c0.6-0.3,1.2-0.6,1.7-1c1.1-0.8,1.6-1.4,1.4-2C520.1-336.9,520-337.1,519.8-337.3z\"/>\n" +
    "                        </g>\n" +
    "                    </g>\n" +
    "                    <g id=\"XMLID_122_\">\n" +
    "                        <path id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_1_STROKES_10_\" class=\"st4\" d=\"M518.8-334.7c-0.6,0.4-1.1,0.7-1.7,1\n" +
    "				c-1,0.4-2,0.7-2.9,0.9c-0.5,0.1-0.9,0.1-1.3,0.1c-0.3,0-0.5-0.1-0.6-0.3c-0.2-0.2-0.3-0.5-0.2-0.9c0-0.4,0.1-0.7,0.3-1.2\n" +
    "				c0.5-0.9,1.1-1.6,2-2c1.7-0.9,3.2-1.2,4.3-0.8c0.4,0.1,0.8,0.3,1,0.6c0.2,0.2,0.4,0.4,0.4,0.6\n" +
    "				C520.4-336.2,519.9-335.5,518.8-334.7z M518.8-333c-1.2,0.2-2.3,0.6-3.4,1.2c-1.2,0.7-1.8,1.3-1.7,1.9c0,0.6,0.8,1,2.3,1.3\n" +
    "				c1.3,0.2,2.6,0.3,3.8,0.1c1.2-0.1,2.2-0.4,3.1-0.8c0.9-0.5,1.4-1,1.3-1.6C523.8-332.8,522-333.5,518.8-333z M521.3-326.3\n" +
    "				c-0.8-0.4-1.7-0.7-2.8-0.8c-1.3-0.2-2.3-0.3-3-0.3c-1.2,0-1.9,0.2-2.1,0.7c-0.1,0.3-0.1,0.6,0,1c0.1,0.4,0.4,0.8,0.7,1.2\n" +
    "				c0.8,0.9,1.8,1.5,3.1,1.7c1.9,0.4,3.2,0.4,4.1,0c0.6-0.3,1-0.8,1.3-1.6C522.7-325.1,522.3-325.8,521.3-326.3z M511.6-331.4\n" +
    "				c-0.6-0.6-1.2-0.8-1.8-0.8c-0.5,0-0.8,0.2-1,0.4c-0.1,0.1-0.1,0.3-0.1,0.4c0,0.2,0.1,0.6,0.5,1.1c0.3,0.5,0.5,0.9,0.6,1.1\n" +
    "				c0,0.2,0,0.4-0.2,0.8c-0.2,0.4-0.3,0.7-0.2,1.1c0.1,0.4,0.3,0.7,0.6,0.9c0.3,0.2,0.5,0.2,0.8,0.2c0.9-0.1,1.5-0.6,1.8-1.3\n" +
    "				c0.2-0.5,0.3-1,0.3-1.6C512.6-330.1,512.2-330.8,511.6-331.4z\"/>\n" +
    "                    </g>\n" +
    "                </g>\n" +
    "            </g>\n" +
    "            <g class=\"one-foot-print1\" id=\"XMLID_94_\" transform=\"matrix( 2.12353515625, 0, 0, 2.12353515625, 105.25,37.95) \">\n" +
    "                <g id=\"XMLID_95_\" transform=\"matrix( 1, 0, 0, 1, 0,0) \">\n" +
    "                    <g id=\"XMLID_101_\">\n" +
    "                        <g id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_FILL_8_\">\n" +
    "                            <path id=\"XMLID_102_\" d=\"M561.1-383.4c-0.1,0.4,0,0.8,0.1,1.1c0.2,0.4,0.4,0.6,0.8,0.7c0.3,0.1,0.6,0.1,0.8-0.1\n" +
    "					c0.8-0.4,1.2-1,1.3-1.8c0.1-0.5,0-1-0.2-1.6c-0.4-0.8-1-1.4-1.7-1.8c-0.7-0.4-1.4-0.5-1.9-0.3c-0.5,0.2-0.7,0.4-0.8,0.7\n" +
    "					c0,0.2,0,0.3,0,0.4c0,0.2,0.3,0.5,0.7,0.9c0.5,0.4,0.8,0.7,0.9,0.9C561.2-384,561.2-383.8,561.1-383.4 M573-384.7\n" +
    "					c-0.8-0.2-1.8-0.2-2.9,0c-1.3,0.2-2.3,0.4-3,0.6c-1.1,0.3-1.8,0.8-1.8,1.2c0,0.3,0.1,0.6,0.3,0.9c0.2,0.3,0.6,0.6,1,0.9\n" +
    "					c1,0.7,2.2,0.9,3.4,0.8c1.9-0.2,3.2-0.6,3.9-1.2c0.5-0.4,0.8-1,0.8-1.9C574.7-384,574.1-384.4,573-384.7 M565.7-388.2\n" +
    "					c-1,1-1.3,1.8-1.1,2.3c0.2,0.5,1,0.7,2.5,0.6c1.3-0.1,2.5-0.5,3.7-1c1.1-0.5,2-1,2.7-1.7c0.8-0.7,1-1.4,0.8-1.9\n" +
    "					c-0.8-1.7-2.7-1.9-5.7-0.5C567.6-389.9,566.6-389.2,565.7-388.2 M568.4-394.8c-0.3-0.2-0.7-0.3-1.2-0.3c-1.2,0-2.5,0.7-3.9,2\n" +
    "					c-0.7,0.6-1.1,1.5-1.3,2.5c-0.1,0.5-0.1,0.9,0,1.2c0.1,0.4,0.2,0.6,0.5,0.8c0.1,0.1,0.3,0.1,0.7,0.1c0.3-0.1,0.7-0.2,1.2-0.4\n" +
    "					c0.8-0.4,1.7-1,2.5-1.7c0.5-0.4,0.9-0.9,1.4-1.4c0.8-1,1.1-1.8,0.7-2.3C568.8-394.5,568.7-394.7,568.4-394.8z\"/>\n" +
    "                        </g>\n" +
    "                    </g>\n" +
    "                    <g id=\"XMLID_96_\">\n" +
    "                        <path id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_1_STROKES_8_\" class=\"st4\" d=\"M568.2-392.1c-0.4,0.5-0.9,1-1.4,1.4\n" +
    "				c-0.9,0.7-1.7,1.3-2.5,1.7c-0.4,0.2-0.8,0.4-1.2,0.4c-0.3,0-0.5,0-0.7-0.1c-0.2-0.2-0.4-0.4-0.5-0.8c-0.1-0.4-0.1-0.8,0-1.2\n" +
    "				c0.2-1,0.6-1.9,1.3-2.5c1.4-1.3,2.7-2,3.9-2c0.4,0,0.8,0.1,1.2,0.3c0.3,0.1,0.5,0.3,0.6,0.5C569.3-393.9,569.1-393.1,568.2-392.1\n" +
    "				z M568.7-390.4c-1.1,0.5-2.1,1.2-3,2.2c-1,1-1.3,1.8-1.1,2.3c0.2,0.5,1,0.7,2.5,0.6c1.3-0.1,2.5-0.5,3.7-1c1.1-0.5,2-1,2.7-1.7\n" +
    "				c0.8-0.7,1-1.4,0.8-1.9C573.5-391.6,571.6-391.8,568.7-390.4z M573-384.7c-0.8-0.2-1.8-0.2-2.9,0c-1.3,0.2-2.3,0.4-3,0.6\n" +
    "				c-1.1,0.3-1.8,0.8-1.8,1.2c0,0.3,0.1,0.6,0.3,0.9c0.2,0.3,0.6,0.6,1,0.9c1,0.7,2.2,0.9,3.4,0.8c1.9-0.2,3.2-0.6,3.9-1.2\n" +
    "				c0.5-0.4,0.8-1,0.8-1.9C574.7-384,574.1-384.4,573-384.7z M562.2-386.9c-0.7-0.4-1.4-0.5-1.9-0.3c-0.5,0.2-0.7,0.4-0.8,0.7\n" +
    "				c0,0.2,0,0.3,0,0.4c0,0.2,0.3,0.5,0.7,0.9c0.5,0.4,0.8,0.7,0.9,0.9c0.1,0.1,0.1,0.4,0,0.8c-0.1,0.4,0,0.8,0.1,1.1\n" +
    "				c0.2,0.4,0.4,0.6,0.8,0.7c0.3,0.1,0.6,0.1,0.8-0.1c0.8-0.4,1.2-1,1.3-1.8c0.1-0.5,0-1-0.2-1.6C563.6-385.8,563-386.5,562.2-386.9\n" +
    "				z\"/>\n" +
    "                    </g>\n" +
    "                </g>\n" +
    "            </g>\n" +
    "            <g class=\"one-foot-print1\" id=\"XMLID_133_\" transform=\"matrix( 2.12353515625, 0, 0, 2.12353515625, 105.25,37.95) \">\n" +
    "                <g id=\"XMLID_134_\" transform=\"matrix( 1, 0, 0, 1, 0,0) \">\n" +
    "                    <g id=\"XMLID_140_\">\n" +
    "                        <g id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_FILL_11_\">\n" +
    "                            <path id=\"XMLID_141_\" d=\"M543.4-354c-0.4,0.2-0.6,0.5-0.7,0.8c-0.1,0.4-0.1,0.7,0.1,1c0.1,0.3,0.4,0.5,0.6,0.6\n" +
    "					c0.8,0.3,1.6,0.2,2.2-0.3c0.4-0.3,0.8-0.7,1-1.2c0.3-0.9,0.3-1.7,0.1-2.5c-0.2-0.8-0.6-1.3-1.2-1.6c-0.4-0.2-0.8-0.3-1.1-0.1\n" +
    "					c-0.1,0.1-0.2,0.2-0.3,0.3c-0.1,0.2-0.2,0.6-0.1,1.2c0.1,0.6,0,1,0,1.3C544-354.4,543.8-354.2,543.4-354 M552.7-346.4\n" +
    "					c-0.5-0.7-1.2-1.4-2-2.1c-1-0.8-1.9-1.4-2.5-1.7c-1-0.6-1.8-0.7-2.2-0.4c-0.2,0.2-0.4,0.5-0.5,0.9c-0.1,0.4-0.1,0.9,0,1.3\n" +
    "					c0.2,1.2,0.9,2.2,1.8,3c1.5,1.2,2.6,1.9,3.6,2c0.6,0.1,1.3-0.2,1.9-0.7C553.3-344.7,553.3-345.4,552.7-346.4 M550.1-354.1\n" +
    "					c-1.4,0-2.2,0.3-2.5,0.8c-0.2,0.5,0.2,1.3,1.4,2.2c1,0.8,2.1,1.5,3.3,2c1.1,0.5,2.2,0.7,3.1,0.8c1.1,0,1.7-0.2,1.9-0.8\n" +
    "					c0.7-1.8-0.5-3.3-3.6-4.4C552.6-353.9,551.4-354.1,550.1-354.1 M556.7-356.8c-0.1-0.4-0.3-0.7-0.6-1c-0.8-0.9-2.2-1.3-4.2-1.4\n" +
    "					c-0.9-0.1-1.8,0.2-2.7,0.8c-0.4,0.3-0.7,0.5-0.9,0.8c-0.2,0.3-0.3,0.6-0.2,0.9c0,0.2,0.1,0.3,0.4,0.5c0.3,0.2,0.7,0.4,1.1,0.5\n" +
    "					c0.9,0.3,1.9,0.5,3,0.6c0.6,0.1,1.3,0.1,2,0c1.3-0.1,2.1-0.5,2.2-1.1C556.8-356.2,556.8-356.5,556.7-356.8z\"/>\n" +
    "                        </g>\n" +
    "                    </g>\n" +
    "                    <g id=\"XMLID_135_\">\n" +
    "                        <path id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_1_STROKES_11_\" class=\"st4\" d=\"M554.6-354.9c-0.7,0.1-1.3,0.1-2,0\n" +
    "				c-1.1-0.1-2.1-0.4-3-0.6c-0.5-0.2-0.9-0.3-1.1-0.5c-0.2-0.2-0.4-0.4-0.4-0.5c-0.1-0.3,0-0.6,0.2-0.9c0.2-0.3,0.5-0.6,0.9-0.8\n" +
    "				c0.9-0.6,1.8-0.9,2.7-0.8c1.9,0.1,3.3,0.5,4.2,1.4c0.3,0.3,0.5,0.6,0.6,1c0.1,0.3,0.1,0.5,0.1,0.7\n" +
    "				C556.7-355.4,556-355.1,554.6-354.9z M553.7-353.5c-1.1-0.4-2.3-0.6-3.6-0.6c-1.4,0-2.2,0.3-2.5,0.8c-0.2,0.5,0.2,1.3,1.4,2.2\n" +
    "				c1,0.8,2.1,1.5,3.3,2c1.1,0.5,2.2,0.7,3.1,0.8c1.1,0,1.7-0.2,1.9-0.8C558-350.8,556.8-352.3,553.7-353.5z M552.7-346.4\n" +
    "				c-0.5-0.7-1.2-1.4-2-2.1c-1-0.8-1.9-1.4-2.5-1.7c-1-0.6-1.8-0.7-2.2-0.4c-0.2,0.2-0.4,0.5-0.5,0.9c-0.1,0.4-0.1,0.9,0,1.3\n" +
    "				c0.2,1.2,0.9,2.2,1.8,3c1.5,1.2,2.6,1.9,3.6,2c0.6,0.1,1.3-0.2,1.9-0.7C553.3-344.7,553.3-345.4,552.7-346.4z M546.7-355.6\n" +
    "				c-0.2-0.8-0.6-1.3-1.2-1.6c-0.4-0.2-0.8-0.3-1.1-0.1c-0.1,0.1-0.2,0.2-0.3,0.3c-0.1,0.2-0.2,0.6-0.1,1.2c0.1,0.6,0,1,0,1.3\n" +
    "				c0,0.2-0.2,0.3-0.6,0.6c-0.4,0.2-0.6,0.5-0.7,0.8c-0.1,0.4-0.1,0.7,0.1,1c0.1,0.3,0.4,0.5,0.6,0.6c0.8,0.3,1.6,0.2,2.2-0.3\n" +
    "				c0.4-0.3,0.8-0.7,1-1.2C546.9-353.9,547-354.8,546.7-355.6z\"/>\n" +
    "                    </g>\n" +
    "                </g>\n" +
    "            </g>\n" +
    "            <g class=\"one-foot-print1\" id=\"XMLID_107_\" transform=\"matrix( 2.12353515625, 0, 0, 2.12353515625, 105.25,37.95) \">\n" +
    "                <g id=\"XMLID_108_\" transform=\"matrix( 1, 0, 0, 1, 0,0) \">\n" +
    "                    <g id=\"XMLID_114_\">\n" +
    "                        <g id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_FILL_9_\">\n" +
    "                            <path id=\"XMLID_115_\" d=\"M612.6-362.3c-0.3,0.3-0.5,0.6-0.6,0.9c-0.1,0.4,0,0.7,0.2,1c0.2,0.3,0.4,0.4,0.7,0.5\n" +
    "					c0.8,0.2,1.6,0,2.2-0.5c0.4-0.4,0.7-0.8,0.9-1.3c0.2-0.9,0.2-1.7-0.2-2.5c-0.3-0.7-0.7-1.2-1.3-1.5c-0.5-0.2-0.8-0.2-1.1,0\n" +
    "					c-0.1,0.1-0.2,0.2-0.3,0.3c-0.1,0.2-0.1,0.6,0,1.2c0.1,0.6,0.1,1,0.1,1.3C613.1-362.7,612.9-362.5,612.6-362.3 M622.5-355.6\n" +
    "					c-0.5-0.7-1.3-1.3-2.2-1.9c-1.1-0.7-2-1.2-2.7-1.5c-1.1-0.5-1.8-0.5-2.2-0.2c-0.2,0.2-0.3,0.5-0.4,0.9c0,0.4,0,0.9,0.2,1.3\n" +
    "					c0.4,1.2,1.1,2.1,2.1,2.8c1.6,1.1,2.8,1.6,3.8,1.6c0.6,0,1.2-0.3,1.8-0.9C623.4-354,623.2-354.7,622.5-355.6 M619.2-363\n" +
    "					c-1.4,0.2-2.2,0.5-2.4,1.1c-0.2,0.5,0.3,1.2,1.6,2.1c1.1,0.7,2.2,1.3,3.5,1.7c1.2,0.4,2.2,0.5,3.2,0.5c1.1-0.1,1.7-0.4,1.8-1\n" +
    "					c0.5-1.9-0.9-3.2-4-4.1C621.7-363.1,620.5-363.1,619.2-363 M625.5-366.4c-0.2-0.4-0.4-0.7-0.7-0.9c-0.9-0.8-2.3-1.1-4.3-1\n" +
    "					c-0.9,0-1.8,0.4-2.6,1.1c-0.4,0.3-0.6,0.6-0.8,0.9c-0.2,0.3-0.2,0.6-0.1,0.9c0,0.2,0.2,0.3,0.4,0.5c0.3,0.2,0.7,0.3,1.2,0.4\n" +
    "					c0.9,0.2,1.9,0.3,3,0.3c0.6,0,1.3-0.1,2-0.2c1.3-0.3,2-0.7,2-1.3C625.7-365.8,625.6-366.1,625.5-366.4z\"/>\n" +
    "                        </g>\n" +
    "                    </g>\n" +
    "                    <g id=\"XMLID_109_\">\n" +
    "                        <path id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_1_STROKES_9_\" class=\"st4\" d=\"M623.6-364.3c-0.7,0.1-1.3,0.2-2,0.2\n" +
    "				c-1.1,0-2.1-0.1-3-0.3c-0.5-0.1-0.9-0.2-1.2-0.4c-0.3-0.2-0.4-0.3-0.4-0.5c-0.1-0.3,0-0.6,0.1-0.9c0.2-0.3,0.4-0.6,0.8-0.9\n" +
    "				c0.8-0.7,1.7-1,2.6-1.1c1.9-0.1,3.4,0.2,4.3,1c0.3,0.3,0.6,0.6,0.7,0.9c0.1,0.3,0.2,0.5,0.1,0.7\n" +
    "				C625.6-365,624.9-364.6,623.6-364.3z M622.9-362.8c-1.1-0.3-2.4-0.4-3.7-0.2c-1.4,0.2-2.2,0.5-2.4,1.1c-0.2,0.5,0.3,1.2,1.6,2.1\n" +
    "				c1.1,0.7,2.2,1.3,3.5,1.7c1.2,0.4,2.2,0.5,3.2,0.5c1.1-0.1,1.7-0.4,1.8-1C627.4-360.6,626-361.9,622.9-362.8z M622.5-355.6\n" +
    "				c-0.5-0.7-1.3-1.3-2.2-1.9c-1.1-0.7-2-1.2-2.7-1.5c-1.1-0.5-1.8-0.5-2.2-0.2c-0.2,0.2-0.3,0.5-0.4,0.9c0,0.4,0,0.9,0.2,1.3\n" +
    "				c0.4,1.2,1.1,2.1,2.1,2.8c1.6,1.1,2.8,1.6,3.8,1.6c0.6,0,1.2-0.3,1.8-0.9C623.4-354,623.2-354.7,622.5-355.6z M615.7-364.2\n" +
    "				c-0.3-0.7-0.7-1.2-1.3-1.5c-0.5-0.2-0.8-0.2-1.1,0c-0.1,0.1-0.2,0.2-0.3,0.3c-0.1,0.2-0.1,0.6,0,1.2c0.1,0.6,0.1,1,0.1,1.3\n" +
    "				c0,0.2-0.2,0.4-0.5,0.6c-0.3,0.3-0.5,0.6-0.6,0.9c-0.1,0.4,0,0.7,0.2,1c0.2,0.3,0.4,0.4,0.7,0.5c0.8,0.2,1.6,0,2.2-0.5\n" +
    "				c0.4-0.4,0.7-0.8,0.9-1.3C616-362.6,616-363.4,615.7-364.2z\"/>\n" +
    "                    </g>\n" +
    "                </g>\n" +
    "            </g>\n" +
    "            <g class=\"one-foot-print1\" id=\"XMLID_146_\" transform=\"matrix( 2.12353515625, 0, 0, 2.12353515625, 105.25,37.95) \">\n" +
    "                <g id=\"XMLID_147_\" transform=\"matrix( 1, 0, 0, 1, 0,0) \">\n" +
    "                    <g id=\"XMLID_153_\">\n" +
    "                        <g id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_FILL_12_\">\n" +
    "                            <path id=\"XMLID_154_\" d=\"M581.7-346c-0.4,0-0.8,0.1-1,0.3c-0.3,0.2-0.5,0.5-0.5,0.9c0,0.3,0.1,0.6,0.3,0.8c0.5,0.7,1.2,1,2,0.9\n" +
    "					c0.5,0,1-0.2,1.5-0.5c0.7-0.6,1.2-1.3,1.4-2.1c0.2-0.8,0.2-1.4-0.2-2c-0.2-0.4-0.5-0.6-0.9-0.7c-0.2,0-0.3,0-0.4,0.1\n" +
    "					c-0.2,0.1-0.5,0.4-0.7,0.9c-0.3,0.5-0.5,0.9-0.7,1.1C582.4-346.1,582.1-346.1,581.7-346 M585.5-334.7c0-0.9-0.2-1.8-0.6-2.9\n" +
    "					c-0.5-1.2-0.9-2.1-1.2-2.8c-0.6-1-1.1-1.5-1.6-1.5c-0.3,0-0.6,0.2-0.8,0.5c-0.3,0.3-0.5,0.7-0.7,1.2c-0.4,1.1-0.4,2.3,0,3.5\n" +
    "					c0.6,1.8,1.3,3,2,3.6c0.5,0.4,1.2,0.5,2,0.4C585.2-332.9,585.6-333.6,585.5-334.7 M587.4-342.6c-1.2-0.7-2-0.9-2.5-0.6\n" +
    "					c-0.5,0.3-0.5,1.2,0,2.6c0.4,1.2,1,2.4,1.7,3.4c0.7,1,1.5,1.8,2.2,2.3c0.9,0.6,1.6,0.7,2,0.3c1.5-1.2,1.3-3.1-0.7-5.7\n" +
    "					C589.5-341.1,588.5-341.9,587.4-342.6 M594.5-341.4c0.1-0.4,0.1-0.8,0-1.2c-0.3-1.2-1.2-2.3-2.8-3.4c-0.8-0.5-1.7-0.8-2.7-0.7\n" +
    "					c-0.5,0-0.9,0.1-1.2,0.3c-0.3,0.2-0.6,0.4-0.7,0.6c-0.1,0.2-0.1,0.4,0.1,0.7c0.1,0.3,0.4,0.7,0.7,1.1c0.6,0.7,1.3,1.4,2.2,2.1\n" +
    "					c0.5,0.4,1.1,0.7,1.7,1c1.2,0.6,2,0.7,2.4,0.2C594.3-340.9,594.4-341.1,594.5-341.4z\"/>\n" +
    "                        </g>\n" +
    "                    </g>\n" +
    "                    <g id=\"XMLID_148_\">\n" +
    "                        <path id=\"RaccoonFootPrint01_psd_Asset_Layer_2_0_Layer0_0_1_STROKES_12_\" class=\"st4\" d=\"M591.7-341c-0.6-0.3-1.2-0.6-1.7-1\n" +
    "				c-0.9-0.7-1.6-1.4-2.2-2.1c-0.3-0.4-0.6-0.7-0.7-1.1c-0.1-0.3-0.1-0.5-0.1-0.7c0.1-0.3,0.3-0.5,0.7-0.6c0.3-0.2,0.7-0.2,1.2-0.3\n" +
    "				c1,0,1.9,0.2,2.7,0.7c1.6,1.1,2.6,2.2,2.8,3.4c0.1,0.4,0.1,0.8,0,1.2c-0.1,0.3-0.2,0.5-0.3,0.7\n" +
    "				C593.7-340.3,592.9-340.4,591.7-341z M590.2-340.2c-0.7-0.9-1.6-1.7-2.8-2.4c-1.2-0.7-2-0.9-2.5-0.6c-0.5,0.3-0.5,1.2,0,2.6\n" +
    "				c0.4,1.2,1,2.4,1.7,3.4c0.7,1,1.5,1.8,2.2,2.3c0.9,0.6,1.6,0.7,2,0.3C592.4-335.7,592.2-337.6,590.2-340.2z M585.5-334.7\n" +
    "				c0-0.9-0.2-1.8-0.6-2.9c-0.5-1.2-0.9-2.1-1.2-2.8c-0.6-1-1.1-1.5-1.6-1.5c-0.3,0-0.6,0.2-0.8,0.5c-0.3,0.3-0.5,0.7-0.7,1.2\n" +
    "				c-0.4,1.1-0.4,2.3,0,3.5c0.6,1.8,1.3,3,2,3.6c0.5,0.4,1.2,0.5,2,0.4C585.2-332.9,585.6-333.6,585.5-334.7z M585.3-345.7\n" +
    "				c0.2-0.8,0.2-1.4-0.2-2c-0.2-0.4-0.5-0.6-0.9-0.7c-0.2,0-0.3,0-0.4,0.1c-0.2,0.1-0.5,0.4-0.7,0.9c-0.3,0.5-0.5,0.9-0.7,1.1\n" +
    "				c-0.1,0.1-0.4,0.2-0.8,0.2c-0.4,0-0.8,0.1-1,0.3c-0.3,0.2-0.5,0.5-0.5,0.9c0,0.3,0.1,0.6,0.3,0.8c0.5,0.7,1.2,1,2,0.9\n" +
    "				c0.5,0,1-0.2,1.5-0.5C584.6-344.2,585.1-344.9,585.3-345.7z\"/>\n" +
    "                    </g>\n" +
    "                </g>\n" +
    "            </g>\n" +
    "        </g>\n" +
    "    </g>\n" +
    "</svg>\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("znk/performance/templates/performance.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/performance/templates/performance.html",
    "<ion-view class=\"performance-wrapper\">\n" +
    "    <i on-tap=\"d.returnToHomepage()\" class=\"ion-ios-close-empty\"></i>\n" +
    "    <div class=\"estimated-score-wrapper\">\n" +
    "        <div class=\"estimated-score-title only-mobile\">\n" +
    "            <p>SAT SCORE ESTIMATE</p>\n" +
    "            <P>TOTAL: <span>{{::d.estimatedScoreObj.total.min | number : 0}}-{{::d.estimatedScoreObj.total.max | number : 0}} </span>\n" +
    "                <span ng-if=\"d.totalScore.show\" class=\"totalScore\" ng-class=\"::{ 'green-text': d.totalScore.isPositive, 'red-text': !d.totalScore.isPositive }\">{{:: (d.totalScore.isPositive) ? '+'+d.totalScore.score : d.totalScore.score | number : 0}}</span> <span ng-if=\"d.totalScore.show\">since diagnostic</span></P>\n" +
    "        </div>\n" +
    "        <div estimated-score-drv on-gauge-click=\"gaugeClickHandler\" on-estimated-score=\"onEstimatedScore(estimatedScore)\" on-total-score=\"onTotalScore(totalScore)\"></div>\n" +
    "\n" +
    "        <div class=\"subject-title-wrapper\"\n" +
    "             ng-class=\"{'math':d.currentSubject === d.subjectEnum.math.enum, 'reading':d.currentSubject === d.subjectEnum.reading.enum, 'writing':d.currentSubject === d.subjectEnum.writing.enum}\">\n" +
    "            <span class=\"subject-title\">MATHEMATICS</span>\n" +
    "            <span class=\"subject-title\">READING</span>\n" +
    "            <span class=\"subject-title\">WRITING</span>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"line-with-arrow\">\n" +
    "            <div class=\"ion-arrow-wrapper\">\n" +
    "                <div class=\"ion-arrow-down-b\" ng-style=\"{left: d.arrowPos[d.currentSubject] + 'px' }\"></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <ion-content delegate-handle=\"mainScroll\">\n" +
    "        <div class=\"scroll-helper\"></div>\n" +
    "            <div class=\"performance-timeline\" ng-if=\"d.timeLineData.data.length > 0\" ng-class=\"{ 'show-animation-v2' : d.animation }\">\n" +
    "                <div class=\"title\">{{d.subjectNames[d.currentSubject]}} ESTIMATE SCORE OVERTIME</div>\n" +
    "                <ion-scroll horizontal-scroll-fix=\"mainScroll\" scrollbar-x=\"false\" delegate-handle=\"znk-timeline\" zooming=\"false\" direction=\"x\" style=\"width: 100%\" class=\"performance-timeline-scroll\">\n" +
    "                    <canvas znk-timeline timeline-data=\"d.timeLineData\" timeline-settings=\"d.options\" ></canvas>\n" +
    "                    <div class=\"timeline-min-max\" ng-style=\"d.timelineMinMaxStyle\">\n" +
    "                        {{ d.timelineMinMaxText }}\n" +
    "                    </div>\n" +
    "                </ion-scroll>\n" +
    "            </div>\n" +
    "            <div class=\"performance-stats\">\n" +
    "                <p>OVERALL {{d.subjectNames[d.currentSubject]}} PERFORMANCE</p>\n" +
    "                <div znk-progress-drv\n" +
    "                     show-progress-bubble=\"true\"\n" +
    "                     progress-width=\"{{d.estimatedScoreObj[d.currentSubject].overall.value}}\"></div>\n" +
    "\n" +
    "                <div class=\"weakest-category-wrapper\">\n" +
    "                    <i class=\"grey-cloack-icon\"></i>\n" +
    "                    <p>Avg. Time: {{d.estimatedScoreObj[d.currentSubject].overall.avgTime}} sec</p>\n" +
    "                    <p>Weakest category: <span>{{d.categorysIconsAndNames[d.estimatedScoreObj[d.currentSubject].weakestCategory.id].categoryName}}</span> ({{d.estimatedScoreObj[d.currentSubject].weakestCategory.successRate}}% mastery)</p>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"all-subject-wrapper\"\n" +
    "                 ng-class=\"{'math':d.currentSubject === d.subjectEnum.math.enum, 'reading':d.currentSubject === d.subjectEnum.reading.enum, 'writing':d.currentSubject === d.subjectEnum.writing.enum}\">\n" +
    "                <div class=\"subject-wrapper\" ng-repeat=\"category in d.estimatedScoreObj[d.currentSubject].category track by $index\">\n" +
    "                    <div class=\"subject-category-wrapper\" >\n" +
    "                        <div class=\"circle-with-icon\">\n" +
    "                            <div ng-if=\"d.categorysIconsAndNames[category.id].svgIcon\" ng-include=\"'assets/img/svg/icons/' + d.categorysIconsAndNames[category.id].svgIcon \"></div>\n" +
    "                        </div>\n" +
    "                        <div class=\"category-title\">{{d.categorysIconsAndNames[category.id].categoryName}}</div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"progress-details-wrapper\">\n" +
    "                        <div class=\"level-status-wrapper\">\n" +
    "                            <p>{{category.levelProgress}}% mastery</p>\n" +
    "                            <p>{{category.levelName}}</p>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div class=\"subject-progress-wrapper\">\n" +
    "                            <div znk-progress-drv progress-width=\"{{category.levelProgress}}\"></div>\n" +
    "                            <span class=\"level-white-line line1\"></span>\n" +
    "                            <span class=\"level-white-line line2\"></span>\n" +
    "                            <span class=\"level-white-line line3\"></span>\n" +
    "                            <span class=\"level-white-line line4\"></span>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div class=\"average-time-wrapper\">\n" +
    "                            <i class=\"grey-cloack-icon\"></i>\n" +
    "                            <p>Avg. Time: {{category.avgTime}} sec</p>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n" +
    "\n" +
    "");
}]);

angular.module("znk/settings/templates/aboutUs.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/settings/templates/aboutUs.html",
    "<ion-view class=\"about-Us\">\n" +
    "    <ion-header-bar class=\"znk-header level1\"\n" +
    "                    no-tap-scroll=\"true\">\n" +
    "        <div class=\"buttons\">\n" +
    "            <znk-back-button></znk-back-button>\n" +
    "        </div>\n" +
    "        <div class=\"title\">\n" +
    "            <span class=\"znk-title\">About Us</span>\n" +
    "        </div>\n" +
    "    </ion-header-bar>\n" +
    "\n" +
    "    <ion-content class=\"main-page about-us-bg\">\n" +
    "        <div class=\"main-section\">\n" +
    "            <div class=\"row zinkerz-logo\"></div>\n" +
    "            <div class=\"version-num\" ng-show=\"aboutUsCtrl.appVer\">Version {{::aboutUsCtrl.appVer}}</div>\n" +
    "            <div class=\"text-field\">Zinkerz for the SAT&reg; test creates a personalized roadmap for everyone of our students.\n" +
    "                For each day we have a \"daily\" - a comprehensive system of study with three segments, rotating between\n" +
    "                the three SAT&reg; subjects.\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"row buttons-row\">\n" +
    "                <div class=\"col terms-of-use\" ui-sref=\"termsOfUse\" analytics-on=\"click\"\n" +
    "                     analytics-event=\"click-terms-of-use\" analytics-category=\"settings\">Terms Of Use\n" +
    "                </div>\n" +
    "                <div class=\"col privacy-policy\" ui-sref=\"privacyPolicy\" analytics-on=\"click\"\n" +
    "                     analytics-event=\"click-privacy-policy\" analytics-category=\"settings\">Privacy Policy\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"bottom-row\">\n" +
    "                <div class=\"website\">Visit our website: <!--<a ng-click=\"openInBrowser()>--><span>www.zinkerz.com</span><!--</a>--></div>\n" +
    "                <div class=\"copyright\">&copy; 2014-2015 Zinkerz SAT&reg; test prep.All rights reserved.</div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("znk/settings/templates/faq.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/settings/templates/faq.html",
    "<ion-view class=\"faq support-bg\">\n" +
    "    <ion-header-bar class=\"znk-header level1\" no-tap-scroll=\"true\">\n" +
    "        <div class=\"buttons\">\n" +
    "            <znk-back-button></znk-back-button>\n" +
    "        </div>\n" +
    "        <div class=\"title\">\n" +
    "            <span class=\"znk-title\">FAQ</span>\n" +
    "        </div>\n" +
    "    </ion-header-bar>\n" +
    "    <ion-content class=\"has-header\" scrollbar-y=\"false\">\n" +
    "        <div class=\"faq-container only-tablet\">\n" +
    "\n" +
    "            <div class=\"icon-row\">\n" +
    "                <div class=\"lifebuoy-icon\"></div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"container-header\">Frequently Asked Questions</div>\n" +
    "\n" +
    "            <div class=\"questions-list\">\n" +
    "                <v-accordion class=\"vAccordion--default\">\n" +
    "\n" +
    "                    <v-pane>\n" +
    "                        <v-pane-header>What's a \"workout\"?\n" +
    "                            <div class=\"circle\">\n" +
    "                                <div class=\"ion-ios-arrow-right\"></div>\n" +
    "                            </div>\n" +
    "                        </v-pane-header>\n" +
    "\n" +
    "                        <v-pane-content>A workout includes three personalized sections:\n" +
    "                            \"Tips and Tricks\" teaches you lessons and strategies to crack SAT&reg; questions, \"Mini Challenge\" test your knowledge against the clock, and \"Drill\" goes through specific subject material.\n" +
    "                            Each section is color-coded to a particular SAT&reg; subject – math, critical reading, and writing – and the sections rotate subjects according to your needs.\n" +
    "                            Every 5 workouts we focus on specific subject, to boost your score.\n" +
    "                        </v-pane-content>\n" +
    "                    </v-pane>\n" +
    "\n" +
    "                    <v-pane>\n" +
    "                        <v-pane-header>What is the estimated score?\n" +
    "\n" +
    "                            <div class=\"circle\">\n" +
    "                                <div class=\"ion-ios-arrow-right\"></div>\n" +
    "                            </div>\n" +
    "                        </v-pane-header>\n" +
    "\n" +
    "                        <v-pane-content>\n" +
    "                            Every practice you complete on the app, helps us set and update your estimated score in each subject,\n" +
    "                            and provide a good sense of your exam readiness. While it's only an estimation, it's still a good tool\n" +
    "                            to track your study progress.\n" +
    "                            The more you practice in the app, the more accurate the estimated score becomes!\n" +
    "                        </v-pane-content>\n" +
    "                    </v-pane>\n" +
    "\n" +
    "                    <v-pane>\n" +
    "                        <v-pane-header>Where can I find full solutions for the questions?\n" +
    "                            <div class=\"circle\">\n" +
    "                                <div class=\"ion-ios-arrow-right\"></div>\n" +
    "                            </div>\n" +
    "                        </v-pane-header>\n" +
    "\n" +
    "                        <v-pane-content>Every Zinkerz question has a correct answer explained in-depth,\n" +
    "                            just tap the lightbulb next to the answer.\n" +
    "                        </v-pane-content>\n" +
    "                    </v-pane>\n" +
    "\n" +
    "                    <v-pane>\n" +
    "                        <v-pane-header>How much does Zinkerz cost?\n" +
    "                            <div class=\"circle\">\n" +
    "                                <div class=\"ion-ios-arrow-right\"></div>\n" +
    "                            </div>\n" +
    "                        </v-pane-header>\n" +
    "\n" +
    "                        <v-pane-content>Some of our content is free. You get to know the app, we get to know you...\n" +
    "                            If you find the app fun and useful, you can buy a Zinkerz subscription, depending on how long you need to study.\n" +
    "                            <br>\n" +
    "\n" +
    "                            <div class=\"prices\">\n" +
    "                                <p>1 month: $9.99,</p>\n" +
    "\n" +
    "                                <p>4 months: $29.99,</p>\n" +
    "\n" +
    "                                <p>12 months: $79.99</p>\n" +
    "                            </div>\n" +
    "                        </v-pane-content>\n" +
    "                    </v-pane>\n" +
    "\n" +
    "                    <v-pane>\n" +
    "                        <v-pane-header>What does it mean that Zinkerz is personalized? How does that work?\n" +
    "                            <div class=\"circle\">\n" +
    "                                <div class=\"ion-ios-arrow-right\"></div>\n" +
    "                            </div>\n" +
    "                        </v-pane-header>\n" +
    "\n" +
    "                        <v-pane-content>Starting from the diagnostic test we keep track of all of your actions as you study\n" +
    "                            We're miming your studying for insights on where you struggle, Where you're strong, and what aspects of the test you need\n" +
    "                            to focus on - be it timing, algebra, or double-checking your work. Your workout materials are \"personalized\" based on those\n" +
    "                            insights and the practices we give you are unique to you.\n" +
    "                        </v-pane-content>\n" +
    "                    </v-pane>\n" +
    "\n" +
    "\n" +
    "                </v-accordion>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"faq-container only-mobile\">\n" +
    "            <div class=\"icon-row\">\n" +
    "                <div class=\"lifebuoy-icon\"></div>\n" +
    "            </div>\n" +
    "            <div class=\"container-header\">Frequently Asked Questions</div>\n" +
    "\n" +
    "            <div class=\"questions-list\">\n" +
    "                <v-accordion class=\"vAccordion--default\" control=\"accordion\">\n" +
    "\n" +
    "                    <v-pane>\n" +
    "                        <v-pane-header>What's a \"workout\"?</v-pane-header>\n" +
    "\n" +
    "                        <v-pane-content>A workout includes three personalized sections:\n" +
    "                            \"Tips and Tricks\" teaches you lessons and strategies to crack SAT&reg; questions, \"Mini Challenge\" test your knowledge against the clock, and \"Drill\" goes through specific subject material.\n" +
    "                            Each section is color-coded to a particular SAT&reg; subject – math, critical reading, and writing – and the sections rotate subjects according to your needs.\n" +
    "                            Every 5 workouts we focus on specific subject, to boost your score.\n" +
    "                            <div class=\"close-circle\" ng-click=\"accordion.collapseAll()\">\n" +
    "                                <div class=\"ion-ios-close-empty\"></div>\n" +
    "                            </div>\n" +
    "                        </v-pane-content>\n" +
    "                    </v-pane>\n" +
    "\n" +
    "                    <v-pane>\n" +
    "                        <v-pane-header>What is the estimated score?</v-pane-header>\n" +
    "\n" +
    "                        <v-pane-content>Every practice you complete on the app, helps us set and update your estimated score in each subject,\n" +
    "                            and provide a good sense of your exam readiness. While it's only an estimation, it's still a good tool\n" +
    "                            to track your study progress.\n" +
    "                            The more you practice in the app, the more accurate the estimated score becomes!\n" +
    "                            <div class=\"close-circle\" ng-click=\"accordion.collapseAll()\">\n" +
    "                                <div class=\"ion-ios-close-empty\"></div>\n" +
    "                            </div>\n" +
    "                        </v-pane-content>\n" +
    "                    </v-pane>\n" +
    "\n" +
    "                    <v-pane>\n" +
    "                        <v-pane-header>Where can I find full solutions for the questions?</v-pane-header>\n" +
    "\n" +
    "                        <v-pane-content>Every Zinkerz question has a correct answer explained in-depth,\n" +
    "                            just tap the lightbulb next to the answer.\n" +
    "                            <div class=\"close-circle\" ng-click=\"accordion.collapseAll()\">\n" +
    "                                <div class=\"ion-ios-close-empty\"></div>\n" +
    "                            </div>\n" +
    "                        </v-pane-content>\n" +
    "                    </v-pane>\n" +
    "\n" +
    "                    <v-pane>\n" +
    "                        <v-pane-header>How much does Zinkerz cost?</v-pane-header>\n" +
    "\n" +
    "                        <v-pane-content>Some of our content is free. You get to know the app, we get to know you...\n" +
    "                            If you find the app fun and useful, you can buy a Zinkerz subscription, depending on how long you need to study.<br>\n" +
    "\n" +
    "                            <div class=\"prices\">\n" +
    "\n" +
    "                                <p>1 month: $9.99,</p>\n" +
    "\n" +
    "                                <p>4 months: $29.99,</p>\n" +
    "\n" +
    "                                <p>12 months: $79.99</p>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div class=\"close-circle\" ng-click=\"accordion.collapseAll()\">\n" +
    "                                <div class=\"ion-ios-close-empty\"></div>\n" +
    "                            </div>\n" +
    "                        </v-pane-content>\n" +
    "                    </v-pane>\n" +
    "\n" +
    "                    <v-pane>\n" +
    "                        <v-pane-header>What does it mean that Zinkerz is personalized? How does that work?\n" +
    "                        </v-pane-header>\n" +
    "\n" +
    "                        <v-pane-content>Starting from the diagnostic test we keep track of all of your actions as you study\n" +
    "                            We're miming your studying for insights on where you struggle, Where you're strong, and what aspects of the test you need\n" +
    "                            to focus on - be it timing, algebra, or double-checking your work. Your workout materials are \"personalized\" based on those\n" +
    "                            insights and the practices we give you are unique to you.\n" +
    "                            <div class=\"close-circle\" ng-click=\"accordion.collapseAll()\">\n" +
    "                                <div class=\"ion-ios-close-empty\"></div>\n" +
    "                            </div>\n" +
    "                        </v-pane-content>\n" +
    "                    </v-pane>\n" +
    "\n" +
    "\n" +
    "                </v-accordion>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </ion-content>\n" +
    "</ion-view>\n" +
    "");
}]);

angular.module("znk/settings/templates/privacyPolicy.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/settings/templates/privacyPolicy.html",
    "<ion-view class=\"privacy-Policy\">\n" +
    "    <ion-header-bar class=\"znk-header level1\"\n" +
    "                    no-tap-scroll=\"true\">\n" +
    "        <div class=\"buttons\">\n" +
    "            <znk-back-button></znk-back-button>\n" +
    "        </div>\n" +
    "        <div class=\"title\">\n" +
    "            <span class=\"znk-title\">Privacy Policy</span>\n" +
    "        </div>\n" +
    "    </ion-header-bar>\n" +
    "    <ion-content class=\"has-header\">\n" +
    "        <div class=\"all\">\n" +
    "            <p class=\"last-update-title\">Last updated on: <span class=\"sub-List\">March 2015</span></p>\n" +
    "            <p class=\"paragraph\">\n" +
    "                PLEASE READ THIS DOCUMENT CAREFULLY. We at Zinkerz Technologies Ltd.\n" +
    "                (\"Zinkerz\", \"We\", \"Our\" or \"Us\") have created this privacy policy (\"Privacy Policy\") to\n" +
    "                demonstrate our commitment to your privacy. The following Privacy Policy discloses our\n" +
    "                information gathering and dissemination practices. We offer online learning and education\n" +
    "                solutions, through our website located at www.zinkerz.com (\"Website\") and an application,\n" +
    "                available for download through online or mobile application platforms (jointly the \"App\").\n" +
    "                The Website and the App shall be jointly referred to herein as the\n" +
    "                \"Service\" unless expressly specified otherwise. By accessing or using the Service, you are\n" +
    "                accepting the practices described in this Privacy Policy. The Zinkerz end user license agreement\n" +
    "                (\"Agreement\") incorporates and includes this Privacy Policy and the Terms of Use (\"Terms\"),\n" +
    "                which form an integral and inseparable part of the Agreement. The Terms are incorporated herein\n" +
    "                by reference. Unless expressly specified otherwise: (i) any reference to the Service in this\n" +
    "                Privacy Policy shall include any part thereof; (ii) all capitalized terms used herein shall\n" +
    "                bear the meaning ascribed to them in the Terms; and (iii) all provisions of this Privacy Policy\n" +
    "                shall apply for the benefit of: (a) any subsidiaries and/or affiliates of Zinkerz, including\n" +
    "                their successors and assigns; (b) any entity controlling Zinkerz; (c) any entity controlled\n" +
    "                by Zinkerz; and (d) any entity in common control with Zinkerz. Terms in this Privacy Policy\n" +
    "                appearing in the singular form shall include the plural form, and vice versa, and terms\n" +
    "                appearing in the masculine, feminine or neuter forms shall include all other forms, unless\n" +
    "                expressly set forth otherwise.<br/><br/>\n" +
    "                By joining Zinkerz, or applying to any of the Services offered through the Service, you\n" +
    "                voluntarily and willingly provide Us certain information, including personally identifiable\n" +
    "                information or details (such as your school and zip code) which we collect in order to provide\n" +
    "                the Service, and you expressly consent to Our use and disclosure of your personal information\n" +
    "                in the manner described under this Privacy Policy. If you have any hesitation about providing\n" +
    "                information to Us and/or having your information displayed on the Service or otherwise used in\n" +
    "                any manner permitted in this Privacy Policy and the Terms, you should not become a member of\n" +
    "                Our community; and, if you are already a member, you should close your account and cease using\n" +
    "                the Service.\n" +
    "            </p>\n" +
    "\n" +
    "            <p class=\"paragraph\">\n" +
    "                <header class=\"medium-Header\">Privacy Policy Updates</header>\n" +
    "                We reserve the right, at Our sole discretion, to change this Privacy Policy (\"Updated Privacy Policy\")\n" +
    "                from time to time, without any advance notice before the Updated Privacy Policy comes into effect.\n" +
    "                This Privacy Policy may be revised over time as new features are added to the Service or as we\n" +
    "                incorporate suggestions from our customers. You agree that we may notify you of the Updated Privacy\n" +
    "                Policy by posting it on the Service, and your continued use of the Service after the effective date of\n" +
    "                the Updated Privacy Policy constitutes your agreement to all terms and conditions of the Updated Privacy\n" +
    "                Policy. We recommend that you review any Updated Privacy Policy before using the Service. The Updated\n" +
    "                Privacy Policy will be effective as of the time of posting, or on such later time as may be specified\n" +
    "                in the Updated Privacy Policy, and shall apply to your use of the Service from that point onward.\n" +
    "            </p>\n" +
    "\n" +
    "\n" +
    "            <ol>\n" +
    "                <li><span class=\"information-collected-list\">1. Information Collected</span></li>\n" +
    "                <ol class=\"nest-List\">\n" +
    "                    <p>We collect your personal information in the following ways:</p>\n" +
    "                    <li><span class=\"sub-List\">1.1 Registration.</span> In order to join Zinkerz or apply to any of\n" +
    "                        the Services (become a User), you must provide us with information such as your name and\n" +
    "                        e-mail address and credit card details for certain applications. You may also be required to\n" +
    "                        choose a password. Like other passwords, you should choose one that is known only by you.\n" +
    "                        If you share your password with any third party for any reason, such third party will be\n" +
    "                        granted access to your account and to your personal information, and you shall be held responsible\n" +
    "                        for any actions taken by such third party. Please contact Us immediately if you believe your\n" +
    "                        password was discovered, hacked, or otherwise obtained by any third party unauthorized to do so.<br/><br/>\n" +
    "                        We may request other and/or additional information from you during the registration process that\n" +
    "                        We use in an attempt to provide you with a better user experience, to improve the value and quality\n" +
    "                        of the Service, and to analyze how the Service is used. If you choose to register or apply for\n" +
    "                        certain optional and/or additional features, products and/or services offered through the Service,\n" +
    "                        you may be required to provide additional information to qualify for such features or products. You\n" +
    "                        acknowledge that this information is personal to you and by creating an account on Our Service, you\n" +
    "                        allow others, including us, to identify you and to allow the use of your information in accordance\n" +
    "                        with provisions of the Agreement.\n" +
    "                    </li>\n" +
    "\n" +
    "                    <li><span class=\"sub-List\">1.2 Profile Information.</span> Once you become a User, you may upload additional\n" +
    "                        information to your profile, describing, for example, your skills, experience, educational background,\n" +
    "                        recommendations from other Users, group memberships and networking objectives . Providing additional\n" +
    "                        information about yourself beyond what is minimally required at registration is entirely up to you, but\n" +
    "                        doing so may enable you to derive more benefit from the Service and your network of connections. Any\n" +
    "                        information you provide at registration or in the profile section may be used by Us as described in the\n" +
    "                        Agreement, including for the purpose of allowing other Users to find you on the Service, or for serving\n" +
    "                        you more relevant advertisements on the Service.\n" +
    "                    </li>\n" +
    "\n" +
    "                    <li><span class=\"sub-List\">1.3 Contacts Information.</span> If you are a User, your name, e-mail\n" +
    "                        address, and other personal information, including certain activities you perform on the Service\n" +
    "                        may be displayed to other Users and such details may continue to appear even after you terminate\n" +
    "                        or are terminated from using the Service. In order to connect with others on the Service, you may\n" +
    "                        use the Service to send invitations to other Users, their profiles, or to their e-mail addresses.\n" +
    "                        The names and e-mail addresses of people whom you invite will be used to send invitations and\n" +
    "                        reminders as well as to allow Us to help expand your network. Please note that when you send an\n" +
    "                        invitation to connect to another User, that User will have access to your e-mail address because\n" +
    "                        it is displayed in the invitation. Your connections will also have access to your e-mail address.\n" +
    "                        You should not invite anyone you do not know and trust to connect with you. We may collect\n" +
    "                        non-personal information about your use of the Service. We may also invite you to share non-personal\n" +
    "                        information about yourself which may include, but is not limited to: (i) your age or date of birth;\n" +
    "                        (ii) your gender; (iii) your favorite websites, friend information and fan pages; or (iv) any other\n" +
    "                        information included in the Service, social network or other online profiles. If non-personal\n" +
    "                        information is collected for an activity that also requires personal information, We may combine\n" +
    "                        your non-personal information with your personal information in an attempt to provide you with a\n" +
    "                        better user experience, to improve the value and quality of the Service and to analyze how the Service\n" +
    "                        is being used. In addition to information collected as described above, you may choose to share\n" +
    "                        additional information about yourself throughout the Service. Any actions you perform, including\n" +
    "                        your engagements with other Users are considered public, and are in your sole discretion and sole\n" +
    "                        responsibility.\n" +
    "                    </li>\n" +
    "\n" +
    "                    <li><span class=\"sub-List\">1.4 User correspondence & Customer Service.</span> In the event you send us\n" +
    "                        correspondence, including e-mails and faxes or otherwise interact with Our customer service, We may\n" +
    "                        collect such information in Our records. We may record phone calls to or from Our customer service.\n" +
    "                        We may also retain copies of customer service correspondence and other correspondence sent to you.\n" +
    "                        These records shall be used as described in the Terms. We have no obligation to retain the above\n" +
    "                        materials, and may delete such records if applicable law allows Us to act in such a manner.\n" +
    "                    </li>\n" +
    "                    <li><span class=\"sub-List\">1.5 Polls & Surveys.</span> We may offer optional polls and surveys to Our\n" +
    "                        users, in which demographic information and/or Users’ interests may be examined. The use of the\n" +
    "                        information collected will be explained in detail in the poll or survey itself. If personally\n" +
    "                        identifiable information is planned to be collected in these polls and surveys, Users will be\n" +
    "                        notified as to the nature of the information that will be sought prior to their participation\n" +
    "                        in the poll or survey.\n" +
    "                    </li>\n" +
    "\n" +
    "                    <li><span class=\"sub-List\">1.6 Using the Service.</span> We receive information when you interact with\n" +
    "                        and use the Service. For example, we know when you click on ads, join communities, install and\n" +
    "                        use our products, share information etc. All the aforesaid information shall not be deemed private,\n" +
    "                        and We may use it in any way we deem advisable.\n" +
    "                    </li>\n" +
    "                    <li><span class=\"sub-List\">1.7 Cookies.</span> Cookies are alphanumeric identifiers that We and Our\n" +
    "                        service providers may transfer to your computer, mobile phone or other device, that allow Us to\n" +
    "                        recognize you as a User when you return to the Service and/or when you use the same computer or\n" +
    "                        web browser. Through the cookies, Our systems shall recognize your browser to track site usage\n" +
    "                        and trends, to improve the quality of our Service, to customize your experience on the Service,\n" +
    "                        and deliver third-party advertising to Users both on and off the Service. You can remove or block\n" +
    "                        cookies using the settings in your browser or operating system, but in some cases doing so may\n" +
    "                        affect your ability to use the Service and might diminish the level and diversity of Service you\n" +
    "                        receive from Us. In the course of serving advertisements or optimizing the Service to Our Users,\n" +
    "                        we may allow authorized third parties to place or recognize a unique cookie on your browser. Any\n" +
    "                        information or details provided to third parties through cookies will not be personally identifiable\n" +
    "                        but may provide general segment information for the enhancement of your user experience by providing\n" +
    "                        more relevant advertising. Most browsers or operating systems are initially set up to accept cookies,\n" +
    "                        but you can reset your browser or operating system to refuse all cookies or to indicate when a\n" +
    "                        cookie is being sent. We shall have no responsibility to you with respect to cookies.\n" +
    "                    </li>\n" +
    "                    <li><span class=\"sub-List\">1.8 Advertising.</span> To support the Service and to provide a more relevant\n" +
    "                        and useful experience for our Users, we may target and serve, at no cost to our Users, our own ads\n" +
    "                        and third-party ads both on and off the Service.\n" +
    "                    </li>\n" +
    "                    <li><span class=\"sub-List\">1.9 IP Addresses and Other Information.</span> Due to the communications\n" +
    "                        standards on the Internet, when you visit the Website We automatically receive the URL of the site\n" +
    "                        from which you came and the site to which you are going when you leave the Website. Additionally,\n" +
    "                        advertisers receive the URL of the page you were on when you click on an ad on the Website. We also\n" +
    "                        receive the internet protocol (“IP”) address of your computer (or the proxy server you use to access\n" +
    "                        the World Wide Web), your computer`s operating system and type of web browser you are using, e-mail\n" +
    "                        patterns, your mobile device (including your UDID) and mobile operating system (if you are accessing\n" +
    "                        the App), as well as the name of your ISP or your mobile carrier and certain additional information.\n" +
    "                        We may also receive location data passed to Us from third-party services or GPS-enabled devices that\n" +
    "                        you have enabled. We do not share the link between your IP address and your personally identifiable\n" +
    "                        information or details with third parties without your permission, except as specifically provided\n" +
    "                        otherwise herein.\n" +
    "                    </li>\n" +
    "                </ol>\n" +
    "                <li><span class=\"information-collected-list\">2. Rights to Access, Correct and Delete Information About You</span></li>\n" +
    "                    <p>You may review, update, correct, or delete any personal information by changing the applicable\n" +
    "                        information on your profile page. If you completely delete all of this information, your account may\n" +
    "                        be deactivated. If you update any of your information, we may keep a copy of the information that you\n" +
    "                        originally provided to us in our archives for uses documented in this Privacy Policy. You may request\n" +
    "                        deletion of your information at any time by contacting US. We will respond to your request within\n" +
    "                        thirty (30) days. Please note, however that information you have shared with others, or that other\n" +
    "                        Users have copied, may remain visible on the Service, or on the internet, including in search engine\n" +
    "                        results, even if you request its deletion.\n" +
    "                    </p>\n" +
    "                <li><span class=\"information-collected-list\">3. Data Retention</span></li>\n" +
    "                <p>\n" +
    "                    We retain your information for so long as your account is active and/or as needed to provide you the Service.\n" +
    "                    Please note that your personal information will be stored and processed on our computers or servers in certain\n" +
    "                    jurisdictions, in accordance with such jurisdictions` applicable laws, including privacy protection laws. We\n" +
    "                    shall use our reasonable best efforts to hold and transmit your personal information in a safe, confidential,\n" +
    "                    and secure environment. If you object to your personal information being transferred or used as described in\n" +
    "                    this Privacy Policy, please do not register for the Service. You can deactivate your account by entering it\n" +
    "                    online and clicking on the \"delete account\" option or by sending Us an email to: support@zinkerz.com. We will\n" +
    "                    retain and use your information as necessary to comply with any of Our legal obligations, to resolve any\n" +
    "                    disputes arising out of your use of the Services, to enforce the provisions of this Agreement, to improve the\n" +
    "                    Service, and to offer new features in an effort to better serve our Users.\n" +
    "                </p>\n" +
    "\n" +
    "                <li><span class=\"information-collected-list\">4. Uses of personal information & Data</span></li>\n" +
    "                <ol class=\"nest-List\">\n" +
    "                    <li><span class=\"sub-List\">4.1 Consent to Processing Information About You.</span> By providing personal\n" +
    "                        information to Us for the purposes of creating your User account or adding any additional details to\n" +
    "                        your profile, you are expressly and voluntarily accepting the terms and conditions of the Agreement\n" +
    "                        that allow Us to process and verify information about you. You have the right to withdraw your consent\n" +
    "                        to Our collection and processing of your information at any time, in accordance with the terms of the\n" +
    "                        Agreement, by changing your settings, or by deactivating your account, but please note that your withdrawal\n" +
    "                        of consent will not be retroactive. Subject to the provisions of Section 4.5 below, the aforementioned\n" +
    "                        information shall not include personally identifiable information or details. If you do not agree to such\n" +
    "                        transfer, we recommend you opt-out of the Service and deactivate your account.\n" +
    "                    </li>\n" +
    "\n" +
    "                    <li><span class=\"sub-List\">4.2 Communications.</span> As further described in the Terms, we will communicate\n" +
    "                        with you through e-mail, notices posted on the Service, or through other means available on the Service.\n" +
    "                        We may send you a series of e-mails that help inform new Users about the features of the Service, and we\n" +
    "                        may send you service messages relating to the functioning of the Service. We may also send you messages\n" +
    "                        with promotional information directly or on behalf of our affiliates, unless you have opted out of\n" +
    "                        receiving promotional information. If you wish, you can also opt-out of receiving promotional e-mails by\n" +
    "                        sending Us a request. Please be aware that you cannot opt-out of receiving service messages from Us.\n" +
    "                        Also, if We send communications to you via the carrier service with which you have a mobile\n" +
    "                        communications subscription or otherwise have access, you understand you will pay any service fees\n" +
    "                        associated with your receipt of messages on your mobile device (including text messaging charges).\n" +
    "                    </li>\n" +
    "                    <li><span class=\"sub-List\">4.3.</span> We may use personal information in a variety of ways, including\n" +
    "                        through personal contact, via our Service, through emails and correspondence, and through third parties,\n" +
    "                        such as partners and/or affiliates. We use personal information for the purposes set forth in this Privacy\n" +
    "                        Policy, or as permitted by law. In general, We use personal information in order to: (i) provide the\n" +
    "                        services you request; (ii) send you periodic customer satisfaction, market research or quality assurance\n" +
    "                        surveys; (iii) send you offers and promotions from Us and from Our affiliates which we believe will be of\n" +
    "                        interest to you; and (v) learn about our market and improve our products and services.\n" +
    "                    </li>\n" +
    "\n" +
    "\n" +
    "                    <li><span class=\"sub-List\">4.4 User Communications.</span> Some communication that you initiate through the Service\n" +
    "                        (e.g., an invitation sent to a non-User) will list your primary e-mail address and name in the header of the\n" +
    "                        message. Other communications that you initiate through the Service will list your name as the initiator but\n" +
    "                        will not include your personal e-mail address or other contact information. Your contact information will\n" +
    "                        only be shared with another User if both of you have indicated that you would like to establish contact with\n" +
    "                        each other. You agree that you shall not disclose personally identifiable information about another User under\n" +
    "                        any circumstances to any third party without Our prior, express consent and the consent of any other User,\n" +
    "                        unless for purpose of providing such User(s) with Services authorized by Us. In the process of transaction\n" +
    "                        facilitation between you and other Users, you shall have limited access to other Users' contact information,\n" +
    "                        including. e-mail address or other contact information. By consenting to the applicable Agreement`s terms and\n" +
    "                        conditions, you agree that you will share and/or use any of this information only in the framework of the\n" +
    "                        transaction, and subject to such User`s prior and express approval.\n" +
    "                    </li>\n" +
    "\n" +
    "                    <li><span class=\"sub-List\">4.5 No Spam.</span> Without derogating from the provisions of Section 2.10 of the Terms\n" +
    "                        (found under the User Responsibility chapter), We shall not tolerate spam. Therefore, without limiting the\n" +
    "                        foregoing, you may not add a User to your mailing list (e-mail or physical mail) without their prior, express\n" +
    "                        consent. We strictly enforce our anti-spam policy. Any spam related report and/or complaint can be sent to:\n" +
    "                        support@zinkerz.com.\n" +
    "                    </li>\n" +
    "\n" +
    "                    <li><span class=\"sub-List\">4.6. </span> Customized Content. We use information you provide to us\n" +
    "                        (or to third parties with whom We may offer services), to customize your experience on Our Service. For example,\n" +
    "                        when you login to your account, We will display the names of new Users who have recently joined your network or\n" +
    "                        recent status updates from your connections.\n" +
    "                    </li>\n" +
    "\n" +
    "                    <li><span class=\"sub-List\">4.7 Sharing Information with Third Parties.</span> We take the privacy of our Users very\n" +
    "                        seriously and do not sell, rent, or otherwise provide your personally identifiable information or details to third\n" +
    "                        parties, except as described in this Privacy Policy, including Section 4.3 above.  Therefore, it is important for\n" +
    "                        you to review this Privacy Policy carefully. We will also not share other personal information not published on\n" +
    "                        your profile or generated through engagement with other services, without your explicit consent, or in order to\n" +
    "                        carry out your instructions unless, disclosure is reasonably necessary in Our opinion, in order to perform any\n" +
    "                        of the following actions: (i) comply with legal process, including, but not limited to, civil and criminal\n" +
    "                        subpoenas, court orders and decrees, and/or other compulsory disclosures required by governmental authorities\n" +
    "                        and/or agencies; (ii) enforce this Privacy Policy, the Terms or any other engagement between you and Us; (iii)\n" +
    "                        respond to violation claims of the rights of third parties, whether or not such third party is a User, individual,\n" +
    "                        or governmental authorities and/or agencies; (iv) respond to customer service inquiries; (v) report to your legal\n" +
    "                        representative (if any); or (vi) protect the rights, property, or personal safety of Zinkerz, Our Users or the\n" +
    "                        general public. Notwithstanding the aforementioned, We may provide aggregated and/or statistical anonymous data\n" +
    "                        about the usage of the Service to third parties for various purposes, at our sole discretion, including for the\n" +
    "                        purpose of research, development of educational methods and insights and commercialization thereof as well as  to\n" +
    "                        prospective advertisers and ad agencies on the Service.\n" +
    "                    </li>\n" +
    "\n" +
    "                    <li><span class=\"sub-List\">4.8 Statistics.</span> We may use some or all of the information you provide us in order to\n" +
    "                        perform certain statistical summaries and analysis, research and development activities (including development of\n" +
    "                        educational methods and insights), development of new Service features and improvements thereof, some of which may\n" +
    "                        be presented within the Service or used outside of the Service; provided, however, that none of the above shall\n" +
    "                        include any personally identifiable information or details, and you hereby waive and shall be prevented from\n" +
    "                        raising any claim and/or demand from Us in this respect.\n" +
    "                    </li>\n" +
    "\n" +
    "                    <li><span class=\"sub-List\">4.9 Content Distribution.</span> Content distributed through Our sharing features and third\n" +
    "                        party integrations may result in displaying some of your information outside of the Service. For example, when you\n" +
    "                        post content to a group that is open for public discussion, your content, including your user name as the\n" +
    "                        contributor, may be displayed in search engine results. Or, if you have bound your account to your other social\n" +
    "                        network accounts,  you can easily share content in your Service profile, as well as to the other network accounts.\n" +
    "                        We may provide aggregated anonymous data about the usage of the Service to third parties for purposes that we deem,\n" +
    "                        in our sole discretion, to be appropriate, including to prospective advertisers on the Service.\n" +
    "                    </li>\n" +
    "\n" +
    "                    <li><span class=\"sub-List\">4.10 Links to Third Party Websites & Services.</span> The fact that the Service links to a\n" +
    "                        website or services or presents a banner ad or other type of advertisement does not mean that We endorse or\n" +
    "                        authorize that third party, nor is it a representation of any affiliation with that third party. If you click\n" +
    "                        on a link to a third party website or services, including on an advertisement, you will leave the Service you\n" +
    "                        are using or Service you are running and will be transferred to the third party website, applications and/or\n" +
    "                        services. These third party websites, applications and/or services may place their own cookies or other files\n" +
    "                        on your computer or mobile device, and may collect data or solicit personal information from you. Other\n" +
    "                        websites, applications and services follow different rules regarding the use and/or disclosure of your\n" +
    "                        personal information you submit to them. Because We cannot control the activities of third parties, We\n" +
    "                        disclaim any responsibility for any use of your personal information by such third parties, and do not\n" +
    "                        guarantee that they will adhere to the same privacy and security practices as Us. You are therefore encouraged\n" +
    "                        to read the privacy policies, terms of use or statements of other websites, applications and Services you\n" +
    "                        visit before providing any personal information.\n" +
    "                    </li>\n" +
    "                </ol>\n" +
    "                <li><span class=\"information-collected-list\">5. Third Party Service Providers</span></li>\n" +
    "\n" +
    "                We will only share your information with third parties, in the manner described in this agreement, however, we may\n" +
    "                disclose your personal information to third parties who perform services for us, including Service maintenance.\n" +
    "                Those third parties shall have access to a limited portion of your information only as necessary to perform their\n" +
    "                functions, and for no other purposes.<br/><br/>\n" +
    "\n" +
    "\n" +
    "                <li><span class=\"information-collected-list\">6 Q & A pages, Communities, and other Services</span></li>\n" +
    "                If you post text, media or comments on the answers section of the Service, participate in groups, or offer\n" +
    "                other services, you should be aware that any personally identifiable information or details you choose to\n" +
    "                provide there can be read, collected, or used by other Users of these forums, as well as other third parties,\n" +
    "                and could be used to send you unsolicited messages. We are not responsible for the information you choose to\n" +
    "                submit in these forums. Also, some content in groups may be public and searchable on the internet if the group\n" +
    "                owner has opened the group for public discussions. Please note that ideas you post and information you share\n" +
    "                may be seen and used by other Users, and We cannot guarantee that other Users will not copy or use the ideas\n" +
    "                and information that you share with others on the Service. If you choose to do any of the above, it shall be in\n" +
    "                your sole and absolute responsibility and you waive any claim and/or demand from Us in this respect.<br/><br/>\n" +
    "\n" +
    "\n" +
    "                <li><span class=\"information-collected-list\">7 International Information Transfer</span></li>\n" +
    "                We may transfer your information, including personal information, to affiliated entities or to other third parties\n" +
    "                across borders and from your country or jurisdiction to other countries or jurisdictions around the world. If you\n" +
    "                are located in the U.S, European, Union or other regions with laws governing privacy, data collection and use,\n" +
    "                please note that we may transfer information, including personal information, to a country and jurisdiction that\n" +
    "                does not have the same privacy and data protection laws as your jurisdiction, and you consent to the transfer and\n" +
    "                use of this information, including personal information, as described in this Privacy Policy.<br/><br/>\n" +
    "\n" +
    "\n" +
    "                <li><span class=\"information-collected-list\">8 Disclosures as the Result of a Change in Control or Sale of Zinkerz</span></li>\n" +
    "                We may also disclose your personal information or details and other information you provide to another third party as\n" +
    "                part of a sale of the assets of Zinkerz, a subsidiary or division thereof, or as the result of a change in control of\n" +
    "                the company. Any third party to which We transfer or sell Our assets will have the right to continue to use the\n" +
    "                personal and other information that you provided Us, shall be deemed as the sole and exclusive owner of the\n" +
    "                information (after transfer of Our assets to such third party), and shall be entitled to use such User data and\n" +
    "                information as set forth under this Privacy Policy, or in any other reasonable manner not harmful to the Users.<br/><br/>\n" +
    "\n" +
    "\n" +
    "                <li><span class=\"information-collected-list\">9 Security</span></li>\n" +
    "                We have taken technical and organizational measures designed to secure your personal information from accidental\n" +
    "                loss and from unauthorized access, use, alteration or disclosure. As part of such measures, access to your\n" +
    "                personally identifiable information is restricted to employees on a need-to-know basis who shall use only such\n" +
    "                portion of the information required to provide products and/or services to Users. However, due to the nature\n" +
    "                of the Internet, We cannot guarantee that unauthorized third parties will never be able to overcome those measures\n" +
    "                or use your personal information for improper purposes. It is your responsibility to protect the security of your\n" +
    "                login information. Please note that e-mails and similar means of communication with other Users are not encrypted,\n" +
    "                and we strongly advise you not to communicate any confidential information through these means.<br/><br/>\n" +
    "\n" +
    "\n" +
    "                <li><span class=\"information-collected-list\">10 Contacting Us</span></li>\n" +
    "                For any questions about our Privacy Policy or any other issue please contact Us by sending your request to the\n" +
    "                following e-mail: support@zinkerz.com.<br/><br/>\n" +
    "\n" +
    "\n" +
    "                <header class=\"medium-Header\">Order of Precedence</header>\n" +
    "                In the event of a contradiction or discrepancy between the provisions of this Privacy Policy and any of the\n" +
    "                provisions of the Terms, the provision most beneficial to Zinkerz shall prevail and supersede in all respects,\n" +
    "                and you hereby waive and are prevented from raising any claim and/or demand from Us in this respect.\n" +
    "            </ol>\n" +
    "        </div>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("znk/settings/templates/settings.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/settings/templates/settings.html",
    "<ion-view class=\"settings\">\n" +
    "    <ion-header-bar class=\"znk-header level1\"\n" +
    "                    no-tap-scroll=\"true\">\n" +
    "        <div class=\"buttons\">\n" +
    "            <a ui-sref=\"app.home\" class=\"ion-ios-close-empty\" analytics-on=\"click\" analytics-event=\"click-go-back\" analytics-category=\"setting\"></a>\n" +
    "        </div>\n" +
    "        <div class=\"title\">\n" +
    "            <span class=\"znk-title\">Settings</span>\n" +
    "        </div>\n" +
    "    </ion-header-bar>\n" +
    "    <ion-content class=\"settings-menu\">\n" +
    "        <div class=\"list\">\n" +
    "            <div class=\"section ng-hide\" ng-show=\"d.expiryDate === null\" ng-if=\"::!d.hideGetZinkerz\">\n" +
    "                <div class=\"row\" on-tap=\"d.openPurchasePopUp()\"\n" +
    "                     analytics-on\n" +
    "                     analytics-event=\"click-zinkerzsat-pro\"\n" +
    "                     analytics-category=\"settings\">\n" +
    "                    <div class=\"col col-10\">\n" +
    "                        <div class=\"znk-pro-icon\"></div>\n" +
    "                    </div>\n" +
    "                    <div class=\"col\">Get Zinkerz\n" +
    "                        <div class=\"pro-sign\"></div>\n" +
    "                        <div class=\"ion-ios-arrow-right\"></div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"section ng-hide\" ng-hide=\"d.expiryDate === null\">\n" +
    "                <div class=\"row\"\n" +
    "                     analytics-on\n" +
    "                     analytics-event=\"click-zinkerzsat-pro\"\n" +
    "                     analytics-category=\"settings\">\n" +
    "                    <div class=\"col col-10\">\n" +
    "                        <div class=\"znk-pro-icon\"></div>\n" +
    "                    </div>\n" +
    "                    <div class=\"col\">ZinkerzSAT\n" +
    "                        <div class=\"pro-sign\"></div>\n" +
    "                        <span class=\"expiration-date\">\n" +
    "                            Expires in {{d.expiryDate | date:shortDate }}\n" +
    "                        </span>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"section\">\n" +
    "                <div class=\"row\" ui-sref=\"app.profile\" analytics-on=\"click\" analytics-event=\"click-user-profile\"\n" +
    "                     analytics-category=\"settings\">\n" +
    "                    <div class=\"col col-10\">\n" +
    "                        <div class=\"profile-icon\"></div>\n" +
    "                    </div>\n" +
    "                    <div class=\"col border-col\" ng-style=\"::d.isFacebook\">My Profile\n" +
    "                        <div class=\"ion-ios-arrow-right\"></div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"row\" ui-sref=\"app.changePassword\" ng-hide=\"::d.hideChangedPassword\" analytics-on=\"click\"\n" +
    "                     analytics-event=\"click-change-password\"\n" +
    "                     analytics-category=\"settings\">\n" +
    "                    <div class=\"col col-10\">\n" +
    "                        <div class=\"password-icon\"></div>\n" +
    "                    </div>\n" +
    "                    <div class=\"col\">Change Password\n" +
    "                        <div class=\"ion-ios-arrow-right\"></div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"section\">\n" +
    "                <div class=\"row\" ui-sref=\"app.aboutUs\" analytics-on=\"click\" analytics-event=\"click-aboutUs\"\n" +
    "                     analytics-category=\"settings\">\n" +
    "                    <div class=\"col col-10\">\n" +
    "                        <div class=\"about-icon\"></div>\n" +
    "                    </div>\n" +
    "                    <div class=\"col border-col\">About\n" +
    "                        <div class=\"ion-ios-arrow-right\"></div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"row\" ui-sref=\"support\" analytics-on=\"click\" analytics-event=\"click-support\"\n" +
    "                     analytics-category=\"settings\">\n" +
    "                    <div class=\"col col-10\">\n" +
    "                        <div class=\"support-icon\"></div>\n" +
    "                    </div>\n" +
    "                    <div class=\"col\">Support\n" +
    "                        <div class=\"ion-ios-arrow-right\"></div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"section\">\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"col col-10\">\n" +
    "                        <div class=\"sound-icon\"></div>\n" +
    "                    </div>\n" +
    "                    <div class=\"col\">Sound</div>\n" +
    "                    <ion-toggle\n" +
    "                        ng-model=\"d.soundsEnabled\"\n" +
    "                        ng-change=\"toogleAppSound()\" analytics-event=\"click-toggle-sound\"\n" +
    "                        analytics-category=\"settings\">\n" +
    "                    </ion-toggle>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"section logout\">\n" +
    "                <div class=\"row\" ui-sref=\"logout(::{ provider: d.provider })\" analytics-on=\"click\" analytics-event=\"click-logout\"\n" +
    "                     analytics-category=\"settings\">\n" +
    "                    <div class=\"col\">Logout</div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("znk/settings/templates/support.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/settings/templates/support.html",
    "<ion-view class=\"support support-bg\">\n" +
    "    <ion-header-bar class=\"znk-header level1\" no-tap-scroll=\"true\">\n" +
    "        <div class=\"buttons\">\n" +
    "            <znk-back-button></znk-back-button>\n" +
    "        </div>\n" +
    "        <div class=\"title\">\n" +
    "            <span class=\"znk-title\">Support</span>\n" +
    "        </div>\n" +
    "    </ion-header-bar>\n" +
    "    <ion-content class=\"has-header\" scrollbar-y=\"false\">\n" +
    "        <div class=\"container\">\n" +
    "            <div class=\"row lifebuoy-icon\"></div>\n" +
    "            <div class=\"row text-header\">\n" +
    "                <div class=\"col header\">Need some help?</div>\n" +
    "            </div>\n" +
    "            <div class=\"row sub-text\">\n" +
    "                <div class=\"col\">Feel free to get in touch with our friendly support team.</div>\n" +
    "            </div>\n" +
    "            <div class=\"row options\">\n" +
    "                <div class=\"col list\">\n" +
    "                    <div class=\"row first\">\n" +
    "                        <div class=\"col\" ng-click=\"sendEmail()\" analytics-on=\"click\" analytics-event=\"click-send-email\" analytics-category=\"Support\">\n" +
    "                            Contact Us\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"row\" ng-click=\"d.showQuestionTour()\">\n" +
    "                        <div class=\"col\">\n" +
    "                            Question Page Tour\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"row last\">\n" +
    "                        <div class=\"col\" ui-sref=\"app.faq\" analytics-on=\"click\" analytics-event=\"click-faq\"\n" +
    "                             analytics-catagory=\"FAQ\">\n" +
    "                            Faq\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"row bottom\">Visit our website: <!--<a ng-click=\"openInBrowser()>--><span>www.zinkerz.com</span><!--</a>--></div>\n" +
    "        </div>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n" +
    "");
}]);

angular.module("znk/settings/templates/termsOfUse.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/settings/templates/termsOfUse.html",
    "<ion-view class=\"terms-of-use\">\n" +
    "    <ion-header-bar class=\"znk-header level1\"\n" +
    "                    no-tap-scroll=\"true\">\n" +
    "        <div class=\"buttons\">\n" +
    "            <znk-back-button></znk-back-button>\n" +
    "        </div>\n" +
    "        <div class=\"title\">\n" +
    "            <span class=\"znk-title\">Terms Of Use</span>\n" +
    "        </div>\n" +
    "    </ion-header-bar>\n" +
    "    <ion-content class=\"has-header\">\n" +
    "\n" +
    "        <div class=\"all-page\">\n" +
    "            <p style=\"text-align:center;\">Last updated on: <span style=\"text-decoration: underline;\">March 2015</span></p>\n" +
    "\n" +
    "\n" +
    "            <p class=\"first-par\">\n" +
    "                <span class=\"bold\">PLEASE READ THIS DOCUMENT CAREFULLY.</span> Zinkerz Technologies Ltd.\n" +
    "                (\"<span class=\"bold\">Zinkerz</span>\", \"<span class=\"bold\">We</span>\", \"<span class=\"bold\">Our</span>\" or \"<span class=\"bold\">Us</span>\") offers\n" +
    "                online learning & education solutions through its website located at www.zinkerz.com (\"<span class=\"bold\">Website</span>\") and an\n" +
    "                application that is available for download through online and mobile application platforms (jointly the \"<span class=\"bold\">App\"</span>).\n" +
    "                The Website and the App shall be jointly referred to herein as the \"<span class=\"bold\">Service</span>\", unless expressly specified\n" +
    "                otherwise. By registering or by using the Service in any way (jointly \"<span class=\"bold\">User</span>\" or \"<span class=\"bold\">Users</span>\", as the case may be),\n" +
    "                you accept the Terms of Use (\"<span class=\"bold\">Terms</span>\"), which form a binding legal agreement between you and Zinkerz. If you\n" +
    "                do not agree to be bound by these Terms, do not use or otherwise access the Service. The Zinkerz User agreement\n" +
    "                (\"<span class=\"bold\">Agreement</span>\"), incorporates and includes: (i) these Terms; and (ii) the privacy policy (\"<span class=\"bold\">Privacy Policy</span>\"),\n" +
    "                which form an integral and inseparable part of the Agreement. Unless expressly specified otherwise: (i) any\n" +
    "                reference to the Service in these Terms shall include any part thereof; and (ii) all provisions of these\n" +
    "                Terms shall apply for the benefit of: (a) any other subsidiaries and/or affiliates of Zinkerz, including\n" +
    "                their successors and assigns; (b) any entity controlling Zinkerz; (c) any entity controlled by Zinkerz,\n" +
    "                including Zinkerz USA Inc.; and (d) any entity in common control with Zinkerz. Words in these Terms appearing\n" +
    "                in the singular form shall include the plural form, and vice versa, and words appearing in the masculine,\n" +
    "                feminine or neuter forms shall include all other forms, unless expressly set forth otherwise.\n" +
    "            </p>\n" +
    "\n" +
    "\n" +
    "            <ol class=\"main-list\">\n" +
    "\n" +
    "            <li><span class=\"title\">1. Grant Of License</span>\n" +
    "                <p>For the term of this Agreement, we hereby grant you a limited, non-exclusive, non-transferable,\n" +
    "                    non-sub licensable, revocable license to use the Service and the Information exclusively for\n" +
    "                    your own benefit and subject to payment of the applicable fees (if any). For purpose hereof,\n" +
    "                    “<span class=\"bold\">Information</span>” shall mean any educational information, lessons or tutorials or any other\n" +
    "                    information or data found on the Service, uploaded by you or by other Users, or otherwise\n" +
    "                    provided by Us, in the framework of the Service.\n" +
    "                </p>\n" +
    "            </li>\n" +
    "            <li><span class=\"title\">2. We Provide You:</span><br/>\n" +
    "                <ol class=\"paragraph2-list\">\n" +
    "                    <li>\n" +
    "                        2.1 Subject to your full compliance with these Terms,\n" +
    "                        We shall\n" +
    "                        provide the Service, which may include, but not be limited to, the sharing of\n" +
    "                        educational information, lessons or tutorials, including videos, presentations and\n" +
    "                        written materials and a User profile (including, but not limited to text, the opportunity\n" +
    "                        to invite others to use the Service via email and/or through social networks, user\n" +
    "                        comments, messages, information, data, graphics, photographs, images, illustrations,\n" +
    "                        animations, software, audio, and video).  Please note that parts of the Service or\n" +
    "                        certain features may be provided only to Users who subscribe for such Service and/or\n" +
    "                        features and that We may charge fees for such Service and/or features.\n" +
    "                    </li>\n" +
    "                    <li> 2.2 All references in these Terms to the Services shall\n" +
    "                        include, without limitation,\n" +
    "                        the Services and Content, unless expressly set forth otherwise.\n" +
    "\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                        2.3 We shall be entitled, but not obligated, to hold events\n" +
    "                        related to the Services\n" +
    "                        from time to time, and certain Users, as We shall determine, may be invited to take\n" +
    "                        part in such events, which may include contests related to materials appearing on\n" +
    "                        the Service. We may further hold contests and competitions on the Service, subject\n" +
    "                        to their compliance with applicable law.\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                        2.4 We may change, suspend, or discontinue any or\n" +
    "                        all of the Service for any\n" +
    "                        reason, at any time, including the availability of any feature or part of the Service\n" +
    "                        at Our sole discretion. We may also impose limits on any or all of the Service or\n" +
    "                        restrict your access to parts or all of the Service without notice or liability. We\n" +
    "                        may charge fees for the use of the Service or part of it and may include advertisements\n" +
    "                        or other commercial content in any product, image and/or webpage including those which\n" +
    "                        have been created by Users, unless stated otherwise.\n" +
    "                    </li>\n" +
    "                </ol>\n" +
    "            </li>\n" +
    "\n" +
    "            <li><span class=\"title\">3. User's Responsibilities:</span>\n" +
    "                <ol>\n" +
    "                    <li>\n" +
    "                            3.1 You acknowledge that you are at least of legal age\n" +
    "                            allowing you to perform\n" +
    "                            transactions in your country of residency, in order to use the Service, and in any\n" +
    "                            event not under the age of thirteen (13). If you are younger - any use by you of the\n" +
    "                            Service shall be considered an unauthorized use and a breach of the Agreement and shall\n" +
    "                            entitle Us, without derogating from all other remedies available to Us by law or in\n" +
    "                            agreement, to terminate you as a User forthwith.\n" +
    "\n" +
    "                    <li/>\n" +
    "                    <li>\n" +
    "                            3.2 If you are using the Service on behalf of a legal entity,\n" +
    "                            you represent that you\n" +
    "                            are authorized to enter into an agreement on behalf of that legal entity and acknowledge\n" +
    "                            additional provisions and policies may apply for use in the Services by such legal entity,\n" +
    "                            as may be determined from time to time by Zinkerz.\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                            3.3 You are solely responsible for any activity that\n" +
    "                            occurs through your account and you\n" +
    "                            agree you will not sell, transfer, license or assign your account, username, or any account\n" +
    "                            rights to any third party. With the exception of people or businesses that are expressly\n" +
    "                            authorized by Zinkerz to create accounts on behalf of their employers or clients, all accounts\n" +
    "                            shall solely be used for the personal education of the User, and you agree that your account\n" +
    "                            will solely be used for such purposes. You also represent that all information you provide to\n" +
    "                            Us upon registration and at all other times will be true, accurate, current, and complete,\n" +
    "                            and you agree to update your information as necessary to maintain its accuracy.\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                            3.4 You agree that you will not solicit, collect, or use\n" +
    "                            any login details of other Users,\n" +
    "                            and the only details you shall be authorized to use shall be as provided to you by Us, and\n" +
    "                            may be used specifically and exclusively for the purposes such details were provided.\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                            3.5 You are solely responsible for keeping your password\n" +
    "                            (if any) secret and secure. You\n" +
    "                            shall further be solely responsible for all telephone, computer, modem, and other equipment\n" +
    "                            and software necessary to access and use the Service, and for all charges necessary or\n" +
    "                            applicable for such access and use.\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                            3.6 You obligate that when using the Service you shall\n" +
    "                            not do any of the following: (i)\n" +
    "                            post violent, nude, partially nude, discriminatory, unlawful, infringing, hateful,\n" +
    "                            pornographic or sexually suggestive photos, or illegal content; (ii) defame, stalk, bully,\n" +
    "                            abuse, harass, threaten, impersonate or intimidate people or entities; (iii) try to sabotage\n" +
    "                            or otherwise hinder the Service, including as set forth in Sections ‎3.11 and ‎3.12 below; or\n" +
    "                            (iv) post private or confidential information, including, without limitation, any other\n" +
    "                            person's credit card information, social security or national identity numbers, non-public\n" +
    "                            phone numbers or non-public email addresses. If you do any of the above actions, We shall\n" +
    "                            be entitled to immediately terminate your account and you shall be prevented from using the Service.\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                            3.7 You may not use the Service for any illegal or\n" +
    "                            unauthorized purpose. You agree to\n" +
    "                            comply with all laws, rules and regulations (for example, federal, state, local and\n" +
    "                            provincial) applicable to your use of the Service and your User Content (as defined below),\n" +
    "                            including but not limited to, intellectual property rights and privacy protection laws.\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                            3.8 You are solely responsible for your conduct and any\n" +
    "                            data, text, files, information,\n" +
    "                            images, graphics, photos, profiles, audio and video clips, sounds, musical works, works\n" +
    "                            of authorship, applications, links, and other content or materials, including educational\n" +
    "                            materials, and lessons(collectively, \"<span class=\"bold\">User Content</span>\") that you may submit, post or display\n" +
    "                            on or via the Service.\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                            3.9 You may not change, modify, adapt or alter the Service\n" +
    "                            or change, modify or alter\n" +
    "                            another website so as to falsely imply that it is associated with the Service or with Zinkerz.\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                            3.10 You may not send unwanted e-mails, comments, likes,\n" +
    "                            or other forms of commercial or\n" +
    "                            harassing communications (also referred to as \"<span class=\"bold\">spam</span>\") to Users or to any third party, and\n" +
    "                            if you do so you shall bear all consequences arising there from.\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                            3.11 You agree that you will not use any device, software,\n" +
    "                            or other instrumentality to\n" +
    "                            interfere or attempt to interfere with the proper working of the Service and/or servers\n" +
    "                            and/or networks connected to the Service, and that you will not take any action that\n" +
    "                            imposes an unreasonable or disproportionately large load on our infrastructure. In\n" +
    "                            addition, you agree that you will not use any robot, spider, other automatic device\n" +
    "                            or manual process to monitor, scrape, or copy the Service or the Zinkerz Content\n" +
    "                            (as defined in Section ‎‎7.13 below) contained therein, or any aspect and/or part of the\n" +
    "                            Service or the Zinkerz Content.\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                            3.12 You agree that you will not interrupt, disrupt,\n" +
    "                            alter, destroy, impair, restrict,\n" +
    "                            tamper or otherwise affect the proper operation of the Service in any way, including,\n" +
    "                            without limitation, through the use of any malicious or unauthorized code, virus, worm,\n" +
    "                            Trojan horse, spyware, malware or any other destructive or disruptive means or\n" +
    "                            technologies. You may not inject content or code or otherwise alter or interfere with\n" +
    "                            the way any page is displayed in a User's browser or device.\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                            3.13 You must not create accounts with the Service\n" +
    "                            through unauthorized means,\n" +
    "                            including but not limited to, by using an automated device, script, bot, spider,\n" +
    "                            crawler or scraper.\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                            3.14 You must not misrepresent and/or provide false or\n" +
    "                            misleading information, including but\n" +
    "                            not limited to, cloaking or altering the information and/or Information, including identification\n" +
    "                            of the source, time and location any contact was made with the Service via the Internet.\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                            3.15 You shall not attempt to restrict another User\n" +
    "                            from using or enjoying the Service and\n" +
    "                            you must not encourage or facilitate violations of these Terms.\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                            3.16 Violation of these Terms may result in termination\n" +
    "                            of your account subject to Our sole\n" +
    "                            discretion. You understand and agree that We cannot and will not be responsible for the User\n" +
    "                            Content posted on the Service, and you use the Service solely at your own risk. If you violate,\n" +
    "                            act against these Terms or otherwise create risk or possible legal exposure for US, We shall be\n" +
    "                            entitled to stop providing all or part of the Service to you, and you hereby waive and shall be\n" +
    "                            prevented from raising any claim and/or demand from Us in this respect.\n" +
    "                    </li>\n" +
    "                </ol>\n" +
    "            </li>\n" +
    "\n" +
    "            <li><span class=\"title\">4. The App</span><br/>\n" +
    "                <ol>\n" +
    "                    <li>\n" +
    "                        In addition to the Service offered on the Website, Zinkerz is offering the Service\n" +
    "                        through the App. All provisions of these Terms shall apply to the App, unless expressly\n" +
    "                        specified otherwise. The App may include different and/or additional services and\n" +
    "                        features from those appearing on the Website, and the terms and conditions and privacy\n" +
    "                        policies of the online or mobile application platforms shall apply to your use and access\n" +
    "                        to the App.<br/><br/>\n" +
    "                        The contents included in the App may be offered as Zinkerz Content\n" +
    "                        (as defined in Section ‎‎7.13 below) or as User Content, or the combination of both,\n" +
    "                        and may be comprised of exams, exercises, lessons and challenges and solutions to the\n" +
    "                        aforementioned contents. The App`s download from the online or mobile application\n" +
    "                        platforms may be as appearing in the applicable online or mobile application platforms.\n" +
    "                        However, some services offered on the App may be charged with a fee and considered a\n" +
    "                        Charged Service (as defined in Section ‎5 below), and in such an event all provisions\n" +
    "                        referring to Charged Service in these Terms shall apply to such services provided in the\n" +
    "                        App, mutatis mutandis.\n" +
    "                    </li>\n" +
    "                </ol>\n" +
    "            </li>\n" +
    "\n" +
    "            <li><span class=\"title\">Fees and Payments</span>\n" +
    "                <ol>\n" +
    "                    <li>\n" +
    "                          1.1 Some of the Service and/or features offered on\n" +
    "                            the Service, including Tutor\n" +
    "                            Services and Exams, require payment of fees (\"<span class=\"bold\">Charged Service</span>\"). If you elect to\n" +
    "                            sign up for a Charged Service, you shall pay all applicable fees, as described on\n" +
    "                            the Service, in connection with such Charged Service selected by you. We reserve\n" +
    "                            the right to change prices of any Charged Service at any time. You authorize Us\n" +
    "                            directly or through third parties, to make any inquiries We consider necessary to\n" +
    "                            validate your account and financial information that you provided while signing up\n" +
    "                            for such Charged Service.\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                           1.2 All fees are exclusive of all taxes, levies,\n" +
    "                            or duties imposed by taxing\n" +
    "                            authorities, and you shall be solely responsible for payment of all such taxes,\n" +
    "                            levies, or duties. You agree to pay any such taxes that might be applicable to your\n" +
    "                            use of the Charged Service and any other payments made by you to Us.\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                           1.3 If, at any time, you contact your bank or credit\n" +
    "                            card company and decline or\n" +
    "                            otherwise reject the charge of any payable fees, this act will be considered a\n" +
    "                            breach of your obligation hereunder and your use of the Charged Service will be\n" +
    "                            automatically terminated. Your use of the Charged Service will not resume until you\n" +
    "                            re-subscribe for any such Charged Service and settle any unpaid sum you owe Us.\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                           1.4 Users purchasing a Charged Service shall pay any\n" +
    "                            and all prices and fees due\n" +
    "                            for such Charged Service. All prices and fees are non-refundable unless otherwise\n" +
    "                            expressly noted, even if such Charged Service is suspended, terminated, or transferred\n" +
    "                            prior to the lapse of these Terms. We expressly reserve the right to change or modify\n" +
    "                            prices and fees at any time, and such changes or modifications shall be posted on the\n" +
    "                            Service and effective immediately without need for further notice to any User.  Any\n" +
    "                            changes or modifications in prices and fees shall be effective when the Service in\n" +
    "                            question come up for renewal as further described below, or if We posted a new price\n" +
    "                            list for such Services on the Service.\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                           1.5 In order to ensure that you do not experience\n" +
    "                            an interruption or loss of Service,\n" +
    "                            some services offered on the Service may include an automatic renewal option. The\n" +
    "                            automatic renewal option automatically renews the applicable Service for a renewal\n" +
    "                            period equal in time to the original Service period. For example, if your original\n" +
    "                            Service period is for one (1) year, your renewal period will be for one (1) year. While\n" +
    "                            the details of the automatic renewal option vary, the services that offer an automatic\n" +
    "                            renewal option treat it as the default setting. Therefore, unless you cancel your\n" +
    "                            subscription We will automatically renew the applicable Service when it comes up for\n" +
    "                            renewal, and will continue billing your account in accordance to the payment method you\n" +
    "                            have on file with Us at Our then current rates, which you acknowledge and agree may be\n" +
    "                            higher or lower than the rates for the original Service period. You may cancel your\n" +
    "                            subscription from such Service prior to the automatic renewal at any time by sending Us\n" +
    "                            a request to the e-mail address specified above or in accordance to the directions\n" +
    "                            specified in the App. In such event the Service shall be discontinued upon the expiration\n" +
    "                            of the respective period you have paid for and you hereby waive any claims and/or demands\n" +
    "                            from Us in this respect.\n" +
    "                        </li>\n" +
    "                    </ol>\n" +
    "                </li>\n" +
    "\n" +
    "                <li><span class=\"title\">5. Cancellation & Money Back</span>\n" +
    "                    <ol>\n" +
    "                        <li>\n" +
    "                                1.1 Our Charged Service is provided on a prepay\n" +
    "                                basis.Users may decide to discontinue\n" +
    "                                their use of any Charged Service at any time. Such cancellation is done by the Users\n" +
    "                                themselves on the Service and according to the instructions posted therein. The date and\n" +
    "                                time of any cancellation of the use of any Charged Service shall be the date and time on\n" +
    "                                which the User has completed the cancellation process on the Service.\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                                1.2 We shall only refund you according to Our money\n" +
    "                                back guaranty policy. We\n" +
    "                                offer a two (2) day money back guaranty (\"<span class=\"bold\">Guaranty Period</span>\"). In case you are not\n" +
    "                                satisfied with any of the Charged Service you have acquired and you have provided a\n" +
    "                                cancellation notice, you can submit a refund request in accordance with our money\n" +
    "                                back guaranty policy, as may be amended from time to time, within the Guaranty Period\n" +
    "                                in order to receive full refund. We will not refund any amounts paid after the lapse\n" +
    "                                of the Guaranty Period.\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                                1.3 YOU HEREBY ACKNOWLEDGE AND AGREE THAT\n" +
    "                                CERTAIN SERVICES PURCHASED ON\n" +
    "                                OR THROUGH THE SERVICE ARE NON-REFUNDABLE. THE TERMS OF EACH SERVICE ARE\n" +
    "                                INDICATED IN THE SERVICE AS PART OF OR DURING THE PROCESS OF PURCHASING\n" +
    "                                SUCH SERVICES. IT IS YOUR OBLIGATION TO VERIFY YOUR ABILITY TO CANCEL A\n" +
    "                                SERVICE PRIOR TO PURCHASING ANY CHARGED SERVICE. WE WILL NOT REFUND ANY\n" +
    "                                AMOUNTS PAID FOR NON-REFUNDABLE CHARGED SERVICE.\n" +
    "                        </li>\n" +
    "                     </ol>\n" +
    "                </li>\n" +
    "\n" +
    "                <li><span class=\"title\">6. General Terms & Conditions</span>\n" +
    "                    <ol>\n" +
    "                        <li>\n" +
    "                            6.1 Zinkerz does not claim ownership of any User Content\n" +
    "                            that you post on or\n" +
    "                            through the Service. Instead, You hereby grant Us a nonexclusive, irrevocable,\n" +
    "                            worldwide, perpetual, unlimited, assignable, sub-licensable, fully paid up and\n" +
    "                            royalty-free license to use, copy, reproduce, prepare derivative works of, improve,\n" +
    "                            distribute, publish, remove, retain, add, process, analyze, commercialize, display,\n" +
    "                            make available, broadcast and publicly perform, in any way now known or in the future\n" +
    "                            discovered, any User Content (as defined in Section ‎‎3.8 above) you provide, directly\n" +
    "                            or indirectly to Us in connection with the provision of the Service and as otherwise\n" +
    "                            appearing on the Service, including, but not limited to, any user generated content,\n" +
    "                            ideas, concepts, techniques or data, you submit to Us, without any further consent,\n" +
    "                            notice and/or compensation to you or to any third parties, subject to the provisions\n" +
    "                            of these Terms and the Privacy Policy, including, without limitation, for promoting\n" +
    "                            and redistributing part or all of the Service (and derivative works thereof) in any\n" +
    "                            media formats and through any media channels.\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "\n" +
    "                            6.2 We reserve the right, in Our sole discretion, to\n" +
    "                            change these Terms\n" +
    "                            (\"<span class=\"bold\">Updated Terms</span>\") from time to time, without any advance notice before the Updated\n" +
    "                            Terms come into effect. You agree that we may notify you of the Updated Terms by\n" +
    "                            posting them on the Service, and your continued use of the Service after the effective\n" +
    "                            date of the Updated Terms constitutes your agreement to all terms and conditions of\n" +
    "                            the Updated Terms. We recommend that you review any Updated Terms before using the\n" +
    "                            Service. The Updated Terms will be effective as of the time of posting, or on such\n" +
    "                            later time as may be specified in the Updated Terms, and shall apply to your use of\n" +
    "                            the Service from that point onward.\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            6.3 We reserve the right to modify or terminate the\n" +
    "                            Service or your access\n" +
    "                            to the Service for any reason, without notice, at any time, and without any\n" +
    "                            liability to you, including forfeiture of any username for any reason. You can\n" +
    "                            deactivate your account by logging into the Service and completing the form\n" +
    "                            available here: www.zinkerz.com/deactivateaccount; or in case of the App to\n" +
    "                            follow the instructions appearing in it. If we terminate your access to the\n" +
    "                            Service, your User Content and all other data will no longer be accessible\n" +
    "                            through your account; however, those materials and data may still appear\n" +
    "                            within search engines results and may be included in analysis conducted by\n" +
    "                            Zinkerz to improve the Service and future offerings.\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                           6.4 Upon termination, all licenses and other rights\n" +
    "                            granted to you by Us in\n" +
    "                            these Terms will cease immediately. We may refund, but are not obligated in any\n" +
    "                            way, the unused portion of any money paid for a Charged Service. Users who violate\n" +
    "                            any of the provisions of these Terms shall be subject to having their account revoked\n" +
    "                            and/or be excluded from the Service and shall not be entitled to any refund whatsoever.\n" +
    "                            It is clarified that the termination shall not affect the rights of Zinkerz with\n" +
    "                            respect to the license granted by you to Us in your User Content as set forth in\n" +
    "                            Section ‎7.1 above, and such license shall be unlimited, with respect to duration,\n" +
    "                            scope, contents or otherwise.\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            6.5 We reserve the right to refuse access to the\n" +
    "                            Service to anyone for\n" +
    "                            any reason at any time, and you hereby waive and shall be prevented from\n" +
    "                            raising any claim and/or demand from Us in this respect.\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            6.6 We may, but have no obligation to, remove, edit,\n" +
    "                            block, and/or monitor\n" +
    "                            User Content or accounts containing User Content that we determine, in our sole\n" +
    "                            discretion, violates any provisions of these Terms.\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            6.7 You are solely responsible for your interaction\n" +
    "                             with other Users of the\n" +
    "                            Service, whether online or offline. We do not guarantee the integrity or honesty\n" +
    "                            of any User. You agree that We are not responsible or liable for the conduct of\n" +
    "                            any User. We reserve the right, but have no obligation, to monitor or become\n" +
    "                            involved in disputes between you and other Users. We recommend that you exercise\n" +
    "                            common sense and your best judgment when interacting with others, including when\n" +
    "                            you submit or post User Content or any personal or other information.\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            6.8 There may be links from the Service, or from\n" +
    "                             communications you receive from the\n" +
    "                            Service, to third-party websites or features. There may also be links to third-party\n" +
    "                            websites or features in commercials, images, or comments within the Service. The\n" +
    "                            Service also may include third-party content that we do not control, maintain or\n" +
    "                            endorse. Functionality on the Service may also permit interactions between the\n" +
    "                            Service and a third-party website or feature, including applications that connect\n" +
    "                            the Service or your profile on the Service with a third-party website or feature.\n" +
    "                            Using this functionality may require that you log in to your account on the\n" +
    "                            third-party service and you do so at your own risk. We do not control any of\n" +
    "                            these third-party web based services or any of their content. You expressly\n" +
    "                            acknowledge and agree that We are in no way responsible or liable for any such\n" +
    "                            third-party services or features. Your correspondence and transactions with third\n" +
    "                            parties found through the service are solely between you and such third party.\n" +
    "                            We shall also not be responsible for, and disclaim any liability regarding the terms\n" +
    "                            of use or privacy policies of those third-party websites or to the user identification\n" +
    "                            means they use.\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            6.9 We may display advertisements and promotions as part\n" +
    "                             of the Service, and you hereby agree\n" +
    "                            that We may place such advertising and promotions on the Service or on, about, or in\n" +
    "                            conjunction with your User Content. The manner, mode, extent and changes of such advertising\n" +
    "                            and promotions are subject to Our sole consideration.\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            6.10 You acknowledge that We may not identify paid\n" +
    "                             services, sponsored\n" +
    "                            content and/or commercial communications as such.\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                           6.11 You represent and warrant that: (i) you own the\n" +
    "                             User Content posted by you on or\n" +
    "                            through the Service or otherwise have the right to grant the rights and licenses set forth\n" +
    "                            in these Terms; (ii) the posting and use of your User Content on or through the Service\n" +
    "                            does not violate, misappropriate, or infringe the rights of any third party, including,\n" +
    "                            without limitation, privacy rights, publicity rights, copyrights, trademark, and/or other\n" +
    "                            intellectual property rights; (iii) you agree to pay for all royalties, fees, and any other\n" +
    "                            monies owed by you with respect to User Content you post on or through the Service; and (iv)\n" +
    "                            you have the legal right and capacity to enter into these Terms in your jurisdiction, and\n" +
    "                            if an entity (Company, partnership or other), in the jurisdiction in which the entity is\n" +
    "                            incorporated and/or operating.\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            6.12 You acknowledge that with respect to all your\n" +
    "                             communications with Us regarding\n" +
    "                            the Service, including but not limited to feedback, questions, comments, suggestions\n" +
    "                            and the like: (i) you shall have no right of confidentiality in such communications\n" +
    "                            and we shall have no obligation to protect your communications from disclosure to\n" +
    "                            third parties; (ii) we shall be free to reproduce, use, disclose and distribute your\n" +
    "                            communications to others without limitation; and (iii) we shall be free to use any\n" +
    "                            ideas, concepts, know-how, content or techniques contained in your communications for\n" +
    "                            any purpose whatsoever, including but not limited to the development, production and\n" +
    "                            marketing of products and services that incorporate such information. The above is\n" +
    "                            limited only by our commitment and obligations pertaining to your personal information,\n" +
    "                            as further specified under our Privacy Policy\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            6.13 The Service contains content solely and\n" +
    "                             exclusively owned by, or\n" +
    "                            licensed to, Zinkerz (\"<span class=\"bold\">Zinkerz Content</span>\"). Zinkerz Content is protected by\n" +
    "                            copyright, trademark, patent, trade secret, and other intellectual property\n" +
    "                            rights, and Zinkerz owns and retains all rights and title in and to the\n" +
    "                            Zinkerz Content and the Service. You may not remove, alter, or conceal any\n" +
    "                            copyright, trademark, service mark or other proprietary rights incorporated\n" +
    "                            in or accompanying the Zinkerz Content and you may not reproduce, modify,\n" +
    "                            reverse engineer, adapt, prepare derivative works based on, perform, display,\n" +
    "                            publish, distribute, transmit, broadcast, sell, license or otherwise exploit\n" +
    "                            the Zinkerz Content.\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                           6.14 The Zinkerz name and logo are copyrighted\n" +
    "                             to Zinkerz and may not be copied,\n" +
    "                            imitated, or used, in whole or in part, without the prior written permission of Zinkerz.\n" +
    "                            In addition, all page headers, custom graphics, and button icons are service marks,\n" +
    "                            trademarks and/or trade dress of Zinkerz, and may not be copied, imitated, or used, in\n" +
    "                            whole or in part, without prior written permission from Zinkerz.\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            6.15 You agree that you shall not perform, either\n" +
    "                             directly or indirectly, any act or\n" +
    "                            omission which may in any way jeopardize or adversely affect the validity or enforceability\n" +
    "                            of or otherwise infringe or misappropriate any of Our rights, titles, and interests in and\n" +
    "                            to the Website, the App, the Service, Zinkerz Content, its software, the Information,\n" +
    "                            including but not limited to, its components and methods, all information provided by the\n" +
    "                            Service, or any intellectual property and any property and proprietary rights related thereto\n" +
    "                            (jointly \"<span class=\"bold\">Zinkerz Rights</span>\"). You further agree that you will not oppose or contest any\n" +
    "                            application by Us and/or by any of Our affiliates in connection with the Zinkerz Rights,\n" +
    "                            in any jurisdiction or under any law and/or treaty, and shall assist Us or any of our\n" +
    "                            affiliates in any such process, including by way of execution of any required document or\n" +
    "                            instrument.\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                          6.16 Zinkerz Content may contain technical\n" +
    "                            inaccuracies and typographical errors,\n" +
    "                            including but not limited to inaccuracies relating to pricing or availability applicable\n" +
    "                            to the Service. Without derogating from the provisions of the disclaimer and limitation\n" +
    "                            of liability below, Zinkerz shall not assume responsibility or liability for any such\n" +
    "                            inaccuracies, errors, or omissions, and shall have no obligation to provide the Service\n" +
    "                            or to refer to information affected by such inaccuracies. Zinkerz reserves the right to\n" +
    "                            make changes, corrections, cancellations, and/or improvements to the Zinkerz Content, and\n" +
    "                            to the Services described in such information, at any time without notice, including\n" +
    "                            after confirmation of a certain transaction.\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            6.17 Access to some pages and/or parts of the Service\n" +
    "                             may be restricted to authorized parties.\n" +
    "                            The information and content contained in such restricted pages and/or parts is confidential,\n" +
    "                            shall be deemed an inseparable part of the Zinkerz Content, and is provided for business use\n" +
    "                            only. We reserve the right to prohibit access to, or use of, these restricted pages and/or\n" +
    "                            parts where We determine that such use or access interferes with the Service`s operations or\n" +
    "                            that such use or access results in commercial benefits to third parties to our detriment.\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                           6.18 It is Our intention to keep the Service available\n" +
    "                            at all times. However, there may\n" +
    "                            be occasions when the Service may be interrupted, including, without limitation, for purpose\n" +
    "                            of performing scheduled maintenance or upgrades, for emergency repairs, or due to failure of\n" +
    "                            the Internet, servers, communication links, and/or equipment.\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                           6.19 Zinkerz reserves the right to remove any\n" +
    "                            User Content from the Service for\n" +
    "                            any reason, without prior notice. User Content removed from the Service may\n" +
    "                            continue to be stored by Zinkerz, including, without limitation, in order to\n" +
    "                            comply with certain legal obligations, but may not be retrievable without a valid\n" +
    "                            court order. Consequently, Zinkerz encourages you to maintain your own backup of\n" +
    "                            your User Content. In other words, Zinkerz is not a backup service and you agree\n" +
    "                            that you will not rely on the Service for the purposes of User Content backup or\n" +
    "                            storage. Zinkerz will not be liable to you for any modification, suspension and/or\n" +
    "                            discontinuation of the Services, or the loss of any User Content. You also\n" +
    "                            acknowledge that the Internet may be subject to breaches of security and that the\n" +
    "                            submission of User Content or other information may not be secure, and when\n" +
    "                            submitting User Content you do so at your own risk and sole responsibility.\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            6.20 You agree that Zinkerz is not responsible\n" +
    "                            for and does not endorse User\n" +
    "                            Content posted within the Service. Zinkerz does not have any obligation to prescreen,\n" +
    "                            monitor, edit, or remove any User Content.\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            6.21 We do not guarantee the quality, accuracy,\n" +
    "                            or reliability of any information\n" +
    "                            provided under the Service, including the Information. If you choose to use the information\n" +
    "                            provided under the Service, including the Information, you do so at your own risk and\n" +
    "                            sole responsibility and We shall bear no responsibility in any such respect.\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            6.22 Except as otherwise described in the Service's\n" +
    "                            Privacy Policy, any User\n" +
    "                            Content will be non-confidential and non-proprietary, and We will not be liable\n" +
    "                            for any use or disclosure of User Content. You acknowledge and agree that your\n" +
    "                            relationship with Us is not a confidential, fiduciary, or other type of special\n" +
    "                            relationship, and that your decision to submit any User Content does not place\n" +
    "                            Us in a position that is any different from the position held by members of the\n" +
    "                            general public, including with regard to your User Content. You acknowledge that\n" +
    "                            none of your User Content will be subject to any obligation of confidence on the\n" +
    "                            part of Zinkerz.\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            6.23 If you repeatedly infringe other people's\n" +
    "                            intellectual property\n" +
    "                            rights, we shall be entitled to disable your account and forbid future\n" +
    "                            access to the service.\n" +
    "\n" +
    "                        </li>\n" +
    "                    </ol>\n" +
    "                </li>\n" +
    "\n" +
    "\n" +
    "                <li><span class=\"title\">7. Disclaimer of Warranties</span>\n" +
    "                    <ol>\n" +
    "                        <li>\n" +
    "                            THE SERVICE, INCLUDING, WITHOUT LIMITATION, THE SERVICE AND Zinkerz CONTENT, IS PROVIDED\n" +
    "                            ON AN \"AS IS\", \"AS AVAILABLE\" AND \"WITH ALL FAULTS\" BASIS. TO THE FULLEST EXTENT\n" +
    "                            PERMISSIBLE BY LAW, NEITHER WE, NOR ANY PARENT, SUBSIDIARY OR CONTROLLED ENTITY,\n" +
    "                            OR ANY OF THEIR EMPLOYEES, SHAREHOLDERS, DIRECTORS, MANAGERS, OFFICERS, OR CONSULTANTS\n" +
    "                            (COLLECTIVELY, THE \"<span class=\"bold\">Zinkerz PARTIES</span>\") MAKE ANY REPRESENTATIONS OR WARRANTIES OR ENDORSEMENTS\n" +
    "                            OF ANY KIND WHATSOEVER, EXPRESS OR IMPLIED, AS TO: (A) THE SERVICE (INCLUDING THE WEBSITE\n" +
    "                            AND APP); (B) Zinkerz CONTENT; (C) USER CONTENT; OR (D) SECURITY ASSOCIATED WITH THE\n" +
    "                            TRANSMISSION OF INFORMATION TO US OR VIA THE SERVICE. IN ADDITION, Zinkerz PARTIES HEREBY\n" +
    "                            DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE WARRANTIES\n" +
    "                            OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, TITLE, CUSTOM, TRADE,\n" +
    "                             QUIET ENJOYMENT, SYSTEM INTEGRATION, AND FREEDOM FROM COMPUTER VIRUSES.\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            Zinkerz PARTIES DO NOT REPRESENT OR WARRANT THAT THE SERVICE WILL BE ERROR-FREE OR UNINTERRUPTED;\n" +
    "                            THAT DEFECTS WILL BE CORRECTED; OR THAT THE SERVICE OR THE SERVERS THAT MAKE THE SERVICE\n" +
    "                            AVAILABLE ARE FREE FROM ANY HARMFUL COMPONENTS, INCLUDING, WITHOUT LIMITATION, VIRUSES.\n" +
    "                            Zinkerz PARTIES DO NOT MAKE ANY REPRESENTATIONS OR WARRANTIES THAT THE INFORMATION\n" +
    "                            (INCLUDING ANY INSTRUCTIONS) ON THE SERVICE IS ACCURATE, COMPLETE, OR USEFUL. YOU ACKNOWLEDGE\n" +
    "                            THAT YOUR USE OF THE SERVICE IS AT YOUR SOLE RISK. Zinkerz PARTIES DO NOT WARRANT THAT YOUR\n" +
    "                            USE OF THE SERVICE IS LAWFUL IN ANY PARTICULAR JURISDICTION, AND SPECIFICALLY DISCLAIM SUCH\n" +
    "                            WARRANTIES. SOME JURISDICTIONS LIMIT OR DO NOT ALLOW THE DISCLAIMER OF IMPLIED OR OTHER\n" +
    "                            WARRANTIES. IN SUCH JURISDICTION THE ABOVE DISCLAIMER MAY NOT APPLY TO YOU TO THE EXTENT\n" +
    "                            SUCH JURISDICTION'S LAW IS APPLICABLE TO YOU AND TO THESE TERMS.\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            BY ACCESSING OR USING THE SERVICE YOU REPRESENT AND WARRANT THAT YOUR ACTIVITIES ARE LAWFUL\n" +
    "                            IN EVERY JURISDICTION WHERE YOU ACCESS OR USE THE SERVICE\n" +
    "                        </li>\n" +
    "                    </ol>\n" +
    "                </li>\n" +
    "\n" +
    "                <li><span class=\"title\">8. Limitatiin of Liabilty; Waiver</span><br/>\n" +
    "                    <ol>\n" +
    "                        <li>\n" +
    "                            UNDER NO CIRCUMSTANCES WILL Zinkerz PARTIES BE LIABLE TO YOU FOR ANY LOSS OR\n" +
    "                            DAMAGES OF ANY KIND (INCLUDING, WITHOUT LIMITATION, FOR ANY DIRECT, INDIRECT,\n" +
    "                            ECONOMIC, EXEMPLARY, SPECIAL, PUNITIVE, INCIDENTAL OR CONSEQUENTIAL LOSSES OR\n" +
    "                            DAMAGES) THAT ARE DIRECTLY OR INDIRECTLY RELATED TO: (A) THE SERVICE; (B)\n" +
    "                            Zinkerz CONTENT; (C) USER CONTENT; (D) YOUR USE OF, INABILITY TO USE, OR THE\n" +
    "                            PERFORMANCE OF THE SERVICE; (E) ANY ACTION TAKEN IN CONNECTION WITH AN\n" +
    "                            INVESTIGATION BY US OR BY LAW ENFORCEMENT AUTHORITIES REGARDING YOUR OR ANY\n" +
    "                            OTHER PARTY'S USE OF THE SERVICE; (F) ANY ACTION TAKEN IN CONNECTION WITH\n" +
    "                            COPYRIGHT OR OTHER INTELLECTUAL PROPERTY OWNERS; (G) ANY ERRORS OR OMISSIONS\n" +
    "                            IN THE SERVICE'S OPERATION; OR (H) ANY DAMAGE TO ANY USER'S COMPUTER, MOBILE\n" +
    "                            DEVICE, OR OTHER EQUIPMENT OR TECHNOLOGY INCLUDING, WITHOUT LIMITATION, DAMAGE\n" +
    "                            FROM ANY SECURITY BREACH OR FROM ANY VIRUS, BUGS, TAMPERING, FRAUD, ERROR,\n" +
    "                            OMISSION, INTERRUPTION, DEFECT, DELAY IN OPERATION OR TRANSMISSION, COMPUTER LINE\n" +
    "                            OR NETWORK FAILURE, OR ANY OTHER TECHNICAL OR OTHER MALFUNCTION, INCLUDING,\n" +
    "                            WITHOUT LIMITATION, DAMAGES FOR LOST PROFITS OR CONTRACTS, LOSS OF ANTICIPATED\n" +
    "                            SAVINGS, LOSS OF GOODWILL, LOSS OF DATA, WORK STOPPAGE, WASTED TIME, ACCURACY\n" +
    "                            OF RESULTS, OR COMPUTER FAILURE OR MALFUNCTION, EVEN IF FORESEEABLE OR EVEN IF\n" +
    "                            THE Zinkerz PARTIES HAVE BEEN ADVISED OF OR SHOULD HAVE KNOWN OF THE POSSIBILITY\n" +
    "                            OF SUCH DAMAGES, WHETHER IN CONTRACT, NEGLIGENCE, STRICT LIABILITY OR TORT\n" +
    "                            (INCLUDING, WITHOUT LIMITATION, WHETHER CAUSED IN WHOLE OR IN PART BY NEGLIGENCE,\n" +
    "                            ACTS OF GOD, TELECOMMUNICATIONS FAILURE, OR THEFT OR TOTAL LOSS OF THE SERVICE).\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            IN NO EVENT WILL THE Zinkerz PARTIES BE LIABLE TO YOU OR ANYONE ELSE FOR LOSS,\n" +
    "                            DAMAGE, OR INJURY, INCLUDING, WITHOUT LIMITATION, DEATH OR PERSONAL INJURY, UNLESS AS\n" +
    "                            SET FORTH IN THE LAST PARAGRAPH BELOW. CERTAIN JURISDICTIONS DO NOT ALLOW THE EXCLUSION\n" +
    "                            OR LIMITATION OF INCIDENTAL OR CONSEQUENTIAL DAMAGES, AND IN SUCH JURISDICTIONS THE ABOVE\n" +
    "                            LIMITATION OR EXCLUSION MAY NOT APPLY TO YOU. IN NO EVENT WILL Zinkerz PARTIES` TOTAL\n" +
    "                            LIABILITY TO YOU FOR ALL DAMAGES, LOSSES OR CLAIMS EXCEED ONE HUNDRED UNITED STATES\n" +
    "                            DOLLARS (US$100.00).\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            YOU AGREE THAT IN THE EVENT THAT YOU INCUR ANY DAMAGES, LOSSES, OR INJURIES THAT ARISE OUT\n" +
    "                            OF OUR ACTS OR OMISSIONS, THE DAMAGES, IF ANY, CAUSED TO YOU ARE NOT SUFFICIENT TO ENTITLE\n" +
    "                            YOU TO AN INJUNCTION PREVENTING ANY EXPLOITATION OF ANY WEBSITE, SERVICE, PROPERTY,\n" +
    "                            PRODUCT OR OTHER CONTENT OWNED OR CONTROLLED BY THE Zinkerz PARTIES, AND YOU WILL HAVE NO\n" +
    "                            RIGHTS TO ENJOIN OR RESTRAIN THE DEVELOPMENT, PRODUCTION, DISTRIBUTION, ADVERTISING,\n" +
    "                            EXHIBITION, OR EXPLOITATION OF ANY WEBSITE, PROPERTY, PRODUCT, SERVICE, OR OTHER CONTENT\n" +
    "                            OWNED OR CONTROLLED BY THE Zinkerz PARTIES.\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            BY ACCESSING THE SERVICE, YOU UNDERSTAND THAT YOU MAY BE WAIVING RIGHTS WITH RESPECT TO\n" +
    "                            CLAIMS THAT ARE AT THIS TIME UNKNOWN OR UNSUSPECTED.\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            Zinkerz PARTIES ARE NOT RESPONSIBLE FOR THE ACTIONS, CONTENT, INFORMATION, OR DATA OF THIRD\n" +
    "                            PARTIES, AND YOU RELEASE Zinkerz PARTIES, FROM ANY CLAIMS AND DAMAGES, KNOWN AND UNKNOWN, ARISING OUT OF OR IN ANY WAY CONNECTED WITH ANY CLAIM YOU HAVE AGAINST ANY SUCH PARTIES.\n" +
    "                        </li>\n" +
    "                    </ol>\n" +
    "                </li>\n" +
    "                <li><span class=\"title\">9. Indemnification</span><br/>\n" +
    "                    You and anyone acting in your name and on your behalf agree to defend (at Our request),\n" +
    "                    indemnify, and hold the Zinkerz Parties harmless from and against any claims, liabilities,\n" +
    "                    damages, losses, and expenses, including without limitation, reasonable attorney's fees\n" +
    "                    and costs, arising out of or in any way connected with any of the following (including as\n" +
    "                    a result of your direct activities on the Service or those conducted on your behalf): (i)\n" +
    "                    your User Content or your access to or use of the Service; (ii) your breach or alleged\n" +
    "                    breach of these Terms; (iii) your violation of any third-party right, including without\n" +
    "                    limitation, any intellectual property right, publicity, confidentiality, property or privacy\n" +
    "                    right; (iv) your violation of any laws, rules, regulations, codes, statutes, ordinances or\n" +
    "                    orders of any governmental and quasi-governmental authorities, including, without limitation,\n" +
    "                    all regulatory, administrative and legislative authorities; or (v) any misrepresentation made\n" +
    "                    by you. You will cooperate as fully required by the Zinkerz Parties in the defense of any\n" +
    "                    claim. Zinkerz Parties reserve the right to assume the exclusive defense and control of any\n" +
    "                    matter subject to indemnification by you, and you will not in any event settle any claim\n" +
    "                    without the prior written consent of the Zinkerz Parties.\n" +
    "                </li>\n" +
    "\n" +
    "                <li><span class=\"title\">10. Order of Precedence</span><br/>\n" +
    "                    In the event of a contradiction or discrepancy between the provisions of these Terms and any\n" +
    "                    the provisions of the Privacy Policy, the provision most beneficial with Zinkerz shall\n" +
    "                    prevail and supersede in all respects, and you hereby waive and shall be prevented from\n" +
    "                    raising any claim and/or demand from Us in this respect.\n" +
    "                </li>\n" +
    "                <li><span class=\"title\">11. Statute of Limitations Agreement</span><br/>\n" +
    "                    You agree that any claim you may have arising out of or related to your relationship\n" +
    "                    with Zinkerz must be filed within one (1) year after such claim arose. Any claim filed\n" +
    "                    with Us after such one (1) year period shall be permanently void. Provisions of this\n" +
    "                    Section shall be deemed an agreement with respect to section 19 of the Israeli Statute\n" +
    "                    of Limitations Law, 5718-1958.\n" +
    "                </li>\n" +
    "\n" +
    "                <li><span class=\"title\">12. Governing Law; Jurisdiction</span><br/>\n" +
    "                    These Terms shall be governed by and construed in accordance with the laws of\n" +
    "                    the State of Israel, without giving effect to any principles of conflicts of laws.\n" +
    "                    The competent courts located in Tel-Aviv, Israel, shall have sole and exclusive\n" +
    "                    jurisdiction with respect to any dispute arising from the performance or interpretation\n" +
    "                    of these Terms. You will not object to jurisdiction or venue on the grounds of lack of\n" +
    "                    personal jurisdiction, inconvenient forum or otherwise. You agree that you will not\n" +
    "                    file or participate in a class action against Us. You acknowledge that these Terms\n" +
    "                    will specifically not be governed by the United Nations convention on contracts for\n" +
    "                    the international sale of goods, if otherwise applicable.\n" +
    "\n" +
    "                </li>\n" +
    "\n" +
    "                <li><span class=\"title\">13. Notices</span><br/>\n" +
    "                    Notices to you may be made via either e-mail or regular mail. The Service may also provide\n" +
    "                    notices of changes to the terms and conditions or other matters by displaying such notices\n" +
    "                    or links to revised terms and conditions on the Service. Notice to Us may be made by\n" +
    "                    registered mail to: Zinkerz Technologies Ltd., 13 David Saharov St., Rishon-Leziyon,\n" +
    "                    Israel, 7570715. Delivery by facsimile or electronic mail shall be sufficient and be\n" +
    "                    deemed to have occurred upon electronic confirmation or receipt.\n" +
    "                </li>\n" +
    "\n" +
    "                <li><span class=\"title\">14. Territorial Restrictions</span>\n" +
    "                    <ol>\n" +
    "                        <il>\n" +
    "                            The information provided within the Service is not intended for distribution to\n" +
    "                            or use by any person or entity in any jurisdiction or country where such distribution or\n" +
    "                            use would be contrary to law or regulation or which would subject Zinkerz to any\n" +
    "                            registration requirement within such jurisdiction or country. We reserve the right to\n" +
    "                            limit the availability of the Service or any portion of the Service, to any person,\n" +
    "                            geographic area, or jurisdiction, at any time and in our sole discretion, and to limit\n" +
    "                            the quantities of any content, program, product, service or other feature that We provide.\n" +
    "                        </il>\n" +
    "                    </ol>\n" +
    "                </li>\n" +
    "\n" +
    "            </ol>\n" +
    "        </div>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("znk/system/shared/templates/baseVideoTourHintModal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/system/shared/templates/baseVideoTourHintModal.html",
    "<div class=\"video-wrapper\">\n" +
    "    <video autoplay\n" +
    "           webkit-playsinline\n" +
    "           preload=\"auto\"\n" +
    "           video-ctrl-drv\n" +
    "           video-height=\"fit\"\n" +
    "           custom-poster=\"assets/videos/home-tour-poster.png\"\n" +
    "           poster=\"assets/videos/home-tour-poster.png\"\n" +
    "           on-ended=\"baseVideoTourCtrl.videoEndedHandler()\"\n" +
    "           height-to-width-ratio=\"baseVideoTourCtrl.isMobile ? 1.7777778 : 1.333333333\"\n" +
    "           actions=\"baseVideoTourCtrl.videoActions\">\n" +
    "        <source ng-src=\"{{baseVideoTourCtrl.isMobile ? baseVideoTourCtrl.config.videoSrc.mobileUrl : baseVideoTourCtrl.config.videoSrc.tabletUrl}}\"\n" +
    "                type=\"video/mp4\">\n" +
    "    </video>\n" +
    "</div>\n" +
    "<div class=\"button-row ng-hide\"\n" +
    "     ng-show=\"baseVideoTourCtrl.showControlls\"\n" +
    "     ng-style=\"{'background-image': baseVideoTourCtrl.isMobile ? baseVideoTourCtrl.config.videoEndedBg.mobileUrl : baseVideoTourCtrl.config.videoEndedBg.tabletUrl}\">\n" +
    "    <button class=\"btn\"\n" +
    "            analytics-on=\"click\"\n" +
    "            ng-click=\"close()\">{{::baseVideoTourCtrl.config.closeModalBtnTitle || 'GET STARTED'}}\n" +
    "    </button>\n" +
    "    <button class=\"btn clear-btn\"\n" +
    "            analytics-on=\"click\"\n" +
    "            ng-click=\"baseVideoTourCtrl.showControlls=false;baseVideoTourCtrl.videoActions.replay();\">REPLAY\n" +
    "    </button>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("znk/system/shared/templates/estimatedScoreDrv.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/system/shared/templates/estimatedScoreDrv.html",
    "<div ng-class=\"{'show-mini' : viewSize == viewSizes.mini}\">\n" +
    "    <section ng-if=\"estimatedScore.total\">\n" +
    "        <div class=\"title-row\">\n" +
    "            <div class=\"title\"> SAT score estimate</div>\n" +
    "        </div>\n" +
    "        <div class=\"score-row only-tablet\">\n" +
    "            <div class=\"rang\">Total: <span>{{estimatedScore.total.min | number : 0}} - {{estimatedScore.total.max | number : 0}}</span></div>\n" +
    "            <div class=\"bonus-score\" ng-class=\"::{ 'green-text': totalScore.isPositive, 'red-text': !totalScore.isPositive }\" ng-if=\"totalScore.show\">\n" +
    "                {{::(totalScore.isPositive) ? '+'+totalScore.score : totalScore.score | number : 0}}\n" +
    "                <div class=\"tiny-title\">since diagnostic</div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"gauge-row\">\n" +
    "            <div on-tap=\"onGaugeClick()(subjectEnum.math.enum)\"\n" +
    "                 class=\"gauge-wrap\"\n" +
    "                 analytics-on=\"click\"\n" +
    "                 analytics-event=\"click-estimated-banner\"\n" +
    "                 analytics-category=\"banner\"\n" +
    "                 analytics-label=\"math\">\n" +
    "                <div class=\"gauge-score\">\n" +
    "                    <div>{{estimatedScore[subjectEnum.math.enum].min | number : 0}}-{{estimatedScore[subjectEnum.math.enum].max | number : 0}}</div>\n" +
    "                     <div class=\"subject-perfect\" ng-if=\"subjectsDelta[subjectEnum.math.enum] > 0\">\n" +
    "                         <span ng-if=\"subjectsDelta[subjectEnum.math.enum] > 0\">+</span>\n" +
    "                         {{subjectsDelta[subjectEnum.math.enum]}}\n" +
    "                     </div>\n" +
    "                </div>\n" +
    "                <div round-progress\n" +
    "                     max=100\n" +
    "                     current=subjectProgress.math\n" +
    "                     color=\"#75cbe8\"\n" +
    "                     bgcolor=\"#eaeaea\"\n" +
    "                     radius={{gauge.radius}}\n" +
    "                     stroke={{gauge.stroke}}\n" +
    "                     semi=\"false\"\n" +
    "                     rounded=\"false\"\n" +
    "                     iterations=\"1\"></div>\n" +
    "                <div class=\"subject-name only-tablet\">MATHEMATICS</div>\n" +
    "                <div class=\"subject-name only-mobile\">M</div>\n" +
    "            </div>\n" +
    "            <div on-tap=\"onGaugeClick()(subjectEnum.reading.enum)\"\n" +
    "                 class=\"gauge-wrap\"\n" +
    "                 analytics-on=\"click\"\n" +
    "                 analytics-event=\"click-estimated-banner\"\n" +
    "                 analytics-category=\"banner\"\n" +
    "                 analytics-label=\"reading\">\n" +
    "                <div class=\"gauge-score\">\n" +
    "                    <div>{{estimatedScore[subjectEnum.reading.enum].min | number : 0}}-{{estimatedScore[subjectEnum.reading.enum].max | number : 0}}</div>\n" +
    "                    <div class=\"subject-perfect\" ng-if=\"subjectsDelta[subjectEnum.reading.enum] > 0\">\n" +
    "                        <span ng-if=\"subjectsDelta[subjectEnum.reading.enum] > 0\">+</span>\n" +
    "                        {{subjectsDelta[subjectEnum.reading.enum]}}\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div round-progress\n" +
    "                     max=100\n" +
    "                     current=subjectProgress.read\n" +
    "                     color=\"#f9d41b\"\n" +
    "                     bgcolor=\"#eaeaea\"\n" +
    "                     radius={{gauge.radius}}\n" +
    "                     stroke={{gauge.stroke}}\n" +
    "                     semi=\"false\"\n" +
    "                     rounded=\"false\"\n" +
    "                     iterations=\"1\"></div>\n" +
    "                <div class=\"subject-name only-tablet\">READING</div>\n" +
    "                <div class=\"subject-name only-mobile\">R</div>\n" +
    "            </div>\n" +
    "            <div on-tap=\"onGaugeClick()(subjectEnum.writing.enum)\"\n" +
    "                 class=\"gauge-wrap\"\n" +
    "                 analytics-on=\"click\"\n" +
    "                 analytics-event=\"click-estimated-banner\"\n" +
    "                 analytics-category=\"banner\"\n" +
    "                 analytics-label=\"writing\">\n" +
    "                <div class=\"gauge-score\">\n" +
    "                    <div>{{estimatedScore[subjectEnum.writing.enum].min | number : 0}}-{{estimatedScore[subjectEnum.writing.enum].max | number : 0}}</div>\n" +
    "                    <div class=\"subject-perfect\" ng-if=\"subjectsDelta[subjectEnum.writing.enum] > 0\">\n" +
    "                        <span ng-if=\"subjectsDelta[subjectEnum.writing.enum] > 0\">+</span>\n" +
    "                        {{subjectsDelta[subjectEnum.writing.enum]}}\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div round-progress\n" +
    "                     max=100\n" +
    "                     current=subjectProgress.write\n" +
    "                     color=\"#ff5895\"\n" +
    "                     bgcolor=\"#eaeaea\"\n" +
    "                     radius={{gauge.radius}}\n" +
    "                     stroke={{gauge.stroke}}\n" +
    "                     semi=\"false\"\n" +
    "                     rounded=\"false\"\n" +
    "                     iterations=\"1\"></div>\n" +
    "                <div class=\"subject-name only-tablet\">WRITING</div>\n" +
    "                <div class=\"subject-name only-mobile\">W</div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </section>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("znk/system/shared/templates/facebookShareBtn.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/system/shared/templates/facebookShareBtn.html",
    "<div class=\"facebookShareBtn\" ng-if=\"showIcon\" ng-click=\"openFacebookDialog()\" ng-transclude></div>\n" +
    "");
}]);

angular.module("znk/system/shared/templates/gamificationProgressDrv.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/system/shared/templates/gamificationProgressDrv.html",
    "<div class=\"title-row\">\n" +
    "    <div class=\"title\">{{gameObj.level.name}}</div>\n" +
    "</div>\n" +
    "<div class=\"game-wrap\">\n" +
    "    <div class=\"avatar-wrap\" ng-switch on=\"gameObj.level.name\">\n" +
    "        <div class=\"avatar-newbie\" ng-switch-when=\"Newbie\"></div>\n" +
    "        <div class=\"avatar-wizKid\" ng-switch-when=\"Wiz Kid\"></div>\n" +
    "        <div class=\"avatar-testRocker\" ng-switch-when=\"Test Rocker\"></div>\n" +
    "        <div class=\"avatar-superScholar\" ng-switch-when=\"Super Scholar\"></div>\n" +
    "        <div class=\"avatar-mastermind\" ng-switch-when=\"Mastermind\"></div>\n" +
    "        <div class=\"avatar-grandZink\" ng-switch-when=\"Grand Zinkerz\"></div>\n" +
    "    </div>\n" +
    "    <div class=\"user-points\">\n" +
    "        <i class=\"blue-star-icon\"></i>\n" +
    "        <div class=\"xp-points\">{{gameObj.exp.total}} XP</div>\n" +
    "    </div>\n" +
    "    <div class=\"progress-row\">\n" +
    "        <div znk-progress-drv\n" +
    "             progress-width=\"{{progressWidth}}\"\n" +
    "             progress-value=\"{{10}}\"\n" +
    "             show-progress-value=\"{{showProgress}}\"></div>\n" +
    "    </div>\n" +
    "    <div class=\"xp-row\">\n" +
    "        You are <span class=\"xp-bold\">{{nextLevelPoints}} XP </span>\n" +
    "        away from <span class=\"xp-bold\">{{nextLevelName}}</span>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("znk/system/shared/templates/iapModal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/system/shared/templates/iapModal.html",
    "<div class=\"header-circle-icon-center\">\n" +
    "    <div class=\"icon-wrapper\">\n" +
    "        <i class=\"raccoon-white-icon\"></i>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"content\">\n" +
    "    <div class=\"title\">ZinkerzSAT&reg; test prep\n" +
    "        <div class=\"pro-sign\"></div>\n" +
    "    </div>\n" +
    "    <div class=\"sub-title\">Unlock all content and features.</div>\n" +
    "    <div class=\"descriptions-wrapper\">\n" +
    "        <ion-scroll scrollbar-y=\"true\">\n" +
    "            <div class=\"item-wrapper\">\n" +
    "                <div class=\"item-description\">\n" +
    "                    <div class=\"row-title\">\n" +
    "                        <div class=\"icon-wrapper\">\n" +
    "                            <i class=\"iap-pencil-white-icon only-tablet\"></i>\n" +
    "                            <i class=\"purchase-workouts-mobile only-mobile\"></i>\n" +
    "                        </div>\n" +
    "                        Personalized Workouts\n" +
    "                    </div>\n" +
    "                    <div class=\"description\">Individual adaptive scheduled roadmap,\n" +
    "                        automatically personalized to your specific needs.\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"item-wrapper\">\n" +
    "                <div class=\"item-description\">\n" +
    "                    <div class=\"row-title\">\n" +
    "                        <div class=\"icon-wrapper\">\n" +
    "                            <i class=\"document-white-icon only-tablet\"></i>\n" +
    "                            <i class=\"purchase-test-simulations-mobile only-mobile\"></i>\n" +
    "                        </div>\n" +
    "                        Full SAT Practice Tests\n" +
    "                    </div>\n" +
    "                    <div class=\"description\">We believe that the closer our practice exams are to the real thing, the\n" +
    "                        more valuable they are for you.\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"item-wrapper last-item\">\n" +
    "                <div class=\"item-description\">\n" +
    "                    <div class=\"row-title\">\n" +
    "                        <div class=\"icon-wrapper\">\n" +
    "                            <i class=\"purchase-estimate-score only-tablet\"></i>\n" +
    "                            <i class=\"purchase-estimate-score-mobile only-mobile\"></i>\n" +
    "                        </div>\n" +
    "                        Estimated Score\n" +
    "                    </div>\n" +
    "                    <div class=\"description\">Keep track of how you are doing as you progress.\n" +
    "                        The more you practice, the more accurate it becomes!\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </ion-scroll>\n" +
    "    </div>\n" +
    "    <div class=\"iap-section\">\n" +
    "        <div class=\"title\">\n" +
    "            Upgrade Now\n" +
    "        </div>\n" +
    "        <div class=\"loading-spinner\" ng-hide=\"products[0].price\"><ion-spinner></ion-spinner></div>\n" +
    "        <div class=\"btn-section\">\n" +
    "            <div class=\"btn-wrapper\"\n" +
    "                ng-repeat=\"product in products\"\n" +
    "                ng-click=\"purchase(product.id)\"\n" +
    "                analytics-on=\"click\"\n" +
    "                analytics-event=\"click-product\"\n" +
    "                analytics-category=\"purchase\"\n" +
    "                analytics-label=\"{{product.duration}}\">\n" +
    "                <button class=\"btn\">\n" +
    "                    <span class=\"duration\">{{product.duration}}</span>\n" +
    "                    <span class=\"price\">{{product.price}}</span>\n" +
    "                </button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("znk/system/shared/templates/materLevelModal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/system/shared/templates/materLevelModal.html",
    "<div class=\"level-wrap\">\n" +
    "    <div class=\"video-wrapper\">\n" +
    "        <master-level-video-drv level=\"level\"></master-level-video-drv>\n" +
    "    </div>\n" +
    "    <div class=\"text-wrap\">\n" +
    "        <div class=\"congratulations\">Congratulations!</div>\n" +
    "        <div class=\"title\">You have reached</div>\n" +
    "        <div class=\"level-title\">{{level.name}}</div>\n" +
    "    </div>\n" +
    "    <facebook-share-btn options=\"{link: d.facebookShare.link, description: d.facebookShare.description, picture: d.facebookShare.picture}\" >\n" +
    "        <i class=\"ion-social-facebook\"></i>\n" +
    "        Share on Facebook\n" +
    "    </facebook-share-btn>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("znk/system/shared/templates/selectDrv.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/system/shared/templates/selectDrv.html",
    "<div>\n" +
    "    <div ng-click=\"d.showDropDown = !d.showDropDown\">\n" +
    "        <i ng-class=\"d.showDropDown ? 'ion-chevron-up' : 'ion-chevron-down'\"></i>\n" +
    "        <div class=\"title\" ng-class=\"{'option-selected': d.ngModelCtrl.$viewValue}\">{{d.title}}</div>\n" +
    "    </div>\n" +
    "    <div class=\"drop-down-wrapper\" ng-if=\"d.showDropDown\">\n" +
    "        <div class=\"drop-down-container\">\n" +
    "            <ion-scroll class=\"drop-down\">\n" +
    "                <div ng-repeat=\"option in options\"\n" +
    "                     select-option-drv\n" +
    "                     option=\"option\">\n" +
    "                </div>\n" +
    "            </ion-scroll>\n" +
    "            <div class=\"cloud\"></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("znk/system/shared/templates/spinnerModal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/system/shared/templates/spinnerModal.html",
    "<div class=\"loading-spinner\">\n" +
    "    <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"120px\" height=\"120px\" viewBox=\"0 0 100 100\"\n" +
    "         preserveAspectRatio=\"xMidYMid\" class=\"uil-balls\">\n" +
    "        <rect x=\"0\" y=\"0\" width=\"100\" height=\"100\" fill=\"none\" class=\"bk\"/>\n" +
    "        <g transform=\"rotate(0 50 50)\">\n" +
    "            <circle r=\"5\" cx=\"30\" cy=\"50\" fill=\"#70c8e6\">\n" +
    "                <animateTransform attributeName=\"transform\" type=\"translate\" begin=\"0s\" repeatCount=\"indefinite\"\n" +
    "                                  dur=\"1s\" values=\"0 0;19.999999999999996 -20\" keyTimes=\"0;1\"/>\n" +
    "                <animate attributeName=\"fill\" dur=\"1s\" begin=\"0s\" repeatCount=\"indefinite\" keyTimes=\"0;1\"\n" +
    "                         values=\"#70c8e6;#f8d216\"/>\n" +
    "            </circle>\n" +
    "        </g>\n" +
    "        <g transform=\"rotate(90 50 50)\">\n" +
    "            <circle r=\"5\" cx=\"30\" cy=\"50\" fill=\"#f8d216\">\n" +
    "                <animateTransform attributeName=\"transform\" type=\"translate\" begin=\"0s\" repeatCount=\"indefinite\"\n" +
    "                                  dur=\"1s\" values=\"0 0;19.999999999999996 -20\" keyTimes=\"0;1\"/>\n" +
    "                <animate attributeName=\"fill\" dur=\"1s\" begin=\"0s\" repeatCount=\"indefinite\" keyTimes=\"0;1\"\n" +
    "                         values=\"#f8d216;#ff5794\"/>\n" +
    "            </circle>\n" +
    "        </g>\n" +
    "        <g transform=\"rotate(180 50 50)\">\n" +
    "            <circle r=\"5\" cx=\"30\" cy=\"50\" fill=\"#ff5794\">\n" +
    "                <animateTransform attributeName=\"transform\" type=\"translate\" begin=\"0s\" repeatCount=\"indefinite\"\n" +
    "                                  dur=\"1s\" values=\"0 0;19.999999999999996 -20\" keyTimes=\"0;1\"/>\n" +
    "                <animate attributeName=\"fill\" dur=\"1s\" begin=\"0s\" repeatCount=\"indefinite\" keyTimes=\"0;1\"\n" +
    "                         values=\"#ff5794;#ad87cf\"/>\n" +
    "            </circle>\n" +
    "        </g>\n" +
    "        <g transform=\"rotate(270 50 50)\">\n" +
    "            <circle r=\"5\" cx=\"30\" cy=\"50\" fill=\"#ad87cf\">\n" +
    "                <animateTransform attributeName=\"transform\" type=\"translate\" begin=\"0s\" repeatCount=\"indefinite\"\n" +
    "                                  dur=\"1s\" values=\"0 0;19.999999999999996 -20\" keyTimes=\"0;1\"/>\n" +
    "                <animate attributeName=\"fill\" dur=\"1s\" begin=\"0s\" repeatCount=\"indefinite\" keyTimes=\"0;1\"\n" +
    "                         values=\"#ad87cf;#70c8e6\"/>\n" +
    "            </circle>\n" +
    "        </g>\n" +
    "    </svg>\n" +
    "</div>\n" +
    "");
}]);

angular.module("znk/system/shared/templates/testSlideDrv.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/system/shared/templates/testSlideDrv.html",
    "<div class=\"title-row\">\n" +
    "    <div class=\"title\">My Tests</div>\n" +
    "</div>\n" +
    "<div class=\"test-row\">\n" +
    "    <div ng-repeat=\"exam in exams\" class=\"test-circle\" subscription-lock-drv calc-position on-calc=\"onCalcHandler(val)\" middle\n" +
    "         ng-class=\"{'completed-exam' : exam.isComplete, 'active-exam': exam.isActive, 'locked-exam' : !exam.isFree && !hasSubscription }\" ng-disabled=\"!exam.isFree && !hasSubscription\"\n" +
    "         ng-click=\"goToExam(exam)\"\n" +
    "         analytics-on=\"click\"\n" +
    "         analytics-event=\"click-test-banner\"\n" +
    "         analytics-category=\"banner\"\n" +
    "         analytics-label=\"{{exam.id}}\">\n" +
    "        <div class=\"green-checkmark-icon\"></div>\n" +
    "        <i class=\"ion-ios-locked\"></i>\n" +
    "        <div class=\"text-wrap\">\n" +
    "            <div class=\"test-name\"> SAT {{::($index + 1)}}</div>\n" +
    "            <div class=\"test-score\">Score: {{::exam.score}}</div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div ng-transclude></div>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("znk/system/shared/templates/transparentCircleDrv.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/system/shared/templates/transparentCircleDrv.html",
    "<div class=\"transparent-circle-drv-wrapper\">\n" +
    "\n" +
    "    <div  class=\"top-block bg-color\" ng-style=\"{height: d.topBlocHeight}\"></div>\n" +
    "\n" +
    "    <div class=\"circle-and-text-wrapper\" ng-style=\"{left: d.circleLeftPosition + 'px', top: d.circleTopPosition + 'px', width :circleRadius() + 'px',height: circleRadius() +'px'}\">\n" +
    "        <div  class=\"text\">{{text}}</div>\n" +
    "        <div class=\"circle-wrapper\" ng-style=\"{width :circleRadius() + 'px',height: circleRadius() +'px'}\">\n" +
    "            <div on-tap=\"circleClick()\" class=\"circle\" ng-style=\"{width :circleRadius() + 140 + 'px',height: circleRadius() + 140 +'px'}\"></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"left-block bg-color\" ng-style=\"{height: d.leftBlockHeight, width: d.leftBlockWidth}\"></div>\n" +
    "    <div class=\"right-block bg-color\" ng-style=\"{height: d.rightBlockHeight, width: d.rightBlockWidth}\"></div>\n" +
    "    <div class=\"bottom-block bg-color\"></div>\n" +
    "\n" +
    "</div>\n" +
    "");
}]);

angular.module("znk/system/shared/templates/transparentCircleHintModal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/system/shared/templates/transparentCircleHintModal.html",
    "<transparent-circle-drv\n" +
    "    circle-click=\"ctrl.focusedItemClickHandler()\"\n" +
    "    text=\"ctrl.text\"\n" +
    "    on-tap=\"close()\"\n" +
    "    position=\"ctrl.focusedItemPos\"\n" +
    "    circle-radius=\"ctrl.radius\">\n" +
    "</transparent-circle-drv>\n" +
    "\n" +
    "<div class=\"ion-ios-arrow-thin-down\"\n" +
    "     ng-style=\"{left:ctrl.arrowLeftPosition + 'px', top:ctrl.arrowTopPosition + 'px'}\">\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("znk/system/shared/templates/transparentCircleModal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/system/shared/templates/transparentCircleModal.html",
    "<div class=\"transparent-circle-modal-wrapper\" ng-class=\"::ctrl.positionClass\">\n" +
    "    <transparent-circle-drv on-tap=\"ctrl.pngSeqSettings.onTapCloseModal()\" text=\"ctrl.text\" position=\"ctrl.pos\" circle-radius=\"ctrl.circleRadius\">\n" +
    "\n" +
    "    </transparent-circle-drv>\n" +
    "    <png-sequence ng-style=\"{left:ctrl.pos.left + ctrl.pngSeqSettings.leftOffset + 'px', top:ctrl.pos.top + ctrl.pngSeqSettings.topOffset + 'px'}\"\n" +
    "                  img-data=\"{{ctrl.pngSeqSettings.imgArr}}\"\n" +
    "                  loop=\"false\"\n" +
    "                  speed=\"50\"\n" +
    "                  start-index=\"{{ctrl.pngSeqSettings.startIndex}}\"\n" +
    "                  end-index=\"{{ctrl.pngSeqSettings.endIndex}}\"\n" +
    "                  on-ended=\"actions.donePlaying()\"\n" +
    "                  ng-class=\"::ctrl.pngSeqSettings.classToAdd\"\n" +
    "                  actions=\"actions\">\n" +
    "    </png-sequence>\n" +
    "</div>\n" +
    "");
}]);

angular.module("znk/system/shared/templates/upgradeMessageModal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/system/shared/templates/upgradeMessageModal.html",
    "<div class=\"upgrade-version-wrapper-popup\">\n" +
    "\n" +
    "    <div class=\"header\">\n" +
    "        <div class=\"circle-with-icon\">\n" +
    "            <i class=\"raccoon-white-icon\"></i>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"scroll-limit\"></div>\n" +
    "    <ion-scroll scrollbar-y=\"false\" class=\"ion-scroll\">\n" +
    "\n" +
    "        <div class=\"top-section\">\n" +
    "\n" +
    "            <div class=\"message\">\n" +
    "                <h>Zinkerz 1.5 is here!</h>\n" +
    "                <p>We've made a bunch of changes to the app, from how it looks to giving you an estimated exam score.</p>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"img-wrapper\">\n" +
    "                <div class=\"raccoon-image\"></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"text-with-gray-background\">\n" +
    "            <div class=\"inner-text\">However, because of all the changes, we can't carryover your progress to the new version.</div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"bottom-text\">But don't worry!<br> We've added new ways to personalize to you, so after even just one workout you should be right back on track to ace your exam.</div>\n" +
    "\n" +
    "        <div class=\"footer-text only-tablet\">Happy prepping!</div>\n" +
    "\n" +
    "\n" +
    "    </ion-scroll>\n" +
    "\n" +
    "    <div class=\"btn-wrapper\">\n" +
    "        <div class=\"btn\" on-tap=\"close()\">GOT IT</div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("znk/system/shared/templates/videoActivationButton.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/system/shared/templates/videoActivationButton.html",
    "<button class=\"btn btn-outline-blue\"\n" +
    "        ng-class=\"{'disabled-grey': disabledButton}\"\n" +
    "        ng-disabled=\"disabledButton\"\n" +
    "        data-ng-click=\"playVideo()\"\n" +
    "        analytics-on=\"click\"\n" +
    "        analytics-event=\"click-video\"\n" +
    "        analytics-category=\"video\"\n" +
    "        analytics-label=\"{{analyticsLabel}}\">\n" +
    "    <div class=\"loading-spinner\" ng-show=\"isLoading\"><ion-spinner></ion-spinner></div>\n" +
    "    <i class=\"ion-arrow-right-b ng-hide\"  ng-hide=\"isLoading\"></i>\n" +
    "   <div class=\"btn-title\">{{label}}</div>\n" +
    "</button>\n" +
    "\n" +
    "");
}]);

angular.module("znk/system/shared/templates/writtenSlnHintModal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/system/shared/templates/writtenSlnHintModal.html",
    "<div class=\"hint-wrap\">\n" +
    "    <div written-sln-hint-modal-icon-drv>\n" +
    "            <div ng-click=\"openWrittenSolution()\" class=\"icon-circle-white only-tablet\">\n" +
    "                <i class=\"answer-solution-icon\"></i>\n" +
    "                <i class=\"ion-ios-arrow-thin-left\"></i>\n" +
    "            </div>\n" +
    "            <div ng-click=\"openWrittenSolution()\" class=\"icon-circle-blue only-mobile\">\n" +
    "                <i class=\"ion-ios-arrow-thin-right\"></i>\n" +
    "                <i class=\"answer-solution-white-icon\"></i>\n" +
    "            </div>\n" +
    "            <div class=\"text-box \">Tap to see written solution</div>\n" +
    "        </div>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("znk/system/shared/templates/writtenSolutionModal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/system/shared/templates/writtenSolutionModal.html",
    "<div class=\"header-circle-icon-center\">\n" +
    "    <div class=\"icon-wrapper\">\n" +
    "        <div class=\"answer-solution-white-icon\"></div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"content\">\n" +
    "    <div class=\"title\">Why Is This Right?</div>\n" +
    "    <div class=\"video-container\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col\">\n" +
    "                <video-activation-button-drv data-video-index-to-play=\"0\" data-videos=\"videosArr\" content-id=\"questionId\"/>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <ion-scroll scrollbar-y=\"false\">\n" +
    "        <div markup-drv markup=\"solution\" type=\"lg\" class=\"solution\"></div>\n" +
    "    </ion-scroll>\n" +
    "    <div class='quid' compile=\"quid\" bind-once=\"true\" ng-if=\"envName != 'production'\" ></div>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("znk/system/shared/templates/znkProgressDrv.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/system/shared/templates/znkProgressDrv.html",
    "<div ng-if=\"showProgressBubble()\" class=\"progress-bubble-wrapper\" ng-style=\"{left: progressWidth + '%'}\">\n" +
    "    <div class=\"progress-percentage\">\n" +
    "        <div>{{progressWidth}}%<div>mastery</div></div>\n" +
    "    </div>\n" +
    "    <div  class=\"progress-bubble\" >\n" +
    "        <div class=\"down-triangle gray-triangle\"></div>\n" +
    "        <div class=\"down-triangle\"></div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"progress-wrap\">\n" +
    "    <div class=\"progress\" ng-style=\"{width: progressWidth + '%'}\"></div>\n" +
    "    <div class=\"answer-count ng-hide\" ng-show=\"{{showProgressValue}}\" ng-style=\"{left: progressWidth + '%'}\">{{progressValue}}</div>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("znk/userProfile/templates/profile.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("znk/userProfile/templates/profile.html",
    "<ion-view class=\"profile profile-bg\">\n" +
    "    <ion-header-bar class=\"znk-header level1\"\n" +
    "                    no-tap-scroll=\"true\">\n" +
    "        <div class=\"buttons\">\n" +
    "            <znk-back-button></znk-back-button>\n" +
    "        </div>\n" +
    "        <div class=\"title\">\n" +
    "            <span class=\"znk-title\">Profile</span>\n" +
    "        </div>\n" +
    "        <div class=\"buttons\">\n" +
    "            <div class=\"save-btn-wrapper\">\n" +
    "                <span class=\"save-btn\" ng-click=\"d.save()\">Save</span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </ion-header-bar>\n" +
    "    <ion-content class=\"has-header\" scroll=\"d.isMobile\" scrollbar-y=\"false\">\n" +
    "        <div class=\"profile-page only-tablet\">\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col section-header\">account</div>\n" +
    "            </div>\n" +
    "            <div class=\"account-circle\">\n" +
    "                <div class=\"account-icon\"></div>\n" +
    "            </div>\n" +
    "            <div class=\"account-container\">\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"col col-20 box-label\">USERNAME</div>\n" +
    "                    <div class=\"col input-row\"><input type=\"text\" ng-model=\"d.formData.nickname\" class=\"input-box\"\n" +
    "                                                      placeholder=\"Username\" ng-disabled=\"d.isOffline\"></div>\n" +
    "                </div>\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"col col-20 box-label\">FIRST NAME</div>\n" +
    "                    <div class=\"col input-row\">\n" +
    "                        <input type=\"text\" ng-model=\"d.formData.firstName\" class=\"input-box\"\n" +
    "                               placeholder=\"First Name\" ng-disabled=\"d.isOffline\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"col col-20 box-label\">LAST NAME</div>\n" +
    "                    <div class=\"col input-row\">\n" +
    "                        <input type=\"text\" ng-model=\"d.formData.lastName\" class=\"input-box\"\n" +
    "                               placeholder=\"Last Name\" ng-disabled=\"d.isOffline\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"col col-20 box-label\">EMAIL</div>\n" +
    "                    <div class=\"col input-row\">\n" +
    "                        <input type=\"text\" ng-model=\"d.formData.email\" class=\"input-box\"\n" +
    "                               placeholder=\"Email\" ng-disabled=\"true\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"row double-row\">\n" +
    "                    <div class=\"col col-20\">\n" +
    "                        <div class=\"box-label\">BIRTHDAY</div>\n" +
    "                    </div>\n" +
    "                    <div class=\"col col-33 no-padding-top\">\n" +
    "                        <input type=\"date\"\n" +
    "                               ng-model=\"d.birthday\"\n" +
    "                               class=\"input-box date-input\"\n" +
    "                               placeholder=\"Birthday\"\n" +
    "                               ng-disabled=\"d.isOffline\"\n" +
    "                               min=\"1900-01-01\"\n" +
    "                               max=\"2010-12-31\">\n" +
    "\n" +
    "                        <div class=\"calendar-icon\"></div>\n" +
    "                    </div>\n" +
    "                    <div class=\"col col-20\">\n" +
    "                        <div class=\"box-label\">CITY</div>\n" +
    "                    </div>\n" +
    "                    <div class=\"col col-20 no-padding-top\">\n" +
    "                        <input type=\"text\" ng-model=\"d.formData.city\" class=\"input-box\" placeholder=\"City\"\n" +
    "                               ng-disabled=\"d.isOffline\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col section-header\">school</div>\n" +
    "            </div>\n" +
    "            <div class=\"school-circle\">\n" +
    "                <div class=\"school-icon\"></div>\n" +
    "            </div>\n" +
    "            <div class=\"school-container\">\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"col col-25 box-label\">HIGHSCHOOL</div>\n" +
    "                    <div class=\"col input-row\"><input type=\"text\" ng-model=\"d.formData.highSchool\"\n" +
    "                                                      class=\"input-box\"\n" +
    "                                                      placeholder=\"Where do you study today?\"\n" +
    "                                                      ng-disabled=\"d.isOffline\"></div>\n" +
    "                </div>\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"col col-25 box-label\">TARGET SCHOOL</div>\n" +
    "                    <div class=\"col input-row\"><input type=\"text\" ng-model=\"d.formData.targetSchool\"\n" +
    "                                                      class=\"input-box\"\n" +
    "                                                      placeholder=\"Which college do you plan to apply?\"\n" +
    "                                                      ng-disabled=\"d.isOffline\"></div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"col col-25 box-label\">DREAM SCHOOL</div>\n" +
    "                    <div class=\"col input-row\"><input type=\"text\" ng-model=\"d.formData.dreamSchool\"\n" +
    "                                                      class=\"input-box\"\n" +
    "                                                      placeholder=\"What is your dream school?\"\n" +
    "                                                      ng-disabled=\"d.isOffline\"></div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col section-header\">sat target</div>\n" +
    "            </div>\n" +
    "            <div class=\"target-circle\">\n" +
    "                <div class=\"sat-target-icon\"></div>\n" +
    "            </div>\n" +
    "            <div class=\"target-container\">\n" +
    "                <div class=\"row double-row\">\n" +
    "                    <div class=\"col col-20\">\n" +
    "                        <div class=\"box-label\">SAT DATE</div>\n" +
    "                    </div>\n" +
    "                    <div class=\"col col-25 no-padding-top\">\n" +
    "                        <input type=\"date\"\n" +
    "                               ng-model=\"d.targetExamDate\"\n" +
    "                               class=\"input-box date-input\"\n" +
    "                               placeholder=\"Sat date\"\n" +
    "                               ng-disabled=\"d.isOffline\">\n" +
    "\n" +
    "                        <div class=\"calendar-icon\"></div>\n" +
    "                    </div>\n" +
    "                    <div class=\"col col-25\">\n" +
    "                        <div class=\"box-label\">SAT SCORE GOAL</div>\n" +
    "                    </div>\n" +
    "                    <div class=\"col col-25 no-padding-top\">\n" +
    "                        <input type=\"text\"\n" +
    "                               required=\"required\"\n" +
    "                               numbers-fmtr\n" +
    "                               ng-model=\"d.formData.satGoal\"\n" +
    "                               class=\"input-box text-input\"\n" +
    "                               placeholder=\"Total SAT score\"\n" +
    "                               ng-disabled=\"d.isOffline\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"col col-20 scores-label\">SCORE GOALS</div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"row triple-row\">\n" +
    "                    <div class=\"col col-25\">\n" +
    "                        <div class=\"box-label\">MATHEMATICS</div>\n" +
    "                    </div>\n" +
    "                    <div class=\"col col-10 no-padding-top\">\n" +
    "                        <input type=\"text\"\n" +
    "                               required=\"required\"\n" +
    "                               numbers-fmtr\n" +
    "                               ng-model=\"d.formData.mathGoal\"\n" +
    "                               class=\"input-box text-input\"\n" +
    "                               ng-disabled=\"d.isOffline\">\n" +
    "                    </div>\n" +
    "                    <div class=\"col col-25\">\n" +
    "                        <div class=\"box-label\">CRITICAL READING</div>\n" +
    "                    </div>\n" +
    "                    <div class=\"col col-10 no-padding-top\">\n" +
    "                        <input type=\"text\"\n" +
    "                               required=\"required\"\n" +
    "                               numbers-fmtr\n" +
    "                               ng-model=\"d.formData.readGoal\"\n" +
    "                               class=\"input-box text-input\"\n" +
    "                               ng-disabled=\"d.isOffline\">\n" +
    "                    </div>\n" +
    "                    <div class=\"col col-20\">\n" +
    "                        <div class=\"box-label\">WRITING</div>\n" +
    "                    </div>\n" +
    "                    <div class=\"col col-10 no-padding-top\">\n" +
    "                        <input type=\"text\"\n" +
    "                               required=\"required\"\n" +
    "                               numbers-fmtr\n" +
    "                               ng-model=\"d.formData.writeGoal\"\n" +
    "                               class=\"input-box text-input\"\n" +
    "                               ng-disabled=\"d.isOffline\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col section-header\">sat/psat scores</div>\n" +
    "            </div>\n" +
    "            <div class=\"scores-circle\">\n" +
    "                <div class=\"sat-scores-icon\"></div>\n" +
    "            </div>\n" +
    "            <div class=\"scores-container\">\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"col col-25 box-label\">TOTAL SCORE</div>\n" +
    "                    <div class=\"col col-33 input-row\">\n" +
    "                        <input type=\"text\"\n" +
    "                               required=\"required\"\n" +
    "                               numbers-fmtr\n" +
    "                               ng-model=\"d.formData.satScore\"\n" +
    "                               class=\"input-box text-input\"\n" +
    "                               placeholder=\"Total SAT/PSAT score\"\n" +
    "                               ng-disabled=\"d.isOffline\"></div>\n" +
    "                </div>\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"col col-25 scores-label\">SAT/PSAT SCORES</div>\n" +
    "                </div>\n" +
    "                <div class=\"row triple-row\">\n" +
    "                    <div class=\"col col-25\">\n" +
    "                        <div class=\"box-label\">MATHEMATICS</div>\n" +
    "                    </div>\n" +
    "                    <div class=\"col col-10 no-padding-top\">\n" +
    "                        <input type=\"text\"\n" +
    "                               ng-model=\"d.formData.mathScore\"\n" +
    "                               required=\"required\"\n" +
    "                               numbers-fmtr\n" +
    "                               class=\"input-box text-input\"\n" +
    "                               ng-disabled=\"d.isOffline\">\n" +
    "                    </div>\n" +
    "                    <div class=\"col col-25\">\n" +
    "                        <div class=\"box-label\">CRITICAL READING</div>\n" +
    "                    </div>\n" +
    "                    <div class=\"col col-10 no-padding-top\">\n" +
    "                        <input type=\"text\"\n" +
    "                               ng-model=\"d.formData.readScore\"\n" +
    "                               required=\"required\"\n" +
    "                               numbers-fmtr\n" +
    "                               class=\"input-box text-input\"\n" +
    "                               ng-disabled=\"d.isOffline\">\n" +
    "                    </div>\n" +
    "                    <div class=\"col col-20\">\n" +
    "                        <div class=\"box-label\">WRITING</div>\n" +
    "                    </div>\n" +
    "                    <div class=\"col col-10 no-padding-top\">\n" +
    "                        <input type=\"text\"\n" +
    "                               ng-model=\"d.formData.writeScore\"\n" +
    "                               required=\"required\"\n" +
    "                               numbers-fmtr\n" +
    "                               class=\"input-box text-input\"\n" +
    "                               ng-disabled=\"d.isOffline\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"profile-page only-mobile\">\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col section-header\">account</div>\n" +
    "            </div>\n" +
    "            <div class=\"account-circle\">\n" +
    "                <div class=\"account-icon\"></div>\n" +
    "            </div>\n" +
    "            <div class=\"account-container\">\n" +
    "                <div class=\"row box-label\">username</div>\n" +
    "                <div class=\"row input-row\">\n" +
    "                    <input type=\"text\" ng-model=\"d.formData.nickname\" class=\"input-box\"\n" +
    "                           placeholder=\"Username\" ng-disabled=\"d.isOffline\">\n" +
    "                </div>\n" +
    "                <div class=\"row box-label\">first name</div>\n" +
    "                <div class=\"row input-row\">\n" +
    "                    <input type=\"text\" ng-model=\"d.formData.firstName\" class=\"input-box\"\n" +
    "                           placeholder=\"First Name\" ng-disabled=\"d.isOffline\">\n" +
    "                </div>\n" +
    "                <div class=\"row box-label\">last name</div>\n" +
    "                <div class=\"row input-row\">\n" +
    "                    <input type=\"text\" ng-model=\"d.formData.lastName\" class=\"input-box\"\n" +
    "                           placeholder=\"last Name\" ng-disabled=\"d.isOffline\">\n" +
    "                </div>\n" +
    "                <div class=\"row box-label\">email</div>\n" +
    "                <div class=\"row input-row\">\n" +
    "                    <input type=\"email\" ng-model=\"d.formData.email\" class=\"input-box\"\n" +
    "                           placeholder=\"Email\" ng-disabled=\"true\">\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"row box-label\">birthday</div>\n" +
    "                <div class=\"row input-row date-row\">\n" +
    "                    <input type=\"date\" ng-model=\"d.birthday\"\n" +
    "                           class=\"input-box date-input\"\n" +
    "                           placeholder=\"Birthday\"\n" +
    "                           ng-disabled=\"d.isOffline\"\n" +
    "                           min=\"1900-01-01\"\n" +
    "                           max=\"2010-12-31\">\n" +
    "\n" +
    "                    <div class=\"calendar-icon\"></div>\n" +
    "                </div>\n" +
    "                <div class=\"row box-label\">city</div>\n" +
    "                <div class=\"row input-row\">\n" +
    "                    <input type=\"text\" ng-model=\"d.formData.city\" class=\"input-box\"\n" +
    "                           placeholder=\"City\" ng-disabled=\"d.isOffline\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col section-header\">school</div>\n" +
    "            </div>\n" +
    "            <div class=\"school-circle\">\n" +
    "                <div class=\"school-icon\"></div>\n" +
    "            </div>\n" +
    "            <div class=\"school-container\">\n" +
    "                <div class=\"row box-label\">high school</div>\n" +
    "                <div class=\"row input-row\">\n" +
    "                    <input type=\"text\" ng-model=\"d.formData.highSchool\" class=\"input-box\"\n" +
    "                           placeholder=\"Where do you study today?\" ng-disabled=\"d.isOffline\">\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"row box-label\">target school</div>\n" +
    "                <div class=\"row input-row\">\n" +
    "                    <input type=\"text\" ng-model=\"d.formData.targetSchool\" class=\"input-box\"\n" +
    "                           placeholder=\"Which college do you plan to apply?\" ng-disabled=\"d.isOffline\">\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"row box-label\">dream school</div>\n" +
    "                <div class=\"row input-row\">\n" +
    "                    <input type=\"text\" ng-model=\"d.formData.dreamSchool\" class=\"input-box\"\n" +
    "                           placeholder=\"What is your dream school?\" ng-disabled=\"d.isOffline\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col section-header\">sat target</div>\n" +
    "            </div>\n" +
    "            <div class=\"target-circle\">\n" +
    "                <div class=\"sat-target-icon\"></div>\n" +
    "            </div>\n" +
    "            <div class=\"target-container\">\n" +
    "                <div class=\"row box-label\">sat date</div>\n" +
    "                <div class=\"row input-row date-row\">\n" +
    "                    <div class=\"calendar-icon\"></div>\n" +
    "                    <input type=\"date\"\n" +
    "                           ng-model=\"d.targetExamDate\"\n" +
    "                           class=\"input-box date-input\"\n" +
    "                           placeholder=\"SAT Date\"\n" +
    "                           ng-disabled=\"d.isOffline\">\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"row box-label\">sat score goal</div>\n" +
    "                <div class=\"row input-row\">\n" +
    "                    <input type=\"text\"\n" +
    "                           ng-model=\"d.formData.satGoal\"\n" +
    "                           required=\"required\"\n" +
    "                           numbers-fmtr\n" +
    "                           class=\"input-box text-input\"\n" +
    "                           placeholder=\"Total SAT Score\"\n" +
    "                           ng-disabled=\"d.isOffline\">\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"row scores-label\">score goals</div>\n" +
    "\n" +
    "                <div class=\"row box-label\">mathematics</div>\n" +
    "                <div class=\"row input-row\">\n" +
    "                    <input type=\"text\"\n" +
    "                           required=\"required\"\n" +
    "                           numbers-fmtr\n" +
    "                           ng-model=\"d.formData.mathGoal\"\n" +
    "                           class=\"input-box text-input\"\n" +
    "                           ng-disabled=\"d.isOffline\">\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"row box-label\">critical reading</div>\n" +
    "                <div class=\"row input-row\">\n" +
    "                    <input type=\"text\"\n" +
    "                           required=\"required\"\n" +
    "                           numbers-fmtr\n" +
    "                           ng-model=\"d.formData.readGoal\"\n" +
    "                           class=\"input-box text-input\"\n" +
    "                           ng-disabled=\"d.isOffline\">\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"row box-label\">writing</div>\n" +
    "                <div class=\"row input-row\">\n" +
    "                    <input type=\"text\"\n" +
    "                           required=\"required\"\n" +
    "                           numbers-fmtr\n" +
    "                           ng-model=\"d.formData.writeGoal\"\n" +
    "                           class=\"input-box text-input\"\n" +
    "                           ng-disabled=\"d.isOffline\">\n" +
    "                </div>\n" +
    "\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col section-header\">sat/psat scores</div>\n" +
    "            </div>\n" +
    "            <div class=\"scores-circle\">\n" +
    "                <div class=\"sat-scores-icon\"></div>\n" +
    "            </div>\n" +
    "            <div class=\"scores-container\">\n" +
    "                <div class=\"row box-label\">total score</div>\n" +
    "                <div class=\"row input-row\">\n" +
    "                    <input type=\"text\"\n" +
    "                           required=\"required\"\n" +
    "                           numbers-fmtr\n" +
    "                           ng-model=\"d.formData.satScore\"\n" +
    "                           class=\"input-box text-input\"\n" +
    "                           placeholder=\"Total SAT/PSAT Score\"\n" +
    "                           ng-disabled=\"d.isOffline\">\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"row scores-label\">sat/psat scores</div>\n" +
    "\n" +
    "                <div class=\"row box-label\">mathematics</div>\n" +
    "                <div class=\"row input-row\">\n" +
    "                    <input type=\"text\"\n" +
    "                           required=\"required\"\n" +
    "                           numbers-fmtr\n" +
    "                           ng-model=\"d.formData.mathScore\"\n" +
    "                           class=\"input-box text-input\"\n" +
    "                           ng-disabled=\"d.isOffline\">\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"row box-label\">critical reading</div>\n" +
    "                <div class=\"row input-row\">\n" +
    "                    <input type=\"text\"\n" +
    "                           required=\"required\"\n" +
    "                           numbers-fmtr\n" +
    "                           ng-model=\"d.formData.readScore\"\n" +
    "                           class=\"input-box text-input\"\n" +
    "                           ng-disabled=\"d.isOffline\">\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"row box-label\">writing</div>\n" +
    "                <div class=\"row input-row\">\n" +
    "                    <input type=\"text\"\n" +
    "                           required=\"required\"\n" +
    "                           numbers-fmtr\n" +
    "                           ng-model=\"d.formData.writeScore\"\n" +
    "                           class=\"input-box text-input\"\n" +
    "                           ng-disabled=\"d.isOffline\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </ion-content>\n" +
    "</ion-view>\n" +
    "");
}]);
