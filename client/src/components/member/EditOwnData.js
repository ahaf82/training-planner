import React, { useState, useContext, useEffect } from 'react';
import AlertContext from '../../context/alert/alertContext';
import MemberContext from '../../context/member/memberContext';
import AuthContext from '../../context/auth/authContext';
import PushNote from '../pushNotes/pushNotes';
import M from 'materialize-css/dist/js/materialize.min.js';

const EditOwnData = () => {
    const alertContext = useContext(AlertContext);
    const { setAlert } = alertContext;

    const authContext = useContext(AuthContext);
    
    const memberContext = useContext(MemberContext);
    const { updateMember } = memberContext;

    const [member, setMember] = useState({
        name: "",
        email: "",
        role: "",
        trainingGroup: [],
        trainingSessions: [],
        familyMember: []
    });

    useEffect(() => {
        authContext.loadMember();
        setMember(authContext.member);
    }, [authContext, authContext.member]);

    const [newMember, setNewMember] = useState('');

    const onChange = e => setNewMember(e.target.value);

    const onSubmit = e => {
        e.preventDefault();

        if (newMember === "") return M.toast({ html: 'Bitte gib einen Namen ein...', classes: 'red darken-1', displayLength: 1500 });

        const updMember = {
            _id: authContext.member._id,
            name: authContext.member.name,
            email: authContext.member.email,
            role: authContext.member.role,
            trainingGroup: authContext.member.trainingGroup,
            trainingSessions: authContext.member.trainingSessions,
            familyMember: [ ...authContext.member.familyMember, { name: newMember, role: "none" } ],
            date: new Date()
        }
        
        updateMember(updMember);
    }

    const deleteSubuser = id => {
        // authContext.member.familyMember = authContext.member.familyMember.filter(subUser => subUser._id !== id);
        // updateMember(authContext.member);

        // setMember({ 
        //     _id: authContext.member._id,
        //     name: authContext.member.name,
        //     email: authContext.member.email,
        //     role: authContext.member.role,
        //     trainingGroup: authContext.member.trainingGroup,
        //     trainingSessions: authContext.member.trainingSessions,
        //     familyMember: authContext.member.familyMember.filter(subUser => subUser._id !== id),
        //     date: new Date()
        // });

        const updMember = { 
            _id: authContext.member._id,
            name: authContext.member.name,
            email: authContext.member.email,
            role: authContext.member.role,
            trainingGroup: authContext.member.trainingGroup,
            trainingSessions: authContext.member.trainingSessions,
            familyMember: authContext.member.familyMember.filter(subUser => subUser._id !== id),
            date: new Date()
        };
        console.log("delmemb", updMember);
        updateMember(updMember);
    }

    return (
        <div>
            <form onSubmit={onSubmit}>
                <h2 className="text-dark large">Familienmitglied hinzufügen oder löschen</h2>
                <div className='form-group'>
                    <label htmlFor='name'>Name</label>
                    <input type='text' name='newMember' value={newMember} onChange={onChange} />
                </div>
                <input type="submit" value="Familienmitglied hinzufügen" className="btn btn-dark btn-block"/>
            </form>
            {member.familyMember !== null && member.familyMember.map(familyMember => (
                <div className="text-dark small my-2">
                    <li class="middle" key={familyMember._id}>
                        {familyMember.name}{"       "}
                        <div class="list-button text-bold">
                            <a href="#!" onClick={() => deleteSubuser(familyMember._id)} className="modal-close btn btn-danger btn-sm btn list-button">Löschen</a>
                        </div>
                    </li>
                </div>
            ))}
            {(authContext.member.role === 'member' || authContext.member.role === 'trainer') && <PushNote /> }       
        </div>
    )
}

export default EditOwnData;