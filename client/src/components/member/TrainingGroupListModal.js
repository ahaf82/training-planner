import React, { Fragment, useState, useEffect, useContext } from 'react';
import AlertContext from '../../context/alert/alertContext';
import MemberContext from '../../context/member/memberContext';
import TrainingGroupContext from '../../context/trainingGroup/trainingGroupContext';

const TrainingGroupListModal = () => {
    const alertContext = useContext(AlertContext);
    const { setAlert } = alertContext;
    
    const memberContext = useContext(MemberContext);
    const { updateMember, current, clearCurrent } = memberContext;
    
    const trainingGroupContext = useContext(TrainingGroupContext);
    const { trainingGroup, getTrainingGroups, updateTrainingGroup } = trainingGroupContext;

    const [mail, setMail] = useState(false);
    
    useEffect(() => {
        if (current !== null) {
            if (current.role === "none") setMail(true);
            setMember(current);
        } else {
            setMember({
                name: "",
                email: "",
                role: "",
                trainingGroup: [],
                trainingSessions: []
            });
        }
        getTrainingGroups();
        // eslint-disable-next-line
    }, [memberContext, current]);

    const [member, setMember] = useState({
        name: "",
        email: "",
        role: "",
        trainingGroup: [],
        trainingSessions: [],
        familyMember: []
    });
    
    const { name, email } = member;

    
    const [checked, setChecked] = useState(false);

    const onChange = (e, id) => {
        if (current === null) {
            return;
        }
        if (member.trainingGroup.includes(id)) {
            // was already checked
            setMember({ trainingGroup: member.trainingGroup.filter(item => item !== id) });
        } else {
            // was not checked
            setMember({ trainingGroup: [...member.trainingGroup, e.target.value] });
            console.log(trainingGroup);
        }
    };
    
    const onSubmit = e => {
        e.preventDefault();
        if (email === '') {
            setAlert('Bitte eine gültige E-Mail Adresse eingeben', 'danger');
        } else {
            checked === true ? current.role = "none" : current.role = "member";
            
            const updMember = {
                _id: current._id,
                name,
                email: current.email,
                role: current.role,
                trainingGroup: member.trainingGroup,
                date: new Date()
            }
            
            if ((current.role === "member" || current.role === "trainer") && mail === true) updMember.sendMail = true;
            updateMember(updMember);
            setMail(false);

            // Update members in trainingGroups
            trainingGroup.map((item) => {
                if (member.trainingGroup.filter(element => element === item._id) != '') {
                    console.log('add: ' + member.trainingGroup.filter(element => element === item._id));
                	updateTrainingGroup({ _id: item._id, members: [...item.members, current._id] })
                } else {
                    console.log("filter member in traininggroup", current)
                    updateTrainingGroup({ _id: item._id, members: item.members.filter(element => element !== current._id) });
            }});
            
        }
        setMember({
            name: "",
            email: "",
            role: "",
            trainingGroup: [],
            trainingSessions: []
        });
        clearCurrent();
    }

    return (
        <div id='trainingGroup-list-modal' className='modal'>
            <div className="modal-content">
                <h4>Trainingsgruppen</h4>
                <ul className="collection">
                    <Fragment>
                      {trainingGroup && trainingGroup.map((group,i) => (
                          <p id={group._id} key={group._id}>
                              <label>
                                  <input type="checkbox" key={group._id} className="filled-in" name={group._id} value={group._id} checked={member.trainingGroup.includes(group._id)} onChange={e => onChange(e, group._id)} />
                                  <span>{group.trainingGroup}</span>
                              </label>
                          </p>
                      ))}
                    </Fragment>
                </ul>
                <div className="modal-footer">
                    <a href="#!" onClick={onSubmit} className="modal-close waves-effect waves-kentai btn">Bestätigung</a>
                </div>
            </div>
        </div>
    )
}

export default TrainingGroupListModal;
