angular.module('instacafe.constant', [])

.constant('apiUrl', 'http://instacafe.me/api/')
//.constant('apiUrl', 'http://localhost:8000/api/')
//.constant('apiUrl', 'api/')
.constant('iosAppUrl', 'http://appstore.com/instacafe')
.constant('androidAppUrl', 'https://play.google.com/store/apps/details?id=me.instacafe')

.constant('defaultPoint', {
    latitude: 34.0522342,
    longitude: -118.2436849
})

.constant('shareMessage', 'You can download InstaCafe app from this link.')
.constant('locationErrorMessaage', {
    title: 'Location Services is disabled',
    template: 'InstaCafe needs access to your location. Please turn on Location Services in your device settings.'
})
.constant('connectionErrorMessaage', {
    title: 'Connection Error',
    template: 'Please try again later.'
})

.constant('IOS_PUBLISHER_KEY', 'ca-app-pub-4147421602897742/3843861318')
.constant('ANDROID_PUBLISHER_KEY', 'ca-app-pub-4147421602897742/9720441312')
.constant('ANALYTICS_TRACKING_ID', 'UA-53247922-5')
