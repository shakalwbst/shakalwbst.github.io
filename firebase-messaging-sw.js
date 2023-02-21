/* eslint-disable no-undef */
// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.3.2/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.3.2/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
  apiKey: "AIzaSyAjgv7ElE6pNyj-IWcuhFu7R6LA8Zhbuow",
  authDomain: "mycool-net-app.firebaseapp.com",
  databaseURL: "https://mycool-net-app.firebaseio.com",
  projectId: "mycool-net-app",
  storageBucket: "mycool-net-app.appspot.com",
  messagingSenderId: "139027047038",
  appId: "1:139027047038:web:17a8142159e30c486dee2f",
  measurementId: "G-DD36HCYMCS",
};

const app = firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging(app);

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
    image: "",
    click_action: payload.data.click_action,
    title: payload.notification.title,
    popup: payload.data.popUpType,
  };
//  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

//  if (
//    !/iPad|iPhone|iPod/.test(userAgent) &&
//    !window.MSStream &&
//    !/android/i.test(userAgent)
//  ) {
//    console.log("user agent", userAgent);
//  }
  // eslint-disable-next-line no-restricted-globals
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// eslint-disable-next-line no-restricted-globals
self.addEventListener(
  "notificationclick",
  function (event) {
    event.notification.close();

    // User selected (e.g., clicked in) the main body of notification.
    clients.openWindow(event.click_action);
  },
  false
);
