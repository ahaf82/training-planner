import React, { Fragment, useState, useEffect, useContext } from 'react';
import EmailContext from '../../context/email/emailContext';
import TrainingGroupContext from '../../context/trainingGroup/trainingGroupContext';

const ClearModalEmail = () => {
    
    const emailContext = useContext(EmailContext);
    const { current, deleteEmail, clearCurrent, getEmails } = emailContext;
    
    useEffect(() => {
        if (current !== null) {
            setEmail(current);
        } else {
            setEmail({
                trainingGroup: "",
                subject: "",
                message: ""
            });
        }
        // eslint-disable-next-line
    }, [emailContext, current]);

    const [email, setEmail] = useState({
        name: "",
        email: "",
        role: "",
        trainingGroup: [],
        trainingSessions: []
    });
    
    const onDelete = () => {
        deleteEmail(current._id);
        clearCurrent();
        window.location.reload();
    }

    return (
        <div id='clear-modal-email' className='modal'>
            <div className="modal-content">
            {current &&
                    <h5>Email wirklich löschen?</h5>}
                <div className="modal-footer">
                    <a href="#!" onClick={onDelete} className="modal-close btn btn-danger btn-sm btn">Löschen</a> {' '}
                    <a href="#!" className="modal-close btn btn-dark btn-sm btn">Abbrechen</a>
                </div>
            </div>
        </div>
    )
}

export default ClearModalEmail;
