self.addEventListener('notificationclose', function (e) {
  var notification = e.notification;
  var primaryKey = notification.data.primaryKey;

  console.log('Closed notification: ' + primaryKey);
});

self.addEventListener('notificationclick', function (e) {
  var notification = e.notification;
  var primaryKey = notification.data.primaryKey;
  var action = e.action;

  if (action === 'close') {
    notification.close();
  } else {
    clients.openWindow('/');
    notification.close();
  }
});

self.addEventListener('push', function (e) {
  var body;

  if (e.data) {
    body = e.data.text();
  } else {
    body = 'Hallo liebe Mitglieder';
  }

  var options = {
    body: body,
    icon: 'favicon.ico',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore', title: 'Zum Training-Planner',
        icon: 'images/checkmark.png'
      },
      {
        action: 'close', title: 'Schließen',
        icon: 'images/xmark.png'
      },
    ]
  };
  e.waitUntil(
    self.registration.showNotification('Training Planner', options)
  );
});
