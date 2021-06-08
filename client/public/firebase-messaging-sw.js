importScripts('https://www.gstatic.com/firebasejs/7.13.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.13.1/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyCGzBvB1dfyeghEQo15VtH1rTHcNR9K3c4",
    authDomain: "training-planner-bafd0.firebaseapp.com",
    databaseURL: "https://training-planner-bafd0.firebaseio.com",
    projectId: "training-planner-bafd0",
    storageBucket: "training-planner-bafd0.appspot.com",
    messagingSenderId: "1097871826935",
    appId: "1:1097871826935:web:b65a5c35e463c586c858f2",
    measurementId: "G-CPRFP3C2E6"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Add the public key generated from the console here.
messaging.usePublicVapidKey("BPAjC44svbSfc2mXkSA58CTKcYgegsdWwSBpx2h7puJSQCZtquS_1HMlETSl8XmV4uZo7wlv0X11EVrpcCPB_ME");

messaging.setBackgroundMessageHandler(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    const notificationTitle = payload.data.title;
    const notificationOptions = {
        body: payload.data.body,
        icon: '/firebase-logo.png'
    };

    return self.registration.showNotification(notificationTitle,
        notificationOptions);
});

self.addEventListener('notificationclick', event => {
    console.log(event)
    return event;
});