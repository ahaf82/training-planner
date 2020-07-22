import React, { Fragment, useContext } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Moment from 'react-moment';
import 'moment/locale/de';
import OldSessionItem from './OldSessionItem';
import Spinner from '../layout/Spinner';
import moment from 'moment';
import ExportCSV from './ExportCSV';
import AuthContext from '../../context/auth/authContext';
import TrainingSessionContext from '../../context/trainingSession/trainingSessionContext';
import MemberContext from '../../context/member/memberContext';

Moment.globalLocale = 'de';

const OldSessions = () => {
    const authContext = useContext(AuthContext);
    const { role } = authContext;

    const trainingSessionContext = useContext(TrainingSessionContext);
    const { trainingSessions, getTrainingSessions, loading } = trainingSessionContext;

    const memberContext = useContext(MemberContext);
    const { getMembers } = memberContext;

    const today = moment(Date.now()).format('YYYY-MM-DD');

    let tGroup = []
    if (trainingSessions && (role === 'admin' || role === 'superUser')) {
        tGroup = trainingSessions.filter(tSession => tSession.date < moment(Date.now()).format('YYYY-MM-DD'));
    }

    // Data for Excel Export
    let exportGroup = [{
        Datum: '',
        Zeit: '',
        Trainer: '',
        Trainingseinheit: '',
        Teilnehmer: ''
    }];

    if (trainingSessions && (role === 'admin' || role === 'superUser')) {
        exportGroup = trainingSessions.filter(tSession => tSession.date < moment(Date.now()).format('YYYY-MM-DD')).map(function (item) {
            let exportMembers;
            let train;
            let sessionTime;
            if (memberContext.members) {
                let exportMembersArray = [...new Set(memberContext.members.filter(element => item.members.includes(element._id)))];
                exportMembers = exportMembersArray.map(element => element.name).join(', ');
                let trainArray = memberContext.members.filter(element => element._id === item.trainer);
                if (trainArray[0]) train = trainArray[0].name;
                item.timeTo !== undefined ? sessionTime = item.time + ' - ' + item.timeTo : sessionTime = item.time;
            }
            return {
                Datum: moment(item.date).format('DD.MMMM.YYYY'),
                Zeit: sessionTime,
                Trainingseinheit: item.description,
                Trainer: train,
                Teilnehmer: exportMembers
            }
        });
    }

    return (
        <Fragment>
            <ExportCSV csvData={exportGroup} fileName={`Trainingseinheiten-Export_${today}`} />
            {tGroup !== null && (role === 'admin' || role === 'superUser') && !loading ? (
                <TransitionGroup>
                    {tGroup.map(session => (
                        <CSSTransition key={session._id} timeout={300} classNames="item">
                            <OldSessionItem session={session} />
                        </CSSTransition>
                    ))}
                </TransitionGroup>
            ) : <Spinner />}
        </Fragment>
    )
}

export default OldSessions;