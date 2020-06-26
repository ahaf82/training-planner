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
    const { trainingGroup, getTrainingGroups } = trainingGroupContext;
    
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
    
    const { name, email, role } = member;
    
    const onChange = e => setMember({ ...member, [e.target.name]: e.target.value });
    
    const [checked, setChecked] = useState(false);


    
    const onSubmit = e => {
        e.preventDefault();
        if (email === '') {
            setAlert('Bitte eine gültige E-Mail Adresse eingeben', 'danger');
        } else {
            checked === true ? current.role = "member" : current.role = "none";
            
            const updMember = {
                _id: current._id,
                name,
                email,
                role: current.role,
                trainingGroup: member.trainingGroup,
                date: new Date()
            }
            
            updateMember(updMember);
        }
        setMember({
            name: "",
            email: "",
            role: "",
            trainingGroup: [],
            trainingSessions: []
        })
    }

    const handletrainingGroupSelect = e => {
        let check = e.target.checked;
        let checked_trainingGroup = e.target.value;
        if (check) {
            this.setState({
                days: [...this.state.trainingGroup, checked_trainingGroup]
            })
        } else {
            let index = trainingGroup.indexOf(checked_trainingGroup);
            if (index > -1) {
                trainingGroup.splice(index, 1);
                this.setState({
                    trainingGroup: trainingGroup
                })
            }
        }
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
                                  <input type="checkbox" key={group._id} className="filled-in" name={group._id} value={group._id} onChange={e => setMember({ trainingGroup: e.target.value })} />
                                  <span>{group.trainingGroup}</span>
                              </label>
                          </p>
                      ))}
                    </Fragment>
                </ul>
                <div className="modal-footer">
                    <a href="#!" onClick={onSubmit} className="modal-close waves-effect waves-primary btn">Bestätigung</a>
                </div>
            </div>
        </div>
    )
}

export default TrainingGroupListModal;