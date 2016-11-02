angular.module('starter')
    //.constant('BASE_URL', 'http://localhost/opencart-2.3.0.2/upload/index.php')
    .constant('BASE_URL', 'http://ocdemo.i2csmobile.com/index.php')
    //.constant('BASE_API_URL', 'http://localhost/opencart-2.3.0.2/upload/index.php?route=api2')
    .constant('BASE_API_URL', 'http://ocdemo.i2csmobile.com/index.php?route=api2')
    .constant('WEBSITE', 'http://ocdemo.i2csmobile.com')
    .constant('FORGOT_LINK', 'http://ocdemo.i2csmobile.com/index.php?route=account/forgotten')
    .constant('EMAIL', 'i2cssolutions@gmail.com')
    .constant('PHONE', '0712966650')
    .constant('ANALYTICS_ID', 'UA-79548648-1')
	.constant('COUPONS_ENABLED', true)
    .constant('STATUSBAR_COLOR', "#387ef5")
    .constant('LANGUAGES', [
            { name: "English", language_id: "en-US" },
            { name: "French", language_id: "fr-FR" },
            { name: "Chinese", language_id: "zh-CN" },
            { name: "Arabic", language_id: "ar-EG" }])
    .constant('LOCAL_NOTIFICATIONS_ARRAY', [
            {
                text: 'Come and see new arrivals and offers! Exclusive for mobile app users',
                title: 'New Arrivals and Offers at i2CS'
            },
            {
                text: 'Exclusive offers for mobile app users',
                title: 'See New Offers at i2CS'
            },
            {
                text: 'Hi :*, check our new collection!',
                title: 'Hi from i2CS :)'
            }
    ])
    .constant('RTL_LANGUAGES', ['ar'])
    .constant('INTERCOM_INTEGRATION', true) // please check www/app/common/services/intercom.service.js
    .constant('ONESIGNAL_APP_ID', "7c52a5dd-06b6-4d47-9045-830139d76564") // get OneSignal app id from http://onesignal.com
    .constant('GCM_SENDER_ID', "1037766790597")