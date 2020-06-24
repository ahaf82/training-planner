import React, { useContext, useState } from 'react';
import MemberContext from '../../context/member/memberContext'
import TrainingGroupContext from '../../context/trainingGroup/trainingGroupContext'

const TrainingGroupItem = ({ group, key, current }) => {
    const [checked, setChecked] = useState(false);

    const memberContext = useContext(MemberContext);
    const { member } = memberContext;

    console.log(current);

    //const onChange = e => setGroup({ ...member, [e.target.name]: e.target.value });

    return (
        <div className='collection-item'>
            <p>
                <label>
                    <input type="checkbox" className="filled-in" key={key} name={group.trainingGroup} value={group.trainingGroup} checked={checked} onClick={() => setChecked(!checked)}  />
                    <span>{group.trainingGroup}</span>
                </label>
            </p>
        </div>
    )
}

export default TrainingGroupItem;