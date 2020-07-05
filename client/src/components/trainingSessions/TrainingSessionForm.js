import React, { useState, useContext, useEffect } from 'react';
import TrainingGroupContext from '../../context/trainingGroup/trainingGroupContext';
import TrainingSessionContext from '../../context/trainingSession/trainingSessionContext';
import TrainingGroupOptions from './TrainingGroupOptions';
import M from 'materialize-css/dist/js/materialize.min.js';


const TrainingSessionForm = () => {
    const trainingGroupContext = useContext(TrainingGroupContext);
    const { _id, members } = trainingGroupContext;
    
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
    
    const [group] = useState("");
    
    const { trainingGroup, description, time, date, maxMembers, memberCount } = trainingSession;
    
    const onChange = e => setTrainingSession({ ...trainingSession, [e.target.name]: e.target.value });
    
    const onSubmit = e => {
        e.preventDefault();
        if (trainingGroup === '' || description === '' || time === '' || date === '') {
            M.toast({ html: 'Bitte Trainingsgruppe, Beschreibung, Datum und Zeit eingeben', classes: 'red darken-1', displayLength: 1500 });
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
            <h2 className="text-primary large">{current ? 'Trainingseinheit ändern' : 'Trainingseinheit hinzufügen'}</h2>
            <div className="input-field">
                <select name="trainingGroup" key={_id} value={_id} className="browser-default" onChange={onChange}>
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