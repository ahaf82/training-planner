import * as firebase from "firebase/app";
import "firebase/messaging";

const initializedFirebaseApp = firebase.initializeApp({
    // Project Settings => Add Firebase to your web app
    apiKey: "AIzaSyCGzBvB1dfyeghEQo15VtH1rTHcNR9K3c4",
    authDomain: "training-planner-bafd0.firebaseapp.com",
    databaseURL: "https://training-planner-bafd0.firebaseio.com",
    projectId: "training-planner-bafd0",
    storageBucket: "training-planner-bafd0.appspot.com",
    appId: "1:1097871826935:web:b65a5c35e463c586c858f2",
    measurementId: "G-CPRFP3C2E6",
    messagingSenderId: "1097871826935"
});

const messaging = initializedFirebaseApp.messaging();

messaging.usePublicVapidKey(
    // Project Settings => Cloud Messaging => Web Push certificates
    "BPAjC44svbSfc2mXkSA58CTKcYgegsdWwSBpx2h7puJSQCZtquS_1HMlETSl8XmV4uZo7wlv0X11EVrpcCPB_ME"
);

export { messaging };