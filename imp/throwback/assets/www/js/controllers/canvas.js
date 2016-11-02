controllerModule.controller('CanvasCtrl', function($scope, canvasService) {

  canvasService.init('this is a test status', '1 Year Ago', '9:56pm via fb','https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xaf1/t1.0-1/c2.0.50.50/p50x50/10568892_10152255820868596_8480459911340464123_n.jpg', "Kevin Chen");
  canvasService.exec();
  console.log(canvasService.getDataURL());

});
