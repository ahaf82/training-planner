import React, { Fragment, useContext, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Moment from 'react-moment';
import 'moment/locale/de';
import TrainingSessionItem from './TrainingSessionItem';
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
    const { trainingSessions, filtered, getTrainingSessions, loading } = trainingSessionContext;

    const memberContext = useContext(MemberContext);
    const { getMembers } = memberContext;

    useEffect(() => {
        getTrainingSessions();
        getMembers();
        // eslint-disable-next-line
    }, []);

    let tGroup = []
    if (trainingSessions && (role === 'admin' || role === 'superUser')) {
        tGroup = trainingSessions.filter(tSession => tSession.date < moment(Date.now()).format('YYYY-MM-DD'));
    }

    // Data for Excel Export
    let exportGroup = [{
        Datum: '',
        Zeit: '',
        Trainingsgruppe: '',
        Teilnehmer: ''
    }];

    if (trainingSessions && (role === 'admin' || role === 'superUser')) {
        exportGroup = trainingSessions.filter(tSession => tSession.date < moment(Date.now()).format('YYYY-MM-DD')).map(function (item) {
            console.log(item.members);
            let exportMembers;
            if (memberContext.members) {
                let exportMembersArray = [...new Set(memberContext.members.filter(element => item.members.includes(element._id)))];
                // console.log(memberContext.members.filter(element => element.members.includes(item.members)));
                exportMembers = exportMembersArray.map(element => element.name).join(', ');
                console.log(exportMembers);
            }
            return {
                Datum: moment(item.date).format('DD.MMMM.YYYY'),
                Zeit: item.time,
                Trainingsgruppe: item.description,
                Teilnehmer: exportMembers
            }
        });
        console.log(exportGroup);
    }

    return (
        <Fragment>
            <ExportCSV csvData={exportGroup} fileName={"Trainingseinheiten-Export"} />
            {tGroup !== null && (role === 'admin' || role === 'superUser') && !loading ? (
                <TransitionGroup>
                    {tGroup.map(session => (
                        <CSSTransition key={session._id} timeout={300} classNames="item">
                            <TrainingSessionItem session={session} />
                        </CSSTransition>
                    ))}
                </TransitionGroup>
            ) : <Spinner />}
        </Fragment>
    )
}

export default OldSessions;