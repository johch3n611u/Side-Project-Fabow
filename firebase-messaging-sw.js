importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-messaging.js');
firebase.initializeApp({
    apiKey: "AIzaSyDb9idOXIXCBWLsbOpj4mJD43ag_9_CxS0",
    authDomain: "angular-vector-249608.firebaseapp.com",
    databaseURL: "https://angular-vector-249608-default-rtdb.firebaseio.com",
    projectId: "angular-vector-249608",
    storageBucket: "angular-vector-249608.appspot.com",
    messagingSenderId: "234200635804",
    appId: "1:234200635804:web:de0f00e10e1c415270d059",
    measurementId: "G-08GR7BHCDD"
});
const messaging = firebase.messaging();
messaging.usePublicVapidKey('BGga9Tb4DybflbMchsZ6JniwWJ0uQYEhLyZID0ANtlxw6hiRFFwQpjyog3Ei2TFquz1c7vVhqanWOq7lyhT_1XU');