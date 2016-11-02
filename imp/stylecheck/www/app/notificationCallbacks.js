var lastMessageId,
    message;

function createEvent() {
    // Create the event.
    var event = document.createEvent('Event');

    // Define that the event name is 'build'.
    event.initEvent('notificationReceived', true, true);

    event.notification = message;
    console.log(event.notification);
    // target can be any Element or other EventTarget.
    document.dispatchEvent(event);
}

function onNotification(e) {
    'use strict';
    switch (e.event) {
    case 'registered':
        if (e.regid.length > 0) {
            // Create the event.
            var event = document.createEvent('Event');

            // Define that the event name is 'build'.
            event.initEvent('androidLogin', true, true);
            event.regId = e.regid;

            // target can be any Element or other EventTarget.
            document.dispatchEvent(event);
        } else {
            console.log('no regid created :(');
        }
        break;

    case 'message':
        if (!lastMessageId || lastMessageId !== e.payload.messageInstance) {
            lastMessageId = e.payload.messageInstance;
            message = {
                isForeground: e.foreground
            };
            if (!e.coldstart) {
                createEvent();
            }
        }
        break;

    case 'error':
        console.log('error', e);
        break;

    default:
        console.log('default', e);
        break;
    }
}

function onNotificationAPN(event) {
    'use strict';
    if (!lastMessageId || lastMessageId !== event.messageInstance) {
        lastMessageId = event.messageInstance;
        message = {
            isForeground: event.foreground.toString() === '1',
            id: event.messageInstance,
            badge: event.badge
        };
        createEvent();
    }
}

document.addEventListener('appReady', function () {
    if (message && message.id) {
        createEvent();
    }
});