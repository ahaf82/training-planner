import React, { Fragment, useState, useEffect, useContext } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import AlertContext from '../../context/alert/alertContext';
import AuthContext from '../../context/auth/authContext';
import MemberContext from '../../context/member/memberContext';
import TrainingGroupContext from '../../context/trainingGroup/trainingGroupContext';
import TrainingSessionContext from '../../context/trainingSession/trainingSessionContext';

const TrainingGroupListModal = () => {
    const alertContext = useContext(AlertContext);
    const { setAlert } = alertContext;
    
    const authContext = useContext(AuthContext);
    // const { role } = authContext;
    
    const memberContext = useContext(MemberContext);
    const { updateMember, current } = memberContext;
    
    const trainingGroupContext = useContext(TrainingGroupContext);
    const { trainingGroup, getTrainingGroups, updateTrainingGroup } = trainingGroupContext;
    
    useEffect(() => {
        if (current !== null) {
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
        trainingSessions: []
    });
    
    const { name, email, _id } = member;

    
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
                email,
                role: current.role,
                trainingGroup: member.trainingGroup,
                date: new Date()
            }
            
            updateMember(updMember);

            // Update members in trainingGroups
            trainingGroup.map((item) => {
                if (member.trainingGroup.filter(element => element === item._id) != '') {
                    console.log('add: ' + member.trainingGroup.filter(element => element === item._id));
                	updateTrainingGroup({ _id: item._id, members: [...item.members, current._id] })
                } else {
                    console.log('filter');
                    updateTrainingGroup({ _id: item._id, members: item.members.filter(element => element !== current._id) 
                })
            }})
            
        }
        setMember({
            name: "",
            email: "",
            role: "",
            trainingGroup: [],
            trainingSessions: []
        })
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
