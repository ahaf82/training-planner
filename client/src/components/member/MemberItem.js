import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import MemberContext from '../../context/member/memberContext';

const MemberItem = ({ member }) => {
    const memberContext = useContext(MemberContext);
    const { deleteMember, setCurrent, clearCurrent } = memberContext;

    const { _id, name, address, email, role } = member;


    const onDelete = () => {
        deleteMember(_id);
        clearCurrent();
    }

    return (
        <div className='card bg-light'>
            <h3 className="text-primary text-left large">
                {name}{' '} 
            </h3>
            <ul className="list">
                {email && <li>
                    <i className="fas fa-envelope-open"></i> E-Mail Adresse: {email}
                </li>}
                {address && address.street && <li>
                    <i className="fas fa-envelope-open"></i> Straße: {address.street}
                </li>}
                {address && address.postalCode && <li>
                    <i className="fas fa-envelope-open"></i> PLZ: {address.postalCode}
                </li>}
                {address && address.city && <li>
                    <i className="fas fa-envelope-open"></i> Stadt: {address.city}
                </li>}
                {role && <li>
                    <i className="fas fa-envelope-open"></i> Berechtigung: {role}
                </li>}
            </ul>
            <p> 
                {//<button className="btn btn-dark btn-sm" onClick={() => setCurrent(member)}>Ändern</button>
                }
                <button className="btn btn-danger btn-sm" onClick={onDelete}>Löschen</button>
            </p>
        </div>
    )
}

MemberItem.propTypes = {
    members: PropTypes.object.isRequired
}

export default MemberItem;