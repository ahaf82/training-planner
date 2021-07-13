import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../../context/auth/authContext';
import EmailContext from '../../context/email/emailContext';
import TrainingGroupContext from '../../context/trainingGroup/trainingGroupContext';
import TrainingGroupOptions from '../trainingSessions/TrainingGroupOptions';
import Moment from 'react-moment';
import M from 'materialize-css/dist/js/materialize.min.js';
import 'moment/locale/de';

Moment.globalLocale = 'de';

const Messages = () => {
    const authContext = useContext(AuthContext);
    const { role } = authContext;

    const trainingGroupContext = useContext(TrainingGroupContext);
    const { getTrainingGroups } = trainingGroupContext;

    const emailContext = useContext(EmailContext);
    const { _id, addEmail, updateEmail, clearCurrent, current } = emailContext;

    const [email, setEmail] = useState({
        from: authContext.member.email,
        to: "",
        subject: "",
        message: ""
    });

    useEffect(() => {
        // authContext.loadMember();
        // getTrainingGroups();
        // console.log("auth", authContext);
        console.log("current", current);
        if (current !== null) {
            console.log("current not null");
            setEmail({
                from: authContext.member.email,
                to: current.to,
                subject: current.subject,
                message: current.message
            });
            console.log("set effect email", email);
            console.log("set effect subject", current.subject);
            console.log("set effect message", current.message);
        } else {
            setEmail({
                from: authContext.member.email,
                to: "",
                subject: "",
                message: ""
            });
        }
        // getMembers();
        // eslint-disable-next-line
    }, [emailContext, current]);

    let columns = 0;

    if (role === 'admin' || role === 'superUser') {
        columns = 3;
    }
    if (role === 'member' || role === 'trainer' || role === 'none') {
        columns = 1;
    }

    const [trainingGroup, setTrainingGroup] = useState({});

    const onChange = e => {
        e.preventDefault();
        setTrainingGroup(e.target.value);
        setEmail({ ...email, [e.target.name]: e.target.value });
    };

    const onChangeInput = e => setEmail({ ...email, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();
        if (email.subject === '') {
            M.toast({ html: 'Bitte Betreff eingeben', className: 'kentai-color', displayLength: 1500 });
        }
        else if (email.message === '') {
            M.toast({ html: 'Bitte Nachricht eingeben', className: 'kentai-color', displayLength: 1500 });
        } else {
            addEmail(email);
            setEmail({
                from: authContext.member.email,
                to: "",
                subject: "",
                message: ""
            });
            M.toast({ html: 'E-Mail versandt', className: 'kentai-color', displayLength: 1500 });
        } 
    }

    const clearAll = () => {
        clearCurrent();
    }

    return (
        <div className="card">
            <form onSubmit={onSubmit}>
                <h2 className="text-dark large">E-Mail an Mitglieder senden</h2>
                <div className="input-field">
                    <select name="to" key={_id} value={_id} className="browser-default" onChange={onChange}>
                        <option defaultValue="" disabled >
                            Trainingsgruppe...
                        </option>
                        <option value="alle" >
                            Alle
                        </option>
                        <TrainingGroupOptions />
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="subject">Betreff</label>
                    <input type="text" className="form-control" name="subject" value={email.subject} aria-describedby="Betreff" onChange={onChangeInput} />
                </div>
                <div className="form-group">
                    <label htmlFor="message">Nachricht</label>
                    <textarea className="form-control textfield" style={{height:"15%"}} rows="10" name="message" value={email.message} onChange={onChangeInput} ></textarea>
                </div>
                <button type="submit" className="btn btn-dark">Absenden</button>
            </form>
            <div>
                <button className="btn btn-light btn-block" onClick={clearAll}>Formular leeren</button>
            </div>
        </div>
    )
}

export default Messages;
