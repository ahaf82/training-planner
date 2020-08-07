import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import MemberContext from '../../context/member/memberContext';
import TrainingGroupContext from '../../context/trainingGroup/trainingGroupContext';
import M from 'materialize-css/dist/js/materialize.min.js';

const MemberItem = ({ member }) => {
    const memberContext = useContext(MemberContext);
    const { deleteMember, setCurrent, clearCurrent } = memberContext;

    const { _id, name, email, role } = member;

    const trainingGroupContext = useContext(TrainingGroupContext);
    const { trainingGroup } = trainingGroupContext;

    let groups = [];

    if (trainingGroup) { 
        groups = [...new Set(trainingGroup.filter(element => member.trainingGroup.includes(element._id)))];
    }

    return (
        <div>
            <div className="card bg-light card-content list-card">
                <h3 className="text-dark text-left large">
                    {name}{' '} 
                </h3>
                <ul className="list">
                    {email && <li>
                        <i className="fas fa-envelope-open"></i> E-Mail Adresse: {email}
                    </li>}
                    {role && <li>
                        <i className="fa fa-user" aria-hidden="true"></i> Berechtigung: {role}
                    </li>}
                    {groups && role !== ("admin" || "superUser") &&
                        <li> 
                        <i className="fa fa-users" aria-hidden="true"></i> Trainingsgruppen: 
                            {' '}{groups.map(group => group.trainingGroup).join(', ')}
                        </li>}
                </ul>
                {role !== ("admin" || "superUser") &&
                <p> 
                    <button className="btn btn-dark btn-sm" onClick={()=>setCurrent(member)}>Ändern</button>
                    <button data-target="clear-modal-member" class="btn btn-danger btn-sm modal-trigger" onClick={() => setCurrent(member)}>Löschen</button>
                </p>
                }
            </div>
        </div>
    )
}

export default MemberItem;