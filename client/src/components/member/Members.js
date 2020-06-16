import React, { Fragment, useContext, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import MemberItem from './MemberItem';
import Spinner from '../layout/Spinner'
import MemberContext from '../../context/member/memberContext';

const Member = () => {
    const memberContext = useContext(MemberContext);
    
    const { members, filtered, getMembers, loading } = memberContext;

    useEffect(() => {
        getMembers();
        // eslint-disable-next-line
    }, []);
    console.log(members);
    
    if (members !== null && members.length === 0 && !loading) {
        return <h4>Bitte füge ein Mitglied hinzu:</h4>
    }

    return (
        <Fragment>
            {members !== null && !loading ? (
                <TransitionGroup>
                {filtered !== null 
                ? filtered.map(member => (
                    <CSSTransition key={member._id} timeout={500} classNames="item">
                    <MemberItem member={member} />
                    </CSSTransition>
                )) 
                : members.map(member => (
                    <CSSTransition key={member._id} timeout={500} classNames="item">
                    <MemberItem member={member} />
                    </CSSTransition>
                ))}
                </TransitionGroup>
                ) : <Spinner />}
        </Fragment>
    )
}

export default Member;