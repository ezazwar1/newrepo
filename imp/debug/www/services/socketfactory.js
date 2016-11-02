angular.module('photoshare')
.factory('Socket',function (socketFactory,LiveSocketIOURL) {
	
	var socketConnect = io.connect(LiveSocketIOURL);
	var chatSocket = socketFactory({
		ioSocket: socketConnect
	});

	return chatSocket;
})