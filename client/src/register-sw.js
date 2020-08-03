const registerServiceWorker = () => {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            // .then(function (registration) {
            //     registration.pushManager.getSubscription()
            //     .then( function(sub) {
            //         console.log('Subscription Info:', sub)
            //     });
            // });
        } else {
            console.log('Subscription Failed...')
        }
    }

export { registerServiceWorker };