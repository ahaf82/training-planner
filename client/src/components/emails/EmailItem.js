import React, { useState, useContext } from 'react';
import EmailContext from '../../context/email/emailContext';
import TrainingGroupContext from '../../context/trainingGroup/trainingGroupContext';
import Moment from 'react-moment';
import 'moment/locale/de';
import moment from 'moment';
Moment.globalLocale = 'de';


const EmailItem = ({ email }) => {
    const emailContext = useContext(EmailContext);
    const { deleteEmail, setCurrent } = emailContext;

    const { _id, subject, message, from, to, createdAt } = email;

    const trainingGroupContext = useContext(TrainingGroupContext);
    const { trainingGroup } = trainingGroupContext;

    let groupName = "";

    if (trainingGroup) { 
        // console.log("trainingGroup", trainingGroup);
        // console.log("trainingGroup mail", to);
        // console.log("email", email);
        if(trainingGroup !== undefined && trainingGroup.find(element => element._id === to) !== undefined) groupName = trainingGroup.find(element => element._id === to).trainingGroup;
        if (to === "alle") {
            // console.log (" is alle ")
            groupName = "Alle";
        }
        // console.log("groupid", groupName, email);
    }

    return (
        <div>
            <div className="card bg-light">
                <h3 className="text-dark text-left large">
                    {groupName}{' '} 
                </h3>
                {createdAt && <p>
                    Gesendet: <Moment format='Do MMMM YYYY hh:mm'>{createdAt}</Moment>
                </p>}
                <p> 
                    Betreff: {subject}
                </p>
                <p> 
                    Nachricht: {message}
                </p>
                <p> 
                    <button className="btn btn-dark btn-sm" onClick={()=>setCurrent(email)}>In den Editor laden</button>
                    <button data-target="clear-modal-email" class="btn btn-danger btn-sm modal-trigger" onClick={() => setCurrent(email)}>Löschen</button>
                </p>
            </div>
        </div>
    )
}

export default EmailItem;