import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import MemberContext from '../../context/member/memberContext';
import TrainingGroupContext from '../../context/trainingGroup/trainingGroupContext';

const MemberItem = ({ member }) => {
    const memberContext = useContext(MemberContext);
    const { deleteMember, setCurrent, clearCurrent } = memberContext;

    const { _id, name, address, email, role } = member;

    const trainingGroupContext = useContext(TrainingGroupContext);
    const { trainingGroup } = trainingGroupContext;

    let groups = [];

    const onDelete = () => {
        deleteMember(_id);
        clearCurrent();
    }

    if (trainingGroup) { 
        groups = [...new Set(trainingGroup.filter(element => member.trainingGroup.includes(element._id)))];
    }

    return (
        <div className='card bg-light'>
            <h3 className="text-primary text-left large">
                {name}{' '} 
            </h3>
            <ul className="list">
                {email && <li>
                    <i className="fas fa-envelope-open"></i> E-Mail Adresse: {email}
                </li>}
                {role && <li>
                    <i className="fas fa-envelope-open"></i> Berechtigung: {role}
                </li>}
                {groups && role !== ("admin" || "superUser") &&
                    <div> 
                        <i className="fas fa-envelope-open"></i> Trainingsgruppen: 
                            {groups.map(group => <li>{group.trainingGroup}</li>)}
                    </div>}
            </ul>
            {role !== ("admin" || "superUser") &&
            <p> 
                <button className="btn btn-dark btn-sm" onClick={() => setCurrent(member)}>Ändern</button>
                <button className="btn btn-danger btn-sm" onClick={onDelete}>Löschen</button>           
            </p>
            }
        </div>
    )
}

export default MemberItem;