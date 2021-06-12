import React, { useContext, useEffect } from 'react';
import Member from '../member/Members';
import MemberForm from '../member/MemberForm';
import MemberFilter from '../member/MemberFilter';
import AuthContext from '../../context/auth/authContext';

const Home = props => {
    const authContext = useContext(AuthContext);
    const { role } = authContext;

    useEffect(() => {
        authContext.loadMember();
        // eslint-disable-next-line
    }, []);

    let columns = 0;

    if (role === 'admin' || role === 'superUser') {
        columns = 3;
    }

    return (
        <div className={`grid-${columns}`}>
            <div className='fixed'>
                {(role === 'admin' || role === 'superUser') && <MemberForm /> }
                <br/>
                {(role === 'admin' || role === 'superUser') && <MemberFilter /> }
            </div>
            <div className='card-grid-2 card-grid-3'>
                {(role === 'admin' || role === 'superUser') && <Member /> }
            </div>
        </div>
    )
}

export default Home;
