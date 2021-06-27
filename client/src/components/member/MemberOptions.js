import React, { useEffect, useContext } from 'react';
import MemberContext from '../../context/member/memberContext';
import AuthContext from '../../context/auth/authContext';
import { authenticate } from 'passport';

const MemberOptions = () => {
    const authContext = useContext(AuthContext);
    const { member } = authContext;

    const memberContext = useContext(MemberContext);
    const { members, loading } = memberContext;
    
    useEffect(() => {
        authContext.loadMember();
        // eslint-disable-next-line
    }, []);

    console.log("member", member);
    let users = member.familyMember.concat(member);

    return (
        !loading && members !== null && users.map(item => <option key={item._id} value={item} >
            {item.name}
        </option>)
    )
}

export default MemberOptions;
