import React, { useContext, Fragment } from 'react';
import PropTypes from 'prop-types';
import MemberContext from '../../context/member/memberContext';
import TrainingGroupContext from '../../context/trainingGroup/trainingGroupContext';
import TrainingSessionContext from '../../context/trainingSession/trainingSessionContext';
import AuthContext from '../../context/auth/authContext';
import M from 'materialize-css/dist/js/materialize.min.js';

const TrainingGroupItem = ({ group }) => {
    const authContext = useContext(AuthContext);
    const { role } = authContext;

    const memberContext = useContext(MemberContext);
    const { members } = memberContext;

    const trainingGroupContext = useContext(TrainingGroupContext);
    const { deleteTrainingGroup, setCurrent, clearCurrent } = trainingGroupContext;

    const trainingSessionContext = useContext(TrainingSessionContext);
    const { trainingSessions } = trainingSessionContext;

    const { _id, trainingGroup } = group;

    let memberGroup;

    // Convert Object Id to Name
    let groupMembers;
    let subMembers = [];
    if (members !== undefined && members !== null) subMembers = members.filter(element => element.familyMember.length > 0).map(element => element.familyMember)[0];
    let groupSubMembers = subMembers.filter(obj => group.members.includes(obj._id));
    // console.log(groupSubMembers);

    if (members) {
        groupMembers = [ ...members.filter(element => group.members.includes(element._id)), ...groupSubMembers]
        // groupMembers = [...new Set(members.filter(element => group.members.includes(element._id)), ...groupSubMembers)];
        groupMembers = [...new Set(groupMembers)];
        // console.log("groups", groupMembers);
    }

    return (
        <div className='column'>
            {(role === 'admin' || role === 'superUser') &&              // field for admin and superUser
                <div className='card bg-light'>
                    <h3 className="text-dark text-left large">
                        {trainingGroup}{' '}
                    </h3>
                    {groupMembers && <div>
                        <i className="fa fa-user"></i> Mitglieder:
                            {groupMembers.map(member => (
                                <li key={member._id}>{member.name}</li>
                            ))}
                    </div>}
                    <p>
                        <button className="btn btn-dark btn-sm" onClick={() => setCurrent(group)}>Ändern</button>
                        <button data-target="clear-modal-group" class="btn btn-danger btn-sm modal-trigger" onClick={() => setCurrent(group)}>Löschen</button>
                    </p>
                </div>}
            {(role === 'member' && memberGroup !== "") &&               // field for member
                <div className='card bg-light'>
                    <h3 className="text-dark text-left large">
                        {group.trainingGroup}{' '}
                    </h3>
                </div>}
        </div>
    )
}

TrainingGroupItem.propTypes = {
    group: PropTypes.object.isRequired
}

export default TrainingGroupItem;