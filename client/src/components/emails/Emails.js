import React, { Fragment, useContext, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import EmailItem from '../emails/EmailItem';
import Spinner from '../layout/Spinner';
import AuthContext from '../../context/auth/authContext';
import EmailContext from '../../context/email/emailContext';

const Email = () => {
    const authContext = useContext(AuthContext);
    const { role } = authContext;

    const emailContext = useContext(EmailContext); 
    const { emails, filtered, getEmails, loading } = emailContext;


    useEffect(() => {
        getEmails();
        // eslint-disable-next-line
    }, []);
    
    if (emails !== null && emails.length === 0 && !loading && role === ('admin' || 'superUser')) {
        console.log("not loading");
        return <h4>Noch keine Mails in der Datenbank:</h4>
    }

    return (
        <Fragment>
            {emails !== null && !loading ? (
                <TransitionGroup>
                {filtered !== null 
                ? filtered.map(email => (
                    <CSSTransition key={email._id} timeout={300} classNames="item">
                    <EmailItem email={email} />
                    </CSSTransition>
                )) 
                : emails.map(email => (
                    <CSSTransition key={email._id} timeout={300} classNames="item">
                    <EmailItem email={email} />
                    </CSSTransition>
                ))}
                </TransitionGroup>
                ) : <Spinner />}
        </Fragment>
    )
}

export default Email;