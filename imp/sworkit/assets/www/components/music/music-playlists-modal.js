angular.module('swMobileApp').factory('MusicPlaylistsModal', function ($rootScope, $ionicModal, $sce, $http, $window, $log) {
    $log.info("MusicPlaylistsModal");

    var EVENT_ACTION = "Music Playlists";
    trackEvent(EVENT_ACTION, 'View Music', 0);
    var MusicPlaylistsModal = {};
    var modalScope = $rootScope.$new();

    $http.get('http://sworkitads.herokuapp.com/sworkitmusic?version=2')
        .then(function (response) {
            modalScope.playlists = response.data.items;
        });

    modalScope.launchPlaylists = function (playlist) {
        $log.debug("launchPlaylists()", playlist.external_urls);
        trackEvent(EVENT_ACTION, playlist.name, 0);

        if (!ionic.Platform.isWebView()) {
            $window.open(playlist.launchDefault, '_system');
        } else {
            var scheme;
            if (ionic.Platform.isIOS()) {
                scheme = playlist.schemas.ios;
            } else if (ionic.Platform.isAndroid()) {
                scheme = playlist.schemas.android;
            }
            $window.appAvailability.check(
                scheme,
                function onSuccess() {
                    if (ionic.Platform.isIOS()) {
                        $window.open(playlist.launchiOS, '_system'); // This is working on iOS 9.3 and Android now without 'spotify://' in front
                    } else if (ionic.Platform.isAndroid()) {
                        $window.open(playlist.launchAndroid, '_system'); // This is working on iOS 9.3 and Android now without 'spotify://' in front
                    }
                },
                function onError() {
                    $window.open(playlist.launchDefault, '_system');
                }
            );
        }
    };

    var modalOptions = {
        scope: modalScope
    };

    MusicPlaylistsModal.show = function () {
        $ionicModal.fromTemplateUrl('components/music/music-playlists-modal.html', modalOptions)
            .then(function (modal) {
                modalScope.closeModal = function () {
                    return modal.hide()
                        .then(function () {
                            return modal.remove();
                        });
                };
                modal.show();
            });
    };

    return MusicPlaylistsModal;

});
