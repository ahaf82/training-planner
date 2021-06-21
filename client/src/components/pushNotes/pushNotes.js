import React, { useState, useContext, useEffect } from "react";
import AuthContext from '../../context/auth/authContext';
import TrainingGroupContext from '../../context/trainingGroup/trainingGroupContext';
import MemberContext from '../../context/member/memberContext';
import TrainingGroupOptions from '../trainingSessions/TrainingGroupOptions';
import M from 'materialize-css/dist/js/materialize.min.js';

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

    const subsTrue = false;

    useEffect(() => {
        start();
    }, []);

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

    async function start() {
        if ((member.devices.length > 0) && unsubscribe !== null) {
            navigator.serviceWorker.ready
                .then(function (registration) {
                    if (!!registration.pushManager) {
                        return registration.pushManager.getSubscription();
                    }
                    return registration.safari.pushNotification()
                }).then(function (subscription) {
                    if (subscription && member.devices.filter(item => item.endpoint === subscription.endpoint) !== '') {
                        console.log('true');
                        setChecked(true);
                    }
                });
            }
        }

    async function subscribe() {
        const register = await navigator.serviceWorker.register(`/custom-sw.js`);

        console.log("reg", register)
        const sw = await navigator.serviceWorker.ready;

        // Register Push
        console.log("Registering Push...", _id, email);
        console.log("service worker", sw);
        console.log("reg", register);
        let subscription;
        if (!!sw.pushManager) {
            subscription = await sw.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
            });
        } else {
            console.log("sw", sw)
            subscription = await sw.safari.pushNotification({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
            })
        }
        
        console.log("subscription");
        const subscribeData = {
            endpoint: subscription.endpoint,
            keys: {
                p256dh: subscription.toJSON().keys.p256dh,
                auth: subscription.toJSON().keys.auth
            }
        };

        console.log("subscribeData", subscribeData);

        const updMember = {
            _id,
            email,
            devices: [...member.devices, subscribeData]
        }

        if (member.devices.includes(subscription.endpoint) === false) {
            updateMember(updMember);    
        }
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
        
        if (trainingGroup) {
            console.log(members.filter(memb => memb.trainingGroup.includes(trainingGroup.trainingGroup) || (memb.role === 'admin')));
            members.filter(memb => (members.filter(memb => memb.trainingGroup.includes(trainingGroup.trainingGroup)) || (memb.role === 'admin'))).map(async function (item) {
                if (item.devices) {
                    item.devices.map(async element => {
                        element.payload = pushData;
                        console.log('Gesendet');
                        await fetch("/subscribe", {
                            method: "POST",
                            body: JSON.stringify(element),
                            headers: {
                                "content-type": "application/json"
                            }
                        });
                        console.log("Push Sent...");
                    });
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

    return (
        <div className='column'>
            {'Notification' in window && navigator.serviceWorker && (role === 'member' || role === 'trainer') &&
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
                {<div className="input-field">
                    <select name="trainingGroup" key={trainingGroupContext._id} value={trainingGroupContext._id} className="browser-default" onChange={onChangeGroup} defaultValue="">
                        <option value="" disabled>
                            Trainingsgruppe...
                    </option>
                        <TrainingGroupOptions />
                    </select>
                </div>  }
                <input type="text" placeholder="Sende Nachricht" name="pushData" value={pushData} onChange={onChangeInput} /> 
                <button className="btn btn-dark btn-sm" variant="warning" onClick={(e) => send(pushData)}>Sende Push-Nachricht</button> 
            </div> }
        </div>
    )
};

export default PushNote;