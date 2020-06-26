import React, { useState, useContext, useEffect } from 'react'
import AlertContext from '../../context/alert/alertContext';
import MemberContext from '../../context/member/memberContext';

const MemberForm = () => {
    const alertContext = useContext(AlertContext);
    const { setAlert } = alertContext;
    
    const memberContext = useContext(MemberContext);
    const { updateMember, clearCurrent, current } = memberContext;
    
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
    }, [memberContext, current]);

    const [member, setMember] = useState({
        name: "",
        email: "",
        role: "",
        trainingGroup: [],
        trainingSessions: []
    });

    const { name, email, role, trainingGroup } = member;

    const onChange = e => setMember({ ...member, [e.target.name]: e.target.value });

    const [checked, setChecked] = useState(false);

    const onSubmit = e => {
        e.preventDefault();
        if (email === '') {
            setAlert('Bitte eine gültige E-Mail Adresse eingeben', 'danger');
        } else {
            checked === true ? current.role = "member" : current.role = "none";
            console.log(current.trainingGroup);
            const updMember = {
                _id: current._id,
                name,
                email,
                role: current.role,
                trainingGroup: current.trainingGroup,
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

    const clearAll = () => {
        clearCurrent();
    }

    return (
        <form onSubmit={onSubmit}>
            <h2 className="text-primary large">Mitglied ändern</h2>
            <h2 className="text-primary large">{name}</h2>
            <div class="switch">
                Berechtigung:   
                <label>
                    keine
                    <input type="checkbox" name="role" value={checked} onClick={() => setChecked(!checked)} />
                    <span class="lever"></span>
                    Mitglied
                </label>
            </div>
            <br/>
            <div>
                <a href="#trainingGroup-list-modal" className="btn btn-primary btn-block modal-trigger">
                    Trainingsgruppen
                </a>
            </div>
             <div>
                <input type="submit" value={'Mitglied aktualisieren'} className="btn btn-primary btn-block"/>
            </div>
            {current && <div>
                <button className="btn btn-light btn-block" onClick={clearAll}>Löschen</button>
            </div>}
        </form>
    )
}

export default MemberForm;