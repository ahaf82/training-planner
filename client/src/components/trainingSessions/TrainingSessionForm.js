import React, { useState, useContext, useEffect } from 'react';
import AlertContext from '../../context/alert/alertContext'
import TrainingSessionContext from '../../context/trainingSession/trainingSessionContext';

const TrainingSessionForm = () => {
    const alertContext = useContext(AlertContext);
    const trainingSessionContext = useContext(TrainingSessionContext);

    const { setAlert } = alertContext;
    const { addTrainingSession, updateTrainingSession, clearCurrent, current } = trainingSessionContext;

    useEffect(() => {
        if (current !== null) {
            setTrainingSession(current);
        } else {
            setTrainingSession({
              trainingGroup: "",
              description: "",
              time: "",
              date: "",
              maxMembers: "",
              memberCount: "",
              members: []
            });
        }
    }, [trainingSessionContext, current]);

    const [trainingSession, setTrainingSession] = useState({
        trainingGroup: "",
        description: "",
        time: "",
        date: "",
        maxMembers: "",
        memberCount: "",
        members: []
    });

    const { session, description, time, date, maxMembers, memberCount, members } = trainingSession;

    const onChange = e => setTrainingSession({ ...trainingSession, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();
        if (description === '' || time === '' || date === '') {
            setAlert('Bitte Beschreibung, Datum und Zeit eingeben', 'danger');
        } else if (current === null) {            
            addTrainingSession(trainingSession);
        } else {
            updateTrainingSession(trainingSession);
        }
        setTrainingSession({
            trainingGroup: "",
            description: "",
            time: "",
            date: "",
            maxMembers: "",
            memberCount: "",
            members: []
        })
    }

    const clearAll = () => {
        clearCurrent();
    }

    return (
        <form onSubmit={onSubmit}>
            <h2 className="text-primary">{current ? 'Trainingseinheit ändern' : 'Trainingseinheit hinzufügen'}</h2>
            <input type="text" placeholder="Beschreibung" name="description" value={description} onChange={onChange} />
            <input type="time" placeholder="" name="time" value={time} onChange={onChange} />
            <input type="date" placeholder="" name="date" value={date} onChange={onChange} />
            Teilnehmer zugelassen: <input type="number" placeholder="0" name="maxMembers" value={maxMembers} onChange={onChange} />
            Teilnehmer angemeldet: <input type="number" placeholder="0" name="memberCount" value={memberCount} onChange={onChange} />
            <div>
                <input type="submit" value={current ? 'Trainingseinheit aktualisieren' : 'Trainingseinheit hinzufügen'} className="btn btn-primary btn-block"/>
            </div>
            {current && <div>
                <button className="btn btn-light btn-block" onClick={clearAll}>Löschen</button>
            </div>}
        </form>
    )
}

export default TrainingSessionForm;