const request = () => {

const fetchOptions = {
    "mode": "cors",
    "method": "POST",
    "headers": {
        "authorization": "key=SERVER ID",
        "content-type": "application/json"
    },
    "body": {
        "collapse_key": "type_a",
        "notification": {
            "body": "Body of Your Notification",
            "title": "Title of Your Notification",
            "icon": "http://www.liberaldictionary.com/wp-content/uploads/2019/02/icon-0326.jpg"
        },
        "data": {
            "body": "message",
            "title": "Title of Your Notification in Title",
            "key_1": "Value for key_1",
            "key_2": "Value for key_2"
        },
        "to": "cgZwYvNDaSzIWecWBgsDKW:APA91bFDr6X9DC5m4_enwGFN2Z0yMfh3igKze_AlAsJ83Js-1SpGvyCbfldLlMkCBTm44Fw0_Zk00cB3qdzhO6EB5rOFL_PvNuP4ltSV6sVw65xQdtPJm2lKcDmFnZ2109eSp9fWvSSS"
    }
}

fetch("https://fcm.googleapis.com/fcm/send", fetchOptions)
    .then(response => response.json())
    .then(data => console.log(data))
    .then(console.log('request'));

}


export default request;