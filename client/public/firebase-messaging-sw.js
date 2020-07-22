importScripts("https://www.gstatic.com/firebasejs/5.9.4/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/5.9.4/firebase-messaging.js");

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

messaging.setBackgroundMessageHandler(function (payload) {
    const promiseChain = clients
        .matchAll({
            type: "window",
            includeUncontrolled: true,
        })
        .then((windowClients) => {
            for (let i = 0; i < windowClients.length; i++) {
                const windowClient = windowClients[i];
                windowClient.postMessage(payload);
            }
        })
        .then(() => {
            return registration.showNotification("my notification title");
        });
    return promiseChain;
});

self.addEventListener("notificationclick", function (event) {
    console.log(event);
});