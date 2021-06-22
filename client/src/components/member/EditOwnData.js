import React, { useState, useContext, useEffect } from 'react';
import AlertContext from '../../context/alert/alertContext';
import MemberContext from '../../context/member/memberContext';
import AuthContext from '../../context/auth/authContext';
import M from 'materialize-css/dist/js/materialize.min.js';

const EditOwnData = () => {
    const alertContext = useContext(AlertContext);
    const { setAlert } = alertContext;

    const authContext = useContext(AuthContext);
    
    const memberContext = useContext(MemberContext);
    const { updateMember } = memberContext;

    const subuser = { name: "" }

    const [member, setMember] = useState({
        name: "",
        email: "",
        role: "",
        trainingGroup: [],
        trainingSessions: [],
        familyMember: []
    });
    
    useEffect(() => {
        setMember(authContext.member);
    }, [authContext.member]);

    useEffect(() => {
        authContext.loadMember();
        // eslint-disable-next-line
    }, []);

    const onChange = e => setMember( authContext.member.familyMember, [ ...authContext.member.familyMember, { name: e.target.value } ] ); 

    const onSubmit = e => {
        e.preventDefault();

        if (member.name == "") return M.toast({ html: 'Bitte gib einen Namen ein...', classes: 'red darken-1', displayLength: 1500 });

        const updMember = {
            _id: authContext.member._id,
            name: authContext.member.name,
            email: authContext.member.email,
            role: authContext.member.role,
            trainingGroup: authContext.member.trainingGroup,
            trainingSessions: authContext.member.trainingSessions,
            familyMember: authContext.member.familyMember.push({ 
                name: subuser.name,
                role: "none"
            }),
            date: new Date()
        }
        
        updateMember(updMember);
    }

    return (
        <div>
            <form onSubmit={onSubmit}>
                <h2 className="text-dark large">Familienmitglied hinzufügen oder löschen</h2>
                <div className='form-group'>
                    <label htmlFor='name'>Name</label>
                    <input type='text' name='subuser.name' value={subuser.name} onChange={onChange} />
                </div>
                <input type="submit" value="Unternutzer hinzufügen" className="btn btn-dark btn-block"/>
                {authContext.member.familyMember !== null && authContext.member.familyMember.map(familyMember => (
                    <li>
                        <div>{familyMember.name}</div>
                    </li>
                ))}
            </form>
        </div>
    )
}

export default EditOwnData;