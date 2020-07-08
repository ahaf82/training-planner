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
        columns = 2;
    }

    return (
        <div className={`grid-${columns}`}>
            <div>
                {(role === 'admin' || role === 'superUser') &&
                    <MemberForm />
                }
            </div>
            <div>
                {(role === 'admin' || role === 'superUser') &&
                    <MemberFilter />}
                <Member />
            </div>
        </div>
    )
}

Home.propTypes = {

}

export default Home;
