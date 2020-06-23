import React, { Fragment, useState, useEffect, useContext } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import TrainingGroupItem from './TrainingGroupItem';
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
    const { updateMember, clearCurrent, current } = memberContext;
    
    const trainingGroupContext = useContext(TrainingGroupContext);
    const { trainingGroup, getTrainingGroups, loading } = trainingGroupContext;
    
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
            console.log(current.role);
            const updMember = {
                _id: current._id,
                name,
                email,
                role: current.role,
                trainingGroup,
                date: new Date()
            }
            console.log(updMember)
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

    return (
        <div id='trainingGroup-list-modal' className='modal'>
            <div className="modal-content">
                <h4>Trainingsgruppen</h4>
                <ul className="collection">
                    <Fragment>
                      {trainingGroup && trainingGroup.map(group => (
                        <TrainingGroupItem group={group} key={group._id} onChange={onChange} />
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
