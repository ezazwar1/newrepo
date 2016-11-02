angular.module('fun.services')
	.factory('FeedServ', function (CoolServ, $q) {

		function simData () {
			var self = this,
				args = arguments,
				defer = $q.defer();

			setTimeout(function () {
				defer.resolve.apply(self, args);
			}, 0);

			return defer.promise;
		}

		return {
			getFeed: function () {
				return simData(
						[{
							type: "movie",
							value: {
								title: "Carnaval vs Forro",
								userProfile: "http://stayfilm.artur.office.stayfilm.com.br/cool/user/profile/juliencolomb",
								userPhoto: "http://grabber.blob.core.windows.net/mycontainer/8ea83735-66cc-48df-bf7d-2eaee708e615_user_photo_profile?t=0.8949224061798304",
								movieWatch: "http://stayfilm.artur.office.stayfilm.com.br/cool/movie/watch/7166b89b-b4a1-4fe4-af6f-278812758aa8",
								fullName: "Julien Colomb",
								created: 1393604548,
								views: 1,
								synopsis: null,
								likes: 4,
								thumbnailURL: "http://grabber.blob.core.windows.net/timeline/8ea83735-66cc-48df-bf7d-2eaee708e615/7166b89b-b4a1-4fe4-af6f-278812758aa8/572x322_n.jpg"
							}
						}, {
							type: "movie",
							value: {
								title: "Davi: Amo Você Meu Filho!",
								userProfile: "http://stayfilm.artur.office.stayfilm.com.br/cool/user/profile/lucasdaveis",
								userPhoto: "http://grabber.blob.core.windows.net/mycontainer/8cce3a31-9a24-44d6-bfdc-a1e4b4ea7f7d_user_photo_profile?t=0.4892747811973095",
								movieWatch: "http://stayfilm.artur.office.stayfilm.com.br/cool/movie/watch/0f535389-c747-4c5b-8236-c93e2bcea9f3",
								fullName: "Lucas Garcia Davies",
								created: 1389912862,
								views: 0,
								synopsis: "Filho, você é a pessoa mais importante na minha vida. Você talvez assista este filme daqui à alguns anos, quando for maior e tenha maior compreensão.\r\n\r\nSaiba sempre disto: seu Pai lhe ama mais que qualquer coisa neste mundo e SEMPRE estará contigo, nos momentos bons e ruins, tristeza e alegria, eu sempre estarei com você.\r\n\r\nConte sempre comigo, seu Pai. Você é o maior presente que eu já ganhei na vida, você é meu melhor amigo.\r\n\r\n16/01/2014 20:54",
								likes: 1,
								thumbnailURL: "http://grabber.blob.core.windows.net/timeline/8cce3a31-9a24-44d6-bfdc-a1e4b4ea7f7d/0f535389-c747-4c5b-8236-c93e2bcea9f3/572x322_n.jpg"
							}
						}, {
							type: "movie",
							value: {
								title: "Cardoso",
								userProfile: "http://stayfilm.artur.office.stayfilm.com.br/cool/user/profile/juliencolomb",
								userPhoto: "http://grabber.blob.core.windows.net/mycontainer/8ea83735-66cc-48df-bf7d-2eaee708e615_user_photo_profile?t=0.8949224061798304",
								movieWatch: "http://stayfilm.artur.office.stayfilm.com.br/cool/movie/watch/9ba34527-6d14-4943-82c3-62e67d1ce858",
								fullName: "Julien Colomb",
								created: 1388871153,
								views: 2,
								synopsis: null,
								likes: 2,
								thumbnailURL: "http://grabber.blob.core.windows.net/timeline/8ea83735-66cc-48df-bf7d-2eaee708e615/9ba34527-6d14-4943-82c3-62e67d1ce858/572x322_n.jpg"
							}
						}, {
							type: "movie",
							value: {
								title: "Cazuza",
								userProfile: "http://stayfilm.artur.office.stayfilm.com.br/cool/user/profile/juliencolomb",
								userPhoto: "http://grabber.blob.core.windows.net/mycontainer/8ea83735-66cc-48df-bf7d-2eaee708e615_user_photo_profile?t=0.8949224061798304",
								movieWatch: "http://stayfilm.artur.office.stayfilm.com.br/cool/movie/watch/c4955f36-5285-4075-afc2-4d3260da0c40",
								fullName: "Julien Colomb",
								created: 1388856533,
								views: 0,
								synopsis: null,
								likes: 1,
								thumbnailURL: "http://grabber.blob.core.windows.net/timeline/8ea83735-66cc-48df-bf7d-2eaee708e615/c4955f36-5285-4075-afc2-4d3260da0c40/572x322_n.jpg"
							}
						}, {
							type: "movie",
							value: {
								title: "Davi Natal em São Paulo: Bourbon e Center Norte Shopping",
								userProfile: "http://stayfilm.artur.office.stayfilm.com.br/cool/user/profile/lucasdaveis",
								userPhoto: "http://grabber.blob.core.windows.net/mycontainer/8cce3a31-9a24-44d6-bfdc-a1e4b4ea7f7d_user_photo_profile?t=0.4892747811973095",
								movieWatch: "http://stayfilm.artur.office.stayfilm.com.br/cool/movie/watch/ccc219ed-4d57-4018-afd5-60c83ddf54a9",
								fullName: "Lucas Garcia Davies",
								created: 1388386257,
								views: 0,
								synopsis: "Davi Natal em São Paulo: Bourbon e Center Norte Shopping",
								likes: 1,
								thumbnailURL: "http://grabber.blob.core.windows.net/timeline/8cce3a31-9a24-44d6-bfdc-a1e4b4ea7f7d/ccc219ed-4d57-4018-afd5-60c83ddf54a9/572x322_n.jpg"
							}
						}, {
							type: "movie",
							value: {
								title: "Cazuza",
								userProfile: "http://stayfilm.artur.office.stayfilm.com.br/cool/user/profile/juliencolomb",
								userPhoto: "http://grabber.blob.core.windows.net/mycontainer/8ea83735-66cc-48df-bf7d-2eaee708e615_user_photo_profile?t=0.8949224061798304",
								movieWatch: "http://stayfilm.artur.office.stayfilm.com.br/cool/movie/watch/91a1d616-7430-4461-9194-189945d480b9",
								fullName: "Julien Colomb",
								created: 1388192182,
								views: 0,
								synopsis: "Mostra sobre Cazuza no Museo da Lingua Portuguesa",
								likes: 1,
								thumbnailURL: "http://grabber.blob.core.windows.net/timeline/8ea83735-66cc-48df-bf7d-2eaee708e615/91a1d616-7430-4461-9194-189945d480b9/572x322_n.jpg"
							}
						}, {
							type: "movie",
							value: {
								title: "Forro dos amigos 12/2013",
								userProfile: "http://stayfilm.artur.office.stayfilm.com.br/cool/user/profile/juliencolomb",
								userPhoto: "http://grabber.blob.core.windows.net/mycontainer/8ea83735-66cc-48df-bf7d-2eaee708e615_user_photo_profile?t=0.8949224061798304",
								movieWatch: "http://stayfilm.artur.office.stayfilm.com.br/cool/movie/watch/2107d247-66f5-4897-a6a7-3d5bd34e09ca",
								fullName: "Julien Colomb",
								created: 1388067623,
								views: 0,
								synopsis: "Forro no Parque de Carandiru !",
								likes: 1,
								thumbnailURL: "http://grabber.blob.core.windows.net/timeline/8ea83735-66cc-48df-bf7d-2eaee708e615/2107d247-66f5-4897-a6a7-3d5bd34e09ca/572x322_n.jpg"
							}
						}, {
							type: "movie",
							value: {
								title: "Natal 2013 em SP !",
								userProfile: "http://stayfilm.artur.office.stayfilm.com.br/cool/user/profile/juliencolomb",
								userPhoto: "http://grabber.blob.core.windows.net/mycontainer/8ea83735-66cc-48df-bf7d-2eaee708e615_user_photo_profile?t=0.8949224061798304",
								movieWatch: "http://stayfilm.artur.office.stayfilm.com.br/cool/movie/watch/78e77ef8-0da1-4c50-a865-83562b158427",
								fullName: "Julien Colomb",
								created: 1388067517,
								views: 0,
								synopsis: "Natal com meu amigo Fabiano e  a sua familia toda !",
								likes: 2,
								thumbnailURL: "http://grabber.blob.core.windows.net/timeline/8ea83735-66cc-48df-bf7d-2eaee708e615/78e77ef8-0da1-4c50-a865-83562b158427/572x322_n.jpg"
							}
}]
					);
			}
		};
	})
;