import React, { useState, useContext, useEffect } from 'react';
import TrainingGroupContext from '../../context/trainingGroup/trainingGroupContext';
import M from 'materialize-css/dist/js/materialize.min.js';

const TrainingGroupForm = () => {
    const trainingGroupContext = useContext(TrainingGroupContext);

    const { addTrainingGroup, updateTrainingGroup, clearCurrent, current } = trainingGroupContext;

    useEffect(() => {
        if (current !== null) {
            setTrainingGroup(current);
        } else {
            setTrainingGroup({
                trainingGroup: ""
            });
        }
    }, [trainingGroupContext, current]);

    const [group, setTrainingGroup] = useState({
        trainingGroup: ''
    });

    const { trainingGroup } = group;

    const onChange = e => setTrainingGroup({ ...group, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();
        if (trainingGroup === '') {
            M.toast({ html: 'Bitte eine Gruppenbezeichnung eingeben', classes: 'kentai-color', displayLength: 1500 });
        } else if (current === null) {
            addTrainingGroup(group);
        } else {
            updateTrainingGroup(group);
        }
    }

    const clearAll = () => {
        clearCurrent();
    }

    return (
        <form onSubmit={onSubmit}>
            <h2 className="text-dark large">{current ? 'Trainingsgruppe ändern' : 'Trainingsgruppe hinzufügen'}</h2>
            <input type="text" placeholder="Trainingsgruppe" name="trainingGroup" value={trainingGroup} onChange={onChange} />
            <div>
                <input type="submit" value={current ? 'Trainingsgruppe aktualisieren' : 'Trainingsgruppe hinzufügen'} className="btn btn-dark btn-block" />
            </div>
            {current && <div>
                <button className="btn btn-light btn-block" onClick={clearAll}>Löschen</button>

            </div>}
        </form>
    )
}

export default TrainingGroupForm;