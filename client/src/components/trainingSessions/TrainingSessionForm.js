import React, { useState, useContext, useEffect } from 'react';
import AlertContext from '../../context/alert/alertContext'
import TrainingGroupContext from '../../context/trainingGroup/trainingGroupContext';
import TrainingSessionContext from '../../context/trainingSession/trainingSessionContext';
import TrainingGroupOptions from './TrainingGroupOptions';

const TrainingSessionForm = () => {
    const alertContext = useContext(AlertContext);
    const { setAlert } = alertContext;
    
    const trainingGroupContext = useContext(TrainingGroupContext);
    const { trainingGroup } = trainingGroupContext;
    
    const trainingSessionContext = useContext(TrainingSessionContext);
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

    const [group, setGroup] = useState("");
    
    const { session, description, time, date, maxMembers, memberCount, members } = trainingSession;

    const onChange = e => setTrainingSession({ ...trainingSession, [e.target.name]: e.target.value });
    //if (trainingGroup) {console.log(trainingGroup.map(training => training.trainingGroup));}

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

    
    console.log('Gruppe: ' + group);
   // console.log('Trainingsgruppe: ' + trainingGroup._id);

    return (
        <form onSubmit={onSubmit}>
            <h2 className="text-primary large">{current ? 'Trainingseinheit ändern' : 'Trainingseinheit hinzufügen'}</h2>
            <div className="input-field">
                <select name="trainingGroup" key={group} value={group} className="browser-default" onChange={e => setTrainingSession({ trainingGroup: e.target.value })}>
                    <option value="" disabled selected>
                        Trainingsgruppe...
                    </option>
                    <TrainingGroupOptions />
                </select>
            </div>
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