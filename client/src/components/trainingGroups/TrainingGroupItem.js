import React, { useContext, useEffect } from 'react';
import MemberContext from '../../context/member/memberContext';
import TrainingGroupContext from '../../context/trainingGroup/trainingGroupContext';
import TrainingSessionContext from '../../context/trainingSession/trainingSessionContext';
import AlertContext from '../../context/alert/alertContext';
import AuthContext from '../../context/auth/authContext';
import M from 'materialize-css/dist/js/materialize.min.js';

const TrainingGroupItem = ({ group }) => {
    const alertContext = useContext(AlertContext);
    const { setAlert } = alertContext;

    const authContext = useContext(AuthContext);
    const { role } = authContext;

    const memberContext = useContext(MemberContext);
    const { members } = memberContext;

    const trainingGroupContext = useContext(TrainingGroupContext);
    const { deleteTrainingGroup, setCurrent, clearCurrent } = trainingGroupContext;

    const trainingSessionContext = useContext(TrainingSessionContext);
    const { trainingSessions, getTrainingSessions } = trainingSessionContext;

    const { _id, trainingGroup } = group;

    useEffect(() => {
        getTrainingSessions();
        // eslint-disable-next-line
    }, []);


    let memberGroup;

    // Delete training group item
    const onDelete = () => {
        const delResult = trainingSessions.filter(item => item.trainingGroup === _id);
        if (delResult[0]?.trainingGroup !== undefined) {
            M.toast({ html: 'Bitte erst alle Traininingseinheiten für die Gruppe löschen', classes: 'red darken-1', displayLength: 1500 });
        } else {
            deleteTrainingGroup(_id);
            clearCurrent();
        }
    }

    // Convert Object Id to Name
    let groupMembers;
    if (members) {
        groupMembers = [...new Set(members.filter(element => group.members.includes(element._id)))];
    }
    
    return (
        <div>
            {(role === 'admin' || role === 'superUser') &&              // field for admin and superUser
            <div className='card bg-light'>
                <h3 className="text-primary text-left large">
                    {trainingGroup}{' '}
                </h3>
                {groupMembers && <div>
                    <i class="fa fa-user"></i> Mitglieder:
                            {groupMembers.map(member => <li key={member._id}>{member.name}</li>)}
                </div>}
                <p>
                    <button className="btn btn-dark btn-sm" onClick={() => setCurrent(group)}>Ändern</button>
                    <button className="btn btn-danger btn-sm" onClick={onDelete}>Löschen</button>
                </p>
            </div>}            
            {(role === 'member' && memberGroup !== "") &&               // field for member
                <div className='card bg-light'>
                    <h3 className="text-primary text-left large"> 
                        {group.trainingGroup}{' '}
                    </h3>
                </div>}
        </div>
    )
}

export default TrainingGroupItem;