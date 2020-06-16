import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import TrainingGroupContext from '../../context/trainingGroup/trainingGroupContext'

const TrainingGroupItem = ({ group }) => {
    const trainingGroupContext = useContext(TrainingGroupContext);
    const { deleteTrainingGroup, setCurrent, clearCurrent } = trainingGroupContext;

    const { _id, trainingGroup } = group;

    const onDelete = () => {
        deleteTrainingGroup(_id);
        clearCurrent();
    }

    return (
        <div className='card bg-light'>
            <h3 className="text-primary text-left">
                { trainingGroup }{' '} 
            </h3>
            <ul className="list">
                {/* {date && <li>
                    <i className="fas fa-phone"></i> {date}
                </li>} */}
            </ul>
            <p> 
                <button className="btn btn-dark btn-sm" onClick={() => setCurrent(group)}>Ändern</button>
                <button className="btn btn-danger btn-sm" onClick={onDelete}>Löschen</button>
            </p>
        </div>
    )
}

TrainingGroupItem.propTypes = {
    trainingGroup: PropTypes.object.isRequired
}

export default TrainingGroupItem;