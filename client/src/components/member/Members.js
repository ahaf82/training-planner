import React, { Fragment, useContext, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import MemberItem from './MemberItem';
import Spinner from '../layout/Spinner';
import AuthContext from '../../context/auth/authContext';
import MemberContext from '../../context/member/memberContext';

const Member = () => {
    const authContext = useContext(AuthContext);
    const { role } = authContext;

    const memberContext = useContext(MemberContext); 
    const { members, filtered, getMembers, loading } = memberContext;

    useEffect(() => {
        getMembers();
        // eslint-disable-next-line
    }, []);
    
    if (members !== null && members.length === 0 && !loading && role === ('admin' || 'superUser')) {
        return <h4>Bitte füge ein Mitglied hinzu:</h4>
    }

    return (
        <Fragment>
            {members !== null && !loading ? (
                <TransitionGroup>
                {filtered !== null 
                ? filtered.map(member => (
                    <CSSTransition key={member._id} timeout={300} classNames="item">
                    <MemberItem member={member} />
                    </CSSTransition>
                )) 
                : members.map(member => (
                    <Fragment>
                        <CSSTransition key={member._id} timeout={300} classNames="item">
                        <MemberItem member={member} />
                        </CSSTransition>
                        {member.familyMember !== null && member.familyMember.map(subuser => (
                            <CSSTransition key={subuser._id} timeout={300} classNames="item">
                            <MemberItem member={subuser} />
                            </CSSTransition>
                        ))}
                    </Fragment>
                ))}
                </TransitionGroup>
                ) : <Spinner />}
        </Fragment>
    )
}

export default Member;