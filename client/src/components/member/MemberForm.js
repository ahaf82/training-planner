import React, { useState, useContext, useEffect } from 'react'
import AlertContext from '../../context/alert/alertContext';
import MemberContext from '../../context/member/memberContext';

const MemberForm = () => {
    const alertContext = useContext(AlertContext);
    const memberContext = useContext(MemberContext);

    const { setAlert } = alertContext;
    const { addMember, updateMember, clearCurrent, current } = memberContext;

    useEffect(() => {
        if (current !== null) {
            setMember(current);
        } else {
            setMember({
              name: "",
              email: "",
              address: {
                  street: '',
                  postalCode: '',
                  city: '',
              },
              role: ""
            });
        }
    }, [memberContext, current]);

    const [member, setMember] = useState({
        name: "",
        email: "",
        address: {
            street: '',
            postalCode: '',
            city: '',
        },
        role: ""
    });

    const { name, email, address, role } = member;

    const onChange = e => setMember({ ...member, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();
        if (email === '') {
            setAlert('Bitte eine gültige E-Mail Adresse eingeben', 'danger');
        } else if (current === null) {            
            addMember(member);
        } else {
            updateMember(member);
        }
        setMember({
            name: "",
            email: "",
            address: {
                street: '',
                postalCode: '',
                city: '',
            },
            role: ""
        })
    }

    const clearAll = () => {
        clearCurrent();
    }

    return (
        <form onSubmit={onSubmit}>
            <h2 className="text-primary">{current ? 'Mitglied ändern' : 'Mitglied hinzufügen'}</h2>
            <input type="text" placeholder="Name" name="name" value={name} onChange={onChange} />
            <input type="email" placeholder="E-Mail" name="email" value={email} onChange={onChange} />
            {/* <input type="text" placeholder="Straße" name="address.street" value={address.street} onChange={onChange} />
            <input type="number" placeholder="PLZ" name="postalCode" value={address.postalCode} onChange={onChange} />
            <input type="text" placeholder="Stadt" name="city" value={address.city} onChange={onChange} /> */}
            <div>
                <input type="submit" value={current ? 'Mitglied aktualisieren' : 'Mitglied hinzufügen'} className="btn btn-primary btn-block"/>
            </div>
            {current && <div>
                <button className="btn btn-light btn-block" onClick={clearAll}>Löschen</button>
            </div>}
        </form>
    )
}

export default MemberForm;