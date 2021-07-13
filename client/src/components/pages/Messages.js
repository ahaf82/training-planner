import React, { useContext, useEffect } from 'react';
import SimpleReactCalendar from 'simple-react-calendar';
import AuthContext from '../../context/auth/authContext';
import MemberContext from '../../context/member/memberContext';
import TrainingGroupContext from '../../context/trainingGroup/trainingGroupContext';
import EmailForm from '../emails/EmailForm';
import PushNote from '../pushNotes/pushNotes';
import PushNoteAd from '../pushNotes/pushNoteAd';
// import request from '../../request';
import Moment from 'react-moment';
import moment from 'moment';
import 'moment/locale/de';
import Email from '../emails/Emails';

Moment.globalLocale = 'de';

const Messages = props => {
    const authContext = useContext(AuthContext);
    const { role } = authContext;

    const memberContext = useContext(MemberContext);
    const { getMembers } = memberContext;

    const trainingGroupContext = useContext(TrainingGroupContext);
    const { getTrainingGroups } = trainingGroupContext;

    useEffect(() => {
        authContext.loadMember();
        getTrainingGroups();
        getMembers();
        // eslint-disable-next-line
    }, []);

    let columns = 0;

    if (role === 'admin' || role === 'superUser') {
        columns = 3;
    }
    if (role === 'member' || role === 'trainer' || role === 'none') {
        columns = 1;
    }

    return (
        <div>
            {(role === 'admin' || role === 'superUser') && 
            <PushNote />}
            {(role === 'admin' || role === 'superUser') && 
            <EmailForm />}
            {(role === 'admin' || role === 'superUser') &&
            <Email /> }
        </div>
    )
}

export default Messages;
