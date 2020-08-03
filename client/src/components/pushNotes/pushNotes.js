import React, { useState, useContext, useEffect } from "react";
import AuthContext from '../../context/auth/authContext';
import TrainingGroupContext from '../../context/trainingGroup/trainingGroupContext';
import MemberContext from '../../context/member/memberContext';
import TrainingGroupOptions from '../trainingSessions/TrainingGroupOptions';
import M from 'materialize-css/dist/js/materialize.min.js';

// import { messaging } from "../../init-fcm";
// import { compose, lifecycle, withHandlers, withState } from "recompose";

const host = process.env.NODE_ENV === "production" ? "." : "";

const PushNote = () => {
    const authContext = useContext(AuthContext);
    const { member } = authContext;
    
    const memberContext = useContext(MemberContext);
    const { updateMember, members } = memberContext; 

    const trainingGroupContext = useContext(TrainingGroupContext);
    
    const { _id, name, email, role } = member;
    
    const [pushData, setPushData] = useState('');
    
    const onChangeInput = e => setPushData(e.target.value);

    const [trainingGroup, setTrainingGroup] = useState('');
    const onChangeGroup = e => setTrainingGroup({ trainingGroup: e.target.value });
    
    const [checked, setChecked] = useState(false);

    function urlBase64ToUint8Array(base64String) {
        const padding = "=".repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");
        
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }
    
    async function subscribe() {
        const register = await navigator.serviceWorker.register(`./custom-sw.js`);
        console.log('Service worker in navigator');

        const sw = await navigator.serviceWorker.ready;

        // Register Push
        console.log("Registering Push...");
        const subscription = await sw.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
        });

        const subscribeData = {
            endpoint: subscription.endpoint,
            expirationTime: 7200,
            keys: {
                p256dh: subscription.toJSON().keys.p256dh,
                auth: subscription.toJSON().keys.auth
            }
        };

        const updMember = {
            _id,
            email,
            devices: [...member.devices, subscribeData]
        }

        console.log('UpdMember: ', updMember);
        updateMember(updMember);
    }

    async function unsubscribe() {
        if ((member.devices.length > 0) && unsubscribe !== null) {
            navigator.serviceWorker.ready
                .then(function (registration) {
                    return registration.pushManager.getSubscription();
                }).then(function (subscription) {
                    if (subscription) {
                    return subscription.unsubscribe()
                        .then(function () {
                            const unsubscribeMember = {
                                _id,
                                email,
                                devices: member.devices.filter(element => element.endpoint !== subscription.endpoint)
                            }
                            
                            updateMember(unsubscribeMember);
                            console.log('Unsubscribed', subscription.endpoint);
                        });
                    };
                });
            }
    }
    
    const onChange = (e) => {
        e.preventDefault()
        setChecked(!checked);
        checked === true ? unsubscribe() : subscribe();
    }
    
    const publicVapidKey = process.env.REACT_APP_VAPID_PUBLIC_KEY;
    
    // Register SW, Register Push, Send Push
    async function send(pushData) {
        // Send Push Notification
        console.log("Sending Push...");

        // console.log(member.role);

        // console.log(members.filter(memb => memb.trainingGroup.map(item => item === trainingGroup) || (member.role === 'admin')));
        // console.log(members.filter(memb => memb.trainingGroup.map(item => item !== trainingGroup)));
        
        if (trainingGroup) {
            console.log(trainingGroup);
            members.filter(memb => memb.trainingGroup.map(item => item === trainingGroup) || (memb.role === 'admin')).map(async function (item) {
                if (item) {
                    item.payload = pushData;
                    await fetch("/subscribe", {
                        method: "POST",
                        body: JSON.stringify(item),
                        headers: {
                            "content-type": "application/json"
                        }
                    });
                    console.log("Push Sent...");
                }
            });
        } else {
            members.map(memb => memb.devices.map(async function(item) {
                item.payload = pushData;
                await fetch("/subscribe", {
                    method: "POST",
                    body: JSON.stringify(item),
                    headers: {
                        "content-type": "application/json"
                    }
                });
                console.log("Push Sent...");
            }));
        }
    }

    console.log(trainingGroup);

    return (
        <div className='column'>
            {'Notification' in window && navigator.serviceWorker && ((role === 'member') || (role === 'trainer')) &&
            <div className="card bg-light">
                Push Benachrichtigungen auf diesem Gerät zulassen:
                <div class='switch'>
                    <label>
                        Nein
                                <input type="checkbox" name="role" checked={checked} onChange={onChange} />
                        <span class="lever"></span>
                                Ja
                            </label>
                </div>
            </div>}
            {(role === 'admin' || role === 'superUser') &&
            <div className="card bg-light">
                <div className="input-field">
                    <select name="trainingGroup" key={trainingGroupContext._id} value={trainingGroupContext._id} className="browser-default" onChange={onChangeGroup}>
                        <option value="" disabled selected>
                            Trainingsgruppe...
                    </option>
                        <TrainingGroupOptions />
                    </select>
                </div>
                <input type="text" placeholder="Sende Nachricht" name="pushData" value={pushData} onChange={onChangeInput} /> 
                <button className="btn btn-dark btn-sm" variant="warning" onClick={(e) => send(pushData)}>Sende Push-Nachricht</button> 
            </div> }
        </div>
    )
};

export default PushNote;



// <div class='switch'>
//     <label>
//         Nein
//                             <input type="checkbox" name="role" value={checked} onClick={onChange} />
//         <span class="lever"></span>
//                             Ja
//                         </label>
// </div>

// Firebase Notifications

    // <div className="card bg-light">
    //     <h1>React + Firebase Cloud Messaging (Push Notifications)</h1>
    //     <div>
    //         Current token is: <p>{token}</p>
    //     </div>
    //     <ul>
    //         Notifications List:
    //         {notifications.map(renderNotification)}
    //     </ul>
    // </div>

// export const requestFirebaseNotificationPermission = () =>
//     new Promise((resolve, reject) => {
//         messaging
//             .requestPermission()
//             .then(() => messaging.getToken())
//             .then((firebaseToken) => {
//                 resolve(firebaseToken);
//             })
//             .catch((err) => {
//                 reject(err);
//             });
//     });

// export const onMessageListener = () =>
//     new Promise((resolve) => {
//         messaging.onMessage((payload) => {
//             resolve(payload);
//         });
//     });

// const renderNotification = (notification, i) => <li key={i}>{notification}</li>;

// const registerPushListener = pushNotification =>
//     navigator.serviceWorker.addEventListener("message", ({ data }) =>
//         pushNotification(
//             data.data
//                 ? data.data.message
//                 : data["firebase-messaging-msg-data"].data.message
//         )
//     );


// export default compose(
//     withState("token", "setToken", ""),
//     withState("notifications", "setNotifications", []),
//     withHandlers({
//         pushNotification: ({
//             setNotifications,
//             notifications
//         }) => newNotification =>
//                 setNotifications(notifications.concat(newNotification))
//     }),
//     lifecycle({
//         async componentDidMount() {
//             const { pushNotification, setToken } = this.props;

//             messaging
//                 .requestPermission()
//                 .then(async function () {
//                     const token = await messaging.getToken();
//                     console.log(token);
//                     setToken(token);
//                 })
//                 .catch(function (err) {
//                     console.log("Unable to get permission to notify.", err);
//                 });

//             registerPushListener(pushNotification);
//         }
//     })
// )(PushNote);