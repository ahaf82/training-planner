import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import TrainingGroupContext from '../../context/trainingGroup/trainingGroupContext'
import AuthContext from '../../context/auth/authContext'

const TrainingGroupItem = ({ group }) => {
    const authContext = useContext(AuthContext);
    const { role } = authContext;

    const trainingGroupContext = useContext(TrainingGroupContext);
    const { deleteTrainingGroup, setCurrent, clearCurrent } = trainingGroupContext;

    const { _id, trainingGroup } = group;

    const onDelete = () => {
        deleteTrainingGroup(_id);
        clearCurrent();
    }
    
    return (
        <div>
            { (role === 'admin' || role === 'superUser' || role === 'member') &&
            <div className='card bg-light'>
                <h3 className="text-primary text-left large">
                    { trainingGroup }{' '} 
                </h3> 
                <ul className="list">
                    {/* {date && <li>
                        <i className="fas fa-phone"></i> {date}
                    </li>} */}
                </ul> 
                { role === ('admin' || 'superUser') &&
                <p> 
                    <button className="btn btn-dark btn-sm" onClick={() => setCurrent(group)}>Ändern</button>
                    <button className="btn btn-danger btn-sm" onClick={onDelete}>Löschen</button>
                </p> }
            </div>}
        </div>
    )
}

export default TrainingGroupItem;