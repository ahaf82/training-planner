import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import MemberContext from '../../context/member/memberContext'
import TrainingGroupContext from '../../context/trainingGroup/trainingGroupContext'

const TrainingGroupItem = ({ group }) => {
    const memberContext = useContext(MemberContext);
    const { member, updateMember } = memberContext;

    const { trainingGroup } = group;

    const [checked, setChecked] = useState(false);
    //const onChange = e => setMember({ ...member, [e.target.name]: e.target.value });

    return (
        <div className='collection-item'>
            <p>
                <label>
                    <input type="checkbox" className="filled-in" name="trainingGroup" value={group.trainingGroup} onClick={()=>setChecked(!checked)} />
                    <span>{group.trainingGroup}</span>
                </label>
            </p>
        </div>
    )
}

export default TrainingGroupItem;